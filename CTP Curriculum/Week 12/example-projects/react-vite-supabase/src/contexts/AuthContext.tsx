/**
 * REF: Authentication Context and Provider
 *
 * Global authentication state management using React Context and Supabase Auth.
 * Manages user sessions, JWT tokens, and provides auth methods to entire app.
 *
 * CLOSE: Wrap your app with AuthProvider to enable authentication throughout.
 * Use useAuth() hook in components to access user, session, and auth methods.
 *
 * PROVIDER HIERARCHY:
 * ```
 * AuthProvider
 *   ├─ initializes auth state
 *   ├─ listens for auth changes
 *   ├─ manages tokens in localStorage
 *   └─ provides useAuth() hook to descendants
 * ```
 *
 * ## Context Value Provided
 * | `Property` | Type | Purpose |
 * |----------|------|---------|
 * | `user` | User \| `null` | Current authenticated user object |
 * | `session` | Session \| `null` | JWT tokens and metadata |
 * | `loading` | `boolean` | Auth check in progress |
 * | `signUp` | `function` | Create new user account |
 * | `signIn` | `function` | Authenticate with email/password |
 * | `signOut` | `function` | Logout current user |
 *
 * ## Authentication Flow
 * | `Action` | `Flow` |
 * |--------|------|
 * | App loads | getSession() checks localStorage for existing session |
 * | Session found | Validates token expiry, refreshes if needed |
 * | Session invalid | User is null, user sees login page |
 * | User signs in | signInWithPassword() returns JWT tokens |
 * | Tokens stored | localStorage automatically (via Supabase config) |
 * | Auth event fires | onAuthStateChange listener updates state |
 * | Components update | useAuth() hook re-renders with new user |
 * | User signs out | signOut() clears localStorage and state |
 *
 * ## Tech Stack
 * | `Component` | Purpose |
 * |-----------|---------|
 * | Supabase Auth | JWT-based authentication |
 * | `localStorage` | Persist session across page reloads |
 * | React Context | Provide auth state globally |
 * | useContext hook | Access auth state in components |
 * | JWT tokens | Signed credentials (exp, aud, sub, etc) |
 *
 * KEY SUPABASE AUTH EVENTS:
 * | `Event` | `Triggers` |
 * |-------|----------|
 * | `SIGNED_IN` | User successfully authenticated |
 * | `SIGNED_OUT` | User logged out or session expired |
 * | `TOKEN_REFRESHED` | JWT refreshed before expiry |
 * | `USER_UPDATED` | Profile or metadata changed |
 * | `PASSWORD_RECOVERY` | Password reset initiated |
 *
 * SESSION PERSISTENCE:
 * - Supabase client configured with localStorage storage
 * - autoRefreshToken: true keeps sessions alive
 * - persistSession: true restores on page reload
 * - Tokens auto-refresh 60 seconds before expiry
 * - Syncs across browser tabs
 *
 * USER PROFILE CREATION:
 * - When SIGNED_IN event fires, upsert to user_profiles table
 * - Stores display_name from user_metadata
 * - Also initializes user_settings with defaults
 * - Runs on every signin for safety (upsert is idempotent)
 *
 * METADATA USAGE:
 * - signUp accepts displayName in metadata option
 * - Stored in auth.users.raw_user_meta_data
 * - Accessible via user.user_metadata
 * - Useful for display names, preferences, roles
 *
 * HOOKS AND PATTERNS:
 * ```typescript
 * // Check if user is authenticated
 * const { user } = useAuth()
 * if (user) { /* show protected content */ }
 *
 * // Get current session (JWT tokens)
 * const { session } = useAuth()
 * const jwt = session?.access_token
 *
 * // Check if auth is still loading
 * const { loading } = useAuth()
 * if (loading) return <LoadingSpinner />
 *
 * // Sign up new user
 * const { signUp } = useAuth()
 * await signUp('user@example.com', 'password123', { displayName: 'John' })
 *
 * // Sign in existing user
 * const { signIn } = useAuth()
 * await signIn('user@example.com', 'password123')
 *
 * // Sign out
 * const { signOut } = useAuth()
 * await signOut()
 * ```
 *
 * ## Error Handling
 * | `Error` | `Cause` | `Handling` |
 * |-------|-------|----------|
 * | "Invalid login credentials" | Wrong email/password | Show form error |
 * | "User already registered" | Email exists | Suggest signin |
 * | "Email not confirmed" | Account not verified | Check email |
 * | "Too many requests" | Rate limited | Retry after delay |
 * | "Password too short" | < 6 characters | Update password rules |
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: { displayName?: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AUTH PROVIDER
 *
 * Manages Supabase authentication state for the entire app
 *
 * SUPABASE SESSION MANAGEMENT:
 * - Session stored in localStorage automatically
 * - Tokens refreshed before expiry
 * - Works offline (cached session)
 * - Syncs across tabs
 */
  /** REF: code-block
   */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  // CLOSE: code-block

  /**
   * AUTH STATE LISTENER
   *
   * Subscribe to Supabase auth changes
   *
   * ## Events
   * - SIGNED_IN: User successfully authenticated
   * - SIGNED_OUT: User logged out
   * - TOKEN_REFRESHED: Session renewed
   * - USER_UPDATED: Profile changed
   * - PASSWORD_RECOVERY: Reset password flow
   *
   * INITIAL SESSION:
   * - getSession() retrieves from localStorage
   * - Validates token not expired
   * - Refreshes if needed
   * - Sets initial state
   */
  useEffect(() => {
    // Get initial session from localStorage
  /** REF: code-block
   */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
  // CLOSE: code-block
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)
      setSession(session)
      setUser(session?.user ?? null)

      /**
       * CREATE USER PROFILE ON SIGNUP
       *
       * When user signs up, create profile in database
       *
       * ## Alternative
       * Use database trigger (see Next.js + Supabase project)
       * Trigger is more reliable (atomic with signup)
       */
      if (event === 'SIGNED_IN' && session?.user) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: session.user.id,
            display_name: session.user.user_metadata?.displayName || '',
            updated_at: new Date().toISOString(),
          })

        if (error) console.error('Error creating profile:', error)

        // Create default settings
        await supabase
          .from('user_settings')
          .upsert({
            user_id: session.user.id,
            updated_at: new Date().toISOString(),
          })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * SIGN UP
   *
   * Create new Supabase user
   *
   * @param email - User's email
   * @param password - User's password (min 6 chars)
   * @param metadata - Optional user metadata
   *
   * METADATA:
   * - Stored in auth.users.raw_user_meta_data
   * - Accessible via user.user_metadata
   * - Useful for display name, preferences, etc.
   */
  const signUp = async (
    email: string,
    password: string,
    metadata?: { displayName?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })

    if (error) throw error

    // Check if email confirmation required
    if (data.user && !data.session) {
      throw new Error('Please check your email to confirm your account')
    }
  }

  /**
   * SIGN IN
   *
   * Authenticate existing user
   *
   * SUPABASE AUTH:
   * - Validates email/password
   * - Returns JWT tokens
   * - Stores in localStorage
   * - onAuthStateChange fires
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  /**
   * SIGN OUT
   *
   * Log out current user
   *
   * ## Cleanup
   * - Clears localStorage
   * - Invalidates session
   * - onAuthStateChange fires with null
   * - Context updates, UI re-renders
   */
  /** REF: state-variables
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  // CLOSE: state-variables
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * USE AUTH HOOK
 */
  /** REF: code-block
   */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
  // CLOSE: code-block
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * SUPABASE AUTH SECURITY
 *
 * Built-in features:
 * - ✅ Bcrypt password hashing
 * - ✅ JWT token authentication
 * - ✅ Automatic token refresh
 * - ✅ Rate limiting
 * - ✅ Email verification (optional)
 * - ✅ MFA support (optional)
 *
 * You get enterprise-grade auth for free!
 */

/**
 * SESSION PERSISTENCE
 *
 * Supabase automatically:
 * - Stores session in localStorage
 * - Restores on page reload
 * - Refreshes before expiry
 * - Syncs across tabs
 *
 * Configure persistence:
 * ```typescript
 * createClient(url, key, {
 *   auth: {
 *     storage: window.localStorage, // or sessionStorage
 *     autoRefreshToken: true,
 *     persistSession: true,
 *   }
 * })
 * ```
 */

/**
 * SOCIAL AUTH
 *
 * Add OAuth providers:
 *
 * ```typescript
 * const { error } = await supabase.auth.signInWithOAuth({
 *   provider: 'google',
 *   options: {
 *     redirectTo: `${window.location.origin}/auth/callback`
 *   }
 * })
 * ```
 *
 * Supported providers:
 * - Google, GitHub, GitLab, Bitbucket
 * - Facebook, Twitter, Discord
 * - Apple, Azure, Slack
 * - And more!
 */

/**
 * MAGIC LINK AUTH
 *
 * Passwordless authentication:
 *
 * ```typescript
 * const { error } = await supabase.auth.signInWithOtp({
 *   email: 'user@example.com',
 *   options: {
 *     emailRedirectTo: 'https://yourapp.com/dashboard'
 *   }
 * })
 * ```
 *
 * User receives email with login link!
 */

/**
 * REF: auth-context-provider
 *
 * ## Context API Provider Pattern
 *
 * ### Why Context?
 * Without Context: Prop Drilling
 * ```
 * App
 *   → Layout
 *     → Header
 *       → Nav
 *         → SignOutButton
 *           (user prop passed 4 levels!)
 * ```
 *
 * With Context: Direct Access
 * ```
 * App (AuthProvider)
 *   ...
 *   SignOutButton can useAuth() directly
 * ```
 *
 * ### Context Components
 * - **AuthContext**: Type definition + value
 * - **AuthProvider**: Provider component
 * - **useAuth()**: Hook to use context
 *
 * ### Best Practices
 * - Keep context focused (only auth)
 * - Don't put everything in one context
 * - Use separate contexts for different domains
 * - Consumers can use multiple contexts
 *
 * CLOSE: auth-context-provider
 */

