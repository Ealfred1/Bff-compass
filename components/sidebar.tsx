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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-primary/20 z-50 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="font-bold text-neutral-900 text-lg font-grotesk">BFF Compass</span>
            </Link>
          )}
          
          {isCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 bg-primary rounded-xl group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-sm">BC</span>
            </Link>
          )}

          {/* Collapse Toggle - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 hover:bg-primary/5"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobile}
            className="lg:hidden p-2"
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
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? "bg-primary text-white" 
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
        <div className="p-4 border-t border-primary/20">
          {!isCollapsed && (
            <div className="text-xs text-neutral-500 text-center">
              BFF Compass v1.0
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white shadow-lg"
      >
        <Menu className="w-4 h-4" />
      </Button>
    </>
  )
}

