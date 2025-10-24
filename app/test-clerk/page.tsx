"use client"

import { SignIn, useAuth, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function TestClerkPage() {
  const { isLoaded: authLoaded, userId } = useAuth()
  const { isLoaded: userLoaded, user } = useUser()
  const [error, setError] = useState<string | null>(null)
  const [envCheck, setEnvCheck] = useState({
    publishableKey: '',
    hasKey: false
  })

  useEffect(() => {
    // Check if environment variable is accessible
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
    setEnvCheck({
      publishableKey: key.substring(0, 20) + '...',
      hasKey: !!key
    })

    if (!key) {
      setError('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY not found!')
    }
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Clerk Integration Test</h1>
        
        {/* Environment Check */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className={envCheck.hasKey ? "text-green-600" : "text-red-600"}>
                {envCheck.hasKey ? "✓" : "✗"}
              </span>
              <span>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</span>
              <span className="text-gray-600">{envCheck.publishableKey}</span>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Auth Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={authLoaded ? "text-green-600" : "text-yellow-600"}>
                {authLoaded ? "✓" : "⏳"}
              </span>
              <span>Auth Loaded: {authLoaded ? "Yes" : "Loading..."}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={userLoaded ? "text-green-600" : "text-yellow-600"}>
                {userLoaded ? "✓" : "⏳"}
              </span>
              <span>User Loaded: {userLoaded ? "Yes" : "Loading..."}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={userId ? "text-green-600" : "text-gray-600"}>
                {userId ? "✓" : "○"}
              </span>
              <span>User ID: {userId || "Not signed in"}</span>
            </div>
            {user && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
                <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sign In Component */}
        {!userId && authLoaded && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sign In Test</h2>
            <p className="text-gray-600 mb-4">
              Try signing in below. Check the browser console (F12) for any errors.
            </p>
            <div className="flex justify-center">
              <SignIn 
                routing="hash"
                signUpUrl="/test-clerk#sign-up"
              />
            </div>
          </div>
        )}

        {userId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              ✅ Clerk Working!
            </h2>
            <p className="text-green-700">
              You are successfully signed in. Clerk integration is working correctly.
            </p>
          </div>
        )}

        {/* Troubleshooting Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-3">Troubleshooting</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
            <li>Restart the dev server after changing .env.local</li>
            <li>Clear browser cache and hard reload (Ctrl+Shift+R)</li>
            <li>Check Clerk Dashboard → Domains: Add localhost</li>
            <li>Check Clerk Dashboard → API Keys: Verify keys match</li>
            <li>Open browser console (F12) for detailed errors</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
