/**
 * REF: auth-context-file
 *
 * # Authentication Context
 *
 * Global authentication state management using React Context API.
 *
 * ## Key Concepts
 *
 * - **React Context:** Share state across component tree
 * - **Firebase Auth:** User authentication and sessions
 * - **Custom Hook:** `useAuth()` for accessing context
 * - **Auth State:** User object and authentication methods
 *
 * ## Why Context API?
 *
 * Instead of prop drilling:
 * ```tsx
 * <App user={user}>
 *   <Dashboard user={user}>
 *     <TodoList user={user} />
 *   </Dashboard>
 * </App>
 * ```
 *
 * Use context:
 * ```tsx
 * <AuthProvider>
 *   <App />  // user available anywhere via useAuth()
 * </AuthProvider>
 * ```
 *
 * **Audio Guide:** `audio/nextjs-firebase/auth-context.mp3`
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'

/**
 * REF: auth-context-type
 *
 * ## AuthContext Type Definition
 *
 * Defines the shape of authentication data available to components.
 *
 * ### Properties
 *
 * - `user`: Current user object (or null if not logged in)
 * - `loading`: True while checking auth state
 * - `signUp`: Function to create new account
 * - `signIn`: Function to authenticate user
 * - `signOut`: Function to log out
 * - `updateUserProfile`: Function to update display name/photo
 *
 * ### TypeScript Interface
 *
 * Provides autocomplete and type safety:
 * ```typescript
 * const { user, signIn } = useAuth()
 * // TypeScript knows exact types!
 * ```
 */
interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>
}
// CLOSE: auth-context-type

/**
 * REF: create-auth-context
 *
 * ## Create Auth Context
 *
 * Initialize context with default values.
 *
 * ### Default Values
 *
 * - `user: null` - No user initially
 * - `loading: true` - Loading until auth checked
 * - Functions: Empty async functions (will be replaced by provider)
 *
 * ### Why Default Values?
 *
 * TypeScript requires initial value for context.
 * These are immediately replaced by AuthProvider.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  updateUserProfile: async () => {},
})
// CLOSE: create-auth-context

/**
 * REF: auth-provider-component
 *
 * ## AuthProvider Component
 *
 * Wraps app to provide authentication state globally.
 *
 * ### Usage
 *
 * In `app/layout.tsx`:
 * ```tsx
 * <AuthProvider>
 *   {children}
 * </AuthProvider>
 * ```
 *
 * Now any component can use `useAuth()` to access auth state.
 *
 * ### State Management
 *
 * Manages two pieces of state:
 * - `user`: Current user (or null)
 * - `loading`: Auth check in progress
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * Local state for user and loading status.
   */
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * REF: auth-state-listener
   *
   * ## Auth State Listener
   *
   * Firebase's `onAuthStateChanged` fires when:
   * - User signs in
   * - User signs out
   * - Page loads (restores session)
   * - Auth token refreshes
   *
   * ### Effect Cleanup
   *
   * Returns `unsubscribe` function:
   * - Called when component unmounts
   * - Stops listening to auth changes
   * - Prevents memory leaks
   *
   * ### User Profile Creation
   *
   * When new user signs in:
   * 1. Check if Firestore document exists
   * 2. If not, create user profile
   * 3. Create default settings
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)

      // Create user document if it doesn't exist
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || '',
            profilePicture: user.photoURL || '',
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          // Create default user settings
          const settingsRef = doc(db, 'userSettings', user.uid)
          await setDoc(settingsRef, {
            userId: user.uid,
            theme: 'light',
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
            updatedAt: new Date(),
          })
        }
      }
    })

    return unsubscribe
  }, [])
  // CLOSE: auth-state-listener

  /**
   * REF: signup-method
   *
   * ## Sign Up Method
   *
   * Creates new Firebase user account.
   *
   * ### Parameters
   *
   * - `email`: User's email
   * - `password`: User's password (min 6 chars)
   * - `displayName?`: Optional display name
   *
   * ### Flow
   *
   * 1. Create auth user with email/password
   * 2. If displayName provided, update profile
   * 3. `onAuthStateChanged` fires
   * 4. User profile created in Firestore
   */
  const signUp = async (email: string, password: string, displayName?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    if (displayName && result.user) {
      await updateProfile(result.user, { displayName })
    }
  }
  // CLOSE: signup-method

  /**
   * REF: signin-method
   *
   * ## Sign In Method
   *
   * Authenticates existing user.
   *
   * ### Firebase Auth
   *
   * - Validates email/password
   * - Returns user object
   * - `onAuthStateChanged` fires
   * - Context updates automatically
   */
  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }
  // CLOSE: signin-method

  /**
   * REF: signout-method
   *
   * ## Sign Out Method
   *
   * Logs out current user.
   *
   * ### Effects
   *
   * - Clears localStorage auth tokens
   * - `onAuthStateChanged` fires with null
   * - Context sets user to null
   * - User redirected to login
   */
  const signOut = async () => {
    await firebaseSignOut(auth)
  }
  // CLOSE: signout-method

  /**
   * REF: update-profile-method
   *
   * ## Update User Profile
   *
   * Updates display name and/or photo URL.
   *
   * ### Two Updates Required
   *
   * 1. **Firebase Auth profile:**
   *    - Updates `auth.currentUser`
   *    - For authentication system
   *
   * 2. **Firestore user document:**
   *    - Updates searchable profile
   *    - For displaying in app
   *
   * Both must stay in sync!
   */
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    if (!user) return

    const updates: { displayName?: string; photoURL?: string } = {}
    if (displayName !== undefined) updates.displayName = displayName
    if (photoURL !== undefined) updates.photoURL = photoURL

    await updateProfile(user, updates)

    // Update Firestore user document
    const userRef = doc(db, 'users', user.uid)
    await setDoc(
      userRef,
      {
        displayName: displayName || user.displayName,
        profilePicture: photoURL || user.photoURL,
        updatedAt: new Date(),
      },
      { merge: true }
    )
  }
  // CLOSE: update-profile-method

  /**
   * REF: context-value
   *
   * ## Create Context Value
   *
   * Combine state and methods into context value.
   *
   * All components using `useAuth()` get:
   * - Current user
   * - Loading status
   * - Authentication methods
   */
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  }
  // CLOSE: context-value

  /**
   * Provide context value to all children.
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// CLOSE: auth-provider-component

/**
 * REF: use-auth-hook
 *
 * ## useAuth Custom Hook
 *
 * Access authentication context in any component.
 *
 * ### Usage
 *
 * ```tsx
 * function MyComponent() {
 *   const { user, signIn, signOut } = useAuth()
 *
 *   if (!user) return <Login />
 *   return <Dashboard user={user} onSignOut={signOut} />
 * }
 * ```
 *
 * ### Error Handling
 *
 * Throws error if used outside `AuthProvider`:
 * - Catches mistakes early
 * - Clear error message
 * - Helps debugging
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
// CLOSE: use-auth-hook
// CLOSE: auth-context-file
