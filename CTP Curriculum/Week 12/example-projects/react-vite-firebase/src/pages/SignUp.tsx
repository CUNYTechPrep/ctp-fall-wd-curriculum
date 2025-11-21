/**
 * REF: Sign Up Page - New User Registration
 *
 * Handles new user account creation in a React SPA.
 *
 * ## Registration Flow
 * 1. User fills registration form
 * 2. Client-side validation provides immediate feedback
 * 3. Firebase validates on submission
 * 4. New user account created
 * 5. User automatically logged in
 * 6. Redirected to `/dashboard`
 *
 * ## Validation: Two-Layer Approach
 *
 * ### Client-Side (This Form)
 * **Runs in browser before submission**
 * - Immediate user feedback (instant)
 * - No server round-trip for obvious errors
 * - Better UX
 * - Can be bypassed (not secure)
 *
 * **Validations:**
 * - Passwords match
 * - Password min 6 characters
 * - Email format (input type="email")
 * - All required fields filled
 *
 * ### Server-Side (Firebase)
 * **Real security layer**
 * - Validates all data again
 * - Can't be bypassed
 * - Enforces Firebase requirements
 * - Prevents invalid data in database
 *
 * ## Firebase Validation Errors
 *
 * | Error Code | `Meaning` | `Fix` |
 * |-----------|---------|-----|
 * | `auth/email-already-in-use` | Email registered | Use different email |
 * | `auth/invalid-email` | Malformed email | Use valid email |
 * | `auth/weak-password` | Password too weak | Min 6 characters, consider stronger |
 * | `auth/operation-not-allowed` | Email auth disabled | Contact admin |
 *
 * CLOSE
 */

import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  // REF: FORM VALIDATION
/**
   * FORM VALIDATION
   *
   * Validates before submitting to Firebase
   *
   * VALIDATION RULES:
   * 1. Passwords must match
   * 2. Password min 6 characters (Firebase requirement)
   * 3. Email format (handled by input type="email")
   *
   * WHY VALIDATE TWICE?
   * - Client: Better UX, immediate feedback
   * - Server (Firebase): Security, can't be bypassed
   */
// CLOSE
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
      navigate('/dashboard')
    } catch (err: any) {
      // REF: FIREBASE ERROR HANDLING
/**
       * FIREBASE ERROR HANDLING
       *
       * Common errors:
       * - auth/email-already-in-use
       * - auth/invalid-email
       * - auth/weak-password
       * - auth/operation-not-allowed
       *
       * Parse error.code for user-friendly messages
       */
// CLOSE
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.')
      } else {
        setError(err.message || 'Failed to create account')
      }
    } finally {
      setLoading(false)
    }
  }
  // CLOSE: FORM VALIDATION

  /** REF: component-return
   */
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
  // CLOSE: component-return

                {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/** REF: display-name-input
             * Display name input field for user registration.
             * Allows users to set their visible name.
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            {/* CLOSE: display-name-input */}

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
  /** REF: code-block
   */
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
  // CLOSE: code-block
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
// CLOSE: SignUp

// REF: PASSWORD VALIDATION ENHANCEMENTS
/**
 * PASSWORD VALIDATION ENHANCEMENTS
 *
 * Add strength indicator:
 *
 * ```typescript
 * const getPasswordStrength = (pwd: string) => {
 *   let strength = 0
 *   if (pwd.length >= 8) strength++
 *   if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
 *   if (/[0-9]/.test(pwd)) strength++
 *   if (/[^A-Za-z0-9]/.test(pwd)) strength++
 *   return strength
 * }
 *
 * const strength = getPasswordStrength(password)
 *
 * <div className="flex gap-1 mt-2">
 *   {[1, 2, 3, 4].map(level => (
 *     <div
 *       key={level}
 *       className={`h-1 flex-1 rounded ${
 *         level <= strength ? 'bg-green-500' : 'bg-gray-300'
 *       }`}
 *     />
 *   ))}
 * </div>
 * ```
 */
// CLOSE

// REF: FIREBASE AUTH FEATURES
/**
 * FIREBASE AUTH FEATURES
 *
 * Additional authentication options:
 *
 * 1. **Email Verification:**
 * ```typescript
 * import { sendEmailVerification } from 'firebase/auth'
 *
 * const user = result.user
 * await sendEmailVerification(user)
 * setMessage('Please check your email to verify your account')
 * ```
 *
 * 2. **Social Login:**
 * ```typescript
 * import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
 *
 * const provider = new GoogleAuthProvider()
 * await signInWithPopup(auth, provider)
 * ```
 *
 * 3. **Phone Authentication:**
 * ```typescript
 * import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'
 *
 * const appVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth)
 * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
 * const result = await confirmationResult.confirm(code)
 * ```
 */
// CLOSE
