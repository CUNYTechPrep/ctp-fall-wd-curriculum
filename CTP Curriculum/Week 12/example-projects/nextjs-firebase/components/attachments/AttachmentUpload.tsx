/**
 * REF: attachment-upload-component
 *
 * # AttachmentUpload Component
 *
 * Handles uploading file attachments to todos.
 *
 * ## Key Concepts
 *
 * - **File input handling** - React file input events
 * - **File validation** - Type and size checks
 * - **Upload progress** - User feedback during upload
 * - **Firebase Storage** - Upload file and get URL
 * - **Error handling** - Graceful failure handling
 *
 * ## Upload Flow
 *
 * ```
 * User selects file
 *     ↓
 * Validate file (type, size)
 *     ↓
 * Upload to Firebase Storage
 *     ↓
 * Get download URL
 *     ↓
 * Save metadata to Firestore
 *     ↓
 * Display in AttachmentList (via real-time listener)
 * ```
 *
 * ## Security Layers
 *
 * | `Layer` | `Validation` |
 * |-------|-----------|
 * | Client-side | File type, size check (UX) |
 * | Storage rules | Server-side authentication check |
 * | `Naming` | Unique filenames prevent overwrites |
 *
 * ## Design Pattern
 *
 * - **Hidden file input** - Triggered by button
 * - **Custom button styling** - Better UX than default input
 * - **Progressive disclosure** - Show errors as needed
 */
// CLOSE: attachment-upload-component

'use client'

/** REF: attachmentupload-imports
 * Required imports for React hooks, auth context, and Firebase services.
 * Handles file upload and Firestore operations.
 */
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { uploadTodoAttachment, validateAttachmentFile } from '@/lib/firebase/storage'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
// CLOSE: attachmentupload-imports

/**
 * REF: attachment-upload-props
 *
 * # AttachmentUpload Props Interface
 *
 * Configuration for file upload component.
 *
 * ## Props
 *
 * | `Prop` | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `todoId` | `string` | `Yes` | ID of todo to attach file to |
 * | `onUploadComplete` | `function` | `No` | Callback when upload succeeds |
 *
 * ## Callback Usage
 *
 * The optional callback allows parent to know when upload is done:
 * - Refresh attachment list
 * - Show success message
 * - Update UI state
 *
 * Note: AttachmentList automatically updates via real-time listener
 */
interface AttachmentUploadProps {
  todoId: string
  onUploadComplete?: () => void
}
// CLOSE: attachment-upload-props

export default function AttachmentUpload({ todoId, onUploadComplete }: AttachmentUploadProps) {
  const { user } = useAuth()

  /**
   * REF: upload-component-state
   *
   * # Upload Component State
   *
   * Managing file upload progress and error handling.
   *
   * ## State Variables
   *
   * | `Variable` | Type | Purpose |
   * |----------|------|---------|
   * | `uploading` | `boolean` | Shows loading state, disables input |
   * | `error` | `string` | Error message to display to user |
   *
   * ## State Flow
   *
   * 1. User selects file → uploading = true
   * 2. Validation fails → error = message, uploading = false
   * 3. Upload succeeds → error = '', uploading = false
   * 4. Upload fails → error = message, uploading = false
   */
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  // CLOSE: upload-component-state

  /**
   * REF: file-selection-handler
   *
   * # File Selection Handler
   *
   * Triggered when user selects a file from their device.
   *
   * ## Flow
   *
   * 1. **Extract file** - Get selected file from input event
   * 2. **Pre-flight checks** - Verify file and user exist
   * 3. **Validate file** - Check type and size
   * 4. **Upload** - Send to Firebase Storage
   * 5. **Save metadata** - Create Firestore document
   * 6. **Notify parent** - Call onUploadComplete callback
   * 7. **Reset** - Clear input for next upload
   *
   * ## Error Handling
   *
   * | Error Type | `Behavior` |
   * |------------|----------|
   * | No file selected | Return silently |
   * | Validation fails | Show error, stop |
   * | Upload fails | Show error, form usable |
   * | Database fails | Show error, file in Storage |
   *
   * ## Upload Result
   *
   * uploadTodoAttachment returns:
   * - fileName: Original filename
   * - fileUrl: Public download URL
   * - fileSize: Size in bytes
   * - mimeType: File MIME type
   *
   * @param e - File input change event
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the selected file
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Reset error state
    setError('')

    // Validate file
    const validation = validateAttachmentFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return
    }

    setUploading(true)

    try {
      /**
       * Upload to Firebase Storage
       *
       * uploadTodoAttachment() handles:
       * - Creating unique filename
       * - Uploading file to Storage
       * - Returning download URL and metadata
       */
      const uploadResult = await uploadTodoAttachment(user.uid, todoId, file)

      /**
       * Save metadata to Firestore
       *
       * Why separate Storage and Firestore?
       * - Storage: Stores actual file bytes
       * - Firestore: Stores searchable metadata
       * - Can query attachments by todo ID
       * - Can delete from both places independently
       * - Metadata available in real-time listener
       */
      await addDoc(collection(db, 'todoAttachments'), {
        todoId,
        fileName: uploadResult.fileName,
        fileUrl: uploadResult.fileUrl,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        uploadedAt: new Date(),
      })

      // Notify parent component (refreshes attachment list)
      onUploadComplete?.()

      // Reset the file input
      e.target.value = ''
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }
  // CLOSE: file-selection-handler

  /**
   * REF: upload-component-render
   *
   * # Upload Component Render
   *
   * Form UI for selecting and uploading files.
   *
   * ## Layout Structure
   *
   * 1. **Error banner** - Shows validation or upload errors
   * 2. **File input** - Hidden, triggered by button
   * 3. **Upload button** - Styled label that opens file picker
   * 4. **Helper text** - Shows max file size and accepted types
   *
   * ## UX Patterns
   *
   * ### Hidden File Input
   * - Native file input is replaced by button
   * - Better visual control
   * - Consistent with design system
   *
   * ### Button States
   * - **Normal** - Blue background, clickable
   * - **Uploading** - Gray background, disabled, shows spinner
   * - **Error** - Shows message above button
   *
   * ### Helper Text
   * - Shows constraints (5MB max)
   * - All file types accepted
   * - Validation happens in code
   *
   * ## Accessibility
   *
   * - Label associated with hidden input
   * - Form spacing for readability
   * - Clear error messages
   * - Disabled state prevents interaction during upload
   */
  return (
    <div className="space-y-2">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        type="file"
        id={`attachment-upload-${todoId}`}
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
        accept="*/*" // Accept all files, validation happens in code
      />

      {/* Upload Button (Label styled as button) */}
      <label
        htmlFor={`attachment-upload-${todoId}`}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
          uploading
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {uploading ? (
          <>
            <span className="animate-spin">⏳</span>
            Uploading...
          </>
        ) : (
          <>
            📎 Attach File
          </>
        )}
      </label>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Max file size: 5MB. All file types supported.
      </p>
    </div>
  )
  // CLOSE: upload-component-render
}
