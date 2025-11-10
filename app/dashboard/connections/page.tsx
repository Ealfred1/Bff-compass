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
    <main
      className="min-h-screen relative overflow-hidden bg-[#F9FAFB]"
      style={{
        backgroundImage: "url('/istockphoto-2105100634-612x612 (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[#F9FAFB]/92 backdrop-blur-sm"></div>
      <div className="absolute top-20 -left-24 w-80 h-80 bg-[#0D9488]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-[#0F766E]/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 lg:ml-64 px-4 py-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0D9488]/80">Connection Hub</p>
              <h1 className="text-4xl font-grotesk font-bold text-[#0B1F1A] mt-2">My Connections</h1>
              <p className="text-sm text-[#4B5563] font-poppins mt-2">
                Stay close with your buddy group and discover people who share your interests.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full px-5 py-2 bg-[rgba(13,148,136,0.08)] hover:bg-[rgba(13,148,136,0.15)] border-[#0D9488]/40 text-[#0D9488] shadow-sm">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/matches">
                <Button className="rounded-full px-5 py-2 bg-linear-to-r from-[#0D9488] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D9488] shadow-lg text-white">
                  Find More Buddies
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-white/70 bg-white/80 backdrop-blur shadow-[0_15px_40px_rgba(13,148,136,0.12)] rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0D9488]/70">Buddy Group</p>
                <p className="text-2xl font-grotesk font-bold text-[#0B1F1A] mt-2">{buddyGroupMembers.length}</p>
                <p className="text-sm text-[#6B7280] font-poppins">members staying connected</p>
              </CardContent>
            </Card>
            <Card className="border border-white/70 bg-white/80 backdrop-blur shadow-[0_15px_40px_rgba(13,148,136,0.12)] rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0D9488]/70">Similar Matches</p>
                <p className="text-2xl font-grotesk font-bold text-[#0B1F1A] mt-2">{similarUsers.length}</p>
                <p className="text-sm text-[#6B7280] font-poppins">people with shared interests</p>
              </CardContent>
            </Card>
            <Card className="border border-white/70 bg-white/80 backdrop-blur shadow-[0_15px_40px_rgba(13,148,136,0.12)] rounded-3xl">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0D9488]/70">Next Step</p>
                <p className="text-sm text-[#6B7280] font-poppins mt-2">
                  Jump into your group chat or explore new connections to grow your circle.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
          {isLoading ? (
            <Card className="border border-white/70 bg-white/85 backdrop-blur shadow-[0_15px_40px_rgba(13,148,136,0.12)] rounded-3xl">
              <CardContent className="py-16 text-center">
                <p className="text-[#4B5563] font-poppins">Loading your connections...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border border-red-200 bg-red-50/90 shadow-lg rounded-3xl">
              <CardContent className="py-16 text-center">
                <p className="text-red-600 font-medium font-poppins">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Current Buddy Group Members */}
              {buddyGroupMembers.length > 0 && (
                <Card className="border border-white/80 bg-white/85 backdrop-blur shadow-[0_18px_48px_rgba(13,148,136,0.12)] rounded-3xl p-6 space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[rgba(13,148,136,0.12)] text-[#0D9488] flex items-center justify-center shadow-sm">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#0B1F1A] font-grotesk">My Buddy Group</h2>
                        <p className="text-sm text-[#4B5563] font-poppins">Check in with your core support circle.</p>
                      </div>
                    </div>
                    <Badge className="gap-1 bg-[#0D9488] text-white border-0 rounded-full px-3 py-1">
                      <Sparkles className="h-3 w-3" />
                      {buddyGroupMembers.length} {buddyGroupMembers.length === 1 ? "member" : "members"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {buddyGroupMembers.map((member) => {
                      const profile = member.profiles
                      const initials = getInitials(profile.display_name)
                      const avatarColor = getAvatarColor(profile.display_name)
                      return (
                        <Card key={member.id} className="border border-[#0D9488]/15 bg-white/80 shadow-[0_12px_32px_rgba(13,148,136,0.12)] hover:shadow-[0_18px_36px_rgba(13,148,136,0.18)] transition-shadow rounded-2xl overflow-hidden">
                          <CardHeader className="pb-3">
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
                                <CardTitle className="text-lg font-grotesk text-[#0B1F1A]">{profile.display_name}</CardTitle>
                                <CardDescription className="font-poppins text-[#6B7280]">@{profile.username}</CardDescription>
                              </div>
                              {member.role === "creator" && (
                                <Badge className="text-xs bg-[#0D9488] text-white border-0 px-3 py-1 rounded-full">Creator</Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {profile.bio && (
                              <p className="text-sm text-[#4B5563] mb-4 line-clamp-2 font-poppins">{profile.bio}</p>
                            )}
                            {groupId && (
                              <Link href={`/dashboard/messages/${groupId}`} className="block">
                                <Button
                                  variant="outline"
                                  className="w-full rounded-full border-[#0D9488]/30 bg-[rgba(13,148,136,0.08)] text-[#0D9488] hover:bg-[rgba(13,148,136,0.18)] hover:border-[#0D9488]/40 font-semibold"
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
                </Card>
              )}

              <Card className="border border-white/80 bg-white/85 backdrop-blur shadow-[0_18px_48px_rgba(13,148,136,0.12)] rounded-3xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[rgba(249,115,22,0.12)] text-[#F97316] flex items-center justify-center shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#0B1F1A] font-grotesk">People with Similar Interests</h2>
                      <p className="text-sm text-[#4B5563] font-poppins">
                        Explore new buddy matches curated just for you.
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/matches">
                    <Button className="rounded-full px-5 py-2 bg-linear-to-r from-[#0D9488] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D9488] shadow-lg text-white">
                      View All Matches
                    </Button>
                  </Link>
                </div>

                {similarUsers.length === 0 ? (
                  <Card className="border border-[#0D9488]/15 bg-white/80 shadow-[0_12px_32px_rgba(13,148,136,0.12)] rounded-2xl">
                    <CardContent className="py-14 text-center space-y-4">
                      <p className="text-[#4B5563] font-poppins">No similar users found yet.</p>
                      <p className="text-sm text-[#6B7280] font-poppins">
                        Complete your assessments to find people with similar interests
                      </p>
                      <Link href="/dashboard/matches">
                        <Button className="rounded-full px-6 py-2 bg-linear-to-r from-[#0D9488] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D9488] text-white shadow-lg">
                          Find My Buddy Group
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {similarUsers.map((user) => {
                      const initials = getInitials(user.display_name)
                      const avatarColor = getAvatarColor(user.display_name)
                      return (
                        <Card key={user.id} className="border border-[#0D9488]/15 bg-white/80 shadow-[0_12px_32px_rgba(13,148,136,0.12)] hover:shadow-[0_18px_36px_rgba(13,148,136,0.18)] transition-shadow rounded-2xl overflow-hidden">
                          <CardHeader className="pb-3">
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
                                <CardTitle className="text-lg font-grotesk text-[#0B1F1A]">{user.display_name}</CardTitle>
                                <CardDescription className="font-poppins text-[#6B7280]">@{user.username}</CardDescription>
                              </div>
                              {user.compatibility_score > 0 && (
                                <Badge className="text-xs bg-[rgba(13,148,136,0.12)] text-[#0D9488] border-0 rounded-full px-3 py-1">
                                  {user.compatibility_score}% match
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            {user.bio && (
                              <p className="text-sm text-[#4B5563] mb-3 line-clamp-3 font-poppins">{user.bio}</p>
                            )}
                            {user.leisure_categories && user.leisure_categories.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {user.leisure_categories.slice(0, 3).map((cat, idx) => (
                                  <Badge key={idx} className="text-xs bg-[rgba(13,148,136,0.1)] text-[#0D9488] border-0 rounded-full px-3 py-1">
                                    {cat}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {user.loneliness_category && (
                              <div className="mb-3">
                                <Badge className="text-xs bg-[rgba(249,115,22,0.12)] text-[#F97316] border-0 rounded-full px-3 py-1">
                                  {user.loneliness_category} wellness
                                </Badge>
                              </div>
                            )}
                            <Link href="/dashboard/matches">
                              <Button
                                variant="outline"
                                className="w-full rounded-full border-[#0D9488]/30 bg-[rgba(13,148,136,0.08)] text-[#0D9488] hover:bg-[rgba(13,148,136,0.18)] hover:border-[#0D9488]/40 font-semibold"
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
              </Card>

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
        </div>
      </div>
    </main>
  )
}
