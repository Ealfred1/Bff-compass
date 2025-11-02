import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { group_id, encrypted_content, encryption_iv, message_type = "text" } = body

    if (!group_id || !encrypted_content || !encryption_iv) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user is a member of the group
    const { data: membership } = await supabase
      .from("buddy_group_members")
      .select("id")
      .eq("group_id", group_id)
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this group" }, { status: 403 })
    }

    // Insert encrypted message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        group_id,
        sender_id: user.id,
        encrypted_content,
        encryption_iv,
        message_type,
      })
      .select()
      .single()

    if (messageError) throw messageError

    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

