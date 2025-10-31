"use client"

import { Shield, Lock, FileCheck } from 'lucide-react'

export default function SecurityComplianceSection() {
  return (
    <div className="w-full max-w-[1200px] mt-32 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-4">Built secure. Stays secure.</h2>
        <p className="text-xl text-[#605A57]">SOC 2, HIPAA, GDPR compliant from day one</p>
      </div>
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-200/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Security Features */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#005BE3] flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f]">Security Features</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">Encryption at rest (AES-256)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">Encryption in transit (TLS 1.3)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">Row-level security (PostgreSQL RLS)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">API key rotation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">IP allowlisting</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">DDoS protection (CloudFlare)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">Automated security updates</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">Penetration testing (quarterly)</span>
              </div>
            </div>
          </div>
          
          {/* Compliance */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#10B981] flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f]">Compliance</h3>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">SOC 2 Type II certified</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">HIPAA compliant (BAA available)</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">GDPR compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-[#605A57]">ISO 27001 in progress</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1d1d1f]">Audit Trail</h3>
            </div>
            
            <p className="text-sm text-[#605A57] mb-4">
              Every action logged. Full compliance reports.
            </p>
            
            <button className="text-sm text-[#005BE3] hover:text-[#004BC9] font-medium transition-colors">
              View sample audit log →
            </button>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="pt-8 border-t border-blue-200">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="px-6 py-3 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-sm font-semibold text-[#37322F]">SOC 2 Type II</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-sm font-semibold text-[#37322F]">HIPAA</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-sm font-semibold text-[#37322F]">GDPR</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg border border-blue-200 shadow-sm">
              <span className="text-sm font-semibold text-[#37322F]">ISO 27001</span>
            </div>
          </div>
          
          <p className="text-center text-sm text-[#605A57] mt-6">
            Trusted by healthcare, fintech, and government organizations
          </p>
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
