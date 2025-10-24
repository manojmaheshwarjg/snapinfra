"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { useState } from "react"

export default function TestAuthPage() {
  const { getToken, userId, isLoaded } = useAuth()
  const { user } = useUser()
  const [token, setToken] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGetToken = async () => {
    try {
      const t = await getToken()
      setToken(t)
      console.log('Token:', t)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleTestAPI = async () => {
    try {
      setError(null)
      setApiResponse(null)
      
      const t = await getToken()
      console.log('Making API call with token...')
      
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${t}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('API Response:', data)
      setApiResponse(data)
    } catch (e: any) {
      console.error('API Error:', e)
      setError(e.message)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Test</h1>
        
        {/* Auth Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Auth Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {userId || 'Not signed in'}</p>
            <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
            <p><strong>Auth Mode:</strong> {process.env.NEXT_PUBLIC_AUTH_MODE || 'development'}</p>
          </div>
        </div>

        {/* Get Token */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Clerk Token</h2>
          <button
            onClick={handleGetToken}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Get Token
          </button>
          {token && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-xs break-all">{token.substring(0, 100)}...</p>
            </div>
          )}
        </div>

        {/* Test API */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Backend API</h2>
          <button
            onClick={handleTestAPI}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={!userId}
          >
            Test GET /api/projects
          </button>
          
          {apiResponse && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-800">Success!</p>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Make sure you're signed in</li>
            <li>Click "Get Token" to see your Clerk JWT</li>
            <li>Click "Test GET /api/projects"</li>
            <li>Check backend terminal for authentication logs</li>
            <li>Check if user appears in DynamoDB after successful request</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
