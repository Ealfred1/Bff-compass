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
import { decryptStoredMessage } from "@/lib/encryption"

interface SenderProfile {
  id: string
  display_name: string
  username?: string
  avatar_url?: string | null
}

interface Message {
  id: string
  content?: string
  encrypted_content?: string
  encryption_iv?: string
  created_at: string
  sender_id: string
  profiles: SenderProfile | null
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
  const [isGroup, setIsGroup] = useState(false)
  const [groupMemberCount, setGroupMemberCount] = useState<number | null>(null)
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

      // Try to load as buddy group first (new system)
      const { data: group, error: groupError } = await supabase
        .from("buddy_groups")
        .select("id, group_name")
        .eq("id", connectionId)
        .maybeSingle()

      if (group) {
        // It's a buddy group - set up for group chat
        setIsGroup(true)
        
        // Get member count
        const { count } = await supabase
          .from("buddy_group_members")
          .select("*", { count: "exact", head: true })
          .eq("group_id", group.id)
        
        setGroupMemberCount(count || 0)
        
        setConnection({
          id: group.id,
          user1_id: user.id,
          user2_id: user.id, // Not used for groups
          other_user: {
            id: group.id,
            display_name: group.group_name || "Buddy Group",
          },
        })
        loadMessages()
      } else {
        // Try old connections system (fallback)
        const { data: conn, error: connError } = await supabase
          .from("connections")
          .select("id, user1_id, user2_id")
          .eq("id", connectionId)
          .maybeSingle()

        if (!conn || connError) {
          throw new Error("Connection or group not found")
        }

        const otherUserId = conn.user1_id === user.id ? conn.user2_id : conn.user1_id

        const { data: otherUserData, error: userError } = await supabase
          .from("profiles")
          .select("id, display_name")
          .eq("id", otherUserId)
          .maybeSingle()

        if (!otherUserData || userError) throw new Error("User not found")

        setConnection({
          id: conn.id,
          user1_id: conn.user1_id,
          user2_id: conn.user2_id,
          other_user: otherUserData,
        })
        loadMessages()
      }
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
      
      // Check if it's a group by checking if messages have encrypted_content
      // or by checking if connectionId is a group
      const isGroupChat = isGroup || (newMessages.length > 0 && newMessages[0]?.encrypted_content)
      
      // Decrypt messages if they're encrypted (for group messages)
      const decryptedMessages = await Promise.all(
        newMessages.map(async (msg: Message) => {
          if (msg.encrypted_content && msg.encryption_iv && isGroupChat) {
            try {
              const decrypted = await decryptStoredMessage(
                msg.encrypted_content,
                msg.encryption_iv,
                connectionId
              )
              return { ...msg, content: decrypted }
            } catch (err) {
              console.error("Failed to decrypt message:", err)
              return { ...msg, content: "[Unable to decrypt message]" }
            }
          }
          return msg
        })
      )
      
      setMessages(decryptedMessages)
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
      <main className="min-h-svh bg-gradient-to-br from-neutral-50 to-primary/5">
        <header className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm py-4 px-6 shadow-sm">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neutral-900 font-grotesk">Messages</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-12">
          <p className="text-neutral-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-svh bg-gradient-to-br from-neutral-50 to-primary/5">
        <header className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm py-4 px-6 shadow-sm">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-neutral-900 font-grotesk">Messages</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-12">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-gradient-to-br from-neutral-50 to-primary/5">
      <header className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-sm py-4 px-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 font-grotesk">
              {isGroup ? "Chat with Buddy Group" : `Chat with ${connection?.other_user.display_name}`}
            </h1>
            <p className="text-sm text-neutral-600 font-poppins">
              {isGroup
                ? groupMemberCount !== null
                  ? `${groupMemberCount} ${groupMemberCount === 1 ? "member" : "members"}`
                  : "Group Chat"
                : "Connected Buddy"}
            </p>
          </div>
          <Link href={isGroup ? "/dashboard/matches" : "/dashboard/connections"}>
            <Button variant="outline" className="border-neutral-200 hover:bg-neutral-50 font-medium bg-white">
              Back
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl flex flex-col h-[600px]">
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-neutral-50/50 to-white">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-neutral-600 font-poppins mb-2">No messages yet. Start the conversation! 💬</p>
                    <p className="text-sm text-neutral-500">Send a message to get started</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    const sender = message.profiles
                    const senderName = sender?.display_name || "Unknown User"
                    const senderUsername = sender?.username
                    const senderAvatar = sender?.avatar_url
                    const messageContent = message.content || "[No content]"

                    return (
                      <MessageBubble
                        key={message.id}
                        content={messageContent}
                        isSent={message.sender_id === userId}
                        senderName={senderName}
                        senderUsername={senderUsername}
                        senderAvatar={senderAvatar}
                        timestamp={message.created_at}
                      />
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </CardContent>
            <CardHeader className="border-t border-neutral-200/50 bg-white/90 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  disabled={isSending}
                  className="border-neutral-200 bg-white text-neutral-900 flex-1 focus:border-primary focus:ring-primary/20"
                />
                <Button
                  type="submit"
                  disabled={isSending || !messageContent.trim()}
                  className="bg-primary hover:bg-primary/90 text-white border-0 font-medium px-6 shadow-md"
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
