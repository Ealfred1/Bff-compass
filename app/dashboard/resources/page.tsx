"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Resource {
  title: string
  description: string
  category: string
  tips: string[]
}

const resources: Resource[] = [
  {
    title: "Starting a Conversation",
    category: "Communication",
    description: "Tips for making meaningful first connections",
    tips: [
      "Ask open-ended questions about their interests",
      "Share something genuine about yourself",
      "Listen actively and show interest in their responses",
      "Find common ground in your shared interests",
      "Be patient and let the conversation flow naturally",
    ],
  },
  {
    title: "Building Strong Friendships",
    category: "Relationships",
    description: "How to deepen your buddy connections",
    tips: [
      "Be consistent and reliable in your communications",
      "Show up for important moments",
      "Practice active listening",
      "Share experiences together online or in-person",
      "Celebrate each other's wins",
    ],
  },
  {
    title: "Managing Loneliness",
    category: "Wellbeing",
    description: "Healthy strategies for coping with lonely feelings",
    tips: [
      "Reach out to your connections regularly",
      "Join interest-based groups or activities",
      "Practice self-compassion",
      "Set realistic expectations for social interactions",
      "Engage in activities you enjoy",
    ],
  },
  {
    title: "Finding Your Interests",
    category: "Discovery",
    description: "Exploring and developing your passions",
    tips: [
      "Try activities outside your comfort zone",
      "Revisit childhood interests and hobbies",
      "Look for communities around your passions",
      "Give yourself permission to explore",
      "Document what brings you joy",
    ],
  },
]

export default function ResourcesPage() {
  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resources & Guidance</h1>
            <p className="text-sm text-muted-foreground">Learn how to make the most of BFF COMPASS</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <Card key={resource.title} className="border-border">
                <CardHeader>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resource.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="text-primary font-semibold flex-shrink-0">•</span>
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
