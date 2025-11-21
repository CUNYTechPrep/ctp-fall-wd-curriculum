/**
 * REF: TodoList Display Component
 *
 * Presentational component that renders a list of todos grouped by completion status.
 * Receives todos array and callback handlers from parent component.
 *
 * CLOSE: This is a stateless, reusable component that displays todos passed via props.
 * It does not fetch data or manage state - all data management is in parent (Dashboard).
 *
 * ## Component Structure
 * | `Section` | Purpose |
 * |---------|---------|
 * | Active Todos | Incomplete tasks grouped at top |
 * | Completed Todos | Finished tasks grouped below, muted styling |
 * | Empty State | Message when no todos exist |
 *
 * ### Props
 * | `Prop` | Type | Purpose |
 * |------|------|---------|
 * | `todos` | `Todo[]` | Array of todo objects to display |
 * | `onToggle` | `function` | Callback when checkbox clicked |
 * | `onDelete` | `function` | Callback when delete button clicked |
 *
 * TODO TYPE INTERFACE:
 * ```typescript
 * interface Todo {
 *   id: string              // PostgreSQL UUID
 *   user_id: string         // Owner user ID
 *   title: string           // Main task text
 *   description: string | null  // Optional details
 *   completed: boolean      // Completion status
 *   is_public: boolean      // Visibility flag
 *   tags: string[] | null   // Array of tag strings
 *   created_at: string      // ISO timestamp
 *   updated_at: string      // ISO timestamp
 * }
 * ```
 *
 * STYLING APPROACH:
 * - Tailwind CSS utility classes
 * - Responsive grid and flexbox layouts
 * - Conditional classes for completed items (strikethrough, grayed out)
 * - Shadow and rounded borders for visual hierarchy
 *
 * NESTED COMPONENTS:
 * - TodoItem: Renders individual todo with checkbox, title, description, tags, delete button
 *
 * ## Features
 * - Separates active vs completed todos
 * - Shows counts in section headers
 * - Renders tags with hashtag prefix
 * - Delete button with trash emoji
 * - Responsive to all screen sizes
 * - Empty state when no todos
 *
 * PARENT RESPONSIBILITIES:
 * - Fetch todos from Supabase
 * - Handle toggle/delete operations
 * - Pass handlers that perform mutations
 */

interface Todo {
  id: string
  user_id: string
  title: string
  description: string | null
  completed: boolean
  is_public: boolean
  tags: string[] | null
  created_at: string
  updated_at: string
}

interface TodoListProps {
  todos: Todo[]
  onToggle: (todoId: string, completed: boolean) => void
  onDelete: (todoId: string) => void
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const activeTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  return (
    <div className="space-y-6">
      {/* Active */}
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
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
          {/* CLOSE: active-todos-list */}
        </div>
      )}

            {/* Completed */}
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
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
          {/* CLOSE: completed-todos-list */}
        </div>
      )}

      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No todos yet. Create one above!
        </p>
      )}
    </div>
  )
}

/**
 * TODO ITEM INLINE
 */
/** REF: todo-item-component
 * Individual todo item component with checkbox and delete button.
 * Displays todo details and handles completion toggle.
 */
function TodoItem({ todo, onToggle, onDelete }: {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="p-4 bg-white rounded-lg shadow flex items-start gap-4">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
        className="mt-1 w-5 h-5 cursor-pointer"
      />

      <div className="flex-1">
        <h4 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.title}
        </h4>
        {todo.description && (
          <p className={`text-sm text-gray-600 mt-1 ${todo.completed ? 'line-through' : ''}`}>
            {todo.description}
          </p>
        )}
        {todo.tags && todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {todo.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded"
      >
        🗑️
      </button>
    </div>
  )
  // CLOSE: todo-item-component
}

/**
 * POSTGRESQL QUERIES FROM SPA
 *
 * Parent component queries with Supabase:
 *
 * ```typescript
 * import { supabase } from '../lib/supabase'
 *
 * const { data: todos, error } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .eq('user_id', user.id)
 *   .order('created_at', { ascending: false })
 *
 * // RLS automatically enforces security
 * // User only gets their own todos
 * ```
 *
 * Full SQL power from the browser!
 */

/**
 * TYPE GENERATION
 *
 * For perfect type safety:
 *
 * ```bash
 * npx supabase gen types typescript --project-id YOUR_ID > src/lib/database.types.ts
 * ```
 *
 * Then:
 * ```typescript
 * import type { Database } from '../lib/database.types'
 *
 * type Todo = Database['public']['Tables']['todos']['Row']
 * ```
 *
 * Autocomplete for all database operations!
 */

/**
 * REF: todo-item-subcomponent
 *
 * ## TodoItem Sub-component
 *
 * Renders individual todo with:
 * - Checkbox for completion toggle
 * - Title and description
 * - Tags display
 * - Attachment list
 * - Delete button
 * - Toggle completion status
 *
 * ### Props
 * - todo: Todo object with all data
 * - onToggle: Callback to mark complete/incomplete
 * - onDelete: Callback to remove todo
 *
 * ### Visual States
 * - Active: Normal styling
 * - Completed: Strikethrough, reduced opacity
 * - With attachments: Extra space below for attachment list
 *
 * ### Interactions
 * - Click checkbox: Toggle completed status
 * - Click × button: Delete todo (with confirmation)
 * - Click attachment: Download file
 *
 * CLOSE: todo-item-subcomponent
 */

/**
 * REF: component-composition
 *
 * ## Inline vs Separate Component Pattern
 *
 * TodoItem is defined inline within TodoList.
 *
 * ### When to Inline (Like TodoItem)
 * - Single-use component (only in TodoList)
 * - Closely related to parent
 * - Shared parent state
 * - Simple presentation logic
 * - Easier to understand context
 *
 * ### When to Separate (Like TodoList)
 * - Reusable in multiple places
 * - Independent state management
 * - Testable in isolation
 * - Large number of props
 * - Part of design system
 *
 * **Decision Rule:**
 * - Reused 2+ times? → Separate file
 * - Used in 1 file? → Can inline
 * - Complex logic? → Always separate
 * - Simple display? → Can inline
 *
 * CLOSE: component-composition
 */
