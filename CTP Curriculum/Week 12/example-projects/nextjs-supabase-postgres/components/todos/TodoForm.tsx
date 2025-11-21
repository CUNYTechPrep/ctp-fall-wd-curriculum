/**
 * REF: todoform-file-header
 *
 * # TodoForm Component - Create and Edit Todos
 *
 * Reusable form for creating and editing todos with Supabase PostgreSQL.
 *
 * ## Key Concepts
 *
 * - **Controlled inputs** - Form state managed by React
 * - **Supabase operations** - `.insert().select().single()` pattern
 * - **Form validation** - Client-side validation before submit
 * - **PostgreSQL arrays** - `TEXT[]` for tags
 *
 * ## Supabase vs Firebase Comparison
 *
 * | Aspect | Supabase | Firebase |
 * |--------|----------|----------|
 * | Insert method | `.insert().select().single()` | `addDoc()` |
 * | Return value | Inserted data directly | Document reference |
 * | Data retrieval | Immediate | Requires separate query |
 * | Type safety | PostgreSQL types | Firestore types |
 *
 * ## PostgreSQL Array Features
 *
 * - **Storage** - Tags stored as `TEXT[]` in database
 * - **Queries** - Can use array operators (`@>`, `&&`)
 * - **Indexing** - GIN index for fast array searches
 * - **Type safety** - TypeScript knows it's `string[]`
 */

'use client'

// REF: Import statement
import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
// CLOSE: Import statement

// REF: Type definition
type Todo = Database['public']['Tables']['todos']['Row']
type NewTodo = Database['public']['Tables']['todos']['Insert']
// CLOSE: Type definition

/**
 * REF: todoform-props
 *
 * ## TodoForm Props Interface
 *
 * | Name | Type | Required | Description |
 * |------|------|----------|-------------|
 * | `userId` | `string` | Yes | Current user's ID for ownership |
 * | `onSuccess` | `() => void` | No | Callback after creation |
 * | `initialData` | `Partial<Todo>` | No | Initial values for editing |
 */
// REF: Type definition
interface TodoFormProps {
  userId: string
  onSuccess?: () => void
  initialData?: Partial<Todo>
}
// CLOSE: Type definition

/**
 * REF: todoform-component
 *
 * ## TodoForm Component Function
 *
 * Reusable form component for creating and editing todos.
 *
 * ### Features
 *
 * - Controlled form inputs with validation
 * - Tag management with PostgreSQL `TEXT[]` support
 * - Public/private visibility toggle
 * - Loading states and error handling
 * - Type-safe with generated database types
 *
 * ### Example
 *
 * ```tsx
 * <TodoForm
 *   userId={user.id}
 *   onSuccess={() => router.refresh()}
 * />
 * ```
 */
// REF: Function: export
export default function TodoForm({ userId, onSuccess, initialData }: TodoFormProps) {
  const supabase = createClient()
// CLOSE: Function: export

  /**
   * ## Form State
   */
// REF: Constant declaration
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [isPublic, setIsPublic] = useState(initialData?.is_public || false)
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
// CLOSE: Constant declaration

  /**
   * SUBMIT HANDLER
   *
   * Creates new todo in PostgreSQL via Supabase
   *
   * SUPABASE INSERT PATTERN:
   * - .insert(data): Add row
   * - .select(): Return inserted row
   * - .single(): Get object instead of array
   *
   * TYPE SAFETY:
   * - NewTodo type ensures all required fields present
   * - TypeScript validates field names and types
   * - Compile-time safety
   */
  /**
   * REF: handle-submit
   *
   * ## handleSubmit
   *
   * Handles form submission, validates input, and creates new todo in Supabase PostgreSQL.
   * Uses type-safe insert operations with generated database types.
   *
   * ### Parameters
   * | Name | Type | Description |
   * |------|------|-------------|
   * | `e` | `FormEvent` | Form submission event |
   *
   * ### Behavior
   * - Prevents default form submission
   * - Validates title is not empty
   * - Creates NewTodo object with all fields
   * - Inserts into database via Supabase
   * - Returns inserted row with .select().single()
   * - Clears form on success
   * - Calls onSuccess callback if provided
   *
   * ### Example
   * ```tsx
   * <form onSubmit={handleSubmit}>
   *   {/* form fields */}
   * </form>
   * ```
   */
// REF: Async function: const
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
// CLOSE: Async function: const

// REF: Control flow
    if (!title.trim()) {
      setError('Title is required')
      return
    }
// CLOSE: Control flow

    setLoading(true)

    try {
      const newTodo: NewTodo = {
        user_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        is_public: isPublic,
        tags: tags.length > 0 ? tags : null,
        completed: false,
      }

// REF: Constant declaration
      const { data, error: insertError } = await supabase
        .from('todos')
        .insert(newTodo)
        .select()
        .single()
// CLOSE: Constant declaration

// REF: Control flow
      if (insertError) throw insertError
// CLOSE: Control flow

      // Clear form
      setTitle('')
      setDescription('')
      setIsPublic(false)
      setTags([])

      // Callback for parent
      onSuccess?.()
    } catch (err: any) {
      console.error('Error creating todo:', err)
      setError(err.message || 'Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  /**
   * TAG MANAGEMENT
   *
   * PostgreSQL supports array columns
   * Store multiple tags per todo
   */
  /**
   * REF: handle-add-tag
   *
   * ## handleAddTag
   *
   * Adds a new tag to the tags array with validation. PostgreSQL stores tags as TEXT[]
   * allowing efficient querying with array operators.
   *
   * ### Behavior
   * - Trims and converts tag to lowercase
   * - Prevents empty tags
   * - Prevents duplicate tags
   * - Limits to maximum 10 tags
   * - Clears input on success
   *
   * ### Example
   * ```tsx
   * <button onClick={handleAddTag}>Add Tag</button>
   * ```
   */
// REF: Function: const
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
// CLOSE: Function: const

// REF: JSX return
    if (!tag) return
    if (tags.includes(tag)) {
      setError('Tag already added')
      return
    }
    if (tags.length >= 10) {
      setError('Maximum 10 tags')
      return
    }
// CLOSE: JSX return

    setTags([...tags, tag])
    setTagInput('')
    setError('')
  }

  /**
   * REF: handle-remove-tag
   *
   * ## handleRemoveTag
   *
   * Removes a tag from the tags array.
   *
   * ### Parameters
   * | Name | Type | Description |
   * |------|------|-------------|
   * | `tagToRemove` | `string` | Tag to remove from array |
   */
// REF: Function: const
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
// CLOSE: Function: const

  /**
   * REF: handle-tag-keydown
   *
   * ## handleTagKeyDown
   *
   * Handles keyboard events in tag input field. Allows adding tags by pressing Enter key.
   *
   * ### Parameters
   * | Name | Type | Description |
   * |------|------|-------------|
   * | `e` | `React.KeyboardEvent` | Keyboard event |
   *
   * ### Behavior
   * - Listens for Enter key press
   * - Prevents form submission
   * - Triggers handleAddTag
   */
// REF: Function: const
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }
// CLOSE: Function: const

  /**
   * RENDER
   */
// REF: JSX return
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
// CLOSE: JSX return

      {/* Title */}
// REF: JSX element
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
          placeholder="What needs to be done?"
        />
      </div>
// CLOSE: JSX element

      {/* Description */}
// REF: JSX element
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
          placeholder="Add details..."
        />
      </div>
// CLOSE: JSX element

      {/* Public Toggle */}
// REF: JSX element
      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label htmlFor="isPublic" className="text-sm font-medium cursor-pointer">
          Make this todo public
        </label>
      </div>
// CLOSE: JSX element

      {/* Tags */}
// REF: JSX element
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
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300"
          >
            Add
          </button>
        </div>
// CLOSE: JSX element

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? 'Creating...' : 'Create Todo'}
      </button>
    </form>
  )
}

/**
 * POSTGRESQL ARRAY OPERATIONS
 *
 * Query by tag:
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .contains('tags', ['urgent'])
 * ```
 *
 * Or with raw SQL:
 * ```typescript
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .filter('tags', 'cs', '{urgent,important}')
 * ```
 *
 * Array operators:
 * - contains: Array contains elements
 * - overlaps: Arrays have common elements
 * - cs (contains): Like PostgreSQL @>
 */

/**
 * USING WITH SERVER ACTIONS
 *
 * Instead of calling Supabase directly, use Server Action:
 *
 * ```typescript
 * import { createTodo } from '@/app/actions'
 *
 * const handleSubmit = async (formData: FormData) => {
 *   const result = await createTodo(formData)
 *
 *   if (result.error) {
 *     setError(result.error)
 *   } else {
 *     onSuccess?.()
 *   }
 * }
 *
 * <form action={handleSubmit}>
 *   <input name="title" />
 *   <button>Create</button>
 * </form>
 * ```
 *
 * Server Actions are type-safe and progressive enhancement!
 */
