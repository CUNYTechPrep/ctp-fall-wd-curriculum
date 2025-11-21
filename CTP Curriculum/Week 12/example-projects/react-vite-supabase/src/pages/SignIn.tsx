/**
 * REF: Sign In Authentication Page
 *
 * Login form for existing users. Authenticates with Supabase and creates session.
 * Accessible publicly, redirects to dashboard on successful login.
 *
 * CLOSE: User arrives here to log in with email and password.
 * On success, redirects to /dashboard. On error, displays error message.
 *
 * PAGE COMPONENTS:
 * | `Component` | Purpose |
 * |-----------|---------|
 * | Form Card | Centered white form container |
 * | Email Input | User email field |
 * | Password Input | Password field with mask |
 * | Submit Button | "Sign In" or "Signing in..." during load |
 * | Error Alert | Red error message if login fails |
 * | Sign Up Link | Navigation to /signup for new users |
 *
 * FORM FLOW:
 * 1. User enters email and password
 * 2. Clicks "Sign In" button
 * 3. Form calls handleSubmit
 * 4. Sets loading=true, clears error
 * 5. Calls signIn() from AuthContext
 * 6. AuthContext calls supabase.auth.signInWithPassword()
 * 7. Supabase validates credentials and returns JWT
 * 8. Session stored in localStorage
 * 9. onAuthStateChange fires in AuthContext
 * 10. useAuth hook re-renders with user data
 * 11. navigate('/dashboard') redirects to dashboard
 *
 * STATE MANAGEMENT:
 * | `State` | Type | Purpose |
 * |-------|------|---------|
 * | `email` | `string` | Form input |
 * | `password` | `string` | Form input |
 * | `error` | `string` | Error message display |
 * | `loading` | `boolean` | Disable button during submission |
 *
 * ## Error Handling
 * | `Error` | `Cause` | `Message` |
 * |-------|-------|---------|
 * | Invalid credentials | Wrong password | "Invalid login credentials" |
 * | Email not found | User doesn't exist | "Invalid login credentials" |
 * | Account not verified | Email not confirmed | "Email not confirmed" |
 * | Rate limit exceeded | Too many attempts | "Too many requests" |
 * | Network error | No internet | Error message from Supabase |
 *
 * ## Validation
 * - Email required (HTML5)
 * - Password required (HTML5)
 * - No client-side format validation (server handles)
 *
 * ## Styling
 * - Centered full-screen form
 * - White card with shadow
 * - Blue submit button with hover effect
 * - Responsive padding and sizing
 * - Tailwind CSS utility classes
 *
 * SUPABASE AUTH:
 * ```typescript
 * const { error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * })
 * ```
 *
 * ## Navigation
 * - Success: navigate('/dashboard')
 * - New user: Link to '/signup'
 * - Back button: Handled by React Router
 *
 * FILE REFERENCES:
 * - ../contexts/AuthContext.tsx - useAuth() hook
 * - ../App.tsx - Route definition
 * - SignUp.tsx - Registration page
 *
 * ## Key Concepts
 * - Client-side form submission
 * - No server validation (Supabase validates)
 * - Session automatically managed
 * - JWT tokens stored in localStorage
 * - Async password hashing (Bcrypt via Supabase)
 */

import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * REF: signin-page-component
 */
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  /**
   * HANDLE SIGN IN
   *
   * Authenticates with Supabase
   *
   * ## Flow
   * 1. User submits form
   * 2. Call Supabase signInWithPassword
   * 3. Session stored in localStorage
   * 4. Auth context updates
   * 5. Navigate to dashboard
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      /**
       * SUPABASE ERROR HANDLING
       *
       * Common errors:
       * - "Invalid login credentials"
       * - "Email not confirmed"
       * - "Too many requests"
       */
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
// CLOSE: signin-page-component

/**
 * SUPABASE AUTH IN SPA
 *
 * Session management:
 * - Tokens in localStorage
 * - Auto-refresh before expiry
 * - Syncs across tabs
 * - Works offline (cached)
 *
 * Compared to cookies (Next.js):
 * - localStorage: Client-side only, works in SPA
 * - Cookies: Server-side accessible, better for SSR
 */
