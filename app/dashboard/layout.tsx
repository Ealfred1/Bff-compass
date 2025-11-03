import { requireOnboarding } from "@/lib/onboarding-check"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check onboarding completion for ALL dashboard pages
  await requireOnboarding()

  return <>{children}</>
}

