"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  Calendar, 
  Users, 
  Bot, 
  MessageCircle, 
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Events & Groups", href: "/dashboard/events", icon: Calendar },
  { name: "Study Groups", href: "/dashboard/matches", icon: Users },
  { name: "AI Assistant", href: "/dashboard/chat", icon: Bot },
  { name: "Messages", href: "/dashboard/connections", icon: MessageCircle },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white/95 backdrop-blur-md border-r border-primary/20 z-50 transition-all duration-300 shadow-xl
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="font-bold text-neutral-900 text-lg font-grotesk">BFF Compass</span>
            </Link>
          )}
          
          {isCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-lg mx-auto">
              <span className="text-white font-bold text-sm">BC</span>
            </Link>
          )}

          {/* Collapse Toggle - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 hover:bg-primary/10 rounded-lg shadow-sm"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-primary" /> : <ChevronLeft className="w-4 h-4 text-primary" />}
          </Button>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobile}
            className="lg:hidden p-2 hover:bg-primary/10 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            
            // Function to determine if a nav item should be active
            const getIsActive = (href: string) => {
              // Exact match
              if (pathname === href) return true
              
              // For dashboard, only active if we're exactly on /dashboard
              if (href === "/dashboard") {
                return pathname === "/dashboard"
              }
              
              // For other routes, check if pathname starts with the href
              return pathname.startsWith(href + "/")
            }
            
            const isActive = getIsActive(item.href)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group shadow-sm hover:shadow-md
                  ${isActive 
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg" 
                    : "text-neutral-700 hover:text-primary hover:bg-primary/5"
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-current group-hover:text-primary"}`} />
                {!isCollapsed && (
                  <span className="font-grotesk truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          {!isCollapsed && (
            <div className="text-xs text-neutral-500 text-center font-poppins">
              BFF Compass v1.0
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs">BC</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white/95 backdrop-blur-md shadow-lg border border-primary/20 rounded-lg"
      >
        <Menu className="w-4 h-4 text-primary" />
      </Button>
    </>
  )
}
