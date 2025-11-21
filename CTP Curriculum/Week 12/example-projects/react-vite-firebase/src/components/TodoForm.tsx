/**
 * REF: TodoForm Component - Create New Todos
 *
 * Form for creating todos directly in Firestore from the browser.
 *
 * ## Overview
 * Provides a complete todo creation interface with optional tags and public sharing.
 *
 * ## Features
 * - **Controlled Form Inputs**: All form state managed in React
 * - **Firestore Direct**: Adds todos directly from browser (no server)
 * - **Client Validation**: Provides immediate user feedback
 * - **Tag Management**: Add/remove tags with Enter key or button
 * - **Public Sharing**: Mark todos as public in the feed
 * - **Error Handling**: Displays user-friendly error messages
 * - **Loading States**: Shows "Creating..." while saving
 *
 * ## Architecture
 *
 * ### SPA Pattern (This App)
 * - All validation happens in browser
 * - Direct Firestore calls from client
 * - No backend API needed
 * - Security enforced by Firestore rules
 *
 * ### Traditional Server Pattern
 * - Client sends to API endpoint
 * - Server validates data
 * - Server saves to database
 * - More secure for sensitive operations
 *
 * CLOSE
 */

import { useState, FormEvent } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

interface TodoFormProps {
  userId: string
  onSuccess?: () => void
}

export default function TodoForm({ userId, onSuccess }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // REF: FORM SUBMIT
/**
   * FORM SUBMIT
   *
   * Creates todo in Firestore
   *
   * FIRESTORE ADD:
   * - addDoc() creates document with auto-generated ID
   * - Timestamp.now() uses server time (not client)
   * - Returns DocumentReference
   */
// CLOSE
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, 'todos'), {
        userId,
        title: title.trim(),
        description: description.trim() || '',
        completed: false,
        isPublic,
        tags,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      // Clear form
      setTitle('')
      setDescription('')
      setIsPublic(false)
      setTags([])

      onSuccess?.()
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Failed to create todo')
    } finally {
      setLoading(false)
    }
  }

  // REF: TAG MANAGEMENT
/**
   * TAG MANAGEMENT
   */
// CLOSE
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }
  // CLOSE: TAG MANAGEMENT

  /** REF: form-render
   * Todo form with title, description, public checkbox, and tags.
   * Displays error messages and validates input.
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/** REF: title-input
       * Title input field with required validation.
       * Limited to 500 characters maximum.
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
          maxLength={500}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="What needs to be done?"
        />
      </div>
      {/* CLOSE: title-input */}

      {/** REF: description-textarea
       * Multi-line description textarea field.
       * Provides 3 rows for detailed todo descriptions.
       */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Add details..."
        />
      </div>
      {/* CLOSE: description-textarea */}

      {/** REF: public-checkbox
       * Checkbox to mark todo as public or private.
       * Toggles isPublic state when changed.
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
       * ## Tags Input Section
       *
       * Tag management UI with add/remove functionality.
       */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 px-4 py-2 border rounded-lg"
            placeholder="Add tag..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full text-sm">
                #{tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      {/* CLOSE: tags-input-section */}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Todo'}
      </button>
    </form>
  )
}
// CLOSE: TodoForm

// REF: FIRESTORE ARRAYS
/**
 * FIRESTORE ARRAYS
 *
 * Firestore stores arrays natively:
 * - No separate table needed
 * - Can query with array-contains
 * - Simple for this use case
 *
 * Query by tag:
 * ```typescript
 * query(
 *   collection(db, 'todos'),
 *   where('tags', 'array-contains', 'urgent')
 * )
 * ```
 */
// CLOSE
