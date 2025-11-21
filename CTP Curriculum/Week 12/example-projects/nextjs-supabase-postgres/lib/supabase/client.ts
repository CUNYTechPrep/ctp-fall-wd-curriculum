/**
 * REF: supabase-client-overview
 *
 * ## Supabase Client Configuration
 *
 * This file initializes the Supabase client for browser-side operations in a Next.js application.
 *
 * ### What is Supabase?
 *
 * Supabase is an open-source Firebase alternative that provides:
 * - **PostgreSQL Database**: Full-featured SQL database with ACID compliance
 * - **Real-time Subscriptions**: Listen to database changes instantly
 * - **Row Level Security (RLS)**: Database-level access control
 * - **Auto-generated REST API**: Automatic endpoints for all tables
 * - **Authentication**: Built-in auth with JWT tokens
 * - **Storage**: S3-compatible file storage
 *
 * ### Supabase vs Firebase
 *
 * | Feature | Supabase | Firebase |
 * |---------|----------|----------|
 * | Database | PostgreSQL (SQL) | Firestore (NoSQL) |
 * | Real-time | PostgreSQL `LISTEN`/`NOTIFY` | Custom protocol |
 * | Security | RLS Policies (SQL) | Security Rules (custom language) |
 * | API | Auto-generated REST + GraphQL | SDKs only |
 * | Querying | SQL + ORM | NoSQL queries |
 * | Open Source | Yes | No |
 *
 * // CLOSE: supabase-client-overview
 */

/**
 * REF: environment-variables
 *
 * ## Environment Variables
 *
 * ### NEXT_PUBLIC_ Prefix
 *
 * Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser:
 *
 * ```env
 * NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
 * ```
 *
 * ### Why is this safe?
 *
 * - Supabase URL and anon key are designed to be public
 * - Security is enforced by RLS policies in the database
 * - The anon key has limited permissions (read-only by default)
 * - Cannot access admin functions or bypass RLS
 * - Rate-limited by Supabase to prevent abuse
 *
 * ### Security Model
 *
 * ```
 * Client (Browser)
 *   ↓ (sends anon key)
 * Supabase API
 *   ↓ (checks RLS policies)
 * PostgreSQL Database
 *   ↓ (enforces row-level access)
 * Returns only authorized data
 * ```
 *
 * // CLOSE: environment-variables
 */

// REF: Import statement
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
// CLOSE: Import statement

/**
 * REF: client-initialization
 *
 * ## Supabase Client Initialization
 *
 * `createBrowserClient` creates a Supabase instance for client-side use
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `supabaseUrl` | `string` | Your project URL (e.g., `https://abc123.supabase.co`) |
 * | `supabaseAnonKey` | `string` | Public anonymous key (safe to expose) |
 *
 * ### Features
 *
 * - Automatic auth token handling
 * - Real-time subscription management
 * - Automatic retries and reconnection
 * - Built-in caching
 *
 * ### TypeScript Typing
 *
 * - Database type provides full TypeScript autocomplete
 * - Generated from database schema
 * - Catch errors at compile time
 *
 * // CLOSE: client-initialization
 */
// REF: Function: export
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
// CLOSE: Function: export

/**
 * REF: singleton-pattern
 *
 * ## Singleton Pattern
 *
 * We export a function instead of instance because:
 * 1. Next.js can call this in different contexts (server/client)
 * 2. Ensures fresh client for each request
 * 3. Prevents stale auth tokens
 *
 * ### Usage in Components
 *
 * ```typescript
 * const supabase = createClient()
 * const { data } = await supabase.from('todos').select('*')
 * ```
 *
 * // CLOSE: singleton-pattern
 */

/**
 * REF: client-features
 *
 * ## Supabase Client Features
 *
 * This client provides access to:
 *
 * ### 1. Database Operations
 *
 * ```typescript
 * supabase.from('table').select()
 * supabase.from('table').insert()
 * supabase.from('table').update()
 * supabase.from('table').delete()
 * ```
 *
 * ### 2. Authentication
 *
 * ```typescript
 * supabase.auth.signUp()
 * supabase.auth.signInWithPassword()
 * supabase.auth.signOut()
 * supabase.auth.getUser()
 * ```
 *
 * ### 3. Storage
 *
 * ```typescript
 * supabase.storage.from('bucket').upload()
 * supabase.storage.from('bucket').download()
 * supabase.storage.from('bucket').remove()
 * ```
 *
 * ### 4. Real-time
 *
 * ```typescript
 * supabase.channel().on('postgres_changes', ...).subscribe()
 * ```
 * - Listen to inserts, updates, deletes
 * - Works across all connected clients
 *
 * ### 5. RPC (Remote Procedure Calls)
 *
 * ```typescript
 * supabase.rpc('function_name', params)
 * ```
 * - Call PostgreSQL functions directly
 * - Useful for complex queries
 *
 * // CLOSE: client-features
 */

/**
 * REF: error-handling
 *
 * ## Error Handling
 *
 * Supabase operations return `{ data, error }`:
 *
 * ```typescript
 * const { data, error } = await supabase.from('todos').select()
 *
 * if (error) {
 *   // Handle error
 *   console.error(error)
 *   return
 * }
 *
 * // Use data
 * console.log(data)
 * ```
 *
 * This pattern ensures you always check for errors!
 *
 * // CLOSE: error-handling
 */

/**
 * REF: realtime-subscriptions
 *
 * ## Real-time Subscriptions
 *
 * Example of listening to todo changes:
 *
 * ```typescript
 * const supabase = createClient()
 *
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
 * return () => {
 *   supabase.removeChannel(channel)
 * }
 * ```
 *
 * // CLOSE: realtime-subscriptions
 */

/**
 * REF: security-notes
 *
 * ## Security Notes
 *
 * The anon key is public but limited:
 * - Can only do what RLS policies allow
 * - Cannot bypass security rules
 * - Cannot access admin functions
 * - Rate limited by Supabase
 *
 * Real security is in your RLS policies:
 *
 * ```sql
 * CREATE POLICY "Users can only see own todos"
 * ON todos FOR SELECT
 * USING (auth.uid() = user_id);
 * ```
 *
 * This ensures data protection at the database level,
 * regardless of what client code tries to do!
 *
 * // CLOSE: security-notes
 */
