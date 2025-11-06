"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { User, School, Mail, Calendar, Shield, Edit3, Camera, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    display_name: "",
    username: "",
    bio: "",
    school_id: "",
    avatar_url: "",
  })
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (!currentUser) return

      setUser(currentUser)

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single()

      if (error && error.code !== "PGRST116") throw error

      if (profileData) {
        setProfile(profileData)
        setFormData({
          display_name: profileData.display_name || "",
          username: profileData.username || "",
          bio: profileData.bio || "",
          school_id: profileData.school_id || "",
          avatar_url: profileData.avatar_url || "",
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast.error("Failed to load profile")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (!currentUser) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: formData.display_name,
          username: formData.username,
          bio: formData.bio || null,
          school_id: formData.school_id || null,
          avatar_url: formData.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id)

      if (error) throw error

      toast.success("Profile updated successfully!")
      await loadProfile()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error(`Failed to update profile: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isGoogleUser = user?.app_metadata?.provider === "google"

  // Get user stats
  const [stats, setStats] = useState({
    eventsAttended: 0,
    messagesSent: 0,
    connections: 0,
    badgesEarned: 0,
  })

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      if (!currentUser) return

      // Get event attendance count
      const { count: eventCount } = await supabase
        .from("event_attendance")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)

      // Get messages count
      const { count: messageCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", currentUser.id)

      // Get buddy group members count
      const { count: groupCount } = await supabase
        .from("buddy_group_members")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)

      // Get badges count
      const { count: badgeCount } = await supabase
        .from("user_badges")
        .select("*", { count: "exact", head: true })
        .eq("user_id", currentUser.id)

      setStats({
        eventsAttended: eventCount || 0,
        messagesSent: messageCount || 0,
        connections: groupCount || 0,
        badgesEarned: badgeCount || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-grotesk">Profile Settings</h1>
          <p className="text-lg text-neutral-600 font-poppins">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Profile Picture Section */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-grotesk">
                  <Camera className="w-5 h-5" />
                  <span>Profile Picture</span>
                </CardTitle>
                <CardDescription className="font-poppins">
                  {isGoogleUser
                    ? "Your profile picture is synced from your Google account"
                    : "Your profile picture is visible to other students"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url || ""} alt={profile?.display_name || ""} />
                    <AvatarFallback className="text-3xl bg-primary-100 text-primary-700 font-grotesk">
                      {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isGoogleUser && (
                    <Badge className="absolute -bottom-2 -right-2 bg-green-100 text-green-800 border-green-200">
                      Google
                    </Badge>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-neutral-600 font-poppins">{profile?.display_name || "No name set"}</p>
                  <p className="text-xs text-neutral-500 font-poppins">{user?.email}</p>
                </div>
                {!isGoogleUser && (
                  <div className="w-full space-y-2">
                    <Label htmlFor="avatar_url" className="text-sm font-medium text-neutral-700">
                      Avatar URL
                    </Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        id="avatar_url"
                        type="url"
                        value={formData.avatar_url}
                        onChange={(e) => handleInputChange("avatar_url", e.target.value)}
                        className="pl-10"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Info Card */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 font-grotesk">
                  <Shield className="w-5 h-5" />
                  <span>Account Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 font-poppins">Account Type</span>
                  <Badge variant={isGoogleUser ? "default" : "secondary"}>
                    {isGoogleUser ? "Google Account" : "Email Account"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 font-poppins">Member Since</span>
                  <span className="text-sm font-medium text-neutral-900 font-poppins">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Profile Information */}
          <Card className="lg:col-span-2 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-grotesk">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription className="font-poppins">
                Update your personal details and academic information
                {isGoogleUser && (
                  <span className="block mt-1 text-xs text-green-600">
                    Some information is synced from your Google account
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name" className="flex items-center space-x-2 font-poppins">
                      <span>Display Name</span>
                      {isGoogleUser && <Badge variant="outline" className="text-xs">Google</Badge>}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        id="display_name"
                        value={formData.display_name}
                        onChange={(e) => handleInputChange("display_name", e.target.value)}
                        className="pl-10"
                        placeholder="Enter your display name"
                        disabled={isGoogleUser}
                      />
                    </div>
                    {isGoogleUser && (
                      <p className="text-xs text-neutral-500 font-poppins">Name is managed by your Google account</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-poppins">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2 font-poppins">
                      <span>Email</span>
                      {isGoogleUser && <Badge variant="outline" className="text-xs">Google</Badge>}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        className="pl-10"
                        disabled
                      />
                    </div>
                    {isGoogleUser && (
                      <p className="text-xs text-neutral-500 font-poppins">Email is managed by your Google account</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school_id" className="font-poppins">School ID</Label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        id="school_id"
                        value={formData.school_id}
                        onChange={(e) => handleInputChange("school_id", e.target.value)}
                        className="pl-10"
                        placeholder="Enter your school ID"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="font-poppins">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell other students about yourself..."
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full font-poppins">
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Account Stats */}
        <Card className="mt-8 border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 font-grotesk">
              <Calendar className="w-5 h-5" />
              <span>Account Overview</span>
            </CardTitle>
            <CardDescription className="font-poppins">Your activity on BFF-Connect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 font-grotesk">{stats.eventsAttended}</div>
                <div className="text-sm text-neutral-600 font-poppins">Events Joined</div>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-xl">
                <div className="text-2xl font-bold text-secondary-600 font-grotesk">{stats.messagesSent}</div>
                <div className="text-sm text-neutral-600 font-poppins">Messages Sent</div>
              </div>
              <div className="text-center p-4 bg-accent-50 rounded-xl">
                <div className="text-2xl font-bold text-accent-600 font-grotesk">{stats.connections}</div>
                <div className="text-sm text-neutral-600 font-poppins">Connections</div>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-xl">
                <div className="text-2xl font-bold text-primary-600 font-grotesk">{stats.badgesEarned}</div>
                <div className="text-sm text-neutral-600 font-poppins">Badges Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

