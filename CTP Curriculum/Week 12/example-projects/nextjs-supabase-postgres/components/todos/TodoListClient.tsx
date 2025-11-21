/**
 * TodoListClient - Client Component for Interactivity
 *
 * This client component handles interactive features while receiving initial data from server.
 *
 * ## Key Concepts
 * - 'use client' directive for client components
 * - Receiving props from server component
 * - Real-time updates with Supabase
 * - Optimistic UI updates
 *
 * SERVER + CLIENT PATTERN:
 * - Server component fetches initial data (fast, SEO-friendly)
 * - Passes data as props to client component
 * - Client component handles interactivity and real-time
 * - Best of both worlds!
 *
 * WHY 'use client'?
 * - Need useState for local state
 * - Need useEffect for real-time subscription
 * - Need event handlers (onClick, onChange)
 * - Need browser APIs
 *
 */

/**
 * REF: client-side-directive
 *
 * ## Client-Side Directive
 *
 * Marks this module as a client component, enabling browser-only features like useState, useEffect,
 * and event handlers. Required for interactivity in Next.js App Router.
 */
'use client'

// REF: Import statement
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
// CLOSE: Import statement

// REF: Type definition
type Todo = Database['public']['Tables']['todos']['Row']
// CLOSE: Type definition

// REF: Type definition
interface TodoListClientProps {
  initialTodos: Todo[]
  userId: string
}
// CLOSE: Type definition

/**
 * CLIENT COMPONENT WITH INITIAL DATA
 *
 * @param initialTodos - Data fetched on server
 * @param userId - Current user's ID
 *
 * ## Flow
 * 1. Component receives server data as props
 * 2. Initializes state with server data
 * 3. Sets up real-time subscription
 * 4. Updates state as changes occur
 * 5. Handles user interactions
 */
/**
 * REF: todo-list-client-component
 *
 * ## TodoListClient Component
 *
 * Main client component that handles todo list interactivity with real-time updates via Supabase.
 * Receives initial data from server component for optimal performance and SEO.
 *
 * ### Props
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `initialTodos` | `Todo[]` | Initial todo data fetched on server |
 * | `userId` | `string` | Current authenticated user's ID |
 *
 * ### Features
 * - Real-time subscription to database changes
 * - Optimistic UI updates
 * - Create, toggle, and delete operations
 * - Progressive enhancement (works without JS)
 *
 * ### Example
 * ```tsx
 * <TodoListClient
 *   initialTodos={serverTodos}
 *   userId={user.id}
 * />
 * ```
 */

// REF: Function: export
export default function TodoListClient({ initialTodos, userId }: TodoListClientProps) {
  const supabase = createClient()
// CLOSE: Function: export

  /**
   * STATE INITIALIZED WITH SERVER DATA
   *
   * Start with server-rendered data for instant content
   * Then enhance with real-time updates
   */
// REF: Constant declaration
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [error, setError] = useState('')
// CLOSE: Constant declaration

  /**
   * REAL-TIME SUBSCRIPTION
   *
   * After initial render with server data, subscribe to updates
   *
   * PROGRESSIVE ENHANCEMENT:
   * 1. User sees content immediately (from server)
   * 2. Real-time kicks in (client-side)
   * 3. Future changes update in real-time
   *
   * This is better than pure client-side:
   * - No loading spinner on initial load
   * - Content visible in milliseconds
   * - Then becomes interactive
   */
// REF: Function: useEffect
  useEffect(() => {
    const channel = supabase
      .channel('todos-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time change:', payload)
// CLOSE: Function: useEffect

// REF: Control flow
          if (payload.eventType === 'INSERT') {
            setTodos([payload.new as Todo, ...todos])
          } else if (payload.eventType === 'UPDATE') {
            setTodos(todos.map(t =>
              t.id === payload.new.id ? payload.new as Todo : t
            ))
          } else if (payload.eventType === 'DELETE') {
            setTodos(todos.filter(t => t.id !== (payload.old as Todo).id))
          }
        }
      )
      .subscribe()
// CLOSE: Control flow

// REF: Function: return
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, todos])
// CLOSE: Function: return

  /**
   * CREATE TODO (CLIENT-SIDE MUTATION)
   *
   * Client component can still make database changes
   * RLS protects the operation
   */
  /**
   * REF: handle-create-todo
   *
   * ## handleCreateTodo
   *
   * Creates a new todo item in the database via client-side mutation. Implements optimistic UI
   * updates for instant feedback while waiting for database confirmation.
   *
   * ### Parameters
   * | Name | Type | Description |
   * |------|------|-------------|
   * | `e` | `React.FormEvent` | Form submission event |
   *
   * ### Behavior
   * - Validates todo title is not empty
   * - Inserts new todo with user_id via Supabase
   * - Optimistically updates local state
   * - Clears input field on success
   * - Protected by RLS policies
   *
   * ### Example
   * ```tsx
   * <form onSubmit={handleCreateTodo}>
   *   <input value={newTodoTitle} onChange={e => setNewTodoTitle(e.target.value)} />
   *   <button type="submit">Add</button>
   * </form>
   * ```
   */
// REF: Async function: const
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()
// CLOSE: Async function: const

// REF: JSX return
    if (!newTodoTitle.trim()) return
// CLOSE: JSX return

// REF: Constant declaration
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        title: newTodoTitle.trim(),
        completed: false,
        is_public: false,
      })
      .select()
      .single()
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      setError('Failed to create todo')
      console.error(error)
      return
    }
// CLOSE: Control flow

    // Optimistically update UI
    setTodos([data, ...todos])
    setNewTodoTitle('')
  }

  /**
   * TOGGLE COMPLETION
   */
  /**
   * REF: handle-toggle
   *
   * ## handleToggle
   *
   * Toggles the completion status of a todo item. Uses optimistic updates to provide
   * immediate UI feedback before database confirmation.
   *
   * ### Parameters
   * | Name | Type | Description |
   * |------|------|-------------|
   * | `todoId` | `string` | UUID of the todo to toggle |
   * | `completed` | `boolean` | Current completion status |
   *
   * ### Behavior
   * - Updates todo's completed field to opposite value
   * - Optimistically updates UI state
   * - Shows error message on failure
   * - Real-time subscription handles sync
   *
   * ### Example
   * ```tsx
   * <input
   *   type="checkbox"
   *   checked={todo.completed}
   *   onChange={() => handleToggle(todo.id, todo.completed)}
   * />
   * ```
   */
// REF: Async function: const
  const handleToggle = async (todoId: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', todoId)
// CLOSE: Async function: const

// REF: Control flow
    if (error) {
      setError('Failed to update')
      console.error(error)
      return
    }
// CLOSE: Control flow

    // Optimistic update
// REF: Function: setTodos
    setTodos(todos.map(t =>
      t.id === todoId ? { ...t, completed: !completed } : t
    ))
  }
// CLOSE: Function: setTodos

  /**
   * DELETE TODO
   */
  /**
   * REF: handle-delete
   *
   * ## handleDelete
   *
   * Permanently deletes a todo item from the database after user confirmation.
   * Uses optimistic updates for immediate UI feedback.
   *
   * ### Parameters
   * | Name | Type | Description |
   * |------|------|-------------|
   * | `todoId` | `string` | UUID of the todo to delete |
   *
   * ### Behavior
   * - Prompts user for confirmation
   * - Deletes todo from database if confirmed
   * - Optimistically removes from UI
   * - Shows error message on failure
   * - RLS ensures user can only delete their own todos
   *
   * ### Example
   * ```tsx
   * <button onClick={() => handleDelete(todo.id)}>
   *   Delete
   * </button>
   * ```
   */
// REF: Async function: const
  const handleDelete = async (todoId: string) => {
    if (!confirm('Delete this todo?')) return
// CLOSE: Async function: const

// REF: Constant declaration
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      setError('Failed to delete')
      console.error(error)
      return
    }
// CLOSE: Control flow

    // Optimistic update
// REF: Function: setTodos
    setTodos(todos.filter(t => t.id !== todoId))
  }
// CLOSE: Function: setTodos

// REF: JSX return
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
// CLOSE: JSX return

      {/* Create Form - Client Component */}
// REF: JSX element
      <form onSubmit={handleCreateTodo} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Todo</h2>
// CLOSE: JSX element

// REF: JSX element
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </form>
// CLOSE: JSX element

      {/* Todos List */}
// REF: JSX element
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Todos</h2>
// CLOSE: JSX element

        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No todos yet. Create one above!
          </p>
        ) : (
          <div className="space-y-3">
            {todos.map(todo => (
              <div
                key={todo.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start gap-4"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, todo.completed)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />

// REF: JSX element
                <div className="flex-1">
                  <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {todo.description}
                    </p>
                  )}
                </div>
// CLOSE: JSX element

                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
                  aria-label="Delete todo"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

// REF: JSX element
      <div className="text-sm text-gray-500 text-center">
        💡 This page was server-rendered! Initial todos loaded before JavaScript.
        Real-time updates happen client-side.
      </div>
    </div>
  )
}
// CLOSE: JSX element

/**
 * SERVER vs CLIENT RENDERING COMPARISON
 *
 * PURE CLIENT (like /dashboard):
 * ```
 * Request → HTML (empty) → JS → Fetch data → Render
 * Time: ~2 seconds
 * SEO: Poor
 * ```
 *
 * SERVER + CLIENT (this page):
 * ```
 * Request → Server fetches → HTML (with data) → Hydrate → Interactive
 * Time: ~500ms
 * SEO: Good
 * ```
 *
 * WHEN TO USE WHICH:
 * - Pure Client: Simple, learning, internal tools
 * - Server + Client: Production, SEO needed, better UX
 */

/**
 * PROGRESSIVE ENHANCEMENT
 *
 * Even without JavaScript, user sees content!
 *
 * 1. Server renders HTML with todos
 * 2. User sees content (works without JS!)
 * 3. JavaScript loads
 * 4. React hydrates (makes interactive)
 * 5. Real-time starts working
 *
 * Graceful degradation for accessibility!
 */

/**
 * OPTIMISTIC UPDATES
 *
 * Update UI immediately before server confirms
 *
 * ## Benefits
 * - Feels instant to user
 * - No waiting for server response
 * - Better perceived performance
 *
 * ROLLBACK ON ERROR:
 * - Save previous state
 * - Revert if server returns error
 * - Show error message
 * - Keeps UI in sync with database
 */
