/**
 * REF: use-todos-hook
 *
 * # useTodos Hook
 *
 * Reusable custom hook that encapsulates all todo-related operations.
 *
 * ## Key Concepts
 *
 * - **Custom React hooks** - Functions that use other hooks
 * - **Logic reusability** - Use in multiple components
 * - **State management** - Todos, loading, errors
 * - **Real-time subscriptions** - Live data from Firestore
 * - **CRUD operations** - Create, Read, Update, Delete
 *
 * ## What is a Custom Hook?
 *
 * A JavaScript function that:
 * - Starts with "use" prefix
 * - Can use other React hooks
 * - Returns data and functions
 * - Can be used in multiple components
 *
 * ## Benefits of Custom Hooks
 *
 * | Benefit | Description |
 * |---------|-------------|
 * | `DRY` | Don't Repeat Yourself - share logic |
 * | `Testable` | Test hook independently from UI |
 * | `Composable` | Combine multiple hooks together |
 * | `Separated` | UI focuses on rendering, logic in hook |
 * | `Reusable` | Same hook in different components |
 *
 * ## Usage Example
 *
 * ```typescript
 * function Dashboard() {
 *   const { user } = useAuth()
 *   const { todos, loading, createTodo, updateTodo } = useTodos(user.uid)
 *
 *   if (loading) return <LoadingSpinner />
 *
 *   return (
 *     <div>
 *       <TodoForm onSubmit={createTodo} />
 *       <TodoList todos={todos} onUpdate={updateTodo} />
 *     </div>
 *   )
 * }
 * ```
 *
 * Much cleaner than putting all logic in the component!
 */
// CLOSE: use-todos-hook

import { useState, useEffect } from 'react'
import {
  subscribeToUserTodos,
  createTodo as createTodoFirestore,
  updateTodo as updateTodoFirestore,
  deleteTodo as deleteTodoFirestore,
} from '@/lib/firebase/firestore'
import type { Todo } from '@/types'

/**
 * REF: use-todos-return-type
 *
 * # useTodos Return Type
 *
 * Defines the data and functions returned by the hook.
 *
 * ## Return Interface
 *
 * | `Property` | Type | Description |
 * |----------|------|-------------|
 * | `todos` | `Todo[]` | Array of user's todos |
 * | `loading` | `boolean` | True while fetching initial data |
 * | `error` | `string` or `null` | Error message if operation fails |
 * | `createTodo` | `function` | Create new todo |
 * | `updateTodo` | `function` | Update existing todo |
 * | `deleteTodo` | `function` | Delete a todo |
 * | `toggleComplete` | `function` | Toggle completion status |
 *
 * ## What the Hook Encapsulates
 *
 * - **State management** - Todos array, loading, error states
 * - **Real-time subscription** - Firestore onSnapshot listener
 * - **CRUD operations** - Create, Read, Update, Delete
 * - **Error handling** - Catches and reports errors
 * - **Cleanup** - Unsubscribes on unmount
 */
interface UseTodosReturn {
  todos: Todo[]
  loading: boolean
  error: string | null
  createTodo: (todoData: Partial<Todo>) => Promise<void>
  updateTodo: (todoId: string, updates: Partial<Todo>) => Promise<void>
  deleteTodo: (todoId: string) => Promise<void>
  toggleComplete: (todoId: string, completed: boolean) => Promise<void>
}
// CLOSE: use-todos-return-type

/**
 * REF: use-todos-function
 *
 * # useTodos Hook Function
 *
 * Main hook that manages all todo-related operations.
 *
 * ## Parameters
 *
 * - userId: ID of user whose todos to manage
 *
 * ## Returns
 *
 * Object with:
 * - todos: Live array of user's todos
 * - loading: Whether data is loading
 * - error: Any error that occurred
 * - createTodo(): Create new todo
 * - updateTodo(): Modify existing todo
 * - deleteTodo(): Remove todo
 * - toggleComplete(): Toggle done status
 *
 * ## How It Works
 *
 * 1. **Initial mount** - Set loading=true, subscribe to user's todos
 * 2. **Data arrives** - Update todos array, set loading=false
 * 3. **Live updates** - Firestore listener updates todos in real-time
 * 4. **CRUD operations** - Call Firestore functions, listener updates UI
 * 5. **Unmount** - Unsubscribe from listener
 *
 * @param userId - ID of user whose todos to manage
 * @returns Object with todos data and operations
 */
export function useTodos(userId: string): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * REF: real-time-subscription-effect
   *
   * # Real-Time Subscription Effect
   *
   * Subscribe to user's todos when hook mounts, clean up on unmount.
   *
   * ## How It Works
   *
   * 1. **Mount** - useEffect runs, calls subscribeToUserTodos()
   * 2. **Subscribe** - Firestore onSnapshot listener starts
   * 3. **Updates** - Whenever todos change, callback fires
   * 4. **Unmount** - useEffect cleanup runs, unsubscribe() called
   *
   * ## Automatic Cleanup
   *
   * - Effect cleanup function prevents memory leaks
   * - Unsubscribe when component unmounts
   * - Unsubscribe when userId changes (dependency)
   * - No dangling listeners
   *
   * ## Real-Time Behavior
   *
   * - User creates todo → Listener fires → todos array updates → UI re-renders
   * - User edits todo → Listener fires → todos array updates → UI re-renders
   * - User deletes todo → Listener fires → todos array updates → UI re-renders
   * - All happens automatically without manual refresh
   *
   * ## Dependencies
   *
   * - [userId]: Only re-subscribe if userId changes
   * - Important for apps with multiple users
   */
  useEffect(() => {
    const unsubscribe = subscribeToUserTodos(userId, (updatedTodos) => {
      setTodos(updatedTodos)
      setLoading(false)
      setError(null)
    })

    return () => unsubscribe()
  }, [userId])
  // CLOSE: real-time-subscription-effect

  /**
   * REF: create-todo-operation
   *
   * # Create Todo Operation
   *
   * Wrapper around Firestore createTodo with error handling.
   *
   * ## Behavior
   *
   * 1. Clear any previous errors
   * 2. Call createTodoFirestore()
   * 3. Real-time listener automatically updates todos array
   * 4. Catch and store error if operation fails
   *
   * ## Error Handling
   *
   * - Errors are stored in state for UI display
   * - Error is also re-thrown for caller to handle
   * - Allows component to show success/error UI
   */
  const createTodo = async (todoData: Partial<Todo>) => {
    try {
      setError(null)
      await createTodoFirestore(userId, todoData)
      // Real-time subscription updates todos automatically
    } catch (err: any) {
      setError(err.message || 'Failed to create todo')
      throw err
    }
  }
  // CLOSE: create-todo-operation

  /**
   * REF: update-todo-operation
   *
   * # Update Todo Operation
   *
   * Wrapper around Firestore updateTodo with error handling.
   *
   * ## Behavior
   *
   * 1. Clear previous errors
   * 2. Call updateTodoFirestore()
   * 3. Real-time listener automatically updates todos array
   * 4. Catch and store error if operation fails
   */
  const updateTodo = async (todoId: string, updates: Partial<Todo>) => {
    try {
      setError(null)
      await updateTodoFirestore(todoId, updates)
    } catch (err: any) {
      setError(err.message || 'Failed to update todo')
      throw err
    }
  }
  // CLOSE: update-todo-operation

  /**
   * REF: delete-todo-operation
   *
   * # Delete Todo Operation
   *
   * Wrapper around Firestore deleteTodo with error handling.
   *
   * ## Behavior
   *
   * 1. Clear previous errors
   * 2. Call deleteTodoFirestore()
   * 3. Real-time listener automatically removes from todos array
   * 4. Catch and store error if operation fails
   */
  const deleteTodo = async (todoId: string) => {
    try {
      setError(null)
      await deleteTodoFirestore(todoId)
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo')
      throw err
    }
  }
  // CLOSE: delete-todo-operation

  /**
   * REF: toggle-completion-operation
   *
   * # Toggle Completion Operation
   *
   * Convenience method for toggling done status.
   *
   * ## Behavior
   *
   * - Calls updateTodo with inverted completion status
   * - Useful for UI buttons that toggle state
   * - Common operation extracted to avoid duplication
   *
   * ## Example
   *
   * ```typescript
   * // Instead of:
   * await updateTodo(todoId, { completed: !todo.completed })
   *
   * // Can do:
   * await toggleComplete(todoId, todo.completed)
   * ```
   */
  const toggleComplete = async (todoId: string, completed: boolean) => {
    await updateTodo(todoId, { completed: !completed })
  }
  // CLOSE: toggle-completion-operation

  /**
   * REF: hook-return-value
   *
   * # Hook Return Value
   *
   * Returns all data and functions needed by consuming components.
   *
   * ## Returned Object
   *
   * - todos: Current todos array (updates in real-time)
   * - loading: Whether initial data is loading
   * - error: Error message if operation failed
   * - createTodo: Function to create new todo
   * - updateTodo: Function to update existing todo
   * - deleteTodo: Function to delete todo
   * - toggleComplete: Function to toggle completion
   */
  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  }
  // CLOSE: hook-return-value
}

/**
 * BENEFITS OF CUSTOM HOOKS
 *
 * 1. **Reusability:**
 * Use in multiple components without duplicating logic
 *
 * 2. **Testability:**
 * Test hook logic separately from UI
 *
 * 3. **Composition:**
 * Combine multiple hooks
 *
 * 4. **Separation of Concerns:**
 * UI components focus on rendering
 * Hooks handle data and logic
 */

/**
 * ADVANCED PATTERNS
 *
 * Add pagination:
 * ```typescript
 * export function useTodos(userId: string, limit = 20) {
 *   const [page, setPage] = useState(0)
 *
 *   const loadMore = () => setPage(page + 1)
 *
 *   // Fetch with limit and offset
 *   // ...
 *
 *   return { todos, loading, loadMore, hasMore }
 * }
 * ```
 *
 * Add filtering:
 * ```typescript
 * export function useTodos(userId: string, filter?: {
 *   completed?: boolean
 *   tag?: string
 * }) {
 *   // Apply filter to query
 *   // ...
 * }
 * ```
 *
 * Add caching:
 * ```typescript
 * const cache = new Map()
 *
 * export function useTodos(userId: string) {
 *   if (cache.has(userId)) {
 *     setTodos(cache.get(userId))
 *   }
 *
 *   // Then subscribe for updates
 * }
 * ```
 */

/**
 * OTHER USEFUL HOOKS
 *
 * useDebounce:
 * ```typescript
 * export function useDebounce<T>(value: T, delay: number): T {
 *   const [debouncedValue, setDebouncedValue] = useState(value)
 *
 *   useEffect(() => {
 *     const timer = setTimeout(() => setDebouncedValue(value), delay)
 *     return () => clearTimeout(timer)
 *   }, [value, delay])
 *
 *   return debouncedValue
 * }
 * ```
 *
 * useLocalStorage:
 * ```typescript
 * export function useLocalStorage<T>(key: string, initialValue: T) {
 *   const [value, setValue] = useState<T>(() => {
 *     const stored = localStorage.getItem(key)
 *     return stored ? JSON.parse(stored) : initialValue
 *   })
 *
 *   useEffect(() => {
 *     localStorage.setItem(key, JSON.stringify(value))
 *   }, [key, value])
 *
 *   return [value, setValue] as const
 * }
 * ```
 *
 * useMediaQuery:
 * ```typescript
 * export function useMediaQuery(query: string): boolean {
 *   const [matches, setMatches] = useState(false)
 *
 *   useEffect(() => {
 *     const media = window.matchMedia(query)
 *     setMatches(media.matches)
 *
 *     const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
 *     media.addEventListener('change', listener)
 *
 *     return () => media.removeEventListener('change', listener)
 *   }, [query])
 *
 *   return matches
 * }
 * ```
 */
// CLOSE: use-todos-hook
