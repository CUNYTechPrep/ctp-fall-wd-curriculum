/**
 * REF: middleware-overview
 *
 * ## Next.js Middleware with Supabase Auth
 *
 * Middleware that runs on every request to refresh auth tokens and protect routes.
 * Executes before pages render on the server.
 *
 * ### Responsibilities
 *
 * | Responsibility | Mechanism | Benefit |
 * |---|---|---|
 * | Token refresh | `getUser()` in middleware | Prevents expiry logouts |
 * | Route protection | Redirect logic | Unauthorized users blocked |
 * | Cookie management | Update response cookies | Auth state stays fresh |
 *
 * ### Why Middleware?
 *
 * - Runs on every request automatically
 * - Can redirect before page renders
 * - Refreshes tokens at the edge
 * - Single point of auth logic
 * - Prevents permission errors
 *
 * // CLOSE: middleware-overview
 */

// REF: Import statement
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
// CLOSE: Import statement

/**
 * REF: middleware-function
 *
 * ## Middleware Function
 *
 * Request interceptor for auth and routing
 *
 * ### Execution Flow
 *
 * | Step | Action | Effect |
 * |------|--------|--------|
 * | 1 | Create response object | Base for modifications |
 * | 2 | Initialize Supabase client | With request/response cookies |
 * | 3 | Refresh session | Calls `getUser()` |
 * | 4 | Check route access | Compare path with permissions |
 * | 5 | Return response | User sees redirect or page |
 *
 * ### Parameters
 *
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `request` | `NextRequest` | Incoming HTTP request |
 *
 * ### Returns
 *
 * `NextResponse` with updated cookies and potential redirects
 *
 * // CLOSE: middleware-function
 */
// REF: Async function: export
export async function middleware(request: NextRequest) {
// CLOSE: Async function: export
  /**
   * REF: create-response
   *
   * Initialize response to return modified version. Middleware returns response with updated cookies.
   *
   * // CLOSE: create-response
   */
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  /**
   * REF: supabase-client-middleware
   *
   * ## Create Supabase Client for Middleware
   *
   * Middleware-specific Supabase client handling
   *
   * ### Cookie Operations
   *
   * | Operation | Direction | Purpose |
   * |---|---|---|
   * | `get()` | Request → Client | Read auth tokens |
   * | `set()` | Client → Response | Write refreshed tokens |
   * | `remove()` | Response | Clear on logout |
   *
   * Works in edge runtime with limited APIs
   *
   * // CLOSE: supabase-client-middleware
   */
// REF: Constant: supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
// CLOSE: Constant: supabase
        /**
         * REF: get-cookie
         * Read auth tokens from request. Retrieves existing session tokens.
         * Supabase uses this to validate user.
         * // CLOSE: get-cookie
         */
        get(name: string) {
          return request.cookies.get(name)?.value
        },

        /**
         * REF: set-cookie
         * Write refreshed tokens to response. Updates tokens after refresh.
         * Critical for keeping session alive.
         * // CLOSE: set-cookie
         */
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          response.cookies.set({
            name,
            value,
            ...options,
          })
        },

        /**
         * REF: remove-cookie
         * Delete tokens on logout. Clears auth when user signs out.
         * Prevents future unauthorized access.
         * // CLOSE: remove-cookie
         */
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })

          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })

          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  /**
   * REF: refresh-session
   *
   * ## Refresh Session
   *
   * Critical - keeps auth tokens fresh on every request
   *
   * ### Common Issues Prevented
   *
   * | Issue | Cause | Solution |
   * |-------|-------|----------|
   * | Random logouts | Token expiry | `getUser()` refreshes |
   * | "User not found" | Expired token | Auto-refresh happens |
   * | Stale cookies | No refresh | Response updated |
   *
   * Must call `getUser()` - without it, users randomly log out!
   *
   * // CLOSE: refresh-session
   */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  /**
   * REF: route-protection
   *
   * ## Route Protection
   *
   * Determine route categories for access control
   *
   * ### Route Categories
   *
   * | Category | Routes | Requires Auth |
   * |----------|--------|---------------|
   * | Auth pages | `/signin`, `/signup` | No |
   * | Protected pages | `/dashboard`, `/feed`, `/messages` | Yes |
   * | API routes | `/api/*` | Yes |
   * | Public | `/`, `/about`, etc | No |
   *
   * Check pathname patterns to categorize routes
   *
   * // CLOSE: route-protection
   */
// REF: Constant: isAuthPage
  const isAuthPage = request.nextUrl.pathname.startsWith('/signin') ||
                     request.nextUrl.pathname.startsWith('/signup')
// CLOSE: Constant: isAuthPage

// REF: Constant: isProtectedPage
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                          request.nextUrl.pathname.startsWith('/feed') ||
                          request.nextUrl.pathname.startsWith('/messages') ||
                          request.nextUrl.pathname.startsWith('/settings')
// CLOSE: Constant: isProtectedPage

// REF: Constant: isApiRoute
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
// CLOSE: Constant: isApiRoute

  /**
   * REF: redirect-logic
   *
   * ## Redirect Logic
   *
   * Route user based on auth status and path
   *
   * ### Redirect Rules
   *
   * | Condition | Action | Reason |
   * |-----------|--------|--------|
   * | `!user` + protected | Redirect `/signin` | Force login |
   * | `!user` + API | Return 401 | JSON response |
   * | `user` + auth page | Redirect `/dashboard` | Skip login |
   *
   * User flows to appropriate page
   *
   * // CLOSE: redirect-logic
   */
// REF: Control flow
  if (!user && isProtectedPage) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
// CLOSE: Control flow

// REF: Control flow
  if (!user && isApiRoute) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
// CLOSE: Control flow

// REF: Control flow
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
// CLOSE: Control flow

  /**
   * REF: return-response
   *
   * Return modified response with refreshed auth cookies.
   * Next.js uses this response for the request.
   *
   * // CLOSE: return-response
   */
  return response
}

/**
 * REF: matcher-configuration
 *
 * ## Matcher Configuration
 *
 * Control which routes trigger middleware
 *
 * ### Excluded Paths
 *
 * | Excluded | Reason | Example |
 * |----------|--------|---------|
 * | `_next/static` | Build artifacts | `.js`, `.css` files |
 * | `_next/image` | Image optimization | Images from `next/image` |
 * | `favicon.ico` | Browser request | Not app request |
 * | Images | Static files | `.png`, `.svg`, `.jpg`, etc |
 *
 * Middleware expensive - exclude static files to reduce overhead
 *
 * // CLOSE: matcher-configuration
 */
// REF: Constant: config
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
// CLOSE: Constant: config

/**
 * REF: middleware-use-cases
 *
 * ## Middleware Use Cases
 *
 * Common middleware patterns
 *
 * | Use Case | Implementation | Benefit |
 * |----------|---|---|
 * | Auth (this file) | Check user, refresh tokens | Seamless sessions |
 * | Authorization | Check roles/permissions | Prevent unauthorized access |
 * | Localization | Detect language, redirect | Localized experience |
 * | A/B Testing | Assign variant in header | Test variants |
 * | Rate limiting | Track request count | Prevent abuse |
 * | Feature flags | Check feature enabled | Gradual rollouts |
 *
 * Middleware executes at the edge before page render
 *
 * // CLOSE: middleware-use-cases
 */

/**
 * REF: performance-optimization
 *
 * ## Performance Optimization
 *
 * Middleware runs on every request
 *
 * ### Requirements
 *
 * - Keep execution < 50ms
 * - Cache results when possible
 * - Use matcher to exclude static files
 * - Avoid expensive operations
 *
 * ### Edge Runtime (Vercel)
 *
 * - Global distribution
 * - Fast execution (< 10ms typical)
 * - Limited APIs (no `fs` module)
 * - Lightweight operations only
 *
 * Exclude static files via matcher to reduce overhead
 *
 * // CLOSE: performance-optimization
 */

/**
 * REF: debugging-middleware
 *
 * ## Debugging Middleware
 *
 * Add logging to understand middleware flow
 *
 * ### Example Pattern
 *
 * ```typescript
 * console.log('Request:', request.nextUrl.pathname)
 * console.log('User:', user?.email)
 * console.log('Redirect:', shouldRedirect ? '/signin' : 'no redirect')
 * ```
 *
 * Check logs in terminal running `npm run dev`
 *
 * // CLOSE: debugging-middleware
 */

/**
 * REF: advanced-patterns
 *
 * ## Advanced Patterns
 *
 * Conditional logic and request modification
 *
 * ### Conditional Execution by Path
 *
 * - Check pathname with `startsWith()`
 * - Run different logic for `/admin` vs `/api`
 * - Path-specific validation
 *
 * ### Add Request Headers
 *
 * - Pass `user.id` to page via header
 * - Access in Server Components with `headers()`
 * - Avoid cookies for server data
 *
 * Combine middleware with Server Components for full auth context
 *
 * // CLOSE: advanced-patterns
 */

/**
 * REF: testing-middleware
 *
 * ## Testing Middleware
 *
 * Test cases for middleware behavior
 *
 * | Test | Steps | Expected |
 * |------|-------|----------|
 * | Protect route | Sign out, visit `/dashboard` | Redirect to `/signin` |
 * | Auth page | Sign in, visit `/signin` | Redirect to `/dashboard` |
 * | Token refresh | Make request, check cookies | Cookies updated |
 *
 * Verify redirect behavior and token refresh work correctly
 *
 * // CLOSE: testing-middleware
 */
