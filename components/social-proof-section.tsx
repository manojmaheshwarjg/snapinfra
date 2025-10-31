"use client"

export default function SocialProofSection() {
  return (
    <div className="w-full max-w-[1200px] mt-32 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4">Trusted by Developers Who Ship</h2>
        <p className="text-xl text-[#605A57]">Don't take our word for it</p>
      </div>
      
      {/* Founder Story */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-12 border border-blue-200/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#005BE3] to-[#004BC9] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              MJ
            </div>
            <div className="flex-1">
              <p className="text-lg text-[#605A57] leading-relaxed mb-4">
                "After migrating from Firebase (surprise costs) to Supabase (missing transactions) to raw Terraform (6-month learning hell), I asked: why doesn't the 'just right' solution exist?
              </p>
              <p className="text-lg text-[#605A57] leading-relaxed mb-4">
                We're not trying to replace Firebase for todo apps or Kubernetes for Netflix. We're for the 99% in between—teams building real products who need production-grade infrastructure without becoming DevOps experts.
              </p>
              <p className="text-lg text-[#605A57] leading-relaxed mb-6">
                SnapInfra is the backend platform we wish we'd had."
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-[#1d1d1f]">Manoj Maheshwar JG</p>
                  <p className="text-sm text-[#605A57]">CEO & Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Testimonial 1 */}
        <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
              SC
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f]">Sarah Chen</p>
              <p className="text-xs text-[#605A57]">CTO @ TaskFlow (YC W23)</p>
            </div>
          </div>
          
          <p className="text-sm text-[#605A57] leading-relaxed mb-4">
            "We needed PostgreSQL transactions but Supabase doesn't support them. Building our own infrastructure would take 3 months. SnapInfra deployed in an afternoon—we shipped that day."
          </p>
          
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">⭐</span>
            ))}
          </div>
          
          <div className="space-y-1 text-xs text-[#605A57]">
            <p><strong>Results:</strong></p>
            <p>• 3 months → 4 hours (time saved)</p>
            <p>• $0 → MVP launched (revenue enabled)</p>
            <p>• 0 → 10K users (scaled without rewrites)</p>
          </div>
        </div>
        
        {/* Testimonial 2 */}
        <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
              MR
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f]">Marcus Rodriguez</p>
              <p className="text-xs text-[#605A57]">Founder @ Indie Analytics</p>
            </div>
          </div>
          
          <p className="text-sm text-[#605A57] leading-relaxed mb-4">
            "Firebase was going to cost me $800/month at scale. SnapInfra is $99 with predictable costs. As a solo founder, that's the difference between profitable and burning runway."
          </p>
          
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">⭐</span>
            ))}
          </div>
          
          <div className="space-y-1 text-xs text-[#605A57]">
            <p><strong>Results:</strong></p>
            <p>• $800 → $99/mo (savings)</p>
            <p>• 6 weeks → 3 days (rebuild time)</p>
            <p>• Profitable from month 2</p>
          </div>
        </div>
        
        {/* Testimonial 3 */}
        <div className="bg-white rounded-2xl p-8 border border-[rgba(55,50,47,0.12)] hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
              AT
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f]">Alex Thompson</p>
              <p className="text-xs text-[#605A57]">Platform Lead @ HealthTech Corp</p>
            </div>
          </div>
          
          <p className="text-sm text-[#605A57] leading-relaxed mb-4">
            "We needed self-hosted for HIPAA compliance but didn't want to become a DevOps shop. SnapInfra's one-command deploy gave us Supabase DX with our own infrastructure. Audit passed first try."
          </p>
          
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">⭐</span>
            ))}
          </div>
          
          <div className="space-y-1 text-xs text-[#605A57]">
            <p><strong>Results:</strong></p>
            <p>• SOC 2 + HIPAA compliant (self-hosted)</p>
            <p>• 2 DevOps engineers → 0 (team efficiency)</p>
            <p>• $300K/year savings (vs hiring)</p>
          </div>
        </div>
      </div>
      
      {/* Trust Metrics */}
      <div className="bg-white rounded-2xl border border-[rgba(55,50,47,0.12)] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#005BE3] mb-2">95%</div>
            <div className="text-sm text-[#605A57] font-medium">faster</div>
            <div className="text-xs text-[#605A57]/70 mt-1">Time to market vs Terraform</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#005BE3] mb-2">10,000+</div>
            <div className="text-sm text-[#605A57] font-medium">developers</div>
            <div className="text-xs text-[#605A57]/70 mt-1">Building on SnapInfra</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#005BE3] mb-2">$2.1M</div>
            <div className="text-sm text-[#605A57] font-medium">saved</div>
            <div className="text-xs text-[#605A57]/70 mt-1">In eng costs</div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center text-sm text-[#605A57]">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span>4.9/5 on G2</span>
          </div>
          <span className="hidden md:block">•</span>
          <div>Featured on Product Hunt</div>
          <span className="hidden md:block">•</span>
          <div>YC Top Company W24</div>
        </div>
      </div>
    </div>
  )
}
