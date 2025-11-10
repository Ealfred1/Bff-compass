import { NextResponse } from "next/server"
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("id,title,description,event_date,location,is_active")
      .eq("is_active", true)
      .order("event_date", { ascending: true })
      .limit(5)

    if (eventsError) {
      console.error("[top-events] Error loading events:", eventsError)
      return NextResponse.json({ error: "Failed to load events" }, { status: 500 })
    }

    if (!eventsData || eventsData.length === 0) {
      return NextResponse.json({ events: [] })
    }

    const eventIds = eventsData.map((event) => event.id)

    const { data: attendanceRows, error: attendanceError } = await supabase
      .from("event_attendance")
      .select("event_id,user_id")
      .in("event_id", eventIds)

    if (attendanceError) {
      console.error("[top-events] Error loading attendance:", attendanceError)
      return NextResponse.json({ error: "Failed to load event attendance" }, { status: 500 })
    }

    const attendanceCounts: Record<string, number> = {}
    const userAttendanceIds = new Set<string>()

    attendanceRows?.forEach((row) => {
      attendanceCounts[row.event_id] = (attendanceCounts[row.event_id] || 0) + 1
      if (row.user_id === user?.id) {
        userAttendanceIds.add(row.event_id)
      }
    })

    const events = eventsData.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      attendeeCount: attendanceCounts[event.id] ?? 0,
      isAttending: userAttendanceIds.has(event.id),
    }))

    return NextResponse.json({ events })
  } catch (error) {
    console.error("[top-events] Unexpected error:", error)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

