"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface LeisureScores {
  [key: number]: string
}

// Section 1: Word pairs
const section1 = [
  { q: 1, a: { value: "A", label: "Play Football" }, b: { value: "G", label: "Hunting" } },
  { q: 2, a: { value: "D", label: "Cooking" }, b: { value: "B", label: "Pilates" } },
  { q: 3, a: { value: "G", label: "Hiking" }, b: { value: "F", label: "Collecting Figurines" } },
  { q: 4, a: { value: "C", label: "Playing Cards" }, b: { value: "D", label: "Playing an Instrument" } },
  { q: 5, a: { value: "B", label: "Karate" }, b: { value: "E", label: "Going Shopping" } },
]

// Category mapping
const categories = {
  A: "Physical Activities",
  B: "Mind-Body",
  C: "Games",
  D: "Creative Expression",
  E: "Social Outings",
  F: "Collecting",
  G: "Nature",
}

export default function LeisureSurveyPage() {
  const [responses, setResponses] = useState<LeisureScores>({})
  const [step, setStep] = useState<"intro" | "section1" | "summary">("intro")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check if loneliness assessment is completed before allowing access
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        // Check if loneliness assessment exists
        const { data: lonelinessData, error: lonelinessError } = await supabase
          .from("loneliness_assessments")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .single()

        // If no loneliness assessment, redirect to loneliness page
        if (lonelinessError || !lonelinessData) {
          router.push("/onboarding/loneliness")
          return
        }

        // Check if leisure assessment already exists
        const { data: leisureData } = await supabase
          .from("leisure_assessments")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .single()

        // If leisure assessment exists, redirect to dashboard
        if (leisureData) {
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("Onboarding check error:", err)
      }
    }

    checkOnboarding()
  }, [router, supabase])

  const handleResponse = (questionIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))
  }

  const handleContinue = () => {
    if (Object.keys(responses).length !== section1.length) {
      setError("Please answer all questions")
      return
    }
    setError(null)
    setStep("summary")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Count categories
      const counts: { [key: string]: number } = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
      }

      Object.values(responses).forEach((response) => {
        if (response in counts) counts[response]++
      })

      // Get top 3 categories
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => categories[key as keyof typeof categories])

      const { error: err } = await supabase.from("leisure_assessments").insert({
        user_id: user.id,
        section1_scores: responses,
        section2_scores: {},
        combined_scores: counts,
        top_categories: sorted,
      })

      if (err) throw err

      // Update onboarding_completed
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user.id)

      if (updateErr) throw updateErr

      router.push("/dashboard")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (step === "intro") {
    return (
      <div className="flex items-center justify-center py-12 px-6 min-h-svh">
        <Card className="w-full max-w-md border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Leisure Interests</CardTitle>
            <CardDescription>Help us understand your leisure preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This assessment will help us better understand your interests and find people who share your passions.
              There are no right or wrong answers—just choose based on your immediate reaction.
            </p>
            <Button
              onClick={() => setStep("section1")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "summary") {
    const topCategories = Object.entries(
      Object.values(responses).reduce((acc: { [key: string]: number }, val) => {
        acc[val] = (acc[val] || 0) + 1
        return acc
      }, {}),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) => categories[key as keyof typeof categories])

    return (
      <div className="flex items-center justify-center py-12 px-6 min-h-svh">
        <Card className="w-full max-w-md border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Leisure Profile</CardTitle>
            <CardDescription>Based on your responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">Your top interest categories:</p>
            <div className="space-y-2">
              {topCategories.map((cat, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg bg-card">
                  <p className="font-medium text-foreground">
                    {idx + 1}. {cat}
                  </p>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Completing..." : "Complete Onboarding"}
              </Button>
              <Button
                type="button"
                onClick={() => setStep("section1")}
                variant="outline"
                className="w-full border-border hover:bg-muted font-medium"
                disabled={isLoading}
              >
                Back
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12 px-6 min-h-svh">
      <Card className="w-full max-w-2xl border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Leisure Interests Assessment</CardTitle>
          <CardDescription>Choose the activity that appeals to you most</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {section1.map((item) => (
              <div key={item.q} className="border border-border rounded-lg p-4 space-y-3">
                <p className="font-medium text-foreground">Question {item.q}</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleResponse(item.q, item.a.value)}
                    className={`py-2 px-3 rounded border font-medium transition-all ${
                      responses[item.q] === item.a.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-foreground hover:border-primary/50 bg-card"
                    }`}
                  >
                    {item.a.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResponse(item.q, item.b.value)}
                    className={`py-2 px-3 rounded border font-medium transition-all ${
                      responses[item.q] === item.b.value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-foreground hover:border-primary/50 bg-card"
                    }`}
                  >
                    {item.b.label}
                  </button>
                </div>
              </div>
            ))}
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button
              onClick={handleContinue}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
            >
              Review Your Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
