/**
 * REF: file-header
 *
 * # Sign In Page - Drizzle + Supabase Auth
 *
 * Authentication page using Supabase for auth in the Drizzle project.
 *
 * ## Hybrid Architecture
 * - **Supabase Auth**: Best-in-class authentication (don't reinvent the wheel)
 * - **Drizzle**: Type-safe database queries for app data
 * - **Clean Separation**: Each tool does what it does best
 *
 * ## Authentication Flow
 * | `Step` | `Action` | `Tool` |
 * |------|--------|------|
 * | `1` | User submits credentials | React form |
 * | `2` | Validate with Supabase | Supabase Auth |
 * | `3` | Return session + JWT | `Supabase` |
 * | `4` | Use user ID for queries | Drizzle ORM |
 * | `5` | RLS protects data | `Optional` |
 */
// CLOSE: file-header

'use client'

/**
 * REF: imports
 *
 * ## Import Dependencies
 *
 * ### React
 * - `useState`: Form state
 * - `FormEvent`: TypeScript type for form events
 *
 * ### Next.js
 * - `useRouter`: Navigate after successful auth
 * - `Link`: Client-side navigation
 *
 * ### Custom
 * - `useAuth`: Access auth context and signIn method
 */
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
// CLOSE: imports

/**
 * REF: component-function
 *
 * ## SignInPage Component
 *
 * Client component for user authentication.
 */
export default function SignInPage() {
  // CLOSE: component-function

  /**
   * REF: state-and-hooks
   *
   * ## State Management and Hooks
   *
   * | State/Hook | Type | Purpose |
   * |------------|------|---------|
   * | `email` | `string` | Email input value |
   * | `password` | `string` | Password input value |
   * | `error` | `string` | Error message display |
   * | `loading` | `boolean` | Submit in progress |
   * | `signIn` | `function` | From useAuth context |
   * | `router` | `NextRouter` | For navigation |
   */
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const router = useRouter()
  // CLOSE: state-and-hooks

  /**
   * REF: submit-handler
   *
   * ## Form Submit Handler
   *
   * Handles authentication with Supabase Auth via context.
   *
   * ### Process
   * 1. Prevent default form behavior
   * 2. Clear previous errors
   * 3. Set loading state
   * 4. Call Supabase signIn (via context)
   * 5. Navigate to dashboard on success
   * 6. Show error on failure
   *
   * ### After Authentication
   * Once signed in, user can make Drizzle queries with their user ID.
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
  // CLOSE: submit-handler

  /**
   * REF: main-layout
   *
   * ## Sign In Form Layout
   *
   * Centered authentication form with email/password inputs.
   */
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/**
           * REF: header
           *
           * ## Page Header
           *
           * Title and subtitle describing the tech stack.
           */}
          <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Next.js + Supabase Auth + Drizzle ORM
          </p>
          {/* CLOSE: header */}

          {/**
           * REF: error-display
           *
           * ## Error Message Display
           *
           * Shows authentication errors to user.
           */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {/* CLOSE: error-display */}

          {/**
           * REF: signin-form
           *
           * ## Sign In Form
           *
           * Email and password input form.
           */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/**
             * REF: email-input
             *
             * ## Email Input Field
             *
             * ### Accessibility
             * - Label with htmlFor
             * - Type email for validation
             * - Autocomplete enabled
             * - Required field
             */}
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
            {/* CLOSE: email-input */}

            {/**
             * REF: password-input
             *
             * ## Password Input Field
             *
             * ### Security
             * - Type password (hides input)
             * - Autocomplete for password managers
             * - Required field
             */}
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
            {/* CLOSE: password-input */}

            {/**
             * REF: submit-button
             *
             * ## Submit Button
             *
             * ### States
             * - Normal: "Sign In"
             * - Loading: "Signing in..." with disabled state
             */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {/* CLOSE: submit-button */}
          </form>
          {/* CLOSE: signin-form */}

          {/**
           * REF: signup-link
           *
           * ## Sign Up Link
           *
           * Link to registration page for new users.
           */}
          <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
          {/* CLOSE: signup-link */}
        </div>
      </div>
    </div>
  )
  // CLOSE: main-layout
}

/**
 * REF: using-auth-with-drizzle
 *
 * ## Using Auth with Drizzle Queries
 *
 * After authentication, combine Supabase auth state with Drizzle queries.
 *
 * ### Example: Fetch User's Todos
 * ```typescript
 * import { useAuth } from '@/contexts/AuthContext'
 * import { getUserTodos } from '@/lib/db/queries'
 *
 * function Dashboard() {
 *   const { user } = useAuth() // Supabase auth
 *   const [todos, setTodos] = useState([])
 *
 *   useEffect(() => {
 *     if (!user) return
 *
 *     // Query with Drizzle (type-safe!)
 *     getUserTodos(user.id).then(setTodos)
 *   }, [user])
 * }
 * ```
 *
 * ### Clean Separation
 * - Supabase handles auth state
 * - Drizzle handles database queries
 * - Best of both worlds
 */
// CLOSE: using-auth-with-drizzle

/**
 * REF: rls-vs-app-level-auth
 *
 * ## RLS vs Application-Level Authorization
 *
 * Two approaches for securing data with this hybrid setup.
 *
 * ### Option 1: Supabase Client with RLS
 * ```typescript
 * import { createClient } from '@/lib/supabase/client'
 *
 * const supabase = createClient()
 * const { data } = await supabase.from('todos').select('*')
 * // RLS automatically enforced at database level
 * ```
 *
 * ### Option 2: Drizzle with App-Level Filtering
 * ```typescript
 * import { db } from '@/lib/db/client'
 * import { todos } from '@/lib/db/schema'
 * import { eq } from 'drizzle-orm'
 *
 * // Filter in application code
 * const userTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, user.id))
 * ```
 *
 * ### This Project Uses Option 2
 * - Perfect type safety throughout
 * - Must enforce userId filtering in code
 * - More explicit, easier to debug
 */
// CLOSE: rls-vs-app-level-auth
