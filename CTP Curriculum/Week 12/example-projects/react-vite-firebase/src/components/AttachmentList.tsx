/**
 * REF: attachment-list-component
 *
 * # AttachmentList Component
 *
 * Displays list of file attachments for a todo.
 *
 * ## Key Concepts
 *
 * - **File display** - Show attached files
 * - **Download links** - Click to download
 * - **File metadata** - Name, size, type
 * - **Delete functionality** - Remove attachments
 *
 * ## Features
 *
 * - File type icons
 * - Human-readable file sizes
 * - Download on click
 * - Delete confirmation
 */

import { Attachment } from '../types'
import { formatFileSize, deleteFile } from '../lib/storage'

/**
 * REF: attachment-list-props
 *
 * ## Props Interface
 *
 * | `Prop` | Type | Description |
 * |------|------|-------------|
 * | `attachments` | `Attachment[]` | Array of attachment objects |
 * | `onDelete` | `Function` | Callback when attachment deleted |
 * | `readOnly` | `boolean` | If true, hide delete button |
 */
interface AttachmentListProps {
  attachments: Attachment[]
  onDelete?: (attachment: Attachment) => void
  readOnly?: boolean
}
// CLOSE: attachment-list-props

export default function AttachmentList({
  attachments,
  onDelete,
  readOnly = false,
}: AttachmentListProps) {
  /**
   * REF: delete-handler
   *
   * ## Delete Attachment Handler
   *
   * Removes attachment from Storage and todo.
   *
   * ### Process
   *
   * 1. Delete file from Storage
   * 2. Call onDelete callback
   * 3. Parent updates Firestore
   */
  const handleDelete = async (attachment: Attachment) => {
    if (!onDelete) return

    if (confirm(`Delete ${attachment.fileName}?`)) {
      await deleteFile(attachment.fileUrl)
      onDelete(attachment)
    }
  }
  // CLOSE: delete-handler

  /**
   * REF: file-icon
   *
   * ## Get File Type Icon
   *
   * Returns appropriate emoji for file type.
   */
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '🗜️'
    return '📎'
  }
  // CLOSE: file-icon

  if (!attachments || attachments.length === 0) {
    return null
  }

  /**
   * REF: attachment-list-render
   *
   * ## Attachment List Render
   *
   * Grid of attachment cards with download links.
   *
   * ### Card Contents
   *
   * - File type icon
   * - File name
   * - File size
   * - Delete button (if not readOnly)
   */
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Attachments</h4>
      <div className="space-y-2">
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >
            <a
              href={attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 flex-1 hover:text-blue-600 transition"
            >
              <span className="text-2xl">
                {getFileIcon(attachment.mimeType)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {attachment.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>
            </a>

            {!readOnly && onDelete && (
              <button
                onClick={() => handleDelete(attachment)}
                className="ml-2 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
  // CLOSE: attachment-list-render
}
// CLOSE: attachment-list-component
