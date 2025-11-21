/**
 * REF: Sign Up Registration Page
 *
 * Account creation form for new users. Validates input, creates Supabase user,
 * and redirects to dashboard on success.
 *
 * CLOSE: New users fill this form to create an account.
 * On success, automatically logs in and navigates to /dashboard.
 *
 * PAGE STRUCTURE:
 * | `Component` | Purpose |
 * |-----------|---------|
 * | Display Name | Optional user display name |
 * | Email Input | Registration email |
 * | Password Input | Password field (min 6 chars) |
 * | Confirm Password | Verify password matches |
 * | Submit Button | "Sign Up" or "Creating account..." during load |
 * | Error Alert | Red error message if signup fails |
 * | Sign In Link | Link to /signin for existing users |
 *
 * FORM FLOW:
 * 1. User fills in all fields
 * 2. Validates password length (min 6)
 * 3. Validates password confirmation match
 * 4. Clicks "Sign Up" button
 * 5. handleSubmit validates frontend
 * 6. Calls signUp() from AuthContext
 * 7. AuthContext calls supabase.auth.signUp()
 * 8. Supabase creates user and stores metadata
 * 9. Session created (auto-signin)
 * 10. onAuthStateChange fires
 * 11. User profile created in database
 * 12. navigate('/dashboard') redirects
 *
 * ### Validation Rules
 * | `Field` | `Rule` | `Error` |
 * |-------|------|-------|
 * | `Email` | Valid email format | HTML5 validation |
 * | `Password` | Min 6 characters | Client-side check |
 * | `Password` | Match confirmation | "Passwords do not match" |
 * | Display Name | `Optional` | No validation |
 *
 * STATE MANAGEMENT:
 * | `State` | Type | Purpose |
 * |-------|------|---------|
 * | `email` | `string` | Email input |
 * | `password` | `string` | Password input |
 * | `confirmPassword` | `string` | Confirm password input |
 * | `displayName` | `string` | User's display name |
 * | `error` | `string` | Error message |
 * | `loading` | `boolean` | Disable button during submission |
 *
 * ## Error Handling
 * | `Error` | `Cause` | `Message` |
 * |-------|-------|---------|
 * | Validation failed | Password < 6 | "Password must be at least 6 characters" |
 * | Passwords differ | Don't match | "Passwords do not match" |
 * | Email exists | Already registered | "User already registered" |
 * | Invalid email | Bad format | Email validation error |
 * | Server error | Database error | Server error message |
 *
 * PASSWORD REQUIREMENTS:
 * - Minimum 6 characters (Supabase default)
 * - No special character requirements
 * - No uppercase/lowercase requirements
 * - No number requirements
 * (Server can enforce stricter rules)
 *
 * METADATA STORAGE:
 * ```typescript
 * await signUp(email, password, {
 *   displayName: 'John Doe'  // Stored in user_metadata
 * })
 * ```
 * Later accessible via:
 * ```typescript
 * user.user_metadata.displayName
 * ```
 *
 * USER PROFILE CREATION:
 * - AuthContext listens for SIGNED_IN event
 * - Creates row in user_profiles table
 * - Stores display_name and user_id
 * - Initializes user_settings with defaults
 *
 * ## Styling
 * - Centered full-screen form
 * - White card with shadow
 * - Blue submit button with loading state
 * - Helper text for password minimum
 * - Red error alert box
 * - Responsive layout
 *
 * ## Navigation
 * - Success: navigate('/dashboard')
 * - Existing user: Link to '/signin'
 *
 * FILE REFERENCES:
 * - ../contexts/AuthContext.tsx - signUp() method
 * - ../App.tsx - Route definition
 * - SignIn.tsx - Login page
 *
 * ## Key Concepts
 * - Client-side form validation
 * - Server validates email/password format
 * - Metadata for non-auth user data
 * - Auto-login after signup
 * - Password confirmation pattern
 * - Error recovery (keeps form data)
 */

import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * REF: signup-page-component
 */
export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

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
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
// CLOSE: signup-page-component
