/**
 * REF: file-header
 *
 * # Dashboard Page - Type-Safe Queries with Drizzle ORM
 *
 * This page demonstrates Drizzle ORM's perfect TypeScript inference for database queries.
 *
 * ## Key Features
 * - Drizzle's automatic type inference
 * - SQL-like query syntax
 * - Type-safe CRUD operations
 * - Helper functions from queries.ts
 *
 * ## Drizzle vs Supabase Client
 * - **Drizzle**: Perfect type safety, SQL-like syntax, explicit
 * - **Supabase**: Good types, chainable methods, implicit
 * - **Drizzle**: Better for complex queries
 * - **Supabase**: Better for simple CRUD
 *
 * ## Why This Combination?
 * - Drizzle for database queries (type-safe)
 * - Supabase for auth (best-in-class)
 * - Supabase for storage (easy file uploads)
 * - Best of both worlds
 *
 * ## Type Inference Example
 * ```typescript
 * const todos = await getUserTodos(userId)
 * // TypeScript automatically knows:
 * // todos: { id: string, title: string, completed: boolean, ... }[]
 *
 * todos[0].title     // ✅ string
 * todos[0].completed // ✅ boolean
 * todos[0].invalid   // ❌ Type error!
 * ```
 *
 * No manual type annotations needed - Drizzle infers everything from the schema.
 */
// CLOSE: file-header

/**
 * REF: use-client-directive
 *
 * ## Client Component Directive
 *
 * ## Why 'use client'?
 * This page needs client-side interactivity for:
 * - Form state management
 * - User interactions (click handlers)
 * - Auth context consumption
 * - Router navigation
 *
 * ## Client vs Server Components
 * - **Client**: Interactive, uses hooks, event handlers
 * - **Server**: Static, async/await data fetching, no interactivity
 *
 * ## This Component Needs
 * - useState for form inputs and todos
 * - useEffect for data fetching
 * - useAuth for authentication
 * - useRouter for navigation
 * - Event handlers for CRUD operations
 */
'use client'
// CLOSE: use-client-directive

/**
 * REF: react-imports
 *
 * ## React Hook Imports
 *
 * ## useState
 * Manages component state:
 * - Form inputs (title, description, tags)
 * - Todos list
 * - Loading states
 * - Error messages
 *
 * ## useEffect
 * Handles side effects:
 * - Fetch todos on mount
 * - Redirect if not authenticated
 * - Could add real-time subscriptions
 */
import { useState, useEffect } from 'react'
// CLOSE: react-imports

/**
 * REF: nextjs-imports
 *
 * ## Next.js Navigation Import
 *
 * ## useRouter Hook
 * Enables client-side navigation.
 *
 * ### Usage
 * ```typescript
 * router.push('/signin')     // Navigate to sign in
 * router.back()              // Go back
 * router.refresh()           // Refresh data
 * ```
 *
 * ### When to Use
 * - Redirect after auth check
 * - Navigate after actions
 * - Programmatic navigation
 */
import { useRouter } from 'next/navigation'
// CLOSE: nextjs-imports

/**
 * REF: auth-context-import
 *
 * ## Authentication Context Import
 *
 * ## useAuth Hook
 * Provides access to authentication state and methods.
 *
 * ### Available Properties
 * ```typescript
 * const {
 *   user,      // Current user or null
 *   loading,   // Auth loading state
 *   signIn,    // Sign in method
 *   signOut,   // Sign out method
 * } = useAuth()
 * ```
 *
 * ### Usage Pattern
 * - Check if user exists
 * - Redirect to sign in if null
 * - Use user.id for database queries
 */
import { useAuth } from '@/contexts/AuthContext'
// CLOSE: auth-context-import

/**
 * REF: drizzle-query-imports
 *
 * ## Drizzle Query Helper Imports
 *
 * These are type-safe helper functions defined in lib/db/queries.ts.
 *
 * ## getUserTodos
 * Fetches all todos for a specific user.
 * - Type-safe query
 * - Returns typed array
 * - Filters by userId
 *
 * ## createTodo
 * Creates a new todo record.
 * - Type-safe insert
 * - Returns created todo
 * - Validates data structure
 *
 * ## updateTodo
 * Updates an existing todo.
 * - Type-safe update
 * - Partial updates supported
 * - Returns updated todo
 *
 * ## deleteTodo
 * Deletes a todo by ID.
 * - Type-safe delete
 * - Returns void
 * - Could return deleted record
 *
 * ### Benefits of Helper Functions
 * - Reusable query logic
 * - Centralized data access
 * - Easier to test
 * - Consistent error handling
 */
import {
  getUserTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '@/lib/db/queries'
// CLOSE: drizzle-query-imports

/**
 * REF: type-inference-comment
 *
 * ## Type Inference from Drizzle
 *
 * ## No Need to Import Todo Type!
 * Drizzle automatically infers types from query return values.
 *
 * ### How to Get the Type (if needed)
 * ```typescript
 * import { InferSelectModel } from 'drizzle-orm'
 * import { todos } from '@/lib/db/schema'
 *
 * type Todo = InferSelectModel<typeof todos>
 * ```
 *
 * ### Why It's Not Needed Here
 * - TypeScript infers from `getUserTodos()` return type
 * - `Awaited<ReturnType<typeof getUserTodos>>` extracts the type
 * - No manual type definitions required
 * - Schema is single source of truth
 */
// CLOSE: type-inference-comment

/**
 * REF: dashboard-component
 *
 * ## Dashboard Page Component
 *
 * ## Component Architecture
 * Main dashboard component that manages todo CRUD operations.
 *
 * ### Responsibilities
 * - Fetch user's todos
 * - Display todo list
 * - Handle todo creation
 * - Handle todo updates
 * - Handle todo deletion
 * - Manage form state
 * - Handle authentication
 *
 * ### State Management
 * Uses local component state with useState for:
 * - Todo list
 * - Form inputs
 * - UI state (loading, errors)
 *
 * ### Data Flow
 * 1. User authenticates
 * 2. Fetch todos from database
 * 3. Display in UI
 * 4. User performs CRUD operations
 * 5. Update local state
 * 6. Sync with database
 */
export default function DashboardPage() {
  /**
   * REF: auth-state
   *
   * # Authentication State
   *
   * ## Extract Auth Properties
   * Get user and loading state from auth context.
   *
   * ### user Property
   * - Contains user data if authenticated
   * - null if not authenticated
   * - Includes id, email, metadata
   *
   * ### authLoading Property
   * - true during initial auth check
   * - false after auth state determined
   * - Prevents premature redirects
   */
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  // CLOSE: auth-state

  /**
   * REF: component-state
   *
   * # Component State Management
   *
   * ## Todo State
   * - `todos` - Array of user's todos
   * - Type inferred from getUserTodos return type
   * - Updated after CRUD operations
   *
   * ## Loading State
   * - `loading` - true while fetching todos
   * - false after fetch completes
   * - Separate from authLoading
   *
   * ## Error State
   * - `error` - Error message string
   * - Empty string when no error
   * - Displayed to user in UI
   *
   * ### Type Safety
   * ```typescript
   * Awaited<ReturnType<typeof getUserTodos>>
   * ```
   * - Extracts return type from getUserTodos
   * - Awaited unwraps the Promise
   * - Array of typed todo objects
   */
  const [todos, setTodos] = useState<Awaited<ReturnType<typeof getUserTodos>>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // CLOSE: component-state

  /**
   * REF: form-state
   *
   * # Form Input State
   *
   * ## Todo Creation Form Fields
   * - `title` - Todo title (required)
   * - `description` - Todo description (optional)
   * - `isPublic` - Public/private toggle (boolean)
   * - `tags` - Array of tag strings
   * - `tagInput` - Temporary input for adding tags
   *
   * ### Form Flow
   * 1. User types in inputs
   * 2. State updates on change
   * 3. Submit creates todo
   * 4. Form clears on success
   *
   * ### Tag Management
   * - Tags stored as string array
   * - tagInput is temporary
   * - Add tag moves from input to tags array
   * - Remove tag filters from tags array
   */
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  // CLOSE: form-state

  /**
   * REF: auth-protection-effect
   *
   * # Authentication Protection Effect
   *
   * ## Purpose
   * Redirect unauthenticated users to sign in page.
   *
   * ### Logic
   * 1. Wait for auth loading to complete
   * 2. Check if user exists
   * 3. Redirect to signin if null
   *
   * ### Dependencies
   * - `user` - Triggers when auth state changes
   * - `authLoading` - Prevents redirect during loading
   * - `router` - Used for navigation
   *
   * ### Why Separate Effect?
   * - Auth check independent from data fetching
   * - Runs before todo fetching
   * - Prevents unnecessary API calls
   *
   * ### Alternative Approaches
   * - Middleware for route protection
   * - Higher-order component
   * - Separate auth guard component
   */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])
  // CLOSE: auth-protection-effect

  /**
   * REF: fetch-todos-effect
   *
   * # Fetch Todos Effect
   *
   * ## Purpose
   * Load user's todos from database when component mounts or user changes.
   *
   * ### Flow
   * 1. Check if user exists (early return if not)
   * 2. Define async fetch function
   * 3. Call getUserTodos with user ID
   * 4. Update todos state
   * 5. Set loading to false
   * 6. Handle errors
   *
   * ### Type Safety
   * ```typescript
   * const userTodos = await getUserTodos(user.id)
   * // userTodos is automatically typed!
   * // No type assertions needed
   * ```
   *
   * ### Error Handling
   * - Try-catch for async operations
   * - Log errors to console
   * - Set error message for user
   * - Still set loading false
   *
   * ### Dependencies
   * - `user` - Refetch when user changes
   * - Could add: refetch trigger, polling
   *
   * ## Real-Time Updates (Optional)
   *
   * ### With Supabase + Drizzle
   * You can combine Supabase real-time with Drizzle queries:
   *
   * ```typescript
   * import { createClient } from '@/lib/supabase/client'
   *
   * const supabase = createClient()
   *
   * const channel = supabase
   *   .channel('todos')
   *   .on('postgres_changes', {
   *     event: '*',
   *     schema: 'public',
   *     table: 'todos',
   *     filter: `user_id=eq.${user.id}`
   *   }, () => {
   *     fetchTodos() // Refetch with Drizzle
   *   })
   *   .subscribe()
   *
   * return () => supabase.removeChannel(channel)
   * ```
   *
   * ### Benefits of Hybrid Approach
   * - Supabase broadcasts changes
   * - Drizzle fetches with type safety
   * - Best of both worlds
   */
  useEffect(() => {
    if (!user) return

    const fetchTodos = async () => {
      try {
        const userTodos = await getUserTodos(user.id)
        setTodos(userTodos)
        setLoading(false)
      } catch (error: any) {
        console.error('Error fetching todos:', error)
        setError('Failed to load todos')
        setLoading(false)
      }
    }

    fetchTodos()
  }, [user])
  // CLOSE: fetch-todos-effect

  /**
   * REF: create-todo-handler
   *
   * # Create Todo Handler
   *
   * ## Purpose
   * Handle form submission to create a new todo.
   *
   * ### Flow
   * 1. Prevent default form submission
   * 2. Validate user and title
   * 3. Call createTodo with data
   * 4. Add new todo to state (optimistic update)
   * 5. Clear form inputs
   * 6. Handle errors
   *
   * ### Type Safety
   * ```typescript
   * const newTodo = await createTodo({
   *   userId: user.id,        // ✅ string
   *   title: title.trim(),    // ✅ string
   *   description: string,    // ✅ string
   *   isPublic,               // ✅ boolean
   *   tags: tags || undefined // ✅ string[] | undefined
   * })
   * // newTodo is fully typed!
   * ```
   *
   * ### Drizzle Type Validation
   * TypeScript catches errors at compile time:
   * ```typescript
   * await createTodo({
   *   userId: 123,            // ❌ Error: Expected string
   *   title: 42,              // ❌ Error: Expected string
   *   invalidField: true,     // ❌ Error: Unknown field
   * })
   * ```
   *
   * ### Optimistic Update
   * - Add to UI immediately
   * - Don't wait for database
   * - Better UX (feels faster)
   * - Could rollback on error
   *
   * ### Form Reset
   * Clear all form fields after successful creation
   */
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !title.trim()) return

    try {
      const newTodo = await createTodo({
        userId: user.id,
        title: title.trim(),
        description: description.trim(),
        isPublic,
        tags: tags.length > 0 ? tags : undefined,
      })

      // Add to state for instant UI update
      setTodos([newTodo, ...todos])

      // Clear form
      setTitle('')
      setDescription('')
      setIsPublic(false)
      setTags([])
    } catch (error: any) {
      console.error('Error creating todo:', error)
      setError('Failed to create todo')
    }
  }
  // CLOSE: create-todo-handler

  /**
   * REF: toggle-complete-handler
   *
   * # Toggle Todo Completion Handler
   *
   * ## Purpose
   * Toggle a todo's completed status.
   *
   * ### Flow
   * 1. Call updateTodo with new completed value
   * 2. Update local state optimistically
   * 3. Handle errors
   *
   * ### Type Safety
   * ```typescript
   * await updateTodo(todoId, { completed: !completed })
   * // TypeScript knows:
   * // - todoId must be string
   * // - completed must be boolean
   * // - Only valid todo fields allowed
   * ```
   *
   * ### Optimistic Update Pattern
   * ```typescript
   * setTodos(todos.map(t =>
   *   t.id === todoId
   *     ? { ...t, completed: !completed }
   *     : t
   * ))
   * ```
   * - Updates specific todo in array
   * - Preserves other todos unchanged
   * - Immediate UI feedback
   *
   * ### Error Handling
   * - Could rollback optimistic update
   * - Could refetch from database
   * - Could show error toast
   */
  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    try {
      await updateTodo(todoId, { completed: !completed })

      // Update local state
      setTodos(todos.map(t =>
        t.id === todoId ? { ...t, completed: !completed } : t
      ))
    } catch (error: any) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo')
    }
  }
  // CLOSE: toggle-complete-handler

  /**
   * REF: delete-todo-handler
   *
   * # Delete Todo Handler
   *
   * ## Purpose
   * Permanently delete a todo after confirmation.
   *
   * ### Flow
   * 1. Show browser confirmation dialog
   * 2. Return if user cancels
   * 3. Call deleteTodo function
   * 4. Remove from local state
   * 5. Handle errors
   *
   * ### Confirmation
   * - Uses browser's native confirm dialog
   * - Simple and accessible
   * - Could use custom modal for better UX
   *
   * ### Type Safety
   * ```typescript
   * await deleteTodo(todoId)
   * // TypeScript ensures todoId is correct type
   * ```
   *
   * ### State Update
   * ```typescript
   * setTodos(todos.filter(t => t.id !== todoId))
   * ```
   * - Filters out deleted todo
   * - Returns new array
   * - Triggers re-render
   *
   * ### Better Confirmation UX
   * ```typescript
   * // Custom modal
   * const confirmed = await confirmDialog({
   *   title: 'Delete Todo',
   *   message: 'This cannot be undone',
   * })
   * ```
   */
  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Delete this todo?')) return

    try {
      await deleteTodo(todoId)

      // Remove from local state
      setTodos(todos.filter(t => t.id !== todoId))
    } catch (error: any) {
      console.error('Error deleting todo:', error)
      setError('Failed to delete todo')
    }
  }
  // CLOSE: delete-todo-handler

  /**
   * REF: tag-handlers
   *
   * # Tag Management Handlers
   *
   * ## handleAddTag
   * Adds a tag to the tags array.
   *
   * ### Logic
   * 1. Trim and lowercase input
   * 2. Check if valid and not duplicate
   * 3. Check limit (max 10 tags)
   * 4. Add to tags array
   * 5. Clear input
   *
   * ### Validation Rules
   * - Not empty after trim
   * - Not already in tags array
   * - Less than 10 tags total
   * - Lowercase for consistency
   *
   * ### Usage
   * - Called on button click
   * - Called on Enter key press
   * - Clears input after adding
   */
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }
  // CLOSE: tag-handlers

  /**
   * REF: loading-state-render
   *
   * # Loading State Render
   *
   * ## Purpose
   * Show loading indicator while auth or data is loading.
   *
   * ### When Shown
   * - authLoading is true (checking authentication)
   * - loading is true (fetching todos)
   *
   * ### Why Separate Loading States?
   * - Auth loading happens first
   * - Data loading happens after auth
   * - Could show different messages
   *
   * ### UI Pattern
   * - Centered flex container
   * - Simple text message
   * - Could add spinner
   * - Could add skeleton UI
   *
   * ### Better Loading UX
   * ```typescript
   * if (authLoading) return <Spinner message="Checking auth..." />
   * if (loading) return <TodosSkeleton />
   * ```
   */
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }
  // CLOSE: loading-state-render

  /**
   * REF: no-user-render
   *
   * # No User State Render
   *
   * ## Purpose
   * Return null if no user (will redirect via useEffect).
   *
   * ### Why Null?
   * - useEffect will redirect to signin
   * - Prevents flash of content
   * - Cleaner than conditional rendering
   *
   * ### Redirect Happens In
   * The auth-protection-effect useEffect handles navigation.
   */
  if (!user) return null
  // CLOSE: no-user-render

  /**
   * REF: main-render
   *
   * # Main Dashboard Render
   *
   * ## Layout Structure
   * - Full screen with background
   * - Centered container (max-width)
   * - Header with title
   * - Error display
   * - Create form
   * - Todos list
   */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* CLOSE: main-render */}

        {/**
         * REF: page-header
         *
         * # Page Header
         *
         * Simple heading for the dashboard.
         */}
        <h1 className="text-4xl font-bold mb-8">My Todos</h1>
        {/* CLOSE: page-header */}

        {/**
         * REF: error-display
         *
         * # Error Message Display
         *
         * ## Conditional Rendering
         * Only shows if error state is not empty.
         *
         * ### Styling
         * - Red background (bg-red-100)
         * - Red text (text-red-700)
         * - Padding and rounded corners
         * - Bottom margin
         *
         * ### Better Error Handling
         * - Auto-dismiss after timeout
         * - Close button
         * - Different error types (warning, info)
         * - Toast notifications
         */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {/* CLOSE: error-display */}

        {/**
         * REF: create-form
         *
         * # Create Todo Form
         *
         * ## Form Structure
         * Form for creating new todos with multiple fields.
         *
         * ### Fields
         * - Title input (required)
         * - Description textarea (optional)
         * - Tag input with add button
         * - Tag display with remove buttons
         * - Public checkbox
         * - Submit button
         *
         * ### Form Handling
         * - onSubmit calls handleCreateTodo
         * - Prevents default form submission
         * - Controlled inputs (value + onChange)
         *
         * ### Styling
         * - White card with shadow
         * - Responsive padding
         * - Vertical spacing (space-y-4)
         * - Full width inputs
         */}
        <form onSubmit={handleCreateTodo} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          {/* CLOSE: create-form */}

          {/**
           * REF: form-header
           *
           * # Form Header
           *
           * Heading for the create form section.
           */}
          <h2 className="text-2xl font-bold mb-4">Create New Todo</h2>
          {/* CLOSE: form-header */}

          {/**
           * REF: form-inputs
           *
           * # Form Input Fields
           *
           * ## Title Input
           * - Required field
           * - Controlled input (value={title})
           * - Updates on change
           * - Full width with styling
           *
           * ## Description Textarea
           * - Optional field
           * - Multiline input (3 rows)
           * - Controlled textarea
           * - Full width with styling
           *
           * ## Tag Input Section
           * - Text input for tag entry
           * - Button to add tag
           * - Enter key also adds tag
           * - Flex layout for side-by-side
           *
           * ### Controlled Inputs Pattern
           * ```typescript
           * value={title}
           * onChange={(e) => setTitle(e.target.value)}
           * ```
           * - React controls the input value
           * - Single source of truth (state)
           * - Easy to validate and transform
           */}
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700"
            />

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Add
              </button>
            </div>
            {/* CLOSE: form-inputs */}

            {/**
             * REF: tag-display
             *
             * # Tag Display Section
             *
             * ## Conditional Rendering
             * Only shows if tags array has items.
             *
             * ## Tag Pills
             * - Maps over tags array
             * - Each tag is a styled pill
             * - Remove button (×) for each tag
             * - Flex wrap layout
             *
             * ### Remove Tag Logic
             * ```typescript
             * setTags(tags.filter(t => t !== tag))
             * ```
             * - Filters out clicked tag
             * - Returns new array
             * - Triggers re-render
             */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-100 rounded-full text-sm">
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="ml-2"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* CLOSE: tag-display */}

            {/**
             * REF: public-checkbox
             *
             * # Public/Private Toggle
             *
             * ## Checkbox Input
             * - Controlled checkbox (checked={isPublic})
             * - Label for accessibility
             * - Toggle public visibility
             *
             * ### Checkbox Pattern
             * ```typescript
             * checked={isPublic}
             * onChange={(e) => setIsPublic(e.target.checked)}
             * ```
             * - e.target.checked is boolean
             * - Directly set state
             * - Visual feedback automatic
             */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span>Make public</span>
            </label>
            {/* CLOSE: public-checkbox */}

            {/**
             * REF: submit-button
             *
             * # Form Submit Button
             *
             * ## Button Styling
             * - Full width
             * - Blue background
             * - White text
             * - Hover state
             * - Large padding
             *
             * ### Type Submit
             * - Triggers form onSubmit
             * - Native form validation
             * - Enter key submits
             */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Todo
            </button>
            {/* CLOSE: submit-button */}
          </div>
        </form>

        {/**
         * REF: todos-list
         *
         * # Todos List Display
         *
         * ## Purpose
         * Render all todos with interactive elements.
         *
         * ### List Structure
         * - Maps over todos array
         * - Each todo is a card
         * - Vertical spacing (space-y-3)
         *
         * ### Todo Card Components
         * - Checkbox for completion
         * - Title (strikethrough if complete)
         * - Description
         * - Tags
         * - Delete button
         *
         * ### Interactive Elements
         * - Checkbox toggles completion
         * - Delete button removes todo
         * - All actions update local state
         *
         * ### Type Safety
         * ```typescript
         * todos.map(todo => ...)
         * // TypeScript knows todo's shape
         * // todo.id, todo.title, todo.completed, etc.
         * // All autocompleted and type-checked
         * ```
         */}
        <div className="space-y-3">
          {todos.map(todo => (
            <div key={todo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4">
              {/* CLOSE: todos-list */}

              {/**
               * REF: todo-checkbox
               *
               * # Todo Completion Checkbox
               *
               * ## Checkbox Control
               * - Shows current completion status
               * - onClick toggles completion
               * - Larger size for easier clicking
               *
               * ### Handler Call
               * ```typescript
               * onChange={() => handleToggleComplete(todo.id, todo.completed)}
               * ```
               * - Passes todo ID and current status
               * - Handler updates database
               * - Local state updates for instant feedback
               */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
                className="mt-1 w-5 h-5"
              />
              {/* CLOSE: todo-checkbox */}

              {/**
               * REF: todo-content
               *
               * # Todo Content Display
               *
               * ## Title
               * - Bold font weight
               * - Strikethrough if completed
               * - Conditional styling with ternary
               *
               * ## Description
               * - Shows if exists (conditional rendering)
               * - Smaller text
               * - Gray color
               * - Top margin
               *
               * ## Tags
               * - Shows if tags exist and array has length
               * - Maps over tags array
               * - Small pills with gray background
               * - Hashtag prefix
               *
               * ### Conditional Styling Pattern
               * ```typescript
               * className={`font-medium ${todo.completed ? 'line-through' : ''}`}
               * ```
               * - Template literal for dynamic classes
               * - Ternary for conditional class
               * - Tailwind utilities
               */}
              <div className="flex-1">
                <h3 className={`font-medium ${todo.completed ? 'line-through' : ''}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                )}
                {todo.tags && todo.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {todo.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* CLOSE: todo-content */}

              {/**
               * REF: delete-button
               *
               * # Delete Todo Button
               *
               * ## Button Styling
               * - Red text for destructive action
               * - Hover background
               * - Rounded corners
               * - Padding for click area
               *
               * ### Click Handler
               * - Calls handleDeleteTodo with todo ID
               * - Shows confirmation dialog
               * - Removes from state on success
               *
               * ### Icon
               * - Trash emoji for delete action
               * - Could use icon library
               * - Visual affordance for deletion
               */}
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                🗑️
              </button>
              {/* CLOSE: delete-button */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
// CLOSE: dashboard-component

/**
 * REF: drizzle-type-safety-showcase
 *
 * ## Drizzle Type Safety Showcase
 *
 * ## Every Query is Fully Typed
 *
 * ### Select Query Type Inference
 * ```typescript
 * const result = await db
 *   .select({
 *     id: todos.id,
 *     title: todos.title,        // ✅ Autocomplete!
 *     completed: todos.completed,
 *   })
 *   .from(todos)
 *
 * result[0].title      // ✅ string
 * result[0].completed  // ✅ boolean
 * result[0].userId     // ❌ Type error - not selected!
 * ```
 *
 * ### Insert Type Checking
 * ```typescript
 * await db.insert(todos).values({
 *   userId: 'uuid',          // ✅ string
 *   title: 'My Todo',        // ✅ string
 *   completed: false,        // ✅ boolean
 * })
 *
 * // Compile-time errors:
 * await db.insert(todos).values({
 *   userId: 123,             // ❌ Error: Expected string
 *   invalidField: 'test',    // ❌ Error: Unknown field
 * })
 * ```
 *
 * ### Update Type Checking
 * ```typescript
 * await db.update(todos).set({
 *   title: 'Updated',        // ✅ string
 *   completed: true,         // ✅ boolean
 * })
 *
 * // Compile-time errors:
 * await db.update(todos).set({
 *   title: 42,               // ❌ Error: Expected string
 * })
 * ```
 *
 * ## Why This Level of Type Safety Matters
 * - Catch errors before runtime
 * - Autocomplete in IDE
 * - Safe refactoring
 * - Self-documenting code
 * - No type assertions needed
 * - Schema is single source of truth
 *
 * This level of type safety is unique to Drizzle ORM!
 */
// CLOSE: drizzle-type-safety-showcase

/**
 * REF: advanced-drizzle-patterns
 *
 * ## Advanced Drizzle Patterns
 *
 * ## Complex Filtering
 * ```typescript
 * import { and, or, gt, lt, like } from 'drizzle-orm'
 *
 * const filtered = await db
 *   .select()
 *   .from(todos)
 *   .where(
 *     and(
 *       eq(todos.userId, userId),
 *       or(
 *         eq(todos.completed, false),
 *         gt(todos.updatedAt, yesterday)
 *       ),
 *       like(todos.title, '%important%')
 *     )
 *   )
 * ```
 *
 * ## Joins with Relations
 * ```typescript
 * const todosWithAttachments = await db.query.todos.findMany({
 *   where: eq(todos.userId, userId),
 *   with: {
 *     attachments: true,
 *   },
 * })
 *
 * // Nested structure automatically typed!
 * todosWithAttachments[0].attachments[0].fileName  // ✅ string
 * ```
 *
 * ## Aggregations
 * ```typescript
 * import { count } from 'drizzle-orm'
 *
 * const stats = await db
 *   .select({
 *     total: count(),
 *     completed: count(todos.completed),
 *   })
 *   .from(todos)
 *   .where(eq(todos.userId, userId))
 * ```
 *
 * ## Transactions
 * ```typescript
 * await db.transaction(async (tx) => {
 *   await tx.insert(todos).values({ ... })
 *   await tx.update(userStats).set({ ... })
 * })
 * ```
 *
 * All of these are fully type-safe with perfect autocomplete!
 */
// CLOSE: advanced-drizzle-patterns
