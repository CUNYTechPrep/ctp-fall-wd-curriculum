/**
 * REF: signin-page-header
 *
 * # Sign In Page - Supabase Authentication
 *
 * User authentication page using Supabase Auth.
 *
 * ## Key Concepts
 *
 * - **Supabase `signInWithPassword()`** - Email/password authentication
 * - **Controlled inputs** - Form state managed by React
 * - **Error handling** - User-friendly error messages
 * - **Navigation** - Redirect to `/dashboard` on success
 *
 * ## Supabase Auth vs Firebase Auth
 *
 * | Aspect | Supabase | Firebase |
 * |--------|----------|----------|
 * | Method | `signInWithPassword()` | `signInWithEmailAndPassword()` |
 * | Return | `{data, error}` object | Throws errors |
 * | Error handling | Explicit error property | Try/catch pattern |
 * | Style | Functional | Exception-based |
 *
 * ## Authentication Flow
 *
 * 1. User enters email and password in form
 * 2. Form submits to Supabase Auth API
 * 3. Supabase validates credentials against database
 * 4. Returns session with JWT tokens or error object
 * 5. Tokens stored in cookies (Next.js server) or localStorage (client-only)
 * 6. User redirected to `/dashboard` on successful sign-in
 */

'use client'

// REF: Import statement
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
// CLOSE: Import statement

/**
 * REF: signin-component
 *
 * ## SignInPage Component
 *
 * Client component for user authentication.
 */
// REF: Function: export
export default function SignInPage() {
// CLOSE: Function: export

  /**
   * REF: form-state
   *
   * ## Form State
   *
   * Controlled components - input values managed by React state.
   *
   * ### State Variables
   *
   * | Variable | Type | Purpose |
   * |----------|------|---------|
   * | `email` | `string` | User's email input |
   * | `password` | `string` | User's password input |
   * | `error` | `string` | Error message to display |
   * | `loading` | `boolean` | Form submission in progress |
   */
// REF: Constant declaration
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
// CLOSE: Constant declaration

// REF: Constant declaration
  const { signIn } = useAuth()
  const router = useRouter()
// CLOSE: Constant declaration

  /**
   * REF: handle-signin-submit
   *
   * ## Form Submit Handler
   *
   * Handles sign-in form submission with Supabase Auth.
   *
   * ### Parameters
   *
   * | Parameter | Type | Description |
   * |-----------|------|-------------|
   * | `e` | `FormEvent` | Form submission event |
   *
   * ### Flow
   *
   * 1. Prevent default form submission (would reload page)
   * 2. Clear previous errors
   * 3. Set loading state to `true`
   * 4. Call `signIn()` from auth context
   * 5. Navigate to `/dashboard` on success
   * 6. Display error message on failure
   * 7. Reset loading state
   *
   * ### Supabase Error Messages
   *
   * | Error Message | Meaning |
   * |---------------|---------|
   * | "Invalid login credentials" | Wrong email/password combination |
   * | "Email not confirmed" | User hasn't verified email |
   * | "User not found" | Email doesn't exist in system |
   *
   * These error messages are user-friendly by default from Supabase!
   */
// REF: Async function: const
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
// CLOSE: Async function: const

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  /**
   * REF: signin-render
   *
   * ## Component Render
   *
   * Sign-in form with centered layout.
   *
   * ### Structure
   *
   * 1. Centered container (full screen height)
   * 2. Card with form (max width 448px)
   * 3. Error message (conditional)
   * 4. Email input with label
   * 5. Password input with label
   * 6. Submit button with loading state
   * 7. Link to sign-up page
   *
   * ### Accessibility
   *
   * - **Labels** - Associated with inputs via `htmlFor`/`id`
   * - **Required attributes** - HTML5 validation
   * - **Disabled state** - Button disabled during loading
   * - **Error messages** - Clear, actionable feedback
   * - **Autocomplete** - Proper `email` and `current-password` hints
   */
// REF: JSX return
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
// CLOSE: JSX return

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

// REF: JSX element
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="you@example.com"
              />
            </div>
// CLOSE: JSX element

// REF: JSX element
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="••••••••"
              />
            </div>
// CLOSE: JSX element

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

// REF: JSX element
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
// CLOSE: JSX element

/**
 * REF: supabase-auth-security
 *
 * ## Supabase Auth Security Features
 *
 * Built-in security features provided by Supabase Auth.
 *
 * ### Security Features
 *
 * | Feature | Description |
 * |---------|-------------|
 * | **Bcrypt hashing** | Passwords hashed with bcrypt algorithm |
 * | **Rate limiting** | Failed login attempts throttled |
 * | **JWT tokens** | Secure token-based authentication |
 * | **Auto-refresh** | Tokens automatically refreshed before expiry |
 * | **Session management** | Server-side session validation |
 * | **Email verification** | Optional email confirmation |
 *
 * You don't need to implement these yourself - they're built into Supabase!
 */

/**
 * REF: email-verification
 *
 * ## Email Verification (Optional Feature)
 *
 * How to enable email verification for new users.
 *
 * ### Setup Steps
 *
 * 1. Go to Supabase Dashboard → Authentication → Email Templates
 * 2. Enable "Confirm email" template
 * 3. Customize email template (optional)
 * 4. Users receive verification email on signup
 * 5. Cannot sign in until email is verified
 *
 * ### Handle Unverified Email
 *
 * ```typescript
 * if (error?.message === 'Email not confirmed') {
 *   setError('Please check your email to verify your account')
 * }
 * ```
 */

/**
 * REF: password-reset
 *
 * ## Password Reset Feature
 *
 * How to add password reset functionality.
 *
 * ### Add Reset Link
 *
 * ```typescript
 * <Link href="/reset-password" className="text-sm text-blue-600">
 *   Forgot password?
 * </Link>
 * ```
 *
 * ### Password Reset Page
 *
 * ```typescript
 * const { error } = await supabase.auth.resetPasswordForEmail(email, {
 *   redirectTo: `${window.location.origin}/update-password`,
 * })
 * ```
 *
 * ### Update Password Page
 *
 * User clicks link in email, gets redirected to update-password page with token.
 *
 * ```typescript
 * const { error } = await supabase.auth.updateUser({
 *   password: newPassword
 * })
 * ```
 */

/**
 * REF: social-auth
 *
 * ## Social Authentication (Optional)
 *
 * OAuth integration with popular providers.
 *
 * ### Supported Providers
 *
 * Supabase supports OAuth with: Google, GitHub, Facebook, Twitter, Discord, and 20+ more.
 *
 * ### Implementation
 *
 * ```typescript
 * const { error } = await supabase.auth.signInWithOAuth({
 *   provider: 'google', // or 'github', 'facebook', etc.
 *   options: {
 *     redirectTo: `${window.location.origin}/auth/callback`
 *   }
 * })
 * ```
 *
 * ### Setup Required
 *
 * 1. Go to Supabase Dashboard → Authentication → Providers
 * 2. Enable provider (e.g., Google)
 * 3. Add OAuth credentials (Client ID, Client Secret)
 * 4. Configure authorized redirect URIs
 * 5. Add sign-in button to your UI
 */
