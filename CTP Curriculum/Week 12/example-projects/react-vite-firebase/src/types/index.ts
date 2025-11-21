/**
 * REF: shared-types
 *
 * # Shared Type Definitions
 *
 * Central type definitions for the React + Vite + Firebase application.
 *
 * ## Key Concepts
 *
 * - **Type safety** - Prevent runtime errors
 * - **Single source of truth** - Types defined once
 * - **IntelliSense** - Editor autocomplete
 * - **Documentation** - Self-documenting code
 *
 * ## Import Usage
 *
 * ```typescript
 * import { Todo, User, Message, Attachment } from '@/types'
 * ```
 */

import { Timestamp } from 'firebase/firestore'

/**
 * REF: attachment-interface
 *
 * ## Attachment Interface
 *
 * Represents a file attached to a todo.
 *
 * ### Fields
 *
 * | `Field` | Type | Description |
 * |-------|------|-------------|
 * | `fileName` | `string` | Original filename |
 * | `fileUrl` | `string` | Firebase Storage download URL |
 * | `fileSize` | `number` | Size in bytes |
 * | `mimeType` | `string` | File MIME type |
 * | `uploadedAt` | `Timestamp` | When file was uploaded |
 *
 * ### Example
 *
 * ```typescript
 * const attachment: Attachment = {
 *   fileName: 'document.pdf',
 *   fileUrl: 'https://storage.googleapis.com/...',
 *   fileSize: 102400,
 *   mimeType: 'application/pdf',
 *   uploadedAt: Timestamp.now()
 * }
 * ```
 */
export interface Attachment {
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt?: Timestamp
}
// CLOSE: attachment-interface

/**
 * REF: todo-interface
 *
 * ## Todo Interface
 *
 * Represents a todo item in the application.
 *
 * ### Fields
 *
 * | `Field` | Type | `Required` | Description |
 * |-------|------|----------|-------------|
 * | `id` | `string` | `Yes` | Firestore document ID |
 * | `userId` | `string` | `Yes` | Owner's user ID |
 * | `title` | `string` | `Yes` | Todo title |
 * | `description` | `string` | `No` | Detailed description |
 * | `completed` | `boolean` | `Yes` | Completion status |
 * | `isPublic` | `boolean` | `Yes` | Visibility in feed |
 * | `tags` | `string[]` | `No` | Category tags |
 * | `attachments` | `Attachment[]` | `No` | File attachments |
 * | `createdAt` | `Timestamp` | `Yes` | Creation time |
 * | `updatedAt` | `Timestamp` | `Yes` | Last update time |
 *
 * ### Example
 *
 * ```typescript
 * const todo: Todo = {
 *   id: 'abc123',
 *   userId: 'user123',
 *   title: 'Complete project',
 *   description: 'Finish React app',
 *   completed: false,
 *   isPublic: true,
 *   tags: ['work', 'urgent'],
 *   attachments: [],
 *   createdAt: Timestamp.now(),
 *   updatedAt: Timestamp.now()
 * }
 * ```
 */
export interface Todo {
  id: string
  userId: string
  title: string
  description?: string
  completed: boolean
  isPublic: boolean
  tags?: string[]
  attachments?: Attachment[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
// CLOSE: todo-interface

/**
 * REF: user-interface
 *
 * ## User Interface
 *
 * Represents a user profile.
 *
 * ### Fields
 *
 * | `Field` | Type | `Required` | Description |
 * |-------|------|----------|-------------|
 * | `id` | `string` | `Yes` | Firebase Auth UID |
 * | `email` | `string` | `Yes` | User's email |
 * | `displayName` | `string` | `No` | Display name |
 * | `photoURL` | `string` | `No` | Profile picture URL |
 * | `createdAt` | `Timestamp` | `Yes` | Account creation time |
 */
export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Timestamp
}
// CLOSE: user-interface

/**
 * REF: message-interface
 *
 * ## Message Interface
 *
 * Represents a direct message between users.
 *
 * ### Fields
 *
 * | `Field` | Type | `Required` | Description |
 * |-------|------|----------|-------------|
 * | `id` | `string` | `Yes` | Firestore document ID |
 * | `senderId` | `string` | `Yes` | Message sender's ID |
 * | `recipientId` | `string` | `Yes` | Message recipient's ID |
 * | `content` | `string` | `Yes` | Message text |
 * | `read` | `boolean` | `Yes` | Read status |
 * | `readAt` | `Timestamp` | `No` | When message was read |
 * | `createdAt` | `Timestamp` | `Yes` | Send time |
 */
export interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  read: boolean
  readAt?: Timestamp
  createdAt: Timestamp
}
// CLOSE: message-interface

/**
 * REF: settings-interface
 *
 * ## Settings Interface
 *
 * User preferences and accessibility settings.
 *
 * ### Fields
 *
 * | `Field` | Type | Description |
 * |-------|------|-------------|
 * | `userId` | `string` | User's ID |
 * | `theme` | `string` | 'light' or 'dark' |
 * | `fontSize` | `string` | 'small', 'medium', 'large' |
 * | `highContrast` | `boolean` | High contrast mode |
 * | `reducedMotion` | `boolean` | Reduced motion preference |
 */
export interface Settings {
  userId: string
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
}
// CLOSE: settings-interface
// CLOSE: shared-types
