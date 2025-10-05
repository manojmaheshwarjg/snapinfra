import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Code2, Lock, Boxes, Server, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />
        
        <div className="relative container mx-auto px-4 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="inline-block">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wider uppercase">Problem</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-tight">
              Backend dev is{" "}
              <span className="text-red-500 italic font-serif">mundane</span>
            </h1>
            
            <div className="space-y-3 text-lg md:text-xl max-w-3xl mx-auto">
              <p className="text-foreground">
                <span className="font-semibold">Current reality:</span> 2-4 weeks for basic CRUD
              </p>
              <p className="text-foreground">
                <span className="font-semibold">Cost:</span> $10K-$50K just for MVP infrastructure*
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/sign-up">
                <Button size="lg" className="text-base px-8 py-6 h-auto rounded-xl">
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 h-auto rounded-xl">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Breakdown */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProblemCard number="01" title="Database" />
            <ProblemCard number="02" title="System Architecture" />
            <ProblemCard number="03" title="API Development" />
            <ProblemCard number="04" title="Security/ Scalability" />
            <ProblemCard number="05" title="Business Logic" />
            <ProblemCard number="06" title="Servers" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 rounded-2xl bg-muted/30 border border-border">
              <p className="text-base leading-relaxed text-muted-foreground">
                Developers spend forever building the same boring infrastructure over and over
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-muted/30 border border-border">
              <p className="text-base leading-relaxed text-muted-foreground">
                Database schemas, REST endpoints, auth flows - it's all predictable patterns
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-muted/30 border border-border">
              <p className="text-base leading-relaxed text-muted-foreground">
                Every startup sits around waiting for their backend while competitors ship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-blue-50/30 to-background dark:via-blue-950/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="inline-block">
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold tracking-wider uppercase">Solution</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight">
              Build backends that{" "}
              <span className="text-primary font-serif">absolutely slap</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered backend generation that transforms your ideas into production-ready infrastructure in minutes, not weeks.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-7 h-7" />}
              title="10x Faster"
              description="Generate complete backend architectures in minutes instead of weeks."
            />
            <FeatureCard
              icon={<Code2 className="w-7 h-7" />}
              title="Production Ready"
              description="Clean, maintainable code following industry best practices and standards."
            />
            <FeatureCard
              icon={<Database className="w-7 h-7" />}
              title="Smart Schemas"
              description="Intelligent database design with optimized relationships and indexes."
            />
            <FeatureCard
              icon={<Lock className="w-7 h-7" />}
              title="Secure by Default"
              description="Built-in authentication, authorization, and data validation."
            />
            <FeatureCard
              icon={<Boxes className="w-7 h-7" />}
              title="Modular & Scalable"
              description="Clean architecture that grows with your business needs."
            />
            <FeatureCard
              icon={<Server className="w-7 h-7" />}
              title="Deploy Anywhere"
              description="Export to your preferred cloud platform or hosting service."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            Stop wasting time on boilerplate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join developers who are shipping faster and focusing on what actually matters—building great products.
          </p>
          <div className="pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-10 py-7 h-auto rounded-xl">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required · 5 minute setup
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-muted-foreground">
              © 2025 RhinoBack. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProblemCard({ number, title }: { number: string; title: string }) {
  return (
    <div className="group relative p-6 rounded-2xl border-2 border-border bg-background hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{number}</span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 rounded-2xl border border-border bg-background/50 backdrop-blur hover:bg-accent/30 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
