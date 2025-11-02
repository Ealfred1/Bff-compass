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

    const { targetUserId } = await request.json()

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 })
    }

    // Ensure consistent ordering (smaller ID first)
    const [user1Id, user2Id] = [user.id, targetUserId].sort()

    const { data, error } = await supabase
      .from("connections")
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      // Connection might already exist
      if (error.code === "23505") {
        return NextResponse.json({ error: "Connection already exists" }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json({ connection: data })
  } catch (error: unknown) {
    console.error("Connection request error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
