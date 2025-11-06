"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

  const getIsActive = (href: string) => {
    if (pathname === href) return true
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href + "/")
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-[#F9FAFB] z-50 transition-all duration-200 ease-in-out
        ${isCollapsed ? 'w-12' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0
        shadow-lg
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <span className="font-bold text-[#111827] text-base font-grotesk">BFF Compass</span>
            </Link>
          )}
          
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Link href="/dashboard" className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <span className="text-white font-bold text-sm">BC</span>
              </Link>
            </div>
          )}

          {/* Collapse Toggle - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 hover:bg-[#F3F4F6] rounded-md"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-[#6B7280]" /> : <ChevronLeft className="w-4 h-4 text-[#6B7280]" />}
          </Button>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobile}
            className="lg:hidden p-1.5 hover:bg-[#F3F4F6] rounded-md"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = getIsActive(item.href)
            
            const navItem = (
              <Link
                href={item.href}
                className={`
                  flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
                  ${isActive 
                    ? "bg-[rgba(13,148,136,0.1)] text-[#0D9488] border-l-[3px] border-[#0D9488]" 
                    : "text-[#374151] hover:bg-[#F3F4F6]"
                  }
                  ${isCollapsed ? "justify-center px-2" : ""}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#0D9488]" : "text-[#6B7280]"}`} />
                {!isCollapsed && (
                  <span className="ml-3 font-poppins truncate">{item.name}</span>
                )}
              </Link>
            )
            
            if (isCollapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    {navItem}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#111827] text-white text-xs">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            }
            
            return <div key={item.name}>{navItem}</div>
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB]">
          {!isCollapsed && (
            <div className="text-xs text-[#6B7280] text-center font-poppins">
              BFF Compass v1.0
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-[#0D9488] rounded-lg flex items-center justify-center shadow-sm">
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white/95 backdrop-blur-md shadow-md border border-[#E5E7EB] rounded-md"
      >
        <Menu className="w-4 h-4 text-[#0D9488]" />
      </Button>
    </TooltipProvider>
  )
}
