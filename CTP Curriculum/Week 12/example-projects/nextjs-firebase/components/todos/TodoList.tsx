/**
 * REF: todo-list-component
 *
 * # TodoList Component
 *
 * Renders a list of todos with actions.
 *
 * ## Key Concepts
 *
 * - **List rendering** - Mapping arrays to UI elements
 * - **Component composition** - Breaking UI into smaller parts
 * - **Props drilling** - Passing functions through components
 * - **Keys in lists** - React reconciliation for efficiency
 *
 * ## Performance Optimizations
 *
 * - TodoItem components for separation of concerns
 * - React keys enable selective re-rendering
 * - Filtered arrays for better organization
 * - Minimal state in this component (stateless)
 */

'use client'

import { Todo } from '@/types'
import TodoItem from './TodoItem'

/**
 * REF: todo-list-props
 *
 * ## TodoList Props Interface
 *
 * Defines the contract between parent and child components.
 *
 * ### Props
 *
 * | `Prop` | Type | Description |
 * |------|------|-------------|
 * | `todos` | `Todo[]` | Array of todo objects to display |
 * | `onToggleComplete` | `Function` | Mark todo as complete/incomplete |
 * | `onUpdate` | `Function` | Update any todo field |
 * | `onDelete` | `Function` | Delete a todo |
 *
 * ### Callback Pattern
 *
 * This implements the "lifting state up" pattern:
 * 1. Parent (Dashboard) maintains state
 * 2. Child (TodoList) receives data and callbacks
 * 3. Grandchild (TodoItem) calls callbacks to modify state
 *
 * ### Example Usage
 *
 * ```tsx
 * <TodoList
 *   todos={userTodos}
 *   onToggleComplete={handleToggle}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 * />
 * ```
 */
interface TodoListProps {
  todos: Todo[]
  onToggleComplete: (todoId: string, completed: boolean) => void
  onUpdate: (todoId: string, updates: Partial<Todo>) => void
  onDelete: (todoId: string) => void
}
// CLOSE: todo-list-props

/**
 * REF: todo-list-function
 *
 * ## TodoList Component Function
 *
 * Stateless functional component that displays todos.
 *
 * ### Component Architecture
 *
 * - **Pure component** - No internal state
 * - **Controlled by parent** - All data from props
 * - **Event delegation** - Passes events to parent
 * - **Separation of concerns** - Display only
 */
export default function TodoList({
  todos,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TodoListProps) {
  /**
   * REF: todo-filtering
   *
   * ## Separate Active and Completed Todos
   *
   * Filters todos into two categories for better UX.
   *
   * ### Why Separate?
   *
   * - **Focus on active tasks** - What needs to be done
   * - **Visual hierarchy** - Active todos more prominent
   * - **Sense of progress** - See completed items separately
   * - **Clean interface** - Less cognitive load
   *
   * ### Array Filter Method
   *
   * ```typescript
   * // filter() creates new array without modifying original
   * const filtered = array.filter(item => condition)
   * ```
   *
   * - **Immutable operation** - Original array unchanged
   * - **Functional programming** - Pure function
   * - **Type-safe** - TypeScript knows return type
   */
  const activeTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)
  // CLOSE: todo-filtering

  /**
   * REF: todo-list-render
   *
   * ## Component Render
   *
   * JSX structure for displaying todos.
   *
   * ### Layout Structure
   *
   * 1. **Active todos section** - Always visible if any exist
   * 2. **Completed todos section** - Shown separately below
   *
   * ### List Mapping Pattern
   *
   * ```tsx
   * {items.map(item => (
   *   <Component key={item.id} {...props} />
   * ))}
   * ```
   *
   * ### Why Keys Matter in React
   *
   * | Without Keys | With Keys |
   * |--------------|-----------|
   * | React re-renders entire list | React re-renders only changed items |
   * | Poor performance with large lists | Efficient updates |
   * | Can lose component state | Preserves component state |
   * | Animations may break | Smooth animations |
   *
   * ### React Reconciliation
   *
   * Keys help React's virtual DOM diffing algorithm:
   * 1. React compares new virtual DOM with previous
   * 2. Keys identify which items are same/different
   * 3. Only changed items get re-rendered to real DOM
   * 4. Massive performance improvement for lists
   */
  /** REF: todo-list-container
   * Main container for todo list with sections for active and completed todos.
   * Provides spacing and organization for todo items.
   */
  return (
  // CLOSE: todo-list-render
          <div className="space-y-6">
      {/* Active Todos Section */}
      {activeTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Active ({activeTodos.length})
          </h3>
          {/** REF: active-todos-list
           * Maps through active todos and renders TodoItem for each.
           * Displays todo items with full interaction capabilities.
           */}
          <div className="space-y-2">
            {activeTodos.map(todo => (
              <TodoItem
                key={todo.id} // CRITICAL: unique key for each item
                todo={todo}
                onToggleComplete={onToggleComplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
          {/* CLOSE: active-todos-list */}
        </div>
      )}

            {/* Completed Todos Section */}
      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-500">
            Completed ({completedTodos.length})
          </h3>
          {/** REF: completed-todos-list
           * Maps through completed todos and renders TodoItem for each.
           * Displays with reduced opacity to distinguish from active items.
           */}
          <div className="space-y-2 opacity-75">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
          {/* CLOSE: completed-todos-list */}
        </div>
      )}

            {/* Empty State */}
      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No todos found. Create one to get started!
        </p>
      )}
    </div>
    // CLOSE: todo-list-container
  )
}
// CLOSE: todo-list-function
// CLOSE: todo-list-component
