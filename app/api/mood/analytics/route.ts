import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get mood entries for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: moodEntries, error } = await supabase
      .from("mood_entries")
      .select("mood, created_at")
      .eq("user_id", user.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true })

    if (error) throw error

    // Calculate statistics
    const moods = (moodEntries || []).map((entry) => entry.mood)
    const average = moods.length > 0 ? Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10 : 0

    const highest = moods.length > 0 ? Math.max(...moods) : 0
    const lowest = moods.length > 0 ? Math.min(...moods) : 0

    // Group by date
    const byDate: { [key: string]: number[] } = {}
    ;(moodEntries || []).forEach((entry) => {
      const date = new Date(entry.created_at).toISOString().split("T")[0]
      if (!byDate[date]) byDate[date] = []
      byDate[date].push(entry.mood)
    })

    // Average per day
    const dailyAverages = Object.entries(byDate).map(([date, moods]) => ({
      date,
      average: Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10,
    }))

    return NextResponse.json({
      analytics: {
        average,
        highest,
        lowest,
        totalEntries: moods.length,
        dailyAverages,
      },
    })
  } catch (error: unknown) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
