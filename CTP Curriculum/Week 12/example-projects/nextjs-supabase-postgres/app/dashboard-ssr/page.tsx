/**
 * Dashboard Page - Server-Side Rendered with Supabase
 *
 * REF:
 * Server Component fetching data before rendering, eliminating loading states.
 * Demonstrates Next.js App Router server-side data fetching with Supabase.
 *
 * | Aspect | `Server` Component | `Client` Component |
 * |--------|---|---|
 * | `Rendering` | Server (HTML with data) | Client (fetch after load) |
 * | `Loading` State | `None` | `Required` |
 * | `SEO` | `Excellent` | `Poor` |
 * | `Performance` | `Faster` initial load | Slower initial load |
 * | `Bundle` Size | `Smaller` | `Larger` |
 *
 * CLOSE:
 *
 * **Rendering Strategy:**
 * - Data fetched on server before page renders
 * - Content included in initial HTML
 * - No loading spinner needed
 * - Better Core Web Vitals
 */

// REF: Import statement
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodoListClient from '@/components/todos/TodoListClient'
// CLOSE: Import statement

/**
 * IMPORTS
 *
 * REF: Dependencies for server-side rendering
 *
 * | Import | `Source` | Purpose |
 * |--------|---------|---------|
 * | `createClient` | `@/lib/supabase/server` | Server-side Supabase client |
 * | `redirect` | `next/navigation` | Server-side navigation |
 * | `TodoListClient` | Components | Client component for interactivity |
 *
 * CLOSE: Server functions can only be imported in server components
 */

/**
 * ASYNC SERVER COMPONENT
 *
 * REF: Next.js server components can be async functions
 *
 * | Capability | Server Component | Client Component |
 * |------------|-----------------|------------------|
 * | `async/await` | `Yes` | `No` (use useEffect) |
 * | `Direct` DB access | `Yes` | `No` (API route) |
 * | `Suspense` | `Automatic` | Manual loading states |
 * | `State` | `No` | `Yes` |
 * | Event handlers | `No` | `Yes` |
 *
 * CLOSE: Server components suspend until data ready
 */
// REF: Async function: export
export default async function DashboardSSRPage() {
// CLOSE: Async function: export
  /**
   * CREATE SUPABASE SERVER CLIENT
   *
   * REF: Initialize server-side Supabase client with cookie access
   *
   * **Server vs Client:**
   * ```typescript
   * // Server (this file)
   * const supabase = await createClient() // Has access to cookies
   *
   * // Client
   * const supabase = createClient() // Different implementation
   * ```
   *
   * CLOSE: Server client reads auth from request cookies
   */
// REF: Constant: supabase
  const supabase = await createClient()
// CLOSE: Constant: supabase

  /**
   * CHECK AUTHENTICATION
   *
   * REF: Verify user logged in on server before rendering
   *
   * | Benefit | Description |
   * |---------|-------------|
   * | `No flash` | User never sees protected content if unauthorized |
   * | `Security` | Server-side check more secure |
   * | `Performance` | Single request for auth + redirect |
   * | `SEO` | Search engines see redirect, not protected page |
   *
   * CLOSE: Server-side redirect is instant, no client-side JavaScript needed
   */
  const {
    data: { user },
  } = await supabase.auth.getUser()

// REF: Control flow
  if (!user) {
    redirect('/signin')
  }
// CLOSE: Control flow

  /**
   * FETCH TODOS ON SERVER
   *
   * REF: Query database on server before page renders
   *
   * **Advantages:**
   * | `Advantage` | Explanation |
   * |-------------|-------------|
   * | `Direct` access | No API route needed |
   * | `Faster` | Closer to database |
   * | Content in HTML | `SEO-friendly` |
   * | `No` loading state | Data ready immediately |
   * | Service role option | Can bypass RLS if needed |
   *
   * **SQL Generated:**
   * ```sql
   * SELECT * FROM todos
   * WHERE user_id = 'user-uuid'
   * AND (user_id = auth.uid() OR is_public = true) -- RLS applied
   * ORDER BY created_at DESC;
   * ```
   *
   * CLOSE: RLS still enforced even with server-side queries
   */
// REF: Constant declaration
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
// CLOSE: Constant declaration

// REF: Control flow
  if (error) {
    console.error('Error fetching todos:', error)
  }
// CLOSE: Control flow

  /**
   * RENDER WITH SERVER DATA
   *
   * REF: Hybrid pattern - server fetches, client handles interactivity
   *
   * **Pattern Benefits:**
   * ```
   * Server Component (this)
   *   └─ Fetches data
   *   └─ Passes to Client Component
   *       └─ Real-time updates
   *       └─ User interactions
   *       └─ State management
   * ```
   *
   * | Layer | `Responsibility` | Technology |
   * |-------|-----------------|------------|
   * | `Server` | Initial data fetch | Supabase server client |
   * | `Client` | Real-time + mutations | Supabase client client |
   * | `Both` | Type safety | TypeScript types |
   *
   * CLOSE: This is the recommended Next.js App Router pattern
   */
// REF: JSX return
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Todos (Server-Rendered)</h1>
        <p className="text-gray-600">
          This page is rendered on the server with data fetched before page loads.
          No loading spinner needed!
        </p>
      </div>
// CLOSE: JSX return

      {/*
        CLIENT COMPONENT FOR INTERACTIVITY

        REF: TodoListClient handles all user interactions

        | What | `Where` |
        |------|---------|
        | Initial data | Server (this component) |
        | Real-time | Client (TodoListClient) |
        | Mutations | Client (TodoListClient) |
        | Forms | Client (TodoListClient) |

        CLOSE: Pass server data as props to client component
      */}
// REF: JSX element
      <TodoListClient initialTodos={todos || []} userId={user.id} />
    </div>
  )
}
// CLOSE: JSX element

/**
 * METADATA FOR SEO
 *
 * REF: Server components can export metadata for better SEO
 *
 * **Static Metadata:**
 * ```typescript
 * export const metadata = {
 *   title: 'Dashboard',
 *   description: 'Manage your todos'
 * }
 * ```
 *
 * **Dynamic Metadata:**
 * ```typescript
 * export async function generateMetadata() {
 *   const user = await getUser()
 *
 *   return {
 *     title: `${user.displayName}'s Todos`,
 *     description: 'Manage your todos'
 *   }
 * }
 * ```
 *
 * CLOSE: Metadata appears in `<head>`, improving SEO and social sharing
 */
// REF: Constant: metadata
export const metadata = {
  title: 'Dashboard - Server Rendered',
  description: 'Manage your todos with server-side rendering',
}
// CLOSE: Constant: metadata

/**
 * REVALIDATION STRATEGY
 *
 * REF: Control how Next.js caches this page
 *
 * | Strategy | `revalidate` Value | Behavior |
 * |----------|-------------------|----------|
 * | `Static` | `false` or omit | Cache forever (build time) |
 * | `ISR` | `60` | Regenerate every 60 seconds |
 * | `Dynamic` | `0` | Never cache, fetch every request |
 *
 * **For this page:**
 * - Always fetch fresh data
 * - No caching needed for user-specific content
 *
 * CLOSE: Set to 0 for user-specific authenticated pages
 */
// REF: Constant: revalidate
export const revalidate = 0
// CLOSE: Constant: revalidate

/**
 * SERVER COMPONENT ADVANTAGES
 *
 * REF: Benefits of server-side rendering over client-side
 *
 * ## Performance
 *
 * **Time to First Byte (TTFB):**
 * | Approach | Steps | Total Time |
 * |----------|-------|------------|
 * | `Client` | HTML → JS → Fetch → Render | ~2-3 seconds |
 * | `Server` | Fetch → HTML (with data) | ~500ms |
 *
 * **Bundle Size:**
 * - Client: Must ship data fetching code
 * - Server: No fetch code sent to client
 * - Result: Smaller JavaScript bundle
 *
 * ## SEO
 *
 * **Search Engine Crawling:**
 * - Client: Crawler sees loading spinner
 * - Server: Crawler sees actual content
 *
 * **Social Media Previews:**
 * - Client: Generic preview (no content)
 * - Server: Preview with actual data
 *
 * ## Security
 *
 * **Database Access:**
 * ```typescript
 * // Server can use service role key
 * const supabaseAdmin = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.SUPABASE_SERVICE_ROLE_KEY! // Never exposed to client
 * )
 * ```
 *
 * - Client: Only anon key
 * - Server: Can use service role key
 * - Benefit: More powerful queries possible
 *
 * CLOSE: Server components provide better performance, SEO, and security
 */

/**
 * STREAMING SSR (ADVANCED)
 *
 * REF: Stream content as it becomes ready using Suspense
 *
 * **Pattern:**
 * ```typescript
 * import { Suspense } from 'react'
 *
 * export default function Page() {
 *   return (
 *     <div>
 *       <h1>Dashboard</h1>
 *
 *       <Suspense fallback={<TodosSkeleton />}>
 *         <TodosServer />
 *       </Suspense>
 *
 *       <Suspense fallback={<StatsSkeleton />}>
 *         <StatsServer />
 *       </Suspense>
 *     </div>
 *   )
 * }
 *
 * async function TodosServer() {
 *   const todos = await fetchTodos()
 *   return <TodoList todos={todos} />
 * }
 *
 * async function StatsServer() {
 *   const stats = await fetchStats()
 *   return <Stats data={stats} />
 * }
 * ```
 *
 * **Benefits:**
 * | Benefit | Explanation |
 * |---------|-------------|
 * | `Progressive` rendering | Show parts as ready |
 * | `Parallel` fetching | Todos and stats fetch simultaneously |
 * | `Better` UX | User sees content sooner |
 * | `Independent` sections | One slow query doesn't block others |
 *
 * CLOSE: Streaming provides best user experience for complex pages
 */

/**
 * HYBRID APPROACH (RECOMMENDED)
 *
 * REF: Combine server and client components for optimal experience
 *
 * ## Architecture
 *
 * ```
 * Server Component
 * ├─ Fetch initial data (fast, SEO-friendly)
 * ├─ Server-side authentication
 * └─ Pass data to client component
 *     └─ Client Component
 *         ├─ Real-time subscriptions
 *         ├─ User interactions
 *         ├─ State management
 *         └─ Optimistic updates
 * ```
 *
 * ## When to Use Each
 *
 * **Server Components:**
 * - Initial page load
 * - Database queries
 * - Authentication checks
 * - SEO-critical content
 *
 * **Client Components:**
 * - Real-time features
 * - User input (forms, buttons)
 * - Browser APIs (localStorage, geolocation)
 * - State management (useState, useReducer)
 *
 * ## Result
 *
 * | Metric | Result |
 * |--------|--------|
 * | `Initial` Load | Fast (server-rendered) |
 * | `Interactivity` | Rich (client-side) |
 * | `Real-time` | Instant updates |
 * | `SEO` | Excellent |
 * | `UX` | Best of both worlds |
 *
 * CLOSE: This hybrid approach is the gold standard for modern web apps
 */
