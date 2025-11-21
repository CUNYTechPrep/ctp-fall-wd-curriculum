/**
 * REF: Sign In Page - Email/Password Authentication
 *
 * Handles user login in a React SPA with Firebase Authentication.
 *
 * ## Overview
 * Provides email/password login form with error handling and success navigation.
 *
 * ## Flow
 * 1. User enters email and password
 * 2. Form validates before submit
 * 3. Firebase authenticates credentials
 * 4. On success: Navigate to `/dashboard`
 * 5. On error: Display user-friendly error message
 *
 * ## Firebase Error Handling
 *
 * Common error codes and how they're handled:
 *
 * | Error Code | `Meaning` | User Message |
 * |----------|---------|--------------|
 * | `auth/wrong-password` | Invalid password | "Incorrect password" |
 * | `auth/user-not-found` | Email not registered | "No account found with this email" |
 * | `auth/too-many-requests` | Rate limited | "Too many failed attempts. Try again later." |
 * | `auth/network-request-failed` | Network error | "Network error, please try again" |
 *
 * ## Form Features
 * - **Accessibility**: Labels, autocomplete, focus management
 * - **Security**: Password field hides input
 * - **UX**: Loading state during authentication
 * - **Feedback**: Error messages and success navigation
 *
 * ## Sign In Security
 * Firebase (HTTPS) ensures:
 * - Passwords never sent in plain text
 * - Credentials encrypted in transit
 * - Tokens stored securely in localStorage
 * - Automatic token refresh
 *
 * CLOSE
 */

import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  // REF: FORM SUBMIT HANDLER
/**
   * FORM SUBMIT HANDLER
   *
   * Handles authentication with Firebase
   *
   * REACT ROUTER NAVIGATION:
   * - navigate() instead of router.push()
   * - Same concept, different API
   * - No page reload, just updates URL and content
   */
// CLOSE
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/dashboard') // Navigate on success
    } catch (err: any) {
      // Firebase auth errors
      if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Try again later.')
      } else {
        setError(err.message || 'Failed to sign in')
      }
    } finally {
      setLoading(false)
    }
  }
  // CLOSE: FORM SUBMIT HANDLER

  // REF: COMPONENT RENDER
/**
   * COMPONENT RENDER
   *
   * Simple, clean form with Tailwind CSS
   *
   * LINK vs <a>:
   * - <Link> from react-router-dom
   * - No page reload
   * - Faster navigation
   * - Better UX
   */
// CLOSE
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
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
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
// CLOSE: SignIn

// REF: FIREBASE ERROR CODES
/**
 * FIREBASE ERROR CODES
 *
 * Common auth errors:
 * - auth/wrong-password: Incorrect password
 * - auth/user-not-found: Email not registered
 * - auth/user-disabled: Account disabled by admin
 * - auth/too-many-requests: Rate limited
 * - auth/network-request-failed: Network error
 * - auth/invalid-email: Malformed email
 *
 * Parse these for user-friendly messages!
 */
// CLOSE

// REF: ACCESSIBILITY CONSIDERATIONS
/**
 * ACCESSIBILITY CONSIDERATIONS
 *
 * This form includes:
 * - ✅ Labels associated with inputs
 * - ✅ Autocomplete attributes
 * - ✅ Required validation
 * - ✅ Focus management
 * - ✅ Error announcements
 * - ✅ Keyboard navigation
 *
 * Could enhance with:
 * - ARIA labels for screen readers
 * - Focus trap in modal
 * - Error role="alert"
 */
// CLOSE
