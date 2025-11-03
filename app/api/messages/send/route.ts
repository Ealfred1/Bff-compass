import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { connectionId, content } = await request.json()

    if (!connectionId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if it's a buddy group (new system)
    const { data: group } = await supabase
      .from("buddy_groups")
      .select("id")
      .eq("id", connectionId)
      .maybeSingle()

    if (group) {
      // It's a group - verify user is a member
      const { data: membership } = await supabase
        .from("buddy_group_members")
        .select("id")
        .eq("group_id", connectionId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (!membership) {
        return NextResponse.json({ error: "Not a group member" }, { status: 403 })
      }

      // Send group message
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          group_id: connectionId,
          sender_id: user.id,
          content: content.trim(),
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({ message })
    }

    // Fall back to old connections system
    const { data: connection, error: connError } = await supabase
      .from("connections")
      .select("user1_id, user2_id")
      .eq("id", connectionId)
      .maybeSingle()

    if (connError || !connection) {
      return NextResponse.json({ error: "Connection or group not found" }, { status: 404 })
    }

    if (connection.user1_id !== user.id && connection.user2_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        connection_id: connectionId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message })
  } catch (error: unknown) {
    console.error("Message send error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
