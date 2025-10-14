"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowRight, 
  ArrowLeft,
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  Database, 
  Rocket, 
  Target, 
  TrendingUp,
  Code,
  Globe,
  Shield,
  Gauge,
  CheckCircle,
  XCircle,
  Star,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    { id: 'hero', title: 'RHINOBACK' },
    { id: 'problem', title: 'The Problem' },
    { id: 'solution', title: 'The Solution' },
    { id: 'demo', title: 'Product Demo' },
    { id: 'market', title: 'Market Opportunity' },
    { id: 'competition', title: 'Competition' },
    { id: 'advantage', title: 'Competitive Advantage' },
    { id: 'tech', title: 'Technology Stack' },
    { id: 'business', title: 'Business Model' },
    { id: 'validation', title: 'Market Validation' },
    { id: 'projections', title: 'Financial Projections' },
    { id: 'team', title: 'Team' },
    { id: 'funding', title: 'Funding & Ask' }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        nextSlide()
      } else if (event.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case 'hero':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="mb-8">
              <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 text-lg px-6 py-2">
                The Backend Platform of the Future
              </Badge>
            </div>
            <h1 className="text-8xl font-bold mb-8 text-gray-900">
              RHINOBACK
            </h1>
            <p className="text-4xl mb-6 text-gray-700 font-medium">
              Backends in <span className="text-blue-600 font-bold">Seconds</span>, Not <span className="text-red-600 font-bold">Sprints</span>
            </p>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Describe your app in natural language. Get a production-ready backend with AI-optimized database architecture in minutes.
            </p>
          </div>
        )
      
      case 'demo':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">Product Demo</h2>
            <p className="text-2xl text-gray-600 mb-8">Watch as we build a complete e-commerce backend in under 5 minutes</p>
            
            <div className="bg-gray-100 rounded-2xl p-8 border-2 border-gray-300 max-w-5xl w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-gray-600 font-mono text-sm">rhinoback.ai/builder</span>
              </div>
              
              <div className="bg-black rounded-lg p-6 font-mono text-sm">
                <div className="text-blue-400 mb-4">$ rhinoback create</div>
                <div className="text-gray-300 mb-4">
                  <span className="text-blue-400">RhinoBack:</span> What kind of application would you like to build?
                </div>
                <div className="text-white mb-6">
                  <span className="text-yellow-400">You:</span> Build me an e-commerce platform with user accounts, product catalog, shopping cart, payments, and admin dashboard
                </div>
                
                <div className="text-gray-300 mb-4">
                  <span className="text-blue-400">RhinoBack:</span> Analyzing requirements...
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">User management Ã¢â€ â€™ PostgreSQL tables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">Real-time cart features Ã¢â€ â€™ Redis cache</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">Product search Ã¢â€ â€™ Elasticsearch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">File storage Ã¢â€ â€™ S3 integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400">Payment processing Ã¢â€ â€™ Stripe webhooks</span>
                  </div>
                </div>
                
                <div className="text-blue-400">
                  Ã¢Å“â€¦ Backend generated successfully!<br />
                  Ã°Å¸Å¡â‚¬ Deployed to: https://your-app.rhinoback.dev<br />
                  Ã°Å¸â€œÅ¡ API docs: https://your-app.rhinoback.dev/docs
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'market':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-8 text-center text-gray-900">$28B Market Opportunity</h2>
            <p className="text-2xl text-gray-600 mb-12">Backend-as-a-Service market growing 25% annually</p>
            
            <div className="grid md:grid-cols-3 gap-12 mb-16 max-w-6xl">
              <Card className="bg-white border-2 border-blue-200 shadow-lg text-center">
                <CardHeader>
                  <div className="text-6xl font-bold text-blue-600 mb-4">4M+</div>
                  <CardTitle className="text-2xl text-gray-900">Indie Developers</CardTitle>
                  <CardDescription className="text-lg">Building side projects and startups</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border-2 border-blue-200 shadow-lg text-center">
                <CardHeader>
                  <div className="text-6xl font-bold text-blue-600 mb-4">500K+</div>
                  <CardTitle className="text-2xl text-gray-900">Development Agencies</CardTitle>
                  <CardDescription className="text-lg">Building client applications</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border-2 border-purple-200 shadow-lg text-center">
                <CardHeader>
                  <div className="text-6xl font-bold text-purple-600 mb-4">100K+</div>
                  <CardTitle className="text-2xl text-gray-900">Enterprise Teams</CardTitle>
                  <CardDescription className="text-lg">Accelerating internal development</CardDescription>
                </CardHeader>
              </Card>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg max-w-6xl w-full">
              <h3 className="text-4xl font-bold text-center mb-8 text-gray-900">Pricing Strategy</h3>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">Free</div>
                  <div className="text-gray-600 mb-4 text-lg">Starter</div>
                  <div className="text-gray-700">
                    Ã¢â‚¬Â¢ Basic apps<br />
                    Ã¢â‚¬Â¢ 10K requests/month<br />
                    Ã¢â‚¬Â¢ Community support
                  </div>
                </div>
                <div className="text-center border-l-2 border-gray-200 pl-8">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$25</div>
                  <div className="text-gray-600 mb-4 text-lg">Pro / month</div>
                  <div className="text-gray-700">
                    Ã¢â‚¬Â¢ Production apps<br />
                    Ã¢â‚¬Â¢ 100K requests/month<br />
                    Ã¢â‚¬Â¢ Custom domains<br />
                    Ã¢â‚¬Â¢ Priority support
                  </div>
                </div>
                <div className="text-center border-l-2 border-gray-200 pl-8">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$99</div>
                  <div className="text-gray-600 mb-4 text-lg">Team / month</div>
                  <div className="text-gray-700">
                    Ã¢â‚¬Â¢ Team collaboration<br />
                    Ã¢â‚¬Â¢ 500K requests/month<br />
                    Ã¢â‚¬Â¢ Advanced features<br />
                    Ã¢â‚¬Â¢ Dedicated support
                  </div>
                </div>
                <div className="text-center border-l-2 border-gray-200 pl-8">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Custom</div>
                  <div className="text-gray-600 mb-4 text-lg">Enterprise</div>
                  <div className="text-gray-700">
                    Ã¢â‚¬Â¢ On-premise deployment<br />
                    Ã¢â‚¬Â¢ Unlimited requests<br />
                    Ã¢â‚¬Â¢ SLA guarantees<br />
                    Ã¢â‚¬Â¢ White-label options
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'problem':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">
              Backend Development is <span className="text-red-600">Painfully Broken</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl">
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader className="text-center">
                  <Clock className="w-16 h-16 text-red-500 mb-4 mx-auto" />
                  <CardTitle className="text-2xl text-gray-900">Time Sink</CardTitle>
                  <CardDescription className="text-lg">Teams waste 40-60% of development time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Authentication:</span>
                      <span className="text-red-600 font-semibold">2-3 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Database setup:</span>
                      <span className="text-red-600 font-semibold">1-2 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">API endpoints:</span>
                      <span className="text-red-600 font-semibold">3-4 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Deployment:</span>
                      <span className="text-red-600 font-semibold">1-2 weeks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader className="text-center">
                  <DollarSign className="w-16 h-16 text-red-500 mb-4 mx-auto" />
                  <CardTitle className="text-2xl text-gray-900">Cost Drain</CardTitle>
                  <CardDescription className="text-lg">$150K+ developers building CRUD</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold text-red-600 mb-4">$150K+</div>
                  <p className="text-gray-700 text-lg">Average senior developer salary building repetitive backend infrastructure</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader className="text-center">
                  <Users className="w-16 h-16 text-red-500 mb-4 mx-auto" />
                  <CardTitle className="text-2xl text-gray-900">Innovation Killer</CardTitle>
                  <CardDescription className="text-lg">Building auth instead of features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-gray-700">
                    <p>"I just want to store user data, why is this so hard?"</p>
                    <p>"Another day setting up authentication... again"</p>
                    <p>"Which database should I use?"</p>
                    <p>"My app needs to scale but I'm locked in"</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'solution':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">
              <span className="text-blue-600">Describe Your App.</span>
              <br />
              <span className="text-blue-600">Get a Production Backend.</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl">
              <div className="space-y-8">
                <h3 className="text-4xl font-bold text-gray-900">How it Works</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">1</div>
                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-3">Describe Your App</h4>
                      <p className="text-lg text-gray-700">"Build me an e-commerce platform with user accounts, product catalog, shopping cart, and payments"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">2</div>
                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-3">AI Analysis</h4>
                      <p className="text-lg text-gray-700">AI detects needs: User management Ã¢â€ â€™ PostgreSQL, Real-time cart Ã¢â€ â€™ Redis, Product search Ã¢â€ â€™ Elasticsearch</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">3</div>
                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-3">Auto-Generation</h4>
                      <p className="text-lg text-gray-700">Complete database schemas, REST APIs, authentication systems generated simultaneously</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl">4</div>
                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900 mb-3">Production Ready</h4>
                      <p className="text-lg text-gray-700">Deploy to production in minutes with optimal architecture</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl text-gray-900">Traditional vs RhinoBack</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-red-600 font-bold mb-4 text-xl">Traditional Development (2-6 months)</h4>
                      <div className="space-y-2 text-gray-700">
                        <div>Week 1-2: Requirements and planning</div>
                        <div>Week 3-4: Database design and setup</div>
                        <div>Week 5-8: API development and testing</div>
                        <div>Week 9-10: Authentication implementation</div>
                        <div>Week 11-12: Testing and debugging</div>
                        <div>Week 13-16: Deployment and launch</div>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-300" />
                    
                    <div>
                      <h4 className="text-blue-600 font-bold mb-4 text-xl">RhinoBack Timeline (5-30 minutes)</h4>
                      <div className="space-y-2 text-gray-700">
                        <div>Minutes 1-5: Describe app requirements</div>
                        <div>Minutes 5-15: AI generates complete backend</div>
                        <div>Minutes 15-30: Review, refine, and deploy</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-lg px-4 py-2">
                        100x Faster Development
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'competition':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">
              We're Building the <span className="text-blue-600">Next Generation</span>
            </h2>
            
            <div className="overflow-x-auto max-w-7xl w-full">
              <table className="w-full bg-white rounded-2xl border-2 border-gray-200 shadow-lg">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-6 text-gray-900 font-bold text-xl">Feature</th>
                    <th className="text-center p-6 text-blue-600 font-bold text-xl">RhinoBack</th>
                    <th className="text-center p-6 text-gray-600 font-bold text-xl">Firebase</th>
                    <th className="text-center p-6 text-gray-600 font-bold text-xl">Supabase</th>
                    <th className="text-center p-6 text-gray-600 font-bold text-xl">Xano</th>
                    <th className="text-center p-6 text-gray-600 font-bold text-xl">AWS Amplify</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-6 text-gray-900 font-medium text-lg">AI-Powered Architecture</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-blue-600 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-6 text-gray-900 font-medium text-lg">Multi-Database Support</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-blue-600 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-blue-600 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-6 text-gray-900 font-medium text-lg">Natural Language Input</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-blue-600 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-6 text-gray-900 font-medium text-lg">Fair Usage Pricing</td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-blue-600 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><CheckCircle className="w-6 h-6 text-blue-600 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                    <td className="p-6 text-center"><XCircle className="w-6 h-6 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-6 text-gray-900 font-medium text-lg">Deployment Speed</td>
                    <td className="p-6 text-center text-blue-600 font-bold text-lg">5 min</td>
                    <td className="p-6 text-center text-gray-600 text-lg">30 min</td>
                    <td className="p-6 text-center text-gray-600 text-lg">45 min</td>
                    <td className="p-6 text-center text-gray-600 text-lg">2 hours</td>
                    <td className="p-6 text-center text-gray-600 text-lg">4 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      
      case 'advantage':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">
              Our <span className="text-blue-600">Unfair</span> Advantages
            </h2>
            
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl">
              <div className="space-y-12">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">AI-First Architecture</h3>
                  <p className="text-lg text-gray-700">Our AI doesn't just create databases - it optimizes the entire stack, choosing the right database for each use case automatically.</p>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Developer Experience</h3>
                  <p className="text-lg text-gray-700">Built by developers, for developers. Natural language input with GitHub-inspired interface that developers actually love.</p>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Multi-Database Intelligence</h3>
                  <p className="text-lg text-gray-700">Automatically combines PostgreSQL, Redis, Elasticsearch, and vector databases for optimal performance.</p>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl text-gray-900">Technology Stack</CardTitle>
                  <CardDescription className="text-lg">Built for performance and scale</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Code className="w-8 h-8 text-blue-600" />
                    <span className="text-gray-900 text-lg">Next.js 14 + TypeScript</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <span className="text-gray-900 text-lg">Groq AI (10x faster than OpenAI)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Database className="w-8 h-8 text-blue-600" />
                    <span className="text-gray-900 text-lg">Multi-database architecture</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Globe className="w-8 h-8 text-purple-600" />
                    <span className="text-gray-900 text-lg">Real-time streaming</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-red-500" />
                    <span className="text-gray-900 text-lg">Enterprise security</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'tech':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">Technology Stack</h2>
            <p className="text-2xl text-gray-600 mb-12">Built for performance, scalability, and developer experience</p>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl">
              <Card className="bg-white border-2 border-blue-200 shadow-lg">
                <CardHeader className="text-center">
                  <Code className="w-16 h-16 text-blue-600 mb-4 mx-auto" />
                  <CardTitle className="text-2xl text-gray-900">Frontend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="text-lg font-semibold text-gray-700">Next.js 14</div>
                  <div className="text-lg font-semibold text-gray-700">TypeScript</div>
                  <div className="text-lg font-semibold text-gray-700">Tailwind CSS</div>
                  <div className="text-lg font-semibold text-gray-700">shadcn/ui</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-2 border-blue-200 shadow-lg">
                <CardHeader className="text-center">
                  <Zap className="w-16 h-16 text-blue-600 mb-4 mx-auto" />
                  <CardTitle className="text-2xl text-gray-900">AI & Backend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="text-lg font-semibold text-gray-700">Groq AI</div>
                  <div className="text-lg font-semibold text-gray-700">Node.js</div>
                  <div className="text-lg font-semibold text-gray-700">Docker</div>
                  <div className="text-lg font-semibold text-gray-700">Kubernetes</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-2 border-purple-200 shadow-lg">
                <CardHeader className="text-center">
                  <Database className="w-16 h-16 text-purple-600 mb-4 mx-auto" />
                  <CardTitle className="text-2xl text-gray-900">Databases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="text-lg font-semibold text-gray-700">PostgreSQL</div>
                  <div className="text-lg font-semibold text-gray-700">Redis</div>
                  <div className="text-lg font-semibold text-gray-700">Elasticsearch</div>
                  <div className="text-lg font-semibold text-gray-700">Vector DBs</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'business':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">Business Model</h2>
            <p className="text-2xl text-gray-600 mb-12">Revenue scales with customer success</p>
            
            <div className="grid md:grid-cols-3 gap-12 mb-16 max-w-6xl">
              <Card className="bg-white border-2 border-blue-200 shadow-lg text-center">
                <CardHeader>
                  <div className="text-6xl font-bold text-blue-600 mb-4">80%</div>
                  <CardTitle className="text-2xl text-gray-900">SaaS Subscriptions</CardTitle>
                  <CardDescription className="text-lg">Recurring revenue from platform usage</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border-2 border-blue-200 shadow-lg text-center">
                <CardHeader>
                  <div className="text-6xl font-bold text-blue-600 mb-4">15%</div>
                  <CardTitle className="text-2xl text-gray-900">Marketplace Templates</CardTitle>
                  <CardDescription className="text-lg">Revenue share from community templates</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border-2 border-purple-200 shadow-lg text-center">
                <CardHeader>
                  <div className="text-6xl font-bold text-purple-600 mb-4">5%</div>
                  <CardTitle className="text-2xl text-gray-900">Professional Services</CardTitle>
                  <CardDescription className="text-lg">Custom development and consulting</CardDescription>
                </CardHeader>
              </Card>
            </div>
            
            <Card className="bg-white border-2 border-gray-200 shadow-lg max-w-4xl w-full">
              <CardHeader>
                <CardTitle className="text-3xl text-gray-900 text-center">Unit Economics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">$50</div>
                    <div className="text-gray-700 text-lg">Customer Acquisition Cost</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">$2,400</div>
                    <div className="text-gray-700 text-lg">Lifetime Value</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
                    <div className="text-gray-700 text-lg">Gross Margin</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-orange-600 mb-2">3 months</div>
                    <div className="text-gray-700 text-lg">Payback Period</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      case 'validation':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">Market Validation</h2>
            
            <div className="grid md:grid-cols-2 gap-16 max-w-7xl">
              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-8">Proven Market Demand</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <Star className="w-8 h-8 text-yellow-500 mt-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Xano: $50M+ ARR</div>
                      <p className="text-lg text-gray-700">Proves strong market demand for visual backend builders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <Star className="w-8 h-8 text-yellow-500 mt-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Supabase: $50M raised</div>
                      <p className="text-lg text-gray-700">150K+ developers using open-source Firebase alternative</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6">
                    <Star className="w-8 h-8 text-yellow-500 mt-2" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Firebase: Acquired for $200M+</div>
                      <p className="text-lg text-gray-700">Google's validation of the backend-as-a-service model</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-8">Early Validation</h3>
                <div className="space-y-8">
                  <Card className="bg-white border-2 border-blue-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-4">500+</div>
                      <p className="text-xl font-semibold text-gray-900">Signups from landing page</p>
                      <p className="text-gray-600">in just 2 weeks</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-2 border-blue-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="text-5xl font-bold text-blue-600 mb-4">15+</div>
                      <p className="text-xl font-semibold text-gray-900">Pilot customers ready</p>
                      <p className="text-gray-600">to test beta version</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border-2 border-purple-200 shadow-lg">
                    <CardContent className="p-8 text-center">
                      <div className="text-5xl font-bold text-purple-600 mb-4">3</div>
                      <p className="text-xl font-semibold text-gray-900">Agencies want partnerships</p>
                      <p className="text-gray-600">for client projects</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'projections':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-8 text-center text-gray-900">Financial Projections</h2>
            <p className="text-2xl text-gray-600 mb-12">Conservative growth model based on proven market data</p>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-bold text-blue-600">Year 1</CardTitle>
                  <CardDescription className="text-lg">Building momentum</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">1,000</div>
                    <p className="text-gray-700">Customers</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-blue-600">$360K</div>
                    <p className="text-gray-700">ARR</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-bold text-blue-600">Year 2</CardTitle>
                  <CardDescription className="text-lg">Scaling up</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">5,000</div>
                    <p className="text-gray-700">Customers</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-blue-600">$2.1M</div>
                    <p className="text-gray-700">ARR</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-bold text-purple-600">Year 3</CardTitle>
                  <CardDescription className="text-lg">Market leader</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">25,000</div>
                    <p className="text-gray-700">Customers</p>
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-purple-600">$12.5M</div>
                    <p className="text-gray-700">ARR</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'team':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-12 text-center text-gray-900">Built by Developers, for Developers</h2>
            
            <div className="max-w-5xl">
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardContent className="p-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Technical Founder</h3>
                      <div className="space-y-4 text-lg text-gray-700">
                        <p>Ã¢â‚¬Â¢ 4+ years of SaaS MVP development experience</p>
                        <p>Ã¢â‚¬Â¢ Master's in Artificial Intelligence, University at Buffalo</p>
                        <p>Ã¢â‚¬Â¢ Deep expertise in AI and infrastructure</p>
                        <p>Ã¢â‚¬Â¢ Track record of shipping production systems</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Why We'll Win</h3>
                      <div className="space-y-4 text-lg text-gray-700">
                        <p>Ã¢â‚¬Â¢ Understanding of real developer pain points</p>
                        <p>Ã¢â‚¬Â¢ Experience building scalable backend systems</p>
                        <p>Ã¢â‚¬Â¢ AI expertise for intelligent architecture decisions</p>
                        <p>Ã¢â‚¬Â¢ Passion for developer experience</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'funding':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <h2 className="text-6xl font-bold mb-8 text-center text-gray-900">Raising $2M Seed Round</h2>
            <p className="text-2xl text-gray-600 mb-12">To accelerate development and market entry</p>
            
            <div className="grid md:grid-cols-2 gap-16 mb-16 max-w-6xl">
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl text-gray-900">Use of Funds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Product Development</span>
                    <div className="flex items-center gap-3">
                      <Progress value={60} className="w-32" />
                      <span className="text-gray-900 font-bold text-lg">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">AI Infrastructure</span>
                    <div className="flex items-center gap-3">
                      <Progress value={25} className="w-32" />
                      <span className="text-gray-900 font-bold text-lg">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Customer Acquisition</span>
                    <div className="flex items-center gap-3">
                      <Progress value={15} className="w-32" />
                      <span className="text-gray-900 font-bold text-lg">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-2 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-3xl text-gray-900">Financial Projections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-lg">Year 1:</span>
                    <span className="text-blue-600 font-bold text-lg">$360K ARR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-lg">Year 2:</span>
                    <span className="text-blue-600 font-bold text-lg">$2.1M ARR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-lg">Year 3:</span>
                    <span className="text-purple-600 font-bold text-lg">$12.5M ARR</span>
                  </div>
                  <Separator className="bg-gray-300" />
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-lg">Customer LTV:</span>
                    <span className="text-gray-900 font-bold text-lg">$2,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-lg">Gross Margin:</span>
                    <span className="text-gray-900 font-bold text-lg">85%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200 max-w-4xl w-full text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Join Us in Building the Future</h3>
              <p className="text-xl text-gray-700 mb-6 italic">
                "Every startup should focus on their product, not their infrastructure"
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <span className="text-lg text-gray-700">manojmaheshwarjg@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <span className="text-lg text-gray-700">rhinoback.manoj.ai</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Slide Container */}
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                RHINOBACK
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {currentSlide + 1} / {slides.length}
                </span>
                <div className="text-lg font-medium text-gray-900">
                  {slides[currentSlide].title}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Slide Content */}
        <main className="flex-1 pt-20">
          {renderSlide()}
        </main>
        
        {/* Footer Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                onClick={prevSlide}
                variant="outline" 
                size="lg"
                disabled={currentSlide === 0}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="mr-2 w-5 h-5" />
                Previous
              </Button>
              
              {/* Slide Indicator Dots */}
              <div className="flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={nextSlide}
                variant="outline" 
                size="lg"
                disabled={currentSlide === slides.length - 1}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Next
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Keyboard Instructions */}
      <div className="fixed bottom-20 right-6 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs opacity-75">
        Use Ã¢â€ Â Ã¢â€ â€™ keys or spacebar to navigate
      </div>
    </div>
  )
}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-500/50">
            The Backend Platform of the Future
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            RHINOBACK
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-gray-300">
            Backends in <span className="text-purple-400 font-semibold">Seconds</span>, Not <span className="text-pink-400 font-semibold">Sprints</span>
          </p>
          <p className="text-xl mb-8 text-gray-400 max-w-2xl mx-auto">
            Describe your app in natural language. Get a production-ready backend with AI-optimized database architecture in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('demo')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
            >
              See Live Demo <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('problem')}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-600/10 px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Backend Development is <span className="text-red-400">Painfully Broken</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Modern development teams are wasting months on infrastructure instead of building features that matter.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <Clock className="w-12 h-12 text-red-400 mb-4" />
                <CardTitle className="text-white">Time Sink</CardTitle>
                <CardDescription>Teams waste 40-60% of development time on infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Authentication systems:</span>
                    <span className="text-red-400 font-semibold">2-3 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Database setup:</span>
                    <span className="text-red-400 font-semibold">1-2 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">API endpoints:</span>
                    <span className="text-red-400 font-semibold">3-4 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">File uploads:</span>
                    <span className="text-red-400 font-semibold">1 week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Deployment:</span>
                    <span className="text-red-400 font-semibold">1-2 weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-red-400 mb-4" />
                <CardTitle className="text-white">Cost Drain</CardTitle>
                <CardDescription>$150K+ senior developers building the same CRUD patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-400 mb-2">$150K+</div>
                  <p className="text-gray-300">Average senior developer salary building repetitive backend infrastructure</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <Users className="w-12 h-12 text-red-400 mb-4" />
                <CardTitle className="text-white">Innovation Killer</CardTitle>
                <CardDescription>Startups building auth instead of features that differentiate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <p>"I just want to store user data, why is this so hard?"</p>
                  <p>"Another day setting up authentication... again"</p>
                  <p>"Which database should I use? PostgreSQL? MongoDB? Redis?"</p>
                  <p>"My app needs to scale but I'm locked into one database"</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50 text-lg px-4 py-2">
              Market Validation: Backend-as-a-Service companies do $50M+ revenue solving part of this problem
            </Badge>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-purple-400">Describe Your App.</span>
              <br />
              <span className="text-pink-400">Get a Production Backend.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Natural language to complete backend infrastructure in minutes. AI analyzes your requirements and generates optimal database schemas, APIs, and deployment configurations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white">How it Works</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Describe Your App</h4>
                    <p className="text-gray-300">"Build me an e-commerce platform with user accounts, product catalog, shopping cart, and payments"</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">AI Analysis</h4>
                    <p className="text-gray-300">AI detects needs: User management Ã¢â€ â€™ PostgreSQL, Real-time cart Ã¢â€ â€™ Redis, Product search Ã¢â€ â€™ Elasticsearch</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Auto-Generation</h4>
                    <p className="text-gray-300">Complete database schemas, REST APIs, authentication systems, and deployment configs generated simultaneously</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">4</div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Production Ready</h4>
                    <p className="text-gray-300">Deploy to production in minutes with optimal architecture and industry best practices</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Traditional vs RhinoBack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-red-400 font-semibold mb-3">Traditional Development (2-6 months)</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>Week 1-2: Requirements and planning</div>
                      <div>Week 3-4: Database design and setup</div>
                      <div>Week 5-8: API development and testing</div>
                      <div>Week 9-10: Authentication implementation</div>
                      <div>Week 11-12: Testing and debugging</div>
                      <div>Week 13-16: Deployment and launch</div>
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-600" />
                  
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-3">RhinoBack Timeline (5-30 minutes)</h4>
                    <div className="space-y-2 text-sm text-gray-300">
                      <div>Minutes 1-5: Describe app requirements</div>
                      <div>Minutes 5-15: AI generates complete backend</div>
                      <div>Minutes 15-30: Review, refine, and deploy</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/50">
                      100x Faster Development
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">See RhinoBack in Action</h2>
            <p className="text-xl text-gray-300">Watch as we build a complete e-commerce backend in under 5 minutes</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 font-mono text-sm">rhinoback.ai/builder</span>
            </div>
            
            <div className="bg-black rounded-lg p-6 font-mono text-sm">
              <div className="text-blue-400 mb-4">$ rhinoback create</div>
              <div className="text-gray-300 mb-4">
                <span className="text-blue-400">RhinoBack:</span> What kind of application would you like to build?
              </div>
              <div className="text-white mb-6">
                <span className="text-yellow-400">You:</span> Build me an e-commerce platform with user accounts, product catalog, shopping cart, payments, and admin dashboard
              </div>
              
              <div className="text-gray-300 mb-4">
                <span className="text-blue-400">RhinoBack:</span> Analyzing requirements...
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">User management Ã¢â€ â€™ PostgreSQL tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">Real-time cart features Ã¢â€ â€™ Redis cache</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">Product search Ã¢â€ â€™ Elasticsearch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">File storage Ã¢â€ â€™ S3 integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">Payment processing Ã¢â€ â€™ Stripe webhooks</span>
                </div>
              </div>
              
              <div className="text-blue-400">
                Ã¢Å“â€¦ Backend generated successfully!<br />
                Ã°Å¸Å¡â‚¬ Deployed to: https://your-app.rhinoback.dev<br />
                Ã°Å¸â€œÅ¡ API docs: https://your-app.rhinoback.dev/docs
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Try Live Demo <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Section */}
      <section id="market" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">$28B Market Opportunity</h2>
            <p className="text-xl text-gray-300">Backend-as-a-Service market growing 25% annually</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-900/50 border-gray-700 text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-purple-400 mb-2">4M+</div>
                <CardTitle className="text-white">Indie Developers</CardTitle>
                <CardDescription>Building side projects and startups</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700 text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-pink-400 mb-2">500K+</div>
                <CardTitle className="text-white">Development Agencies</CardTitle>
                <CardDescription>Building client applications</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700 text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-blue-400 mb-2">100K+</div>
                <CardTitle className="text-white">Enterprise Teams</CardTitle>
                <CardDescription>Accelerating internal development</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-3xl font-bold text-center mb-8 text-white">Pricing Strategy</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">Free</div>
                <div className="text-gray-400 mb-4">Starter</div>
                <div className="text-gray-300 text-sm">
                  Ã¢â‚¬Â¢ Basic apps<br />
                  Ã¢â‚¬Â¢ 10K requests/month<br />
                  Ã¢â‚¬Â¢ Community support
                </div>
              </div>
              <div className="text-center border-l border-gray-600 pl-6">
                <div className="text-2xl font-bold text-purple-400 mb-2">$25</div>
                <div className="text-gray-400 mb-4">Pro / month</div>
                <div className="text-gray-300 text-sm">
                  Ã¢â‚¬Â¢ Production apps<br />
                  Ã¢â‚¬Â¢ 100K requests/month<br />
                  Ã¢â‚¬Â¢ Custom domains<br />
                  Ã¢â‚¬Â¢ Priority support
                </div>
              </div>
              <div className="text-center border-l border-gray-600 pl-6">
                <div className="text-2xl font-bold text-pink-400 mb-2">$99</div>
                <div className="text-gray-400 mb-4">Team / month</div>
                <div className="text-gray-300 text-sm">
                  Ã¢â‚¬Â¢ Team collaboration<br />
                  Ã¢â‚¬Â¢ 500K requests/month<br />
                  Ã¢â‚¬Â¢ Advanced features<br />
                  Ã¢â‚¬Â¢ Dedicated support
                </div>
              </div>
              <div className="text-center border-l border-gray-600 pl-6">
                <div className="text-2xl font-bold text-blue-400 mb-2">Custom</div>
                <div className="text-gray-400 mb-4">Enterprise</div>
                <div className="text-gray-300 text-sm">
                  Ã¢â‚¬Â¢ On-premise deployment<br />
                  Ã¢â‚¬Â¢ Unlimited requests<br />
                  Ã¢â‚¬Â¢ SLA guarantees<br />
                  Ã¢â‚¬Â¢ White-label options
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competition Section */}
      <section id="competition" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">We're Building the <span className="text-purple-400">Next Generation</span></h2>
            <p className="text-xl text-gray-300">Learning from existing solutions and solving their limitations</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900/50 rounded-2xl border border-gray-700">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-6 text-white font-semibold">Feature</th>
                  <th className="text-center p-6 text-purple-400 font-semibold">RhinoBack</th>
                  <th className="text-center p-6 text-gray-400 font-semibold">Firebase</th>
                  <th className="text-center p-6 text-gray-400 font-semibold">Supabase</th>
                  <th className="text-center p-6 text-gray-400 font-semibold">Xano</th>
                  <th className="text-center p-6 text-gray-400 font-semibold">AWS Amplify</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="p-6 text-white">AI-Powered Architecture</td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-6 text-white">Multi-Database Support</td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-6 text-white">Natural Language Input</td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-6 text-white">Visual + Code Interface</td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-6 text-white">Industry Templates</td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="p-6 text-white">Fair Usage Pricing</td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><CheckCircle className="w-5 h-5 text-blue-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                  <td className="p-6 text-center"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6 text-white">Deployment Speed</td>
                  <td className="p-6 text-center text-blue-400 font-semibold">5 min</td>
                  <td className="p-6 text-center text-gray-400">30 min</td>
                  <td className="p-6 text-center text-gray-400">45 min</td>
                  <td className="p-6 text-center text-gray-400">2 hours</td>
                  <td className="p-6 text-center text-gray-400">4 hours</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Why Firebase Falls Short</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm space-y-2">
                <p>Ã¢â‚¬Â¢ Locked into NoSQL - not suitable for complex relations</p>
                <p>Ã¢â‚¬Â¢ Expensive scaling - costs spiral quickly</p>
                <p>Ã¢â‚¬Â¢ Limited backend logic flexibility</p>
                <p>Ã¢â‚¬Â¢ Vendor lock-in with Google ecosystem</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Why Supabase Isn't Enough</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm space-y-2">
                <p>Ã¢â‚¬Â¢ PostgreSQL-only limits architecture choices</p>
                <p>Ã¢â‚¬Â¢ Manual configuration still required</p>
                <p>Ã¢â‚¬Â¢ No AI-powered optimization</p>
                <p>Ã¢â‚¬Â¢ Complex setup for multi-database needs</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Why Xano is Limited</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-sm space-y-2">
                <p>Ã¢â‚¬Â¢ Visual-only interface limits developers</p>
                <p>Ã¢â‚¬Â¢ No natural language input</p>
                <p>Ã¢â‚¬Â¢ Generic templates, not industry-specific</p>
                <p>Ã¢â‚¬Â¢ Expensive scaling ($200+ quickly)</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section id="advantage" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Our <span className="text-purple-400">Unfair</span> Advantages</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-First Architecture</h3>
                <p className="text-gray-300">Our AI doesn't just create databases - it optimizes the entire stack, choosing the right database for each use case automatically.</p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Developer Experience</h3>
                <p className="text-gray-300">Built by developers, for developers. Natural language input with GitHub-inspired interface that developers actually love.</p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Multi-Database Intelligence</h3>
                <p className="text-gray-300">Automatically combines PostgreSQL, Redis, Elasticsearch, and vector databases for optimal performance.</p>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Technology Stack</CardTitle>
                <CardDescription>Built for performance and scale</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Next.js 14 + TypeScript</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">Groq AI (10x faster than OpenAI)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Multi-database architecture</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Real-time streaming</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-white">Enterprise security</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section id="business" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Revenue Scales with Customer Success</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="text-4xl font-bold text-purple-400 mb-2">80%</div>
                <CardTitle className="text-white">SaaS Subscriptions</CardTitle>
                <CardDescription>Recurring revenue from platform usage</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="text-4xl font-bold text-pink-400 mb-2">15%</div>
                <CardTitle className="text-white">Marketplace Templates</CardTitle>
                <CardDescription>Revenue share from community templates</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="text-4xl font-bold text-blue-400 mb-2">5%</div>
                <CardTitle className="text-white">Professional Services</CardTitle>
                <CardDescription>Custom development and consulting</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Unit Economics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">$50</div>
                  <div className="text-gray-300">Customer Acquisition Cost</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">$2,400</div>
                  <div className="text-gray-300">Lifetime Value</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-400 mb-2">85%</div>
                  <div className="text-gray-300">Gross Margin</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">3 months</div>
                  <div className="text-gray-300">Payback Period</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Market Validation */}
      <section id="validation" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Strong Market Validation</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">Proven Market Demand</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-yellow-400 mt-1" />
                  <div>
                    <div className="text-xl font-semibold text-white">Xano: $50M+ ARR</div>
                    <p className="text-gray-300">Proves strong market demand for visual backend builders</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-yellow-400 mt-1" />
                  <div>
                    <div className="text-xl font-semibold text-white">Supabase: $50M raised</div>
                    <p className="text-gray-300">150K+ developers using open-source Firebase alternative</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-yellow-400 mt-1" />
                  <div>
                    <div className="text-xl font-semibold text-white">Firebase: Acquired for $200M+</div>
                    <p className="text-gray-300">Google's validation of the backend-as-a-service model</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-8">Early Validation</h3>
              <div className="space-y-6">
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-blue-400 mb-2">500+</div>
                    <p className="text-white font-semibold">Signups from landing page</p>
                    <p className="text-gray-400 text-sm">in just 2 weeks</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-purple-400 mb-2">15+</div>
                    <p className="text-white font-semibold">Pilot customers ready</p>
                    <p className="text-gray-400 text-sm">to test beta version</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-pink-400 mb-2">3</div>
                    <p className="text-white font-semibold">Agencies want partnerships</p>
                    <p className="text-gray-400 text-sm">for client projects</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Projections */}
      <section id="projections" className="py-20 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Financial Projections</h2>
            <p className="text-xl text-gray-300">Conservative growth model based on proven market data</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-600/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-blue-400">Year 1</CardTitle>
                <CardDescription>Building momentum</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-2xl font-bold text-white">1,000</div>
                  <p className="text-gray-300">Customers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">$360K</div>
                  <p className="text-gray-300">ARR</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-600/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-purple-400">Year 2</CardTitle>
                <CardDescription>Scaling up</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-2xl font-bold text-white">5,000</div>
                  <p className="text-gray-300">Customers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">$2.1M</div>
                  <p className="text-gray-300">ARR</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 border-pink-600/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-pink-400">Year 3</CardTitle>
                <CardDescription>Market leader</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-2xl font-bold text-white">25,000</div>
                  <p className="text-gray-300">Customers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-400">$12.5M</div>
                  <p className="text-gray-300">ARR</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Built by Developers, for Developers</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Technical Founder</h3>
                    <div className="space-y-3 text-gray-300">
                      <p>Ã¢â‚¬Â¢ 4+ years of SaaS MVP development experience</p>
                      <p>Ã¢â‚¬Â¢ Master's in Artificial Intelligence, University at Buffalo</p>
                      <p>Ã¢â‚¬Â¢ Deep expertise in AI and infrastructure</p>
                      <p>Ã¢â‚¬Â¢ Track record of shipping production systems</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Why We'll Win</h3>
                    <div className="space-y-3 text-gray-300">
                      <p>Ã¢â‚¬Â¢ Understanding of real developer pain points</p>
                      <p>Ã¢â‚¬Â¢ Experience building scalable backend systems</p>
                      <p>Ã¢â‚¬Â¢ AI expertise for intelligent architecture decisions</p>
                      <p>Ã¢â‚¬Â¢ Passion for developer experience</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
