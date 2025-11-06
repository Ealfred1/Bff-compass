"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Sparkles } from "lucide-react"
import Link from "next/link"

interface GroupMember {
  id: string
  user_id: string
  role: string
  joined_at: string
  profiles: {
    id: string
    display_name: string
    avatar_url: string | null
    bio: string | null
  }
}

interface BuddyGroup {
  id: string
  group_name: string | null
  is_ai_matched: boolean
  matching_criteria: any
  created_at: string
  status: string
}

interface BuddyGroupCardProps {
  group: BuddyGroup
  members: GroupMember[]
  myRole: string
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function BuddyGroupCard({ group, members, myRole }: BuddyGroupCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const matchingCriteria = group.matching_criteria as any

  return (
    <Card className="border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-primary/10 shadow-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="font-grotesk text-neutral-900">
                {group.group_name || "Your Buddy Group"}
              </CardTitle>
              {group.is_ai_matched && (
                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="h-3 w-3" />
                  AI Matched
                </Badge>
              )}
            </div>
            <CardDescription className="font-poppins text-neutral-600">
              A group of {members.length} {members.length === 1 ? "member" : "members"} with shared interests
            </CardDescription>
          </div>
          {myRole === "creator" && (
            <Badge variant="default" className="font-poppins bg-primary text-white">
              Creator
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Members Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide font-grotesk">
            Group Members ({members.length}/5)
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {members.map((member) => {
              const avatarColor = getAvatarColor(member.profiles.display_name)
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200/50 bg-white/80 backdrop-blur-sm p-4 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                    <AvatarImage src={member.profiles.avatar_url || undefined} />
                    <AvatarFallback className={`${avatarColor} text-white font-poppins font-semibold`}>
                      {getInitials(member.profiles.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 truncate font-grotesk">
                      {member.profiles.display_name}
                    </p>
                    {member.profiles.bio && (
                      <p className="text-sm text-neutral-600 truncate font-poppins">
                        {member.profiles.bio}
                      </p>
                    )}
                  </div>
                  {member.role === "creator" && (
                    <Badge variant="outline" className="text-xs font-poppins border-primary/30 bg-primary/5 text-primary">
                      Creator
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>

          {/* Show empty slots */}
          {members.length < 5 && (
            <div className="flex items-center gap-2 text-sm text-neutral-600 font-poppins bg-neutral-50 rounded-lg p-3">
              <Users className="h-4 w-4 text-primary" />
              <span>{5 - members.length} more {5 - members.length === 1 ? "member" : "members"} can join this group</span>
            </div>
          )}
        </div>

        {/* Matching Criteria */}
        {matchingCriteria && (
          <div className="rounded-xl border border-neutral-200/50 bg-white/60 backdrop-blur-sm p-4 space-y-3 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-900 font-grotesk">Match Criteria</h3>
            {matchingCriteria.loneliness_category && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-600 font-poppins">Wellness Level:</span>
                <Badge variant="secondary" className="font-poppins bg-blue-100 text-blue-800 border-blue-200">
                  {matchingCriteria.loneliness_category}
                </Badge>
              </div>
            )}
            {matchingCriteria.leisure_categories && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-neutral-600 whitespace-nowrap font-poppins">Shared Interests:</span>
                <div className="flex flex-wrap gap-1">
                  {matchingCriteria.leisure_categories.map((cat: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs font-poppins border-green-200 bg-green-50 text-green-800">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button asChild className="flex-1 font-poppins bg-primary hover:bg-primary/90 text-white border-0 shadow-md" size="lg">
            <Link href={`/dashboard/messages/${group.id}`}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Group Chat
            </Link>
          </Button>
        </div>

        {/* Group Info */}
        <div className="text-xs text-neutral-500 text-center font-poppins">
          Group created {new Date(group.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
