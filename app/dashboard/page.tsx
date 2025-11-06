import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { requireOnboarding } from "@/lib/onboarding-check"

export default async function DashboardPage() {
  // Enforce onboarding completion
  const { user } = await requireOnboarding()
  
  const displayName = user.user_metadata?.display_name || "Friend"

  return (
    <main className="min-h-svh bg-gradient-to-br from-neutral-50 via-white to-primary/5">
      <header className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900 font-grotesk">BFF COMPASS</h1>
          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="outline"
              className="border-neutral-200 hover:bg-neutral-50 font-medium bg-white font-poppins"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2 font-grotesk">Welcome, {displayName}! 👋</h2>
            <p className="text-neutral-600 font-poppins">
              Your journey to finding your friend compass starts here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk flex items-center gap-2 text-primary">
                  <span className="text-2xl">🤖</span> AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 mb-4 font-poppins">
                  Ask about events, connections, badges, and your buddy group
                </p>
                <Link href="/dashboard/chat">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 font-poppins shadow-md">
                    Chat Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk text-primary">My Buddy Group</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 mb-4 font-poppins">
                  AI-matched groups of 3-5 people with shared interests
                </p>
                <Link href="/dashboard/matches">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 font-poppins shadow-md">
                    Find My Group
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk text-primary">My Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 mb-4 font-poppins">Daily messages & weekly videos for your wellness</p>
                <Link href="/dashboard/guidance">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 font-poppins shadow-md">
                    View Guidance
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk text-primary">Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 mb-4 font-poppins">Join in-person activities and earn badges</p>
                <Link href="/dashboard/events">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 font-poppins shadow-md">
                    View Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk text-primary">Track Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 mb-4 font-poppins">Monitor your wellbeing journey</p>
                <Link href="/dashboard/mood">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 font-poppins shadow-md">
                    Track Mood
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk text-primary">My Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 mb-4 font-poppins">Earn achievements as you connect</p>
                <Link href="/dashboard/badges">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 font-poppins shadow-md">
                    View Badges
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100/50 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk text-red-900">Mental Health Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-800/80 mb-4 font-poppins">Crisis support & wellness resources</p>
                <Link href="/dashboard/resources">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-0 font-poppins shadow-md">
                    Get Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-grotesk text-primary">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-700 mb-4 font-poppins">Manage your account and preferences</p>
                <Link href="/dashboard/profile">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white border-0 font-poppins shadow-md">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
