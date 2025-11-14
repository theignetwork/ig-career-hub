'use client'

import { useState, useEffect } from 'react'
import { getUserId } from '@/lib/utils/getUserId'
import { authenticatedFetch } from '@/lib/utils/authenticatedFetch'

export default function DebugAuthPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get user ID on mount
    const id = getUserId()
    setUserId(id)
    console.log('[DEBUG] User ID:', id)

    if (typeof window !== 'undefined') {
      console.log('[DEBUG] window.wpUserId:', (window as any).wpUserId)
      console.log('[DEBUG] localStorage ig_user_id:', localStorage.getItem('ig_user_id'))
    }
  }, [])

  const testAuthenticatedRequest = async () => {
    try {
      setError(null)
      console.log('[DEBUG] Testing authenticated request...')

      const response = await authenticatedFetch('/api/applications?limit=5')
      const data = await response.json()

      console.log('[DEBUG] Response status:', response.status)
      console.log('[DEBUG] Response data:', data)

      setTestResult({
        status: response.status,
        ok: response.ok,
        data: data
      })
    } catch (err) {
      console.error('[DEBUG] Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const testRawFetch = async () => {
    try {
      setError(null)
      console.log('[DEBUG] Testing raw fetch (no auth)...')

      const response = await fetch('/api/applications?limit=5')
      const data = await response.json()

      console.log('[DEBUG] Raw response status:', response.status)
      console.log('[DEBUG] Raw response data:', data)

      setTestResult({
        status: response.status,
        ok: response.ok,
        data: data
      })
    } catch (err) {
      console.error('[DEBUG] Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const clearUserId = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ig_user_id')
      window.location.reload()
    }
  }

  const setTestUserId = () => {
    if (typeof window !== 'undefined') {
      const testId = `test-user-${Date.now()}`
      localStorage.setItem('ig_user_id', testId)
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">🔍 Authentication Debug Page</h1>

        {/* User ID Info */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Current User ID</h2>
          <div className="space-y-2">
            <p className="font-mono text-lg">
              User ID: <span className="text-teal-400">{userId || 'NULL/EMPTY'}</span>
            </p>
            <p className="text-sm text-gray-400">
              window.wpUserId: {typeof window !== 'undefined' ? JSON.stringify((window as any).wpUserId || null) : 'N/A'}
            </p>
            <p className="text-sm text-gray-400">
              localStorage: {typeof window !== 'undefined' ? JSON.stringify(localStorage.getItem('ig_user_id') || null) : 'N/A'}
            </p>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={clearUserId}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              Clear User ID
            </button>
            <button
              onClick={setTestUserId}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Set Test User ID
            </button>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Test API Requests</h2>
          <div className="flex gap-4">
            <button
              onClick={testAuthenticatedRequest}
              className="px-6 py-3 bg-teal-600 rounded hover:bg-teal-700"
            >
              Test WITH Auth
            </button>
            <button
              onClick={testRawFetch}
              className="px-6 py-3 bg-gray-600 rounded hover:bg-gray-700"
            >
              Test WITHOUT Auth
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            "WITH Auth" should work. "WITHOUT Auth" should return 401.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/40 border border-red-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p className="text-red-300 font-mono">{error}</p>
          </div>
        )}

        {/* Results */}
        {testResult && (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">HTTP Status:</p>
                <p className={`text-2xl font-bold ${testResult.status === 200 ? 'text-green-400' : testResult.status === 401 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {testResult.status} {testResult.ok ? '✅' : '❌'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Response Data:</p>
                <pre className="bg-black p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900/40 border border-blue-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📋 What to Check:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Is "Current User ID" showing a valid ID? (not NULL)</li>
            <li>Click "Test WITH Auth" - should return 200 with YOUR applications only</li>
            <li>Click "Test WITHOUT Auth" - should return 401 Unauthorized</li>
            <li>Check browser console (F12) for detailed logs</li>
            <li>Check Network tab to see if x-user-id header is being sent</li>
          </ol>
        </div>

        {/* Network Tab Instructions */}
        <div className="bg-purple-900/40 border border-purple-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🌐 Check Network Tab:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open DevTools (F12)</li>
            <li>Go to Network tab</li>
            <li>Click "Test WITH Auth" button</li>
            <li>Find the request to "/api/applications"</li>
            <li>Check Request Headers - look for "x-user-id"</li>
            <li>Should see: <code className="bg-black px-2 py-1 rounded">x-user-id: your-user-id-here</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}
