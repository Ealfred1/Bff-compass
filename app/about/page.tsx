import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Users,
  Target,
  Award,
  Globe,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Empathy First",
      description: "We understand the challenges students face and design solutions with genuine care for their well-being.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Creating meaningful connections that go beyond academic collaboration to lifelong friendships.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Target,
      title: "Personalized Growth",
      description: "Every student's journey is unique, and we provide tailored support for individual development.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your privacy and security are our top priorities in everything we build.",
      color: "bg-purple-100 text-purple-600",
    },
  ]



  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "BFF-Connect officially launches with core features for student connection and AI assistance.",
    },
    {
      year: "2024",
      title: "10,000+ Students",
      description: "Reached our first major milestone with students from 500+ universities worldwide.",
    },
    {
      year: "2025",
      title: "AI Enhancement",
      description: "Advanced AI features including mood-based recommendations and personalized content.",
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanding to serve students across different countries and educational systems.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold">BC</span>
            </div>
            <span className="font-bold text-neutral-900">BFF-Connect</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary-100 text-primary-700">About Us</Badge>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            Building Bridges Between{" "}
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Students Worldwide
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
            BFF-Connect was born from a simple belief: every student deserves to feel connected, supported, and empowered 
            in their academic journey. We're not just building a platform—we're creating a community where loneliness 
            transforms into belonging.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-primary-500" />
              <span>10,000+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary-500" />
              <span>500+ Universities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-primary-500" />
              <span>98% Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                To eliminate student loneliness and create meaningful connections through technology that understands 
                the human experience. We believe that every student, regardless of their background or circumstances, 
                deserves access to a supportive community that helps them thrive academically and personally.
              </p>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Our AI-powered platform goes beyond simple networking—it provides personalized support, mood-based 
                recommendations, and genuine human connection that makes the university experience more fulfilling 
                and less isolating.
              </p>
              <Button asChild className="rounded-xl">
                <Link href="/register">
                  Join Our Mission <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Students collaborating"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary-100 text-secondary-700">Our Values</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">What drives us forward</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              These core values guide every decision we make and every feature we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-600 leading-relaxed">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Milestones Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary-100 text-primary-700">Our Journey</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Key milestones in our story</h2>
            <p className="text-xl text-neutral-600">
              From humble beginnings to serving thousands of students worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <CardDescription className="text-primary-600 font-medium">{milestone.year}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 leading-relaxed">{milestone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-12 text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to be part of our story?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of students who are already experiencing the power of meaningful connections 
                and personalized support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="rounded-xl h-14 px-8 bg-white text-primary-600 hover:bg-neutral-50"
                >
                  <Link href="/register">Get Started Free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-xl h-14 px-8 border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold">BC</span>
                </div>
                <span className="font-bold text-neutral-900">BFF-Connect</span>
              </div>
              <p className="text-neutral-600 text-sm">Connecting students worldwide for better learning experiences.</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/" className="hover:text-primary-600">Home</Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-primary-600">Features</Link>
                </li>
                <li>
                  <Link href="/universities" className="hover:text-primary-600">Universities</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/help" className="hover:text-primary-600">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary-600">Contact Us</Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-primary-600">Community</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/about" className="hover:text-primary-600">About</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary-600">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary-600">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-neutral-600 text-sm pt-8 border-t border-neutral-200">
            <p>&copy; 2024 BFF-Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 