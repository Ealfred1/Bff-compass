"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  Calendar,
  Users,
  ArrowRight,
  Bot,
  User,
  Award,
  Shield,
  BookOpen,
  Heart,
} from "lucide-react"

interface UserStats {
  eventsJoined: number
  studyGroups: number
  messages: number
  badges: number
  buddyGroupsCreated: number
  bookmarks: number
  videoViews: number
  totalConnections: number
  totalEngagement: number
  progressPercentage: number
  lonelinessScore: number
  lonelinessCategory: string
  surveyCompleted: boolean
  lastUpdated: string
}

function DashboardContent() {
  const { user, profile } = useAuth()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return
      
      try {
        setStatsLoading(true)
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const stats = await response.json()
          setUserStats(stats)
        } else {
          console.error('Failed to fetch user stats:', response.status)
          // Set fallback stats if API fails
          setUserStats({
            eventsJoined: 0,
            studyGroups: 0,
            messages: 0,
            badges: 0,
            buddyGroupsCreated: 0,
            bookmarks: 0,
            videoViews: 0,
            totalConnections: 0,
            totalEngagement: 0,
            progressPercentage: 0,
            lonelinessScore: 0,
            lonelinessCategory: 'Unknown',
            surveyCompleted: false,
            lastUpdated: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchUserStats()
  }, [user])

  const dashboardFeatures = [
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Ask about events, connections, badges, and your buddy group",
      href: "/dashboard/chat",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: Users,
      title: "My Buddy Group",
      description: "AI-matched groups of 3-5 people with shared interests",
      href: "/dashboard/matches",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: BookOpen,
      title: "My Guidance",
      description: "Daily messages & weekly videos for your wellness",
      href: "/dashboard/guidance",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Join in-person activities and earn badges",
      href: "/dashboard/events",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: Heart,
      title: "Track Mood",
      description: "Monitor your wellbeing journey",
      href: "/dashboard/mood",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: Award,
      title: "My Badges",
      description: "Earn achievements as you connect",
      href: "/dashboard/badges",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: Shield,
      title: "Mental Health Resources",
      description: "Crisis support & wellness resources",
      href: "/dashboard/resources",
      color: "bg-gradient-to-br from-red-100 to-red-200 text-red-700",
    },
    {
      icon: User,
      title: "My Profile",
      description: "Manage your account and preferences",
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
  ]

  const moreSectionItems = [
    {
      icon: BookOpen,
      title: "Guidance & Tips",
      description: "Daily motivation & wellness 💪",
      href: "/dashboard/guidance",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: Award,
      title: "My Badges",
      description: "Show off your achievements 🏆",
      href: "/dashboard/badges",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
    {
      icon: Shield,
      title: "Resources",
      description: "Help & support when you need it 🆘",
      href: "/dashboard/resources",
      color: "bg-gradient-to-br from-red-100 to-red-200 text-red-700",
    },
    {
      icon: User,
      title: "Profile",
      description: "Update your info & settings ⚙️",
      href: "/dashboard/profile",
      color: "bg-gradient-to-br from-primary/20 to-primary/10 text-primary",
    },
  ]

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/istockphoto-2105100634-612x612 (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* White overlay for glass effect */}
      <div className="absolute inset-0 bg-white/90"></div>
      
      {/* Floating elements for Gen Z vibes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      {/* Content */}
      <div className="relative z-10 lg:ml-64 px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">BC</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✨</span>
              </div>
            </div>
          <div>
              <h1 className="text-2xl font-bold text-neutral-900 font-grotesk">
                Hey {profile?.display_name || user?.email?.split('@')[0] || 'Student'}! 👋
            </h1>
              <p className="text-neutral-600 font-poppins text-sm">
                Ready to connect and thrive today? 🚀
            </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900">Your Progress</p>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                    style={{ 
                      width: statsLoading ? '0%' : `${userStats?.progressPercentage || 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-xs text-neutral-600">
                  {statsLoading ? "..." : `${userStats?.progressPercentage || 0}%`}
                </span>
              </div>
            </div>
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || 'User'} />
              <AvatarFallback className="bg-primary text-white font-bold">
                {profile?.display_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Gen Z Style Compact Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
          {dashboardFeatures.slice(0, 4).map((feature, index) => (
                <Card key={index} className="group bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white/95 transition-all duration-200 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-neutral-900 font-grotesk text-sm">{feature.title}</h3>
                        <p className="text-xs text-neutral-600 font-poppins line-clamp-2">{feature.description}</p>
                      </div>
                </div>
                    <Button asChild className="w-full justify-center p-3 h-10 font-semibold bg-transparent hover:text-white hover:bg-primary text-sm rounded-xl">
                  <Link href={feature.href}>
                        Go <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

            {/* Personalized Events & Study Groups */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl border-0">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="flex items-center space-x-2 font-grotesk text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Top Events for You</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">AI Curated</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-neutral-200 rounded w-4/5 mb-2"></div>
                      <div className="h-3 bg-neutral-200 rounded w-2/5"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/events">View All Events</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Quick Access */}
                <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.eventsJoined || 0)}
                  </div>
                  <div className="text-xs opacity-90">Events Joined</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.studyGroups || 0)}
                  </div>
                  <div className="text-xs opacity-90">Study Groups</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.messages || 0)}
                  </div>
                  <div className="text-xs opacity-90">Messages</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.badges || 0)}
                  </div>
                  <div className="text-xs opacity-90">Badges</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl border-0">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="font-grotesk text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-2">
                  {moreSectionItems.slice(0, 4).map((item, index) => (
                    <Link key={index} href={item.href}>
                      <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer">
                        <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-neutral-600">{item.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">AI Assistant</h3>
                <p className="text-sm opacity-90 mb-3">Get personalized help and recommendations</p>
                <Button asChild className="bg-white text-primary hover:bg-primary/10 text-sm px-4 py-2 h-8">
                  <Link href="/dashboard/chat">Chat Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
      
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}
