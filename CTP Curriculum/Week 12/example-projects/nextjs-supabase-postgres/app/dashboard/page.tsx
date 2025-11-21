/**
 * Dashboard Page - Supabase Todo Management
 *
 * REF:
 * Client component demonstrating full CRUD operations with real-time updates.
 * Shows database queries, real-time subscriptions, and Row Level Security in action.
 *
 * | Feature | `Implementation` | Benefit |
 * |---------|---|---|
 * | CRUD ops | Supabase client | Type-safe queries |
 * | Real-time | PostgreSQL LISTEN/NOTIFY | Instant updates |
 * | `RLS` | Database policies | Security at source |
 * | Error handling | {data, error} pattern | Never crashes |
 *
 * **Supabase Query Pattern:**
 * - Chainable: `.from().select().eq()`
 * - Returns: `{ data, error }`
 * - Types: Auto-inferred from schema
 * - Security: RLS enforced automatically
 */

'use client'

// REF: Import statement
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
// CLOSE: Import statement

// Type alias for cleaner code
// REF: Type definition
type Todo = Database['public']['Tables']['todos']['Row']
type NewTodo = Database['public']['Tables']['todos']['Insert']
// CLOSE: Type definition

// REF: Function: export
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
// CLOSE: Function: export

  /**
   * STATE MANAGEMENT
   *
   * REF: Manage todos and UI state
   *
   * | `State` | Type | Purpose |
   * |-------|------|---------|
   * | `todos` | `Todo[]` | All user's todos |
   * | `loading` | `boolean` | Initial fetch state |
   * | `error` | `string` | User-facing errors |
   * | title, description, etc | `string[]` | Form inputs |
   */
// REF: Constant declaration
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
// CLOSE: Constant declaration

  /**
   * FORM STATE
   *
   * REF: Input fields for new todo creation
   */
// REF: Constant declaration
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tags, setTags] = useState<string[]>([])
// CLOSE: Constant declaration

  /**
   * AUTH PROTECTION
   *
   * REF: Redirect unauthenticated users
   */
// REF: Function: useEffect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])
// CLOSE: Function: useEffect

  /**
   * FETCH TODOS
   *
   * REF: Query todos from Supabase with RLS filtering
   *
   * | `Method` | `Clause` | `Example` |
   * |--------|--------|---------|
   * | `from()` | SELECT table | .from('todos') |
   * | `select()` | SELECT cols | .select('*') or .select('id,title') |
   * | `eq()` | WHERE = | .eq('user_id', user.id) |
   * | `order()` | ORDER BY | .order('created_at', {ascending: false}) |
   */
// REF: Function: useEffect
  useEffect(() => {
    if (!user) return
// CLOSE: Function: useEffect

// REF: Async function: const
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
// CLOSE: Async function: const

// REF: Control flow
      if (error) {
        console.error('Error fetching todos:', error)
        setError('Failed to load todos')
      } else {
        setTodos(data || [])
      }
// CLOSE: Control flow

      setLoading(false)
    }

    fetchTodos()
  }, [user, supabase])

  /**
   * REAL-TIME SUBSCRIPTION
   *
   * REF: Listen for database changes in real-time
   *
   * | `Event` | `Trigger` | `Action` |
   * |-------|---------|--------|
   * | `INSERT` | New todo | Add to state |
   * | `UPDATE` | Todo modified | Update in state |
   * | `DELETE` | Todo removed | Remove from state |
   * | * | All events | Refetch data |
   *
   * **Cleanup:** Remove channel on unmount to prevent memory leaks
   */
// REF: Function: useEffect
  useEffect(() => {
    if (!user) return
// CLOSE: Function: useEffect

// REF: Constant: channel
    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Todo change detected:', payload)
// CLOSE: Constant: channel

          // Refetch todos on any change
          // More sophisticated approach: update state directly based on payload
          fetchTodosAndUpdate()
        }
      )
      .subscribe()

// REF: Async function: const
    const fetchTodosAndUpdate = async () => {
      const { data } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
// CLOSE: Async function: const

// REF: Control flow
      if (data) setTodos(data)
    }
// CLOSE: Control flow

// REF: Function: return
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])
// CLOSE: Function: return

  /**
   * CREATE TODO HANDLER
   *
   * REF: Insert new todo into PostgreSQL
   *
   * | `Method` | Purpose | `Return` |
   * |--------|---------|--------|
   * | `.insert()` | Add row | {data, error} |
   * | `.select()` | Get inserted row | Include in response |
   * | `.single()` | Unwrap array | Single object instead of array |
   */
// REF: Async function: const
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()
// CLOSE: Async function: const

// REF: JSX return
    if (!user || !title.trim()) return
// CLOSE: JSX return

// REF: Constant: newTodo
    const newTodo: NewTodo = {
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      is_public: isPublic,
      tags: tags.length > 0 ? tags : null,
      completed: false,
    }
// CLOSE: Constant: newTodo

// REF: Constant declaration
    const { data, error } = await supabase
      .from('todos')
      .insert(newTodo)
      .select()
      .single()
// CLOSE: Constant declaration

// REF: Control flow
    if (error) {
      console.error('Error creating todo:', error)
      setError('Failed to create todo')
      return
    }
// CLOSE: Control flow

    // Real-time subscription will update the list
    // Or manually add to state for instant feedback
    setTodos([data, ...todos])

    // Reset form
    setTitle('')
    setDescription('')
    setIsPublic(false)
    setTags([])
  }

  /**
   * TOGGLE COMPLETION
   *
   * REF: Update todo's completed status
   *
   * **Pattern:**
   * - .update(fields): Set new values
   * - .eq('id', todoId): WHERE clause
   * - Real-time subscription updates UI
   */
// REF: Async function: const
  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', todoId)
// CLOSE: Async function: const

// REF: Control flow
    if (error) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo')
    }
// CLOSE: Control flow

    // Real-time subscription will update UI
  }

  /**
   * DELETE TODO
   *
   * REF: Remove todo from database
   *
   * **CASCADE DELETE:**
   * - Related attachments auto-deleted
   * - Must manually delete Storage files
   * - Check database schema for foreign keys
   */
// REF: Async function: const
  const handleDeleteTodo = async (todoId: string) => {
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
      console.error('Error deleting todo:', error)
      setError('Failed to delete todo')
    }
// CLOSE: Control flow

    // Real-time subscription will remove from UI
  }

  /**
   * LOADING STATES
   */
// REF: Control flow
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }
// CLOSE: Control flow

// REF: Control flow
  if (!user) {
    return null
  }
// CLOSE: Control flow

  /**
   * MAIN RENDER
   *
   * Shows todo creation form and list of todos
   */
// REF: JSX return
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">My Todos</h1>
// CLOSE: JSX return

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create Todo Form */}
// REF: JSX element
      <form onSubmit={handleCreateTodo} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Create New Todo</h2>
// CLOSE: JSX element

// REF: JSX element
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="What needs to be done?"
            />
          </div>
// CLOSE: JSX element

// REF: JSX element
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="Add more details..."
            />
          </div>
// CLOSE: JSX element

// REF: JSX element
          <div className="flex items-center gap-2">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isPublic" className="text-sm cursor-pointer">
              Make public
            </label>
          </div>
// CLOSE: JSX element

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Todo
          </button>
        </div>
      </form>

      {/* Todos List */}
// REF: JSX element
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
                  onChange={() => handleToggleComplete(todo.id, todo.completed)}
                  className="mt-1 w-5 h-5"
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
                  {todo.tags && todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {todo.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
// CLOSE: JSX element

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * POSTGRESQL ADVANTAGES
 *
 * REF: Advanced database features available via Supabase
 *
 * | Feature | Benefit | `Example` |
 * |---------|---------|---------|
 * | `Schema` | Type safety | Defined columns and types |
 * | `Relationships` | Data integrity | Foreign keys enforced |
 * | Full-text search | Advanced queries | .textSearch('column', term) |
 * | Array ops | Flexible queries | .contains('tags', ['urgent']) |
 * | `Joins` | Related data | .select('*, user_profiles(*)') |
 * | `Transactions` | `Atomicity` | All-or-nothing operations |
 */

/**
 * ROW LEVEL SECURITY IN ACTION
 *
 * REF: Database-level security transparent to client
 *
 * **Client code:**
 * ```typescript
 * supabase.from('todos').select('*')
 * ```
 *
 * **Database applies (transparently):**
 * ```sql
 * WHERE user_id = auth.uid() OR is_public = true
 * ```
 */

/**
 * ERROR HANDLING PATTERN
 *
 * REF: Supabase enforces error handling with {data, error} pattern
 *
 * **Correct pattern:**
 * ```typescript
 * const { data, error } = await supabase.from('todos').select()
 *
 * if (error) {
 *   console.error(error)
 *   return
 * }
 *
 * // Safe to use data
 * setTodos(data)
 * ```
 */
