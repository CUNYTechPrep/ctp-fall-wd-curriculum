/**
 * REF: User Todo Dashboard Page
 *
 * Main application page where authenticated users manage their todos.
 * Handles CRUD operations, real-time updates, and RLS-protected queries.
 *
 * CLOSE: Protected route. Shows todo creation form and list of user's todos.
 * Demonstrates full Supabase integration with real-time subscriptions.
 *
 * PAGE STRUCTURE:
 * | `Section` | Purpose |
 * |---------|---------|
 * | `Header` | Page title "My Todos" |
 * | Error Alert | Display operation errors |
 * | Create Form | Input fields for new todo |
 * | Todos List | Grid/list of existing todos |
 * | Empty State | Message when no todos exist |
 *
 * ## Functionality
 *
 * | Operation | HTTP Method | SQL |
 * |-----------|-------------|-----|
 * | Fetch todos | `GET` | `SELECT * FROM todos WHERE user_id = auth.uid()` |
 * | Create todo | `POST` | `INSERT INTO todos (...) VALUES (...)` |
 * | Toggle complete | `PATCH` | `UPDATE todos SET completed = !completed WHERE id = ?` |
 * | Delete todo | `DELETE` | `DELETE FROM todos WHERE id = ?` |
 *
 * ## State Management
 *
 * | State | Type | Purpose |
 * |-------|------|---------|
 * | `todos` | `Todo[]` | All user's todos |
 * | `loading` | `boolean` | Initial data load |
 * | `error` | `string` | Operation error messages |
 * | `title` | `string` | Create form title input |
 * | `description` | `string` | Create form description input |
 * | `isPublic` | `boolean` | Create form visibility toggle |
 *
 * ## Lifecycle
 *
 * 1. Component mounts
 * 2. Check auth status via `useAuth()` hook
 * 3. Fetch todos from PostgreSQL via Supabase client
 * 4. Subscribe to real-time changes
 * 5. Render todos list with current data
 * 6. User can create, toggle, or delete todos
 * 7. All operations go through Supabase client API
 * 8. Real-time subscription fires on database changes
 * 9. Todos refetch and UI updates
 * 10. Component unmounts, unsubscribe from channel
 *
 * ROW LEVEL SECURITY:
 * ```sql
 * CREATE POLICY "Users see own todos"
 * ON todos FOR SELECT
 * USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users update own todos"
 * ON todos FOR UPDATE
 * USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users delete own todos"
 * ON todos FOR DELETE
 * USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users insert own todos"
 * ON todos FOR INSERT
 * WITH CHECK (auth.uid() = user_id);
 * ```
 * Security enforced at database level, not in application!
 *
 * REAL-TIME SUBSCRIPTIONS:
 * - PostgreSQL LISTEN/NOTIFY underneath
 * - Supabase broadcasts changes via WebSocket
 * - Filters by user_id in subscription
 * - Events: INSERT, UPDATE, DELETE
 * - Low latency (usually < 100ms)
 * - Refetch on any change
 *
 * SUPABASE OPERATIONS:
 * ```typescript
 * // SELECT
 * .from('todos').select('*')
 *   .eq('user_id', user.id)
 *   .order('created_at', { ascending: false })
 *
 * // INSERT
 * .from('todos').insert({
 *   user_id, title, description, is_public, completed: false
 * }).select().single()
 *
 * // UPDATE
 * .from('todos').update({ completed: !completed })
 *   .eq('id', todoId)
 *
 * // DELETE
 * .from('todos').delete().eq('id', todoId)
 *
 * // SUBSCRIBE
 * .channel('todos-changes').on(
 *   'postgres_changes',
 *   { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${userId}` },
 *   callback
 * ).subscribe()
 * ```
 *
 * ## Error Handling
 * | `Scenario` | `Error` | `Handling` |
 * |----------|-------|----------|
 * | No todos | `None` | Shows empty state message |
 * | RLS violation | "policy violation" | Shows error, keeps data |
 * | Network error | Connection error | Shows error message |
 * | Validation error | Missing title | Shows error before submit |
 *
 * FILE REFERENCES:
 * - ../lib/supabase.ts - Supabase client
 * - ../contexts/AuthContext.tsx - useAuth() hook
 * - ../components/TodoList.tsx - Todo list display
 * - ../components/TodoForm.tsx - Todo creation form
 * - ../App.tsx - Route definition
 *
 * ## Key Concepts
 * - Client-side CRUD without backend server
 * - Real-time data synchronization
 * - Row Level Security at database
 * - JWT token in every request
 * - Optimistic updates possible
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

/**
 * TODO TYPE
 *
 * Could import from generated database.types.ts
 * For simplicity, defining inline here
 */
interface Todo {
  id: string
  user_id: string
  title: string
  description?: string | null
  completed: boolean
  is_public: boolean
  tags?: string[] | null
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  /**
   * AUTH REDIRECT
   */
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin')
    }
  }, [user, authLoading, navigate])

  /**
   * FETCH TODOS FROM POSTGRESQL
   *
   * Supabase query from browser
   *
   * SUPABASE CLIENT QUERY:
   * - .from('todos'): Select table
   * - .select('*'): Get all columns
   * - .eq('user_id', user.id): WHERE user_id = user.id
   * - .order('created_at', { ascending: false }): ORDER BY
   *
   * RLS IN ACTION:
   * Even though we query all todos, RLS automatically filters:
   * ```sql
   * SELECT * FROM todos
   * WHERE user_id = auth.uid() OR is_public = true
   * ```
   *
   * User only sees their own data!
   */
  useEffect(() => {
    if (!user) return

    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error:', error)
        setError('Failed to load todos')
      } else {
        setTodos(data || [])
      }

      setLoading(false)
    }

    fetchTodos()

    /**
     * REAL-TIME SUBSCRIPTION
     *
     * Listen to database changes in real-time
     *
     * SUPABASE REALTIME:
     * - PostgreSQL LISTEN/NOTIFY under the hood
     * - Broadcasts changes to all connected clients
     * - Filter at database level
     * - Low latency, high performance
     *
     * ## Events
     * - INSERT: New row created
     * - UPDATE: Row modified
     * - DELETE: Row removed
     * - * (all): Listen to all events
     */
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
          console.log('Todo changed:', payload)
          fetchTodos() // Refetch on any change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  /**
   * CREATE TODO
   *
   * Insert into PostgreSQL via Supabase
   *
   * SUPABASE INSERT:
   * - .insert(): Add new row
   * - .select().single(): Return inserted row
   * - Auto-generates UUID
   * - RLS validates user_id matches auth.uid()
   */
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !title.trim()) return

    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        is_public: isPublic,
        completed: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error:', error)
      setError('Failed to create todo')
      return
    }

    // Real-time will update, or manually add
    setTodos([data, ...todos])

    // Reset form
    setTitle('')
    setDescription('')
    setIsPublic(false)
  }

  /**
   * UPDATE TODO
   *
   * Modify existing row
   *
   * RLS CHECK:
   * - Policy ensures user_id = auth.uid()
   * - Cannot update other users' todos
   * - Database blocks unauthorized updates
   */
  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', todoId)

    if (error) {
      console.error('Error:', error)
      setError('Failed to update todo')
    }

    // Update local state optimistically
    setTodos(todos.map(t =>
      t.id === todoId ? { ...t, completed: !completed } : t
    ))
  }

  /**
   * DELETE TODO
   *
   * Remove from database
   *
   * ## Cascade Delete
   * - If attachments have ON DELETE CASCADE
   * - They're automatically deleted too
   * - Must delete files from Storage separately!
   */
  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Delete this todo?')) return

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)

    if (error) {
      console.error('Error:', error)
      setError('Failed to delete todo')
      return
    }

    // Update local state
    setTodos(todos.filter(t => t.id !== todoId))
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">My Todos</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Create Form */}
        <form onSubmit={handleCreateTodo} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Create New Todo</h2>

          {/** REF: create-todo-form-fields
           * Form fields for creating a new todo item.
           * Includes title input, description textarea, and public checkbox.
           */}
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            {/** REF: description-textarea-field
             * Textarea for optional todo description.
             * Provides 3 rows for detailed input.
             */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {/* CLOSE: description-textarea-field */}

            {/** REF: public-checkbox-field
             * Checkbox to mark todo as public.
             * Toggles visibility for other users.
             */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Make public</span>
            </label>
            {/* CLOSE: public-checkbox-field */}

                  <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Todo
            </button>
          </div>
          {/* CLOSE: create-todo-form-fields */}
        </form>

              {/* Todos List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Todos</h2>

          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No todos yet. Create one above!
            </p>
          ) : (
                  <div className="space-y-3">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className="p-4 bg-gray-50 rounded-lg flex items-start gap-4"
                >
                        <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id, todo.completed)}
                    className="mt-1 w-5 h-5"
                  />

                        <div className="flex-1">
                    <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                    )}
                          {todo.tags && todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {todo.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

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
    </div>
  )
}

/**
 * SUPABASE ERROR HANDLING
 *
 * All Supabase operations return { data, error }
 *
 * ALWAYS check error:
 * ```typescript
 * const { data, error } = await supabase.from('todos').select()
 *
 * if (error) {
 *   console.error(error)
 *   // Handle error
 *   return
 * }
 *
 * // Safe to use data
 * ```
 *
 * Common errors:
 * - "new row violates row-level security policy": RLS blocked operation
 * - "duplicate key value": Unique constraint violation
 * - "null value in column": NOT NULL constraint
 * - "foreign key constraint": Referenced row doesn't exist
 */

/**
 * TYPE GENERATION
 *
 * Generate types from database:
 * ```bash
 * npx supabase gen types typescript --project-id YOUR_PROJECT > src/lib/database.types.ts
 * ```
 *
 * Then import and use:
 * ```typescript
 * import type { Database } from '../lib/database.types'
 *
 * type Todo = Database['public']['Tables']['todos']['Row']
 *
 * const [todos, setTodos] = useState<Todo[]>([])
 * ```
 *
 * Full autocomplete and type safety!
 */

/**
 * ADVANCED POSTGRESQL QUERIES
 *
 * Supabase client supports advanced features:
 *
 * ```typescript
 * // Full-text search
 * .textSearch('title', 'search term')
 *
 * // Array contains
 * .contains('tags', ['urgent'])
 *
 * // Range queries
 * .gte('created_at', yesterday)
 * .lte('created_at', today)
 *
 * // Joins
 * .select('*, user_profiles(*)')
 *
 * // Aggregations
 * .select('*', { count: 'exact' })
 *
 * // Pagination
 * .range(0, 9) // First 10 items
 *
 * // RPC (call PostgreSQL functions)
 * .rpc('search_todos', { search_term: 'term' })
 * ```
 */

/**
 * REF: dashboard-data-flow
 *
 * ## Data Flow in Dashboard
 *
 * ### Initial Load
 * 1. Component mounts
 * 2. useEffect checks auth (redirect if not)
 * 3. Another useEffect sets up listener
 * 4. Supabase subscribes to user's todos
 * 5. Returns current data immediately
 * 6. Continues listening for changes
 *
 * ### Real-Time Updates
 * When another tab/device updates a todo:
 * 1. PostgreSQL LISTEN notifies subscriptions
 * 2. Supabase sends update via WebSocket
 * 3. Listener callback fires
 * 4. setTodos updates state
 * 5. Component re-renders with new data
 *
 * ### RLS Security
 * Query automatically filters by user:
 * ```sql
 * WHERE user_id = current_user_id
 * ```
 * - Database enforces at query time
 * - Cannot see other users' todos
 * - Cannot access other users' data
 * - Even admin can't see without RLS bypass
 *
 * CLOSE: dashboard-data-flow
 */

