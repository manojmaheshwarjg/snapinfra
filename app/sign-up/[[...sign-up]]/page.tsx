"use client"

import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="w-full min-h-screen relative bg-gradient-to-br from-[#fafaf9] via-[#f5f3f0] to-[#ede9e3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden flex flex-col justify-center items-center relative z-10 min-h-screen">
            {/* Navigation */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-white/80 backdrop-blur-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30 border border-black/5">
                <Link href="/" className="flex justify-center items-center group">
                  <div className="flex justify-start items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-[rgba(49,45,43,0.80)] group-hover:text-[#37322F] transition-colors" />
                    <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      Snapinfra
                    </div>
                  </div>
                </Link>
                <Link href="/sign-in">
                  <div className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white/50 hover:bg-white/80 border border-[rgba(55,50,47,0.12)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer transition-all duration-200">
                    <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-semibold leading-5 font-sans">
                      Sign in
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center w-full px-4 pt-20 pb-12">
              <div className="w-full max-w-[480px] flex flex-col items-center gap-8">
                {/* Header Section */}
                <div className="w-full flex flex-col items-center gap-4 text-center">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-[#37322F] text-3xl sm:text-4xl md:text-5xl font-normal leading-tight font-serif">
                      Start building
                    </h1>
                    <p className="text-[#605A57] text-sm sm:text-base font-normal leading-6 font-sans">
                      Create your account and ship backends in minutes, not weeks
                    </p>
                  </div>
                </div>

                {/* Sign Up Card */}
                <div className="w-full relative">
                  {/* Subtle gradient border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgba(0,119,237,0.1)] via-[rgba(138,43,226,0.1)] to-[rgba(236,72,153,0.1)] p-[1px]">
                    <div className="w-full h-full rounded-2xl bg-white"></div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[rgba(55,50,47,0.08)] overflow-hidden">
                    <div className="p-6 sm:p-8">
                      <SignUp 
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            card: "bg-transparent shadow-none w-full",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton: 
                              "border-[rgba(55,50,47,0.12)] bg-white hover:bg-[#fafafa] hover:border-[rgba(55,50,47,0.18)] text-[#37322F] font-sans font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200",
                            socialButtonsBlockButtonText: "font-sans font-medium text-[#37322F]",
                            dividerLine: "bg-[rgba(55,50,47,0.12)]",
                            dividerText: "text-[#605A57] font-sans text-sm",
                            formButtonPrimary: 
                              "bg-gradient-to-r from-[#0071E3] to-[#0077ED] hover:from-[#0077ED] hover:to-[#0088FF] text-white font-sans font-semibold shadow-[0_2px_8px_rgba(0,119,237,0.3)] hover:shadow-[0_4px_12px_rgba(0,119,237,0.4)] transition-all duration-200 normal-case",
                            formFieldLabel: "text-[#37322F] font-sans font-medium text-sm",
                            formFieldInput: 
                              "border-[rgba(55,50,47,0.12)] bg-white focus:border-[#0077ED] focus:ring-[#0077ED]/20 text-[#37322F] font-sans placeholder:text-[#605A57]/50 rounded-lg transition-all duration-200",
                            footerActionLink: "text-[#0077ED] hover:text-[#0088FF] font-sans font-medium transition-colors duration-200",
                            formFieldInputShowPasswordButton: "text-[#605A57] hover:text-[#37322F]",
                            identityPreviewText: "text-[#37322F] font-sans",
                            identityPreviewEditButton: "text-[#0077ED] hover:text-[#0088FF]",
                            formResendCodeLink: "text-[#0077ED] hover:text-[#0088FF] font-sans font-medium",
                            otpCodeFieldInput: "border-[rgba(55,50,47,0.12)] focus:border-[#0077ED] focus:ring-[#0077ED]/20 text-[#37322F]",
                          }
                        }}
                        routing="path"
                        path="/sign-up"
                        signInUrl="/sign-in"
                        afterSignUpUrl="/onboarding"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom text */}
                <div className="text-center text-[#605A57] text-xs sm:text-sm font-normal font-sans">
                  By continuing, you agree to Snapinfra's{" "}
                  <Link href="/terms" className="text-[#0077ED] hover:text-[#0088FF] underline transition-colors">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-[#0077ED] hover:text-[#0088FF] underline transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
