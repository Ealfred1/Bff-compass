"use client"

import React, { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Bot,
  Sparkles,
  MessageCircle,
  Loader2,
  RefreshCw,
  Settings,
  Calendar,
  BookOpen,
  Users,
  Target,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hi! I'm your BFF COMPASS assistant. I can help you with:\n\n• Finding events on the platform\n• Connecting with people who share your interests\n• Learning how to earn badges\n• Questions about your buddy group\n\nWhat would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .eq("id", user.id)
        .single()

      setProfile(profileData)
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Add a "thinking" message to show the chatbot is working
    const thinkingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Thinking...",
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, thinkingMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Remove the thinking message and add the real response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== thinkingMessage.id)
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            content: data.response,
            role: "assistant",
            timestamp: new Date(),
          },
        ]
      })
    } catch (error) {
      console.error("Error:", error)

      // Remove the thinking message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== thinkingMessage.id)
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            content:
              "Sorry, I encountered an error. Please try again. If the problem persists, you can always check the Events, Connections, or Badges pages directly!",
            role: "assistant",
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        content:
          "Hi! I'm your BFF COMPASS assistant. I can help you with:\n\n• Finding events on the platform\n• Connecting with people who share your interests\n• Learning how to earn badges\n• Questions about your buddy group\n\nWhat would you like to know?",
        role: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getInitials = (name: string): string => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string): string => {
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

const formatMessageContent = (content: string, isUser: boolean): string => {
  const sanitized = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>")

  const lines = sanitized.split(/\r?\n/)
  const htmlParts: string[] = []
  let listBuffer: string[] = []

  const flushList = () => {
    if (listBuffer.length > 0) {
      const bulletClass = isUser ? "marker:text-white" : "marker:text-[#0D9488]"
      htmlParts.push(
        `<ul class="list-disc list-outside pl-5 space-y-1 text-sm ${bulletClass}">${listBuffer.join("")}</ul>`,
      )
      listBuffer = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList()
      return
    }

    if (/^[\-•]/.test(trimmed)) {
      const itemText = trimmed.replace(/^[\-•]\s*/, "")
      listBuffer.push(`<li>${itemText}</li>`)
    } else {
      flushList()
      const withLinks = trimmed.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        `<a href="$2" class="${
          isUser ? "text-white font-semibold underline-offset-4" : "text-[#0D9488] hover:text-[#0F766E]"
        } underline-offset-2 hover:underline">$1</a>`,
      )
      htmlParts.push(`<p class="text-sm leading-relaxed">${withLinks}</p>`)
    }
  })

  flushList()
  return htmlParts.join("")
}

const renderMessage = (message: Message) => {
  const isUser = message.role === "user"

  return (
    <div
      key={message.id}
      className={`flex gap-3 mb-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <Avatar className={`w-8 h-8 ${isUser ? "ml-3" : "mr-3"}`}>
        {isUser ? (
          <>
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-linear-to-br from-[#0D9488]/10 to-[#0F766E]/20 text-[#0D9488]">
              {getInitials(profile?.display_name || profile?.username || "U")}
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-linear-to-br from-[#0D9488]/10 to-[#0F766E]/20 text-[#0D9488]">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={`flex-1 max-w-[85%] ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`inline-block px-5 py-4 rounded-2xl leading-relaxed ${
            isUser
              ? "bg-linear-to-r from-[#0D9488] to-[#0F766E] text-white shadow-md"
              : "bg-white border border-neutral-200 text-neutral-800 shadow-sm"
          }`}
        >
          <div className={`prose prose-sm max-w-none ${isUser ? "text-white" : "text-neutral-800"}`}>
            <div
              className="[&>p]:my-2 [&>ul]:my-3"
              dangerouslySetInnerHTML={{
                __html: formatMessageContent(message.content, isUser),
              }}
            />
          </div>
        </div>
        <div className={`text-xs text-neutral-500 mt-2 ${isUser ? "text-right" : "text-left"}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#F9FAFB]"
      style={{
        backgroundImage: "url('/istockphoto-2105100634-612x612 (1).jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[#F9FAFB]/92 backdrop-blur-sm"></div>
      <div className="absolute -top-10 -left-20 w-72 h-72 bg-[#0D9488]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 -right-16 w-64 h-64 bg-[#0D9488]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#0F766E]/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 lg:ml-64 px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-[#0D9488]/80 font-semibold">BFF Compass AI</p>
              <h1 className="text-3xl font-grotesk font-bold text-[#0B1F1A] mt-1">
                Chat with Buddy Group
              </h1>
              <p className="text-sm text-[#4B5563] font-poppins">Get guidance, plan meetups, and stay connected.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="rounded-full bg-white/70 hover:bg-white text-[#0D9488] shadow-sm hover:shadow"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-white/70 hover:bg-white text-[#0D9488] shadow-sm hover:shadow"
                >
                  Back
                </Button>
              </Link>
            </div>
          </div>

          <Card className="bg-white/85 backdrop-blur border border-white/60 shadow-[0_25px_50px_rgba(13,148,136,0.12)] rounded-3xl overflow-hidden">
            <div className="bg-linear-to-r from-[#0D9488] via-[#0F766E] to-[#0D9488] px-8 py-6 text-white flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold font-grotesk">Your Buddy Group</h2>
                  <p className="text-sm text-white/80 font-poppins">2 members • real-time updates • secure space</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-[#0D9488] hover:bg-[#E0F2F1] rounded-full px-5 py-2 h-auto shadow-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Plan Hangout
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-[#0D9488] hover:bg-[#E0F2F1] rounded-full px-5 py-2 h-auto shadow-sm"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Group
                </Button>
              </div>
            </div>

            <div className="px-6 pb-6 pt-4">
              <ScrollArea className="h-[520px] p-4 bg-white/60 rounded-2xl border border-[#0D9488]/10 shadow-inner chat-scrollbar">
                <div className="space-y-4">
                  {messages.map(renderMessage)}
                  {loading && (
                    <div className="flex gap-3 mb-6">
                      <Avatar className="w-9 h-9 mr-3">
                      <AvatarFallback className="bg-linear-to-br from-[#0D9488]/15 to-[#0F766E]/25 text-[#0D9488]">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="inline-block px-5 py-3 rounded-2xl bg-white border border-[#0D9488]/20 shadow-sm">
                          <div className="flex items-center gap-2 text-[#0D9488]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm font-medium">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="mt-6 bg-white/80 border border-[#0D9488]/10 rounded-2xl p-4 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message to your buddy group..."
                        className="w-full pl-4 pr-12 py-3 border border-[#0D9488]/10 bg-white/90 rounded-xl shadow-sm focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] transition-all"
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0D9488]/60">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="px-6 py-3 bg-linear-to-r from-[#0D9488] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D9488] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("What events are available this week?")}
                      className="text-xs bg-white hover:bg-[#E0F2F1] text-[#0D9488] border-[#0D9488]/20 rounded-full px-4 py-2"
                    >
                      <Calendar className="w-3 h-3 mr-1.5" />
                      Events
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Who's free for a study session?")}
                      className="text-xs bg-white hover:bg-[#E0F2F1] text-[#0D9488] border-[#0D9488]/20 rounded-full px-4 py-2"
                    >
                      <Users className="w-3 h-3 mr-1.5" />
                      Buddy Group
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("How can we earn our next badge together?")}
                      className="text-xs bg-white hover:bg-[#E0F2F1] text-[#0D9488] border-[#0D9488]/20 rounded-full px-4 py-2"
                    >
                      <Target className="w-3 h-3 mr-1.5" />
                      Badges
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setInput("Any updates on our matches?")}
                      className="text-xs bg-white hover:bg-[#E0F2F1] text-[#0D9488] border-[#0D9488]/20 rounded-full px-4 py-2"
                    >
                      <Users className="w-3 h-3 mr-1.5" />
                      Connections
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <p className="text-sm text-[#4B5563] font-poppins">
              Powered by AI • Your conversations are private and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
