/**
 * REF: Authentication Context - Global Auth State Management
 *
 * Manages authentication state globally across the SPA using React Context API and Firebase Auth.
 *
 * ## Overview
 * Provides authentication state and methods to all components without prop drilling.
 * Automatically persists sessions and syncs across browser tabs.
 *
 * ## Architecture: Context + Provider Pattern
 *
 * ```
 * AuthContext (type definition)
 *    ↓
 * AuthProvider (wraps app, provides value)
 *    ↓
 * useAuth() hook (consume context)
 *    ↓
 * Components (use hook to access auth)
 * ```
 *
 * ## SPA Auth vs SSR Auth
 *
 * | `Aspect` | SPA (This App) | SSR (Next.js) |
 * |--------|----------------|---------------|
 * | **Storage** | `localStorage` | HTTP cookies |
 * | **State** | React context | Server session |
 * | **Refresh** | Client-side | Server-side |
 * | **Security** | Lower (client) | Higher (server) |
 * | **Complexity** | `Lower` | `Higher` |
 * | **XSS Risk** | localStorage vulnerable | Cookies with HTTPOnly safer |
 *
 * ## Firebase Auth Persistence
 *
 * Firebase **automatically**:
 * - Stores auth tokens in localStorage
 * - Persists session across page refreshes
 * - Syncs auth state across browser tabs
 * - Refreshes tokens before expiry
 * - Handles token rotation
 *
 * **You don't need to manage tokens manually!**
 *
 * CLOSE
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

// REF: AUTH CONTEXT TYPE
/**
 * AUTH CONTEXT TYPE
 *
 * Defines the shape of authentication data available to components
 */
// CLOSE
interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
// CLOSE: AUTH CONTEXT TYPE

// REF: AUTH PROVIDER COMPONENT
/**
 * AUTH PROVIDER COMPONENT
 *
 * Wraps the entire application to provide auth state
 *
 * PROVIDER PATTERN:
 * - One provider at root level
 * - All child components can access via useAuth()
 * - Single source of truth for auth state
 *
 * WHY THIS PATTERN?
 * - Avoid prop drilling
 * - Centralized auth logic
 * - Easy to consume anywhere
 * - Consistent across app
 */
// CLOSE
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // REF: AUTH STATE LISTENER
/**
   * AUTH STATE LISTENER
   *
   * onAuthStateChanged fires when:
   * - User signs in
   * - User signs out
   * - Token refreshes
   * - Page loads (restores session)
   *
   * FIREBASE SESSION MANAGEMENT:
   * - Automatic localStorage persistence
   * - Automatic token refresh
   * - Cross-tab synchronization
   * - You don't need to manage tokens manually!
   *
   * ## Cleanup
   * - Returns unsubscribe function
   * - Call when component unmounts
   * - Prevents memory leaks
   */
// CLOSE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)

      // REF: CREATE USER DOCUMENT ON FIRST SIGN IN
/**
       * CREATE USER DOCUMENT ON FIRST SIGN IN
       *
       * When new user signs in, create their profile in Firestore
       * This ensures user document exists for queries
       */
// CLOSE
      if (user) {
        const userRef = doc(db, 'users', user.uid)

        // Use setDoc with merge to avoid overwriting existing data
        await setDoc(
          userRef,
          {
            email: user.email,
            displayName: user.displayName || '',
            profilePicture: user.photoURL || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          { merge: true }
        )

        // Create default user settings if not exists
        const settingsRef = doc(db, 'userSettings', user.uid)
        await setDoc(
          settingsRef,
          {
            userId: user.uid,
            theme: 'light',
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
            updatedAt: new Date(),
          },
          { merge: true }
        )
      }
    })

    return unsubscribe
  }, [])

  // REF: SIGN UP METHOD
/**
   * SIGN UP METHOD
   *
   * Creates new Firebase user
   *
   * @param email - User's email
   * @param password - User's password
   * @param displayName - Optional display name
   *
   * ## Flow
   * 1. Create auth user with email/password
   * 2. Update profile with display name
   * 3. onAuthStateChanged fires
   * 4. User document created (in listener above)
   * 5. User logged in automatically
   */
// CLOSE
  const signUp = async (email: string, password: string, displayName?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    if (displayName && result.user) {
      await updateProfile(result.user, { displayName })
    }
  }

  // REF: SIGN IN METHOD
/**
   * SIGN IN METHOD
   *
   * Authenticates existing user
   *
   * ## Error Handling
   * - "auth/wrong-password" - Incorrect password
   * - "auth/user-not-found" - Email doesn't exist
   * - "auth/too-many-requests" - Rate limited
   * - "auth/network-request-failed" - Network error
   *
   * These are Firebase error codes
   * Parse them for user-friendly messages
   */
// CLOSE
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  // REF: SIGN OUT METHOD
/**
   * SIGN OUT METHOD
   *
   * Logs out current user
   *
   * FIREBASE SIGNOUT:
   * - Clears localStorage
   * - Invalidates tokens
   * - Triggers onAuthStateChanged with null
   * - Context updates user to null
   */
// CLOSE
  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  // REF: UPDATE PROFILE METHOD
/**
   * UPDATE PROFILE METHOD
   *
   * Updates user's display name and/or photo
   *
   * TWO UPDATES NEEDED:
   * 1. Firebase Auth profile (for auth.currentUser)
   * 2. Firestore user document (for queries)
   */
// CLOSE
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    if (!user) return

    const updates: { displayName?: string; photoURL?: string } = {}
    if (displayName !== undefined) updates.displayName = displayName
    if (photoURL !== undefined) updates.photoURL = photoURL

    // Update auth profile
    await updateProfile(user, updates)

    // Update Firestore document
    await setDoc(
      doc(db, 'users', user.uid),
      {
        displayName: displayName || user.displayName,
        profilePicture: photoURL || user.photoURL,
        updatedAt: new Date(),
      },
      { merge: true }
    )
  }

  // REF: CONTEXT VALUE
/**
   * CONTEXT VALUE
   *
   * All data and methods provided to components
   */
// CLOSE
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// CLOSE: AUTH PROVIDER COMPONENT

// REF: USE AUTH HOOK
/**
 * USE AUTH HOOK
 *
 * Custom hook to access auth context
 *
 * USAGE IN COMPONENTS:
 * ```typescript
 * import { useAuth } from './contexts/AuthContext'
 *
 * function MyComponent() {
 *   const { user, signOut } = useAuth()
 *
 *   if (!user) return <div>Please sign in</div>
 *
 *   return (
 *     <div>
 *       Hello {user.email}
 *       <button onClick={signOut}>Sign Out</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * ## Error Handling
 * - Throws if used outside AuthProvider
 * - Helps catch mistakes early
 */
// CLOSE
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
// CLOSE: USE AUTH HOOK

// REF: PROTECTED ROUTE PATTERN
/**
 * PROTECTED ROUTE PATTERN
 *
 * Use in pages that require authentication:
 *
 * ```typescript
 * function ProtectedPage() {
 *   const { user, loading } = useAuth()
 *   const navigate = useNavigate()
 *
 *   useEffect(() => {
 *     if (!loading && !user) {
 *       navigate('/signin')
 *     }
 *   }, [user, loading, navigate])
 *
 *   if (loading) return <LoadingSpinner />
 *   if (!user) return null
 *
 *   return <div>Protected content</div>
 * }
 * ```
 */
// CLOSE

// REF: FIREBASE AUTH FEATURES
/**
 * FIREBASE AUTH FEATURES
 *
 * Additional features available:
 *
 * - Email verification:
 *   sendEmailVerification(user)
 *
 * - Password reset:
 *   sendPasswordResetEmail(auth, email)
 *
 * - Social auth:
 *   signInWithPopup(auth, new GoogleAuthProvider())
 *
 * - Phone auth:
 *   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
 *
 * - Anonymous auth:
 *   signInAnonymously(auth)
 */
// CLOSE
