"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Calendar, MapPin, ExternalLink, CheckCircle, Users, Clock } from "lucide-react"
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
        {} as Record<string, number>
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

  const copyEventLink = (eventUrl: string) => {
    navigator.clipboard.writeText(eventUrl)
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-poppins">Events & Activities</h1>
            <p className="text-sm text-muted-foreground font-poppins">
              Connect in person and earn achievements
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent font-poppins">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Survey Re-trigger Alert */}
          {shouldRetakeSurvey && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="font-poppins">Time to Update Your Profile!</AlertTitle>
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
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Events You've Attended</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary font-poppins">{userEventCount}</p>
                    <p className="text-sm text-muted-foreground font-poppins">/ {events.length} total events</p>
                  </div>
                  {userEventCount < 20 && (
                    <p className="text-xs text-muted-foreground mt-1 font-poppins">
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
            <div className="space-y-4">
              {events.map((event) => {
                const eventDate = event.event_date ? new Date(event.event_date) : null
                const isPast = eventDate && eventDate < new Date()

                return (
                  <Card key={event.id} className={`border-border ${isPast ? "opacity-60" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl font-poppins">{event.title}</CardTitle>
                            {event.isAttending && (
                              <Badge variant="default" className="gap-1 font-poppins">
                                <CheckCircle className="h-3 w-3" />
                                Attending
                              </Badge>
                            )}
                            {isPast && <Badge variant="secondary" className="font-poppins">Past Event</Badge>}
                          </div>
                          {event.description && (
                            <CardDescription className="font-poppins">{event.description}</CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {eventDate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="font-poppins">
                              {eventDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        {eventDate && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="font-poppins">
                              {eventDate.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="font-poppins">{event.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span className="font-poppins">
                            {event.attendeeCount} {event.attendeeCount === 1 ? "person" : "people"} attending
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => toggleAttendance(event.id)}
                          variant={event.isAttending ? "outline" : "default"}
                          className="font-poppins"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {event.isAttending ? "Remove Attendance" : "Mark as Attending"}
                        </Button>

                        {event.event_url && (
                          <>
                            <Button
                              asChild
                              variant="outline"
                              className="font-poppins"
                            >
                              <a href={event.event_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Event Link
                              </a>
                            </Button>
                            <Button
                              onClick={() => copyEventLink(event.event_url!)}
                              variant="ghost"
                              size="sm"
                              className="font-poppins"
                            >
                              Copy Link
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
      </section>
    </main>
  )
}

