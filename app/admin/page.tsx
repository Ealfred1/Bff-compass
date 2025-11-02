"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Stats {
  totalUsers: number
  totalConnections: number
  totalMessages: number
  averageLoneliness: number
  topCategories: Array<[string, number]>
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (!response.ok) {
        if (response.status === 403) {
          setError("Unauthorized: Admin access only")
          return
        }
        throw new Error("Failed to load stats")
      }

      const { stats: statsData } = await response.json()
      setStats(statsData)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load stats")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent">
                Dashboard
              </Button>
            </Link>
            <form action="/api/auth/logout" method="POST">
              <Button
                type="submit"
                variant="outline"
                className="border-border hover:bg-muted font-medium bg-transparent"
              >
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading admin stats...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-destructive font-medium">{error}</p>
              </CardContent>
            </Card>
          ) : stats ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Total Users</p>
                    <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground mt-2">registered members</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Active Connections</p>
                    <p className="text-3xl font-bold text-accent">{stats.totalConnections}</p>
                    <p className="text-xs text-muted-foreground mt-2">buddy pairs</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Total Messages</p>
                    <p className="text-3xl font-bold text-foreground">{stats.totalMessages}</p>
                    <p className="text-xs text-muted-foreground mt-2">conversations</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Avg Loneliness</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.averageLoneliness}</p>
                    <p className="text-xs text-muted-foreground mt-2">scale 1-24</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Interests */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Top Leisure Interests</CardTitle>
                  <CardDescription>Most popular activity categories among users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.topCategories.map(([category, count], idx) => (
                      <div key={category} className="flex items-center gap-4">
                        <div className="text-sm font-medium text-foreground w-24">#{idx + 1}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-foreground">{category}</span>
                            <span className="text-sm text-muted-foreground">{count} users</span>
                          </div>
                          <div className="w-full bg-border rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(count / (stats.topCategories[0]?.[1] || 1)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </section>
    </main>
  )
}
