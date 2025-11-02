import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-svh flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-sm border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a confirmation link to verify your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in your email to confirm your account and get started on your BFF COMPASS journey.
          </p>
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full border-border hover:bg-muted font-medium bg-transparent">
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
