/**
 * REF: supabase-storage-utilities
 *
 * # Supabase Storage Utilities
 *
 * Client-side file upload helpers for React + Vite + Supabase.
 *
 * ## Key Concepts
 *
 * - **Supabase Storage** - S3-compatible object storage
 * - **Public buckets** - Accessible without auth
 * - **File validation** - Size and type checking
 * - **Public URLs** - Direct access to files
 *
 * ## Storage Structure
 *
 * ```
 * Buckets:
 *   - profile-pictures (public)
 *   - todo-attachments (public)
 * ```
 */

import { supabase } from './supabase'

/**
 * REF: upload-profile-picture-supabase
 *
 * ## Upload Profile Picture
 *
 * Uploads user's profile picture to Supabase Storage.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `userId` | `string` | User's unique ID |
 * | `file` | `File` | Image file to upload |
 *
 * ### Returns
 *
 * Public URL for the uploaded image.
 *
 * ### Storage Path
 *
 * `profile-pictures/{userId}/{timestamp}-{filename}`
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name}`
  const filePath = `${userId}/${filename}`

  const { data, error } = await supabase.storage
    .from('profile-pictures')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(data.path)

  return publicUrl
}
// CLOSE: upload-profile-picture-supabase

/**
 * REF: upload-todo-attachment-supabase
 *
 * ## Upload Todo Attachment
 *
 * Uploads a file attachment for a specific todo.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `userId` | `string` | User's unique ID |
 * | `todoId` | `string` | Todo's unique ID |
 * | `file` | `File` | File to attach |
 *
 * ### Returns
 *
 * Object with file metadata.
 */
export async function uploadTodoAttachment(
  userId: string,
  todoId: string,
  file: File
): Promise<{
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}> {
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filename = `${timestamp}-${sanitizedName}`
  const filePath = `${userId}/${todoId}/${filename}`

  const { data, error } = await supabase.storage
    .from('todo-attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from('todo-attachments')
    .getPublicUrl(data.path)

  return {
    fileName: file.name,
    fileUrl: publicUrl,
    fileSize: file.size,
    mimeType: file.type,
  }
}
// CLOSE: upload-todo-attachment-supabase

/**
 * REF: delete-file-supabase
 *
 * ## Delete File from Storage
 *
 * Removes a file from Supabase Storage.
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}
// CLOSE: delete-file-supabase

/**
 * REF: validation-helpers-supabase
 *
 * ## File Validation Helpers
 */
export function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024
  return allowedTypes.includes(file.type) && file.size <= maxSize
}

export function validateAttachmentFile(file: File): boolean {
  const maxSize = 5 * 1024 * 1024
  return file.size <= maxSize
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
// CLOSE: validation-helpers-supabase
// CLOSE: supabase-storage-utilities
