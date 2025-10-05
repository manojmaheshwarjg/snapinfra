"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Database, Code2, Lock, Boxes, Server, Zap, Check, ArrowUp, Sparkles } from "lucide-react"
import DocumentationSection from "@/components/documentation-section"
import TestimonialsSection from "@/components/testimonials-section"
import PricingSection from "@/components/pricing-section"
import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import FooterSection from "@/components/footer-section"

// Interactive Prompt Box Component
function InteractivePromptBox() {
  const [prompt, setPrompt] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (prompt.trim()) {
      // Store the prompt in sessionStorage to pass to onboarding
      sessionStorage.setItem('backend-prompt', prompt)
      // Redirect to sign-up
      router.push('/sign-up')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [prompt])

  return (
    <div className="w-full relative">
      {/* Animated rainbow gradient border */}
      <div className="absolute inset-0 rounded-2xl p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 animate-gradient-border">
        <div className="w-full h-full rounded-2xl"></div>
      </div>
      
      {/* Flowing gradient background animation */}
      <div className="absolute inset-[3px] rounded-2xl overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 animate-gradient-flow"></div>
      </div>
      
      {/* Background glow effect */}
      <div className={`absolute -inset-2 bg-gradient-to-r from-blue-500/40 via-purple-500/40 via-pink-500/40 to-orange-500/40 rounded-2xl blur-2xl transition-opacity duration-300 ${
        isFocused ? 'opacity-100 animate-pulse' : 'opacity-60'
      }`}></div>
      
      {/* Main input container */}
      <div className="relative rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden" style={{ margin: '3px' }}>
        {/* Semi-transparent dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d1d1f]/80 via-[#2c2c2e]/80 to-[#1d1d1f]/80 backdrop-blur-sm z-0"></div>
        <div className="flex items-start gap-3 p-4 sm:p-5 relative z-10">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="multi-tenant SaaS with usage-based billing. need RBAC, audit logs, and analytics dashboards."
            className="flex-1 bg-transparent text-white placeholder-[rgba(255,255,255,0.4)] text-sm sm:text-base resize-none outline-none min-h-[24px] overflow-hidden font-sans"
            rows={1}
          />
          
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
              prompt.trim()
                ? 'bg-gradient-to-b from-[#0071E3] to-[#0077ED] hover:from-[#0077ED] hover:to-[#0088FF] shadow-[0_2px_8px_rgba(0,119,237,0.4)] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,119,237,0.5)] hover:scale-105'
                : 'bg-white/10 cursor-not-allowed'
            }`}
          >
            <ArrowUp className={`w-5 h-5 ${
              prompt.trim() ? 'text-white' : 'text-white/30'
            }`} />
          </button>
        </div>
        
        {/* Bottom row with hints */}
        <div className="px-4 sm:px-5 pb-3 flex items-center gap-2 text-xs text-[rgba(255,255,255,0.5)] relative z-10">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border border-[rgba(255,255,255,0.3)] flex items-center justify-center">
              <span className="text-[8px]">⏎</span>
            </div>
            <span>to send</span>
          </div>
          <span>•</span>
          <span>Shift + ⏎ for new line</span>
        </div>
      </div>
    </div>
  )
}

// Badge Component
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}


// Feature Card with Progress
function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-br from-white to-[#fafafa] shadow-[0_2px_16px_rgba(0,119,237,0.08),0_0_0_1px_rgba(0,119,237,0.1)]"
          : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80 hover:bg-white/50"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#0077ED]/20 to-transparent">
          <div
            className="h-full bg-gradient-to-r from-[#0071E3] via-[#0077ED] to-[#00C7BE] transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(0,119,237,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)

  // Add gradient animation styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes gradient-flow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes gradient-border {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes gradient-text {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes gradient-button {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-flow {
        background-size: 200% 200%;
        animation: gradient-flow 8s ease infinite;
      }
      .animate-gradient-border {
        background-size: 300% 300%;
        animation: gradient-border 6s ease infinite;
      }
      .animate-gradient-text {
        background-size: 300% 300%;
        animation: gradient-text 5s ease infinite;
      }
      .animate-gradient-button {
        background-size: 300% 300%;
        animation: gradient-button 4s ease infinite;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3)
          }
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return
    setActiveCard(index)
    setProgress(0)
  }

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-br from-[#fafaf9] via-[#f5f3f0] to-[#ede9e3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Navigation */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-white/80 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30 border border-black/5">
                <div className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      RhinoBack
                    </div>
                  </div>
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 flex justify-start items-start hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors">
                        Features
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors">
                        Pricing
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors">
                        Docs
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
                  <Link href="/sign-in">
                    <div className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 animate-gradient-button shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.24)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:shadow-[0_4px_12px_rgba(138,43,226,0.4)] transition-all duration-200">
                      <div className="flex flex-col justify-center text-white text-xs md:text-[13px] font-semibold leading-5 font-sans">
                        Log in
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[180px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[900px] flex flex-col justify-center items-center gap-2 sm:gap-3">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5">
                  {/* Beta Chip */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-[#37322F]/10 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                    <div className="relative flex items-center justify-center w-2 h-2">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                      <div className="relative w-full h-full bg-emerald-500 rounded-full"></div>
                    </div>
                    <span className="text-[#37322F] text-xs font-semibold tracking-tight">Beta</span>
                  </div>
              <div className="w-full max-w-[700px] text-center flex justify-center flex-col text-[28px] xs:text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-normal leading-[1.15] sm:leading-[1.15] md:leading-[1.15] font-serif px-2 sm:px-4 md:px-0">
                    <span className="bg-gradient-to-br from-[#1d1d1f] via-[#2c2c2e] to-[#1d1d1f] bg-clip-text text-transparent">Your best engineers are</span>
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent font-medium animate-gradient-text">solving solved problems.</span>
                  </div>
                  <div className="w-full max-w-[700px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] text-sm sm:text-base md:text-lg leading-[1.5] sm:leading-[1.55] md:leading-[1.6] font-sans px-2 sm:px-4 md:px-0 font-medium">
                    While your team rebuilds auth for the third time, competitors are shipping features customers actually pay for.
                    <br className="hidden sm:block" />
                    Generate enterprise backends in hours. Focus on what differentiates you.
                  </div>
                </div>
              </div>

              {/* Interactive Input Box */}
              <div className="w-full max-w-[800px] lg:w-[800px] flex flex-col justify-center items-center gap-3 relative z-10 mt-8 px-4">
                <InteractivePromptBox />
              </div>

              {/* Feature Cards Section */}
              <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start mt-16">
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Left decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
                  <FeatureCard
                    title="Enterprise-grade architecture"
                    description="Not starter templates. Production-ready systems with scalability, observability, and security baked in from the start."
                    isActive={activeCard === 0}
                    progress={activeCard === 0 ? progress : 0}
                    onClick={() => handleCardClick(0)}
                  />
                  <FeatureCard
                    title="Own your infrastructure"
                    description="Full source code export. Deploy to your cloud. Customize everything. No vendor lock-in, no compromises."
                    isActive={activeCard === 1}
                    progress={activeCard === 1 ? progress : 0}
                    onClick={() => handleCardClick(1)}
                  />
                  <FeatureCard
                    title="Accelerate time-to-market"
                    description="Your team focuses on differentiated features. We handle auth, APIs, compliance. Ship 10x faster."
                    isActive={activeCard === 2}
                    progress={activeCard === 2 ? progress : 0}
                    onClick={() => handleCardClick(2)}
                  />
                </div>

                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Right decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Infrastructure Section - NEW */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center mt-16">
                <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-16 py-12 sm:py-16 md:py-20 flex justify-center items-center">
                  <div className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Left side - The Problem */}
                    <div className="flex flex-col gap-6">
                      <div className="inline-flex">
                        <div className="px-3 py-1.5 bg-red-50 rounded-full border border-red-100">
                          <span className="text-red-700 text-xs font-semibold">The Problem</span>
                        </div>
                      </div>
                      <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-normal leading-tight font-serif">
                        Infrastructure is killing velocity
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                          <div>
                            <h4 className="text-[#37322F] text-base font-semibold font-sans mb-1">6-8 weeks to MVP</h4>
                            <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                              Your team spends months on auth, role management, and API scaffolding. Competitors ship faster.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                          <div>
                            <h4 className="text-[#37322F] text-base font-semibold font-sans mb-1">Technical debt compounds</h4>
                            <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                              Quick decisions become architectural nightmares. Refactoring at 50k users costs millions in engineering hours.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                          <div>
                            <h4 className="text-[#37322F] text-base font-semibold font-sans mb-1">Compliance & security gaps</h4>
                            <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                              SOC 2, GDPR, audit logs. One security incident or failed audit derails your entire roadmap.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - The Solution */}
                    <div className="flex flex-col gap-6">
                      <div className="inline-flex">
                        <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xs font-semibold">The Solution</span>
                        </div>
                      </div>
                      <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-normal leading-tight font-serif">
                        Enterprise infrastructure, instantly
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-[#37322F] text-base font-semibold font-sans mb-1">Production-ready in hours</h4>
                            <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                              Multi-tenant auth, RBAC, SSO, audit logs. Everything enterprises demand, generated and deployed instantly.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-[#37322F] text-base font-semibold font-sans mb-1">Built for scale</h4>
                            <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                              Optimized database architecture, query patterns, caching strategies. Handles 10M+ users without breaking a sweat.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-[#37322F] text-base font-semibold font-sans mb-1">Compliance-ready</h4>
                            <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                              SOC 2, HIPAA, GDPR controls built-in. Audit trails, data encryption, access controls. Pass audits with confidence.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center mt-16">
                <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                      icon={
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="3" width="4" height="6" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="7" y="1" width="4" height="8" stroke="#37322F" strokeWidth="1" fill="none" />
                        </svg>
                      }
                      text="Why RhinoBack"
                    />
                    <div className="w-full max-w-[472.55px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-normal leading-tight md:leading-[60px] font-serif">
                      Move fast without breaking things
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      Your engineers shouldn't spend months rebuilding what already exists.
                      <br className="hidden sm:block" />
                      Generate enterprise-grade backends. Ship features that drive revenue.
                    </div>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="self-stretch flex justify-center items-start border-t">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden hidden md:block">
                    <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {[
                      { icon: <Zap className="w-6 h-6" />, title: "10x faster iteration", desc: "Ship MVPs in days, not quarters. Validate product-market fit before burning through your Series A." },
                      { icon: <Code2 className="w-6 h-6" />, title: "Production-grade code", desc: "Enterprise patterns, comprehensive testing, full documentation. Code your senior engineers will approve." },
                      { icon: <Database className="w-6 h-6" />, title: "Scale-ready architecture", desc: "Optimized queries, proper indexing, efficient caching. Built to handle millions of users from day one." },
                      { icon: <Lock className="w-6 h-6" />, title: "Security & compliance", desc: "SOC 2, HIPAA, GDPR controls. Encryption, audit logs, access management. Enterprise security by default." },
                      { icon: <Boxes className="w-6 h-6" />, title: "Modular & maintainable", desc: "Clean architecture patterns. Easy to extend, simple to maintain. Onboard new engineers in hours, not weeks." },
                      { icon: <Server className="w-6 h-6" />, title: "Your infrastructure", desc: "Deploy to your AWS, GCP, or Azure. Full source code ownership. No vendor lock-in, ever." },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="p-6 md:p-8 lg:p-10 border-b border-r border-[rgba(55,50,47,0.12)] last:border-r-0 flex flex-col gap-4 group hover:bg-gradient-to-br hover:from-white/50 hover:to-white/30 transition-all duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0071E3]/10 to-[#00C7BE]/10 flex items-center justify-center text-[#0077ED] group-hover:from-[#0071E3]/20 group-hover:to-[#00C7BE]/20 group-hover:shadow-[0_4px_12px_rgba(0,119,237,0.15)] transition-all duration-300">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-[#37322F] text-lg font-semibold leading-tight font-sans mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-[#605A57] text-sm font-normal leading-relaxed font-sans">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden hidden md:block">
                    <div className="w-[162px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Section */}
              <DocumentationSection />

              {/* Testimonials Section */}
              <TestimonialsSection />

              {/* Pricing Section */}
              <PricingSection />

              {/* FAQ Section */}
              <FAQSection />

              {/* CTA Section */}
              <CTASection />

              {/* Footer Section */}
              <FooterSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

