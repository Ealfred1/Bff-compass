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
