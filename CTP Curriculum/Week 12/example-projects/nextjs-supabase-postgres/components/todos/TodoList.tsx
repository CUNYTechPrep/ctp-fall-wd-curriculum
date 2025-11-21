/**
 * TodoList Component - Display Todos (Supabase Version)
 *
 * Displays a list of todos with actions.
 *
 * ## Key Concepts
 * - List rendering in React
 * - Component composition
 * - Props for callbacks
 * - Separating active and completed
 *
 * SUPABASE PATTERN:
 * - Receives todos from parent (via props)
 * - Parent handles database operations
 * - This component just displays and emits events
 *
 */

/**
 * REF: client-side-directive-list
 *
 * ## Client-Side Directive
 *
 * Marks this module as a client component for list rendering and callback handling.
 */
'use client'

// REF: Import statement
import type { Database } from '@/types/database'
import TodoItem from './TodoItem'
// CLOSE: Import statement

// REF: Type definition
type Todo = Database['public']['Tables']['todos']['Row']
// CLOSE: Type definition

// REF: Type definition
interface TodoListProps {
  todos: Todo[]
  onToggle: (todoId: string, completed: boolean) => void
  onUpdate: (todoId: string, updates: Partial<Todo>) => void
  onDelete: (todoId: string) => void
}
// CLOSE: Type definition

/**
 * REF: todo-list-component
 *
 * ## TodoList Component
 *
 * Displays a list of todos separated into active and completed sections. This is a
 * presentational component that receives data and callbacks from its parent.
 *
 * ### Props
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `todos` | `Todo[]` | Array of todo items to display |
 * | `onToggle` | `(id, completed) => void` | Callback to toggle completion |
 * | `onUpdate` | `(id, updates) => void` | Callback to update todo |
 * | `onDelete` | `(id) => void` | Callback to delete todo |
 *
 * ### Features
 * - Separates active and completed todos
 * - Shows counts for each section
 * - Renders empty state when no todos
 * - Uses TodoItem component for individual items
 * - Pure presentational component (no database logic)
 *
 * ### Example
 * ```tsx
 * <TodoList
 *   todos={todosArray}
 *   onToggle={handleToggle}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 * />
 * ```
 */

// REF: Function: export
export default function TodoList({
  todos,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
// CLOSE: Function: export
  /**
   * SEPARATE ACTIVE AND COMPLETED
   *
   * Better UX to group by completion status
   */
// REF: Function: const
  const activeTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)
// CLOSE: Function: const

// REF: JSX return
  return (
    <div className="space-y-6">
      {/* Active Todos */}
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
// CLOSE: JSX return

      {/* Completed Todos */}
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

      {/* Empty State */}
      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No todos found. Create one to get started!
        </p>
      )}
    </div>
  )
}

/**
 * POSTGRESQL SORTING
 *
 * Could sort in query for better performance:
 *
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .eq('user_id', userId)
 *   .order('completed', { ascending: true })  // Active first
 *   .order('created_at', { ascending: false }) // Newest first
 * ```
 *
 * Database sorting is faster than JavaScript sorting!
 */

/**
 * VIRTUAL SCROLLING
 *
 * For large lists (1000+ items), use virtual scrolling:
 *
 * ```typescript
 * import { FixedSizeList } from 'react-window'
 *
 * <FixedSizeList
 *   height={600}
 *   itemCount={todos.length}
 *   itemSize={80}
 *   width="100%"
 * >
 *   {({ index, style }) => (
 *     <div style={style}>
 *       <TodoItem todo={todos[index]} />
 *     </div>
 *   )}
 * </FixedSizeList>
 * ```
 *
 * Only renders visible items - smooth with 10,000+ todos!
 */
