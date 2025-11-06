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

    // Get current user's assessments
    const { data: lonelinessData } = await supabase
      .from("loneliness_assessments")
      .select("loneliness_category, total_score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data: leisureData } = await supabase
      .from("leisure_assessments")
      .select("top_categories, combined_scores")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    // Get user's current buddy group members (to exclude them)
    const { data: userGroup } = await supabase
      .from("buddy_group_members")
      .select("group_id")
      .eq("user_id", user.id)
      .maybeSingle()

    let excludeUserIds: string[] = [user.id]
    if (userGroup) {
      const { data: groupMembers } = await supabase
        .from("buddy_group_members")
        .select("user_id")
        .eq("group_id", userGroup.group_id)

      if (groupMembers) {
        excludeUserIds = [...excludeUserIds, ...groupMembers.map((m) => m.user_id)]
      }
    }

    // Get all users (excluding current user and group members)
    // Fetch more than needed, then filter in code
    const { data: allProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, username, bio, avatar_url")
      .limit(100)

    if (profilesError || !allProfiles) {
      return NextResponse.json({ users: [] })
    }

    // Filter out excluded users
    const filteredProfiles = allProfiles.filter((profile) => !excludeUserIds.includes(profile.id))

    if (filteredProfiles.length === 0) {
      return NextResponse.json({ users: [] })
    }

    // Get assessments for all candidates
    const candidateIds = filteredProfiles.map((p) => p.id)
    const { data: lonelinessAssessments } = await supabase
      .from("loneliness_assessments")
      .select("user_id, loneliness_category, total_score")
      .in("user_id", candidateIds)
      .order("created_at", { ascending: false })

    const { data: leisureAssessments } = await supabase
      .from("leisure_assessments")
      .select("user_id, top_categories, combined_scores")
      .in("user_id", candidateIds)
      .order("created_at", { ascending: false })

    // Group assessments by user_id (get most recent)
    const lonelinessMap = new Map<string, any>()
    const leisureMap = new Map<string, any>()

    lonelinessAssessments?.forEach((assess) => {
      if (!lonelinessMap.has(assess.user_id)) {
        lonelinessMap.set(assess.user_id, assess)
      }
    })

    leisureAssessments?.forEach((assess) => {
      if (!leisureMap.has(assess.user_id)) {
        leisureMap.set(assess.user_id, assess)
      }
    })

    // Calculate compatibility scores
    const usersWithScores = filteredProfiles.map((profile) => {
      let score = 0
      const candidateLoneliness = lonelinessMap.get(profile.id)
      const candidateLeisure = leisureMap.get(profile.id)

      // Loneliness category match (40 points)
      if (lonelinessData?.loneliness_category && candidateLoneliness?.loneliness_category) {
        if (candidateLoneliness.loneliness_category === lonelinessData.loneliness_category) {
          score += 40
        } else {
          // Adjacent categories get partial points
          const categories = ["Low", "Moderate", "Moderately High", "High"]
          const userIndex = categories.indexOf(lonelinessData.loneliness_category)
          const candidateIndex = categories.indexOf(candidateLoneliness.loneliness_category)
          if (Math.abs(userIndex - candidateIndex) === 1) score += 20
          else if (Math.abs(userIndex - candidateIndex) === 2) score += 10
        }
      }

      // Leisure interest overlap (60 points)
      if (leisureData?.top_categories && candidateLeisure?.top_categories) {
        const userCategories = leisureData.top_categories
        const candidateCategories = candidateLeisure.top_categories
        const overlap = userCategories.filter((cat: string) => candidateCategories.includes(cat)).length
        if (overlap > 0) {
          score += (overlap / Math.max(userCategories.length, candidateCategories.length, 1)) * 60
        }
      }

      return {
        ...profile,
        compatibility_score: Math.round(score),
        loneliness_category: candidateLoneliness?.loneliness_category,
        leisure_categories: candidateLeisure?.top_categories || [],
      }
    })

    // Sort by compatibility score (highest first) and limit to top 20
    usersWithScores.sort((a, b) => b.compatibility_score - a.compatibility_score)
    const topUsers = usersWithScores.slice(0, 20)

    return NextResponse.json({ users: topUsers })
  } catch (error: unknown) {
    console.error("Get similar users error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

