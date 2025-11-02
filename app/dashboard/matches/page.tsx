"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BuddyGroupCard } from "@/components/buddy-group-card"
import Link from "next/link"
import { Users, Sparkles, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GroupMember {
  id: string
  user_id: string
  role: string
  joined_at: string
  profiles: {
    id: string
    display_name: string
    avatar_url: string | null
    bio: string | null
  }
}

interface BuddyGroup {
  id: string
  group_name: string | null
  is_ai_matched: boolean
  matching_criteria: any
  created_at: string
  status: string
}

export default function MatchesPage() {
  const [group, setGroup] = useState<BuddyGroup | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [myRole, setMyRole] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isMatching, setIsMatching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMyGroup()
  }, [])

  const loadMyGroup = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/buddy-groups/my-group")
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setGroup(data.group)
      setMembers(data.members || [])
      setMyRole(data.my_role || "")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFindMatch = async () => {
    setIsMatching(true)
    setError(null)

    try {
      const response = await fetch("/api/buddy-groups/find-or-create", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      // Reload group data
      await loadMyGroup()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsMatching(false)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-poppins">My Buddy Group</h1>
            <p className="text-sm text-muted-foreground font-poppins">
              Connect with 3-5 people who share your interests
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent font-poppins">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-muted-foreground font-poppins">Loading your buddy group...</p>
            </div>
          ) : group ? (
            <BuddyGroupCard group={group} members={members} myRole={myRole} />
          ) : (
            <div className="space-y-6">
              {/* No Group Yet - Show Matching Card */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold font-poppins">Find Your Buddy Group</CardTitle>
                  <CardDescription className="text-base font-poppins">
                    Get matched with 3-5 people who share your interests and wellness goals
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* How It Works */}
                  <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 font-poppins">
                      <Sparkles className="h-5 w-5 text-primary" />
                      How AI Matching Works
                    </h3>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0 font-poppins">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-foreground font-poppins">Similar Interests</p>
                          <p className="text-sm text-muted-foreground font-poppins">
                            We match you based on your leisure interest survey results
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0 font-poppins">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-foreground font-poppins">Wellness Compatibility</p>
                          <p className="text-sm text-muted-foreground font-poppins">
                            Matched with others at similar loneliness levels for mutual support
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0 font-poppins">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-foreground font-poppins">Small Groups</p>
                          <p className="text-sm text-muted-foreground font-poppins">
                            Groups of 3-5 members for meaningful connections
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Call to Action */}
                  <Button
                    onClick={handleFindMatch}
                    disabled={isMatching}
                    size="lg"
                    className="w-full text-lg h-14 font-poppins"
                  >
                    {isMatching ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Finding Your Perfect Match...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Find My Buddy Group
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-muted-foreground font-poppins">
                    AI will match you with compatible buddies based on your survey responses
                  </p>
                </CardContent>
              </Card>

              {/* Benefits Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-poppins">Safe Space</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-poppins">
                      End-to-end encrypted group chats ensure your conversations stay private
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-poppins">Shared Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-poppins">
                      Support each other's wellness journey and celebrate milestones together
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-poppins">Real Connections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground font-poppins">
                      Small groups foster deeper, more meaningful friendships
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
