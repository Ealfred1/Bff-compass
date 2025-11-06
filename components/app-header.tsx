"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"

// Decides whether to render the authenticated Navbar and Sidebar based on route
// Public pages (landing, marketing, auth) should not render the authenticated components
export function AppHeader() {
  const pathname = usePathname()

  const isAuthenticatedArea = (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/sessions") ||
    pathname.startsWith("/session/") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/chatbot")
  )

  if (!isAuthenticatedArea) return null
  
  return (
    <>
      <Sidebar />
    </>
  )
}

