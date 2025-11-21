/**
 * REF: attachment-upload-supabase-component
 *
 * # AttachmentUpload Component (Supabase)
 *
 * File upload component for todo attachments using Supabase Storage.
 */

import { useState, ChangeEvent } from 'react'
import { uploadTodoAttachment, validateAttachmentFile } from '../lib/storage'
import { Attachment } from '../types'

interface AttachmentUploadProps {
  userId: string
  todoId: string
  onUploadComplete: (attachment: Attachment) => void
}

export default function AttachmentUpload({
  userId,
  todoId,
  onUploadComplete,
}: AttachmentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    if (!validateAttachmentFile(file)) {
      setError('File must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const attachment = await uploadTodoAttachment(userId, todoId, file)
      onUploadComplete({
        ...attachment,
        uploadedAt: new Date().toISOString(),
      })
      e.target.value = ''
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

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
}
// CLOSE: attachment-upload-supabase-component
