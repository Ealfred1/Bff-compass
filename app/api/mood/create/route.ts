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

    const { mood, notes } = await request.json()

    if (!mood || mood < 1 || mood > 5) {
      return NextResponse.json({ error: "Invalid mood value" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("mood_entries")
      .insert({
        user_id: user.id,
        mood,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ moodEntry: data })
  } catch (error: unknown) {
    console.error("Mood entry error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
