import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      // Ensure profile exists for OAuth users
      if (user) {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single()

        if (!existingProfile) {
          // Create profile for OAuth user
          const username = user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`
          await supabase.from("profiles").insert({
            id: user.id,
            username: username,
            display_name: user.user_metadata?.full_name || user.user_metadata?.name || username,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
        }
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL("/auth/login?error=oauth_failed", request.url))
}

