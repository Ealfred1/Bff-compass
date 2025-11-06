import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { YouGoodLineButton } from "@/components/you-good-line-button"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
})

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap"
})

const grotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap"
})

export const metadata: Metadata = {
  title: "BFF Compass - Student Engagement Platform",
  description:
    "Connect with fellow students, join events, book study sessions, and get AI-powered assistance for your academic journey.",
  keywords: "student, education, study groups, events, AI assistant, collaboration",
  authors: [{ name: "BFF Compass Team" }],
  generator: 'ericalfred.xyz'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${grotesk.variable}`}>
      <body className="font-poppins antialiased">
        {children}
        <YouGoodLineButton />
        <Toaster />
      </body>
    </html>
  )
}
