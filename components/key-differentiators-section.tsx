"use client"

import { Code2, DoorOpen, ShieldCheck, Tag } from 'lucide-react'

export default function KeyDifferentiatorsSection() {
  return (
    <div className="w-full max-w-[1200px] mt-32 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4">Why Developers Choose SnapInfra</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Real Code, Real Control */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-xl bg-[#005BE3] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Code2 className="w-7 h-7" />
          </div>
          
          <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4">Real Code, Real Control</h3>
          <p className="text-[#605A57] mb-6 leading-relaxed">
            Generate TypeScript/Python infrastructure that you own. Every resource, every config - inspect it, version it, customize it. No proprietary formats. No magic black boxes.
          </p>
          
          <div className="bg-[#1d1d1f] rounded-lg p-4 mb-6 font-mono text-xs overflow-x-auto">
            <div className="text-gray-500 mb-2">// Your generated API route</div>
            <div className="text-purple-400">export <span className="text-purple-400">const</span> <span className="text-yellow-400">createTask</span> = <span className="text-purple-400">async</span> (req) =&gt; &#123;</div>
            <div className="pl-4 text-white">  <span className="text-purple-400">const</span> task = <span className="text-purple-400">await</span> db.tasks.<span className="text-yellow-400">create</span>(&#123;</div>
            <div className="pl-8 text-white">    userId: req.user.id,</div>
            <div className="pl-8 text-white">    title: req.body.title,</div>
            <div className="pl-8 text-gray-500">    // Full TypeScript - edit as needed</div>
            <div className="pl-4 text-white">  &#125;);</div>
            <div className="pl-4 text-purple-400">  return <span className="text-white">task</span>;</div>
            <div className="text-white">&#125;</div>
          </div>
          
          <div className="space-y-2 text-sm text-[#605A57]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>TypeScript with full type safety</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Standard Express.js patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>ESLint + Prettier configured</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Read it, own it, extend it</span>
            </div>
          </div>
        </div>
        
        {/* Card 2: Exit Strategy Included */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-xl bg-[#10B981] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <DoorOpen className="w-7 h-7" />
          </div>
          
          <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4">Exit Strategy Included</h3>
          <p className="text-[#605A57] mb-6 leading-relaxed">
            Export your entire backend as standard Terraform + Docker Compose. Migrate to AWS, GCP, or your own servers without rewriting a single line. We compete on quality, not lock-in.
          </p>
          
          <div className="bg-[#1d1d1f] rounded-lg p-4 mb-6 font-mono text-xs overflow-x-auto">
            <div className="text-green-400">$ snapinfra export --format terraform</div>
            <div className="text-white mt-2">Exporting your infrastructure...</div>
            <div className="text-green-400 mt-1">✓ main.tf</div>
            <div className="text-green-400">✓ variables.tf</div>
            <div className="text-green-400">✓ docker-compose.yml</div>
            <div className="text-green-400">✓ README.md (migration guide)</div>
            <div className="text-white mt-2">Done! Deploy anywhere.</div>
          </div>
          
          <div className="space-y-2 text-sm text-[#605A57]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Standard Terraform (no vendor DSL)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Docker Compose for local dev</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Full migration documentation</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Zero lock-in, ever</span>
            </div>
          </div>
        </div>
        
        {/* Card 3: No $30K Surprise Bills */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Tag className="w-7 h-7" />
          </div>
          
          <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4">No $30K Surprise Bills</h3>
          <p className="text-[#605A57] mb-6 leading-relaxed">
            Usage caps prevent Firebase nightmares. See exactly what you'll pay at 10x scale before you deploy. No hidden egress fees. No per-read pricing traps.
          </p>
          
          <div className="bg-white rounded-lg p-6 mb-6 border border-[rgba(55,50,47,0.12)]">
            <div className="text-sm font-semibold text-[#37322F] mb-4">Your cost at scale:</div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#605A57]">Current: 10K users</span>
                <span className="font-semibold text-[#005BE3]">$49/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#605A57]">100K users</span>
                <span className="font-semibold text-[#005BE3]">$99/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#605A57]">1M users</span>
                <span className="font-semibold text-[#005BE3]">$249/mo (capped at $299)</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[rgba(55,50,47,0.12)] space-y-2 text-xs text-[#605A57]">
              <div>Compare:</div>
              <div>Firebase at 1M: ~$2,847/mo</div>
              <div>Supabase Pro: ~$419/mo</div>
              <div>AWS DIY: ~$280/mo + 3 engineers</div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-[#605A57]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Usage caps included</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>No surprise bills, ever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
        
        {/* Card 4: Production-Ready From Day One */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
          <div className="w-14 h-14 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
          
          <h3 className="text-2xl font-bold text-[#1d1d1f] mb-4">Production-Ready From Day One</h3>
          <p className="text-[#605A57] mb-6 leading-relaxed">
            Transaction support. Full-text search. Row-level security. Automated backups. Everything Supabase charges extra for or "doesn't support yet."
          </p>
          
          <div className="space-y-2.5 text-sm text-[#605A57] mb-6">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>ACID transactions (not in Supabase)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Full-text search (no Algolia needed)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Row-level security (PostgreSQL RLS)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Point-in-time recovery (included)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Automated backups (daily)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Real-time subscriptions (WebSockets)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Auto-generated APIs (REST + GraphQL)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Edge Functions (faster than Supabase)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>File storage (S3-compatible)</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Authentication (OAuth + passwordless)</span>
            </div>
          </div>
          
          <div className="inline-block px-4 py-2 bg-[#8B5CF6]/10 rounded-lg text-sm font-medium text-[#8B5CF6]">
            Enterprise features, startup pricing
          </div>
        </div>
      </div>
    </div>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
