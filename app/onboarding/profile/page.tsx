"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ProfilePage() {
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        username,
        display_name: displayName,
        bio: bio || null,
      })

      if (error) throw error
      router.push("/onboarding/loneliness")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-6 min-h-svh">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Your Profile</CardTitle>
          <CardDescription>Tell us a bit about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-border bg-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-foreground font-medium">
                Display Name
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your Name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-border bg-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground font-medium">
                Bio
              </Label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border border-border rounded bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Next: Loneliness Assessment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
