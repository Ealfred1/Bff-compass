import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface LeisureCategory {
  [key: string]: number
}

// Calculate compatibility score between two users
function calculateCompatibility(user1Leisure: LeisureCategory, user2Leisure: LeisureCategory): number {
  const categories = ["A", "B", "C", "D", "E", "F", "G"]
  let score = 0

  // Check how many shared top interests they have
  const user1Top = categories.sort((a, b) => (user2Leisure[b] || 0) - (user2Leisure[a] || 0)).slice(0, 3)
  const user2Top = categories.sort((a, b) => (user2Leisure[b] || 0) - (user2Leisure[a] || 0)).slice(0, 3)

  user1Top.forEach((cat) => {
    if (user2Top.includes(cat)) score += 25
  })

  return Math.min(score + 25, 100) // Base score of 25 + compatibility bonus
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user's leisure profile
    const { data: userLeisure } = await supabase
      .from("leisure_assessments")
      .select("combined_scores")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!userLeisure) {
      return NextResponse.json({ error: "User assessment not found" }, { status: 400 })
    }

    // Get all users except current user and those already connected
    const { data: existingConnections } = await supabase
      .from("connections")
      .select("user1_id, user2_id")
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

    const connectedUserIds = new Set<string>()
    if (existingConnections) {
      existingConnections.forEach((conn) => {
        if (conn.user1_id === user.id) connectedUserIds.add(conn.user2_id)
        if (conn.user2_id === user.id) connectedUserIds.add(conn.user1_id)
      })
    }
    connectedUserIds.add(user.id)

    // Get candidate profiles with their leisure assessments
    const { data: candidates } = await supabase
      .from("profiles")
      .select("id, display_name, bio, username")
      .not("id", "in", `(${Array.from(connectedUserIds).join(",")})`)

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ candidates: [] })
    }

    // Get leisure assessments for all candidates
    const { data: candidateLeisure } = await supabase
      .from("leisure_assessments")
      .select("user_id, combined_scores")
      .in(
        "user_id",
        candidates.map((c) => c.id),
      )

    // Combine and calculate scores
    const enrichedCandidates = candidates
      .map((candidate) => {
        const leisure = candidateLeisure?.find((l) => l.user_id === candidate.id)
        const compatibilityScore = leisure
          ? calculateCompatibility(
              userLeisure.combined_scores as LeisureCategory,
              leisure.combined_scores as LeisureCategory,
            )
          : 50

        return {
          ...candidate,
          compatibilityScore,
        }
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

    return NextResponse.json({ candidates: enrichedCandidates.slice(0, 20) })
  } catch (error: unknown) {
    console.error("Matching error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
