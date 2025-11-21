/**
 * REF: server-actions-overview
 *
 * ## Server Actions - Next.js 15 Feature
 *
 * Server-side functions callable directly from client components with type safety.
 * Eliminates need for API routes for internal app operations.
 *
 * ### Server Actions vs API Routes
 *
 * | Aspect | Server Actions | API Routes |
 * |--------|---|---|
 * | Definition | Anywhere in app | `/api` directory |
 * | Calling | Direct function call | `fetch()` + JSON |
 * | Type Safety | Full end-to-end | Manual validation |
 * | Boilerplate | Minimal | More code |
 * | Cache Control | `revalidatePath()` | Manual |
 * | Best For | Internal operations | Public APIs, Webhooks |
 *
 * ### Key Benefits
 *
 * - Simpler than API routes for app-internal operations
 * - Progressive enhancement (works without JavaScript)
 * - Automatic serialization of arguments and return values
 * - Type-safe from client to server
 * - Can revalidate Next.js cache directly
 *
 * // CLOSE: server-actions-overview
 */

'use server'

// REF: Import statement
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
// CLOSE: Import statement

/**
 * REF: create-todo-action
 *
 * ## Create Todo Server Action
 *
 * Server action callable from form or event handler
 *
 * ### Calling Methods
 *
 * | Method | Mechanism | Enhancement |
 * |---|---|---|
 * | Form `action` prop | HTML form submission | Works without JS |
 * | `useTransition` | React hook | Loading state available |
 * | Direct call | Async function | Simplest for simple cases |
 *
 * ### Parameters
 *
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `formData` | `FormData` | Form data from submission |
 *
 * ### Example Usage
 *
 * ```typescript
 * import { createTodo } from './actions'
 *
 * export default function TodoForm() {
 *   return (
 *     <form action={createTodo}>
 *       <input name="title" required />
 *       <input name="description" />
 *       <button type="submit">Create</button>
 *     </form>
 *   )
 * }
 * ```
 *
 * // CLOSE: create-todo-action
 */
// REF: Async function: export
export async function createTodo(formData: FormData) {
  const supabase = await createClient()
// CLOSE: Async function: export

  /**
   * REF: verify-authentication
   *
   * Check user logged in before proceeding. Redirect to signin if not authenticated.
   *
   * // CLOSE: verify-authentication
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
   * REF: extract-form-data
   *
   * ## Extract Form Data
   *
   * Parse FormData into typed values
   *
   * ### FormData Methods
   *
   * | Method | Input | Output | Cast Required |
   * |--------|-------|--------|---------------|
   * | `get()` | `FormData` | `string` \| `File` \| `null` | Yes |
   * | `getAll()` | `FormData` | Array | Yes |
   *
   * FormData.get() returns string or null - cast to string
   *
   * // CLOSE: extract-form-data
   */
// REF: Constant: title
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const isPublic = formData.get('isPublic') === 'on'
// CLOSE: Constant: title

  /**
   * REF: validate-input
   *
   * ## Validate Input
   *
   * Server-side validation is non-negotiable
   *
   * ### Validation Checks
   *
   * | Check | Reason | Status Code |
   * |-------|--------|-------------|
   * | Title exists | Required field | 400 Bad Request |
   * | Length limits | Prevent abuse | 400 Bad Request |
   * | Type validation | Data integrity | 400 Bad Request |
   *
   * Always validate - client can be bypassed
   *
   * // CLOSE: validate-input
   */
// REF: Control flow
  if (!title || title.trim().length === 0) {
    return { error: 'Title is required' }
  }
// CLOSE: Control flow

// REF: Control flow
  if (title.length > 500) {
    return { error: 'Title too long' }
  }
// CLOSE: Control flow

  /**
   * REF: insert-todo
   *
   * Supabase insert with auth field and return.
   * user.id auto-filled from auth - RLS prevents spoofing.
   *
   * // CLOSE: insert-todo
   */
// REF: Constant declaration
  const { data, error } = await supabase
    .from('todos')
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      is_public: isPublic,
      completed: false,
    })
    .select()
    .single()
// CLOSE: Constant declaration

// REF: Control flow
  if (error) {
    console.error('Database error:', error)
    return { error: 'Failed to create todo' }
  }
// CLOSE: Control flow

  /**
   * REF: revalidate-path
   *
   * ## Revalidate Path
   *
   * Mark Next.js cache as stale for fresh data fetch
   *
   * ### Revalidation Methods
   *
   * | Method | Scope | Use Case |
   * |--------|-------|----------|
   * | `revalidatePath('/dashboard')` | Specific route | Update page after mutation |
   * | `revalidateTag('todos')` | By tag | Shared data across routes |
   * | No cache | N/A | `export const revalidate = 0` |
   *
   * Without this, cached page won't show new todo
   *
   * // CLOSE: revalidate-path
   */
  revalidatePath('/dashboard')

  return { success: true, todo: data }
}

/**
 * REF: update-todo-action
 *
 * ## Update Todo Server Action
 *
 * Type-safe update with full TypeScript validation
 *
 * ### Features
 *
 * | Feature | Benefit |
 * |---------|---------|
 * | Type-safe args | Compiler catches errors |
 * | No JSON parsing | Simpler code |
 * | Partial updates | Optional fields |
 *
 * ### Parameters
 *
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `todoId` | `string` | ID of todo to update |
 * | `updates` | `object` | Fields to update |
 *
 * // CLOSE: update-todo-action
 */
// REF: Async function: export
export async function updateTodo(
  todoId: string,
  updates: {
    title?: string
    description?: string
    completed?: boolean
    isPublic?: boolean
  }
) {
  const supabase = await createClient()
// CLOSE: Async function: export

  const {
    data: { user },
  } = await supabase.auth.getUser()

// REF: Control flow
  if (!user) {
    return { error: 'Unauthorized' }
  }
// CLOSE: Control flow

  /**
   * REF: update-with-validation
   *
   * Supabase update with RLS enforcement.
   * `.eq('user_id', user.id)` is defensive - RLS blocks anyway.
   *
   * // CLOSE: update-with-validation
   */
// REF: Constant declaration
  const { error } = await supabase
    .from('todos')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', todoId)
    .eq('user_id', user.id) // Defensive: RLS blocks unauthorized updates
// CLOSE: Constant declaration

// REF: Control flow
  if (error) {
    console.error('Update error:', error)
    return { error: 'Failed to update todo' }
  }
// CLOSE: Control flow

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * REF: delete-todo-action
 *
 * ## Delete Todo Server Action
 *
 * Remove todo from database with RLS protection
 *
 * // CLOSE: delete-todo-action
 */
// REF: Async function: export
export async function deleteTodo(todoId: string) {
  const supabase = await createClient()
// CLOSE: Async function: export

  const {
    data: { user },
  } = await supabase.auth.getUser()

// REF: Control flow
  if (!user) {
    return { error: 'Unauthorized' }
  }
// CLOSE: Control flow

// REF: Constant declaration
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId)
    .eq('user_id', user.id)
// CLOSE: Constant declaration

// REF: Control flow
  if (error) {
    console.error('Delete error:', error)
    return { error: 'Failed to delete todo' }
  }
// CLOSE: Control flow

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * REF: toggle-completion-action
 *
 * ## Toggle Todo Completion
 *
 * Convenience action for common operation
 *
 * // CLOSE: toggle-completion-action
 */
// REF: Async function: export
export async function toggleTodoCompletion(todoId: string, currentStatus: boolean) {
  return await updateTodo(todoId, { completed: !currentStatus })
}
// CLOSE: Async function: export

/**
 * REF: calling-server-actions
 *
 * ## Calling Server Actions in Client Components
 *
 * Three methods with different use cases
 *
 * ### Calling Methods Comparison
 *
 * | Method | Mechanism | Best For | Enhancement |
 * |--------|-----------|----------|-------------|
 * | Form action | Form submission | Progressive | Works without JS |
 * | `useTransition` | React hook | UX with loading | Full control |
 * | Direct call | Async function | Simple events | Minimal boilerplate |
 *
 * Form action is simplest, useTransition best for UX
 *
 * // CLOSE: calling-server-actions
 */

/**
 * REF: error-handling-pattern
 *
 * ## Error Handling Pattern
 *
 * Return structured errors from actions
 *
 * ### Server Side
 *
 * ```typescript
 * if (error) {
 *   return { success: false, error: 'User-friendly message' }
 * }
 * return { success: true, data: result }
 * ```
 *
 * ### Client Side
 *
 * ```typescript
 * const result = await myAction(data)
 * if (!result.success) {
 *   setError(result.error)
 *   return
 * }
 * ```
 *
 * Never expose internal errors to client
 *
 * // CLOSE: error-handling-pattern
 */

/**
 * REF: revalidation-strategies
 *
 * ## Revalidation Strategies
 *
 * Clear Next.js cache after mutations
 *
 * ### Revalidation Methods
 *
 * | Method | Scope | When to Use |
 * |--------|-------|-------------|
 * | `revalidatePath('/dashboard')` | Route only | Single page updates |
 * | `revalidateTag('todos')` | All tagged routes | Shared data |
 * | `revalidatePath('/', 'layout')` | Entire site | Rare, expensive |
 *
 * Choose narrowest scope to minimize regeneration
 *
 * // CLOSE: revalidation-strategies
 */

/**
 * REF: security-best-practices
 *
 * ## Security Best Practices
 *
 * Server actions are public endpoints
 *
 * ### Must Do
 *
 * - Verify authentication (`getUser()`)
 * - Validate all input (length, type, format)
 * - Check authorization (ownership, roles)
 * - Use RLS for data layer security
 * - Implement rate limiting in production
 *
 * ### Never
 *
 * - Trust client data implicitly
 * - Skip validation
 * - Expose internal errors
 * - Return sensitive data
 * - Allow SQL injection
 *
 * Default paranoid - assume attacker controls client
 *
 * // CLOSE: security-best-practices
 */

/**
 * REF: server-actions-vs-api-routes
 *
 * ## Server Actions vs API Routes
 *
 * Choose based on use case
 *
 * ### Feature Comparison
 *
 * | Feature | Server Actions | API Routes |
 * |---------|---|---|
 * | Type safety | End-to-end | Manual |
 * | Boilerplate | Minimal | More |
 * | Progressive enhancement | Built-in | Manual |
 * | Public API | Not ideal | Perfect |
 * | Webhooks | Possible | Better |
 * | Internal operations | Ideal | Overkill |
 *
 * Server actions for app internals, API routes for public/external use
 *
 * // CLOSE: server-actions-vs-api-routes
 */
