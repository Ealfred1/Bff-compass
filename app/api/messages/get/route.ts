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

    const url = new URL(request.url)
    const connectionId = url.searchParams.get("connectionId")

    if (!connectionId) {
      return NextResponse.json({ error: "Missing connectionId" }, { status: 400 })
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

      // Get group messages with full sender profile info
      const { data: messages, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          encrypted_content,
          encryption_iv,
          created_at,
          sender_id,
          profiles(
            id,
            display_name,
            username,
            avatar_url
          )
        `)
        .eq("group_id", connectionId)
        .order("created_at", { ascending: true })

      if (error) throw error

      return NextResponse.json({ messages: messages || [] })
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

    // Get messages with full sender profile info
    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        id,
        content,
        created_at,
        sender_id,
        profiles(
          id,
          display_name,
          username,
          avatar_url
        )
      `)
      .eq("connection_id", connectionId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ messages: messages || [] })
  } catch (error: unknown) {
    console.error("Get messages error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
