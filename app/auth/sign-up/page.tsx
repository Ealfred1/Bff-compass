"use client"

import type React from "react"
import { useEffect } from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Mail, Lock, Chrome, ArrowLeft, Eye, EyeOff, CheckCircle, User } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error("Password mismatch: Please make sure your passwords match.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error("Password too short: Password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error

      toast.success("Account created successfully! Welcome to BFF-Connect! You can now sign in.")
      router.push("/auth/login?message=account_created")
    } catch (error: any) {
      console.error('Registration error:', error)
      
      let errorTitle = "Registration Failed"
      let errorDescription = error.message
      
      if (error.message?.includes("user_already_exists") || error.message?.includes("already registered")) {
        errorTitle = "Account Already Exists"
        errorDescription = "An account with this email already exists. Please try signing in instead."
      } else if (error.message?.includes("invalid_email")) {
        errorTitle = "Invalid Email"
        errorDescription = "Please enter a valid email address."
      } else if (error.message?.includes("password_too_short")) {
        errorTitle = "Password Too Short"
        errorDescription = "Password must be at least 6 characters long."
      } else if (error.message?.includes("weak_password")) {
        errorTitle = "Weak Password"
        errorDescription = "Please choose a stronger password with letters, numbers, and symbols."
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

  const benefits = [
    "Connect with students from 500+ universities",
    "Access to AI-powered study assistant",
    "Join unlimited events and study sessions",
    "Real-time collaboration tools",
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#0D9488]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl"></div>
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 800">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="#0D9488" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          <path
            d="M0,200 Q300,100 600,200 T1200,200"
            stroke="#0D9488"
            strokeWidth="2"
            fill="none"
            opacity="0.2"
            strokeDasharray="10,5"
          />
          <path
            d="M0,400 Q600,300 1200,400"
            stroke="#0D9488"
            strokeWidth="2"
            fill="none"
            opacity="0.2"
            strokeDasharray="10,5"
          />
        </svg>
      </div>

      {/* Back to Home */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" asChild className="rounded-lg">
          <Link href="/" className="flex items-center space-x-2 text-[#374151] hover:text-[#0D9488]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-[#111827] mb-4">Join the future of student collaboration</h2>
                <p className="text-lg text-[#6B7280]">
                  Connect with like-minded students, discover opportunities, and accelerate your academic success.
                </p>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#0D9488]/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-[#0D9488]" />
                    </div>
                    <span className="text-[#374151]">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-[#E5E7EB]">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0D9488]/20"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0D9488]/30"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0D9488]/40"></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#111827]">10,000+ students joined</div>
                    <div className="text-xs text-[#6B7280]">in the last month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="border border-[#E5E7EB] bg-white rounded-lg shadow-lg">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-lg flex items-center justify-center mx-auto mb-6 shadow-md">
                  <User className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[#111827]">Create your account</CardTitle>
                <CardDescription className="text-[#6B7280] mt-2">
                  Join BFF-Connect and start connecting with fellow students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-8 pb-8">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-md bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#0D9488] font-semibold shadow-sm"
                  onClick={handleGoogleSignIn}
                >
                  <Chrome className="mr-3 h-5 w-5 text-[#0D9488]" />
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#E5E7EB]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-[#6B7280] font-medium">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[#374151]">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#9CA3AF]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-md border-[#E5E7EB] bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-[#374151]">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#9CA3AF]" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-md border-[#E5E7EB] bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-[#9CA3AF] hover:text-[#374151]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#374151]">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#9CA3AF]" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-md border-[#E5E7EB] bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-[#9CA3AF] hover:text-[#374151]"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-md bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold shadow-sm hover:shadow-md transition-all"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </form>

                <div className="text-center text-sm">
                  <span className="text-[#6B7280]">Already have an account? </span>
                  <Link href="/auth/login" className="text-[#0D9488] hover:text-[#0F766E] font-medium">
                    Sign in
                  </Link>
                </div>

                <div className="text-xs text-[#6B7280] text-center">
                  By creating an account, you agree to our{" "}
                  <Link href="#" className="text-[#0D9488] hover:text-[#0F766E]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#0D9488] hover:text-[#0F766E]">
                    Privacy Policy
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
