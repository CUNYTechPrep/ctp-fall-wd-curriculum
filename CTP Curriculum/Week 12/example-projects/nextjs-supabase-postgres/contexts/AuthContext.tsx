/**
 * Authentication Context with Supabase
 *
 * REF:
 * Global authentication state management using React Context and Supabase Auth.
 * Provides user, session, and auth methods to entire application.
 *
 * | `Component` | `Role` | `Responsibility` |
 * |-----------|------|-----------------|
 * | `AuthContext` | `Container` | Hold auth state definition |
 * | `AuthProvider` | `Provider` | Initialize Supabase, listen for changes |
 * | `useAuth()` | `Hook` | Access auth state in components |
 *
 * CLOSE:
 *
 * **Auth System Comparison:**
 * | Feature | `Supabase` | `Firebase` |
 * |---------|----------|----------|
 * | `Database` | `PostgreSQL` | `Proprietary` |
 * | `Token` | JWT + cookies | Custom + localStorage |
 * | Email verification | Built-in | Requires setup |
 * | Third-party OAuth | `Good` | `Excellent` |
 *
 * **Auth Flow:**
 * 1. User initiates sign-up/sign-in
 * 2. Supabase processes credentials, creates session
 * 3. JWT tokens stored in HTTP-only cookies
 * 4. Context listens for auth state changes
 * 5. Provides user data and auth methods to components
 */

'use client'

// REF: Import statement
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
// CLOSE: Import statement

/**
 * CONTEXT TYPE DEFINITION
 *
 * REF: AuthContextType interface defines all available auth data and methods
 */
// REF: Type definition
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: { displayName?: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: { displayName?: string; avatarUrl?: string }) => Promise<void>
}
// CLOSE: Type definition

// REF: Constant: AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)
// CLOSE: Constant: AuthContext

/**
 * AUTH PROVIDER COMPONENT
 *
 * REF: Wrapper component initializing Supabase client and managing auth state
 *
 * | `Responsibility` | `Details` |
 * |---|---|
 * | Supabase Init | Creates client, listens for auth changes |
 * | State Management | user, session, loading |
 * | Auth Methods | signUp, signIn, signOut, updateProfile |
 * | Error Handling | Provides error feedback to components |
 *
 * CLOSE: @param children - React components to wrap
 */
// REF: Function: export
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
// CLOSE: Function: export

  /**
   * AUTH STATE LISTENER
   *
   * REF: Subscribes to Supabase auth state changes
   *
   * | `Event` | `Trigger` | `Action` |
   * |-------|---------|--------|
   * | `SIGNED_IN` | Successful login | Update user/session state |
   * | `SIGNED_OUT` | User logout | Clear user/session |
   * | `TOKEN_REFRESHED` | Session refresh | Update tokens in cookies |
   * | `USER_UPDATED` | Profile change | Update user metadata |
   *
   * CLOSE: Real-time sync across tabs and devices
   */
// REF: Function: useEffect
  useEffect(() => {
// CLOSE: Function: useEffect
    // Get initial session
// REF: Function: supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
// CLOSE: Function: supabase

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    // Cleanup subscription
// REF: Function: return
    return () => subscription.unsubscribe()
  }, [supabase])
// CLOSE: Function: return

  /**
   * SIGN UP METHOD
   *
   * REF: Creates new user account with Supabase Auth
   *
   * | `Step` | `Operation` | `Result` |
   * |------|-----------|--------|
   * | `1` | Validate email/password | Client-side checks |
   * | `2` | Supabase signUp | Creates auth.users record |
   * | `3` | Email verification | Optional confirmation sent |
   * | `4` | Database trigger | user_profiles record created |
   * | `5` | Auto-login | Session set (if no email verification) |
   *
   * CLOSE: @param email - User's email; @param password - Min 6 chars;
   * @param metadata - Optional displayName, etc.
   */
// REF: Constant: signUp
  const signUp = async (
    email: string,
    password: string,
    metadata?: { displayName?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Stored in auth.users.raw_user_meta_data
      },
    })
// CLOSE: Constant: signUp

// REF: Control flow
    if (error) throw error
// CLOSE: Control flow

    // If email confirmation is required, user won't be logged in yet
// REF: Control flow
    if (data.user && !data.session) {
      throw new Error('Please check your email to confirm your account')
    }
  }
// CLOSE: Control flow

  /**
   * SIGN IN METHOD
   *
   * REF: Authenticates existing user with email/password
   *
   * | Security Feature | `Mechanism` | Benefit |
   * |---|---|---|
   * | Password hashing | bcrypt by default | Passwords never exposed |
   * | JWT tokens | Secure cookies | XSS-safe auth |
   * | Token refresh | Auto on expiry | Seamless experience |
   * | Rate limiting | Server-side | Brute-force protection |
   *
   * CLOSE: @param email - User's email; @param password - User's password
   */
// REF: Async function: const
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
// CLOSE: Async function: const

// REF: Control flow
    if (error) throw error
  }
// CLOSE: Control flow

  /**
   * SIGN OUT METHOD
   *
   * REF: Logs out current user and clears auth state
   *
   * | `Step` | `Action` | `Effect` |
   * |------|--------|--------|
   * | `1` | Supabase signOut | Invalidate tokens |
   * | `2` | Clear cookies | Remove auth from browser |
   * | `3` | State listener | Set user = null |
   * | `4` | `Redirect` | Route to login page |
   * | `5` | `Subscriptions` | Cleanup real-time listeners |
   *
   * CLOSE: Fully clears auth state from client and server
   */
// REF: Async function: const
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
// CLOSE: Async function: const

  /**
   * UPDATE PROFILE METHOD
   *
   * REF: Updates user profile across auth and database
   *
   * | `Table` | `Fields` | Purpose |
   * |-------|--------|---------|
   * | `auth.users` | `metadata` | displayName, avatarUrl (search/quick access) |
   * | `user_profiles` | display_name, profile_picture | Full profile storage |
   *
   * CLOSE: @param updates - displayName and/or avatarUrl to update
   */
// REF: Constant: updateProfile
  const updateProfile = async (updates: {
    displayName?: string
    avatarUrl?: string
  }) => {
    if (!user) throw new Error('No user logged in')
// CLOSE: Constant: updateProfile

    // Update auth.users metadata
// REF: Constant declaration
    const { error: authError } = await supabase.auth.updateUser({
      data: updates,
    })
// CLOSE: Constant declaration

// REF: Control flow
    if (authError) throw authError
// CLOSE: Control flow

    // Update user_profiles table
// REF: Constant declaration
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        display_name: updates.displayName,
        profile_picture: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
// CLOSE: Constant declaration

// REF: Control flow
    if (profileError) throw profileError
  }
// CLOSE: Control flow

  /**
   * CONTEXT VALUE
   *
   * All data and methods provided to consuming components
   */
// REF: Constant: value
  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }
// CLOSE: Constant: value

// REF: JSX element
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// CLOSE: JSX element

/**
 * USE AUTH HOOK
 *
 * REF: Custom hook providing access to auth context in client components
 *
 * | Error Case | `Cause` | `Solution` |
 * |---|---|---|
 * | "useAuth must be used within AuthProvider" | Hook called outside provider | Wrap app with `<AuthProvider>` |
 *
 * CLOSE: **Usage Pattern:**
 * ```typescript
 * const { user, signIn, signOut, loading } = useAuth()
 *
 * if (loading) return <LoadingSpinner />
 * if (!user) return <Login onSignIn={signIn} />
 * return <Dashboard user={user} onSignOut={signOut} />
 * ```
 */
// REF: Function: export
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
// CLOSE: Function: export

/**
 * COMMON IMPLEMENTATION PATTERNS
 *
 * REF: Typical auth usage patterns
 *
 * **Pattern 1: Protected Route (in Client Component)**
 * ```typescript
 * 'use client'
 * import { useAuth } from '@/contexts/AuthContext'
 * import { redirect } from 'next/navigation'
 *
 * export default function ProtectedPage() {
 *   const { user, loading } = useAuth()
 *
 *   if (loading) return <LoadingSpinner />
 *   if (!user) redirect('/signin')
 *
 *   return <ProtectedContent user={user} />
 * }
 * ```
 *
 * **Pattern 2: Conditional Navigation**
 * ```typescript
 * export default function Header() {
 *   const { user, signOut } = useAuth()
 *
 *   return (
 *     <header>
 *       {user ? (
 *         <UserMenu user={user} onSignOut={signOut} />
 *       ) : (
 *         <Link href="/signin">Sign In</Link>
 *       )}
 *     </header>
 *   )
 * }
 * ```
 *
 * CLOSE: Combine server-side checks (middleware/layout) with client-side UI logic
 */
