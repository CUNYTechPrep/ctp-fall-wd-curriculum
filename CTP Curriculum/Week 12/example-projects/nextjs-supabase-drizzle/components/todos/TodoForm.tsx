/**
 * REF: file-header
 *
 * # TodoForm Component - Type-Safe Form with Drizzle
 *
 * Form for creating todos with Drizzle ORM's perfect type safety. This component
 * demonstrates how Drizzle ensures compile-time validation of all database operations.
 *
 * ## Architecture Highlights
 * - Drizzle insert operations with type inference
 * - Type safety from schema via InferInsertModel
 * - Controlled component pattern for form fields
 * - Inline tag management with array state
 * - Form validation and error handling
 *
 * ## Drizzle Type Safety Benefits
 * | Feature | Benefit |
 * |---------|---------|
 * | `InferInsertModel` | Exact type for INSERT operations |
 * | TypeScript validation | All fields match schema |
 * | IDE autocomplete | Column names in IDE |
 * | Compile-time checks | Prevents runtime bugs |
 *
 * ## Type Inference Pattern
 * ```typescript
 * import { InferInsertModel } from 'drizzle-orm'
 * import { todos } from '@/lib/db/schema'
 *
 * type NewTodo = InferInsertModel<typeof todos>
 * // TypeScript infers: { userId: string, title: string, ... }
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
 * - `useState`: Manage form field state
 * - `FormEvent`: TypeScript type for form events
 *
 * ### Database Layer
 * - `createTodo`: Type-safe Drizzle mutation from queries.ts
 */
import { useState, FormEvent } from 'react'
import { createTodo } from '@/lib/db/queries'
// CLOSE: imports

/**
 * REF: props-interface
 *
 * ## TodoForm Props Interface
 *
 * Defines the props required for the TodoForm component.
 *
 * | Prop | Type | Required | Description |
 * |------|------|----------|-------------|
 * | `userId` | `string` | Yes | ID of the user creating the todo |
 * | `onSuccess` | `() => void` | No | Callback function called after successful todo creation |
 *
 * ### onSuccess Callback
 * Used to trigger UI updates in parent component, such as:
 * - Refreshing the todo list
 * - Closing a modal
 * - Showing a success message
 *
 * ### Example Usage
 * ```typescript
 * <TodoForm
 *   userId={user.id}
 *   onSuccess={() => {
 *     refreshTodos()
 *     closeModal()
 *   }}
 * />
 * ```
 */
interface TodoFormProps {
  userId: string
  onSuccess?: () => void
}
// CLOSE: props-interface

/**
 * REF: component-function
 *
 * ## TodoForm Component Function
 *
 * Main component function with state management for form fields.
 */
export default function TodoForm({ userId, onSuccess }: TodoFormProps) {
  // CLOSE: component-function

  /**
   * REF: state-management
   *
   * ## Form State Variables
   *
   * All state for managing form input values and UI state.
   *
   * | State Variable | Type | Initial Value | Description |
   * |----------------|------|---------------|-------------|
   * | `title` | `string` | `''` | Todo title (required field) |
   * | `description` | `string` | `''` | Todo description (optional) |
   * | `isPublic` | `boolean` | `false` | Whether todo is publicly visible |
   * | `tags` | `string[]` | `[]` | Array of tag strings |
   * | `tagInput` | `string` | `''` | Temporary input for adding new tags |
   * | `loading` | `boolean` | `false` | Tracks form submission state |
   * | `error` | `string` | `''` | Error message to display |
   *
   * ### State Management Pattern
   * - Each form field has its own state variable
   * - Controlled components pattern (React-managed state)
   * - Loading state prevents double submissions
   * - Error state provides user feedback
   */
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // CLOSE: state-management

  /**
   * REF: submit-handler
   *
   * ## Form Submit Handler
   *
   * Handles form submission with validation, API call, and state updates.
   *
   * ### Execution Flow
   * 1. Prevent default form submission
   * 2. Clear any existing errors
   * 3. Validate required fields (title)
   * 4. Set loading state
   * 5. Call type-safe Drizzle query
   * 6. Clear form on success
   * 7. Call onSuccess callback
   * 8. Handle errors and reset loading state
   *
   * ### Type Safety with Drizzle
   * The `createTodo()` function is fully typed from the schema:
   * - TypeScript validates all property names
   * - TypeScript validates all property types
   * - Compile error if we pass wrong data
   * - Autocomplete works perfectly
   *
   * ### Type-Safe Query Helper Call
   *
   * `createTodo` expects specific typed arguments from schema.
   *
   * Type validation ensures:
   * - `userId` is a string
   * - `title` is a string
   * - `description` is string | undefined
   * - `isPublic` is boolean
   * - `tags` is string[] | undefined
   *
   * Drizzle will convert undefined to NULL in database.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)

    try {
      await createTodo({
        userId,
        title: title.trim(),
        description: description.trim() || undefined,
        isPublic,
        tags: tags.length > 0 ? tags : undefined,
      })

      // Clear form on success
      setTitle('')
      setDescription('')
      setIsPublic(false)
      setTags([])
      setError('')

      // Notify parent component
      onSuccess?.()
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Failed to create todo')
    } finally {
      setLoading(false)
    }
  }
  // CLOSE: submit-handler

  /**
   * REF: tag-management-handlers
   *
   * ## Tag Management Functions
   *
   * Functions for adding and removing tags from the tags array.
   *
   * ### Add Tag Handler
   *
   * Adds a new tag to the tags array with validation.
   *
   * #### Validation Rules
   * - Tag must not be empty after trimming
   * - Tag is converted to lowercase for consistency
   * - Duplicate tags are prevented
   * - Maximum 10 tags allowed
   *
   * #### Process
   * 1. Trim and lowercase the input
   * 2. Check if valid and not duplicate
   * 3. Add to tags array
   * 4. Clear input field
   */
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  /**
   * ### Remove Tag Handler
   *
   * Removes a tag from the tags array.
   *
   * #### Process
   * - Filters out the specified tag
   * - Creates new array without mutation
   * - React re-renders with updated state
   */
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }
  // CLOSE: tag-management-handlers

  /**
   * REF: form-render
   *
   * ## Form JSX Structure
   *
   * Renders the complete form with all input fields.
   *
   * ### Form Sections
   * 1. Error message display
   * 2. Title input (required)
   * 3. Description textarea (optional)
   * 4. Public checkbox
   * 5. Tags input and display
   * 6. Submit button
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CLOSE: form-render */}

      {/**
       * REF: error-display
       *
       * ## Error Message Display
       *
       * Conditionally renders error message when error state is set.
       *
       * ### Styling
       * - Red background (bg-red-100)
       * - Red text (text-red-700)
       * - Padding and rounded corners for visibility
       */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {/* CLOSE: error-display */}

      {/**
       * REF: title-input
       *
       * ## Title Input Field
       *
       * Required text input for the todo title.
       *
       * ### Field Configuration
       * - Type: text
       * - Required: true
       * - Controlled: value tied to `title` state
       * - Handler: `setTitle` on change
       *
       * ### Accessibility
       * - Label with htmlFor matching input id
       * - Visual indicator (*) for required field
       * - Focus ring for keyboard navigation
       */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
      {/* CLOSE: title-input */}

      {/**
       * REF: description-textarea
       *
       * ## Description Textarea
       *
       * Optional multi-line text input for todo description.
       *
       * ### Field Configuration
       * - Type: textarea (4 rows)
       * - Required: false
       * - Controlled: value tied to `description` state
       * - Handler: `setDescription` on change
       *
       * ### Styling
       * - Full width
       * - Dark mode support with dark:bg-gray-700
       * - Focus ring for better UX
       */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>
      {/* CLOSE: description-textarea */}

      {/**
       * REF: public-checkbox
       *
       * ## Public Visibility Checkbox
       *
       * Checkbox to control whether the todo is publicly visible.
       *
       * ### Field Configuration
       * - Type: checkbox
       * - Controlled: checked tied to `isPublic` state
       * - Handler: `setIsPublic` with e.target.checked
       *
       * ### Layout
       * - Horizontal flex layout
       * - Checkbox aligned with label
       * - Cursor pointer for better UX
       */}
      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="isPublic" className="text-sm cursor-pointer">
          Make public
        </label>
      </div>
      {/* CLOSE: public-checkbox */}

      {/**
       * REF: tags-input-section
       *
       * ## Tags Input and Display
       *
       * Interface for adding and displaying tags.
       *
       * ### Tag Input Field with Add Button
       *
       * Input field for typing new tags with Add button.
       *
       * #### Features
       * - Flex layout with input and button
       * - Enter key triggers handleAddTag (prevents form submit)
       * - Add button also triggers handleAddTag
       * - Placeholder text guides user
       *
       * ### Current Tags Display
       *
       * Displays all added tags as removable pills.
       *
       * #### Conditional Rendering
       * Only shows if tags array has items
       *
       * #### Tag Pills
       * - Each tag shown with # prefix
       * - Remove button (×) for each tag
       * - Blue background for visual distinction
       * - Flex wrap for multiple rows
       */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>

        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700"
            placeholder="Add tag..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      {/* CLOSE: tags-input-section */}

      {/**
       * REF: submit-button
       *
       * ## Submit Button
       *
       * Button to submit the form and create the todo.
       *
       * ### Button States
       * - Normal: "Create Todo" text, blue background
       * - Loading: "Creating..." text, disabled state
       * - Disabled: Gray background when loading
       *
       * ### Configuration
       * - Type: submit (triggers handleSubmit)
       * - Full width for mobile-friendly UX
       * - Disabled when loading prevents double submission
       */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Todo'}
      </button>
      {/* CLOSE: submit-button */}

    </form>
  )
}

/**
 * REF: drizzle-type-examples
 *
 * ## Drizzle Insert Type Inference
 *
 * Demonstrates how Drizzle automatically infers types for INSERT operations.
 *
 * ### Type Inference Magic
 * ```typescript
 * import { InferInsertModel } from 'drizzle-orm'
 * import { todos } from '@/lib/db/schema'
 *
 * type NewTodo = InferInsertModel<typeof todos>
 * // TypeScript automatically infers:
 * // {
 * //   userId: string
 * //   title: string
 * //   description?: string | null
 * //   completed?: boolean
 * //   isPublic?: boolean
 * //   tags?: string[] | null
 * // }
 * ```
 *
 * ### Benefits
 * - No manual type definitions needed
 * - Types match database schema exactly
 * - Automatically updates when schema changes
 * - Optional fields marked with `?`
 * - Required fields have no `?`
 */

/**
 * ## Type-Safe Query Helper Example
 *
 * The `createTodo` helper from queries.ts with full type safety.
 *
 * ### Implementation
 * ```typescript
 * export async function createTodo(data: {
 *   userId: string
 *   title: string
 *   description?: string
 *   isPublic?: boolean
 *   tags?: string[]
 * }) {
 *   const [todo] = await db
 *     .insert(todos)
 *     .values({
 *       userId: data.userId,
 *       title: data.title,
 *       description: data.description || null,
 *       isPublic: data.isPublic || false,
 *       tags: data.tags || null,
 *       completed: false,
 *     })
 *     .returning()
 *
 *   return todo
 * }
 * ```
 *
 * ### Type Safety Features
 * - Every field validated by TypeScript
 * - Typo in field name causes compile error
 * - Wrong type for field causes compile error
 * - Missing required field causes compile error
 * - IDE autocomplete for all fields
 *
 * ### Examples of Type Checking
 * ```typescript
 * // ✅ Valid - all required fields provided
 * await createTodo({
 *   userId: '123',
 *   title: 'My todo'
 * })
 *
 * // ✅ Valid - optional fields included
 * await createTodo({
 *   userId: '123',
 *   title: 'My todo',
 *   description: 'Details here',
 *   tags: ['work', 'urgent']
 * })
 *
 * // ❌ Compile error - missing required field 'title'
 * await createTodo({
 *   userId: '123'
 * })
 *
 * // ❌ Compile error - wrong type for title (number instead of string)
 * await createTodo({
 *   userId: '123',
 *   title: 456
 * })
 *
 * // ❌ Compile error - field doesn't exist in schema
 * await createTodo({
 *   userId: '123',
 *   title: 'My todo',
 *   invalidField: 'test'
 * })
 * ```
 */
// CLOSE: drizzle-type-examples
