"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MapPin, ExternalLink, CheckCircle, Users, Clock, Bookmark, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Event {
  id: string
  title: string
  description: string | null
  event_url: string | null
  event_date: string | null
  location: string | null
  created_at: string
}

interface EventWithAttendance extends Event {
  isAttending: boolean
  attendeeCount: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithAttendance[]>([])
  const [userEventCount, setUserEventCount] = useState(0)
  const [shouldRetakeSurvey, setShouldRetakeSurvey] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get all events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("event_date", { ascending: true })

      if (eventsError) throw eventsError

      // Get user's attendance
      const { data: attendanceData } = await supabase
        .from("event_attendance")
        .select("event_id")
        .eq("user_id", user.id)

      const attendedEventIds = new Set(attendanceData?.map((a) => a.event_id) || [])
      setUserEventCount(attendedEventIds.size)

      // Get attendance counts for all events
      const { data: allAttendance } = await supabase.from("event_attendance").select("event_id")

      const attendanceCounts = allAttendance?.reduce(
        (acc, a) => {
          acc[a.event_id] = (acc[a.event_id] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      // Combine data
      const eventsWithAttendance = (eventsData || []).map((event) => ({
        ...event,
        isAttending: attendedEventIds.has(event.id),
        attendeeCount: attendanceCounts?.[event.id] || 0,
      }))

      setEvents(eventsWithAttendance)

      // Check if should retake survey (20 events threshold)
      if (attendedEventIds.size >= 20 && attendedEventIds.size % 20 === 0) {
        setShouldRetakeSurvey(true)
      }
    } catch (error) {
      console.error("Error loading events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAttendance = async (eventId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const event = events.find((e) => e.id === eventId)
      if (!event) return

      if (event.isAttending) {
        // Remove attendance
        await supabase.from("event_attendance").delete().eq("event_id", eventId).eq("user_id", user.id)
      } else {
        // Add attendance
        await supabase.from("event_attendance").insert({
          event_id: eventId,
          user_id: user.id,
        })
      }

      // Reload events
      await loadEvents()
    } catch (error) {
      console.error("Error toggling attendance:", error)
    }
  }

  const googleUrl = (e: Event) => {
    if (!e.event_date) return "#"
    const start = new Date(e.event_date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const end = new Date(e.event_date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: e.title,
      details: e.description || "",
      location: e.location || "",
      dates: `${start}/${end}`,
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 font-grotesk mb-2">
          Personalized Events for You! 🎉
        </h1>
        <p className="text-neutral-600 font-poppins">
          Events curated based on your interests and social preferences
        </p>
      </div>

      {/* Survey Re-trigger Alert */}
      {shouldRetakeSurvey && (
        <Alert className="mb-6 border-primary/20 bg-primary/5">
          <CheckCircle className="h-4 w-4 text-primary" />
          <AlertTitle className="font-grotesk">Time to Update Your Profile!</AlertTitle>
          <AlertDescription className="font-poppins">
            You've attended {userEventCount} events! Take the surveys again to update your buddy matches and guidance.
            <div className="mt-3">
              <Button asChild variant="default" size="sm" className="font-poppins">
                <Link href="/onboarding/loneliness">Retake Surveys</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Event Stats */}
      <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary mb-1 font-poppins font-medium">Events You've Attended</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary font-grotesk">{userEventCount}</p>
                <p className="text-sm text-primary font-poppins">/ {events.length} total events</p>
              </div>
              {userEventCount < 20 && (
                <p className="text-xs text-primary mt-1 font-poppins">
                  {20 - userEventCount} more events until survey update
                </p>
              )}
            </div>
            <Calendar className="h-10 w-10 text-primary" />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground font-poppins">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventDate = event.event_date ? new Date(event.event_date) : null
            const isPast = eventDate && eventDate < new Date()

            return (
              <Card
                key={event.id}
                className={`border-2 border-neutral-200 bg-white/90 backdrop-blur-sm rounded-2xl hover:border-primary/30 transition-colors ${
                  isPast ? "opacity-60" : ""
                }`}
              >
                <Link href={`/dashboard/events/${event.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg font-grotesk font-semibold">{event.title}</CardTitle>
                      {event.isAttending && (
                        <Badge className="bg-primary text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Attending
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-neutral-600 font-poppins text-sm">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                </Link>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {eventDate && (
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <Clock className="w-4 h-4" />
                        {eventDate.toLocaleDateString()}
                        {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-neutral-700">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                      <Users className="w-4 h-4" />
                      {event.attendeeCount} {event.attendeeCount === 1 ? "person" : "people"} attending
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={event.isAttending ? "outline" : "default"}
                      onClick={(e) => {
                        e.preventDefault()
                        toggleAttendance(event.id)
                      }}
                      className="flex-1 font-poppins"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {event.isAttending ? "Remove" : "Attend"}
                    </Button>
                    {event.event_url && (
                      <>
                        <Button
                          variant="outline"
                          asChild
                          size="sm"
                          className="font-poppins"
                        >
                          <a href={googleUrl(event)} target="_blank" rel="noopener noreferrer">
                            <Calendar className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            navigator.share?.({ title: event.title, text: event.description || "", url: event.event_url || "" })
                          }}
                          className="font-poppins"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-poppins">No events available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2 font-poppins">Check back soon for upcoming activities!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
