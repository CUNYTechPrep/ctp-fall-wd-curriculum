/**
 * REF: todo-id-api-header
 *
 * # Individual Todo API Route - Dynamic Route Parameter
 *
 * Server-side API endpoint for managing a specific todo by ID.
 *
 * ## Features
 *
 * - **Dynamic route segments** - URLs like `/api/todos/123`
 * - **RESTful API design** - Standard CRUD operations
 * - **Authorization checks** - Verify user owns the todo
 * - **Partial updates** - PATCH for efficient updates
 *
 * ## API Endpoints
 *
 * - **GET /api/todos/[id]** - Get specific todo
 * - **PATCH /api/todos/[id]** - Update todo (partial)
 * - **DELETE /api/todos/[id]** - Delete todo
 *
 * ## Route Parameter Access
 *
 * File: `app/api/todos/[id]/route.ts`
 * URL: `/api/todos/123` → `params.id = '123'`
 *
 * The `[id]` bracket syntax creates a dynamic segment in Next.js.
 *
 */
// CLOSE: todo-id-api-header

/**
 * REF: todo-id-get-handler
 *
 * ## GET - Fetch Specific Todo
 *
 * Retrieve a single todo by ID.
 *
 * ### Request
 *
 * ```
 * GET /api/todos/123
 * Authorization: Bearer <session_token>
 * ```
 *
 * ### Response Success (200)
 *
 * ```json
 * {
 *   "todo": {
 *     "id": "123",
 *     "user_id": "user-456",
 *     "title": "Buy groceries",
 *     "description": "Milk, eggs, bread",
 *     "completed": false,
 *     "is_public": false,
 *     "tags": ["shopping"],
 *     "created_at": "2024-01-15T10:30:00Z",
 *     "updated_at": "2024-01-15T10:30:00Z"
 *   }
 * }
 * ```
 *
 * ### Response Errors
 *
 * | Status | Error | Meaning |
 * |--------|-------|---------|
 * | 401 | "Unauthorized" | User not authenticated |
 * | 403 | "Forbidden" | User doesn't own this todo and it's not public |
 * | 404 | "Todo not found" | Todo with this ID doesn't exist |
 * | 500 | "Failed to fetch todo" | Database query error |
 * | 500 | "Internal server error" | Unexpected server error |
 *
 * ### Flow
 *
 * 1. Create server-side Supabase client
 * 2. Verify user is authenticated (return 401)
 * 3. Extract todo ID from route params
 * 4. Query database for todo by ID
 * 5. Check if todo exists (return 404 if not)
 * 6. Verify user owns todo OR todo is public (return 403 if not)
 * 7. Return todo as JSON
 *
 * ### Authorization Logic
 *
 * User can view todo if:
 * - User owns the todo (user_id matches), OR
 * - Todo is marked as public
 *
 * This allows viewing public todos without authentication!
 *
 * ```typescript
 * if (todo.user_id !== user.id && !todo.is_public) {
 *   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
 * }
 * ```
 *
 */
// CLOSE: todo-id-get-handler

/**
 * REF: todo-id-patch-handler
 *
 * ## PATCH - Update Todo
 *
 * Partially update a todo (send only changed fields).
 *
 * ### Request
 *
 * ```
 * PATCH /api/todos/123
 * Content-Type: application/json
 * Authorization: Bearer <session_token>
 *
 * {
 *   "title": "Buy groceries and supplies",
 *   "completed": true
 * }
 * ```
 *
 * Only changed fields need to be sent!
 *
 * ### Request Body (All Optional)
 *
 * | Field | Type | Max Length | Description |
 * |-------|------|------------|-------------|
 * | `title` | string | 500 chars | Update todo title |
 * | `description` | string | - | Update description |
 * | `completed` | boolean | - | Mark as done/undone |
 * | `isPublic` | boolean | - | Change visibility |
 * | `tags` | string[] | - | Update tags |
 *
 * ### Response Success (200)
 *
 * ```json
 * {
 *   "todo": {
 *     "id": "123",
 *     "user_id": "user-456",
 *     "title": "Buy groceries and supplies",
 *     "description": "Milk, eggs, bread",
 *     "completed": true,
 *     "is_public": false,
 *     "tags": ["shopping"],
 *     "created_at": "2024-01-15T10:30:00Z",
 *     "updated_at": "2024-01-15T11:45:00Z"
 *   }
 * }
 * ```
 *
 * ### Response Errors
 *
 * | Status | Error | Meaning |
 * |--------|-------|---------|
 * | 400 | "Title cannot be empty" | Title provided but empty |
 * | 400 | "Title too long" | Title exceeds 500 characters |
 * | 401 | "Unauthorized" | User not authenticated |
 * | 404 | "Todo not found or unauthorized" | Todo doesn't exist or not owner |
 * | 500 | "Failed to update todo" | Database update error |
 * | 500 | "Internal server error" | Unexpected server error |
 *
 * ### Flow
 *
 * 1. Create server-side Supabase client
 * 2. Verify user is authenticated
 * 3. Parse JSON request body
 * 4. Build updates object with only provided fields
 * 5. Set updated_at timestamp
 * 6. Validate title if provided
 * 7. Update todo (RLS ensures ownership)
 * 8. Return updated todo
 *
 * ### PATCH vs PUT
 *
 * | Aspect | PATCH | PUT |
 * |--------|-------|-----|
 * | Intent | Partial update | Full replacement |
 * | Fields | Only changed fields | All fields required |
 * | Efficiency | More efficient | More data transferred |
 * | Use case | Most updates | Full data replacement |
 *
 * This route uses PATCH for efficiency!
 *
 * ### Field Validation
 *
 * ```typescript
 * // Only update if provided
 * if (title !== undefined) {
 *   if (title.length === 0) return error
 *   if (title.length > 500) return error
 *   updates.title = title.trim()
 * }
 * ```
 *
 * ### Ownership Check
 *
 * Update only if user owns todo:
 * ```typescript
 * .eq('user_id', user.id) // Explicit ownership check
 * ```
 *
 */
// CLOSE: todo-id-patch-handler

/**
 * REF: todo-id-delete-handler
 *
 * ## DELETE - Remove Todo
 *
 * Delete a todo permanently.
 *
 * ### Request
 *
 * ```
 * DELETE /api/todos/123
 * Authorization: Bearer <session_token>
 * ```
 *
 * ### Response Success (200)
 *
 * ```json
 * {
 *   "message": "Todo deleted successfully"
 * }
 * ```
 *
 * ### Response Errors
 *
 * | Status | Error | Meaning |
 * |--------|-------|---------|
 * | 401 | "Unauthorized" | User not authenticated |
 * | 500 | "Failed to delete todo" | Database deletion error |
 * | 500 | "Internal server error" | Unexpected server error |
 *
 * ### Flow
 *
 * 1. Create server-side Supabase client
 * 2. Verify user is authenticated
 * 3. Extract todo ID from route params
 * 4. Delete todo (RLS ensures ownership)
 * 5. Return success message
 *
 * ### Cascade Delete
 *
 * If your database has cascade delete configured:
 * - Associated attachments are deleted automatically
 * - Related records are cleaned up
 *
 * BUT: You must manually delete files from Storage!
 *
 * ```typescript
 * // Before deleting todo, delete files
 * const { data: attachments } = await supabase
 *   .from('todo_attachments')
 *   .select('file_url')
 *   .eq('todo_id', params.id)
 *
 * for (const attachment of attachments || []) {
 *   await supabase.storage
 *     .from('uploads')
 *     .remove([attachment.file_url])
 * }
 *
 * // Now delete todo (and related DB records via cascade)
 * await supabase
 *   .from('todos')
 *   .delete()
 *   .eq('id', params.id)
 * ```
 *
 * ### Soft Delete Alternative
 *
 * Instead of permanent deletion, mark as deleted:
 *
 * ```typescript
 * // Soft delete - add deleted_at timestamp
 * const { data: todo } = await supabase
 *   .from('todos')
 *   .update({ deleted_at: new Date().toISOString() })
 *   .eq('id', params.id)
 *   .eq('user_id', user.id)
 *   .select()
 *   .single()
 * ```
 *
 */
// CLOSE: todo-id-delete-handler

/**
 * REF: todo-id-client-usage
 *
 * ## Client-Side Usage
 *
 * ### Fetch Todo
 *
 * ```typescript
 * async function getTodo(id: string) {
 *   const response = await fetch(`/api/todos/${id}`)
 *
 *   if (!response.ok) {
 *     if (response.status === 404) {
 *       throw new Error('Todo not found')
 *     }
 *     throw new Error('Failed to fetch')
 *   }
 *
 *   const { todo } = await response.json()
 *   return todo
 * }
 * ```
 *
 * ### Update Todo
 *
 * ```typescript
 * async function updateTodo(id: string, updates: Partial<Todo>) {
 *   const response = await fetch(`/api/todos/${id}`, {
 *     method: 'PATCH',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(updates)
 *   })
 *
 *   if (!response.ok) {
 *     const { error } = await response.json()
 *     throw new Error(error)
 *   }
 *
 *   const { todo } = await response.json()
 *   return todo
 * }
 * ```
 *
 * ### Delete Todo
 *
 * ```typescript
 * async function deleteTodo(id: string) {
 *   const response = await fetch(`/api/todos/${id}`, {
 *     method: 'DELETE'
 *   })
 *
 *   if (!response.ok) {
 *     throw new Error('Failed to delete')
 *   }
 * }
 * ```
 *
 * ### Complete Example
 *
 * ```typescript
 * // Get todo
 * const todo = await getTodo('123')
 *
 * // Update completion status
 * await updateTodo('123', { completed: true })
 *
 * // Delete when done
 * await deleteTodo('123')
 * ```
 *
 */
// CLOSE: todo-id-client-usage

/**
 * REF: testing-api
 *
 * ## Testing API Routes
 *
 * ### Using curl
 *
 * ```bash
 * # GET
 * curl http://localhost:3000/api/todos/123
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
 * ### Using Postman
 *
 * 1. Create request with method (GET/PATCH/DELETE)
 * 2. Set URL: `http://localhost:3000/api/todos/123`
 * 3. For PATCH: Set body to JSON with updates
 * 4. Click Send
 *
 * ### Using Thunder Client (VS Code)
 *
 * Install extension → Create request → Test
 *
 * ### Using Insomnia
 *
 * Similar to Postman - free alternative
 *
 */
// CLOSE: testing-api

/**
 * REF: error-codes
 *
 * ## Supabase Error Codes
 *
 * ### Database Errors
 *
 * | Error Code | Meaning | Common Cause |
 * |------------|---------|--------------|
 * | `PGRST116` | No rows returned | `.single()` found 0 results |
 * | `42P01` | Table doesn't exist | Table name typo |
 * | `23505` | Unique constraint violation | Duplicate entry |
 * | `23502` | NOT NULL constraint violation | Missing required field |
 *
 * ### Handling 404 Errors
 *
 * ```typescript
 * const { data, error } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .eq('id', params.id)
 *   .single() // Expects exactly one result
 *
 * if (error?.code === 'PGRST116') {
 *   // No rows found - return 404
 *   return NextResponse.json(
 *     { error: 'Todo not found' },
 *     { status: 404 }
 *   )
 * }
 * ```
 *
 */
// CLOSE: error-codes

/**
 * REF: rate-limiting
 *
 * ## Rate Limiting (Production)
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
 * export async function DELETE(request: NextRequest) {
 *   const { data: { user } } = await supabase.auth.getUser()
 *
 *   // Check rate limit
 *   const { success } = await ratelimit.limit(user.id)
 *
 *   if (!success) {
 *     return NextResponse.json(
 *       { error: 'Too many requests' },
 *       { status: 429 }
 *     )
 *   }
 *
 *   // Continue with delete...
 * }
 * ```
 *
 * ### Setup
 *
 * 1. Install: `npm install @upstash/ratelimit @upstash/redis`
 * 2. Create Upstash Redis database
 * 3. Add env variables to `.env.local`
 * 4. Use rate limiting in API routes
 *
 */
// CLOSE: rate-limiting

/**
 * REF: cors
 *
 * ## CORS Configuration
 *
 * Allow requests from other domains:
 *
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const response = NextResponse.json({ todo })
 *
 *   response.headers.set('Access-Control-Allow-Origin', '*')
 *   response.headers.set(
 *     'Access-Control-Allow-Methods',
 *     'GET, POST, PUT, PATCH, DELETE'
 *   )
 *   response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
 *
 *   return response
 * }
 * ```
 *
 * ### Restrict to Specific Domain
 *
 * ```typescript
 * const origin = request.headers.get('origin')
 * const allowedOrigins = ['https://example.com', 'https://app.example.com']
 *
 * if (allowedOrigins.includes(origin)) {
 *   response.headers.set('Access-Control-Allow-Origin', origin)
 * }
 * ```
 *
 * ### Preflight Requests
 *
 * ```typescript
 * export async function OPTIONS(request: NextRequest) {
 *   return new NextResponse(null, {
 *     status: 200,
 *     headers: {
 *       'Access-Control-Allow-Origin': '*',
 *       'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
 *       'Access-Control-Allow-Headers': 'Content-Type',
 *     }
 *   })
 * }
 * ```
 *
 */
// CLOSE: cors
