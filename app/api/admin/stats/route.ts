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

    // Check if user is admin (can be extended with proper admin role system)
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get user count
    const { data: users } = await supabase.from("profiles").select("id")

    // Get connection count
    const { data: connections } = await supabase.from("connections").select("id")

    // Get message count
    const { data: messages } = await supabase.from("messages").select("id")

    // Get average loneliness score
    const { data: loneliness } = await supabase.from("loneliness_assessments").select("total_score")

    const avgLoneliness =
      loneliness && loneliness.length > 0
        ? Math.round((loneliness.reduce((sum, l) => sum + l.total_score, 0) / loneliness.length) * 10) / 10
        : 0

    // Get common leisure interests
    const { data: leisure } = await supabase.from("leisure_assessments").select("top_categories")

    const categoryCount: { [key: string]: number } = {}
    ;(leisure || []).forEach((l) => {
      ;(l.top_categories || []).forEach((cat) => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1
      })
    })

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        totalUsers: users?.length || 0,
        totalConnections: connections?.length || 0,
        totalMessages: messages?.length || 0,
        averageLoneliness: avgLoneliness,
        topCategories,
      },
    })
  } catch (error: unknown) {
    console.error("Stats error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
