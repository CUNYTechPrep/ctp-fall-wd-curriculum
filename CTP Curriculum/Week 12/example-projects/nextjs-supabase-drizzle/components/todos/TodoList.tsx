/**
 * REF: component-overview
 *
 * # TodoList Component - Display with Drizzle Types
 *
 * Displays todos with perfect type inference from Drizzle schema. This component
 * demonstrates how Drizzle ORM provides automatic TypeScript types directly from
 * the database schema without manual type definitions.
 *
 * ## Key Concepts
 * - Type inference from schema using InferSelectModel
 * - Component composition with TodoItem
 * - List rendering patterns with filtering
 * - Separation of active vs completed todos
 *
 * ## Drizzle Type Inference
 * - `InferSelectModel` automatically generates TypeScript types from schema
 * - No manual type definitions needed
 * - Always in sync with database schema
 * - Perfect autocomplete in IDE
 * - Compile-time type safety
 */
// CLOSE: component-overview

'use client'

  /** REF: imports
   */
import { InferSelectModel } from 'drizzle-orm'
import { todos } from '@/lib/db/schema'
import TodoItem from './TodoItem'
  // CLOSE: imports

/**
 * REF: type-definition
 *
 * ## Todo Type from Schema
 *
 * `InferSelectModel` extracts the exact TypeScript type from the Drizzle schema.
 * This ensures the Todo type matches the database structure exactly.
 *
 * ### Type Inference Process
 * 1. Drizzle reads the `todos` schema definition
 * 2. `InferSelectModel` generates TypeScript type for SELECT queries
 * 3. Resulting type includes all columns with correct types
 *
 * ### Generated Type Structure
 * ```typescript
 * type Todo = {
 *   id: string
 *   userId: string
 *   title: string
 *   description: string | null
 *   completed: boolean
 *   isPublic: boolean
 *   tags: string[] | null
 *   createdAt: Date
 *   updatedAt: Date
 * }
 * ```
 *
 * ### Benefits
 * - No manual typing required
 * - Automatically updates when schema changes
 * - Prevents type drift between database and code
 */
type Todo = InferSelectModel<typeof todos>
// CLOSE: type-definition

/**
 * REF: props-interface
 *
 * ## TodoList Props Interface
 *
 * Defines the props this component accepts from its parent.
 *
 * | `Prop` | Type | Description |
 * |------|------|-------------|
 * | `todos` | `Todo[]` | Array of todo items to display |
 * | `onToggle` | `(todoId: string, completed: boolean) => Promise<void>` | Handler for toggling todo completion status |
 * | `onUpdate` | `(todoId: string, updates: Partial<Todo>) => Promise<void>` | Handler for updating todo fields |
 * | `onDelete` | `(todoId: string) => Promise<void>` | Handler for deleting a todo |
 *
 * ### Handler Functions
 * All handlers are async and return Promises because they perform database operations.
 *
 * ### Example Usage
 * ```typescript
 * <TodoList
 *   todos={userTodos}
 *   onToggle={handleToggle}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 * />
 * ```
 */
interface TodoListProps {
  todos: Todo[]
  onToggle: (todoId: string, completed: boolean) => Promise<void>
  onUpdate: (todoId: string, updates: Partial<Todo>) => Promise<void>
  onDelete: (todoId: string) => Promise<void>
}
// CLOSE: props-interface

/**
 * REF: component-function
 *
 * ## TodoList Component Function
 *
 * Main component that renders the list of todos, separated into active and completed sections.
 *
 * ### Props Destructuring
 * All props are destructured for cleaner code access.
 */
export default function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
// CLOSE: component-function

  /**
   * REF: todo-filtering
   *
   * ## Separate Todos by Completion Status
   *
   * Filters todos into two arrays for better UX and visual organization.
   *
   * ### Filter Operations
   * - `activeTodos`: Todos where `completed === false`
   * - `completedTodos`: Todos where `completed === true`
   *
   * ### Benefits
   * - Clear visual separation
   * - Users can focus on active tasks
   * - Completed tasks are visually de-emphasized
   *
   * ### Type Safety
   * TypeScript knows that `todo.completed` is a boolean from the Drizzle schema.
   * No need to check if the property exists.
   */
  const activeTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)
  // CLOSE: todo-filtering

  /**
   * REF: component-render
   *
   * ## Render Structure
   *
   * Three conditional sections:
   * 1. Active todos (if any exist)
   * 2. Completed todos (if any exist)
   * 3. Empty state (if no todos exist)
   */
  return (
    <div className="space-y-6">
      {/* CLOSE: component-render */}

      {/*
       * REF: active-todos-section
       *
       * ## Active Todos Section
       *
       * Displays uncompleted todos with full opacity and prominence.
       *
       * ### Conditional Rendering
       * Only renders if `activeTodos.length > 0`
       *
       * ### Display Features
       * - Shows count in header
       * - Full opacity for visibility
       * - Each todo rendered via TodoItem component
       * - Unique `key` prop using todo.id for React reconciliation
       */}
      {activeTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Active ({activeTodos.length})
          </h3>
          <div className="space-y-2">
            {activeTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
      {/* CLOSE: active-todos-section */}

      {/*
       * REF: completed-todos-section
       *
       * ## Completed Todos Section
       *
       * Displays completed todos with reduced opacity to de-emphasize.
       *
       * ### Conditional Rendering
       * Only renders if `completedTodos.length > 0`
       *
       * ### Display Features
       * - Shows count in header
       * - Gray text color for header
       * - Reduced opacity (75%) for entire section
       * - Same TodoItem component for consistency
       * - Unique `key` prop for each item
       */}
      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-500">
            Completed ({completedTodos.length})
          </h3>
          <div className="space-y-2 opacity-75">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
      {/* CLOSE: completed-todos-section */}

      {/*
       * REF: empty-state
       *
       * ## Empty State Message
       *
       * Displayed when no todos exist at all (neither active nor completed).
       *
       * ### Conditional Rendering
       * Only shows if `todos.length === 0`
       *
       * ### Purpose
       * - Informs users the list is empty
       * - Provides guidance on next action (create a todo)
       * - Prevents confusing blank screen
       */}
      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No todos found. Create one to get started!
        </p>
      )}
      {/* CLOSE: empty-state */}

    </div>
  )
}

/**
 * REF: usage-examples
/**
 * ## Drizzle Query for Todos
 *
 * Example of how parent components fetch todos using Drizzle queries.
 *
 * ### Fetching Todos
 * ```typescript
 * import { getUserTodos } from '@/lib/db/queries'
 *
 * const todos = await getUserTodos(userId)
 * // TypeScript automatically infers the type:
 * // todos: {
 * //   id: string
 * //   userId: string
 * //   title: string
 * //   description: string | null
 * //   completed: boolean
 * //   isPublic: boolean
 * //   tags: string[] | null
 * //   createdAt: Date
 * //   updatedAt: Date
 * // }[]
 * ```
 *
 * ### Type Inference Benefits
 * - No manual type annotations needed
 * - TypeScript knows exact structure
 * - IDE autocomplete works perfectly
 * - Type errors caught at compile time
 */

/**
 * ## Using with Server Components
 *
 * In a Next.js 13+ server component, fetch data directly in the component.
 *
 * ### Server Component Example
 * ```typescript
 * import { getUserTodos } from '@/lib/db/queries'
 * import TodoList from '@/components/todos/TodoList'
 *
 * export default async function Dashboard() {
 *   const user = await getUser()
 *   const todos = await getUserTodos(user.id) // Type-safe!
 *
 *   return <TodoList todos={todos} />
 * }
 * ```
 *
 * ### Benefits
 * - No loading state needed (data fetched server-side)
 * - Data ready immediately on render
 * - Better performance (less client JavaScript)
 * - SEO-friendly (content in initial HTML)
 */
// CLOSE: usage-examples
