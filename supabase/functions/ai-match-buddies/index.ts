// Supabase Edge Function for AI Buddy Matching
// Deploy this function to Supabase to enable intelligent group matching

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface MatchingProfile {
  user_id: string
  loneliness_category: string
  loneliness_score: number
  leisure_categories: string[]
  leisure_scores: Record<string, number>
  recent_mood_avg: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      throw new Error("No authorization header")
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    if (userError || !user) throw new Error("User not authenticated")

    // Get user's profile
    const userProfile = await getUserProfile(supabaseClient, user.id)

    // Find potential matches
    const candidates = await findMatchingCandidates(supabaseClient, userProfile)

    // Calculate match scores using AI/ML logic
    const rankedCandidates = rankCandidates(userProfile, candidates)

    // Find or create optimal group
    const group = await findOrCreateGroup(supabaseClient, user.id, userProfile, rankedCandidates)

    return new Response(JSON.stringify({ success: true, group, matches: rankedCandidates.slice(0, 5) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Error in ai-match-buddies:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})

async function getUserProfile(supabase: any, userId: string): Promise<MatchingProfile> {
  // Get loneliness assessment
  const { data: lonelinessData } = await supabase
    .from("loneliness_assessments")
    .select("total_score, loneliness_category")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Get leisure assessment
  const { data: leisureData } = await supabase
    .from("leisure_assessments")
    .select("top_categories, combined_scores")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Get recent mood average
  const { data: moodData } = await supabase
    .from("mood_entries")
    .select("mood")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10)

  const recentMoodAvg = moodData && moodData.length > 0 
    ? moodData.reduce((sum: number, entry: any) => sum + entry.mood, 0) / moodData.length 
    : 3

  return {
    user_id: userId,
    loneliness_category: lonelinessData?.loneliness_category || "Moderate",
    loneliness_score: lonelinessData?.total_score || 15,
    leisure_categories: leisureData?.top_categories || [],
    leisure_scores: leisureData?.combined_scores || {},
    recent_mood_avg: recentMoodAvg,
  }
}

async function findMatchingCandidates(supabase: any, userProfile: MatchingProfile): Promise<MatchingProfile[]> {
  // Get all users not in groups yet
  const { data: usersWithoutGroups } = await supabase.rpc("get_users_without_groups")

  if (!usersWithoutGroups || usersWithoutGroups.length === 0) {
    return []
  }

  // Build profiles for each candidate
  const candidates: MatchingProfile[] = []

  for (const candidate of usersWithoutGroups) {
    if (candidate.user_id === userProfile.user_id) continue

    try {
      const profile = await getUserProfile(supabase, candidate.user_id)
      candidates.push(profile)
    } catch (error) {
      console.error(`Error getting profile for ${candidate.user_id}:`, error)
    }
  }

  return candidates
}

function rankCandidates(userProfile: MatchingProfile, candidates: MatchingProfile[]): Array<MatchingProfile & { score: number }> {
  return candidates
    .map((candidate) => {
      // Calculate match score (0-100)
      let score = 0

      // 1. Loneliness category similarity (40 points)
      const lonelinessMatch = calculateLonelinessMatch(userProfile.loneliness_category, candidate.loneliness_category)
      score += lonelinessMatch * 40

      // 2. Leisure interest overlap (40 points)
      const leisureMatch = calculateLeisureMatch(userProfile.leisure_categories, candidate.leisure_categories)
      score += leisureMatch * 40

      // 3. Mood compatibility (20 points)
      const moodMatch = calculateMoodMatch(userProfile.recent_mood_avg, candidate.recent_mood_avg)
      score += moodMatch * 20

      return { ...candidate, score }
    })
    .sort((a, b) => b.score - a.score)
}

function calculateLonelinessMatch(category1: string, category2: string): number {
  // Same category = perfect match
  if (category1 === category2) return 1.0

  const categories = ["Low", "Moderate", "Moderately High", "High"]
  const index1 = categories.indexOf(category1)
  const index2 = categories.indexOf(category2)

  // Adjacent categories = good match
  if (Math.abs(index1 - index2) === 1) return 0.7

  // Two apart = moderate match
  if (Math.abs(index1 - index2) === 2) return 0.4

  // Opposite ends = poor match
  return 0.1
}

function calculateLeisureMatch(categories1: string[], categories2: string[]): number {
  if (categories1.length === 0 || categories2.length === 0) return 0.5

  const set1 = new Set(categories1)
  const set2 = new Set(categories2)
  const intersection = [...set1].filter((x) => set2.has(x))

  // Jaccard similarity
  const union = new Set([...categories1, ...categories2])
  return intersection.length / union.size
}

function calculateMoodMatch(mood1: number, mood2: number): number {
  // Moods on 1-5 scale, closer = better
  const diff = Math.abs(mood1 - mood2)
  return Math.max(0, 1 - diff / 4)
}

async function findOrCreateGroup(
  supabase: any,
  userId: string,
  userProfile: MatchingProfile,
  rankedCandidates: Array<MatchingProfile & { score: number }>
): Promise<any> {
  // Try to find existing group with capacity
  const { data: existingGroups } = await supabase.rpc("get_groups_with_capacity", {
    category: userProfile.loneliness_category,
  })

  if (existingGroups && existingGroups.length > 0) {
    // Join the first available group
    const group = existingGroups[0]

    await supabase.from("buddy_group_members").insert({
      group_id: group.id,
      user_id: userId,
      role: "member",
    })

    return group
  }

  // Create new group
  const { data: newGroup, error: groupError } = await supabase
    .from("buddy_groups")
    .insert({
      created_by: userId,
      is_ai_matched: true,
      matching_criteria: {
        loneliness_category: userProfile.loneliness_category,
        leisure_categories: userProfile.leisure_categories,
        target_size: 5,
        match_scores: rankedCandidates.slice(0, 5).map((c) => ({
          user_id: c.user_id,
          score: c.score,
        })),
      },
      status: "active",
    })
    .select()
    .single()

  if (groupError) throw groupError

  // Add creator to group
  await supabase.from("buddy_group_members").insert({
    group_id: newGroup.id,
    user_id: userId,
    role: "creator",
  })

  // Optionally: Auto-add top matches to group (or send invitations)
  // For now, we'll let them join manually through the UI

  return newGroup
}

