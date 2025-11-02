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

    // Verify user is part of this connection
    const { data: connection, error: connError } = await supabase
      .from("connections")
      .select("user1_id, user2_id")
      .eq("id", connectionId)
      .single()

    if (connError || !connection) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 })
    }

    if (connection.user1_id !== user.id && connection.user2_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get messages with sender info
    const { data: messages, error } = await supabase
      .from("messages")
      .select("id, content, created_at, sender_id, connections(user1_id, user2_id), profiles(display_name)")
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
