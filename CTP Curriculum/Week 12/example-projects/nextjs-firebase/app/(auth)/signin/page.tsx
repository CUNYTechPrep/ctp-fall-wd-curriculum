/**
 * REF: signin-page
 *
 * # Sign In Page
 *
 * User authentication page using Firebase Auth.
 *
 * ## Key Concepts
 *
 * - **Form handling** in React
 * - **Controlled inputs** (value tied to state)
 * - **Firebase authentication**
 * - **Error handling** and user feedback
 * - **Navigation** after successful login
 *
 * ## Authentication Flow
 *
 * 1. User enters email and password
 * 2. Form submits to `handleSubmit`
 * 3. Calls Firebase `signIn()` from context
 * 4. On success → navigate to dashboard
 * 5. On error → show error message
 */

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

/**
 * REF: signin-component
 *
 * ## SignInPage Component
 *
 * Authentication form component.
 */
export default function SignInPage() {
  /**
   * REF: signin-state
   *
   * ## Form State
   *
   * Track form inputs and submission status.
   *
   * - `email`: User's email input
   * - `password`: User's password input
   * - `error`: Error message to display
   * - `loading`: Form submission in progress
   */
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // CLOSE: signin-state

  /**
   * Get auth methods from context.
   */
  const { signIn } = useAuth()
  const router = useRouter()

  /**
   * REF: signin-submit
   *
   * ## Form Submit Handler
   *
   * Authenticates user with Firebase.
   *
   * ### Flow
   *
   * 1. Prevent default form submission
   * 2. Clear previous errors
   * 3. Set loading state
   * 4. Call Firebase `signIn()`
   * 5. Navigate to dashboard on success
   * 6. Show error on failure
   *
   * ### Error Handling
   *
   * Firebase auth errors are caught and displayed:
   * - Wrong password
   * - User not found
   * - Network errors
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }
  // CLOSE: signin-submit

  /**
   * REF: signin-render
   *
   * ## Sign In Form UI
   *
   * Centered card with email/password inputs.
   *
   * ### Structure
   *
   * - Centered container
   * - White card with shadow
   * - Error message (if any)
   * - Email input
   * - Password input
   * - Submit button (disabled while loading)
   * - Link to sign up page
   */
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
// CLOSE: signin-render
// CLOSE: signin-component
// CLOSE: signin-page
