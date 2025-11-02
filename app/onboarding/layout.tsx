import type React from "react"
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-svh bg-background">{children}</div>
}
