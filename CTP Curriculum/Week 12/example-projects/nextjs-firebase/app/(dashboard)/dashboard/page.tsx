/**
 * REF: dashboard-page
 *
 * # Dashboard Page - Personal Todo Management
 *
 * Main page where users manage their personal todos.
 *
 * ## Key Concepts
 *
 * 1. **React Hooks** - `useState`, `useEffect` for state
 * 2. **Real-time Firestore** - Live data updates
 * 3. **CRUD Operations** - Create, Read, Update, Delete
 * 4. **Optimistic UI** - Immediate feedback
 * 5. **Error Handling** - User-friendly messages
 *
 * ## Real-Time Updates
 *
 * Uses `onSnapshot()` instead of `getDocs()`:
 * - Listens for changes continuously
 * - Updates UI automatically
 * - Works across devices instantly
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  subscribeToUserTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '@/lib/firebase/firestore'
import { Todo } from '@/types'
import TodoList from '@/components/todos/TodoList'
import TodoForm from '@/components/todos/TodoForm'

/**
 * REF: dashboard-component
 *
 * ## DashboardPage Component
 *
 * Main dashboard component.
 */
export default function DashboardPage() {
  /**
   * Get authenticated user from context.
   */
  const { user } = useAuth()

  /**
   * REF: dashboard-state
   *
   * ## State Management
   *
   * Track todos and UI state.
   *
   * ### State Variables
   *
   * - `todos`: Array of user's todos (real-time)
   * - `loading`: Initial data fetch in progress
   * - `error`: Error message to display
   */
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // CLOSE: dashboard-state

  /**
   * REF: realtime-subscription
   *
   * ## Real-Time Subscription Effect
   *
   * Sets up live listener when component mounts.
   *
   * ### How It Works
   *
   * 1. `subscribeToUserTodos()` returns unsubscribe function
   * 2. Pass callback that updates state on changes
   * 3. Cleanup function unsubscribes on unmount
   *
   * ### Why Cleanup Matters
   *
   * - **Prevents memory leaks**
   * - Stops listening when navigating away
   * - Firestore charges per read (avoid orphaned listeners)
   *
   * ### Dependency Array
   *
   * `[user?.uid]` means:
   * - Re-run if user ID changes
   * - Only once if user stays same
   */
  useEffect(() => {
    if (!user) return

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserTodos(user.uid, (updatedTodos) => {
      setTodos(updatedTodos)
      setLoading(false)
    })

    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe()
  }, [user?.uid])
  // CLOSE: realtime-subscription

  /**
   * REF: create-todo-handler
   *
   * ## Create Todo Handler
   *
   * Called when user submits form.
   *
   * ### Parameters
   *
   * - `todoData`: Partial todo data (title, description, etc.)
   *
   * ### Optimistic Updates
   *
   * We **don't** manually update todos array:
   * - Real-time listener handles it automatically
   * - Ensures database and UI stay in sync
   * - No stale data issues
   *
   * ### Error Handling
   *
   * - Try/catch prevents crashes
   * - Errors shown to user via state
   */
  const handleCreateTodo = async (todoData: Partial<Todo>) => {
    if (!user) return

    try {
      setError('')
      await createTodo(user.uid, todoData)
      // No need to update todos array - real-time listener handles it!
    } catch (err: any) {
      setError(err.message || 'Failed to create todo')
      console.error('Error creating todo:', err)
    }
  }
  // CLOSE: create-todo-handler

  /**
   * REF: update-todo-handler
   *
   * ## Update Todo Handler
   *
   * Called when user toggles completion or edits a todo.
   *
   * ### Parameters
   *
   * - todoId: The ID of the todo to update
   * - updates: Object containing fields to update
   *
   * ### Partial Updates
   *
   * - We only send changed fields, not the entire todo
   * - More efficient and prevents accidental data loss
   */
  const handleUpdateTodo = async (todoId: string, updates: Partial<Todo>) => {
    try {
      setError('')
      await updateTodo(todoId, updates)
    } catch (err: any) {
      setError(err.message || 'Failed to update todo')
      console.error('Error updating todo:', err)
    }
  }
  // CLOSE: update-todo-handler

  /**
   * REF: delete-todo-handler
   *
   * ## Delete Todo Handler
   *
   * Called when user clicks delete button.
   *
   * ### Confirmation
   *
   * - In production, you might want to add a confirmation dialog
   * - Consider a "soft delete" (archived: true) instead of hard delete
   */
  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return

    try {
      setError('')
      await deleteTodo(todoId)
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo')
      console.error('Error deleting todo:', err)
    }
  }
  // CLOSE: delete-todo-handler

  /**
   * REF: toggle-complete-handler
   *
   * ## Toggle Completion Handler
   *
   * Convenience function for the common action of marking todo complete/incomplete.
   */
  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    await handleUpdateTodo(todoId, { completed })
  }
  // CLOSE: toggle-complete-handler

  /**
   * REF: loading-state-check
   *
   * ## Loading State Check
   *
   * Show a loading spinner while initial data fetches.
   * This only shows on first load, not for real-time updates.
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading your todos...</div>
      </div>
    )
  }
  // CLOSE: loading-state-check

  /**
   * REF: main-dashboard-render
   *
   * ## Main Render
   *
   * ### Structure
   *
   * 1. Page header with title and stats
   * 2. Error message (if any)
   * 3. Form to create new todos
   * 4. List of existing todos with actions
   *
   * ### Component Composition
   *
   * - TodoForm: Handles input and validation for new todos
   * - TodoList: Displays todos with edit/delete/complete actions
   * - Both are reusable components used elsewhere in the app
   */
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Todos</h1>
        <p className="text-gray-600 dark:text-gray-300">
          You have {todos.filter(t => !t.completed).length} active todos and{' '}
          {todos.filter(t => t.completed).length} completed
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create Todo Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Create New Todo</h2>
        <TodoForm onSubmit={handleCreateTodo} />
      </div>

      {/* Todos List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Todos</h2>
        {todos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No todos yet. Create one above to get started!
          </p>
        ) : (
          <TodoList
            todos={todos}
            onToggleComplete={handleToggleComplete}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        )}
      </div>
    </div>
  )
  // CLOSE: main-dashboard-render
}
// CLOSE: dashboard-component
// CLOSE: dashboard-page
