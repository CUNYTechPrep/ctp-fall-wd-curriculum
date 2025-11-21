/**
 * REF: todos-api-header
 *
 * # Todos API Route - Server-Side Endpoint
 *
 * Server-side API endpoint for managing todos collection.
 *
 * ## Features
 *
 * - **Server-side Supabase queries** - Secure database access
 * - **RESTful API design** - Standard GET, POST methods
 * - **Authentication enforcement** - User verification required
 * - **Request validation** - Server-side data validation
 *
 * ## When to Use API Routes vs Direct Client Queries
 *
 * ### Use API Routes For:
 * - Operations requiring service role key
 * - Complex multi-step operations
 * - Calling external APIs
 * - Custom validation logic
 * - Server-side rate limiting
 * - Sensitive operations (payments, admin actions)
 *
 * ### Use Direct Client Queries For:
 * - Simple CRUD operations
 * - When RLS is sufficient for security
 * - Real-time updates needed
 * - Faster performance (no server round-trip)
 *
 * ## API Endpoints
 *
 * - **GET /api/todos** - List authenticated user's todos
 * - **POST /api/todos** - Create new todo
 *
 */
// CLOSE: todos-api-header

/**
 * REF: todos-get-handler
 *
 * ## GET - Fetch Todos
 *
 * Retrieve all todos for the authenticated user.
 *
 * ### Request
 *
 * ```
 * GET /api/todos
 * Authorization: Bearer <session_token>
 * ```
 *
 * ### Response Success (200)
 *
 * ```json
 * {
 *   "todos": [
 *     {
 *       "id": "123",
 *       "user_id": "user-456",
 *       "title": "Buy groceries",
 *       "description": "Milk, eggs, bread",
 *       "completed": false,
 *       "is_public": false,
 *       "tags": ["shopping"],
 *       "created_at": "2024-01-15T10:30:00Z",
 *       "updated_at": "2024-01-15T10:30:00Z"
 *     },
 *     {
 *       "id": "124",
 *       "user_id": "user-456",
 *       "title": "Complete project",
 *       "description": null,
 *       "completed": true,
 *       "is_public": true,
 *       "tags": ["work"],
 *       "created_at": "2024-01-14T14:20:00Z",
 *       "updated_at": "2024-01-15T09:00:00Z"
 *     }
 *   ]
 * }
 * ```
 *
 * ### Response Errors
 *
 * | Status | Error | Meaning |
 * |--------|-------|---------|
 * | 401 | "Unauthorized" | User not authenticated or session expired |
 * | 500 | "Failed to fetch todos" | Database query error |
 * | 500 | "Internal server error" | Unexpected server error |
 *
 * ### Flow
 *
 * 1. Create server-side Supabase client
 * 2. Verify user is authenticated
 * 3. Query todos table filtered by user_id
 * 4. Order by creation date (newest first)
 * 5. Return todos as JSON
 *
 * ### Authentication
 *
 * - Required: User must be signed in
 * - Returns 401 Unauthorized if not authenticated
 * - Session read from HTTP-only cookies automatically
 * - RLS (Row Level Security) enforced at database level
 *
 * ### Database Security
 *
 * Even with anon key, RLS enforces:
 * - Users can only query their own todos
 * - Database-level security (not dependent on API)
 * - Query includes explicit `.eq('user_id', user.id)`
 *
 */
// CLOSE: todos-get-handler

/**
 * REF: todos-post-handler
 *
 * ## POST - Create Todo
 *
 * Create a new todo for the authenticated user.
 *
 * ### Request
 *
 * ```
 * POST /api/todos
 * Content-Type: application/json
 * Authorization: Bearer <session_token>
 *
 * {
 *   "title": "Buy groceries",
 *   "description": "Milk, eggs, bread",
 *   "isPublic": false,
 *   "tags": ["shopping"]
 * }
 * ```
 *
 * ### Request Body
 *
 * | Field | Type | Required | Max Length | Description |
 * |-------|------|----------|------------|-------------|
 * | `title` | string | Yes | 500 chars | Todo title/name |
 * | `description` | string | No | - | Detailed description |
 * | `isPublic` | boolean | No | - | Share with other users |
 * | `tags` | string[] | No | - | Tag labels |
 *
 * ### Response Success (201)
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
 * | 400 | "Title is required" | Missing or empty title |
 * | 400 | "Title too long (max 500 characters)" | Title exceeds 500 chars |
 * | 401 | "Unauthorized" | User not authenticated |
 * | 500 | "Failed to create todo" | Database insertion error |
 * | 500 | "Internal server error" | Unexpected server error |
 *
 * ### Flow
 *
 * 1. Create server-side Supabase client
 * 2. Verify user is authenticated
 * 3. Parse JSON request body
 * 4. Validate title (required, non-empty, max 500 chars)
 * 5. Prepare insert object with sanitized data
 * 6. Set user_id server-side (prevents spoofing)
 * 7. Insert into todos table
 * 8. Return created todo with 201 status
 *
 * ### Validation
 *
 * Server-side validation prevents bad data:
 * - Title required and not empty
 * - Title max 500 characters
 * - User ID set on server (can't be spoofed!)
 * - Whitespace trimmed
 * - Defaults applied (completed: false, is_public: false)
 *
 * ### Best Practices
 *
 * - Client validation is UX (instant feedback)
 * - Server validation is security (always needed!)
 * - Never trust client-provided user_id
 * - Always return sanitized data to client
 *
 */
// CLOSE: todos-post-handler

/**
 * REF: todos-client-usage
 *
 * ## Client-Side Usage
 *
 * ### Fetch All Todos
 *
 * ```typescript
 * async function getTodos() {
 *   const response = await fetch('/api/todos')
 *
 *   if (!response.ok) {
 *     throw new Error('Failed to fetch todos')
 *   }
 *
 *   const { todos } = await response.json()
 *   return todos
 * }
 * ```
 *
 * ### Create New Todo
 *
 * ```typescript
 * async function createTodo(title: string, description?: string) {
 *   const response = await fetch('/api/todos', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       title,
 *       description,
 *       isPublic: false
 *     })
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
 * ### Error Handling
 *
 * ```typescript
 * try {
 *   const todo = await createTodo('New task')
 *   console.log('Created:', todo)
 * } catch (error) {
 *   console.error('Error:', error.message)
 *   // Show user-friendly message
 * }
 * ```
 *
 */
// CLOSE: todos-client-usage

/**
 * REF: api-patterns
 *
 * ## API Route Patterns
 *
 * ### Supported HTTP Methods
 *
 * Next.js App Router supports:
 *
 * ```typescript
 * // GET - Fetch data
 * export async function GET(request: NextRequest) { }
 *
 * // POST - Create data
 * export async function POST(request: NextRequest) { }
 *
 * // PUT - Replace data
 * export async function PUT(request: NextRequest) { }
 *
 * // PATCH - Partial update
 * export async function PATCH(request: NextRequest) { }
 *
 * // DELETE - Remove data
 * export async function DELETE(request: NextRequest) { }
 * ```
 *
 * ### Dynamic Routes
 *
 * File structure:
 * ```
 * app/api/todos/[id]/route.ts
 * ```
 *
 * Access route parameter:
 * ```typescript
 * export async function GET(
 *   request: NextRequest,
 *   { params }: { params: { id: string } }
 * ) {
 *   const todoId = params.id
 * }
 * ```
 *
 */
// CLOSE: api-patterns

/**
 * REF: response-helpers
 *
 * ## Response Helpers
 *
 * ### JSON Responses
 *
 * ```typescript
 * // Basic JSON
 * return NextResponse.json({ data })
 *
 * // With status code
 * return NextResponse.json({ error }, { status: 400 })
 *
 * // With custom headers
 * return NextResponse.json({ data }, {
 *   status: 200,
 *   headers: {
 *     'Cache-Control': 'no-store',
 *     'X-Custom-Header': 'value'
 *   }
 * })
 *
 * // Redirect
 * return NextResponse.redirect(new URL('/dashboard', request.url))
 * ```
 *
 * ### Status Codes
 *
 * | Code | Meaning | Usage |
 * |------|---------|-------|
 * | 200 | OK | Successful GET, successful response |
 * | 201 | Created | Successful POST that created resource |
 * | 400 | Bad Request | Invalid input or validation error |
 * | 401 | Unauthorized | User not authenticated |
 * | 403 | Forbidden | User authenticated but not authorized |
 * | 404 | Not Found | Resource doesn't exist |
 * | 500 | Server Error | Unexpected server error |
 *
 */
// CLOSE: response-helpers

/**
 * REF: request-helpers
 *
 * ## Request Helpers
 *
 * ### Parse Request Data
 *
 * ```typescript
 * // Query parameters
 * const searchParams = request.nextUrl.searchParams
 * const query = searchParams.get('q')
 *
 * // Request headers
 * const authHeader = request.headers.get('authorization')
 * const contentType = request.headers.get('content-type')
 *
 * // Cookies
 * const token = request.cookies.get('token')?.value
 *
 * // JSON body
 * const body = await request.json()
 *
 * // Form data
 * const formData = await request.formData()
 * const file = formData.get('file') as File
 * ```
 *
 */
// CLOSE: request-helpers

/**
 * REF: error-handling
 *
 * ## Error Handling Best Practices
 *
 * ### Try-Catch Pattern
 *
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   try {
 *     // Your logic
 *     const data = await supabase.from('todos').select('*')
 *     return NextResponse.json({ data })
 *   } catch (error) {
 *     // Log error (server-side only)
 *     console.error('API error:', error)
 *
 *     // Return user-friendly message
 *     return NextResponse.json(
 *       { error: 'Something went wrong' },
 *       { status: 500 }
 *     )
 *   }
 * }
 * ```
 *
 * ### Never Expose Sensitive Information
 *
 * Bad:
 * ```typescript
 * return NextResponse.json(
 *   { error: error.message }, // Exposes internal details!
 *   { status: 500 }
 * )
 * ```
 *
 * Good:
 * ```typescript
 * console.error(error) // Log on server
 * return NextResponse.json(
 *   { error: 'Failed to process request' }, // User-friendly
 *   { status: 500 }
 * )
 * ```
 *
 * ### Never Expose
 *
 * - Database error details
 * - Stack traces
 * - Internal file paths
 * - API credentials
 * - Private user data
 *
 */
// CLOSE: error-handling

/**
 * REF: service-role-key
 *
 * ## Using Service Role Key (Advanced)
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
 * // This bypasses RLS - gets ALL todos
 * const { data } = await supabaseAdmin
 *   .from('todos')
 *   .select('*')
 * ```
 *
 * ### Security Warning
 *
 * - Only use service role in API routes (never client-side!)
 * - Service role bypasses all RLS policies
 * - Must add your own authorization logic
 * - Be very careful - full database access!
 *
 * ### When to Use
 *
 * - Admin dashboard operations
 * - Bulk data migrations
 * - Scheduled cleanup jobs
 * - Sending emails (accessing all user data)
 *
 */
// CLOSE: service-role-key
