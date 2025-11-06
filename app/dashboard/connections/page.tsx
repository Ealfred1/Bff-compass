"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, MessageCircle, Sparkles } from "lucide-react"

interface BuddyGroupMember {
  id: string
  user_id: string
  role: string
  profiles: {
    id: string
    display_name: string
    username: string
    bio: string | null
    avatar_url: string | null
  }
}

interface SimilarUser {
  id: string
  display_name: string
  username: string
  bio: string | null
  avatar_url: string | null
  compatibility_score: number
  loneliness_category?: string
  leisure_categories?: string[]
}

function getInitials(name: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string): string {
  // Generate consistent green-based colors
  const greenShades = [
    "bg-emerald-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-lime-600",
    "bg-emerald-600",
    "bg-teal-600",
    "bg-green-600",
    "bg-emerald-400",
  ]
  const index = name.charCodeAt(0) % greenShades.length
  return greenShades[index]
}

export default function ConnectionsPage() {
  const [buddyGroupMembers, setBuddyGroupMembers] = useState<BuddyGroupMember[]>([])
  const [similarUsers, setSimilarUsers] = useState<SimilarUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [groupId, setGroupId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Load buddy group members (current connections)
      const groupResponse = await fetch("/api/buddy-groups/my-group")
      if (groupResponse.ok) {
        const groupData = await groupResponse.json()
        if (groupData.group && groupData.members) {
          setGroupId(groupData.group.id)
          setBuddyGroupMembers(groupData.members)
        }
      }

      // Load similar users (discovery)
      const similarResponse = await fetch("/api/users/similar")
      if (similarResponse.ok) {
        const similarData = await similarResponse.json()
        setSimilarUsers(similarData.users || [])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load connections")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-svh bg-gradient-to-br from-neutral-50 to-primary/5">
      <header className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-grotesk">My Connections</h1>
            <p className="text-sm text-neutral-600 font-poppins">Chat and connect with your buddies</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-neutral-200 hover:bg-neutral-50 font-medium bg-white">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {isLoading ? (
            <Card className="border-0 bg-white/80 shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-neutral-600 font-poppins">Loading connections...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-0 bg-white/80 shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-red-600 font-medium font-poppins">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Current Buddy Group Members */}
              {buddyGroupMembers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-neutral-900 font-grotesk">My Buddy Group</h2>
                    <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                      <Sparkles className="h-3 w-3" />
                      {buddyGroupMembers.length} {buddyGroupMembers.length === 1 ? "member" : "members"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {buddyGroupMembers.map((member) => {
                      const profile = member.profiles
                      const initials = getInitials(profile.display_name)
                      const avatarColor = getAvatarColor(profile.display_name)
                      return (
                        <Card key={member.id} className="border-0 bg-white/90 shadow-lg hover:shadow-xl transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              {profile.avatar_url ? (
                                <img
                                  src={profile.avatar_url}
                                  alt={profile.display_name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                />
                              ) : (
                                <div
                                  className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold border-2 border-white shadow-md`}
                                >
                                  {initials}
                                </div>
                              )}
                              <div className="flex-1">
                                <CardTitle className="text-base font-grotesk text-neutral-900">{profile.display_name}</CardTitle>
                                <CardDescription className="font-poppins">@{profile.username}</CardDescription>
                              </div>
                              {member.role === "creator" && (
                                <Badge variant="default" className="text-xs bg-primary text-white">Creator</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {profile.bio && (
                              <p className="text-sm text-neutral-600 mb-4 line-clamp-2 font-poppins">{profile.bio}</p>
                            )}
                            {groupId && (
                              <Link href={`/dashboard/messages/${groupId}`} className="block">
                                <Button
                                  variant="outline"
                                  className="w-full border-neutral-200 hover:bg-primary/5 hover:border-primary/30 font-medium bg-white"
                                  size="sm"
                                >
                                  <MessageCircle className="mr-2 h-4 w-4" />
                                  Group Chat
                                </Button>
                              </Link>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Similar Users (Discovery) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-neutral-900 font-grotesk">People with Similar Interests</h2>
                  </div>
                  <Link href="/dashboard/matches">
                    <Button variant="outline" size="sm" className="border-neutral-200 hover:bg-neutral-50 bg-white">
                      Find More Buddies
                    </Button>
                  </Link>
                </div>
                {similarUsers.length === 0 ? (
                  <Card className="border-0 bg-white/80 shadow-lg">
                    <CardContent className="py-12 text-center">
                      <p className="text-neutral-600 mb-4 font-poppins">No similar users found</p>
                      <p className="text-sm text-neutral-500 mb-6 font-poppins">
                        Complete your assessments to find people with similar interests
                      </p>
                      <Link href="/dashboard/matches">
                        <Button className="bg-primary hover:bg-primary/90 text-white border-0 font-medium shadow-md">
                          Find My Buddy Group
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {similarUsers.map((user) => {
                      const initials = getInitials(user.display_name)
                      const avatarColor = getAvatarColor(user.display_name)
                      return (
                        <Card key={user.id} className="border-0 bg-white/90 shadow-lg hover:shadow-xl transition-shadow">
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              {user.avatar_url ? (
                                <img
                                  src={user.avatar_url}
                                  alt={user.display_name}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                />
                              ) : (
                                <div
                                  className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold border-2 border-white shadow-md`}
                                >
                                  {initials}
                                </div>
                              )}
                              <div className="flex-1">
                                <CardTitle className="text-base font-grotesk text-neutral-900">{user.display_name}</CardTitle>
                                <CardDescription className="font-poppins">@{user.username}</CardDescription>
                              </div>
                              {user.compatibility_score > 0 && (
                                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                  {user.compatibility_score}% match
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            {user.bio && (
                              <p className="text-sm text-neutral-600 mb-3 line-clamp-2 font-poppins">{user.bio}</p>
                            )}
                            {user.leisure_categories && user.leisure_categories.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {user.leisure_categories.slice(0, 3).map((cat, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-primary/30 bg-primary/5 text-primary">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {user.loneliness_category && (
                              <div className="mb-3">
                                <Badge variant="outline" className="text-xs border-primary/30 bg-primary/5 text-primary">
                                  {user.loneliness_category} Wellness
                                </Badge>
                              </div>
                            )}
                            <Link href="/dashboard/matches">
                              <Button
                                variant="outline"
                                className="w-full border-neutral-200 hover:bg-primary/5 hover:border-primary/30 font-medium bg-white"
                                size="sm"
                              >
                                Connect
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Empty State */}
              {buddyGroupMembers.length === 0 && similarUsers.length === 0 && (
                <Card className="border-0 bg-white/80 shadow-lg">
                  <CardContent className="py-12 text-center">
                    <p className="text-neutral-600 mb-4 font-poppins">No connections yet</p>
                    <p className="text-sm text-neutral-500 mb-6 font-poppins">
                      Start connecting with people who share your interests
                    </p>
                    <Link href="/dashboard/matches">
                      <Button className="bg-primary hover:bg-primary/90 text-white border-0 font-medium shadow-md">
                        Find My Buddy Group
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
