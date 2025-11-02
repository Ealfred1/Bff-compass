import Link from "next/link"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function Home() {
  // Simple redirect check - in production, check real auth state
  const isLoggedIn = false

  if (isLoggedIn) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-svh flex flex-col">
      {/* Header */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground font-poppins">BFF COMPASS</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center">
        <Image src="/bff-compass-logo.png" alt="BFF COMPASS Logo" width={280} height={280} className="mb-8" priority />
        <h2 className="text-4xl font-bold text-foreground mb-4 max-w-2xl leading-tight font-poppins">
          Find Your Friend Compass
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl font-poppins">
          Combat loneliness by connecting with like-minded individuals who share your interests and values. Get matched
          with your perfect buddy.
        </p>

        <div className="flex gap-4 mb-12">
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary font-poppins"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="border-border hover:bg-muted bg-transparent font-poppins">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-12">
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="font-semibold text-foreground mb-2 font-poppins">Smart Matching</h3>
            <p className="text-sm text-muted-foreground font-poppins">
              Get matched based on your interests and compatibility
            </p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="font-semibold text-foreground mb-2 font-poppins">Safe Connection</h3>
            <p className="text-sm text-muted-foreground font-poppins">Secure messaging and community guidelines</p>
          </div>
          <div className="p-6 border border-border rounded-lg bg-card">
            <h3 className="font-semibold text-foreground mb-2 font-poppins">Track Progress</h3>
            <p className="text-sm text-muted-foreground font-poppins">Monitor your wellbeing and earn achievements</p>
          </div>
        </div>
      </section>
    </main>
  )
}
