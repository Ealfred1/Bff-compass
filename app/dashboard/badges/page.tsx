"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BadgeCard } from "@/components/badge-card"

interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

interface EarnedBadge {
  badge_id: string
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [earnedBadges, setEarnedBadges] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadBadges()
  }, [])

  const loadBadges = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from("badges")
        .select("id, name, description, icon")

      if (badgesError) throw badgesError

      // Get earned badges
      const { data: userBadges, error: userBadgesError } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id)

      if (userBadgesError) throw userBadgesError

      setBadges(allBadges || [])
      setEarnedBadges(new Set((userBadges || []).map((b: EarnedBadge) => b.badge_id)))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load badges")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
            <p className="text-sm text-muted-foreground">Earn badges as you connect and grow</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading badges...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-destructive font-medium">{error}</p>
              </CardContent>
            </Card>
          ) : badges.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No badges available yet</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-sm text-muted-foreground">
                  {earnedBadges.size} of {badges.length} earned
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <BadgeCard
                    key={badge.id}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    earned={earnedBadges.has(badge.id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
