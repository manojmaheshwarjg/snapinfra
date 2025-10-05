import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Inter, Instrument_Serif } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AppProvider } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { Code2 } from "lucide-react"
import "./globals.css"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: ['400'], variable: '--font-instrument-serif' })

export const metadata: Metadata = {
  title: "Rhinoback - AI Backend Builder",
  description: "Build backends that absolutely slap with AI",
  generator: "Rhinoback",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        </head>
        <body className={`font-sans ${inter.variable} ${instrumentSerif.variable} antialiased tracking-tight`}>
          <AppProvider>
            <Suspense fallback={null}>
              {children}
              <Analytics />
            </Suspense>
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
