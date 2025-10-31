"use client"

import Link from 'next/link'

export default function FinalCTASection() {
  return (
    <div className="w-full mt-32 px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#005BE3] via-[#004BC9] to-[#06B6D4] p-16 md:p-24 shadow-2xl">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { left: 10, top: 20, delay: 0, duration: 8 },
            { left: 25, top: 15, delay: 1, duration: 10 },
            { left: 40, top: 30, delay: 2, duration: 12 },
            { left: 55, top: 25, delay: 0.5, duration: 9 },
            { left: 70, top: 40, delay: 1.5, duration: 11 },
            { left: 85, top: 35, delay: 2.5, duration: 13 },
            { left: 15, top: 50, delay: 3, duration: 7 },
            { left: 30, top: 60, delay: 0.8, duration: 10 },
            { left: 45, top: 70, delay: 1.8, duration: 9 },
            { left: 60, top: 65, delay: 2.8, duration: 11 },
            { left: 75, top: 55, delay: 3.5, duration: 8 },
            { left: 90, top: 75, delay: 4, duration: 12 },
            { left: 20, top: 80, delay: 1.2, duration: 10 },
            { left: 35, top: 85, delay: 2.2, duration: 9 },
            { left: 50, top: 90, delay: 3.2, duration: 11 },
            { left: 65, top: 10, delay: 4.2, duration: 13 },
            { left: 80, top: 5, delay: 0.3, duration: 8 },
            { left: 5, top: 45, delay: 1.3, duration: 10 },
            { left: 95, top: 50, delay: 2.3, duration: 12 },
            { left: 12, top: 95, delay: 3.3, duration: 9 },
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            From Idea to Production in 5 Minutes
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Join 10,000+ developers building the future, faster
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/sign-up">
              <button className="px-10 py-5 bg-white hover:bg-gray-100 text-[#005BE3] text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                Start Building Free →
              </button>
            </Link>
          </div>
          
          <p className="text-white/80 text-sm">
            No credit card • Full source ownership
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-white/90">
            <Link href="/demo" className="hover:text-white transition-colors font-medium">
              Book Demo
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors font-medium">
              Read Docs
            </Link>
            <a href="https://discord.gg/snapinfra" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
              Join Discord
            </a>
          </div>
          
          {/* Trust Badges */}
          <div className="pt-12 flex flex-wrap gap-6 justify-center items-center">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <span className="text-white text-sm font-medium">SOC 2 Type II</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <span className="text-white text-sm font-medium">ISO 27001</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <span className="text-white text-sm font-medium">GDPR Compliant</span>
            </div>
          </div>
          
          <p className="text-white/70 text-sm pt-4">
            Join 543 developers who signed up today
          </p>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.2;
            }
            50% {
              transform: translateY(-20px) translateX(10px);
              opacity: 0.5;
            }
          }
          .animate-float {
            animation: float linear infinite;
          }
        `}</style>
      </div>
    </div>
  )
}
