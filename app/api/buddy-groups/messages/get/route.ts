import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get("group_id")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!groupId) {
      return NextResponse.json({ error: "Missing group_id" }, { status: 400 })
    }

    // Verify user is a member of the group
    const { data: membership } = await supabase
      .from("buddy_group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this group" }, { status: 403 })
    }

    // Get messages
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(
        `
        *,
        profiles:sender_id(id, display_name, avatar_url)
      `
      )
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })

    if (messagesError) throw messagesError

    return NextResponse.json({ success: true, messages: messages || [] })
  } catch (error: any) {
    console.error("Error getting messages:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

