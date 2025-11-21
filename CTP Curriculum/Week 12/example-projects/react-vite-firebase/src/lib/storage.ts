/**
 * REF: storage-utilities
 *
 * # Firebase Storage Utilities
 *
 * Client-side file upload helpers for React + Vite.
 *
 * ## Key Concepts
 *
 * - **Cloud Storage** - Store files in Firebase Storage
 * - **Client-side uploads** - Direct from browser
 * - **File validation** - Size and type checking
 * - **Download URLs** - Public URLs for file access
 * - **Metadata** - File information for database
 *
 * ## Storage Structure
 *
 * ```
 * storage/
 *   profile-pictures/{userId}/{filename}
 *   todo-attachments/{userId}/{todoId}/{filename}
 * ```
 *
 * ## Security
 *
 * Storage rules enforce:
 * - Authentication required
 * - File size limits (5MB)
 * - Valid file types only
 * - Users can only upload to their folders
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

/**
 * REF: upload-profile-picture
 *
 * ## Upload Profile Picture
 *
 * Uploads user's profile picture to Firebase Storage.
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
 * Download URL for the uploaded image.
 *
 * ### Validation
 *
 * - **Allowed types**: JPEG, PNG, GIF, WebP
 * - **Max size**: 5MB
 * - **Throws**: Error if validation fails
 *
 * ### Example
 *
 * ```typescript
 * const url = await uploadProfilePicture(user.uid, imageFile)
 * // Update user profile with URL
 * ```
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  // Create storage reference
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name}`
  const storageRef = ref(storage, `profile-pictures/${userId}/${filename}`)

  // Upload file with metadata
  const metadata = {
    contentType: file.type,
    customMetadata: {
      uploadedBy: userId,
      originalName: file.name,
    },
  }

  const snapshot = await uploadBytes(storageRef, file, metadata)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return downloadURL
}
// CLOSE: upload-profile-picture

/**
 * REF: upload-todo-attachment
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
 * Object with file metadata for Firestore.
 *
 * ```typescript
 * {
 *   fileName: string
 *   fileUrl: string
 *   fileSize: number
 *   mimeType: string
 * }
 * ```
 *
 * ### Validation
 *
 * - **Max size**: 5MB
 * - **All file types** allowed
 * - **Sanitized filenames** for security
 *
 * ### Example
 *
 * ```typescript
 * const attachment = await uploadTodoAttachment(
 *   user.uid,
 *   todoId,
 *   selectedFile
 * )
 *
 * // Add to todo's attachments array
 * await updateDoc(todoRef, {
 *   attachments: arrayUnion(attachment)
 * })
 * ```
 *
 * ### Storage Path
 *
 * Files stored at: `todo-attachments/{userId}/{todoId}/{timestamp}-{filename}`
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
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  // Create safe filename
  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filename = `${timestamp}-${sanitizedName}`

  // Create storage reference
  const storageRef = ref(storage, `todo-attachments/${userId}/${todoId}/${filename}`)

  // Upload file with metadata
  const metadata = {
    contentType: file.type,
    customMetadata: {
      uploadedBy: userId,
      todoId: todoId,
      originalName: file.name,
    },
  }

  const snapshot = await uploadBytes(storageRef, file, metadata)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return {
    fileName: file.name,
    fileUrl: downloadURL,
    fileSize: file.size,
    mimeType: file.type,
  }
}
// CLOSE: upload-todo-attachment

/**
 * REF: delete-file
 *
 * ## Delete File from Storage
 *
 * Deletes a file using its download URL.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `fileUrl` | `string` | Full download URL of file |
 *
 * ### Implementation
 *
 * Extracts storage path from URL and deletes the file.
 *
 * ### Example
 *
 * ```typescript
 * await deleteFile(attachment.fileUrl)
 * ```
 *
 * ### Error Handling
 *
 * - Silently fails if file doesn't exist
 * - Logs errors to console
 * - Doesn't throw to prevent blocking deletion
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract path from download URL
    const url = new URL(fileUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/)
    if (!pathMatch) {
      console.error('Invalid file URL')
      return
    }

    const filePath = decodeURIComponent(pathMatch[1])
    const fileRef = ref(storage, filePath)

    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    // Don't throw - allow deletion to continue even if file removal fails
  }
}
// CLOSE: delete-file

/**
 * REF: validation-helpers
 *
 * ## File Validation Helpers
 *
 * Utility functions for validating files before upload.
 */

// REF: Checks if file is a valid image.
/**
 * ### Validate Image File
 *
 * Checks if file is a valid image.
 *
 * @param file - File to validate
 * @returns True if valid image
 */
// CLOSE
export function validateImageFile(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  return allowedTypes.includes(file.type) && file.size <= maxSize
}

// REF: Checks if file meets attachment requirements.
/**
 * ### Validate Attachment File
 *
 * Checks if file meets attachment requirements.
 *
 * @param file - File to validate
 * @returns True if valid attachment
 */
// CLOSE
export function validateAttachmentFile(file: File): boolean {
  const maxSize = 5 * 1024 * 1024
  return file.size <= maxSize
}

// REF: Converts bytes to human-readable format.
/**
 * ### Format File Size
 *
 * Converts bytes to human-readable format.
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
// CLOSE
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
// CLOSE: validation-helpers
// CLOSE: storage-utilities
