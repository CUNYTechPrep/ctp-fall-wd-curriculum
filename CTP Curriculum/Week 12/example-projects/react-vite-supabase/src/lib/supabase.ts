/**
 * REF: Supabase Client Configuration
 *
 * Initializes and exports the Supabase client for a client-side-only React SPA.
 * All database operations, authentication, and real-time subscriptions go through this client.
 *
 * CLOSE: This file is a singleton configuration module. Import and use the exported
 * `supabase` client in any component that needs database, auth, or storage operations.
 *
 * ## Architecture
 * | `Component` | Purpose |
 * |-----------|---------|
 * | supabase client | Main entry point for all Supabase operations |
 * | Database (PostgreSQL) | Data persistence and querying |
 * | `Auth` | User authentication and session management |
 * | `Storage` | File uploads and serving |
 * | `Realtime` | WebSocket subscriptions for live updates |
 *
 * ## Tech Stack
 * - Supabase JS client library (auto-generated REST API wrapper)
 * - TypeScript with Database type safety (optional)
 * - JWT authentication (managed by Supabase)
 * - WebSocket for real-time features
 *
 * ## Key Concepts
 * - Client-side Supabase (no backend server needed)
 * - PostgreSQL with Row Level Security (RLS)
 * - Real-time subscriptions via PostgreSQL LISTEN/NOTIFY
 * - localStorage session persistence
 * - Auto-refresh tokens before expiry
 *
 * ENVIRONMENT VARIABLES (Vite):
 * | `Variable` | `Source` | `Required` |
 * |----------|--------|----------|
 * | `VITE_SUPABASE_URL` | Supabase dashboard | `Yes` |
 * | `VITE_SUPABASE_ANON_KEY` | Supabase dashboard | `Yes` |
 *
 * Implementation Details:
 * - Must use VITE_ prefix for Vite to expose to client
 * - Values are embedded at build time (not runtime variables)
 * - Anon key is public and safe to expose (RLS enforces security)
 * - Auto-refresh keeps sessions alive across page reloads
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * SUPABASE CLIENT INITIALIZATION
 *
 * Creates a Supabase client for all database operations
 *
 * ### Parameters
 * - supabaseUrl: Your project URL from Supabase dashboard
 * - supabaseAnonKey: Public anonymous key (safe to expose)
 *
 * TYPE SAFETY:
 * - Database type provides full TypeScript autocomplete
 * - Generate with: npx supabase gen types typescript
 * - Optional but highly recommended!
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    /**
     * AUTH CONFIGURATION
     *
     * storage: Where to store auth tokens
     * - 'local': localStorage (persists after browser close)
     * - 'session': sessionStorage (clears on tab close)
     *
     * autoRefreshToken: Automatically refresh expired tokens
     * persistSession: Remember user between page reloads
     */
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
})

/**
 * CLIENT-SIDE SUPABASE FEATURES
 *
 * 1. **Database Operations:**
 * ```typescript
 * // SELECT
 * const { data, error } = await supabase
 *   .from('todos')
 *   .select('*')
 *
 * // INSERT
 * const { data, error } = await supabase
 *   .from('todos')
 *   .insert({ title: 'New todo', user_id: user.id })
 *   .select()
 *   .single()
 *
 * // UPDATE
 * const { error } = await supabase
 *   .from('todos')
 *   .update({ completed: true })
 *   .eq('id', todoId)
 *
 * // DELETE
 * const { error } = await supabase
 *   .from('todos')
 *   .delete()
 *   .eq('id', todoId)
 * ```
 *
 * 2. **Authentication:**
 * ```typescript
 * // Sign up
 * const { data, error } = await supabase.auth.signUp({
 *   email: 'user@example.com',
 *   password: 'password123',
 * })
 *
 * // Sign in
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123',
 * })
 *
 * // Sign out
 * const { error } = await supabase.auth.signOut()
 *
 * // Get current user
 * const { data: { user } } = await supabase.auth.getUser()
 * ```
 *
 * 3. **Storage:**
 * ```typescript
 * // Upload file
 * const { data, error } = await supabase.storage
 *   .from('attachments')
 *   .upload(`${userId}/${filename}`, file)
 *
 * // Get public URL
 * const { data } = supabase.storage
 *   .from('attachments')
 *   .getPublicUrl(path)
 * ```
 *
 * 4. **Real-time Subscriptions:**
 * ```typescript
 * const channel = supabase
 *   .channel('todos')
 *   .on('postgres_changes', {
 *     event: '*',
 *     schema: 'public',
 *     table: 'todos',
 *     filter: `user_id=eq.${userId}`
 *   }, (payload) => {
 *     console.log('Change detected:', payload)
 *   })
 *   .subscribe()
 *
 * // Cleanup
 * supabase.removeChannel(channel)
 * ```
 */

/**
 * AUTH STATE LISTENER
 *
 * Listen for auth changes (login, logout, token refresh)
 *
 * ```typescript
 * supabase.auth.onAuthStateChange((event, session) => {
 *   if (event === 'SIGNED_IN') {
 *     console.log('User signed in:', session.user)
 *   }
 *   if (event === 'SIGNED_OUT') {
 *     console.log('User signed out')
 *   }
 * })
 * ```
 *
 * Use this in AuthContext to manage global auth state
 */

/**
 * ROW LEVEL SECURITY
 *
 * Security is enforced at the database level:
 *
 * ```sql
 * -- Only see own todos
 * CREATE POLICY "Users see own todos"
 * ON todos FOR SELECT
 * USING (auth.uid() = user_id);
 *
 * -- Only update own todos
 * CREATE POLICY "Users update own todos"
 * ON todos FOR UPDATE
 * USING (auth.uid() = user_id);
 * ```
 *
 * Even if client code tries to access other users' data,
 * database will reject it. Security layer below application!
 */

/**
 * TYPE SAFETY
 *
 * Generate types from database:
 * ```bash
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
 * ```
 *
 * Then use in queries:
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 * // data is fully typed as Todo[]!
 * ```
 */

/**
 * ERROR HANDLING PATTERN
 *
 * Always check for errors:
 *
 * ```typescript
 * const { data, error } = await supabase
 *   .from('todos')
 *   .select('*')
 *
 * if (error) {
 *   console.error('Error:', error.message)
 *   throw error
 * }
 *
 * // Safe to use data here
 * console.log(data)
 * ```
 */

/**
 * DEPLOYMENT
 *
 * Build for production:
 * ```bash
 * npm run build
 * ```
 *
 * Deploy `dist/` folder to:
 * - Vercel
 * - Netlify
 * - Firebase Hosting
 * - GitHub Pages
 * - Any static host
 *
 * Environment variables in hosting platform:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

/**
 * SUPABASE vs FIREBASE
 *
 * | Feature | `Supabase` | `Firebase` |
 * |---------|----------|----------|
 * | `Database` | PostgreSQL (SQL) | Firestore (NoSQL) |
 * | Open Source | `Yes` | `No` |
 * | Self-hostable | `Yes` | `No` |
 * | Real-time | Built-in (Postgres) | Separate service |
 * | `Security` | RLS (powerful) | Security Rules |
 * | `Pricing` | `Cheaper` | More expensive |
 * | `Maturity` | `Newer` | Well-established |
 */

/**
 * PERFORMANCE TIPS
 *
 * 1. **Use select() to limit columns:**
 * ```typescript
 * // ❌ Fetches all columns
 * .from('todos').select('*')
 *
 * // ✅ Only fetches needed columns
 * .from('todos').select('id, title, completed')
 * ```
 *
 * 2. **Add indexes for frequently queried columns:**
 * ```sql
 * CREATE INDEX idx_todos_user_id ON todos(user_id);
 * CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
 * ```
 *
 * 3. **Use .single() when expecting one result:**
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .eq('id', todoId)
 *   .single() // Returns object instead of array
 * ```
 *
 * 4. **Limit results with pagination:**
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .range(0, 9) // First 10 items
 * ```
 */

export default supabase

/**
 * REF: supabase-initialization
 *
 * ## Supabase Client Setup
 *
 * ### Environment Variables
 * - VITE_SUPABASE_URL: Your project URL
 * - VITE_SUPABASE_ANON_KEY: Public JWT key
 *
 * ### Why Anon Key is Safe
 * - Marked "anonymous" for public access
 * - Actual security is RLS policies
 * - All queries must pass RLS checks
 * - Cannot bypass restrictions
 * - Like having a bodyguard check ID
 *
 * ### Auth Configuration
 * - storage: localStorage (persists session)
 * - autoRefreshToken: Keep tokens valid
 * - persistSession: Remember after reload
 *
 * ### Type Safety
 * Database interface provides autocomplete
 * - Full TypeScript support
 * - Compile-time error checking
 * - Runtime query validation
 * - Intellisense in IDE
 *
 * CLOSE: supabase-initialization
 */

