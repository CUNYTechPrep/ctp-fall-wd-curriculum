/**
 * REF: todo-form-component
 *
 * # TodoForm Component
 *
 * Reusable form for creating and editing todos.
 *
 * ## Key React Concepts
 *
 * 1. **Controlled Components** - Form inputs tied to React state
 * 2. **Event Handlers** - Handle user input and submission
 * 3. **Component Props** - Make components reusable
 * 4. **Conditional Rendering** - Show different UI based on state
 *
 * ## Form Best Practices
 *
 * - Controlled inputs (`value` prop) for full React control
 * - Prevent default form submission to handle with JavaScript
 * - Clear form after successful submission
 * - Disable submit while processing (prevent double-submits)
 * - Validate before submission
 */

'use client'

import { useState, FormEvent } from 'react'
import { Todo } from '@/types'

/**
 * REF: todo-form-props
 *
 * ## Component Props Interface
 *
 * Defines props for TodoForm component.
 *
 * ### Properties
 *
 * - `onSubmit`: Callback when form submitted
 * - `initialData?`: Optional data for editing existing todo
 * - `submitButtonText?`: Custom button text
 *
 * ### TypeScript Benefits
 *
 * - Autocomplete in IDEs
 * - Compile-time error checking
 * - Self-documenting code
 */
interface TodoFormProps {
  onSubmit: (data: Partial<Todo>) => Promise<void>
  initialData?: Partial<Todo>
  submitButtonText?: string
}
// CLOSE: todo-form-props

/**
 * REF: todo-form-function
 *
 * ## TodoForm Function Component
 *
 * Main component function with props destructuring.
 */
export default function TodoForm({
  onSubmit,
  initialData,
  submitButtonText = 'Create Todo',
}: TodoFormProps) {
  /**
   * REF: form-state
   *
   * ## Form State Management
   *
   * Each input field has its own state variable.
   *
   * ### State Variables
   *
   * - `title`: Todo title text
   * - `description`: Optional description
   * - `isPublic`: Public visibility toggle
   * - `tags`: Array of tag strings
   * - `tagInput`: Temporary input for adding tags
   * - `loading`: Submission in progress
   *
   * ### Why Separate Variables?
   *
   * Could use one object, but separate is simpler:
   * - Each input's `onChange` directly calls its setter
   * - Easier to reset individual fields
   * - Clearer what each state represents
   */
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false)
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  // CLOSE: form-state

  /**
   * REF: handle-submit
   *
   * ## Form Submit Handler
   *
   * Handles form submission with validation.
   *
   * ### Flow
   *
   * 1. Prevent default browser submission (would reload page)
   * 2. Validate input
   * 3. Set loading state
   * 4. Call parent's `onSubmit` with form data
   * 5. Clear form on success (if creating new)
   * 6. Reset loading state
   *
   * ### Error Handling
   *
   * - Parent component handles errors
   * - `finally` block ensures loading reset even on error
   *
   * ### Controlled Inputs
   *
   * All inputs are "controlled":
   * - `value={title}` makes React the source of truth
   * - `onChange` updates state
   * - React has full control over input values
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault() // Prevent page reload

    // Validation
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    setLoading(true)

    try {
      // Call parent's onSubmit with all form data
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        isPublic,
        tags,
      })

      // Clear form only if creating new (not editing)
      if (!initialData) {
        setTitle('')
        setDescription('')
        setIsPublic(false)
        setTags([])
      }
    } catch (error) {
      // Error handling done by parent component
      console.error('Form submission error:', error)
    } finally {
      // Always reset loading state, even if error occurred
      setLoading(false)
    }
  }
  // CLOSE: handle-submit

  /**
   * REF: tag-management
   *
   * ## Tag Management Functions
   *
   * Handle adding and removing tags.
   *
   * ### Array Immutability
   *
   * React requires immutable state updates:
   * ```typescript
   * // ✅ Correct - creates new array
   * setTags([...tags, newTag])
   *
   * // ❌ Wrong - mutates existing array
   * tags.push(newTag)
   * setTags(tags)
   * ```
   *
   * ### Validation
   *
   * - Tag must not be empty
   * - No duplicate tags
   * - Maximum 10 tags
   *
   * ### Normalization
   *
   * Tags converted to lowercase for consistency.
   */
  const handleAddTag = () => {
    const newTag = tagInput.trim().toLowerCase()

    if (!newTag) return
    if (tags.includes(newTag)) {
      alert('Tag already exists')
      return
    }
    if (tags.length >= 10) {
      alert('Maximum 10 tags allowed')
      return
    }

    setTags([...tags, newTag])
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }
  // CLOSE: tag-management

  /**
   * REF: form-render
   *
   * ## Form JSX Render
   *
   * Renders the complete form UI.
   *
   * ### Structure
   *
   * 1. Form wrapper with `onSubmit`
   * 2. Title input (required)
   * 3. Description textarea (optional)
   * 4. Public/private toggle
   * 5. Tags input with chip display
   * 6. Submit button with loading state
   *
   * ### Controlled Inputs
   *
   * All inputs are "controlled":
   * - `value={state}`: React controls the value
   * - `onChange`: Updates state
   * - Single source of truth
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
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
          maxLength={500}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Enter todo title..."
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Add more details (optional)..."
        />
      </div>

      {/* Public/Private Toggle */}
      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
          Make this todo public (visible in community feed)
        </label>
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            maxLength={50}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Add Tag
          </button>
        </div>

        {/* Display Current Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                  aria-label={`Remove ${tag} tag`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Saving...' : submitButtonText}
      </button>
    </form>
  )
}
// CLOSE: form-render
// CLOSE: todo-form-function
// CLOSE: todo-form-component
