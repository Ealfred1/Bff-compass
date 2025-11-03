import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is already in a group
    const { data: existingMemberships } = await supabase
      .from("buddy_group_members")
      .select(`
        group_id,
        buddy_groups!inner(*)
      `)
      .eq("user_id", user.id)
      .eq("buddy_groups.status", "active")

    if (existingMemberships && existingMemberships.length > 0) {
      return NextResponse.json({
        success: true,
        group: existingMemberships[0].buddy_groups,
        message: "Already in a group",
      })
    }

    // Get user's latest assessments
    const { data: lonelinessData } = await supabase
      .from("loneliness_assessments")
      .select("total_score, loneliness_category")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const { data: leisureData } = await supabase
      .from("leisure_assessments")
      .select("top_categories, combined_scores")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!lonelinessData || !leisureData) {
      return NextResponse.json({ error: "Please complete onboarding surveys first" }, { status: 400 })
    }

    // Find available groups with matching criteria (under 5 members)
    // Use the PostgreSQL function we created that properly handles capacity checking
    const { data: availableGroups } = await supabase.rpc("get_groups_with_capacity", {
      category: lonelinessData.loneliness_category,
    })

    // Simple matching: find first group with capacity and matching loneliness category
    let targetGroup = null
    if (availableGroups && availableGroups.length > 0) {
      // Get the full group details for the first available match
      const { data: groupDetails } = await supabase
        .from("buddy_groups")
        .select("*")
        .eq("id", availableGroups[0].id)
        .single()

      targetGroup = groupDetails
    }

    // If no matching group found, create new group
    if (!targetGroup) {
      const { data: newGroup, error: createError } = await supabase
        .from("buddy_groups")
        .insert({
          created_by: user.id,
          is_ai_matched: true,
          matching_criteria: {
            loneliness_category: lonelinessData.loneliness_category,
            leisure_categories: leisureData.top_categories,
            created_at: new Date().toISOString(),
          },
          status: "active",
        })
        .select()
        .single()

      if (createError) throw createError
      targetGroup = newGroup
    }

    // Add user to the group
    const { data: newMember, error: memberError } = await supabase
      .from("buddy_group_members")
      .insert({
        group_id: targetGroup.id,
        user_id: user.id,
        role: targetGroup.created_by === user.id ? "creator" : "member",
      })
      .select()
      .single()

    if (memberError) {
      console.error("Failed to add member to group:", memberError)
      throw memberError
    }

    console.log("✅ Successfully added user to group:", {
      groupId: targetGroup.id,
      userId: user.id,
      role: newMember?.role,
    })

    return NextResponse.json({
      success: true,
      group: targetGroup,
      member: newMember,
      message: "Successfully joined a buddy group",
    })
  } catch (error: any) {
    console.error("Error in find-or-create:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

