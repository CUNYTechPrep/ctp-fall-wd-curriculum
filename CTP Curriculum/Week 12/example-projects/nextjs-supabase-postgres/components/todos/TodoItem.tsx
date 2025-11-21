/**
 * TodoItem Component - Individual Todo Display (Supabase Version)
 *
 * Displays a single todo with edit, delete, and toggle actions.
 *
 * ## Key Concepts
 * - Component state for edit mode
 * - Inline editing pattern
 * - Optimistic updates
 * - PostgreSQL updates via Supabase
 *
 */

/**
 * REF: client-side-directive-item
 *
 * ## Client-Side Directive
 *
 * Marks this module as a client component for inline editing and interactive controls.
 */
'use client'

// REF: Import statement
import { useState } from 'react'
import type { Database } from '@/types/database'
// CLOSE: Import statement

// REF: Type definition
type Todo = Database['public']['Tables']['todos']['Row']
// CLOSE: Type definition

// REF: Type definition
interface TodoItemProps {
  todo: Todo
  onToggle: (todoId: string, completed: boolean) => void
  onUpdate: (todoId: string, updates: Partial<Todo>) => void
  onDelete: (todoId: string) => void
}
// CLOSE: Type definition

/**
 * REF: todo-item-component
 *
 * ## TodoItem Component
 *
 * Displays a single todo item with inline editing, completion toggle, and delete functionality.
 * Supports display of tags, description, and public/private status.
 *
 * ### Props
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `todo` | `Todo` | Todo object from database |
 * | `onToggle` | `(id, completed) => void` | Callback to toggle completion |
 * | `onUpdate` | `(id, updates) => void` | Callback to update todo fields |
 * | `onDelete` | `(id) => void` | Callback to delete todo |
 *
 * ### Features
 * - Inline editing with edit/save/cancel modes
 * - Checkbox for completion toggling
 * - Tag display with badge styling
 * - Public/private status indicator
 * - Delete button with confirmation
 *
 * ### Example
 * ```tsx
 * <TodoItem
 *   todo={todoData}
 *   onToggle={handleToggle}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 * />
 * ```
 */

// REF: Function: export
export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
// CLOSE: Function: export

  /**
   * HANDLERS
   */
  /**
   * REF: handle-edit
   *
   * ## handleEdit
   *
   * Enters edit mode and initializes edit state with current todo values.
   *
   * ### Behavior
   * - Sets edit state with current title and description
   * - Switches UI to edit mode with input fields
   * - Allows user to modify todo in place
   */
// REF: Function: const
  const handleEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(true)
  }
// CLOSE: Function: const

  /**
   * REF: handle-save
   *
   * ## handleSave
   *
   * Saves edited todo changes and exits edit mode. Validates title is not empty.
   *
   * ### Behavior
   * - Validates title is not empty
   * - Calls onUpdate with modified fields
   * - Trims whitespace from title and description
   * - Sets description to null if empty
   * - Exits edit mode
   *
   * ### Example
   * ```tsx
   * <button onClick={handleSave}>Save</button>
   * ```
   */
// REF: Function: const
  const handleSave = () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty')
      return
    }
// CLOSE: Function: const

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
    })

    setIsEditing(false)
  }

  /**
   * REF: handle-cancel
   *
   * ## handleCancel
   *
   * Cancels edit mode and discards unsaved changes.
   *
   * ### Behavior
   * - Exits edit mode without saving
   * - Discards changes to edit state
   * - Returns to normal display mode
   */
// REF: Function: const
  const handleCancel = () => {
    setIsEditing(false)
  }
// CLOSE: Function: const

  /**
   * EDIT MODE RENDER
   */
// REF: Control flow
  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }
// CLOSE: Control flow

  /**
   * NORMAL VIEW RENDER
   */
// REF: JSX return
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          className="mt-1 w-5 h-5 cursor-pointer"
        />
// CLOSE: JSX return

        {/* Content */}
// REF: JSX element
        <div className="flex-1">
          <h4 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </h4>
// CLOSE: JSX element

          {todo.description && (
            <p className={`mt-1 text-gray-600 dark:text-gray-300 ${todo.completed ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}

          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {todo.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

// REF: JSX element
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              todo.is_public
                ? 'bg-green-100 text-green-800 dark:bg-green-900'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700'
            }`}>
              {todo.is_public ? '🌐 Public' : '🔒 Private'}
            </span>
          </div>
        </div>
// CLOSE: JSX element

        {/* Actions */}
// REF: JSX element
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
// CLOSE: JSX element

/**
 * OPTIMISTIC UPDATES
 *
 * For better UX, update UI before server confirms:
 *
 * ```typescript
 * const handleToggle = () => {
 *   // Update UI immediately
 *   setTodos(todos.map(t =>
 *     t.id === todo.id ? { ...t, completed: !t.completed } : t
 *   ))
 *
 *   // Then update server
 *   onToggle(todo.id, todo.completed).catch(() => {
 *     // Revert on error
 *     setTodos(previousTodos)
 *   })
 * }
 * ```
 */
