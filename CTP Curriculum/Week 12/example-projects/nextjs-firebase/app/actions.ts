/**
 * REF: server-actions-file
 *
 * # Server Actions
 *
 * Next.js server-side functions called directly from client components.
 *
 * ## What Are Server Actions?
 *
 * Functions that:
 * - Run on the server (not client)
 * - Can be called directly from components
 * - Are type-safe end-to-end
 * - Use 'use server' directive
 * - Don't need API routes or fetch()
 *
 * ## Server Actions vs API Routes
 *
 * | `Aspect` | Server Actions | API Routes |
 * |--------|----------------|-----------|
 * | Code style | Function calls | HTTP endpoints |
 * | Type safety | `Excellent` | Manual validation |
 * | `Boilerplate` | `Minimal` | More setup |
 * | Learning curve | `Easy` | `Medium` |
 * | Use cases | Forms, mutations | Public APIs |
 *
 * ## With Firebase
 *
 * Server Actions can:
 * - Use Firebase Admin SDK
 * - Access full database
 * - Bypass client SDK limitations
 * - Perform complex operations
 * - Validate server-side
 *
 * ## Benefits
 *
 * - **No fetch()** - Call like regular functions
 * - **Type-safe** - Full TypeScript support
 * - **Progressive enhancement** - Works without JavaScript
 * - **Simpler** - No need for separate API routes
 * - **Secure** - Server logic hidden from client
 *
 * ## Security Considerations
 *
 * - Always validate input
 * - Check user authorization
 * - Don't trust formData
 * - Use server-side validation
 * - Verify user identity
 */
// CLOSE: server-actions-file

'use server'

import { adminDb } from '@/lib/firebase/admin'
import { revalidatePath } from 'next/cache'

/**
 * REF: create-todo-action
 *
 * # Create Todo Server Action
 *
 * Creates a todo using Firebase Admin SDK on the server.
 *
 * ## Function Signature
 *
 * ```typescript
 * async function createTodoAction(formData: FormData)
 * → { success: true, id: string } | { error: string }
 * ```
 *
 * ## Parameters
 *
 * **FormData fields:**
 * - title: Required, todo title
 * - description: Optional, todo details
 * - userId: Required, owner of todo
 * - isPublic: Optional, visibility setting
 *
 * ## Return Values
 *
 * **Success:**
 * ```javascript
 * { success: true, id: "docId123" }
 * ```
 *
 * **Error:**
 * ```javascript
 * { error: "Title is required" }
 * ```
 *
 * ## Client-Side Usage
 *
 * ```tsx
 * import { createTodoAction } from '@/app/actions'
 *
 * function TodoForm() {
 *   return (
 *     <form action={createTodoAction}>
 *       <input name="title" required />
 *       <input name="description" />
 *       <input name="userId" type="hidden" value={userId} />
 *       <button type="submit">Create</button>
 *     </form>
 *   )
 * }
 * ```
 *
 * No fetch() needed! Form automatically submits to server action.
 *
 * ## Server-Side Logic
 *
 * 1. Extract formData fields
 * 2. Validate inputs
 * 3. Verify userId
 * 4. Create in Firestore (Admin SDK)
 * 5. Revalidate cache
 * 6. Return success/error
 *
 * @param formData - Form submission data
 * @returns Success with ID or error message
 */
export async function createTodoAction(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const userId = formData.get('userId') as string
    const isPublic = formData.get('isPublic') === 'on'

    // Validate
    if (!title?.trim()) {
      return { error: 'Title is required' }
    }

    if (!userId) {
      return { error: 'User ID required' }
    }

    // Create in Firestore using Admin SDK
    const todoRef = await adminDb.collection('todos').add({
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      isPublic,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Revalidate the dashboard page cache
    revalidatePath('/dashboard')

    return { success: true, id: todoRef.id }
  } catch (error: any) {
    console.error('Server Action error:', error)
    return { error: error.message || 'Failed to create todo' }
  }
}
// CLOSE: create-todo-action

/**
 * REF: update-todo-action
 *
 * # Update Todo Server Action
 *
 * Updates an existing todo using Firebase Admin SDK.
 *
 * ## Function Signature
 *
 * ```typescript
 * async function updateTodoAction(
 *   todoId: string,
 *   updates: Partial<Todo>
 * ) → { success: true } | { error: string }
 * ```
 *
 * ## Parameters
 *
 * - todoId: ID of todo to update
 * - updates: Object with fields to update
 *   - title?: New title
 *   - description?: New description
 *   - completed?: Toggle done status
 *   - isPublic?: Change visibility
 *
 * ## Usage
 *
 * ```typescript
 * const result = await updateTodoAction(todoId, {
 *   title: 'Updated title',
 *   completed: true
 * })
 *
 * if (result.error) {
 *   alert(result.error)
 * } else {
 *   console.log('Todo updated!')
 * }
 * ```
 *
 * ## Validation
 *
 * - Checks that todoId is provided
 * - Server validates ownership (via Firestore rules)
 * - Automatically adds updatedAt timestamp
 *
 * @param todoId - ID of todo to update
 * @param updates - Partial todo object with fields to update
 * @returns Success or error result
 */
export async function updateTodoAction(
  todoId: string,
  updates: {
    title?: string
    description?: string
    completed?: boolean
    isPublic?: boolean
  }
) {
  try {
    if (!todoId) {
      return { error: 'Todo ID required' }
    }

    // Update in Firestore
    await adminDb.collection('todos').doc(todoId).update({
      ...updates,
      updatedAt: new Date(),
    })

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error: any) {
    console.error('Update error:', error)
    return { error: error.message || 'Failed to update todo' }
  }
}
// CLOSE: update-todo-action

/**
 * REF: delete-todo-action
 *
 * # Delete Todo Server Action
 *
 * Deletes a todo using Firebase Admin SDK.
 *
 * ## Function Signature
 *
 * ```typescript
 * async function deleteTodoAction(todoId: string)
 * → { success: true } | { error: string }
 * ```
 *
 * ## Parameters
 *
 * - todoId: ID of todo to delete
 *
 * ## Return Value
 *
 * ```javascript
 * // Success
 * { success: true }
 *
 * // Error
 * { error: "Todo ID required" }
 * ```
 *
 * ## Behavior
 *
 * 1. Validates todoId is provided
 * 2. Deletes from Firestore
 * 3. Revalidates dashboard page cache
 * 4. Returns success/error
 *
 * ## Security
 *
 * - Firestore security rules validate user ownership
 * - Admin SDK can bypass client validation
 * - Server-side permission checks recommended
 *
 * @param todoId - ID of todo to delete
 * @returns Success or error result
 */
export async function deleteTodoAction(todoId: string) {
  try {
    if (!todoId) {
      return { error: 'Todo ID required' }
    }

    // Delete from Firestore
    await adminDb.collection('todos').doc(todoId).delete()

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error: any) {
    console.error('Delete error:', error)
    return { error: error.message || 'Failed to delete todo' }
  }
}
// CLOSE: delete-todo-action

/**
 * REF: toggle-completion-action
 *
 * # Toggle Completion Server Action
 *
 * Convenience action for toggling todo completion status.
 *
 * ## Function Signature
 *
 * ```typescript
 * async function toggleTodoCompletionAction(
 *   todoId: string,
 *   currentCompleted: boolean
 * ) → { success: true } | { error: string }
 * ```
 *
 * ## Parameters
 *
 * - todoId: ID of todo to toggle
 * - currentCompleted: Current completion status
 *
 * ## Behavior
 *
 * - Calls updateTodoAction() with inverted completed status
 * - Common operation extracted for convenience
 *
 * ## Usage
 *
 * ```typescript
 * const result = await toggleTodoCompletionAction(todoId, todo.completed)
 * ```
 *
 * @param todoId - ID of todo to toggle
 * @param currentCompleted - Current completion status
 * @returns Success or error result
 */
export async function toggleTodoCompletionAction(
  todoId: string,
  currentCompleted: boolean
) {
  return updateTodoAction(todoId, { completed: !currentCompleted })
}
// CLOSE: toggle-completion-action

/**
 * REF: use-transition-pattern
 *
 * # Using Server Actions with useTransition
 *
 * For better UX with loading states in client components.
 *
 * ## Pattern
 *
 * ```tsx
 * import { useTransition } from 'react'
 * import { createTodoAction } from '@/app/actions'
 *
 * function TodoForm() {
 *   const [isPending, startTransition] = useTransition()
 *
 *   const handleSubmit = async (formData: FormData) => {
 *     startTransition(async () => {
 *       const result = await createTodoAction(formData)
 *
 *       if (result.error) {
 *         alert(result.error)
 *       }
 *     })
 *   }
 *
 *   return (
 *     <form action={handleSubmit}>
 *       <input name="title" />
 *       <button disabled={isPending}>
 *         {isPending ? 'Creating...' : 'Create'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 *
 * ## Benefits
 *
 * - isPending shows loading state
 * - UI disables while action runs
 * - Smooth user experience
 * - Automatic error handling
 */
// CLOSE: use-transition-pattern

/**
 * REF: event-handler-pattern
 *
 * # Calling Server Actions from Event Handlers
 *
 * Server actions can be called directly from event handlers, not just forms.
 *
 * ## Pattern
 *
 * ```tsx
 * const handleDelete = async () => {
 *   const result = await deleteTodoAction(todoId)
 *
 *   if (result.error) {
 *     alert(result.error)
 *   }
 * }
 *
 * <button onClick={handleDelete}>Delete</button>
 * ```
 *
 * ## Advantages
 *
 * - Direct function calls
 * - Type-safe parameters
 * - Immediate feedback
 * - No fetch() needed
 */
// CLOSE: event-handler-pattern

/**
 * REF: admin-sdk-benefits
 *
 * # Firebase Admin SDK Benefits
 *
 * Running on server with Admin SDK provides special capabilities.
 *
 * ## Advantages
 *
 * | `Capability` | Description |
 * |------------|-------------|
 * | Bypass rules | Can bypass security rules (carefully!) |
 * | Privileged ops | Perform operations clients can't |
 * | `Transactions` | Complex multi-step operations |
 * | External APIs | Call services from server |
 * | Full access | Access all Firebase services |
 *
 * ## Use Carefully
 *
 * - Admin SDK ignores security rules
 * - Always validate user authorization
 * - Implement server-side permission checks
 * - Don't trust client-provided data
 */
// CLOSE: admin-sdk-benefits

/**
 * REF: security-best-practices
 *
 * # Security Best Practices
 *
 * Server Actions are public endpoints and need careful security.
 *
 * ## Essential Rules
 *
 * 1. **Always validate input**
 *    - Check all formData fields
 *    - Reject invalid types
 *    - Enforce constraints
 *
 * 2. **Check user authorization**
 *    - Verify user identity
 *    - Check permissions
 *    - Validate ownership
 *
 * 3. **Don't trust formData**
 *    - Client-side validation is optional
 *    - Always validate server-side
 *    - Assume data is compromised
 *
 * 4. **Use server-side validation**
 *    - Implement comprehensive checks
 *    - Return clear error messages
 *    - Log suspicious activity
 *
 * ## Example Improvement
 *
 * Current code accepts userId from formData.
 * Should verify it matches authenticated user:
 *
 * ```typescript
 * // Get actual user from auth context
 * const { userId } = await verifyAuth()
 *
 * // Don't use userId from formData
 * if (formDataUserId !== userId) {
 *   throw new Error('Unauthorized')
 * }
 * ```
 */
// CLOSE: security-best-practices
