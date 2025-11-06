"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  username: string
  display_name: string
  full_name?: string
  avatar_url: string | null
  bio: string | null
  school: string | null
  year: string | null
  role: string
  is_verified: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadProfile(user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      const { data: currentUser } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        // If profile doesn't exist, create a basic one
        if (error.code === "PGRST116") {
          const userEmail = currentUser?.data?.user?.email
          const userMetadata = currentUser?.data?.user?.user_metadata
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              username: userEmail?.split("@")[0] || `user_${userId.slice(0, 8)}`,
              display_name: userMetadata?.full_name || userMetadata?.name || userEmail?.split("@")[0] || "User",
              avatar_url: userMetadata?.avatar_url || null,
            })
            .select()
            .single()
          if (newProfile) {
            setProfile(newProfile as Profile)
          }
        } else {
          console.error("Error loading profile:", error)
        }
      } else if (data) {
        setProfile(data as Profile)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

