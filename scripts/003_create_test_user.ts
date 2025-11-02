// Script to create a test user in Supabase for immediate testing
// Run this from your Supabase SQL Editor or use supabase-js

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function createTestUser() {
  try {
    // Create test user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: "test@bffcompass.com",
      password: "TestPassword123!",
      email_confirm: true, // Skip email confirmation for testing
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return
    }

    console.log("✅ Test user created in auth:", authData.user?.email)

    // Create profile for the test user
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username: "testuser",
        display_name: "Test User",
        bio: "This is a test account for BFF COMPASS",
        onboarding_completed: false,
      })

      if (profileError) {
        console.error("Error creating profile:", profileError)
        return
      }

      console.log("✅ Profile created for test user")
      console.log("\n📧 TEST CREDENTIALS:")
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      console.log("Email: test@bffcompass.com")
      console.log("Password: TestPassword123!")
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

createTestUser()
