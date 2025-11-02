"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoodSelector } from "@/components/mood-selector"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Analytics {
  average: number
  highest: number
  lowest: number
  totalEntries: number
  dailyAverages: Array<{ date: string; average: number }>
}

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number>()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true)
    try {
      const response = await fetch("/api/mood/analytics")
      if (!response.ok) throw new Error("Failed to load analytics")
      const { analytics } = await response.json()
      setAnalytics(analytics)
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load analytics")
    } finally {
      setIsLoadingAnalytics(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMood) {
      setError("Please select a mood")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/mood/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selectedMood, notes: notes || null }),
      })

      if (!response.ok) throw new Error("Failed to save mood")

      setSelectedMood(undefined)
      setNotes("")
      setSuccess(true)
      loadAnalytics()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save mood")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMoodLabel = (mood: number) => {
    const labels = ["Terrible", "Bad", "Okay", "Good", "Great"]
    return labels[mood - 1]
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mood Tracker</h1>
            <p className="text-sm text-muted-foreground">Monitor your wellbeing journey</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mood Entry */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Share your mood to track your wellbeing over time</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <MoodSelector onSelect={setSelectedMood} selected={selectedMood} />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Add a note (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-border rounded bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                {success && <p className="text-sm text-green-600 font-medium">Mood saved successfully!</p>}

                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedMood}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
                >
                  {isSubmitting ? "Saving..." : "Save Mood"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Analytics */}
          {isLoadingAnalytics ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Loading analytics...</p>
              </CardContent>
            </Card>
          ) : analytics ? (
            <>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Your Wellbeing Stats</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-border rounded-lg p-4 bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Average Mood</p>
                      <p className="text-2xl font-bold text-primary">{analytics.average.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground mt-1">out of 5</p>
                    </div>
                    <div className="border border-border rounded-lg p-4 bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Best Day</p>
                      <p className="text-2xl font-bold text-accent">{analytics.highest}</p>
                      <p className="text-xs text-muted-foreground mt-1">{getMoodLabel(analytics.highest)}</p>
                    </div>
                    <div className="border border-border rounded-lg p-4 bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Lowest Mood</p>
                      <p className="text-2xl font-bold text-orange-600">{analytics.lowest}</p>
                      <p className="text-xs text-muted-foreground mt-1">{getMoodLabel(analytics.lowest)}</p>
                    </div>
                    <div className="border border-border rounded-lg p-4 bg-card">
                      <p className="text-xs text-muted-foreground mb-1">Entries</p>
                      <p className="text-2xl font-bold text-foreground">{analytics.totalEntries}</p>
                      <p className="text-xs text-muted-foreground mt-1">tracked</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analytics.dailyAverages.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Daily Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.dailyAverages
                        .slice(-10)
                        .reverse()
                        .map((day) => {
                          const date = new Date(day.date)
                          const displayDate = date.toLocaleDateString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                          return (
                            <div key={day.date} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{displayDate}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 bg-border rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${(day.average / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="font-medium text-foreground w-12 text-right">
                                  {day.average.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </section>
    </main>
  )
}
