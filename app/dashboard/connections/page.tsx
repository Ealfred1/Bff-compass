"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Connection {
  id: string
  user1_id: string
  user2_id: string
  status: string
  other_user: {
    id: string
    display_name: string
    username: string
    bio: string | null
  }
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: connectionsData, error: connectionsError } = await supabase
        .from("connections")
        .select("id, user1_id, user2_id, status")

      if (connectionsError) throw connectionsError

      if (!connectionsData || connectionsData.length === 0) {
        setConnections([])
        return
      }

      // Get the IDs of other users
      const otherUserIds = connectionsData
        .map((conn) => (conn.user1_id === user.id ? conn.user2_id : conn.user1_id))
        .filter(Boolean)

      if (otherUserIds.length === 0) {
        setConnections([])
        return
      }

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, username, bio")
        .in("id", otherUserIds)

      if (profilesError) throw profilesError

      const enrichedConnections: Connection[] = connectionsData.map((conn) => {
        const otherUserId = conn.user1_id === user.id ? conn.user2_id : conn.user1_id
        const otherUser = profiles?.find((p) => p.id === otherUserId)
        return {
          ...conn,
          other_user: otherUser || { id: otherUserId, display_name: "User", username: "unknown", bio: null },
        }
      })

      setConnections(enrichedConnections)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load connections")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Connections</h1>
            <p className="text-sm text-muted-foreground">Chat and connect with your buddies</p>
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
                <p className="text-muted-foreground">Loading connections...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-destructive font-medium">{error}</p>
              </CardContent>
            </Card>
          ) : connections.length === 0 ? (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No connections yet</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Start connecting with people who share your interests
                </p>
                <Link href="/dashboard/matches">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium">
                    Find Buddies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {connections.map((connection) => (
                <Card key={connection.id} className="border-border">
                  <CardHeader>
                    <CardTitle>{connection.other_user.display_name}</CardTitle>
                    <CardDescription>@{connection.other_user.username}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {connection.other_user.bio && (
                      <p className="text-sm text-muted-foreground mb-4">{connection.other_user.bio}</p>
                    )}
                    <div className="flex gap-2">
                      <Link href={`/dashboard/messages/${connection.id}`} className="flex-1">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium">
                          Message
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
