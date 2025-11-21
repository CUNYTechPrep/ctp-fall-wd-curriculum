/**
 * REF: attachment-upload-component
 *
 * # AttachmentUpload Component
 *
 * File upload component for todo attachments.
 *
 * ## Key Concepts
 *
 * - **File input** - HTML file picker
 * - **Client-side upload** - Direct to Firebase Storage
 * - **Progress feedback** - Loading states
 * - **Error handling** - Validation and errors
 *
 * ## Features
 *
 * - File size validation (5MB max)
 * - Upload progress indication
 * - Error messages for invalid files
 * - Success callback after upload
 */

import { useState, ChangeEvent } from 'react'
import { uploadTodoAttachment, validateAttachmentFile, formatFileSize } from '../lib/storage'
import { Attachment } from '../types'

/**
 * REF: attachment-upload-props
 *
 * ## Props Interface
 *
 * | `Prop` | Type | Description |
 * |------|------|-------------|
 * | `userId` | `string` | Current user's ID |
 * | `todoId` | `string` | Todo to attach file to |
 * | `onUploadComplete` | `Function` | Callback with attachment data |
 */
interface AttachmentUploadProps {
  userId: string
  todoId: string
  onUploadComplete: (attachment: Attachment) => void
}
// CLOSE: attachment-upload-props

export default function AttachmentUpload({
  userId,
  todoId,
  onUploadComplete,
}: AttachmentUploadProps) {
  /**
   * REF: upload-state
   *
   * ## Component State
   *
   * - **uploading** - Upload in progress
   * - **error** - Error message if any
   */
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  // CLOSE: upload-state

  /**
   * REF: file-upload-handler
   *
   * ## File Upload Handler
   *
   * Handles file selection and upload to Firebase Storage.
   *
   * ### Process
   *
   * 1. Validate file size and type
   * 2. Upload to Firebase Storage
   * 3. Get download URL
   * 4. Call onUploadComplete with metadata
   * 5. Reset form
   *
   * ### Error Handling
   *
   * - File too large (> 5MB)
   * - Upload failure
   * - Network errors
   */
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Validate file
    if (!validateAttachmentFile(file)) {
      setError('File must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Upload to Firebase Storage
      const attachment = await uploadTodoAttachment(userId, todoId, file)

      // Call parent callback
      onUploadComplete({
        ...attachment,
      })

      // Reset input
      e.target.value = ''
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }
  // CLOSE: file-upload-handler

  /**
   * REF: upload-ui
   *
   * ## Upload UI
   *
   * Simple file input with loading state.
   *
   * ### States
   *
   * - **Normal** - Choose file button
   * - **Uploading** - Disabled with loading text
   * - **Error** - Red error message
   */
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium mb-1">
          Attach File
        </label>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Max file size: 5MB
        </p>
      </div>

      {uploading && (
        <p className="text-sm text-blue-600">
          Uploading...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
  // CLOSE: upload-ui
}
// CLOSE: attachment-upload-component
