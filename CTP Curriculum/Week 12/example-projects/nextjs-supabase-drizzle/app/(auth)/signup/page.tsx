/**
 * REF: file-header
 *
 * # Sign Up Page - Create Account with Drizzle + Supabase
 *
 * User registration page using hybrid architecture.
 *
 * ## Registration Flow
 * | `Step` | `Action` | `Tool` |
 * |------|--------|------|
 * | `1` | Supabase creates auth.users | Supabase Auth |
 * | `2` | Trigger creates user_profiles | PostgreSQL trigger |
 * | `3` | Or manually with Drizzle | Drizzle ORM |
 * | `4` | User logged in | Supabase Session |
 * | `5` | Can make type-safe queries | Drizzle ORM |
 *
 * ## Profile Creation Options
 * - **Trigger**: Guaranteed, atomic (recommended)
 * - **Drizzle**: Explicit, in application code
 * - **Both**: Belt and suspenders approach
 */
// CLOSE: file-header

'use client'

/**
 * REF: imports
 *
 * ## Import Dependencies
 *
 * ### React & Next.js
 * - `useState`: Form state
 * - `FormEvent`: TypeScript type
 * - `useRouter`: Post-registration navigation
 * - `Link`: Navigate to sign in
 *
 * ### Custom
 * - `useAuth`: Access signUp method from context
 */
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
// CLOSE: imports

/**
 * REF: component-function
 *
 * ## SignUpPage Component
 *
 * Client component for user registration.
 */
export default function SignUpPage() {
  // CLOSE: component-function

  /**
   * REF: state-management
   *
   * ## Form State Variables
   *
   * | `State` | Type | Purpose |
   * |-------|------|---------|
   * | `email` | `string` | Email input |
   * | `password` | `string` | Password input |
   * | `confirmPassword` | `string` | Password confirmation |
   * | `displayName` | `string` | User's display name |
   * | `error` | `string` | Validation/API errors |
   * | `loading` | `boolean` | Submit state |
   */
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()
  // CLOSE: state-management

  /**
   * REF: submit-handler
   *
   * ## Form Validation and Submission
   *
   * Handles client-side validation and account creation.
   *
   * ### Validation Rules
   * - Passwords must match
   * - Password minimum 6 characters
   * - Email format validated by browser
   *
   * ### Process
   * 1. Validate passwords match
   * 2. Validate password length
   * 3. Call Supabase signUp via context
   * 4. Pass displayName as metadata
   * 5. Navigate to dashboard on success
   * 6. Show errors to user
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
      await signUp(email, password, { displayName })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }
  // CLOSE: submit-handler

  /**
   * REF: main-layout
   *
   * ## Registration Form Layout
   *
   * Centered form with all registration fields.
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
           * Title and tech stack description.
           */}
          <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Type-safe database with Drizzle ORM
          </p>
          {/* CLOSE: header */}

          {/**
           * REF: error-display
           *
           * ## Error Display
           *
           * Shows validation or API errors.
           */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {/* CLOSE: error-display */}

          {/**
           * REF: signup-form
           *
           * ## Registration Form
           *
           * Form with display name, email, password, and confirmation.
           */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/**
             * REF: display-name-input
             *
             * ## Display Name Input
             *
             * Optional field stored in user metadata.
             */}
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
            {/* CLOSE: display-name-input */}

            {/**
             * REF: email-input
             *
             * ## Email Input
             *
             * Required email field with autocomplete.
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
             * ## Password Input
             *
             * Required password with 6 character minimum.
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
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>
            {/* CLOSE: password-input */}

            {/**
             * REF: confirm-password-input
             *
             * ## Confirm Password Input
             *
             * Password confirmation field.
             */}
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
                autoComplete="new-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="••••••••"
              />
            </div>
            {/* CLOSE: confirm-password-input */}

            {/**
             * REF: submit-button
             *
             * ## Submit Button
             *
             * Create account button with loading state.
             */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            {/* CLOSE: submit-button */}
          </form>
          {/* CLOSE: signup-form */}

          {/**
           * REF: signin-link
           *
           * ## Sign In Link
           *
           * Link for existing users to sign in.
           */}
          <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
          {/* CLOSE: signin-link */}
        </div>
      </div>
    </div>
  )
  // CLOSE: main-layout
}

/**
 * REF: profile-creation-drizzle
 *
 * ## Profile Creation with Drizzle
 *
 * After Supabase creates auth user, create profile with Drizzle.
 *
 * ### In AuthContext
 * ```typescript
 * import { db } from '@/lib/db/client'
 * import { userProfiles } from '@/lib/db/schema'
 *
 * if (event === 'SIGNED_IN' && session?.user) {
 *   // Type-safe profile creation
 *   await db
 *     .insert(userProfiles)
 *     .values({
 *       userId: session.user.id,
 *       displayName: session.user.user_metadata?.displayName || '',
 *     })
 *     .onConflictDoNothing() // Idempotent
 * }
 * ```
 *
 * ### Benefits
 * - Type-safe insert operation
 * - Explicit and visible in code
 * - Easy to debug
 */
// CLOSE: profile-creation-drizzle

/**
 * REF: database-trigger-alternative
 *
 * ## Database Trigger Alternative
 *
 * More reliable approach using PostgreSQL triggers.
 *
 * ### Trigger Function
 * ```sql
 * CREATE FUNCTION handle_new_user()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   INSERT INTO user_profiles (user_id, display_name)
 *   VALUES (NEW.id, NEW.raw_user_meta_data->>'displayName');
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 * CREATE TRIGGER on_auth_user_created
 *   AFTER INSERT ON auth.users
 *   FOR EACH ROW
 *   EXECUTE FUNCTION handle_new_user();
 * ```
 *
 * ### Advantages
 * - Guaranteed to run (even if client crashes)
 * - Atomic with user creation
 * - No race conditions
 * - Database-level consistency
 */
// CLOSE: database-trigger-alternative

/**
 * REF: type-safety-benefits
 *
 * ## Type Safety Benefits
 *
 * Drizzle catches errors at compile time.
 *
 * ### Valid Profile Creation
 * ```typescript
 * // ✅ TypeScript validates all fields
 * await db.insert(userProfiles).values({
 *   userId: user.id,       // ✅ string (UUID)
 *   displayName: 'John',   // ✅ string | null
 * })
 * ```
 *
 * ### Caught at Compile Time
 * ```typescript
 * // ❌ Type error - userId wrong type
 * await db.insert(userProfiles).values({
 *   userId: 123,           // Error: Expected string
 * })
 *
 * // ❌ Type error - unknown field
 * await db.insert(userProfiles).values({
 *   userId: user.id,
 *   invalidField: 'test',  // Error: Unknown field
 * })
 * ```
 *
 * ### No Runtime Surprises
 * All typos and type mismatches caught before code runs.
 */
// CLOSE: type-safety-benefits
