import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Bookmark,
  Sparkles,
} from "lucide-react"

const formatDateTime = (isoDate?: string | null) => {
  if (!isoDate) return { date: "Date TBA", time: "Time TBA" }
  const date = new Date(isoDate)

  return {
    date: date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

const formatRelative = (isoDate?: string | null) => {
  if (!isoDate) return ""
  const date = new Date(isoDate).getTime()
  const diffMs = date - Date.now()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays > 0) {
    return `Starts in ${diffDays} day${diffDays === 1 ? "" : "s"}`
  }
  if (diffDays === 0) {
    return "Starts today"
  }
  const absDays = Math.abs(diffDays)
  return `Happened ${absDays} day${absDays === 1 ? "" : "s"} ago`
}

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const [
    {
      data: { user },
    },
    { data: event, error: eventError },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("events")
      .select(
        "id,title,description,event_date,location,event_url,is_active,created_at,cover_image,category,host,capacity",
      )
      .eq("id", params.id)
      .single(),
  ])

  if (eventError) {
    if ("code" in eventError && eventError.code === "PGRST116") {
      notFound()
    }
    throw eventError
  }

  if (!event || event.is_active === false) {
    notFound()
  }

  const { data: attendeesData } = await supabase
    .from("event_attendance")
    .select("event_id, user_id, profiles ( id, display_name, avatar_url )")
    .eq("event_id", event.id)

  const attendees =
    attendeesData
      ?.map((row) => row.profiles)
      .filter((profile): profile is { id: string; display_name: string; avatar_url: string | null } => !!profile) || []

  const attendeeCount = attendees.length
  const isAttending = attendees.some((profile) => profile.id === user?.id)

  const { date, time } = formatDateTime(event.event_date)
  const relative = formatRelative(event.event_date)

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#F9FAFB]"
      style={{
        backgroundImage: "url('/istockphoto-2105100634-612x612 (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[#F9FAFB]/94 backdrop-blur-sm"></div>
      <div className="absolute top-16 -left-24 w-80 h-80 bg-[#0D9488]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#0F766E]/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 lg:ml-64 px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="outline" asChild className="rounded-full px-5 py-2 text-sm font-semibold">
              <Link href="/dashboard/events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              {event.category && (
                <Badge className="bg-[#0D9488] text-white border-0 shadow-sm rounded-full px-3 py-1 text-xs">
                  {event.category}
                </Badge>
              )}
              <Button variant="outline" size="sm" className="rounded-full px-4 py-2">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="rounded-full px-4 py-2">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <Card className="bg-white/85 border border-white/60 shadow-[0_25px_50px_rgba(13,148,136,0.12)] rounded-3xl overflow-hidden">
            {event.cover_image && (
              <div className="h-60 w-full overflow-hidden">
                <img
                  src={event.cover_image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <CardHeader className="space-y-3">
              <Badge className="w-fit bg-[rgba(13,148,136,0.1)] text-[#0D9488] border-0 rounded-full px-3 py-1 text-xs font-medium">
                {relative || "Upcoming Event"}
              </Badge>
              <CardTitle className="text-3xl font-grotesk text-[#0B1F1A] leading-tight">{event.title}</CardTitle>
              {event.host && (
                <p className="text-sm text-[#0D9488] font-medium">
                  Hosted by {event.host}
                </p>
              )}
            </CardHeader>

            <CardContent className="grid lg:grid-cols-[2fr,1fr] gap-6 pb-8">
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-[#0D9488]/15 bg-white/70 p-4 shadow-sm">
                    <div className="mt-1 rounded-xl bg-[rgba(13,148,136,0.1)] p-2 text-[#0D9488]">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#0D9488]/80 font-semibold">Date</p>
                      <p className="text-sm font-medium text-[#111827]">{date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-[#0D9488]/15 bg-white/70 p-4 shadow-sm">
                    <div className="mt-1 rounded-xl bg-[rgba(13,148,136,0.1)] p-2 text-[#0D9488]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#0D9488]/80 font-semibold">Time</p>
                      <p className="text-sm font-medium text-[#111827]">{time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-[#0D9488]/15 bg-white/70 p-4 shadow-sm sm:col-span-2">
                    <div className="mt-1 rounded-xl bg-[rgba(249,115,22,0.1)] p-2 text-[#F97316]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#0D9488]/80 font-semibold">Location</p>
                      <p className="text-sm font-medium text-[#111827]">
                        {event.location || "Location will be announced soon"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#0D9488]/15 bg-white/80 p-6 shadow-sm space-y-4">
                  <h2 className="text-lg font-semibold text-[#0B1F1A] font-grotesk flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#0D9488]" />
                    Event Overview
                  </h2>
                  <p className="text-sm leading-relaxed text-[#374151] whitespace-pre-line font-poppins">
                    {event.description || "Details will be shared soon. Stay tuned!"}
                  </p>
                  {event.event_url && (
                    <Button
                      asChild
                      className="rounded-full px-5 py-2 h-auto w-fit bg-[#0D9488] hover:bg-[#0F766E]"
                    >
                      <Link href={event.event_url} target="_blank" rel="noopener noreferrer">
                        View Event Website
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Card className="border border-[#0D9488]/15 bg-white/90 shadow-sm rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-[#0B1F1A] flex items-center gap-2 font-grotesk">
                      <Users className="w-4 h-4 text-[#0D9488]" />
                      Attendees
                    </CardTitle>
                    <p className="text-xs text-[#4B5563] font-poppins">
                      {attendeeCount} attendee{attendeeCount === 1 ? "" : "s"} registered
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {attendees.length > 0 ? (
                      attendees.slice(0, 5).map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center gap-3 rounded-xl border border-[#0D9488]/10 bg-white/80 px-3 py-2 shadow-[0_6px_16px_rgba(13,148,136,0.08)]"
                        >
                          <Avatar className="w-9 h-9 border border-white shadow-sm">
                            {profile.avatar_url ? (
                              <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                            ) : (
                              <AvatarFallback className="bg-linear-to-br from-[#0D9488]/15 to-[#0F766E]/25 text-[#0D9488] font-semibold">
                                {profile.display_name?.[0] || "A"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-[#0B1F1A]">{profile.display_name}</p>
                            <p className="text-xs text-[#4B5563]">Group member</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#4B5563]">Be the first to join this event!</p>
                    )}
                    {attendees.length > 5 && (
                      <p className="text-xs text-[#4B5563]">
                        +{attendees.length - 5} more attending
                      </p>
                    )}

                    <Button
                      variant={isAttending ? "outline" : "default"}
                      className="w-full rounded-full mt-4"
                    >
                      {isAttending ? "You’re attending" : "Attend this event"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-[#0D9488]/15 bg-white/90 shadow-sm rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-[#0B1F1A] font-grotesk">
                      Event Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-[#374151] font-poppins">
                    <div className="flex items-center justify-between">
                      <span>Capacity</span>
                      <span className="font-semibold text-[#0B1F1A]">
                        {event.capacity ? `${attendeeCount}/${event.capacity}` : `${attendeeCount} attending`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <Badge className="bg-[#0D9488]/10 text-[#0D9488] border-0 px-3 py-0.5 rounded-full">
                        {event.is_active ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Created</span>
                      <span>{new Date(event.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

