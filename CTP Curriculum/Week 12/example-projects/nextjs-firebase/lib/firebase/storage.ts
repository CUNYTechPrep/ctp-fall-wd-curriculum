/**
 * REF: firebase-storage-file
 *
 * # Firebase Storage Utilities
 *
 * Helper functions for file uploads and management.
 *
 * ## Key Concepts
 *
 * - **Firebase Storage:** S3-like object storage from Google
 * - **File uploads:** Browser → Firebase Storage
 * - **Storage paths:** Organized by user and purpose
 * - **Metadata:** Track file info (size, type, URL)
 *
 * ## Storage Organization
 *
 * Files organized by user and type:
 * - `profile-pictures/{userId}/{filename}`
 * - `todo-attachments/{userId}/{todoId}/{filename}`
 *
 * ### Why This Structure?
 *
 * - Easy to find user's files
 * - Easy to delete user data
 * - Security rules can protect by path
 * - Clear ownership
 *
 * **Audio Guide:** `audio/nextjs-firebase/storage-utilities.mp3`
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadMetadata,
} from 'firebase/storage'
import { storage } from './client'

/**
 * REF: upload-profile-picture
 *
 * ## Upload Profile Picture
 *
 * Uploads user's profile picture to Firebase Storage.
 *
 * ### Parameters
 *
 * - `userId`: User's unique ID (for path organization)
 * - `file`: File object from input element
 *
 * ### Returns
 *
 * Object with file metadata:
 * - `fileName`: Generated unique filename
 * - `fileUrl`: Public download URL
 * - `fileSize`: Size in bytes
 * - `mimeType`: File type (e.g., "image/png")
 *
 * ### Storage Path
 *
 * Files stored at: `profile-pictures/{userId}/{timestamp}_{originalname}`
 *
 * **Why timestamp?**
 * - Prevents filename collisions
 * - Unique even if same filename uploaded twice
 * - Natural ordering (newest first)
 */
export async function uploadProfilePicture(userId: string, file: File) {
  const fileName = `${Date.now()}_${file.name}`
  const storageRef = ref(storage, `profile-pictures/${userId}/${fileName}`)

  const metadata: UploadMetadata = {
    contentType: file.type,
  }

  /**
   * Upload file to Storage and get download URL.
   *
   * Steps:
   * 1. `uploadBytes()` uploads file
   * 2. `getDownloadURL()` gets public URL
   * 3. Return metadata for Firestore
   */
  const snapshot = await uploadBytes(storageRef, file, metadata)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return {
    fileName,
    fileUrl: downloadURL,
    fileSize: file.size,
    mimeType: file.type,
  }
}
// CLOSE: upload-profile-picture

/**
 * REF: upload-todo-attachment
 *
 * ## Upload Todo Attachment
 *
 * Uploads a file attachment for a todo item.
 *
 * ### Parameters
 *
 * - `userId`: Owner of the todo
 * - `todoId`: Todo this attaches to
 * - `file`: File to upload
 *
 * ### Storage Path
 *
 * `todo-attachments/{userId}/{todoId}/{filename}`
 *
 * Organized by:
 * 1. User (for access control)
 * 2. Todo (for grouping)
 * 3. Filename (unique with timestamp)
 *
 * ### Return Value
 *
 * Metadata object to save in Firestore:
 * - Use for displaying attachment list
 * - Track file info without querying Storage
 */
export async function uploadTodoAttachment(userId: string, todoId: string, file: File) {
  const fileName = `${Date.now()}_${file.name}`
  const storageRef = ref(storage, `todo-attachments/${userId}/${todoId}/${fileName}`)

  const metadata: UploadMetadata = {
    contentType: file.type,
  }

  const snapshot = await uploadBytes(storageRef, file, metadata)
  const downloadURL = await getDownloadURL(snapshot.ref)

  return {
    fileName,
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
 * Removes a file from Firebase Storage.
 *
 * ### Parameter
 *
 * - `filePath`: Full storage path to file
 *
 * ### Important
 *
 * Also delete metadata from Firestore!
 * ```typescript
 * await deleteFile(attachment.filePath)
 * await db.collection('attachments').doc(id).delete()
 * ```
 *
 * **Two-step delete** ensures cleanup.
 */
export async function deleteFile(filePath: string) {
  const storageRef = ref(storage, filePath)
  await deleteObject(storageRef)
}
// CLOSE: delete-file

/**
 * REF: validate-image
 *
 * ## Validate Image File
 *
 * Client-side validation for image uploads.
 *
 * ### Validation Rules
 *
 * **Allowed Types:**
 * - JPEG, PNG, GIF, WebP only
 *
 * **Size Limit:**
 * - Maximum 5MB
 *
 * ### Returns
 *
 * Object with `valid` boolean and optional `error` message.
 *
 * ### Usage
 *
 * ```typescript
 * const validation = validateImageFile(file)
 * if (!validation.valid) {
 *   alert(validation.error)
 *   return
 * }
 * // Proceed with upload
 * ```
 *
 * ### Security Note
 *
 * Client validation is **UX only**!
 * - Storage rules enforce server-side
 * - Never trust client validation alone
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  /**
   * Check file type against allowed list.
   */
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).' }
  }

  /**
   * Check file size against maximum.
   */
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit.' }
  }

  return { valid: true }
}
// CLOSE: validate-image

/**
 * REF: validate-attachment
 *
 * ## Validate Attachment File
 *
 * Client-side validation for todo attachments.
 *
 * ### Validation Rules
 *
 * **Any file type allowed** (documents, images, etc.)
 *
 * **Size Limit:**
 * - Maximum 5MB
 *
 * ### Less Restrictive
 *
 * Unlike `validateImageFile()`:
 * - No MIME type restriction
 * - Attachments can be PDFs, Word docs, etc.
 * - Still limited to 5MB for performance
 *
 * ### Usage
 *
 * ```typescript
 * const validation = validateAttachmentFile(file)
 * if (!validation.valid) {
 *   showError(validation.error)
 *   return
 * }
 * await uploadTodoAttachment(userId, todoId, file)
 * ```
 */
export function validateAttachmentFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit.' }
  }

  return { valid: true }
}
// CLOSE: validate-attachment
// CLOSE: firebase-storage-file
