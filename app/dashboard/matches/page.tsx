"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { MatchCard } from "@/components/match-card"

interface Candidate {
  id: string
  display_name: string
  username: string
  bio: string | null
  compatibilityScore: number
}

export default function MatchesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/matches/get-candidates")
      if (!response.ok) throw new Error("Failed to load candidates")
      const { candidates } = await response.json()
      setCandidates(candidates)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load candidates")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (targetUserId: string) => {
    try {
      const response = await fetch("/api/matches/request-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to connect")
      }

      // Remove from candidates list
      setCandidates(candidates.filter((c) => c.id !== targetUserId))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to connect")
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Find Your Buddy</h1>
            <p className="text-sm text-muted-foreground">Discover people who match your interests</p>
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
                <p className="text-muted-foreground">Loading candidates...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-destructive font-medium">{error}</p>
                <Button
                  onClick={loadCandidates}
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : candidates.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No new candidates at this time</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Check back later or explore your existing connections
                </p>
                <Link href="/dashboard/connections">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium">
                    View My Connections
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <MatchCard key={candidate.id} candidate={candidate} onConnect={handleConnect} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
