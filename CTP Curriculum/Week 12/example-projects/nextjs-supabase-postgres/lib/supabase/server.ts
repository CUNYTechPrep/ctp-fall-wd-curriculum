/**
 * REF: supabase-server-config
 *
 * ## Supabase Server Configuration
 *
 * This file initializes Supabase for server-side operations in Next.js.
 *
 * Supabase server initialization for cookie-based authentication in Server Components
 * and middleware. Uses HTTP-only cookies for secure auth token storage.
 *
 * ### Configuration Details
 *
 * | Aspect | Details |
 * |--------|---------|
 * | Purpose | Initialize Supabase client for server-side operations |
 * | Authentication | Cookie-based with HTTP-only flags for security |
 * | Storage | Auth tokens in secure HTTP-only cookies |
 * | Scope | Server Components, API Routes, Middleware |
 * | Key Method | `createClient()` - creates authenticated Supabase client |
 *
 * ### Server vs Client Architecture
 *
 * | Context | Runs On | Storage | Access | Use Case |
 * |---------|---------|---------|--------|----------|
 * | Server | Next.js backend | HTTP-only cookies | Safe for service role key | Data fetching, RLS checks |
 * | Client | Browser | localStorage/memory | Limited to anon key | Interactivity, real-time |
 *
 * ### Why Separate?
 *
 * - Different auth mechanisms prevent security issues
 * - Server can access restricted secrets safely
 * - Reduces client bundle size
 * - Better SEO with server-side rendering
 * - Cookie auto-sent with every request
 *
 * // CLOSE: supabase-server-config
 */

// REF: Import statement
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
// CLOSE: Import statement

/**
 * REF: create-server-client
 *
 * ## Create Server Supabase Client
 *
 * Factory function creating Supabase client for server-side use with cookie-based auth.
 * Handles three cookie operations for auth token lifecycle management.
 *
 * ### Cookie Operations
 *
 * | Operation | Purpose | When Used |
 * |-----------------|---------|-----------|
 * | `get()` | Read auth tokens from request | Initial session check |
 * | `set()` | Write tokens to response | Token refresh, sign-in |
 * | `remove()` | Delete auth tokens | Sign-out, token expiry |
 *
 * ### Async Cookies (Next.js 15+)
 *
 * - Non-blocking event loop operation
 * - Improved performance for server components
 * - Required pattern: `const cookieStore = await cookies()`
 *
 * ### Example Usage in Server Components
 *
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *
 *   const { data: todos } = await supabase
 *     .from('todos')
 *     .select('*')
 *     .eq('user_id', user.id)
 *
 *   return <TodoList todos={todos} />
 * }
 * ```
 *
 * // CLOSE: create-server-client
 */
// REF: Async function: export
export async function createClient() {
  const cookieStore = await cookies()
// CLOSE: Async function: export

// REF: JSX return
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
// CLOSE: JSX return
        /**
         * REF: get-cookie-operation
         *
         * Read cookie value from request.
         * Supabase uses this internally to read existing auth tokens.
         *
         * // CLOSE: get-cookie-operation
         */
        get(name: string) {
          return cookieStore.get(name)?.value
        },

        /**
         * REF: set-cookie-operation
         *
         * ## Set Cookie Operation
         *
         * Writes cookie with Supabase-provided options
         *
         * ### Parameters
         *
         * | Parameter | Type | Purpose |
         * |-----------|------|---------|
         * | `name` | `string` | Cookie identifier |
         * | `value` | `string` | JWT auth token |
         * | `options` | `CookieOptions` | HttpOnly, SameSite, Secure, Domain, Path |
         *
         * Wrapped in try/catch because Server Component context may prevent setting.
         * Middleware handles token refresh if this fails.
         *
         * // CLOSE: set-cookie-operation
         */
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Ignored: Middleware refreshes sessions instead
          }
        },

        /**
         * REF: remove-cookie-operation
         *
         * Clears cookie from response (sign-out operation).
         * Sets empty value with expiration to ensure browser deletion.
         *
         * // CLOSE: remove-cookie-operation
         */
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignored: Middleware handles sign-out cleanup
          }
        },
      },
    }
  )
}

/**
 * REF: authentication-server-components
 *
 * ## Authentication in Server Components
 *
 * Check user authentication and redirect unauthenticated users
 *
 * ### Pattern
 *
 * ```typescript
 * const supabase = await createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 *
 * if (!user) {
 *   redirect('/signin')
 * }
 *
 * // User verified - safe to proceed
 * ```
 *
 * No loading states needed - runs before page renders
 *
 * // CLOSE: authentication-server-components
 */

/**
 * REF: data-fetching-server-components
 *
 * ## Data Fetching in Server Components
 *
 * Fetch data on server before rendering for instant UI
 *
 * ### Benefits
 *
 * | Benefit | Impact |
 * |---------|--------|
 * | No client-side fetch | Faster initial page load |
 * | Content in HTML | Better SEO and first paint |
 * | No loading spinner | Cleaner UX |
 * | Server-side errors | Handled gracefully |
 *
 * ### Pattern
 *
 * ```typescript
 * const supabase = await createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 *
 * const { data: todos } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .eq('user_id', user.id)
 *
 * return <TodoList todos={todos} />
 * ```
 *
 * RLS automatically enforces ownership - user can only see their data
 *
 * // CLOSE: data-fetching-server-components
 */

/**
 * REF: middleware-integration
 *
 * ## Middleware Integration
 *
 * Use server client in middleware to refresh auth tokens on each request
 *
 * ### Middleware Pattern
 *
 * ```typescript
 * import { createServerClient } from '@supabase/ssr'
 * import { NextResponse } from 'next/server'
 *
 * export async function middleware(request: NextRequest) {
 *   const response = NextResponse.next({
 *     request: { headers: request.headers }
 *   })
 *
 *   const supabase = createServerClient(
 *     process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 *     {
 *       cookies: {
 *         get: (name) => request.cookies.get(name)?.value,
 *         set: (name, value, options) => {
 *           response.cookies.set({ name, value, ...options })
 *         },
 *         remove: (name, options) => {
 *           response.cookies.set({ name, value: '', ...options })
 *         },
 *       },
 *     }
 *   )
 *
 *   await supabase.auth.getUser()
 *   return response
 * }
 * ```
 *
 * Critical for keeping tokens fresh - prevents random logouts
 *
 * // CLOSE: middleware-integration
 */

/**
 * REF: security-implementation
 *
 * ## Security Implementation
 *
 * Best practices for server-side authentication
 *
 * ### Security Features
 *
 * | Feature | Benefit | Implementation |
 * |---------|---------|-----------------|
 * | HTTP-only cookies | XSS protection | Browser can't access via JS |
 * | Secure flag | HTTPS only | Production requirement |
 * | SameSite | CSRF protection | Lax or Strict mode |
 * | Anon key (server) | RLS enforcement | Limited to auth user's data |
 * | Service role key | Admin operations | Keep server-side only |
 *
 * Never expose service role key to client - it bypasses RLS!
 *
 * // CLOSE: security-implementation
 */

/**
 * REF: performance-optimization
 *
 * ## Performance Optimization
 *
 * Server Components reduce JavaScript and improve performance
 *
 * ### Performance Metrics
 *
 * | Metric | Server Component | Client Component |
 * |--------|------------------|------------------|
 * | JavaScript sent | None | Required for interactivity |
 * | Hydration | Not needed | Blocks interaction |
 * | Data fetching | Instant | Waterfall effect |
 * | Bundle size | Smaller | Larger |
 * | Time to Interactive | Faster | Slower |
 *
 * Default to Server Components, use Client Components only for interactivity
 *
 * // CLOSE: performance-optimization
 */
