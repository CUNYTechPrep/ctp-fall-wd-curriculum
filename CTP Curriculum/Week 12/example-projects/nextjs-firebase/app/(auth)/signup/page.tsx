/**
 * REF: signup-page
 *
 * # Sign Up Page
 *
 * New user registration with Firebase Auth.
 *
 * ## Key Concepts
 *
 * - **User registration** with email/password
 * - **Form validation** (password match, length)
 * - **Display name** collection
 * - **Error handling** with user-friendly messages
 *
 * ## Registration Flow
 *
 * 1. User fills form (email, password, confirm, name)
 * 2. Client validates (passwords match, length)
 * 3. Calls Firebase `signUp()`
 * 4. Firebase creates user account
 * 5. Profile updated with display name
 * 6. Navigate to dashboard
 */

'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

/**
 * REF: signup-component
 *
 * ## SignUpPage Component
 *
 * User registration form.
 */
export default function SignUpPage() {
  /**
   * REF: signup-state
   *
   * ## Form State
   *
   * More fields than sign in:
   * - Email and password (required)
   * - Confirm password (validation)
   * - Display name (optional but collected)
   */
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()
  // CLOSE: signup-state

  /**
   * REF: signup-submit
   *
   * ## Form Submit with Validation
   *
   * Validates before calling Firebase.
   *
   * ### Client-Side Validation
   *
   * - Passwords must match
   * - Password minimum 6 characters (Firebase requirement)
   *
   * ### Why Validate Client-Side?
   *
   * - Immediate feedback to user
   * - Saves unnecessary API calls
   * - Better UX
   *
   * **Note:** Firebase also validates server-side!
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, displayName)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }
  // CLOSE: signup-submit

  /**
   * REF: signup-render
   *
   * ## Sign Up Form UI
   *
   * Registration form with all required fields.
   *
   * ### Form Fields
   *
   * 1. Display name (optional)
   * 2. Email (required)
   * 3. Password (required, min 6 chars)
   4. Confirm password (must match)
   * 5. Submit button
   * 6. Link to sign in
   */
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="John Doe"
              />
            </div>

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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
// CLOSE: signup-render
// CLOSE: signup-component
// CLOSE: signup-page
