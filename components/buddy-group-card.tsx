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
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="font-poppins">
                {group.group_name || "Your Buddy Group"}
              </CardTitle>
              {group.is_ai_matched && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Matched
                </Badge>
              )}
            </div>
            <CardDescription className="font-poppins">
              A group of {members.length} {members.length === 1 ? "member" : "members"} with shared interests
            </CardDescription>
          </div>
          {myRole === "creator" && (
            <Badge variant="default" className="font-poppins">
              Creator
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Members Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide font-poppins">
            Group Members ({members.length}/5)
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.profiles.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-poppins">
                    {getInitials(member.profiles.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate font-poppins">
                    {member.profiles.display_name}
                  </p>
                  {member.profiles.bio && (
                    <p className="text-sm text-muted-foreground truncate font-poppins">
                      {member.profiles.bio}
                    </p>
                  )}
                </div>
                {member.role === "creator" && (
                  <Badge variant="outline" className="text-xs font-poppins">
                    Creator
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Show empty slots */}
          {members.length < 5 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-poppins">
              <Users className="h-4 w-4" />
              <span>{5 - members.length} more {5 - members.length === 1 ? "member" : "members"} can join this group</span>
            </div>
          )}
        </div>

        {/* Matching Criteria */}
        {matchingCriteria && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground font-poppins">Match Criteria</h3>
            {matchingCriteria.loneliness_category && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground font-poppins">Wellness Level:</span>
                <Badge variant="secondary" className="font-poppins">
                  {matchingCriteria.loneliness_category}
                </Badge>
              </div>
            )}
            {matchingCriteria.leisure_categories && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap font-poppins">Shared Interests:</span>
                <div className="flex flex-wrap gap-1">
                  {matchingCriteria.leisure_categories.map((cat: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-xs font-poppins">
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
          <Button asChild className="flex-1 font-poppins" size="lg">
            <Link href={`/dashboard/messages/${group.id}`}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Group Chat
            </Link>
          </Button>
        </div>

        {/* Group Info */}
        <div className="text-xs text-muted-foreground text-center font-poppins">
          Group created {new Date(group.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}

