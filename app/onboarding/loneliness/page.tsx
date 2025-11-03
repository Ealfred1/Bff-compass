"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface LonelinessSurvey {
  [key: number]: number
}

const questions = [
  "How often do you feel that you lack companionship?",
  "How often do you feel alone?",
  "How often do you feel that you are no longer close to anyone?",
  "How often do you feel left out?",
  "How often do you feel that no one really knows you well?",
  "How often do you feel that people are around you but not with you?",
]

const options = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Always" },
]

export default function LonelinessSurveyPage() {
  const [responses, setResponses] = useState<LonelinessSurvey>({})
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check if user is authenticated and if they've already completed this survey
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }

        // Check if loneliness assessment already exists
        const { data: lonelinessData } = await supabase
          .from("loneliness_assessments")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .single()

        // If exists, redirect to leisure page or dashboard
        if (lonelinessData) {
          // Check if leisure also exists
          const { data: leisureData } = await supabase
            .from("leisure_assessments")
            .select("id")
            .eq("user_id", user.id)
            .limit(1)
            .single()

          if (leisureData) {
            router.push("/dashboard")
          } else {
            router.push("/onboarding/leisure")
          }
        }
      } catch (err) {
        console.error("Onboarding check error:", err)
      }
    }

    checkOnboarding()
  }, [router, supabase])

  const handleResponse = (questionIndex: number, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if all questions answered
    if (Object.keys(responses).length !== questions.length) {
      setError("Please answer all questions")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const totalScore = Object.values(responses).reduce((a, b) => a + b, 0)

      const { error: err } = await supabase.from("loneliness_assessments").insert({
        user_id: user.id,
        scores: responses,
        total_score: totalScore,
      })

      if (err) throw err
      router.push("/onboarding/leisure")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-6 min-h-svh">
      <Card className="w-full max-w-2xl border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">UCLA Loneliness Assessment</CardTitle>
          <CardDescription>
            Answer the following questions about how you feel. Your responses help us understand you better.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                <p className="font-medium text-foreground">
                  {index + 1}. {question}
                </p>
                <div className="flex gap-2">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleResponse(index, option.value)}
                      className={`flex-1 py-2 px-3 rounded border font-medium transition-all ${
                        responses[index] === option.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-foreground hover:border-primary/50 bg-card"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Next: Leisure Interests"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
