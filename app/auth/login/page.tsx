"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Mail, Lock, Chrome, ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle OAuth errors from URL parameters
  useEffect(() => {
    const error = searchParams.get("error")
    const description = searchParams.get("description")
    const message = searchParams.get("message")
    
    if (message === "account_created") {
      toast.success("Account created! Please sign in.")
      return
    }
    
    if (error && !window.location.hash) {
      let errorMessage = "Authentication failed"
      
      switch (error) {
        case "oauth_failed":
          errorMessage = description || "OAuth authentication failed"
          break
        case "session_exchange_failed":
          errorMessage = description || "Failed to create session"
          break
        default:
          errorMessage = description || "Authentication error occurred"
      }
      
      toast.error(errorMessage)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      toast.success("Welcome back! You've been signed in successfully.")
      router.push("/dashboard")
    } catch (error: any) {
      console.error('Login error:', error)
      
      let errorTitle = "Login Failed"
      let errorDescription = error.message
      
      if (error.message?.includes("invalid_credentials") || error.message?.includes("Invalid login")) {
        errorTitle = "Invalid Credentials"
        errorDescription = "The email or password you entered is incorrect. Please try again."
      } else if (error.message?.includes("email_not_confirmed")) {
        errorTitle = "Email Not Confirmed"
        errorDescription = "Please check your email and click the confirmation link before signing in."
      } else if (error.message?.includes("too_many_requests")) {
        errorTitle = "Too Many Attempts"
        errorDescription = "You've made too many login attempts. Please wait a few minutes before trying again."
      } else if (error.message?.includes("user_not_found")) {
        errorTitle = "Account Not Found"
        errorDescription = "No account found with this email. Please check your email or create a new account."
      }
      
      toast.error(`${errorTitle}: ${errorDescription}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(`Error: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary/5 relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#10B981" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          <path
            d="M0,200 Q300,100 600,200 T1200,200"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
            opacity="0.2"
            strokeDasharray="10,5"
          />
        </svg>
      </div>

      {/* Back to Home */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" asChild className="rounded-xl">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-2xl">BC</span>
              </div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-neutral-600">
                Sign in to your BFF-Connect account and continue your learning journey
              </CardDescription>
        </CardHeader>
            <CardContent className="space-y-6">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl bg-white/50 backdrop-blur-sm border-neutral-200 hover:bg-white"
                onClick={handleGoogleSignIn}
              >
                <Chrome className="mr-3 h-5 w-5" />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-neutral-500 font-medium">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                    Email Address
              </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
              <Input
                id="email"
                type="email"
                      placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-neutral-200 bg-white/50 backdrop-blur-sm focus:bg-white"
                      required
              />
                  </div>
            </div>
            <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                Password
              </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
              <Input
                id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 rounded-xl border-neutral-200 bg-white/50 backdrop-blur-sm focus:bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="text-primary hover:text-primary/80 font-medium">
                      Forgot password?
                    </Link>
                  </div>
            </div>

            <Button
              type="submit"
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-white"
                  disabled={loading}
            >
                  {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

              <div className="text-center text-sm">
                <span className="text-neutral-600">Don't have an account? </span>
                <Link href="/auth/sign-up" className="text-primary hover:text-primary/80 font-medium">
                  Sign up for free
            </Link>
              </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  )
}
