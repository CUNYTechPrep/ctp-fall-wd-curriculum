/**
 * REF: signup-page-header
 *
 * # Sign Up Page - Create New Supabase Account
 *
 * User registration page using Supabase Auth with metadata storage.
 *
 * ## Key Concepts
 *
 * - **Supabase user registration** - Email/password account creation
 * - **Form validation** - Client-side and server-side validation
 * - **Password confirmation** - Matching password fields
 * - **User metadata storage** - Additional profile data during signup
 *
 * ## Supabase Signup Flow
 *
 * 1. User fills registration form with email, password, and display name
 * 2. Client validates input (passwords match, length requirements)
 * 3. Supabase creates user in `auth.users` table with bcrypt-hashed password
 * 4. Database trigger creates `user_profiles` row with display name
 * 5. Database trigger creates `user_settings` row with default preferences
 * 6. User logged in automatically (or email sent for verification if enabled)
 *
 * ## Database Triggers
 *
 * In Supabase, use triggers to auto-create related records atomically:
 *
 * ```sql
 * CREATE FUNCTION handle_new_user()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   INSERT INTO user_profiles (user_id, display_name)
 *   VALUES (NEW.id, NEW.raw_user_meta_data->>'displayName');
 *
 *   INSERT INTO user_settings (user_id)
 *   VALUES (NEW.id);
 *
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
 * This ensures profile/settings created atomically - no orphaned users!
 *
 * ## Supabase Auth vs Firebase Auth
 *
 * | Aspect | Supabase | Firebase |
 * |--------|----------|----------|
 * | Method | `signUp(email, password, metadata)` | `createUserWithEmailAndPassword()` |
 * | Metadata | Passed during signup | Set after creation |
 * | Return | `{data, error}` object | Throws errors |
 * | Error handling | Explicit error property | Try/catch pattern |
 * | Triggers | PostgreSQL triggers | Cloud Functions |
 */

/**
 * REF: signup-component
 *
 * ## Client-Side Component
 *
 * Marks this as a client component for form state management.
 */
'use client'

// REF: Import statement
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
// CLOSE: Import statement

/**
 * REF: signup-page-component
 *
 * ## SignUpPage Component
 *
 * Registration form with validation and metadata storage.
 *
 * ### State Variables
 *
 * | Variable | Type | Purpose |
 * |----------|------|---------|
 * | `email` | `string` | User's email input |
 * | `password` | `string` | User's password input |
 * | `confirmPassword` | `string` | Password confirmation input |
 * | `displayName` | `string` | User's display name |
 * | `error` | `string` | Error message to display |
 * | `loading` | `boolean` | Form submission in progress |
 */
// REF: Function: export
export default function SignUpPage() {
// CLOSE: Function: export

  /**
   * REF: form-state
   *
   * ## Form State
   *
   * Controlled components - input values managed by React state.
   */
// REF: Constant declaration
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
// CLOSE: Constant declaration

// REF: Constant declaration
  const { signUp } = useAuth()
  const router = useRouter()
// CLOSE: Constant declaration

  /**
   * REF: form-validation
   *
   * ## Form Validation
   *
   * Client-side validation before submitting to Supabase.
   *
   * ### Validation Rules
   *
   * | Rule | Purpose |
   * |------|---------|
   * | Passwords must match | Prevent typos |
   * | Password minimum 6 characters | Supabase requirement |
   * | Email format validated | Browser `type="email"` |
   *
   * ### Why Client-Side Validation?
   *
   * - **Immediate feedback** to user
   * - **Reduces unnecessary API calls** to server
   * - **Better UX** - no waiting for server response
   *
   * ### Why Server-Side Validation Too?
   *
   * - **Client can be bypassed** - never trust client input
   * - **Supabase validates on server** - database constraints
   * - **Security** - prevent malicious data
   */

  /**
   * REF: handle-signup-submit
   *
   * ## Form Submit Handler
   *
   * Handles signup form submission with validation.
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
   * 3. Validate passwords match
   * 4. Validate password length (minimum 6 characters)
   * 5. Set loading state to `true`
   * 6. Call `signUp()` with email, password, and metadata
   * 7. Navigate to `/dashboard` on success
   * 8. Display error message on failure
   * 9. Reset loading state
   *
   * ### Sign Up with Metadata
   *
   * **`options.data`** - Stored in `auth.users.raw_user_meta_data`:
   * - Can store display name, avatar URL, preferences
   * - Accessible in database triggers
   * - Returned with user object
   *
   * This is better than making separate API call to save profile!
   *
   * ### Common Supabase Errors
   *
   * | Error Message | Meaning |
   * |---------------|---------|
   * | "User already registered" | Email exists in database |
   * | "Password should be at least 6 characters" | Password too weak |
   * | "Unable to validate email address" | Invalid email format |
   * | "Email rate limit exceeded" | Too many signup attempts |
   */
// REF: Async function: const
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
// CLOSE: Async function: const

    // Validate passwords match
// REF: Control flow
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
// CLOSE: Control flow

    // Validate password length (Supabase minimum is 6)
// REF: Control flow
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
// CLOSE: Control flow

    setLoading(true)

    try {
      await signUp(email, password, { displayName })

      // Success! User logged in automatically
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  /**
   * REF: signup-render
   *
   * ## Component Render
   *
   * Sign-up form with centered layout and validation.
   *
   * ### Structure
   *
   * 1. Centered container (full screen height)
   * 2. Card with form (max width 448px)
   * 3. Error message (conditional display)
   * 4. Display name input with autocomplete
   * 5. Email input with label and validation
   * 6. Password input with minimum length indicator
   * 7. Confirm password input
   * 8. Submit button with loading state
   * 9. Link to sign-in page
   *
   * ### Accessibility
   *
   * - **Labels** - Associated with inputs via `htmlFor`/`id`
   * - **Required attributes** - HTML5 validation
   * - **Disabled state** - Button disabled during loading
   * - **Error messages** - Clear, actionable feedback
   * - **Autocomplete** - Proper `name`, `email`, and `new-password` hints
   * - **Minimum length** - HTML5 `minLength` attribute
   */
// REF: JSX return
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
// CLOSE: JSX return

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

// REF: JSX element
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="John Doe"
              />
            </div>
// CLOSE: JSX element

            {/* Email */}
// REF: JSX element
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

            {/* Password */}
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
                autoComplete="new-password"
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            </div>
// CLOSE: JSX element

            {/* Confirm Password */}
// REF: JSX element
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
// CLOSE: JSX element

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Sign In Link */}
// REF: JSX element
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
// CLOSE: JSX element

/**
 * REF: password-strength-indicator
 *
 * ## Password Strength Indicator (Enhancement)
 *
 * Add visual feedback for password strength.
 *
 * ### Implementation
 *
 * ```typescript
 * const getPasswordStrength = (pwd: string) => {
 *   if (pwd.length < 6) return 'weak'
 *   if (pwd.length < 10) return 'medium'
 *   if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 'strong'
 *   return 'medium'
 * }
 *
 * const strength = getPasswordStrength(password)
 *
 * <div className={`h-1 rounded ${
 *   strength === 'weak' ? 'bg-red-500' :
 *   strength === 'medium' ? 'bg-yellow-500' :
 *   'bg-green-500'
 * }`} />
 * ```
 */

/**
 * REF: email-confirmation
 *
 * ## Email Confirmation (Optional Feature)
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
 *
 * ### Development vs Production
 *
 * - **Good for production** - prevents fake accounts
 * - **Annoying for development** - slows testing
 *
 * **Disable for development:**
 * Supabase Dashboard → Authentication → Email Auth → Disable "Confirm email"
 */

/**
 * REF: rate-limiting
 *
 * ## Rate Limiting
 *
 * Supabase automatically rate limits signup attempts.
 *
 * ### Built-in Limits
 *
 * | Limit | Value | Purpose |
 * |-------|-------|---------|
 * | Max requests per hour per IP | 4 | Prevents spam accounts |
 * | Cooldown period | 60 minutes | Forces wait between attempts |
 * | Scope | IP address | Per-network protection |
 *
 * ### Handle Rate Limit Error
 *
 * ```typescript
 * if (error.message.includes('rate limit')) {
 *   setError('Too many signup attempts. Please try again later.')
 * }
 * ```
 *
 * This protects your quota and prevents abuse!
 */
