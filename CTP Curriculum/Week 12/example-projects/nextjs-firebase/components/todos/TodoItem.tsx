/**
 * REF: todo-item-component
 *
 * # TodoItem Component
 *
 * Individual todo display with inline actions.
 *
 * ## Key Concepts
 *
 * - **Component state** - Edit mode managed locally
 * - **Conditional rendering** - Different UI for view/edit modes
 * - **Event handling** - Checkbox, buttons, form submissions
 * - **Dynamic styling** - Visual feedback for completion status
 *
 * ## Features
 *
 * | Feature | Description |
 * |---------|-------------|
 * | Toggle completion | Checkbox to mark done/undone |
 * | Inline editing | Edit in place without navigation |
 * | Delete | Remove todo with single click |
 * | Tags display | Show associated categories |
 * | Responsive design | Works on all screen sizes |
 *
 * ## Component States
 *
 * 1. **View mode** - Default display state
 * 2. **Edit mode** - Form for modifying todo
 * 3. **Completed** - Strikethrough and muted styling
 * 4. **Active** - Normal display for tasks in progress
 */

'use client'

import { useState } from 'react'
import { Todo } from '@/types'

/**
 * REF: todo-item-props
 *
 * ## TodoItem Props Interface
 *
 * Contract for single todo display.
 *
 * ### Props
 *
 * | `Prop` | Type | Description |
 * |------|------|-------------|
 * | `todo` | `Todo` | The todo object to display |
 * | `onToggleComplete` | `Function` | Callback for completion toggle |
 * | `onUpdate` | `Function` | Callback for todo updates |
 * | `onDelete` | `Function` | Callback for todo deletion |
 *
 * ### Data Flow
 *
 * ```
 * Dashboard → TodoList → TodoItem
 *    ↑                      ↓
 *    ←─── Callbacks ────────┘
 * ```
 */
interface TodoItemProps {
  todo: Todo
  onToggleComplete: (todoId: string, completed: boolean) => void
  onUpdate: (todoId: string, updates: Partial<Todo>) => void
  onDelete: (todoId: string) => void
}
// CLOSE: todo-item-props

export default function TodoItem({
  todo,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  /**
   * REF: edit-mode-state
   *
   * # Edit Mode State Management
   *
   * Local state controlling the edit form display and temporary values.
   *
   * ## State Variables
   *
   * | `Variable` | Type | Purpose |
   * |----------|------|---------|
   * | `isEditing` | `boolean` | Controls whether to show edit form vs view |
   * | `editTitle` | `string` | Temporary title value during editing |
   * | `editDescription` | `string` | Temporary description during editing |
   *
   * ## Why Local State?
   *
   * - Edit is a temporary, local action
   * - Don't update database until user clicks "Save"
   * - If user clicks "Cancel", changes are discarded
   * - Reduces unnecessary database writes
   * - Better user experience (no immediate persistence)
   */
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  // CLOSE: edit-mode-state

  /**
   * REF: toggle-completion-handler
   *
   * # Toggle Completion Handler
   *
   * Flips the completed status of the todo and notifies parent component.
   *
   * ## Behavior
   *
   * - Calls parent's onToggleComplete callback
   * - Passes todoId and new completion status
   * - Parent handles database persistence
   * - UI updates via parent's state management
   */
  const handleToggle = () => {
    onToggleComplete(todo.id, !todo.completed)
  }
  // CLOSE: toggle-completion-handler

  /**
   * REF: start-edit-mode
   *
   * # Start Edit Mode Handler
   *
   * Initializes the edit form with current todo values.
   *
   * ## Behavior
   *
   * 1. Populate edit fields with current values
   * 2. Set isEditing to true (shows form)
   * 3. User can now modify values in input fields
   *
   * ## UI Transition
   *
   * View mode → Edit mode with form inputs
   */
  const handleEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(true)
  }
  // CLOSE: start-edit-mode

  /**
   * REF: save-edits-handler
   *
   * # Save Edits Handler
   *
   * Validates and persists edited todo data.
   *
   * ## Validation
   *
   * - Title must not be empty
   * - Shows alert if validation fails
   * - Returns early to prevent save
   *
   * ## Data Persistence
   *
   * - Calls parent's onUpdate callback
   * - Sends trimmed title and description
   * - Exits edit mode on success
   *
   * ## Data Flow
   *
   * ```
   * Input validation → onUpdate callback → Parent updates database
   *                                      → UI re-renders
   *                                      → Edit mode closes
   * ```
   */
  const handleSave = () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty')
      return
    }

    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    })

    setIsEditing(false)
  }
  // CLOSE: save-edits-handler

  /**
   * REF: cancel-edit-handler
   *
   * # Cancel Edit Handler
   *
   * Exits edit mode without persisting changes.
   *
   * ## Behavior
   *
   * - Discards all temporary edits
   * - Sets isEditing to false
   * - Original values remain unchanged
   * - No database update occurs
   */
  const handleCancel = () => {
    setIsEditing(false)
  }
  // CLOSE: cancel-edit-handler

  /**
   * REF: delete-handler
   *
   * # Delete Handler
   *
   * Deletes the todo by calling parent callback.
   *
   * ## Behavior
   *
   * - Calls parent's onDelete callback
   * - Passes todo ID
   * - Parent handles deletion logic and database update
   */
  const handleDelete = () => {
    onDelete(todo.id)
  }
  // CLOSE: delete-handler

  /**
   * REF: edit-mode-render
   *
   * # Edit Mode Render
   *
   * Displays form with input fields for editing todo content.
   *
   * ## Form Fields
   *
   * | `Field` | Type | Description |
   * |-------|------|-------------|
   * | `Title` | text input | Todo title (required) |
   * | Description | `textarea` | Todo description (optional) |
   * | Save button | `button` | Persists changes |
   * | Cancel button | `button` | Discards changes |
   *
   * ## Styling
   *
   * - Gray background to indicate edit mode
   * - Focused inputs have blue ring
   * - Dark mode support with dark: variants
   *
   * ## User Flow
   *
   * Edit button → Edit mode render → Fill fields → Save/Cancel
   */
  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
            placeholder="Todo title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }
  // CLOSE: edit-mode-render

  /**
   * REF: view-mode-render
   *
   * # View Mode Render
   *
   * Displays the todo in read-only format with inline actions.
   *
   * ## Layout Structure
   *
   * | `Component` | Purpose |
   * |-----------|---------|
   * | `Checkbox` | Toggle completion status |
   * | `Title` | Main todo text (strikethrough if complete) |
   * | Description | Optional details (if provided) |
   * | `Tags` | Category labels (if any) |
   * | Visibility Badge | Public/Private indicator |
   * | Action Buttons | Edit and Delete |
   *
   * ## Dynamic Styling
   *
   * **Completed todos:**
   * - Strikethrough title and description
   * - Reduced opacity
   * - Visual indication of status
   *
   * **Public/Private Badge:**
   * - Green badge for public todos
   * - Gray badge for private todos
   * - Emoji icon for quick visual reference
   *
   * ## Interactive Elements
   *
   * - Checkbox: Triggers completion toggle
   * - Edit button: Enters edit mode
   * - Delete button: Removes todo
   * - Hover effects: Show interactivity on buttons
   *
   * ## Responsive Behavior
   *
   * - Flex layout adapts to screen size
   * - Buttons right-aligned
   * - Long titles wrap naturally
   * - Tags wrap to new lines if needed
   */
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        {/* Completion Checkbox */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        />

        {/* Todo Content */}
        <div className="flex-1">
          {/* Title */}
          <h4
            className={`text-lg font-medium ${
              todo.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {todo.title}
          </h4>

          {/* Description */}
          {todo.description && (
            <p
              className={`mt-1 text-gray-600 dark:text-gray-300 ${
                todo.completed ? 'line-through' : ''
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {todo.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Public/Private Badge */}
          <div className="mt-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                todo.isPublic
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {todo.isPublic ? '🌐 Public' : '🔒 Private'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition"
            aria-label="Edit todo"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
            aria-label="Delete todo"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
  // CLOSE: view-mode-render
}
// CLOSE: todo-item-component
