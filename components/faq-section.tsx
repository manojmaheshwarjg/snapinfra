"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "The code is probably trash.",
    answer:
      "Try the free tier. Check it yourself. We'll wait. The code is production-ready, follows best practices, and includes proper error handling, security measures, and documentation.",
  },
  {
    question: "AI can't understand complex backends.",
    answer:
      "You're right to be skeptical. But you're also wrong. Try it with your most complex use case. Snapinfra handles authentication, database schemas, API endpoints, payment processing, and complex business logic.",
  },
  {
    question: "I'll need to rewrite everything anyway.",
    answer:
      "Maybe some things. But not everything. And that's still faster than writing it from scratch. You get clean, modular code that's easy to modify and extend.",
  },
  {
    question: "What about security, scaling, and monitoring?",
    answer:
      "Built in. We're not sending you a toy. Every generated backend includes security best practices, scalable architecture patterns, error handling, logging, and monitoring setup.",
  },
  {
    question: "This seems too good to be true.",
    answer:
      "It kind of is. But it's also real. Hence the free tier. Try it risk-free with one component generation. No credit card required. Export the code and see for yourself.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up for free. Describe your backend in plain English. Review the generated code. Export and deploy wherever you want. It's your code, your infrastructure, zero lock-in.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-normal leading-tight md:leading-[44px] font-serif text-4xl">
            Addressing Your Concerns
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Real questions from real developers.
            <br className="hidden md:block" />
            Honest answers.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
