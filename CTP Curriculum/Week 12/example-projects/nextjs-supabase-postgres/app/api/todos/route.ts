/**
 * Todos API Route - Server-Side Endpoint
 *
 * This API route handles todo operations server-side.
 *
 ## Key Concepts
 * - Next.js API Routes (App Router)
 * - Server-side Supabase queries
 * - RESTful API design
 * - Request/Response handling
 *
 * ## Why API Routes?
 * - Server-side logic (secure operations)
 * - Can use service role key (bypass RLS if needed)
 * - Complex operations (transactions, aggregations)
 * - Third-party API calls
 * - Webhook handlers
 * - Scheduled jobs
 *
 * ## When to Use API Routes vs Direct Client Queries
 *
 * ### Use API Routes
 * - Need to use service role key
 * - Complex multi-step operations
 * - Need to call external APIs
 * - Want to add custom validation
 * - Need server-side rate limiting
 *
 * ### Use Client Queries
 * - Simple CRUD operations
 * - RLS is sufficient for security
 * - Real-time updates needed
 * - Faster (no server round-trip)
 *
 * ## This Route Demonstrates
 * - GET /api/todos - List user's todos
 * - POST /api/todos - Create new todo
 */

// REF: Import statement
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// CLOSE: Import statement

/**
 * GET HANDLER - Fetch Todos
 *
 * Handles GET requests to /api/todos
 *
 * @param request - Next.js request object
 * @returns JSON response with todos
 *
 * ## Authentication
 * - Uses Supabase server client (reads cookies)
 * - Gets user from session
 * - Returns 401 if not authenticated
 *
 * RLS STILL ENFORCED:
 * - Even in API routes with anon key
 * - Users only get their own data
 * - Database level security
 */

// REF: Async function: export
export async function GET(request: NextRequest) {
  try {
// CLOSE: Async function: export
    /**
     * CREATE SERVER CLIENT
     *
     * Server-side Supabase client with cookie access
     * Reads auth session from cookies
     */
// REF: Constant: supabase
    const supabase = await createClient()
// CLOSE: Constant: supabase

    /**
     * VERIFY AUTHENTICATION
     *
     * Check if user is logged in
     * Return 401 if not authenticated
     */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

// REF: Control flow
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
// CLOSE: Control flow

    /**
     * QUERY TODOS
     *
     * Server-side database query
     * RLS automatically filters to user's todos
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
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch todos' },
        { status: 500 }
      )
    }
// CLOSE: Control flow

    /**
     * RETURN JSON RESPONSE
     *
     * NextResponse.json() automatically:
     * - Sets Content-Type: application/json
     * - Serializes data
     * - Returns with 200 status
     */
// REF: JSX return
    return NextResponse.json({ todos })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// CLOSE: JSX return

/**
 * POST HANDLER - Create Todo
 *
 * Handles POST requests to /api/todos
 *
 * @param request - Next.js request object with JSON body
 * @returns JSON response with created todo
 *
 * REQUEST BODY VALIDATION:
 * - Parse JSON from request
 * - Validate required fields
 * - Return 400 if invalid
 *
 * SERVER-SIDE VALIDATION:
 * - Client validation is UX
 * - Server validation is security
 * - Always validate on server!
 */
// REF: Async function: export
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
// CLOSE: Async function: export

    /**
     * VERIFY AUTHENTICATION
     */
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

// REF: Control flow
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
// CLOSE: Control flow

    /**
     * PARSE REQUEST BODY
     *
     * Get JSON data from request
     */
// REF: Constant: body
    const body = await request.json()
    const { title, description, isPublic, tags } = body
// CLOSE: Constant: body

    /**
     * VALIDATE INPUT
     *
     * Server-side validation prevents bad data
     */
// REF: Control flow
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
// CLOSE: Control flow

// REF: Control flow
    if (title.length > 500) {
      return NextResponse.json(
        { error: 'Title too long (max 500 characters)' },
        { status: 400 }
      )
    }
// CLOSE: Control flow

    /**
     * INSERT TODO
     *
     * Server-side insert with validation
     */
// REF: Constant declaration
    const { data: todo, error } = await supabase
      .from('todos')
      .insert({
        user_id: user.id, // Set user_id on server (can't be spoofed!)
        title: title.trim(),
        description: description?.trim() || null,
        is_public: isPublic || false,
        tags: tags || null,
        completed: false,
      })
      .select()
      .single()
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create todo' },
        { status: 500 }
      )
    }
// CLOSE: Control flow

    /**
     * RETURN CREATED TODO
     *
     * 201 Created status
     * Returns the new todo with generated ID
     */
// REF: JSX return
    return NextResponse.json({ todo }, { status: 201 })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// CLOSE: JSX return

/**
 * API ROUTE PATTERNS
 *
 * SUPPORTED HTTP METHODS:
 * - GET: export async function GET(request) { }
 * - POST: export async function POST(request) { }
 * - PUT: export async function PUT(request) { }
 * - PATCH: export async function PATCH(request) { }
 * - DELETE: export async function DELETE(request) { }
 *
 * ## Dynamic Routes
 * File: app/api/todos/[id]/route.ts
 * ```typescript
 * export async function GET(
 *   request: NextRequest,
 *   { params }: { params: { id: string } }
 * ) {
 *   const todoId = params.id
 *   // Fetch specific todo
 * }
 * ```
 */

/**
 * RESPONSE HELPERS
 *
 * ```typescript
 * // JSON response
 * return NextResponse.json({ data })
 *
 * // With status code
 * return NextResponse.json({ error }, { status: 400 })
 *
 * // With headers
 * return NextResponse.json({ data }, {
 *   status: 200,
 *   headers: {
 *     'Cache-Control': 'no-store'
 *   }
 * })
 *
 * // Redirect
 * return NextResponse.redirect(new URL('/dashboard', request.url))
 * ```
 */

/**
 * REQUEST HELPERS
 *
 * ```typescript
 * // Get query params
 * const searchParams = request.nextUrl.searchParams
 * const query = searchParams.get('query')
 *
 * // Get headers
 * const authHeader = request.headers.get('authorization')
 *
 * // Get cookies
 * const token = request.cookies.get('token')
 *
 * // Parse JSON body
 * const body = await request.json()
 *
 * // Parse form data
 * const formData = await request.formData()
 * ```
 */

/**
 * ERROR HANDLING BEST PRACTICES
 *
 * ```typescript
 * try {
 *   // Your logic
 * } catch (error) {
 *   // Log error (server-side)
 *   console.error('API error:', error)
 *
 *   // Return user-friendly message (don't expose internals)
 *   return NextResponse.json(
 *     { error: 'Something went wrong' },
 *     { status: 500 }
 *   )
 * }
 * ```
 *
 * Never expose:
 * - Database errors
 * - Stack traces
 * - Internal paths
 * - Credentials
 */

/**
 * USING SERVICE ROLE KEY
 *
 * For admin operations that bypass RLS:
 *
 * ```typescript
 * import { createClient } from '@supabase/supabase-js'
 *
 * const supabaseAdmin = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only!
 *   {
 *     auth: {
 *       autoRefreshToken: false,
 *       persistSession: false
 *     }
 *   }
 * )
 *
 * // Bypasses RLS
 * const { data } = await supabaseAdmin
 *   .from('todos')
 *   .select('*') // Gets ALL todos, not just user's
 * ```
 *
 * SECURITY WARNING:
 * - Only use service role in API routes
 * - NEVER expose to client
 * - Add your own authorization logic
 * - Be very careful!
 */

/**
 * CALLING FROM CLIENT
 *
 * ```typescript
 * // GET request
 * const response = await fetch('/api/todos')
 * const { todos } = await response.json()
 *
 * // POST request
 * const response = await fetch('/api/todos', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ title: 'New todo' })
 * })
 * const { todo } = await response.json()
 * ```
 */
