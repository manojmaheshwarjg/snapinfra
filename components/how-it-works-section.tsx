"use client"

export default function HowItWorksSection() {
  return (
    <div className="w-full max-w-[1200px] mt-32 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4">From idea to production in 5 minutes</h2>
        <p className="text-xl text-[#605A57]">Simple enough for solo devs. Powerful enough for unicorns.</p>
      </div>
      
      <div className="space-y-16">
        {/* Step 1: Describe What You Want */}
        <div className="relative">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#005BE3] to-[#004BC9] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              01
            </div>
            <h3 className="text-3xl font-bold text-[#1d1d1f]">Describe What You Want</h3>
          </div>
          
          <div className="bg-white rounded-2xl border border-[rgba(55,50,47,0.12)] p-8 shadow-xl">
            <div className="bg-[#f8f8f8] rounded-lg p-6 border border-[rgba(55,50,47,0.12)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💬</span>
                <span className="text-sm font-semibold text-[#37322F]">What should your backend do?</span>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-sm text-[#605A57] leading-relaxed">
                "Build a SaaS application backend with:
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>User authentication (email + Google)</li>
                  <li>Subscription billing (Stripe)</li>
                  <li>File uploads to S3</li>
                  <li>Real-time notifications</li>
                  <li>Usage analytics dashboard"</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-lg font-semibold text-[#37322F]">Speaks human. Thinks code. Builds infrastructure.</p>
              <p className="text-sm text-[#605A57]">No JSON schemas. No DSL syntax. No config hell. Just describe what you're building.</p>
            </div>
          </div>
        </div>
        
        {/* Step 2: AI Generates Everything */}
        <div className="relative">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              02
            </div>
            <h3 className="text-3xl font-bold text-[#1d1d1f]">AI Generates Everything</h3>
          </div>
          
          <div className="bg-white rounded-2xl border border-[rgba(55,50,47,0.12)] p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-[#f8f8f8] rounded-lg p-6 border border-[rgba(55,50,47,0.12)]">
                <h4 className="text-sm font-bold text-[#37322F] mb-4">Backend Code</h4>
                <div className="space-y-2 text-xs text-[#605A57] font-mono">
                  <div>routes/</div>
                  <div className="pl-3">├─ auth</div>
                  <div className="pl-3">├─ billing</div>
                  <div className="pl-3">├─ files</div>
                  <div className="pl-3">└─ notify</div>
                  <div className="mt-2">services/</div>
                  <div className="pl-3">├─ stripe</div>
                  <div className="pl-3">└─ email</div>
                  <div className="mt-4 text-[#005BE3] font-semibold">[109 files]</div>
                </div>
              </div>
              
              <div className="bg-[#f8f8f8] rounded-lg p-6 border border-[rgba(55,50,47,0.12)]">
                <h4 className="text-sm font-bold text-[#37322F] mb-4">Database Schema</h4>
                <div className="space-y-2 text-xs text-[#605A57] font-mono">
                  <div>users</div>
                  <div className="pl-3">├─ id</div>
                  <div className="pl-3">├─ email</div>
                  <div className="pl-3">└─ plan</div>
                  <div className="mt-2">subscriptions</div>
                  <div className="pl-3">├─ id</div>
                  <div className="pl-3">├─ userId</div>
                  <div className="pl-3">└─ status</div>
                  <div className="mt-4 text-[#005BE3] font-semibold">[4 tables, 3 GSIs]</div>
                </div>
              </div>
              
              <div className="bg-[#f8f8f8] rounded-lg p-6 border border-[rgba(55,50,47,0.12)]">
                <h4 className="text-sm font-bold text-[#37322F] mb-4">AWS Infrastructure</h4>
                <div className="space-y-2 text-xs text-[#605A57] font-mono">
                  <div>DynamoDB</div>
                  <div className="pl-3">tables</div>
                  <div className="mt-2">S3</div>
                  <div className="pl-3">buckets</div>
                  <div className="mt-2">SQS</div>
                  <div className="pl-3">queues</div>
                  <div className="mt-2">SNS</div>
                  <div className="pl-3">topics</div>
                  <div className="mt-4 text-[#005BE3] font-semibold">[CDK]</div>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-[#37322F]">Production-ready code. Enterprise patterns.</p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-[#605A57]">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Express.js + TypeScript</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>PostgreSQL-compatible schema</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>AWS CDK infrastructure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Docker Compose for local dev</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Jest tests (80%+ coverage)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>OpenAPI documentation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Step 3: Deploy & Scale */}
        <div className="relative">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              03
            </div>
            <h3 className="text-3xl font-bold text-[#1d1d1f]">Deploy & Scale</h3>
          </div>
          
          <div className="bg-white rounded-2xl border border-[rgba(55,50,47,0.12)] p-8 shadow-xl">
            <p className="text-sm font-semibold text-[#37322F] mb-6">Choose your deployment:</p>
            
            <div className="space-y-4 mb-8">
              <div className="border-2 border-[#005BE3] bg-[#005BE3]/5 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <input type="radio" className="w-4 h-4" checked readOnly />
                  <span className="font-semibold text-[#005BE3]">One-Click Hosted (Recommended)</span>
                </div>
                <p className="text-sm text-[#605A57] ml-7">Deploy to SnapInfra Cloud in 30 seconds</p>
                <div className="flex gap-4 ml-7 mt-2 text-xs text-[#605A57]">
                  <span>✓ Auto-scaling</span>
                  <span>✓ Monitoring</span>
                  <span>✓ Backups</span>
                </div>
              </div>
              
              <div className="border border-[rgba(55,50,47,0.12)] rounded-lg p-6 hover:border-[#005BE3]/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <input type="radio" className="w-4 h-4" />
                  <span className="font-semibold text-[#37322F]">Deploy to Your AWS</span>
                </div>
                <p className="text-sm text-[#605A57] ml-7">Use your own AWS account and credentials</p>
                <div className="flex gap-4 ml-7 mt-2 text-xs text-[#605A57]">
                  <span>✓ Full control</span>
                  <span>✓ Your billing</span>
                </div>
              </div>
              
              <div className="border border-[rgba(55,50,47,0.12)] rounded-lg p-6 hover:border-[#005BE3]/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <input type="radio" className="w-4 h-4" />
                  <span className="font-semibold text-[#37322F]">Self-Hosted</span>
                </div>
                <p className="text-sm text-[#605A57] ml-7">Run on your own servers/VPS</p>
                <div className="flex gap-4 ml-7 mt-2 text-xs text-[#605A57]">
                  <span>✓ One command</span>
                  <span>✓ Docker Compose</span>
                </div>
              </div>
              
              <div className="border border-[rgba(55,50,47,0.12)] rounded-lg p-6 hover:border-[#005BE3]/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <input type="radio" className="w-4 h-4" />
                  <span className="font-semibold text-[#37322F]">Export Only</span>
                </div>
                <p className="text-sm text-[#605A57] ml-7">Get the code, deploy however you want</p>
                <div className="flex gap-4 ml-7 mt-2 text-xs text-[#605A57]">
                  <span>✓ Terraform</span>
                  <span>✓ Full ownership</span>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-[#37322F]">Live in 30 seconds. Not 30 days.</p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-[#605A57]">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Zero-downtime deploys</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Automatic SSL certificates</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>CDN edge locations</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" />
                  <span>Health checks & auto-recovery</span>
                </div>
              </div>
            </div>
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
