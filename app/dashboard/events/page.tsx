"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, MapPin, ExternalLink, CheckCircle, Users, Clock, Share2 } from "lucide-react"
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
  const { user } = useAuth()
  const [events, setEvents] = useState<EventWithAttendance[]>([])
  const [userEventCount, setUserEventCount] = useState(0)
  const [shouldRetakeSurvey, setShouldRetakeSurvey] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadEvents()
    }
  }, [user])

  const loadEvents = async () => {
    setIsLoading(true)
    try {
      if (!user) return

      console.log('🔄 Loading events from database...')

      // Get all events from database
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("event_date", { ascending: true })

      if (eventsError) {
        console.error('❌ Error loading events:', eventsError)
        throw eventsError
      }

      console.log(`✅ Loaded ${eventsData?.length || 0} events from database`)

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
      console.log(`✅ Processed ${eventsWithAttendance.length} events with attendance data`)

      // Check if should retake survey (20 events threshold)
      if (attendedEventIds.size >= 20 && attendedEventIds.size % 20 === 0) {
        setShouldRetakeSurvey(true)
      }
    } catch (error) {
      console.error("❌ Error loading events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAttendance = async (eventId: string) => {
    try {
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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/istockphoto-2105100634-612x612 (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* White overlay for glass effect */}
      <div className="absolute inset-0 bg-white/90"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      {/* Content */}
      <div className="relative z-10 lg:ml-64 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 font-grotesk mb-2">
              Personalized Events for You! 🎉
            </h1>
            <p className="text-xl text-neutral-600 font-poppins">
              Events curated based on your interests and social preferences
            </p>
          </div>

          {/* Survey Re-trigger Alert */}
          {shouldRetakeSurvey && (
            <Alert className="mb-6 border-primary/30 bg-primary/10 shadow-lg">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="font-grotesk">Time to Update Your Profile!</AlertTitle>
              <AlertDescription className="font-poppins">
                You've attended {userEventCount} events! Take the surveys again to update your buddy matches and guidance.
                <div className="mt-3">
                  <Button asChild variant="default" size="sm" className="font-poppins shadow-md">
                    <Link href="/onboarding/loneliness">Retake Surveys</Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Event Stats */}
          <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg">
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
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg"></div>
              <p className="mt-4 text-neutral-600 font-poppins">Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const eventDate = event.event_date ? new Date(event.event_date) : null
                const isPast = eventDate && eventDate < new Date()

                return (
                  <Card
                    key={event.id}
                    className={`border-2 border-primary/20 bg-white/90 backdrop-blur-sm rounded-2xl hover:border-primary/40 transition-all shadow-lg hover:shadow-xl ${
                      isPast ? "opacity-60" : ""
                    }`}
                  >
                    <Link href={`/dashboard/events/${event.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg font-grotesk font-semibold">{event.title}</CardTitle>
                          {event.isAttending && (
                            <Badge className="bg-primary text-white shadow-md">
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
                            <Clock className="w-4 h-4 text-primary" />
                            {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-neutral-700">
                            <MapPin className="w-4 h-4 text-primary" />
                            {event.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                          <Users className="w-4 h-4 text-primary" />
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
                          className={`flex-1 font-poppins shadow-md hover:shadow-lg ${
                            event.isAttending 
                              ? "border-primary/30 hover:bg-primary/5" 
                              : "bg-primary hover:bg-primary/90 text-white"
                          }`}
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
                              className="font-poppins border-primary/30 hover:bg-primary/5 shadow-sm hover:shadow-md"
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
                              className="font-poppins border-primary/30 hover:bg-primary/5 shadow-sm hover:shadow-md"
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
            <Card className="border-primary/20 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-neutral-600 font-poppins">No events available at the moment.</p>
                <p className="text-sm text-neutral-500 mt-2 font-poppins">Check back soon for upcoming activities!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
