import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  ArrowRight,
  CheckCircle,
  Globe,
  Shield,
} from "lucide-react"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help with your account or technical issues",
      contact: "support@bffconnect.com",
      response: "Within 24 hours",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available 24/7",
      response: "Instant response",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Phone,
      title: "Emergency Support",
      description: "Crisis intervention and mental health resources",
      contact: "988 (Crisis Line)",
      response: "24/7 immediate",
      color: "bg-red-100 text-red-600",
    },
  ]

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. You'll receive a reset link via email.",
    },
    {
      question: "Is BFF-Connect free to use?",
      answer: "Yes! All core features are completely free. Premium features may be added in the future.",
    },
    {
      question: "How do I report inappropriate behavior?",
      answer: "Use the 'Report' button on any message or profile, or contact our support team directly.",
    },
    {
      question: "Can I use BFF-Connect on mobile?",
      answer: "Yes! We have a dedicated mobile app available on iOS and Android app stores.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-2xl flex items-center justify-center">
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
          <Badge className="mb-4 bg-primary-100 text-primary-700">Contact Us</Badge>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6">
            We're here to{" "}
            <span className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] bg-clip-text text-transparent">
              help you succeed
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
            Have questions, need support, or want to share feedback? Our team is ready to assist you 
            with anything related to your BFF-Connect experience.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#0D9488]" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#0D9488]" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#0D9488]" />
              <span>Global Reach</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary-100 text-secondary-700">Get in Touch</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Multiple ways to reach us</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Choose the method that works best for you. We're here to help with any questions or concerns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <method.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                  <CardDescription className="text-neutral-600">{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium text-neutral-900">{method.contact}</div>
                    <div className="text-sm text-neutral-600">Response: {method.response}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge className="mb-4 bg-primary-100 text-primary-700">Send Message</Badge>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">Get in touch</h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Fill out the form and we'll get back to you as soon as possible. We typically respond 
                within 24 hours during business days.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#0F766E]" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Email</div>
                    <div className="text-neutral-600">support@bffconnect.com</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#0F766E]" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Response Time</div>
                    <div className="text-neutral-600">Within 24 hours</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#0F766E]" />
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Location</div>
                    <div className="text-neutral-600">Global - Available worldwide</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your question or concern..."
                    rows={5}
                  />
                </div>
                
                <Button className="w-full rounded-xl bg-[#0D9488] hover:bg-#0F766E">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent-100 text-accent-700">FAQ</Badge>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Frequently asked questions</h2>
            <p className="text-xl text-neutral-600">
              Find quick answers to common questions about BFF-Connect
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Need immediate help?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                If you're experiencing a mental health crisis or need immediate support, 
                please reach out to these resources:
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="font-bold text-lg mb-2">Crisis Line</div>
                  <div className="text-2xl font-bold mb-2">988</div>
                  <div className="text-sm opacity-90">24/7 Suicide & Crisis Lifeline</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="font-bold text-lg mb-2">Crisis Text</div>
                  <div className="text-2xl font-bold mb-2">741741</div>
                  <div className="text-sm opacity-90">Text HOME to connect</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6">
                  <div className="font-bold text-lg mb-2">Campus Support</div>
                  <div className="text-lg font-bold mb-2">Your University</div>
                  <div className="text-sm opacity-90">Contact your campus counseling center</div>
                </div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-2xl flex items-center justify-center">
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
                  <Link href="/" className="hover:text-[#0F766E]">Home</Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-[#0F766E]">Features</Link>
                </li>
                <li>
                  <Link href="/universities" className="hover:text-[#0F766E]">Universities</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/help" className="hover:text-[#0F766E]">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#0F766E]">Contact Us</Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-[#0F766E]">Community</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="/about" className="hover:text-[#0F766E]">About</Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#0F766E]">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#0F766E]">Terms</Link>
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