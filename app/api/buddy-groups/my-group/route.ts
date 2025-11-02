import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's current group
    const { data: membership, error: memberError } = await supabase
      .from("buddy_group_members")
      .select(
        `
        *,
        buddy_groups(*)
      `
      )
      .eq("user_id", user.id)
      .order("joined_at", { ascending: false })
      .limit(1)
      .single()

    if (memberError || !membership) {
      return NextResponse.json({ group: null, members: [] })
    }

    // Get all members of the group
    const { data: members, error: membersError } = await supabase
      .from("buddy_group_members")
      .select(
        `
        *,
        profiles(id, display_name, avatar_url, bio)
      `
      )
      .eq("group_id", membership.group_id)
      .order("joined_at", { ascending: true })

    if (membersError) throw membersError

    return NextResponse.json({
      group: membership.buddy_groups,
      members: members || [],
      my_role: membership.role,
    })
  } catch (error: any) {
    console.error("Error getting my group:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

