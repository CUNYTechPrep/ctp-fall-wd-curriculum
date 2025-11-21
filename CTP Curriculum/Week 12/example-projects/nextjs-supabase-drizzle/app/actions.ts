/**
 * REF: file-header
 *
 * # Server Actions - Type-Safe Mutations with Drizzle
 *
 * This file contains Next.js Server Actions that handle database mutations using
 * Drizzle ORM for perfect type safety.
 *
 * ## What Are Server Actions?
 * Server Actions are async functions that run on the server and can be called from
 * Client Components. They provide a simple way to handle data mutations without
 * creating API routes.
 *
 * ## Benefits
 * - No API routes needed
 * - Automatic request deduplication
 * - Built-in CSRF protection
 * - Progressive enhancement support
 * - Type-safe with Drizzle ORM
 * - Can be called directly from forms or event handlers
 */
// CLOSE: file-header

/**
 * REF: use-server-directive
 *
 * ## 'use server' Directive
 *
 * ## Purpose
 * Marks this file as server-only, making all exported functions Server Actions.
 *
 * ### What It Does
 * - Ensures code only runs on server (never in browser)
 * - Enables form action binding
 * - Enables RPC-style calls from client
 * - Provides automatic CSRF protection
 * - Makes functions serializable for client consumption
 *
 * ### Server Actions Features
 * - Can be called from Client Components
 * - Run on server with full backend access
 * - Return serializable data only (no functions, classes, etc.)
 * - Support progressive enhancement (work without JavaScript)
 * - Automatically handle request/response serialization
 *
 * ### Security
 * - Functions are exposed endpoints
 * - Always validate input
 * - Always check authentication
 * - Don't trust client data
 */
'use server'
// CLOSE: use-server-directive

/**
 * REF: database-imports
 *
 * ## Drizzle Database Imports
 *
 * ## Database Client
 * The main Drizzle database connection for executing queries.
 *
 * ### db Object
 * - Type-safe query builder
 * - Direct PostgreSQL connection
 * - Returns typed results based on schema
 * - Main interface for all database operations
 *
 * ## Schema Definition
 * The todos table schema that provides structure for queries.
 *
 * ### todos Schema
 * - Defines table structure
 * - Provides column types and constraints
 * - Used in queries like: `db.select().from(todos)`
 * - Source of type inference for results
 */
import { db } from '@/lib/db/client'
import { todos } from '@/lib/db/schema'
// CLOSE: database-imports

/**
 * REF: drizzle-operators
 *
 * ## Drizzle ORM Query Operators
 *
 * ## Equality Operator (eq)
 * Used for WHERE clause equality comparisons.
 *
 * ### Usage
 * ```typescript
 * where(eq(todos.id, todoId))
 * // Generates: WHERE id = $1
 * ```
 *
 * ### Other Available Operators
 * - `ne()` - Not equal (!=)
 * - `gt()`, `gte()` - Greater than (or equal)
 * - `lt()`, `lte()` - Less than (or equal)
 * - `and()`, `or()` - Logical operators
 * - `like()`, `ilike()` - Pattern matching
 * - `inArray()` - IN clause
 * - `notInArray()` - NOT IN clause
 * - `isNull()`, `isNotNull()` - NULL checks
 *
 * ### Type Safety
 * All operators are type-checked:
 * - Column types must match value types
 * - Invalid columns cause compile errors
 * - Autocomplete suggests valid columns
 */
import { eq } from 'drizzle-orm'
// CLOSE: drizzle-operators

/**
 * REF: cache-revalidation
 *
 * ## Next.js Cache Revalidation
 *
 * ## revalidatePath Function
 * Clears cached data for a specific page after mutations.
 *
 * ### How Next.js Caching Works
 * 1. Next.js caches Server Component renders
 * 2. After data mutations, cache becomes stale
 * 3. `revalidatePath('/path')` clears that page's cache
 * 4. Next render fetches fresh data
 *
 * ### Usage Pattern
 * ```typescript
 * await db.insert(todos).values({...})
 * revalidatePath('/dashboard')  // Dashboard will refetch todos
 * ```
 *
 * ### When to Use
 * - After creating new data
 * - After updating existing data
 * - After deleting data
 * - When data changes affect specific pages
 *
 * ### Alternatives
 * - `revalidateTag('tag-name')` - Revalidate by cache tag
 * - `revalidatePath('/path', 'layout')` - Revalidate layout
 * - `revalidatePath('/path', 'page')` - Revalidate page only
 */
import { revalidatePath } from 'next/cache'
// CLOSE: cache-revalidation

/**
 * REF: supabase-server-imports
 *
 * ## Supabase Server Client
 *
 * ## Server-Side Supabase Client
 * Creates Supabase client that works with server-side cookies.
 *
 * ### Why Server Client?
 * - Can access HTTP-only cookies (more secure than localStorage)
 * - Gets user session from request cookies
 * - Used in Server Components and Server Actions
 * - Different from browser Supabase client
 *
 * ### Cookie-Based Auth
 * - Reads auth token from cookies
 * - More secure than localStorage
 * - Works with Server Components
 * - Validates JWT server-side
 *
 * ### When to Use
 * - Server Actions (like this file)
 * - Server Components
 * - API Routes
 * - Middleware
 */
import { createClient } from '@/lib/supabase/server'
// CLOSE: supabase-server-imports

/**
 * REF: redirect-import
 *
 * ## Next.js Server-Side Redirect
 *
 * ## redirect Function
 * Performs server-side navigation to different routes.
 *
 * ### How It Works
 * - Throws a special error that Next.js catches
 * - Performs 307 Temporary Redirect
 * - Only works in Server Components and Server Actions
 * - Cannot be used in Client Components
 *
 * ### Usage
 * ```typescript
 * if (!user) {
 *   redirect('/signin')  // Navigates to sign in page
 * }
 * ```
 *
 * ### When to Use
 * - Redirect unauthenticated users
 * - After successful mutations
 * - When access is denied
 * - For route guards
 *
 * ### Alternative
 * Use `router.push()` for client-side redirects in Client Components
 */
import { redirect } from 'next/navigation'
// CLOSE: redirect-import

/**
 * REF: create-todo-action
 *
 * ## Create Todo Server Action
 *
 * ## Purpose
 * Server Action that creates a new todo in the database with full type safety.
 *
 * ## Function Signature
 * ```typescript
 * async function createTodoAction(formData: FormData): Promise<
 *   { success: true; todo: Todo } | { error: string }
 * >
 * ```
 *
 * ## Parameters
 * - `formData` - FormData object from form submission
 *
 * ## Expected FormData Fields
 * - `title` (string, required) - Todo title
 * - `description` (string, optional) - Todo description
 * - `isPublic` (checkbox) - "on" if checked, undefined otherwise
 *
 * ## Return Types
 * Success: `{ success: true, todo: TodoObject }`
 * Error: `{ error: string }`
 *
 * ## Usage Examples
 *
 * ### Direct Form Action (Progressive Enhancement)
 * ```typescript
 * <form action={createTodoAction}>
 *   <input name="title" required />
 *   <textarea name="description" />
 *   <input type="checkbox" name="isPublic" />
 *   <button type="submit">Create</button>
 * </form>
 * ```
 *
 * ### With useTransition for Pending States
 * ```typescript
 * const [isPending, startTransition] = useTransition()
 *
 * <form action={(formData) => {
 *   startTransition(async () => {
 *     const result = await createTodoAction(formData)
 *     if (result.error) {
 *       alert(result.error)
 *     } else {
 *       console.log('Created:', result.todo)
 *     }
 *   })
 * }}>
 * ```
 *
 * ### With useActionState for Form State
 * ```typescript
 * const [state, formAction] = useActionState(createTodoAction, null)
 *
 * <form action={formAction}>
 *   {state?.error && <div>{state.error}</div>}
 * </form>
 * ```
 */
export async function createTodoAction(formData: FormData) {
  try {
    /**
     * REF: auth-check
     *
     * # Authentication Verification
     *
     * ## Pattern
     * Check user authentication before processing the request.
     *
     * ### Steps
     * 1. Create server-side Supabase client
     * 2. Get current user from auth cookie
     * 3. Redirect to sign in if not authenticated
     *
     * ### How It Works
     * - `createClient()` creates cookie-aware client
     * - `getUser()` validates JWT from cookie
     * - Returns user object if valid session
     * - Returns null if no valid session
     *
     * ### Security
     * - Always check auth in Server Actions
     * - Never trust client to be authenticated
     * - Validate on every request
     *
     * ### Why Redirect?
     * - Better UX than error message
     * - redirect() throws, so execution stops
     * - User sent to sign in page
     */
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/signin')
    }
    // CLOSE: auth-check

    /**
     * REF: form-data-extraction
     *
     * # Extract Data from FormData
     *
     * ## FormData API
     * Extract values from the submitted form.
     *
     * ### Field Extraction
     * - `.get(name)` returns FormDataEntryValue | null
     * - Can be string or File object
     * - Type assertion needed for TypeScript
     *
     * ### Checkbox Handling
     * - Checked checkboxes send value "on"
     * - Unchecked checkboxes don't send anything
     * - Test with `=== 'on'` for boolean
     *
     * ### Type Assertions
     * ```typescript
     * const title = formData.get('title') as string
     * // Type: FormDataEntryValue | null => string
     * ```
     *
     * ### Alternative: Zod Validation
     * ```typescript
     * import { z } from 'zod'
     *
     * const schema = z.object({
     *   title: z.string().min(1),
     *   description: z.string().optional(),
     *   isPublic: z.boolean(),
     * })
     *
     * const parsed = schema.parse(Object.fromEntries(formData))
     * ```
     */
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const isPublic = formData.get('isPublic') === 'on'
    // CLOSE: form-data-extraction

    /**
     * REF: input-validation
     *
     * # Validate User Input
     *
     * ## Title Validation
     * Ensure title exists and isn't empty after trimming.
     *
     * ### Validation Logic
     * - `title?.trim()` safely handles null/undefined
     * - Empty strings become falsy after trim
     * - Early return with error object
     *
     * ### Why Validate?
     * - Client-side validation can be bypassed
     * - Always validate on server
     * - Provide clear error messages
     * - Prevent invalid data in database
     *
     * ### Additional Validations to Consider
     * - Maximum length limits
     * - Character restrictions
     * - Format validation (email, URL, etc.)
     * - XSS sanitization (if not using parameterized queries)
     * - SQL injection prevention (Drizzle handles this)
     */
    if (!title?.trim()) {
      return { error: 'Title is required' }
    }
    // CLOSE: input-validation

    /**
     * REF: drizzle-insert
     *
     * # Drizzle Insert Operation
     *
     * ## Type-Safe Database Insert
     * Create a new todo record with full type checking.
     *
     * ### Query Methods
     * - `db.insert(todos)` - Insert into todos table
     * - `.values({...})` - Provide row data with type checking
     * - `.returning()` - Return the inserted row
     *
     * ### Type Safety Examples
     * ```typescript
     * // ✅ Valid
     * await db.insert(todos).values({
     *   userId: 'uuid-string',
     *   title: 'My Todo',
     *   completed: false,
     * })
     *
     * // ❌ Type errors caught at compile time
     * await db.insert(todos).values({
     *   userId: 123,              // Error: Expected string
     *   invalidField: 'test',     // Error: Unknown field
     *   title: undefined,         // Error: Title required
     * })
     * ```
     *
     * ### Returning Clause
     * - `.returning()` returns inserted row(s)
     * - Destructure `[todo]` to get first element
     * - Fully typed as Todo from schema
     * - Includes auto-generated fields (id, createdAt)
     *
     * ### Field Mapping
     * - `userId` - From Supabase auth user
     * - `title` - Trimmed user input
     * - `description` - Trimmed or null if empty
     * - `isPublic` - Boolean from checkbox
     * - `completed` - Default false for new todos
     * - `tags` - Default null (could accept from form)
     */
    const [todo] = await db
      .insert(todos)
      .values({
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        isPublic,
        completed: false,
        tags: null,
      })
      .returning()
    // CLOSE: drizzle-insert

    /**
     * REF: cache-invalidation
     *
     * # Cache Revalidation After Mutation
     *
     * ## Clear Stale Cache
     * Invalidate cached dashboard data since a new todo was created.
     *
     * ### Why Needed?
     * - Next.js caches Server Component renders
     * - Dashboard was rendered with old todo list
     * - This clears that cached render
     * - Next visit fetches fresh data with new todo
     *
     * ### Revalidation Strategy
     * - Revalidate specific paths that display this data
     * - Immediate consistency for user
     * - No stale data shown
     *
     * ### Multiple Path Revalidation
     * ```typescript
     * revalidatePath('/dashboard')  // User's dashboard
     * revalidatePath('/feed')       // Public feed (if todo is public)
     * ```
     *
     * ### Alternative: Cache Tags
     * ```typescript
     * revalidateTag('todos')        // All pages tagged with 'todos'
     * ```
     */
    revalidatePath('/dashboard')
    // CLOSE: cache-invalidation

    /**
     * REF: success-response
     *
     * # Return Success Result
     *
     * ## Discriminated Union Return Type
     * Return success object with created todo.
     *
     * ### Return Shape
     * ```typescript
     * {
     *   success: true,
     *   todo: { id, title, completed, ... }
     * }
     * ```
     *
     * ### Client Usage
     * ```typescript
     * const result = await createTodoAction(formData)
     *
     * if ('success' in result) {
     *   // TypeScript knows result.todo exists
     *   console.log('Created:', result.todo.id)
     *   setTodos([...todos, result.todo])
     * } else {
     *   // TypeScript knows result.error exists
     *   alert(result.error)
     * }
     * ```
     *
     * ### Why Discriminated Union?
     * - Type-safe error handling
     * - No try-catch needed on client
     * - Clear success/error states
     * - Better than throwing errors
     */
    return { success: true, todo }
    // CLOSE: success-response
  } catch (error: any) {
    /**
     * REF: error-handling
     *
     * # Error Handling
     *
     * ## Catch and Return Errors
     * Handle any unexpected errors gracefully.
     *
     * ### Error Types Caught
     * - Database errors (constraint violations, connection issues)
     * - Network errors
     * - Unexpected exceptions
     *
     * ### Development
     * - Log to console for debugging
     * - Full error details available
     *
     * ### Production Considerations
     * - Don't expose database errors to client
     * - Log with error tracking service (Sentry, LogRocket)
     * - Provide user-friendly messages
     * - Monitor error rates
     *
     * ### Example Error Service
     * ```typescript
     * import * as Sentry from '@sentry/nextjs'
     *
     * Sentry.captureException(error, {
     *   tags: { action: 'createTodo' },
     *   user: { id: user.id }
     * })
     * ```
     */
    console.error('Server Action error:', error)
    return { error: error.message || 'Failed to create todo' }
    // CLOSE: error-handling
  }
}
// CLOSE: create-todo-action

/**
 * REF: update-todo-action
 *
 * ## Update Todo Server Action
 *
 * ## Purpose
 * Server Action that updates an existing todo with type safety.
 *
 * ## Function Signature
 * ```typescript
 * async function updateTodoAction(
 *   todoId: string,
 *   updates: {
 *     title?: string
 *     description?: string | null
 *     completed?: boolean
 *     isPublic?: boolean
 *   }
 * ): Promise<{ success: true; todo: Todo } | { error: string }>
 * ```
 *
 * ## Parameters
 * - `todoId` - ID of todo to update
 * - `updates` - Partial object with fields to change
 *
 * ## Usage Examples
 * ```typescript
 * // Toggle completion
 * await updateTodoAction(todoId, { completed: true })
 *
 * // Update title
 * await updateTodoAction(todoId, { title: 'New Title' })
 *
 * // Update multiple fields
 * await updateTodoAction(todoId, {
 *   title: 'Updated',
 *   description: 'New description',
 *   completed: true,
 * })
 * ```
 *
 * ## Security Consideration
 * Current implementation updates any todo by ID. In production, should verify
 * the todo belongs to the current user.
 *
 * ### Better Security
 * ```typescript
 * .where(and(
 *   eq(todos.id, todoId),
 *   eq(todos.userId, user.id)
 * ))
 * ```
 */
export async function updateTodoAction(
  todoId: string,
  updates: {
    title?: string
    description?: string | null
    completed?: boolean
    isPublic?: boolean
  }
) {
  try {
    /**
     * REF: update-auth-check
     *
     * # Authentication Check for Updates
     *
     * Same pattern as create action - verify user is authenticated.
     *
     * ### Difference from Create
     * - Returns error instead of redirecting
     * - Better UX for updates (user stays on page)
     * - Can show error message inline
     */
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }
    // CLOSE: update-auth-check

    /**
     * REF: drizzle-update
     *
     * # Drizzle Update Operation
     *
     * ## Type-Safe Database Update
     * Update todo with type checking and conditions.
     *
     * ### Query Methods
     * - `db.update(todos)` - Update todos table
     * - `.set({...})` - Fields to update (type-checked)
     * - `.where(eq(...))` - Which row to update
     * - `.returning()` - Return updated row
     *
     * ### Generated SQL
     * ```sql
     * UPDATE todos
     * SET
     *   ...updates,
     *   updated_at = NOW()
     * WHERE id = $1
     * RETURNING *
     * ```
     *
     * ### Type Safety
     * - `updates` parameter is typed
     * - `.set()` validates fields exist in schema
     * - `.where()` ensures id matches table's id type
     * - TypeScript catches typos at compile time
     *
     * ### Security Issue
     * Missing userId check in WHERE clause means any authenticated user
     * can update any todo.
     *
     * ### Better Implementation
     * ```typescript
     * import { and } from 'drizzle-orm'
     *
     * .where(and(
     *   eq(todos.id, todoId),
     *   eq(todos.userId, user.id)
     * ))
     * ```
     */
    const [updated] = await db
      .update(todos)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, todoId))
      .returning()
    // CLOSE: drizzle-update

    /**
     * REF: not-found-check
     *
     * # Check if Todo Exists
     *
     * ## Handle Missing Todos
     * Return error if no todo was updated.
     *
     * ### Why Undefined?
     * - todoId doesn't exist in database
     * - Todo was already deleted
     * - (Would be:) User doesn't own it
     *
     * ### Better Error Messages
     * Could differentiate between:
     * - Not found: "Todo doesn't exist"
     * - Forbidden: "You don't own this todo"
     */
    if (!updated) {
      return { error: 'Todo not found' }
    }
    // CLOSE: not-found-check

    /**
     * REF: update-revalidation
     *
     * # Revalidate After Update
     *
     * ## Clear Dashboard Cache
     * Updates affect dashboard display, so clear cache.
     *
     * ### What Changed?
     * - Completion status
     * - Title or description
     * - Public/private status
     *
     * All of these affect how dashboard displays todos.
     */
    revalidatePath('/dashboard')
    // CLOSE: update-revalidation

    return { success: true, todo: updated }
  } catch (error: any) {
    console.error('Update error:', error)
    return { error: error.message || 'Failed to update' }
  }
}
// CLOSE: update-todo-action

/**
 * REF: delete-todo-action
 *
 * ## Delete Todo Server Action
 *
 * ## Purpose
 * Server Action that permanently deletes a todo.
 *
 * ## Function Signature
 * ```typescript
 * async function deleteTodoAction(
 *   todoId: string
 * ): Promise<{ success: true } | { error: string }>
 * ```
 *
 * ## Parameters
 * - `todoId` - ID of todo to delete
 *
 * ## Usage
 * ```typescript
 * const result = await deleteTodoAction(todoId)
 * if ('error' in result) {
 *   alert('Delete failed: ' + result.error)
 * } else {
 *   // Remove from UI
 *   setTodos(todos.filter(t => t.id !== todoId))
 * }
 * ```
 *
 * ## Security Issue
 * Same as update - missing userId check allows any user to delete any todo.
 */
export async function deleteTodoAction(todoId: string) {
  try {
    /**
     * REF: delete-auth-check
     *
     * # Authentication Check
     * Verify user before allowing deletion.
     */
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }
    // CLOSE: delete-auth-check

    /**
     * REF: drizzle-delete
     *
     * # Drizzle Delete Operation
     *
     * ## Type-Safe Database Delete
     * Remove todo from database.
     *
     * ### Query Methods
     * - `db.delete(todos)` - Delete from todos table
     * - `.where(eq(...))` - Match condition
     *
     * ### Generated SQL
     * ```sql
     * DELETE FROM todos WHERE id = $1
     * ```
     *
     * ### No Returning
     * - Deletes don't typically return data
     * - Could add `.returning()` if needed
     * - Void return indicates success
     *
     * ### Security Issue
     * Missing userId check - should filter by both id AND userId:
     *
     * ```typescript
     * .where(and(
     *   eq(todos.id, todoId),
     *   eq(todos.userId, user.id)
     * ))
     * ```
     */
    await db.delete(todos).where(eq(todos.id, todoId))
    // CLOSE: drizzle-delete

    /**
     * REF: delete-revalidation
     *
     * # Revalidate After Delete
     *
     * Dashboard needs to remove deleted todo from list.
     */
    revalidatePath('/dashboard')
    // CLOSE: delete-revalidation

    return { success: true }
  } catch (error: any) {
    console.error('Delete error:', error)
    return { error: error.message || 'Failed to delete' }
  }
}
// CLOSE: delete-todo-action

/**
 * REF: toggle-completion-action
 *
 * ## Toggle Completion Server Action
 *
 * ## Purpose
 * Convenience wrapper around updateTodoAction for toggling completion status.
 *
 * ## Function Signature
 * ```typescript
 * async function toggleCompletionAction(
 *   todoId: string,
 *   currentCompleted: boolean
 * ): Promise<{ success: true; todo: Todo } | { error: string }>
 * ```
 *
 * ## Simpler API
 * Instead of:
 * ```typescript
 * await updateTodoAction(todoId, { completed: !currentCompleted })
 * ```
 *
 * Use:
 * ```typescript
 * await toggleCompletionAction(todoId, currentCompleted)
 * ```
 *
 * ## Implementation
 * - Delegates to updateTodoAction
 * - Returns same result type
 * - Less code in components
 * - More semantic function name
 */
export async function toggleCompletionAction(todoId: string, currentCompleted: boolean) {
  return updateTodoAction(todoId, { completed: !currentCompleted })
}
// CLOSE: toggle-completion-action

/**
 * REF: type-safety-notes
 *
 * ## Perfect Type Safety with Drizzle
 *
 * ## Compile-Time Validation
 * With Drizzle + Server Actions, all database operations are type-checked.
 *
 * ### Example: Type-Safe Updates
 * ```typescript
 * // In component:
 * const result = await updateTodoAction(id, {
 *   title: 'New title',        // ✅ string
 *   completed: true,            // ✅ boolean
 * })
 *
 * // TypeScript catches errors at compile time:
 * await updateTodoAction(id, {
 *   title: 123,                 // ❌ Error: Expected string
 *   invalidField: 'test',       // ❌ Error: Unknown field
 * })
 * ```
 *
 * ### Benefits
 * - Catch errors before runtime
 * - Autocomplete for all fields
 * - Refactoring is safe
 * - No type casts needed
 * - Database schema drives types
 *
 * ## Better Than API Routes
 * - No manual type definitions
 * - No request/response parsing
 * - Simpler code
 * - Better DX
 */
// CLOSE: type-safety-notes

/**
 * REF: usage-patterns
 *
 * ## Usage in Components
 *
 * ## Form Action Pattern
 * ```tsx
 * import { createTodoAction } from '@/app/actions'
 *
 * <form action={createTodoAction}>
 *   <input name="title" required />
 *   <textarea name="description" />
 *   <button type="submit">Create</button>
 * </form>
 * ```
 *
 * ## useTransition Pattern
 * ```tsx
 * import { useTransition } from 'react'
 *
 * const [isPending, startTransition] = useTransition()
 *
 * const handleSubmit = (formData: FormData) => {
 *   startTransition(async () => {
 *     const result = await createTodoAction(formData)
 *     if (result.error) {
 *       setError(result.error)
 *     } else {
 *       setTodos([...todos, result.todo])
 *     }
 *   })
 * }
 *
 * <form onSubmit={(e) => {
 *   e.preventDefault()
 *   handleSubmit(new FormData(e.currentTarget))
 * }}>
 * ```
 *
 * ## Direct Call Pattern
 * ```tsx
 * const handleToggle = async () => {
 *   const result = await updateTodoAction(todo.id, {
 *     completed: !todo.completed
 *   })
 *
 *   if ('success' in result) {
 *     setTodo(result.todo)
 *   }
 * }
 * ```
 */
// CLOSE: usage-patterns
