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
                <CardTitle className="font-poppins">Find Buddies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">
                  Discover people who match your interests and values
                </p>
                <Link href="/dashboard/matches">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    Browse Matches
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-poppins">My Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Chat with your connected buddies</p>
                <Link href="/dashboard/connections">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    View Connections
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
                <CardTitle className="font-poppins">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Earn badges as you connect</p>
                <Link href="/dashboard/badges">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    View Badges
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-poppins">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 font-poppins">Learn tips for connecting</p>
                <Link href="/dashboard/resources">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins">
                    Read Guides
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
