/**
 * REF: attachment-list-component
 *
 * # AttachmentList Component
 *
 * Displays all attachments for a todo with download and delete actions.
 *
 * ## Key Concepts
 *
 * - **Real-time subscriptions** - Live updates via Firestore onSnapshot
 * - **File downloads** - Direct download links via Firebase Storage
 * - **Delete operations** - Two-step deletion (Storage + Firestore)
 * - **File type detection** - MIME type-based emoji icons
 * - **Size formatting** - Human-readable file sizes
 *
 * ## Real-Time Updates
 *
 * - Uses Firestore onSnapshot for live updates
 * - When attachment added, list updates automatically
 * - When attachment deleted, disappears immediately
 * - No manual refresh needed
 * - Automatic cleanup on unmount
 *
 * ## Features
 *
 * | Feature | Description |
 * |---------|-------------|
 * | Real-time list | Updates instantly when attachments change |
 * | Download links | Direct file downloads from Cloud Storage |
 * | Delete with confirmation | Prevents accidental deletion |
 * | File icons | Visual type indicators (image, PDF, etc.) |
 * | Size display | Human-readable file sizes (KB, MB) |
 * | Empty state | Shows message when no attachments |
 * | Loading state | Shows loading indicator on mount |
 */
// CLOSE: attachment-list-component

'use client'

/** REF: attachmentlist-imports
 * Required imports for Firebase Firestore, Storage, and React hooks.
 * Manages attachment data and real-time updates.
 */
import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { db, storage } from '@/lib/firebase/client'
import { TodoAttachment } from '@/types'
// CLOSE: attachmentlist-imports

/**
 * REF: attachment-list-props
 *
 * # AttachmentList Props Interface
 *
 * Configuration for the attachment list component.
 *
 * ## Props
 *
 * | `Prop` | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `todoId` | `string` | `Yes` | ID of the todo these attachments belong to |
 * | `canDelete` | `boolean` | `No` | Whether current user can delete attachments (default: false) |
 *
 * ## Permissions
 *
 * The canDelete prop controls visibility of delete button:
 * - **true** - Show delete button and allow deletion
 * - **false** - Hide delete button (download only)
 *
 * Note: Server-side security rules should also validate permissions
 */
interface AttachmentListProps {
  todoId: string
  canDelete?: boolean // Whether current user can delete attachments
}
// CLOSE: attachment-list-props

export default function AttachmentList({ todoId, canDelete = false }: AttachmentListProps) {
  /**
   * REF: attachment-list-state
   *
   * # Component State
   *
   * Managing attachments data and UI states.
   *
   * ## State Variables
   *
   * | `Variable` | Type | Purpose |
   * |----------|------|---------|
   * | `attachments` | `TodoAttachment[]` | List of files for this todo |
   * | `loading` | `boolean` | Initial data fetch in progress |
   * | `deleting` | string or null | ID of attachment being deleted |
   *
   * ## State Management
   *
   * - attachments: Updated by real-time listener
   * - loading: Set to false after first data arrives
   * - deleting: Stores ID of item awaiting deletion (prevents double-click)
   */
  const [attachments, setAttachments] = useState<TodoAttachment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  // CLOSE: attachment-list-state

  /**
   * REF: real-time-subscription
   *
   * # Real-Time Attachments Subscription
   *
   * Sets up live listener for all attachments belonging to this todo.
   *
   * ## Why Real-Time?
   *
   * - User sees uploads immediately
   * - Works across devices/tabs
   * - No refresh button needed
   * - Automatic synchronization
   *
   * ## Firestore Query
   *
   * ```
   * Collection: todoAttachments
   * Filter: todoId == [todoId]
   * Listener: Updates whenever data changes
   * ```
   *
   * ## Cleanup
   *
   * - unsubscribe() when component unmounts
   * - Prevents memory leaks
   * - Called via return function in useEffect
   *
   * ## Data Mapping
   *
   * Firestore document → TodoAttachment object
   * - Includes: id, fileName, fileUrl, fileSize, mimeType
   */
  useEffect(() => {
    const q = query(
      collection(db, 'todoAttachments'),
      where('todoId', '==', todoId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const attachmentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as TodoAttachment))

      setAttachments(attachmentData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [todoId])
  // CLOSE: real-time-subscription

  /**
   * REF: delete-attachment-handler
   *
   * # Delete Attachment Handler
   *
   * Deletes file from both Storage and Firestore.
   *
   * ## Parameters
   *
   * - attachment: The TodoAttachment object to delete
   *
   * ## Two-Step Delete Process
   *
   * 1. **Confirmation** - Show confirm dialog to user
   * 2. **Delete from Storage** - Remove actual file from Cloud Storage
   * 3. **Delete from Firestore** - Remove metadata document
   * 4. **UI Update** - Real-time listener removes from list automatically
   *
   * ## Error Handling
   *
   * | `Scenario` | `Behavior` |
   * |----------|----------|
   * | User cancels | Do nothing |
   * | Storage delete fails | Show error, don't delete Firestore |
   * | Firestore delete fails | Show error, file may remain in Storage |
   * | `Success` | Both deleted, UI updates automatically |
   *
   * ## Storage Path Extraction
   *
   * The file URL from Storage includes path information that must be:
   * 1. URL-decoded
   * 2. Stripped of query parameters
   * 3. Used to reference file for deletion
   *
   * @param attachment - TodoAttachment to delete
   */
  const handleDelete = async (attachment: TodoAttachment) => {
    if (!confirm(`Delete ${attachment.fileName}?`)) return

    setDeleting(attachment.id)

    try {
      // Extract storage path from URL
      // URL format: https://firebasestorage.googleapis.com/.../todo-attachments%2F...
      const urlParts = attachment.fileUrl.split('/')
      const pathPart = urlParts[urlParts.length - 1]
      const storagePath = decodeURIComponent(pathPart.split('?')[0])

      // Delete from Storage
      const storageRef = ref(storage, storagePath)
      await deleteObject(storageRef)

      // Delete metadata from Firestore
      await deleteDoc(doc(db, 'todoAttachments', attachment.id))
    } catch (error: any) {
      console.error('Delete error:', error)
      alert('Failed to delete attachment')
    } finally {
      setDeleting(null)
    }
  }
  // CLOSE: delete-attachment-handler

  /**
   * REF: format-file-size
   *
   * # Format File Size Utility
   *
   * Converts bytes to human-readable format.
   *
   * ## Algorithm
   *
   * | Size Range | `Format` |
   * |------------|--------|
   * | < 1024 B | Show bytes (e.g., "512 B") |
   * | 1KB - 1MB | Show KB (e.g., "256.5 KB") |
   * | 1MB+ | Show MB (e.g., "2.3 MB") |
   *
   * ## Examples
   *
   * - 512 bytes → "512 B"
   * - 2048 bytes → "2.0 KB"
   * - 1048576 bytes → "1.0 MB"
   * - 5242880 bytes → "5.0 MB"
   *
   * ## Implementation Notes
   *
   * - toFixed(1) gives 1 decimal place
   * - Division gives proper unit conversion
   * - Readable for typical file sizes
   *
   * @param bytes - File size in bytes
   * @returns Formatted string like "2.5 MB"
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  // CLOSE: format-file-size

  /**
   * REF: get-file-icon
   *
   * # Get File Icon Utility
   *
   * Returns emoji icon based on MIME type for visual identification.
   *
   * ## MIME Type Mapping
   *
   * | `Category` | MIME Type Pattern | `Icon` |
   * |----------|-------------------|------|
   * | `Images` | image/* | 🖼️ |
   * | `Videos` | video/* | 🎥 |
   * | `Audio` | audio/* | 🎵 |
   * | `PDF` | application/pdf | 📄 |
   * | `Word` | `word` | 📝 |
   * | `Spreadsheet` | sheet, excel | 📊 |
   * | `Archive` | zip, archive | 📦 |
   * | Default | (any other) | 📎 |
   *
   * ## Detection Strategy
   *
   * 1. Check if MIME type starts with known categories
   * 2. Fall back to substring matching for Office/document types
   * 3. Use generic paperclip emoji as fallback
   *
   * ## Examples
   *
   * - "image/jpeg" → 🖼️
   * - "application/pdf" → 📄
   * - "application/vnd.ms-excel" → 📊
   * - "application/zip" → 📦
   * - "application/custom" → 📎
   *
   * @param mimeType - File MIME type (e.g., "image/jpeg")
   * @returns Emoji representing file type
   */
  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word')) return '📝'
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦'
    return '📎'
  }
  // CLOSE: get-file-icon

  /**
   * REF: loading-state
   *
   * # Loading State
   *
   * Displayed while fetching attachments from Firestore.
   *
   * Shows brief loading message during initial data fetch.
   */
  if (loading) {
    return <div className="text-sm text-gray-500">Loading attachments...</div>
  }
  // CLOSE: loading-state

  /**
   * REF: empty-state
   *
   * # Empty State
   *
   * Displayed when todo has no attachments.
   *
   * Provides clear feedback that there are no files.
   */
  if (attachments.length === 0) {
    return <div className="text-sm text-gray-500">No attachments</div>
  }
  // CLOSE: empty-state

  /**
   * REF: attachment-list-render
   *
   * # Attachment List Render
   *
   * Displays grid of attachment cards with download and delete actions.
   *
   * ## Layout Structure
   *
   * - Space-Y-2: Vertical spacing between items
   * - Each card is a flex container
   * - Left side: File icon, name, size
   * - Right side: Action buttons
   *
   * ## File Info Display
   *
   * | `Element` | Purpose |
   * |---------|---------|
   * | `Icon` | Visual type identification |
   * | File name | Truncated with title tooltip |
   * | File size | Human-readable format |
   *
   * ## Actions
   *
   * - **Download** - Opens file URL in new tab
   * - **Delete** - Only shows if canDelete prop is true
   *
   * ## Accessibility
   *
   * - Title attributes on links for screen readers
   * - Proper button labels
   * - Keyboard navigable
   * - Disabled state for delete during operation
   *
   * ## Dark Mode
   *
   * - Gray background with dark: variants
   * - Text colors adapt to dark mode
   * - Hover states visible in both themes
   */
  return (
    <div className="space-y-2">
      {attachments.map(attachment => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          {/* File Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Icon */}
            <span className="text-2xl flex-shrink-0">
              {getFileIcon(attachment.mimeType)}
            </span>

            {/* Name and Size */}
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate" title={attachment.fileName}>
                {attachment.fileName}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(attachment.fileSize)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Download Button */}
            <a
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition"
              title={`Download ${attachment.fileName}`}
            >
              ⬇️
            </a>

            {/* Delete Button (if allowed) */}
            {canDelete && (
              <button
                onClick={() => handleDelete(attachment)}
                disabled={deleting === attachment.id}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Delete ${attachment.fileName}`}
              >
                {deleting === attachment.id ? '⏳' : '🗑️'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
  // CLOSE: attachment-list-render
}
