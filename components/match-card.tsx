"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface MatchCardProps {
  candidate: {
    id: string
    display_name: string
    username: string
    bio: string | null
    compatibilityScore: number
  }
  onConnect: (userId: string) => Promise<void>
  isConnecting?: boolean
}

export function MatchCard({ candidate, onConnect, isConnecting }: MatchCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await onConnect(candidate.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg">{candidate.display_name}</CardTitle>
            <CardDescription>@{candidate.username}</CardDescription>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{candidate.compatibilityScore}%</p>
            <p className="text-xs text-muted-foreground">match</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {candidate.bio && <p className="text-sm text-foreground mb-4">{candidate.bio}</p>}
        <Button
          onClick={handleConnect}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
          disabled={isLoading || isConnecting}
        >
          {isLoading || isConnecting ? "Connecting..." : "Connect"}
        </Button>
      </CardContent>
    </Card>
  )
}
