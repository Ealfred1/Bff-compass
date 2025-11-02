import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardPage() {
  const displayName = "Friend"

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground font-poppins">BFF COMPASS</h1>
          <form action="/api/auth/logout" method="POST">
            <Button
              type="submit"
              variant="outline"
              className="border-border hover:bg-muted font-medium bg-transparent font-poppins"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2 font-poppins">Welcome, {displayName}!</h2>
            <p className="text-muted-foreground font-poppins">
              Your journey to finding your friend compass starts here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-poppins">My Buddy Group</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">
                  AI-matched groups of 3-5 people with shared interests
                </p>
                <Link href="/dashboard/matches">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    Find My Group
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-poppins">My Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Daily messages & weekly videos for your wellness</p>
                <Link href="/dashboard/guidance">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    View Guidance
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-poppins">Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Join in-person activities and earn badges</p>
                <Link href="/dashboard/events">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    View Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-poppins">Track Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Monitor your wellbeing journey</p>
                <Link href="/dashboard/mood">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    Track Mood
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-poppins">My Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Earn achievements as you connect</p>
                <Link href="/dashboard/badges">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    View Badges
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="font-poppins">Mental Health Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Crisis support & wellness resources</p>
                <Link href="/dashboard/resources">
                  <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive font-poppins">
                    Get Support
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
