"use client"

export default function TechStackSection() {
  return (
    <div className="w-full max-w-[1200px] mt-32 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4">Built on the Best</h2>
        <p className="text-xl text-[#605A57]">Enterprise tech stack your engineers already love</p>
        <p className="text-lg text-[#605A57] mt-2">No proprietary lock-in. Just battle-tested tools.</p>
      </div>
      
      <div className="bg-white rounded-2xl border border-[rgba(55,50,47,0.12)] p-8 md:p-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Frontend */}
          <div>
            <h3 className="text-sm font-bold text-[#37322F] mb-6 uppercase tracking-wider">Frontend</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  N
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">Next.js 15</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  TS
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">TypeScript</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                  TW
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">Tailwind CSS</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white font-bold text-xs">
                  R
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">React 18</span>
              </div>
            </div>
          </div>
          
          {/* Backend */}
          <div>
            <h3 className="text-sm font-bold text-[#37322F] mb-6 uppercase tracking-wider">Backend</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                  E
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">Express.js</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-bold text-xs">
                  N
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">Node.js 18</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs">
                  CDK
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">AWS CDK</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  TS
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">TypeScript</span>
              </div>
            </div>
          </div>
          
          {/* Infrastructure */}
          <div>
            <h3 className="text-sm font-bold text-[#37322F] mb-6 uppercase tracking-wider">Infrastructure</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                  AWS
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">AWS</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs">
                  D
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">Docker</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-xs">
                  TF
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">Terraform</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  PG
                </div>
                <span className="text-sm font-medium text-[#605A57] group-hover:text-[#005BE3]">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Why These Tools */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-200/50">
        <h3 className="text-2xl font-bold text-[#1d1d1f] mb-6 text-center">Why these tools?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-[#005BE3]" />
            </div>
            <div>
              <p className="font-semibold text-[#37322F] mb-1">Industry standard (no vendor lock-in)</p>
              <p className="text-sm text-[#605A57]">Use tools your team already knows</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-[#005BE3]" />
            </div>
            <div>
              <p className="font-semibold text-[#37322F] mb-1">Battle-tested at scale</p>
              <p className="text-sm text-[#605A57]">Billions of requests handled daily</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-[#005BE3]" />
            </div>
            <div>
              <p className="font-semibold text-[#37322F] mb-1">Your team already knows them</p>
              <p className="text-sm text-[#605A57]">Zero learning curve for standard tools</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-[#005BE3]" />
            </div>
            <div>
              <p className="font-semibold text-[#37322F] mb-1">Huge ecosystem</p>
              <p className="text-sm text-[#605A57]">Thousands of plugins and integrations</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-[#005BE3]" />
            </div>
            <div>
              <p className="font-semibold text-[#37322F] mb-1">Long-term support</p>
              <p className="text-sm text-[#605A57]">Not going anywhere, backed by giants</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Check className="w-6 h-6 text-[#005BE3]" />
            </div>
            <div>
              <p className="font-semibold text-[#37322F] mb-1">99.99% uptime</p>
              <p className="text-sm text-[#605A57]">Production-ready infrastructure</p>
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
