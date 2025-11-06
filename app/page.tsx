import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogoText } from "@/components/logo"
import {
  MessageCircle,
  Calendar,
  Users,
  Bot,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Zap,
  Shield,
  Globe,
  Apple,
  Smartphone,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Heart,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LandingPage() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content:
        "BFF Compass helped me find amazing study groups and connect with peers in my field. The AI assistant is incredibly helpful!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Engineering Student",
      content:
        "The event discovery feature is fantastic. I've joined so many workshops and networking events through this platform.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Business Student",
      content:
        "Real-time chat and session booking made collaborating with classmates so much easier. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
  ]

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Assistant",
      description: "Get personalized recommendations and instant help with your academic journey.",
      color: "bg-blue-100 text-blue-600",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
    },
    {
      icon: Heart,
      title: "Mental Health Support",
      description: "Loneliness assessment and personalized wellness resources for students.",
      color: "bg-pink-100 text-pink-600",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
    },
    {
      icon: Calendar,
      title: "Event Discovery",
      description: "Find and join campus events, study sessions, and social activities.",
      color: "bg-green-100 text-green-600",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
    },
    {
      icon: Users,
      title: "Peer Connection",
      description: "Connect with fellow students through real-time messaging and video sessions.",
      color: "bg-purple-100 text-purple-600",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Your privacy and security are our top priorities with enterprise-grade protection.",
      color: "bg-orange-100 text-orange-600",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Stay connected with instant notifications and live updates.",
      color: "bg-yellow-100 text-yellow-600",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?w=400&h=300&fit=crop"
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary/5 font-poppins">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <LogoText />
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-neutral-600 hover:text-primary font-medium">
              Features
            </Link>
            <Link href="/about" className="text-neutral-600 hover:text-primary font-medium">
              About
            </Link>
            <Link href="/contact" className="text-neutral-600 hover:text-primary font-medium">
              Contact
            </Link>
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section with Video Carousel */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-primary/10 text-primary font-grotesk font-medium">Student Engagement Platform</Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight font-grotesk">
                Connect, Learn, and{" "}
                <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                  Thrive
                </span>{" "}
                Together
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-600 mb-8 leading-relaxed font-poppins">
                BFF Compass helps students overcome loneliness, discover meaningful connections, and build a supportive community through AI-powered guidance and personalized experiences.
              </p>
              
              {/* Mobile App Links */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 font-grotesk font-medium">
                  <Apple className="w-5 h-5 mr-2" />
                  Download on App Store
                </Button>
                <Button size="lg" variant="outline" className="border-2 font-grotesk font-medium">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Get it on Google Play
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-neutral-600 font-poppins">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>500+ Universities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span>98% Satisfaction</span>
                </div>
              </div>
            </div>
            
            {/* Video Carousel */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary rounded-3xl p-8 text-white text-center shadow-xl">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">See BFF-Connect in Action</h3>
                <p className="text-lg mb-6 opacity-90">
                  Watch how students are building meaningful connections and overcoming loneliness
                </p>
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo Video
                </Button>
              </div>
              
              {/* Floating Video Thumbnails */}
              <div className="absolute -top-4 -right-4 w-32 h-20 bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop" 
                  alt="Student collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-28 h-16 bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=150&fit=crop" 
                  alt="Study group"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary font-grotesk font-medium">Platform Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 font-grotesk">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-poppins">
              Discover powerful tools designed to enhance your student experience, from AI-powered assistance to mental health support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-neutral-900 font-grotesk">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 mb-4 font-poppins">{feature.description}</p>
                  <div className="w-full h-48 rounded-2xl overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
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
            <Badge className="mb-4 bg-primary/10 text-primary font-grotesk font-medium">Student Success Stories</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 font-grotesk">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Students
              </span>{" "}
              Worldwide
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-poppins">
              Hear from real students who have transformed their university experience with BFF-Connect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-neutral-900 font-grotesk">{testimonial.name}</h4>
                      <p className="text-sm text-neutral-600 font-poppins">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-neutral-700 mb-4 font-poppins">{testimonial.content}</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary to-primary text-white rounded-3xl">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4 font-grotesk">Ready to Transform Your Student Experience?</h2>
              <p className="text-xl mb-8 opacity-90 font-poppins">
                Join thousands of students who have found their community and support network.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" asChild className="font-grotesk font-medium">
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-grotesk font-medium" asChild>
                  <Link href="/features">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t-2 border-neutral-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <LogoText />
              <p className="text-neutral-600 text-sm mt-4 font-poppins">
                Connecting students worldwide for better learning experiences and mental well-being.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3 font-grotesk">Platform</h4>
              <ul className="space-y-2 text-sm text-neutral-600 font-poppins">
                <li>
                  <Link href="/features" className="hover:text-primary">Features</Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3 font-grotesk">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600 font-poppins">
                <li>
                  <Link href="/help" className="hover:text-primary">Help Center</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3 font-grotesk">Connect</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-neutral-600 hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-neutral-600 hover:text-primary">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-neutral-600 hover:text-primary">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-neutral-600 hover:text-primary">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-neutral-600 hover:text-primary">
                  <Youtube className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-neutral-600 border-t-2 border-neutral-200 pt-8 font-poppins">
            <p>&copy; 2024 BFF Compass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
