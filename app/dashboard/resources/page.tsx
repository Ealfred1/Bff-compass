"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Phone, ExternalLink, Search, AlertCircle, Heart, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MentalHealthResource {
  id: string
  resource_type: "emergency" | "non_emergency" | "support_group" | "therapy" | "hotline"
  title: string
  description: string | null
  phone_number: string | null
  website_url: string | null
  available_hours: string | null
  is_crisis_resource: boolean
  display_order: number
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<MentalHealthResource[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("mental_health_resources")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error("Error loading resources:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const emergencyResources = filteredResources.filter((r) => r.is_crisis_resource)
  const otherResources = filteredResources.filter((r) => !r.is_crisis_resource)

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return "🚨"
      case "hotline":
        return "📞"
      case "support_group":
        return "👥"
      case "therapy":
        return "💬"
      default:
        return "ℹ️"
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "destructive"
      case "hotline":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-poppins">Mental Health Resources</h1>
            <p className="text-sm text-muted-foreground font-poppins">
              Support and resources for your mental wellness
            </p>
          </div>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-border hover:bg-muted font-medium bg-transparent font-poppins"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Crisis Alert Banner */}
          <Alert variant="destructive" className="border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold">If you're in crisis, help is available now</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>
                If you're having thoughts of hurting yourself or others, please reach out immediately. You are not
                alone.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default" size="lg" className="bg-white text-destructive hover:bg-white/90">
                  <a href="tel:988">
                    <Phone className="mr-2 h-4 w-4" />
                    Call 988 Now
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20"
                >
                  <a href="tel:911">Call 911</a>
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-poppins"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-4 text-muted-foreground font-poppins">Loading resources...</p>
            </div>
          ) : (
            <>
              {/* Emergency/Crisis Resources */}
              {emergencyResources.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <h2 className="text-2xl font-bold text-foreground font-poppins">Crisis & Emergency Support</h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {emergencyResources.map((resource) => (
                      <Card key={resource.id} className="border-destructive/50 border-2">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{getResourceIcon(resource.resource_type)}</span>
                                <Badge variant={getResourceColor(resource.resource_type) as any}>
                                  {resource.resource_type.replace("_", " ")}
                                </Badge>
                              </div>
                              <CardTitle className="text-xl font-poppins">{resource.title}</CardTitle>
                              {resource.description && (
                                <CardDescription className="mt-2 font-poppins">{resource.description}</CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {resource.available_hours && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="font-poppins">{resource.available_hours}</span>
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            {resource.phone_number && (
                              <Button asChild variant="destructive" size="lg" className="w-full font-poppins">
                                <a href={`tel:${resource.phone_number}`}>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call {resource.phone_number}
                                </a>
                              </Button>
                            )}

                            {resource.website_url && (
                              <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full font-poppins"
                              >
                                <a href={resource.website_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Visit Website
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Resources */}
              {otherResources.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground font-poppins">
                      Additional Support & Resources
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {otherResources.map((resource) => (
                      <Card key={resource.id} className="border-border hover:border-primary/50 transition-colors">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getResourceIcon(resource.resource_type)}</span>
                            <Badge variant={getResourceColor(resource.resource_type) as any}>
                              {resource.resource_type.replace("_", " ")}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-poppins">{resource.title}</CardTitle>
                          {resource.description && (
                            <CardDescription className="font-poppins">{resource.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {resource.available_hours && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span className="font-poppins">{resource.available_hours}</span>
                            </div>
                          )}

                          <div className="space-y-2">
                            {resource.phone_number && (
                              <Button asChild variant="default" size="sm" className="w-full font-poppins">
                                <a href={`tel:${resource.phone_number}`}>
                                  <Phone className="mr-2 h-3 w-3" />
                                  {resource.phone_number}
                                </a>
                              </Button>
                            )}

                            {resource.website_url && (
                              <Button asChild variant="outline" size="sm" className="w-full font-poppins">
                                <a href={resource.website_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  Website
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredResources.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground font-poppins">No resources found matching your search.</p>
                </div>
              )}
            </>
          )}

          {/* Additional Help Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-poppins">Need More Support?</CardTitle>
              <CardDescription className="font-poppins">
                Remember, the BFF COMPASS community is here for you too
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground font-poppins">
                Don't hesitate to reach out to your buddy group or explore more connections on the platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="default" className="font-poppins">
                  <Link href="/dashboard/connections">Go to My Connections</Link>
                </Button>
                <Button asChild variant="outline" className="font-poppins">
                  <Link href="/dashboard/mood">Track My Mood</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
