import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

/**
 * Checks if user has completed onboarding (both surveys)
 * Returns the user's onboarding status
 */
export async function checkOnboardingStatus() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Check if loneliness assessment exists
  const { data: lonelinessData } = await supabase
    .from("loneliness_assessments")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  const hasLonelinessAssessment = !!lonelinessData

  // Check if leisure assessment exists
  const { data: leisureData } = await supabase
    .from("leisure_assessments")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  const hasLeisureAssessment = !!leisureData

  return {
    user,
    hasLonelinessAssessment,
    hasLeisureAssessment,
    isOnboardingComplete: hasLonelinessAssessment && hasLeisureAssessment,
  }
}

/**
 * Enforces onboarding completion - redirects if not complete
 * Call this at the top of any protected page
 */
export async function requireOnboarding() {
  const status = await checkOnboardingStatus()

  if (!status.isOnboardingComplete) {
    // Redirect to the appropriate onboarding step
    if (!status.hasLonelinessAssessment) {
      redirect("/onboarding/loneliness")
    } else if (!status.hasLeisureAssessment) {
      redirect("/onboarding/leisure")
    }
  }

  return status
}

