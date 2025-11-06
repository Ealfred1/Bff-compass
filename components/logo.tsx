import { Compass, MessageCircle } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center relative`}>
        <Compass className="w-5 h-5 text-white" />
        <MessageCircle className="w-3 h-3 text-white absolute -top-1 -right-1" />
      </div>
      {showText && (
        <div>
          <span className="font-bold text-neutral-900 text-xl font-grotesk">BFF Compass</span>
          <div className="text-xs text-primary-600 font-medium font-poppins">Student Engagement Platform</div>
        </div>
      )}
    </div>
  )
}

export function LogoIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center relative`}>
      <Compass className="w-5 h-5 text-white" />
      <MessageCircle className="w-3 h-3 text-white absolute -top-1 -right-1" />
    </div>
  )
}

export function LogoText() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center relative">
        <Compass className="w-4 h-4 text-white" />
        <MessageCircle className="w-2.5 h-2.5 text-white absolute -top-0.5 -right-0.5" />
      </div>
      <span className="font-bold text-neutral-900 text-lg font-grotesk">BFF Compass</span>
    </div>
  )
}

