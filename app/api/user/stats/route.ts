import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Count events joined (from event_attendance or similar)
    const { count: eventsJoined } = await supabase
      .from("event_attendance")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Count study groups (buddy groups)
    const { count: studyGroups } = await supabase
      .from("buddy_group_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Count messages sent
    const { count: messages } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("sender_id", user.id)

    // Count badges earned
    const { count: badges } = await supabase
      .from("user_badges")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Count buddy groups created
    const { count: buddyGroupsCreated } = await supabase
      .from("buddy_groups")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", user.id)

    // Count bookmarks
    const { count: bookmarks } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get loneliness assessment
    const { data: lonelinessAssessment } = await supabase
      .from("loneliness_assessments")
      .select("loneliness_score, loneliness_category")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // Calculate progress percentage (simple calculation based on activities)
    const totalActivities = (eventsJoined || 0) + (studyGroups || 0) + (messages || 0) + (badges || 0)
    const progressPercentage = Math.min(100, Math.round((totalActivities / 20) * 100))

    // Calculate total engagement
    const totalEngagement = totalActivities

    // Check if survey is completed
    const { data: leisureAssessment } = await supabase
      .from("leisure_assessments")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single()

    const surveyCompleted = !!leisureAssessment && !!lonelinessAssessment

    return NextResponse.json({
      eventsJoined: eventsJoined || 0,
      studyGroups: studyGroups || 0,
      messages: messages || 0,
      badges: badges || 0,
      buddyGroupsCreated: buddyGroupsCreated || 0,
      bookmarks: bookmarks || 0,
      videoViews: 0, // TODO: Implement video views tracking
      totalConnections: studyGroups || 0,
      totalEngagement,
      progressPercentage,
      lonelinessScore: lonelinessAssessment?.loneliness_score || 0,
      lonelinessCategory: lonelinessAssessment?.loneliness_category || "Unknown",
      surveyCompleted,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user stats",
        details: error.message,
      },
      { status: 500 }
    )
  }
}

