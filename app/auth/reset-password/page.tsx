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
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we have the hash token from the reset email
    const hash = window.location.hash
    if (!hash.includes("access_token")) {
      toast.error("Invalid reset link. Please request a new password reset.")
      router.push("/auth/forgot-password")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSuccess(true)
      toast.success("Password reset successfully!")
      
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error: any) {
      console.error("Password reset error:", error)
      toast.error(`Error: ${error.message || "Failed to reset password"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 relative overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
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

      {/* Back to Login */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" asChild className="rounded-xl">
          <Link href="/auth/login" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </Button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
              <CardDescription className="text-neutral-600">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {success ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Password reset successful!</h3>
                    <p className="text-sm text-neutral-600">
                      Redirecting you to the login page...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-neutral-700">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-xl border-neutral-200 bg-white/50 backdrop-blur-sm focus:bg-white"
                        required
                        minLength={6}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-xl border-neutral-200 bg-white/50 backdrop-blur-sm focus:bg-white"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-primary-500 hover:bg-primary-600 shadow-lg"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset password"}
                  </Button>
                </form>
              )}

              <div className="text-center text-sm">
                <span className="text-neutral-600">Remember your password? </span>
                <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

