/**
 * REF: Context Overview
 *
 * # Authentication Context for Drizzle + Supabase Project
 *
 * This context demonstrates a hybrid architecture: Supabase for authentication
 * and Drizzle ORM for database operations. This approach leverages the strengths
 * of each tool.
 *
 * ## Key Concepts
 * - Hybrid architecture (Supabase auth + Drizzle database)
 * - Best tool for each job philosophy
 * - Type safety throughout the stack
 * - React Context API for auth state management
 * - Database operations via Drizzle inserts
 *
 * ## Why Supabase Auth with Drizzle?
 * - Supabase Auth is battle-tested and feature-complete
 * - Don't reinvent the wheel for authentication
 * - Use Drizzle where it excels (type-safe queries)
 * - Use Supabase where it excels (auth, realtime, storage)
 * - Clean separation of concerns
 *
 * ## Architecture
 * - Auth state and methods: Supabase
 * - User profile creation: Drizzle ORM
 * - Database queries: Drizzle ORM
 * - File storage: Supabase Storage
 *
 * CLOSE: Context Overview
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { db } from '@/lib/db/client'
import { userProfiles, userSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/**
 * REF: Context Type Interface
 *
 * ## AuthContext Type Definition
 *
 * TypeScript interface defining the shape of the auth context.
 *
 * | `Property` | Type | Description |
 * |----------|------|-------------|
 * | `user` | `User \| null` | Current authenticated user from Supabase |
 * | `session` | `Session \| null` | Current session with tokens and metadata |
 * | `loading` | `boolean` | Whether auth state is still being loaded |
 * | `signUp` | `Function` | Async function to register new user |
 * | `signIn` | `Function` | Async function to sign in existing user |
 * | `signOut` | `Function` | Async function to sign out current user |
 *
 * ### User and Session Types
 * From `@supabase/supabase-js`:
 * - `User`: Contains id, email, user_metadata, etc.
 * - `Session`: Contains access_token, refresh_token, user object
 *
 * ### Function Signatures
 * - `signUp(email, password, metadata?)`: Creates new account
 * - `signIn(email, password)`: Authenticates user
 * - `signOut()`: Ends current session
 *
 * CLOSE: Context Type Interface
 */
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: { displayName?: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

/**
 * REF: Context Creation
 *
 * ## Create Auth Context
 *
 * Creates the React context with undefined initial value.
 *
 * ### Pattern
 * - Initial value is `undefined`
 * - `useAuth` hook will throw error if used outside provider
 * - Ensures context is always used correctly
 *
 * CLOSE: Context Creation
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * REF: Provider Component and State
 *
 * ## AuthProvider Component
 *
 * Provider component that wraps the app and manages auth state.
 *
 * ### Props
 * - `children`: React nodes to wrap with auth context
 */
export function AuthProvider({ children }: { children: ReactNode }) {

  /**
   * ## State Variables
   *
   * React state for managing authentication.
   *
   * | `State` | Type | `Initial` | Description |
   * |-------|------|---------|-------------|
   * | `user` | `User \| null` | `null` | Current user object |
   * | `session` | `Session \| null` | `null` | Current session object |
   * | `loading` | `boolean` | `true` | Loading state (starts true) |
   *
   * ### Loading Pattern
   * Starts as `true` to prevent rendering protected content before
   * auth state is determined.
   */
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * ## Supabase Client Instance
   *
   * Creates browser Supabase client for auth operations.
   */
  const supabase = createClient()
  // CLOSE: Provider Component and State

  /**
   * REF: Auth State Listener Effect

   *
   * ## Auth State Listener useEffect
   *
   * Sets up listener for auth state changes and handles initial session.
   *
   * ### Execution Flow
   * 1. Get initial session on mount
   * 2. Set initial state and stop loading
   * 3. Subscribe to auth state changes
   * 4. Create user profile on sign in (via Drizzle)
   * 5. Cleanup subscription on unmount
   */
  useEffect(() => {

    /**
     * ### Get Initial Session
     *
     * Fetches current session when component mounts.
     *
     * #### Process
     * - Calls Supabase auth.getSession()
     * - Sets session and user state
     * - Sets loading to false
     */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    /**
     * ### Subscribe to Auth Changes
     *
     * Listens for auth events (sign in, sign out, token refresh, etc.)
     *
     * #### Events Handled
     * - SIGNED_IN: User successfully signed in
     * - SIGNED_OUT: User signed out
     * - TOKEN_REFRESHED: Access token refreshed
     * - USER_UPDATED: User metadata updated
     *
     * #### State Updates
     * All events update session and user state
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      /**
       * ### Create User Profile with Drizzle
       *
       * When user signs in, create profile and settings using Drizzle.
       *
       * #### Drizzle Insert Operations
       * - Type-safe insert via `db.insert()`
       * - `.values()` provides data with type checking
       * - `.onConflictDoNothing()` prevents duplicate errors
       * - Safe to call on every sign in
       *
       * #### Alternative Approach
       * Use PostgreSQL database trigger (more reliable, atomic).
       * See migrations/001_initial_schema.sql for trigger examples.
       *
       * #### Why Both Tables?
       * - userProfiles: Display name, avatar, etc.
       * - userSettings: User preferences, theme, etc.
       */
      if (event === 'SIGNED_IN' && session?.user) {
        // Create user profile
        await db
          .insert(userProfiles)
          .values({
            userId: session.user.id,
            displayName: session.user.user_metadata?.displayName || '',
          })
          .onConflictDoNothing()

        // Create default settings
        await db
          .insert(userSettings)
          .values({
            userId: session.user.id,
          })
          .onConflictDoNothing()
      }
    })

    /**
     * ### Cleanup Function
     *
     * Unsubscribes from auth changes when component unmounts.
     *
     * Prevents memory leaks and unnecessary updates.
     */
    return () => subscription.unsubscribe()
  }, [supabase])
  // CLOSE: Auth State Listener Effect

  /**
   * REF: Sign Up Function
  /**
   * ## Sign Up Function
   *
   * Creates new user account with Supabase Auth.
   *
   * ### Parameters
   * - `email`: User's email address
   * - `password`: User's password (min 6 chars by default)
   * - `metadata`: Optional object with additional data (e.g., displayName)
   *
   * ### Process
   * 1. Call Supabase auth.signUp()
   * 2. Pass email, password, and optional metadata
   * 3. Handle errors (duplicate email, weak password, etc.)
   * 4. Check if email confirmation required
   *
   * ### Email Confirmation
   * If Supabase requires email confirmation:
   * - `data.user` exists but `data.session` is null
   * - Throw error prompting user to check email
   *
   * ### Metadata Storage
   * Metadata stored in `user.user_metadata` (Supabase)
   * Can be accessed later via `user.user_metadata.displayName`
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

    if (data.user && !data.session) {
      throw new Error('Please check your email to confirm your account')
    }
  }
  // CLOSE: Sign Up Function

  /**
   * REF: Sign In Function
  /**
   * ## Sign In Function
   *
   * Authenticates existing user with Supabase Auth.
   *
   * ### Parameters
   * - `email`: User's email address
   * - `password`: User's password
   *
   * ### Process
   * 1. Call Supabase auth.signInWithPassword()
   * 2. Supabase validates credentials
   * 3. Returns session with access token
   * 4. Auth state listener handles session update
   *
   * ### Error Handling
   * Common errors:
   * - Invalid credentials: Wrong email or password
   * - Email not confirmed: User hasn't verified email
   * - User not found: Email doesn't exist
   *
   * ### State Updates
   * On success, auth state listener triggers and:
   * - Updates session and user state
   * - Creates profile/settings (if needed)
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }
  // CLOSE: Sign In Function

  /**
   * REF: Sign Out Function
  /**
   * ## Sign Out Function
   *
   * Signs out current user and invalidates session.
   *
   * ### Process
   * 1. Call Supabase auth.signOut()
   * 2. Invalidates session tokens
   * 3. Auth state listener updates to null
   * 4. Protected routes become inaccessible
   *
   * ### State Cleanup
   * Auth state listener sets:
   * - `session` to null
   * - `user` to null
   *
   * ### Error Handling
   * Rare but can fail if:
   * - Network issues
   * - Already signed out
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  // CLOSE: Sign Out Function

  /**
   * REF: Context Value and Provider
  /**
   * ## Context Value Object
   *
   * Combines all state and functions into context value.
   *
   * ### Properties
   * - Current state: user, session, loading
   * - Auth methods: signUp, signIn, signOut
   */
  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  /**
   * ## Provider Render
   *
   * Wraps children with AuthContext.Provider, making auth
   * state and methods available to all descendant components.
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// CLOSE: Context Value and Provider

/**
 * REF: useAuth Hook
/**
 * ## useAuth Custom Hook
 *
 * Hook for accessing auth context in components.
 *
 * ### Usage
 * ```typescript
 * const { user, loading, signIn, signOut } = useAuth()
 * ```
 *
 * ### Error Handling
 * Throws error if used outside AuthProvider.
 * This ensures auth context is always properly initialized.
 *
 * ### Pattern Benefits
 * - Type-safe access to auth context
 * - Clear error messages for misuse
 * - No need to check for undefined
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
// CLOSE: useAuth Hook

/**
 * REF: Usage Examples
/**
 * ## Using Auth with Drizzle Queries
 *
 * Examples of combining Supabase auth with Drizzle database operations.
 *
 * ### In Client Components
 * ```typescript
 * import { useAuth } from '@/contexts/AuthContext'
 * import { getUserTodos } from '@/lib/db/queries'
 *
 * function TodoList() {
 *   const { user } = useAuth()
 *   const [todos, setTodos] = useState([])
 *
 *   useEffect(() => {
 *     if (!user) return
 *
 *     // Fetch with Drizzle (type-safe!)
 *     getUserTodos(user.id).then(setTodos)
 *   }, [user])
 *
 *   if (!user) {
 *     return <p>Please sign in</p>
 *   }
 *
 *   return <div>{/* Render todos */}</div>
 * }
 * ```
 *
 * ### Clean Separation of Concerns
 * - Auth state: From Supabase context via useAuth()
 * - Database queries: From Drizzle helpers (getUserTodos)
 * - No mixing of auth and database logic
 */

/**
 * ## File Uploads with Hybrid Approach
 *
 * Supabase for storage, Drizzle for metadata.
 *
 * ### Upload Pattern
 * ```typescript
 * import { createClient } from '@/lib/supabase/client'
 * import { db } from '@/lib/db/client'
 * import { todoAttachments } from '@/lib/db/schema'
 *
 * async function uploadFile(todoId: string, file: File) {
 *   const supabase = createClient()
 *
 *   // 1. Upload file to Supabase Storage
 *   const filePath = `${todoId}/${file.name}`
 *   const { data, error } = await supabase.storage
 *     .from('attachments')
 *     .upload(filePath, file)
 *
 *   if (error) throw error
 *
 *   // 2. Save metadata to database with Drizzle
 *   await db.insert(todoAttachments).values({
 *     todoId,
 *     fileName: file.name,
 *     fileUrl: data.path,
 *     fileSize: file.size,
 *     mimeType: file.type,
 *   })
 *
 *   // 3. Get public URL
 *   const { data: urlData } = supabase.storage
 *     .from('attachments')
 *     .getPublicUrl(data.path)
 *
 *   return urlData.publicUrl
 * }
 * ```
 *
 * ### Benefits
 * - Supabase handles file storage (CDN, access control)
 * - Drizzle handles metadata (type-safe, queryable)
 * - Best of both worlds
 *
 * ## Real-time Updates with Hybrid Approach
 *
 * Supabase broadcasts changes, Drizzle fetches data.
 *
 * ### Real-time Pattern
 * ```typescript
 * import { createClient } from '@/lib/supabase/client'
 * import { getUserTodos } from '@/lib/db/queries'
 *
 * function TodoList() {
 *   const { user } = useAuth()
 *   const [todos, setTodos] = useState([])
 *   const supabase = createClient()
 *
 *   useEffect(() => {
 *     if (!user) return
 *
 *     // Initial fetch with Drizzle
 *     getUserTodos(user.id).then(setTodos)
 *
 *     // Subscribe to changes with Supabase
 *     const channel = supabase
 *       .channel('todos')
 *       .on('postgres_changes', {
 *         event: '*',
 *         schema: 'public',
 *         table: 'todos',
 *         filter: `userId=eq.${user.id}`
 *       }, async () => {
 *         // Refetch with Drizzle when changes occur
 *         const updated = await getUserTodos(user.id)
 *         setTodos(updated)
 *       })
 *       .subscribe()
 *
 *     return () => {
 *       supabase.removeChannel(channel)
 *     }
 *   }, [user])
 *
 *   return <div>{/* Render todos */}</div>
 * }
 * ```
 *
 * ### Benefits
 * - Supabase broadcasts changes in real-time
 * - Drizzle fetches with perfect type inference
 * - Automatic UI updates on data changes
 * - Type-safe throughout
 *
 * CLOSE: Usage Examples
 */
