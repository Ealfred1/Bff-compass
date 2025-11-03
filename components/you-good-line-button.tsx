"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, Phone, Heart } from "lucide-react"
import Link from "next/link"

export function YouGoodLineButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCrisis, setShowCrisis] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
    setShowCrisis(false)
  }

  const handleCrisisYes = () => {
    setShowCrisis(true)
  }

  const handleCrisisNo = () => {
    // Redirect to resources page
    window.location.href = "/dashboard/resources"
  }

  return (
    <>
      {/* Floating Button - Always Visible */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-destructive/50 md:h-20 md:w-20"
        aria-label="You Good? Crisis Support Line"
        title="Need Support? Click Here"
      >
        <Heart className="h-8 w-8 animate-pulse md:h-10 md:w-10" />
      </button>

      {/* Crisis Check Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          {!showCrisis ? (
            <>
              <DialogHeader className="space-y-3">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <DialogTitle className="text-center text-2xl font-bold font-poppins">
                  You Good? Line
                </DialogTitle>
                <DialogDescription className="text-center text-base">
                  We're here to support you. Let's get you the help you need.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="rounded-lg border-2 border-destructive/20 bg-destructive/5 p-5 text-center">
                  <p className="mb-5 text-base font-semibold text-foreground leading-relaxed">
                    Are you in crisis or having thoughts of hurting yourself?
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleCrisisYes}
                      variant="destructive"
                      size="lg"
                      className="w-full font-bold"
                    >
                      Yes, I need immediate help
                    </Button>
                    <Button
                      onClick={handleCrisisNo}
                      variant="outline"
                      size="lg"
                      className="w-full font-semibold border-2"
                    >
                      No, show me resources
                    </Button>
                  </div>
                </div>

                <p className="text-center text-xs text-muted-foreground px-2">
                  Your privacy and safety are our top priorities. All support is confidential.
                </p>
              </div>
            </>
          ) : (
            <>
              <DialogHeader className="space-y-3">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-destructive">
                  <Phone className="h-8 w-8 animate-bounce text-destructive-foreground" />
                </div>
                <DialogTitle className="text-center text-2xl font-bold text-destructive font-poppins">
                  Help is Available Now
                </DialogTitle>
                <DialogDescription className="text-center text-sm">
                  Please reach out immediately to one of these crisis services
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                {/* 988 Crisis Lifeline - Primary */}
                <div className="rounded-lg border-2 border-destructive bg-destructive/5 p-4">
                  <h3 className="mb-1 text-lg font-bold text-foreground">
                    988 Suicide & Crisis Lifeline
                  </h3>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Free, confidential support 24/7 for people in distress
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="destructive"
                      size="lg"
                      className="w-full text-lg font-bold"
                    >
                      <a href="tel:988">
                        <Phone className="mr-2 h-5 w-5" />
                        Call 988 Now
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <a href="https://988lifeline.org/chat/" target="_blank" rel="noopener noreferrer">
                        Chat Online
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Crisis Text Line */}
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-1 text-sm font-bold text-foreground">
                    Crisis Text Line
                  </h3>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Text HOME to 741741 for 24/7 crisis support
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href="sms:741741?body=HOME">
                      Text HOME to 741741
                    </a>
                  </Button>
                </div>

                {/* Emergency Services */}
                <div className="rounded-lg border border-border p-4">
                  <h3 className="mb-1 text-sm font-bold text-foreground">
                    Emergency Services
                  </h3>
                  <p className="mb-2 text-xs text-muted-foreground">
                    If you're in immediate danger, call 911
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a href="tel:911">
                      <Phone className="mr-2 h-4 w-4" />
                      Call 911
                    </a>
                  </Button>
                </div>

                {/* Additional Resources Link */}
                <div className="pt-2 text-center">
                  <Link
                    href="/dashboard/resources"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    View All Mental Health Resources →
                  </Link>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs font-medium text-foreground">
                  You are not alone. Help is available 24/7.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

