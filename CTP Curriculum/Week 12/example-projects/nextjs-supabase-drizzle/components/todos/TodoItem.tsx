/**
 * REF: file-header
 *
 * # TodoItem Component - Individual Todo with Drizzle
 *
 * Displays a single todo with edit, delete, and complete actions. This component
 * demonstrates Drizzle's type safety for update operations and inline editing patterns.
 *
 * ## Architecture Highlights
 * - Type inference from Drizzle schema via InferSelectModel
 * - Inline editing pattern with state management
 * - Update operations with type safety via Partial<Todo>
 * - Conditional rendering (edit mode vs view mode)
 * - Event handler prop drilling
 *
 * ## Drizzle Update Pattern
 * | Pattern | Implementation |
 * |---------|----------------|
 * | Query Helper | `updateTodo()` from queries.ts |
 * | Type Checking | Fully type-checked at compile time |
 * | Error Prevention | TypeScript prevents typos and type errors |
 * | IDE Support | Autocomplete for all fields |
 *
 * ## Drizzle Benefits
 * ```typescript
 * // ✅ TypeScript validates this update
 * onUpdate(todo.id, { title: 'New title', completed: true })
 *
 * // ❌ Compile error - field doesn't exist
 * onUpdate(todo.id, { invalidField: 'test' })
 * ```
 */
// CLOSE: file-header

'use client'

/**
 * REF: imports
 *
 * ## Import Dependencies
 *
 * ### React
 * - `useState`: Manage inline edit mode state
 *
 * ### Drizzle ORM
 * - `InferSelectModel`: Extract TypeScript type from schema
 * - `todos`: Schema definition for type inference
 */
import { useState } from 'react'
import { InferSelectModel } from 'drizzle-orm'
import { todos } from '@/lib/db/schema'
// CLOSE: imports

/**
 * REF: type-definition
 *
 * ## Todo Type from Schema
 *
 * Extract TypeScript type from Drizzle schema for SELECT operations.
 *
 * ### Type Inference
 * `InferSelectModel` generates the exact type returned by SELECT queries,
 * including all columns with their correct TypeScript types.
 *
 * ### Generated Type Structure
 * ```typescript
 * {
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
 */
type Todo = InferSelectModel<typeof todos>
// CLOSE: type-definition

/**
 * REF: props-interface
 *
 * ## TodoItem Props Interface
 *
 * Defines all props required by the TodoItem component.
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `todo` | `Todo` | Complete todo object from database |
 * | `onToggle` | `(todoId: string, completed: boolean) => Promise<void>` | Handler for toggling completion status |
 * | `onUpdate` | `(todoId: string, updates: Partial<Todo>) => Promise<void>` | Handler for updating todo fields |
 * | `onDelete` | `(todoId: string) => Promise<void>` | Handler for deleting todo |
 *
 * ### Handler Patterns
 * All handlers are async because they perform database operations.
 *
 * ### Partial<Todo> Type
 * `Partial<Todo>` makes all Todo properties optional, allowing partial updates.
 * TypeScript still validates that properties exist and have correct types.
 *
 * ### Example Usage
 * ```typescript
 * <TodoItem
 *   todo={todoData}
 *   onToggle={handleToggle}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 * />
 * ```
 */
interface TodoItemProps {
  todo: Todo
  onToggle: (todoId: string, completed: boolean) => Promise<void>
  onUpdate: (todoId: string, updates: Partial<Todo>) => Promise<void>
  onDelete: (todoId: string) => Promise<void>
}
// CLOSE: props-interface

/**
 * REF: component-function
 *
 * ## TodoItem Component Function
 *
 * Main component with state management for inline editing.
 */
export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  // CLOSE: component-function

  /**
   * REF: state-management
   *
   * ## Editing State Variables
   *
   * State for managing inline edit mode.
   *
   * | State Variable | Type | Initial Value | Description |
   * |----------------|------|---------------|-------------|
   * | `isEditing` | `boolean` | `false` | Whether component is in edit mode |
   * | `editTitle` | `string` | `todo.title` | Temporary title value during editing |
   * | `editDescription` | `string` | `todo.description \|\| ''` | Temporary description value during editing |
   *
   * ### State Pattern
   * - Edit state is local to this component
   * - Original todo data unchanged until save
   * - Allows cancel without modifying parent state
   */
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')
  // CLOSE: state-management

  /**
   * REF: edit-mode-handlers
   *
   * ## Edit Mode Event Handlers
   *
   * Functions for entering, saving, and canceling edit mode.
   *
   * ### Enter Edit Mode Handler
   *
   * Initializes edit mode with current todo values.
   *
   * #### Process
   * 1. Set edit state from current todo values
   * 2. Enable edit mode
   * 3. Component re-renders in edit view
   */
  const handleEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(true)
  }

  /**
   * ### Save Edit Handler
   *
   * Validates and saves edited todo values.
   *
   * #### Validation
   * - Title cannot be empty
   * - Shows alert if validation fails
   *
   * #### Type-Safe Update
   * `onUpdate` expects `Partial<Todo>`, which TypeScript validates:
   * - All property names must exist in Todo type
   * - All property values must match correct type
   * - Compile error if we try to pass invalid data
   *
   * #### Process
   * 1. Validate title is not empty
   * 2. Call onUpdate with type-safe partial object
   * 3. Exit edit mode on success
   */
  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty')
      return
    }

    await onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
    })

    setIsEditing(false)
  }

  /**
   * ### Cancel Edit Handler
   *
   * Exits edit mode without saving changes.
   *
   * #### Process
   * - Disables edit mode
   * - Discards any changes to editTitle/editDescription
   * - Component re-renders in view mode with original values
   */
  const handleCancel = () => {
    setIsEditing(false)
  }
  // CLOSE: edit-mode-handlers

  /**
   * REF: edit-mode-view
   *
   * ## Edit Mode JSX
   *
   * Conditional render: Shows edit form when `isEditing` is true.
   *
   * ### Edit Form Features
   * - Text input for title
   * - Textarea for description
   * - Save and Cancel buttons
   * - Controlled components tied to edit state
   *
   * ### Early Return Pattern
   * If in edit mode, return edit JSX and skip view mode JSX.
   *
   * ### Title Input Field
   * - Controlled input tied to editTitle state
   * - Updates state on every keystroke
   * - Full width with focus ring
   *
   * ### Description Textarea
   * - Controlled textarea tied to editDescription state
   * - 3 rows for multi-line input
   * - Matches title input styling
   *
   * ### Edit Mode Buttons
   * - Save: Calls handleSave to persist changes
   * - Cancel: Calls handleCancel to discard changes
   * - Horizontal layout with gap
   */
  if (isEditing) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
        <div className="space-y-3">

          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
            placeholder="Title"
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-600"
            placeholder="Description"
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
  // CLOSE: edit-mode-view

  /**
   * REF: view-mode-layout
   *
   * ## View Mode JSX
   *
   * Normal display mode showing todo with actions.
   *
   * ### Layout Structure
   * - Checkbox for completion toggle
   * - Content area (title, description, tags, visibility)
   * - Action buttons (edit, delete)
   */
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition">
      <div className="flex items-start gap-4">
        {/* CLOSE: view-mode-layout */}

        {/**
         * REF: completion-checkbox
         *
         * ## Completion Checkbox
         *
         * Checkbox for toggling todo completion status.
         *
         * ### Configuration
         * - Type: checkbox
         * - Checked: tied to todo.completed
         * - onChange: calls onToggle with current state
         *
         * ### Toggle Logic
         * Passes current `todo.completed` value so parent knows the current state.
         * Parent will toggle it to opposite value in database.
         *
         * ### Styling
         * - 5x5 size for easy clicking
         * - Cursor pointer for UX
         * - Top margin for alignment with title
         */}
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          className="mt-1 w-5 h-5 cursor-pointer"
        />
        {/* CLOSE: completion-checkbox */}

        {/**
         * REF: todo-content-section
         *
         * ## Todo Content Display
         *
         * Displays title, description, tags, and visibility status.
         *
         * ### Todo Title
         * - Font: large and medium weight
         * - Conditional styling: line-through and gray if completed
         * - Type safety: TypeScript knows todo.title is a string
         *
         * ### Todo Description
         * - Conditionally rendered only if description exists
         * - Type safety: TypeScript knows description is string | null
         * - Line-through if completed
         * - Gray color for secondary info
         *
         * ### Tags Display
         * - Conditionally rendered if tags array exists and has items
         * - Type safety: TypeScript knows tags is string[] | null
         * - Maps over array to render each tag
         * - Pills with gray background
         * - Flex wrap for multiple rows
         *
         * ### Public/Private Badge
         * - Shows whether todo is public or private
         * - Conditional styling based on isPublic value
         * - Green for public, gray for private
         * - Type safety: TypeScript knows isPublic is boolean
         */}
        <div className="flex-1">

          <h4 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
            {todo.title}
          </h4>

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

          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              todo.isPublic
                ? 'bg-green-100 text-green-800 dark:bg-green-900'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              {todo.isPublic ? '🌐 Public' : '🔒 Private'}
            </span>
          </div>

        </div>
        {/* CLOSE: todo-content-section */}

        {/**
         * REF: action-buttons
         *
         * ## Action Buttons
         *
         * Edit and delete buttons for todo management.
         *
         * ### Edit Button
         * - Calls handleEdit to enter edit mode
         * - Blue color scheme
         * - Hover effect with background color change
         *
         * ### Delete Button
         * - Calls onDelete with todo.id
         * - Red color scheme for destructive action
         * - Hover effect with background color change
         */}
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
        {/* CLOSE: action-buttons */}

      </div>
    </div>
  )
}

/**
 * REF: type-safety-examples
 *
 * ## Drizzle Type Safety Showcase
 *
 * Examples of how TypeScript catches errors when using onUpdate.
 *
 * ### Valid Updates
 * ```typescript
 * // ✅ Valid - title is string in schema
 * onUpdate(todo.id, { title: 'New title' })
 *
 * // ✅ Valid - description can be null
 * onUpdate(todo.id, { description: null })
 *
 * // ✅ Valid - updating multiple fields
 * onUpdate(todo.id, {
 *   title: 'New title',
 *   description: 'New description',
 *   isPublic: true
 * })
 *
 * // ✅ Valid - partial update (only one field)
 * onUpdate(todo.id, { completed: true })
 * ```
 *
 * ### Invalid Updates (Compile Errors)
 * ```typescript
 * // ❌ Type error - userId is wrong type
 * onUpdate(todo.id, { userId: 123 })
 * // Error: Type 'number' is not assignable to type 'string'
 *
 * // ❌ Type error - field doesn't exist
 * onUpdate(todo.id, { invalidField: 'test' })
 * // Error: Object literal may only specify known properties
 *
 * // ❌ Type error - wrong type for completed
 * onUpdate(todo.id, { completed: 'yes' })
 * // Error: Type 'string' is not assignable to type 'boolean'
 *
 * // ❌ Type error - tags must be array of strings
 * onUpdate(todo.id, { tags: ['valid', 123, true] })
 * // Error: Type 'number' is not assignable to type 'string'
 * ```
 *
 * ### TypeScript Benefits
 * - All errors caught at compile time (before running code)
 * - IDE shows errors immediately as you type
 * - Autocomplete suggests valid property names
 * - Prevents runtime errors from typos or wrong types
 */
// CLOSE: type-safety-examples

/**
 * REF: drizzle-usage-pattern
 *
 * ## Using with Drizzle Queries
 *
 * Example of how parent components implement the update handler.
 *
 * ### Parent Component Pattern
 * ```typescript
 * import { updateTodo } from '@/lib/db/queries'
 *
 * function TodoList() {
 *   const handleUpdate = async (todoId: string, updates: Partial<Todo>) => {
 *     // Type-safe update with Drizzle
 *     const updated = await updateTodo(todoId, updates)
 *
 *     // TypeScript knows exact structure of 'updated'
 *     console.log(updated.title) // ✅ TypeScript knows this is string
 *     console.log(updated.completed) // ✅ TypeScript knows this is boolean
 *     console.log(updated.tags) // ✅ TypeScript knows this is string[] | null
 *
 *     // Refresh UI or update state
 *     refreshTodos()
 *   }
 *
 *   return (
 *     <TodoItem
 *       todo={todo}
 *       onUpdate={handleUpdate}
 *       onToggle={handleToggle}
 *       onDelete={handleDelete}
 *     />
 *   )
 * }
 * ```
 *
 * ### End-to-End Type Safety
 * - Component defines handler with correct types
 * - Handler calls Drizzle query with type checking
 * - Database operation validated by TypeScript
 * - Return value has inferred types
 * - No manual type annotations needed anywhere!
 */
// CLOSE: drizzle-usage-pattern
