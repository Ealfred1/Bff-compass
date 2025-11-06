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
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {getInitials(profile?.display_name || profile?.username || "U")}
              </AvatarFallback>
            </>
          ) : (
            <>
              <AvatarFallback className="bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>

        <div className={`flex-1 max-w-[85%] ${isUser ? "text-right" : "text-left"}`}>
          <div
            className={`inline-block p-4 rounded-2xl ${
              isUser
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                : "bg-white border border-neutral-200 text-neutral-800 shadow-sm"
            }`}
          >
            <div className="prose prose-sm max-w-none">
              <div
                className={`${isUser ? "text-white" : "text-neutral-800"}`}
                dangerouslySetInnerHTML={{
                  __html: message.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                    .replace(/\n/g, "<br>")
                    .replace(
                      /\[([^\]]+)\]\(([^)]+)\)/g,
                      '<a href="$2" class="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors duration-200 cursor-pointer" onclick="window.location.href=\'$2\'">$1</a>',
                    )
                    .replace(/•/g, '<span class="text-primary-500 mr-2">•</span>'),
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-neutral-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 font-grotesk">BFF Compass AI</h1>
                <p className="text-sm text-neutral-600 font-poppins">Your personal academic assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearChat} className="text-neutral-600 hover:text-neutral-900">
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          {/* Messages */}
          <ScrollArea className="h-[600px] p-6 chat-scrollbar">
            <div className="space-y-4">
              {messages.map(renderMessage)}
              {loading && (
                <div className="flex gap-3 mb-6">
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="inline-block p-4 rounded-2xl bg-white border border-neutral-200">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-neutral-200/50 bg-white/50 p-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about events, sessions, or anything else..."
                  className="w-full pl-4 pr-12 py-3 border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 transition-all duration-200"
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <MessageCircle className="w-5 h-5 text-neutral-400" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </form>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("What events are available?")}
                className="text-xs bg-white/60 hover:bg-white/80 border-neutral-200 rounded-lg"
              >
                <Calendar className="w-3 h-3 mr-1" />
                Events
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Who's in my buddy group?")}
                className="text-xs bg-white/60 hover:bg-white/80 border-neutral-200 rounded-lg"
              >
                <Users className="w-3 h-3 mr-1" />
                Buddy Group
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("How do I earn badges?")}
                className="text-xs bg-white/60 hover:bg-white/80 border-neutral-200 rounded-lg"
              >
                <Target className="w-3 h-3 mr-1" />
                Badges
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("Show me people with similar interests")}
                className="text-xs bg-white/60 hover:bg-white/80 border-neutral-200 rounded-lg"
              >
                <Users className="w-3 h-3 mr-1" />
                Connections
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500 font-poppins">
            Powered by AI • Your data is secure and private
          </p>
        </div>
      </div>
    </div>
  )
}
