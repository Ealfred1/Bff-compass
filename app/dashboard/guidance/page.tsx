"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Heart, Video, Calendar, CheckCircle, Play } from "lucide-react"

interface GuidanceContent {
  id: string
  content_type: "daily_message" | "weekly_video"
  loneliness_category: string
  title: string
  content: string | null
  video_url: string | null
  day_of_week: number | null
  created_at: string
}

interface UserGuidanceHistory {
  guidance_content_id: string
  viewed_at: string
  completed: boolean
}

export default function GuidancePage() {
  const [dailyMessage, setDailyMessage] = useState<GuidanceContent | null>(null)
  const [weeklyVideo, setWeeklyVideo] = useState<GuidanceContent | null>(null)
  const [viewedContent, setViewedContent] = useState<Set<string>>(new Set())
  const [lonelinessCategory, setLonelinessCategory] = useState<string>("Moderate")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadUserCategory()
    loadGuidanceContent()
  }, [])

  const loadUserCategory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("loneliness_assessments")
        .select("loneliness_category")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (data?.loneliness_category) {
        setLonelinessCategory(data.loneliness_category)
      }
    } catch (error) {
      console.error("Error loading category:", error)
    }
  }

  const loadGuidanceContent = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get user's viewed content
      const { data: historyData } = await supabase
        .from("user_guidance_history")
        .select("guidance_content_id, viewed_at, completed")
        .eq("user_id", user.id)

      const viewed = new Set(historyData?.map((h) => h.guidance_content_id) || [])
      setViewedContent(viewed)

      // Get loneliness category
      const { data: assessmentData } = await supabase
        .from("loneliness_assessments")
        .select("loneliness_category")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      const category = assessmentData?.loneliness_category || "Moderate"

      // Get today's daily message
      const { data: dailyData } = await supabase
        .from("guidance_content")
        .select("*")
        .eq("content_type", "daily_message")
        .eq("loneliness_category", category)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setDailyMessage(dailyData)

      // Get this week's video (based on day of week)
      const today = new Date().getDay()
      const { data: videoData } = await supabase
        .from("guidance_content")
        .select("*")
        .eq("content_type", "weekly_video")
        .eq("loneliness_category", category)
        .eq("day_of_week", today)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setWeeklyVideo(videoData)
    } catch (error) {
      console.error("Error loading guidance:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsViewed = async (contentId: string, completed: boolean = false) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from("user_guidance_history").upsert({
        user_id: user.id,
        guidance_content_id: contentId,
        completed,
        viewed_at: new Date().toISOString(),
      })

      setViewedContent((prev) => new Set([...prev, contentId]))
    } catch (error) {
      console.error("Error marking as viewed:", error)
    }
  }

  const getDayName = (dayNum: number | null) => {
    if (dayNum === null) return ""
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayNum]
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Low":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "Moderate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "Moderately High":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      case "High":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-poppins">My Guidance</h1>
            <p className="text-sm text-muted-foreground font-poppins">
              Personalized wellness content for your journey
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent font-poppins">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Wellness Level Badge */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-poppins">Your Current Wellness Level</p>
                  <Badge className={`${getCategoryColor(lonelinessCategory)} text-base font-poppins`}>
                    {lonelinessCategory}
                  </Badge>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-muted-foreground font-poppins">Loading your guidance content...</p>
            </div>
          ) : (
            <Tabs defaultValue="daily" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="daily" className="font-poppins">
                  <Heart className="mr-2 h-4 w-4" />
                  Daily Message
                </TabsTrigger>
                <TabsTrigger value="weekly" className="font-poppins">
                  <Video className="mr-2 h-4 w-4" />
                  Weekly Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="space-y-4">
                {dailyMessage ? (
                  <Card className="border-primary/30">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2 font-poppins">{dailyMessage.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 font-poppins">
                            <Calendar className="h-4 w-4" />
                            {new Date().toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        {viewedContent.has(dailyMessage.id) && (
                          <Badge variant="secondary" className="gap-1 font-poppins">
                            <CheckCircle className="h-3 w-3" />
                            Read
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap font-poppins">
                          {dailyMessage.content}
                        </p>
                      </div>

                      {!viewedContent.has(dailyMessage.id) && (
                        <Button onClick={() => markAsViewed(dailyMessage.id)} className="w-full font-poppins">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Read
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-poppins">No daily message available yet.</p>
                      <p className="text-sm text-muted-foreground mt-2 font-poppins">Check back tomorrow for new content!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="weekly" className="space-y-4">
                {weeklyVideo ? (
                  <Card className="border-secondary/30">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2 font-poppins">{weeklyVideo.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 font-poppins">
                            <Calendar className="h-4 w-4" />
                            {getDayName(weeklyVideo.day_of_week)}'s Video
                          </CardDescription>
                        </div>
                        {viewedContent.has(weeklyVideo.id) && (
                          <Badge variant="secondary" className="gap-1 font-poppins">
                            <CheckCircle className="h-3 w-3" />
                            Watched
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {weeklyVideo.content && (
                        <p className="text-muted-foreground font-poppins">{weeklyVideo.content}</p>
                      )}

                      {weeklyVideo.video_url && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                          <iframe
                            src={weeklyVideo.video_url}
                            title={weeklyVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      )}

                      {!viewedContent.has(weeklyVideo.id) && (
                        <Button
                          onClick={() => markAsViewed(weeklyVideo.id, true)}
                          className="w-full font-poppins"
                          variant="secondary"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Mark as Watched
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-poppins">No video available for today.</p>
                      <p className="text-sm text-muted-foreground mt-2 font-poppins">
                        Videos are released weekly based on your wellness level.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </main>
  )
}

