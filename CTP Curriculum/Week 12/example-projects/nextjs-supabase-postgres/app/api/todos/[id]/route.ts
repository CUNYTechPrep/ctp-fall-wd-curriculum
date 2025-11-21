/**
 * Individual Todo API Route - Dynamic Route Parameter
 *
 * This API route handles operations on a specific todo.
 *
 ## Key Concepts
 * - Dynamic route segments [id]
 * - RESTful API design
 * - PUT/PATCH for updates
 * - DELETE for removal
 * - Authorization checks
 *
 * ## Dynamic Routes
 * - File: app/api/todos/[id]/route.ts
 * - URL: /api/todos/123
 * - Access: params.id = '123'
 *
 * ## RESTful Endpoints
 * - GET /api/todos/[id] - Get specific todo
 * - PUT /api/todos/[id] - Update todo
 * - DELETE /api/todos/[id] - Delete todo
 */

// REF: Import statement
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
// CLOSE: Import statement

/**
 * ROUTE CONTEXT TYPE
 *
 * Second parameter to route handlers contains params
 */
// REF: Type definition
type RouteContext = {
  params: {
    id: string
  }
}
// CLOSE: Type definition

/**
 * GET - Fetch Specific Todo
 *
 * @param request - Next.js request
 * @param context - Contains route params
 *
 * ## Authorization
 * - Verify user is authenticated
 * - Verify user owns the todo
 * - Return 403 if unauthorized
 *
 * RLS HANDLES THIS:
 * - If using anon key, RLS blocks unauthorized access
 * - But explicit check is clearer for API consumers
 */

// REF: Async function: export
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
// CLOSE: Async function: export

// REF: Control flow
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
// CLOSE: Control flow

    /**
     * FETCH SPECIFIC TODO
     *
     * .single() expects exactly one result
     * Throws error if 0 or >1 results
     */
// REF: Constant declaration
    const { data: todo, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', params.id)
      .single()
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      if (error.code === 'PGRST116') {
// CLOSE: Control flow
        // Not found
// REF: JSX return
        return NextResponse.json(
          { error: 'Todo not found' },
          { status: 404 }
        )
      }
// CLOSE: JSX return

// REF: JSX return
      return NextResponse.json(
        { error: 'Failed to fetch todo' },
        { status: 500 }
      )
    }
// CLOSE: JSX return

    /**
     * AUTHORIZATION CHECK
     *
     * Verify user owns this todo
     * RLS would block this anyway, but explicit check is clearer
     */
// REF: Control flow
    if (todo.user_id !== user.id && !todo.is_public) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
// CLOSE: Control flow

// REF: JSX return
    return NextResponse.json({ todo })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// CLOSE: JSX return

/**
 * PATCH - Update Todo
 *
 * @param request - Request with JSON body
 * @param context - Route params
 *
 * PATCH vs PUT:
 * - PATCH: Partial update (send only changed fields)
 * - PUT: Full replacement (send all fields)
 *
 * This uses PATCH for efficiency
 */
// REF: Async function: export
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
// CLOSE: Async function: export

// REF: Control flow
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
// CLOSE: Control flow

    /**
     * PARSE AND VALIDATE REQUEST BODY
     */
// REF: Constant: body
    const body = await request.json()
    const { title, description, completed, isPublic, tags } = body
// CLOSE: Constant: body

    // Build update object with only provided fields
// REF: Constant: updates
    const updates: any = {}
    if (title !== undefined) updates.title = title.trim()
    if (description !== undefined) updates.description = description?.trim() || null
    if (completed !== undefined) updates.completed = completed
    if (isPublic !== undefined) updates.is_public = isPublic
    if (tags !== undefined) updates.tags = tags
    updates.updated_at = new Date().toISOString()
// CLOSE: Constant: updates

    /**
     * VALIDATE TITLE IF PROVIDED
     */
// REF: Control flow
    if (updates.title !== undefined) {
      if (updates.title.length === 0) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        )
      }
      if (updates.title.length > 500) {
        return NextResponse.json(
          { error: 'Title too long' },
          { status: 400 }
        )
      }
    }
// CLOSE: Control flow

    /**
     * UPDATE TODO
     *
     * RLS ensures user can only update their own todos
     */
// REF: Constant declaration
    const { data: todo, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id) // Explicit ownership check
      .select()
      .single()
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Todo not found or unauthorized' },
          { status: 404 }
        )
      }
// CLOSE: Control flow

// REF: JSX return
      return NextResponse.json(
        { error: 'Failed to update todo' },
        { status: 500 }
      )
    }
// CLOSE: JSX return

// REF: JSX return
    return NextResponse.json({ todo })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// CLOSE: JSX return

/**
 * DELETE - Remove Todo
 *
 * @param request - Next.js request
 * @param context - Route params
 *
 * ## Cascade Delete
 * - If attachments have ON DELETE CASCADE
 * - They're removed automatically
 * - Must also delete files from Storage!
 */
// REF: Async function: export
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
// CLOSE: Async function: export

// REF: Control flow
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
// CLOSE: Control flow

    /**
     * DELETE TODO
     *
     * RLS ensures can only delete own todos
     */
// REF: Constant declaration
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Failed to delete todo' },
        { status: 500 }
      )
    }
// CLOSE: Control flow

    /**
     * TODO: Delete associated files from Storage
     *
     * ```typescript
     * const { data: attachments } = await supabase
     *   .from('todo_attachments')
     *   .select('file_url')
     *   .eq('todo_id', params.id)
     *
     * for (const attachment of attachments) {
     *   await supabase.storage
     *     .from('attachments')
     *     .remove([attachment.file_url])
     * }
     * ```
     */

// REF: JSX return
    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
// CLOSE: JSX return

/**
 * TESTING API ROUTES
 *
 * Using curl:
 * ```bash
 * # GET
 * curl http://localhost:3000/api/todos/123
 *
 * # POST
 * curl -X POST http://localhost:3000/api/todos \
 *   -H "Content-Type: application/json" \
 *   -d '{"title":"New todo"}'
 *
 * # PATCH
 * curl -X PATCH http://localhost:3000/api/todos/123 \
 *   -H "Content-Type: application/json" \
 *   -d '{"completed":true}'
 *
 * # DELETE
 * curl -X DELETE http://localhost:3000/api/todos/123
 * ```
 *
 * Or use Postman, Insomnia, or Thunder Client (VS Code extension)
 */

/**
 * RATE LIMITING (PRODUCTION)
 *
 * Add rate limiting to prevent abuse:
 *
 * ```typescript
 * import { Ratelimit } from '@upstash/ratelimit'
 * import { Redis } from '@upstash/redis'
 *
 * const ratelimit = new Ratelimit({
 *   redis: Redis.fromEnv(),
 *   limiter: Ratelimit.slidingWindow(10, '10 s'),
 * })
 *
 * const { success } = await ratelimit.limit(user.id)
 *
 * if (!success) {
 *   return NextResponse.json(
 *     { error: 'Too many requests' },
 *     { status: 429 }
 *   )
 * }
 * ```
 */

/**
 * CORS CONFIGURATION
 *
 * Allow requests from other domains:
 *
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const response = NextResponse.json({ data })
 *
 *   response.headers.set('Access-Control-Allow-Origin', '*')
 *   response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
 *
 *   return response
 * }
 * ```
 */
