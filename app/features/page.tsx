import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Calendar,
  MessageCircle,
  Users,
  Heart,
  Target,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  BookOpen,
  Smartphone,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react"

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Bot,
      title: "AI-Powered Assistant",
      description: "Get personalized recommendations and instant help finding events, sessions, and study partners.",
      benefits: ["Mood-based suggestions", "Personalized content", "24/7 support", "Smart matching"],
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Calendar,
      title: "Smart Event Discovery",
      description: "Discover relevant academic events, workshops, and study sessions tailored to your interests.",
      benefits: ["Eventbrite integration", "Personalized recommendations", "RSVP management", "Calendar sync"],
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MessageCircle,
      title: "Real-time Collaboration",
      description: "Connect instantly with fellow students through our advanced messaging and chat features.",
      benefits: ["Private messaging", "Group chats", "File sharing", "Voice messages"],
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: Users,
      title: "Study Group Formation",
      description: "Form and join study groups with students from your courses and academic interests.",
      benefits: ["Interest matching", "Course-based groups", "Progress tracking", "Resource sharing"],
      color: "bg-orange-100 text-orange-600",
    },
  ]

  const advancedFeatures = [
    {
      icon: Heart,
      title: "Loneliness Assessment",
      description: "RULS-6 survey to measure and track your social well-being with personalized support.",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Target,
      title: "Personalized Videos",
      description: "Weekly 1-minute videos tailored to your loneliness category and current mood.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Shield,
      title: "Mental Health Support",
      description: "24/7 access to crisis resources and professional mental health services.",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Sparkles,
      title: "Gamified Progress",
      description: "Earn badges and track your social growth with our achievement system.",
      color: "bg-yellow-100 text-yellow-600",
    },
  ]

  const badges = [
    {
      name: "The Newbie",
      description: "Add a bio and profile picture",
      icon: "👋",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "The Socialite",
      description: "Attend 5 campus events",
      icon: "🎉",
      color: "bg-green-100 text-green-600",
    },
    {
      name: "The Networker",
      description: "Connect with 10 students outside major",
      icon: "🤝",
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "The Mentor",
      description: "Volunteer 5 hours",
      icon: "🌟",
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "The Collaborator",
      description: "Join/form a study group",
      icon: "📚",
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "The Mindful",
      description: "Meditate 10 min daily for a week",
      icon: "🧘",
      color: "bg-indigo-100 text-indigo-600",
    },
  ]

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Computer Science",
      content: "The AI assistant helped me find the perfect study group for my algorithms class. I've never felt more supported!",
      rating: 5,
    },
    {
      name: "Maria Rodriguez",
      role: "Psychology",
      content: "The loneliness assessment really opened my eyes. The personalized videos have been incredibly helpful.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Engineering",
      content: "Real-time chat with classmates made group projects so much easier. Highly recommend!",
      rating: 5,
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
          <Badge className="mb-4 bg-primary-100 text-primary-700">Features</Badge>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              thrive in college
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
            From AI-powered assistance to real-time collaboration, we've built a comprehensive platform 
            that addresses every aspect of student life and well-being.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-primary-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary-500" />
              <span>500+ Universities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary-100 text-secondary-700">Core Features</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Powerful tools for student success</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with human-centered design to create 
              the ultimate student experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-neutral-600 leading-relaxed mb-4">
                        {feature.description}
                      </CardDescription>
                      <div className="grid grid-cols-2 gap-2">
                        {feature.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                            <span className="text-neutral-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent-100 text-accent-700">Advanced Features</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Beyond basic networking</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We go beyond simple social networking to provide comprehensive support for student well-being 
              and academic success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="text-center border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary-100 text-primary-700">Gamification</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Track your progress with badges</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Earn achievements as you grow socially and academically. Each badge represents a milestone 
              in your personal development journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${badge.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {badge.icon}
                  </div>
                  <CardTitle className="text-lg">{badge.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-neutral-600 leading-relaxed">{badge.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary-100 text-secondary-700">Student Stories</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">What students are saying</h2>
            <p className="text-xl text-neutral-600">
              Real experiences from students who have transformed their college experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary-400 text-secondary-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700 leading-relaxed">"{testimonial.content}"</p>
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
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to experience the future of student life?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of students who are already using BFF-Connect to enhance their academic journey 
                and build meaningful connections.
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
                  <Link href="/demo">Watch Demo</Link>
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