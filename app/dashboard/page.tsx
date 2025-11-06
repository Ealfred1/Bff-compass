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
    },
    {
      icon: Users,
      title: "My Buddy Group",
      description: "AI-matched groups of 3-5 people with shared interests",
      href: "/dashboard/matches",
    },
    {
      icon: BookOpen,
      title: "My Guidance",
      description: "Daily messages & weekly videos for your wellness",
      href: "/dashboard/guidance",
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Join in-person activities and earn badges",
      href: "/dashboard/events",
    },
    {
      icon: Heart,
      title: "Track Mood",
      description: "Monitor your wellbeing journey",
      href: "/dashboard/mood",
    },
    {
      icon: Award,
      title: "My Badges",
      description: "Earn achievements as you connect",
      href: "/dashboard/badges",
    },
    {
      icon: Shield,
      title: "Mental Health Resources",
      description: "Crisis support & wellness resources",
      href: "/dashboard/resources",
      isRed: true,
    },
    {
      icon: User,
      title: "My Profile",
      description: "Manage your account and preferences",
      href: "/dashboard/profile",
    },
  ]

  const moreSectionItems = [
    {
      icon: BookOpen,
      title: "Guidance & Tips",
      description: "Daily motivation & wellness",
      href: "/dashboard/guidance",
    },
    {
      icon: Award,
      title: "My Badges",
      description: "Show off your achievements",
      href: "/dashboard/badges",
    },
    {
      icon: Shield,
      title: "Resources",
      description: "Help & support when you need it",
      href: "/dashboard/resources",
      isRed: true,
    },
    {
      icon: User,
      title: "Profile",
      description: "Update your info & settings",
      href: "/dashboard/profile",
    },
  ]

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-[#F9FAFB]"
      style={{
        backgroundImage: "url('/istockphoto-2105100634-612x612 (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* White overlay for glass effect */}
      <div className="absolute inset-0 bg-[#F9FAFB]/95"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#0D9488]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-[#0D9488]/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1000ms'}}></div>
      <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-[#0D9488]/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2000ms'}}></div>
      
      {/* Content */}
      <div className="relative z-10 lg:ml-64 px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-[#0D9488] rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-2xl">BC</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#0D9488] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-xs">✨</span>
              </div>
            </div>
            <div>
              <h1 className="text-[28px] font-bold text-[#111827] font-grotesk leading-[1.2]">
                Hey {profile?.display_name || user?.email?.split('@')[0] || 'Student'}!
              </h1>
              <p className="text-[14px] text-[#6B7280] font-poppins leading-[1.5] mt-1">
                Ready to connect and thrive today?
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#111827] mb-1">Your Progress</p>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0D9488] rounded-full transition-all duration-500"
                    style={{ 
                      width: statsLoading ? '0%' : `${userStats?.progressPercentage || 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-xs text-[#6B7280]">
                  {statsLoading ? "..." : `${userStats?.progressPercentage || 0}%`}
                </span>
              </div>
            </div>
            <Avatar className="w-12 h-12 border-2 border-[#E5E7EB] shadow-sm">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || 'User'} />
              <AvatarFallback className="bg-[#0D9488] text-white font-bold">
                {profile?.display_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {dashboardFeatures.slice(0, 4).map((feature, index) => (
                <Card key={index} className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        feature.isRed 
                          ? "bg-red-100 text-red-700" 
                          : "bg-[rgba(13,148,136,0.1)] text-[#0D9488]"
                      }`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-[#111827] font-grotesk">{feature.title}</h3>
                        <p className="text-sm text-[#6B7280] font-poppins line-clamp-2 mt-1">{feature.description}</p>
                      </div>
                    </div>
                    <Button 
                      asChild 
                      className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-md font-semibold text-sm px-5 py-2.5 h-auto transition-all duration-150 hover:-translate-y-[1px] shadow-sm hover:shadow-md"
                    >
                      <Link href={feature.href}>
                        Go <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Top Events Section */}
            <Card className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-[#1F2937] font-grotesk">
                  <Calendar className="w-5 h-5 text-[#0D9488]" />
                  <span>Top Events for You</span>
                  <Badge className="text-xs bg-[rgba(13,148,136,0.1)] text-[#0D9488] border-0 px-2 py-0.5 rounded-md font-medium">
                    AI Curated
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-[#F9FAFB] rounded-lg border-b border-[#E5E7EB] last:border-0">
                    <div className="w-10 h-10 bg-[rgba(13,148,136,0.1)] rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#0D9488]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#E5E7EB] rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-[#E5E7EB] rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-[#F9FAFB] rounded-lg border-b border-[#E5E7EB] last:border-0">
                    <div className="w-10 h-10 bg-[rgba(13,148,136,0.1)] rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#0D9488]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#E5E7EB] rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-[#E5E7EB] rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
                    <div className="w-10 h-10 bg-[rgba(13,148,136,0.1)] rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-[#0D9488]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-[#E5E7EB] rounded w-4/5 mb-2"></div>
                      <div className="h-3 bg-[#E5E7EB] rounded w-2/5"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="border-[#0D9488] text-[#0D9488] hover:bg-[rgba(13,148,136,0.05)] rounded-md font-semibold"
                  >
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
              <Card className="bg-[#0D9488] text-white rounded-lg border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.eventsJoined || 0)}
                  </div>
                  <div className="text-xs opacity-90 mt-1">Events Joined</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0D9488] text-white rounded-lg border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.studyGroups || 0)}
                  </div>
                  <div className="text-xs opacity-90 mt-1">Study Groups</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0D9488] text-white rounded-lg border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.messages || 0)}
                  </div>
                  <div className="text-xs opacity-90 mt-1">Messages</div>
                </CardContent>
              </Card>
              <Card className="bg-[#0D9488] text-white rounded-lg border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {statsLoading ? "..." : (userStats?.badges || 0)}
                  </div>
                  <div className="text-xs opacity-90 mt-1">Badges</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access */}
            <Card className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="text-xl font-semibold text-[#1F2937] font-grotesk">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-1">
                  {moreSectionItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          item.isRed 
                            ? "bg-red-100 text-red-700" 
                            : "bg-[rgba(13,148,136,0.1)] text-[#0D9488]"
                        }`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#111827] text-sm">{item.title}</h4>
                          <p className="text-xs text-[#6B7280]">{item.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#9CA3AF]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="bg-[#0D9488] text-white rounded-lg border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">AI Assistant</h3>
                <p className="text-sm opacity-90 mb-4">Get personalized help and recommendations</p>
                <Button 
                  asChild 
                  className="bg-white text-[#0D9488] hover:bg-[#F9FAFB] text-sm px-4 py-2 h-auto rounded-md font-semibold shadow-sm"
                >
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
