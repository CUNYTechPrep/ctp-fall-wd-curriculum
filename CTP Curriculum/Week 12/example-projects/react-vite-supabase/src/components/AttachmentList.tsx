/**
 * REF: attachment-list-supabase-component
 *
 * # AttachmentList Component (Supabase)
 *
 * Displays list of file attachments for a todo.
 */

import { Attachment } from '../types'
import { formatFileSize } from '../lib/storage'

interface AttachmentListProps {
  attachments: Attachment[]
  onDelete?: (attachment: Attachment) => void
  readOnly?: boolean
}

export default function AttachmentList({
  attachments,
  onDelete,
  readOnly = false,
}: AttachmentListProps) {
  const handleDelete = (attachment: Attachment) => {
    if (!onDelete) return
    if (confirm(`Delete ${attachment.fileName}?`)) {
      onDelete(attachment)
    }
  }

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

  if (!attachments || attachments.length === 0) {
    return null
  }

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
}
// CLOSE: attachment-list-supabase-component

/**
 * REF: file-display-grid
 *
 * ## Attachment Grid Display
 *
 * ### File Type Detection
 * Uses MIME type to show appropriate emoji icon:
 * - image/* → 🖼️ (image icon)
 * - video/* → 🎥 (video camera)
 * - audio/* → 🎵 (musical note)
 * - */pdf → 📄 (document)
 * - */word → 📝 (memo/document)
 * - */sheet → 📊 (bar chart)
 * - */zip → 🗜️ (compression)
 * - default → 📎 (paperclip)
 *
 * ### File Size Formatting
 * formatFileSize() converts bytes to readable:
 * - < 1KB: "123 B"
 * - < 1MB: "4.5 KB"
 * - < 1GB: "12.3 MB"
 * - >= 1GB: "2.5 GB"
 *
 * ### Download Links
 * - Href is public URL from Supabase Storage
 * - target="_blank" opens in new tab
 * - rel="noopener noreferrer" for security
 * - Direct download on click
 *
 * ### Delete Functionality
 * - Delete button shows only if not readOnly
 * - Confirmation dialog before deletion
 * - Calls onDelete callback with attachment
 * - Parent handles removal from Supabase
 *
 * CLOSE: file-display-grid
 */

