"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageBubble } from "@/components/message-bubble"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
}

interface Connection {
  id: string
  user1_id: string
  user2_id: string
  other_user: {
    id: string
    display_name: string
  }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [connection, setConnection] = useState<Connection | null>(null)
  const [messageContent, setMessageContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const connectionId = params.connectionId as string
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    initializeConnection()
    const interval = setInterval(loadMessages, 2000)
    return () => clearInterval(interval)
  }, [])

  const initializeConnection = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")
      setUserId(user.id)

      const { data: conn, error: connError } = await supabase
        .from("connections")
        .select("id, user1_id, user2_id")
        .eq("id", connectionId)
        .single()

      if (connError) throw connError

      const otherUserId = conn.user1_id === user.id ? conn.user2_id : conn.user1_id

      const { data: otherUserData, error: userError } = await supabase
        .from("profiles")
        .select("id, display_name")
        .eq("id", otherUserId)
        .single()

      if (userError) throw userError

      setConnection({
        id: conn.id,
        user1_id: conn.user1_id,
        user2_id: conn.user2_id,
        other_user: otherUserData,
      })

      loadMessages()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load connection")
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/messages/get?connectionId=${connectionId}`)
      if (!response.ok) throw new Error("Failed to load messages")
      const { messages: newMessages } = await response.json()
      setMessages(newMessages)
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : "Failed to load messages")
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim() || !connection) return

    setIsSending(true)
    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId: connection.id,
          content: messageContent,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")
      setMessageContent("")
      loadMessages()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-svh bg-background">
        <header className="border-b border-border py-4 px-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-svh bg-background">
        <header className="border-b border-border py-4 px-6">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Chat with {connection?.other_user.display_name}</h1>
            <p className="text-sm text-muted-foreground">Connected Buddy</p>
          </div>
          <Link href="/dashboard/connections">
            <Button variant="outline" className="border-border hover:bg-muted font-medium bg-transparent">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border flex flex-col h-[600px]">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      content={message.content}
                      isSent={message.sender_id === userId}
                      senderName={connection?.other_user.display_name || "User"}
                      timestamp={message.created_at}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </CardContent>
            <CardHeader className="border-t border-border p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  disabled={isSending}
                  className="border-border bg-input text-foreground flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSending || !messageContent.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-medium px-6"
                >
                  {isSending ? "..." : "Send"}
                </Button>
              </form>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  )
}
