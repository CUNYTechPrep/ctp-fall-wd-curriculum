/**
 * REF: Dashboard Page - Todo Management & Real-Time Updates
 *
 * Main authenticated page where users create, manage, and complete todos.
 *
 * ## Architecture
 *
 * ### Data Flow
 * ```
 * User lands on /dashboard
 *    ↓
 * Auth check via useEffect
 *    ↓
 * Firestore listener subscribes to user's todos
 *    ↓
 * Real-time updates as todos change
 *    ↓
 * Updates displayed instantly
 * ```
 *
 * ## React vs Next.js Differences
 *
 * | `Aspect` | React (This) | `Next.js` |
 * |--------|-------------|---------|
 * | **Data Fetch** | Client-side (useEffect) | Server-side (getServerSideProps) |
 * | **Components** | All client | Server Components + Client |
 * | **Loading** | Must handle manually | Automatic with Suspense |
 * | **Initial HTML** | Empty <div> | Pre-populated content |
 * | **Speed** | Slower initial (more JS) | Faster initial (HTML ready) |
 * | **Simplicity** | `Simpler` | More complex |
 *
 * ## Real-Time Firestore Pattern
 *
 * ```typescript
 * // Subscribe to real-time changes
 * onSnapshot(query, (snapshot) => {
 *   // Called immediately with current data
 *   // Called again whenever data changes
 *   updateUI(snapshot.data)
 * })
 *
 * // Automatic cleanup
 * return () => unsubscribe()  // When component unmounts
 * ```
 *
 * CLOSE
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import { Todo } from '../types'
import TodoList from '../components/TodoList'
import TodoForm from '../components/TodoForm'

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // REF: STATE MANAGEMENT
/**
   * STATE MANAGEMENT
   *
   * Todos state managed here, form state in TodoForm component
   */
// CLOSE
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // REF: AUTHENTICATION REDIRECT
/**
   * AUTHENTICATION REDIRECT
   *
   * If not logged in, redirect to signin
   *
   * CLIENT-SIDE ROUTE PROTECTION:
   * - Happens in browser (not server)
   * - User might briefly see protected content
   * - Real security is in Firestore rules!
   *
   * This is UX protection, not security protection
   */
// CLOSE
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin')
    }
  }, [user, authLoading, navigate])

  // REF: REAL-TIME TODOS SUBSCRIPTION
/**
   * REAL-TIME TODOS SUBSCRIPTION
   *
   * Subscribe to user's todos with Firestore onSnapshot
   *
   * CLIENT-SIDE REAL-TIME:
   * - Firebase SDK connects via WebSocket
   * - Receives updates from Firestore
   * - No polling needed
   * - Low latency
   *
   * FIRESTORE QUERY:
   * - collection(): Reference to collection
   * - query(): Build query with filters
   * - where(): Filter by user_id
   * - orderBy(): Sort by created_at
   * - onSnapshot(): Listen for changes
   *
   * ## Cleanup
   * - onSnapshot returns unsubscribe function
   * - Call in cleanup to stop listening
   * - Prevents memory leaks
   */
// CLOSE
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const todosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Todo))

        setTodos(todosData)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching todos:', error)
        setError('Failed to load todos')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  // REF: TOGGLE COMPLETION
/**
   * TOGGLE COMPLETION
   *
   * Updates todo completion status in Firestore
   */
// CLOSE
  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'todos', todoId), {
        completed: !completed,
        updatedAt: Timestamp.now(),
      })
    } catch (error: any) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo')
    }
  }

  // REF: DELETE TODO
/**
   * DELETE TODO
   */
// CLOSE
  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Delete this todo?')) return

    try {
      await deleteDoc(doc(db, 'todos', todoId))
    } catch (error: any) {
      console.error('Error deleting todo:', error)
      setError('Failed to delete todo')
    }
  }
  // CLOSE: DELETE TODO

  // REF: LOADING STATES
/**
   * LOADING STATES
   */
// CLOSE
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // REF: MAIN RENDER
/**
   * MAIN RENDER
   *
   * Simple, clean UI with Tailwind CSS
   */
// CLOSE
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <nav className="flex gap-4">
            <a href="/feed" className="hover:text-blue-600">Feed</a>
            <a href="/messages" className="hover:text-blue-600">Messages</a>
            <a href="/settings" className="hover:text-blue-600">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-4xl font-bold mb-8">My Todos</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Create Todo Form */}
        <TodoForm userId={user!.uid} />

        {/* Todos List with Attachments */}
        <TodoList
          todos={todos}
          userId={user!.uid}
          onToggle={handleToggleComplete}
          onDelete={handleDeleteTodo}
        />
      </main>
    </div>
  )
}
// CLOSE: Dashboard

// REF: REACT ROUTER NAVIGATION
/**
 * REACT ROUTER NAVIGATION
 *
 * Using <a> tags for simplicity in this example
 * For better UX, use <Link> from react-router-dom:
 *
 * ```typescript
 * import { Link } from 'react-router-dom'
 *
 * <Link to="/feed">Feed</Link>
 * ```
 *
 * Benefits:
 * - No page reload
 * - Preserves app state
 * - Faster navigation
 */
// CLOSE
