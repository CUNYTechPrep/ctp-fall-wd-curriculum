/**
 * REF: types-file-header
 *
 * # TypeScript Type Definitions
 *
 * Centralized type definitions for the Next.js + Firebase application.
 *
 * ## Key Concepts
 *
 * - **TypeScript interfaces** - Define data shapes
 * - **Compile-time validation** - Catch errors before runtime
 * - **IDE autocomplete** - Better developer experience
 * - **Self-documenting code** - Types explain data structure
 *
 * ## Why Centralized Types?
 *
 * | Benefit | Description |
 * |---------|-------------|
 * | Single source of truth | Update in one place |
 * | Reusability | Import across components |
 * | Consistency | Same data shape everywhere |
 * | Easy refactoring | Change once, TypeScript finds all usages |
 *
 * ## Firestore Timestamp
 *
 * Firebase's `Timestamp` type for dates:
 * - Stores as seconds + nanoseconds
 * - Convert to JavaScript Date with `.toDate()`
 * - Use `Timestamp.now()` for current server time
 * - Consistent across timezones
 */

import { Timestamp } from 'firebase/firestore'
// CLOSE: types-file-header

/**
 * REF: user-interface
 *
 * ## User Interface
 *
 * Represents a user profile in the application.
 *
 * ### Fields
 *
 * | Field | Type | Required | Description |
 * |-------|------|----------|-------------|
 * | `id` | `string` | Yes | Unique identifier (Firebase Auth UID) |
 * | `email` | `string` | Yes | User's email address |
 * | `displayName` | `string` | No | Optional display name |
 * | `profilePicture` | `string` | No | URL to profile image in Storage |
 * | `createdAt` | `Timestamp` | Yes | Account creation time |
 * | `updatedAt` | `Timestamp` | Yes | Last profile update time |
 *
 * ### Stored In
 *
 * Firestore collection: `users`
 *
 * ### Optional Fields
 *
 * The `?` question mark indicates optional fields:
 * - Can be `undefined`
 * - Must check before using: `if (user.displayName) { ... }`
 * - TypeScript enforces null checks
 *
 * ### Example
 *
 * ```typescript
 * const user: User = {
 *   id: 'abc123',
 *   email: 'user@example.com',
 *   displayName: 'John Doe',
 *   profilePicture: 'https://storage.../photo.jpg',
 *   createdAt: Timestamp.now(),
 *   updatedAt: Timestamp.now()
 * }
 * ```
 */
export interface User {
  id: string
  email: string
  displayName?: string
  profilePicture?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
// CLOSE: user-interface

/**
 * REF: user-settings-interface
 *
 * ## UserSettings Interface
 *
 * Stores user accessibility and appearance preferences.
 *
 * ### Fields
 *
 * | Field | Type | Options | Description |
 * |-------|------|---------|-------------|
 * | `id` | `string` | - | Settings document ID |
 * | `userId` | `string` | - | Reference to user (foreign key) |
 * | `theme` | `'light' \| 'dark'` | light, dark | Color scheme |
 * | `fontSize` | `'small' \| 'medium' \| 'large'` | small, medium, large | Text size |
 * | `highContrast` | `boolean` | true, false | Enhanced contrast mode |
 * | `reducedMotion` | `boolean` | true, false | Disable animations |
 * | `updatedAt` | `Timestamp` | - | Last settings change |
 *
 * ### Stored In
 *
 * Firestore collection: `userSettings`
 *
 * ### Union Types
 *
 * - `theme: 'light' | 'dark'` means ONLY these two string values allowed
 * - TypeScript enforces this at compile time
 * - Prevents typos like `'drak'` or `'lite'`
 * - Great for dropdown/select options
 *
 * ### Example
 *
 * ```typescript
 * const settings: UserSettings = {
 *   id: 'settings-1',
 *   userId: 'user-123',
 *   theme: 'dark',
 *   fontSize: 'medium',
 *   highContrast: false,
 *   reducedMotion: true,
 *   updatedAt: Timestamp.now()
 * }
 * ```
 */
export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark'
  fontSize: 'small' | 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
  updatedAt: Timestamp
}
// CLOSE: user-settings-interface

/**
 * REF: todo-interface
 *
 * ## Todo Interface
 *
 * Represents a single todo item.
 *
 * ### Fields
 *
 * | Field | Type | Required | Description |
 * |-------|------|----------|-------------|
 * | `id` | `string` | Yes | Unique todo identifier |
 * | `userId` | `string` | Yes | Owner of the todo |
 * | `title` | `string` | Yes | Todo title (max 500 chars) |
 * | `description` | `string` | No | Optional detailed description |
 * | `completed` | `boolean` | Yes | Completion status |
 * | `isPublic` | `boolean` | Yes | Visible in public feed |
 * | `tags` | `string[]` | No | Array of tag strings |
 * | `createdAt` | `Timestamp` | Yes | Creation time |
 * | `updatedAt` | `Timestamp` | Yes | Last modification time |
 *
 * ### Stored In
 *
 * Firestore collection: `todos`
 *
 * ### Public Todos
 *
 * - `isPublic: true` makes todo visible to all users
 * - Used for community feed feature
 * - Security rules enforce modification permissions
 *
 * ### Array Fields
 *
 * - `tags?: string[]` is optional array
 * - Can be `undefined` or empty array `[]`
 * - Check with: `if (todo.tags?.length) { ... }`
 * - Optional chaining `?.` prevents errors
 *
 * ### Example
 *
 * ```typescript
 * const todo: Todo = {
 *   id: 'todo-123',
 *   userId: 'user-456',
 *   title: 'Complete documentation',
 *   description: 'Add REF/CLOSE markers to all files',
 *   completed: false,
 *   isPublic: true,
 *   tags: ['work', 'urgent'],
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
  createdAt: Timestamp
  updatedAt: Timestamp
}
// CLOSE: todo-interface

/**
 * REF: todo-attachment-interface
 *
 * ## TodoAttachment Interface
 *
 * Metadata for files attached to todos.
 *
 * ### Fields
 *
 * | Field | Type | Required | Description |
 * |-------|------|----------|-------------|
 * | `id` | `string` | Yes | Attachment identifier |
 * | `todoId` | `string` | Yes | Parent todo reference |
 * | `fileName` | `string` | Yes | Original filename |
 * | `fileUrl` | `string` | Yes | Download URL from Storage |
 * | `fileSize` | `number` | Yes | Size in bytes |
 * | `mimeType` | `string` | Yes | File MIME type |
 * | `uploadedAt` | `Timestamp` | Yes | Upload timestamp |
 *
 * ### Stored In
 *
 * Firestore collection: `todoAttachments`
 *
 * ### File Storage Architecture
 *
 * Two-part system:
 * 1. **File content** → Firebase Storage bucket
 * 2. **File metadata** → Firestore collection (this interface)
 *
 * Why separate?
 * - Searchable metadata in Firestore
 * - Large files in Storage
 * - Query attachments without downloading files
 * - Better performance
 *
 * ### Size Limits
 *
 * - `fileSize` validated (max 5MB typically)
 * - Enforced in Storage rules and client code
 * - Prevents abuse and excessive costs
 *
 * ### Example
 *
 * ```typescript
 * const attachment: TodoAttachment = {
 *   id: 'attach-789',
 *   todoId: 'todo-123',
 *   fileName: 'document.pdf',
 *   fileUrl: 'https://storage.googleapis.com/...',
 *   fileSize: 102400, // bytes
 *   mimeType: 'application/pdf',
 *   uploadedAt: Timestamp.now()
 * }
 * ```
 */
export interface TodoAttachment {
  id: string
  todoId: string
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt: Timestamp
}
// CLOSE: todo-attachment-interface

/**
 * REF: message-interface
 *
 * ## Message Interface
 *
 * Represents a direct message in the chat system.
 *
 * ### Fields
 *
 * | Field | Type | Required | Description |
 * |-------|------|----------|-------------|
 * | `id` | `string` | Yes | Message identifier |
 * | `senderId` | `string` | Yes | User who sent message |
 * | `recipientId` | `string` | Yes | User who receives message |
 * | `content` | `string` | Yes | Message text (max 2000 chars) |
 * | `read` | `boolean` | Yes | Read status |
 * | `readAt` | `Timestamp` | No | When marked as read |
 * | `createdAt` | `Timestamp` | Yes | Send time |
 *
 * ### Stored In
 *
 * Firestore collection: `messages`
 *
 * ### Read Receipts
 *
 * Two-field pattern:
 * - `read: boolean` - Simple flag
 * - `readAt?: Timestamp` - When it was read
 *
 * Used for:
 * - "Seen" indicators in chat UI
 * - Message delivery confirmation
 * - Tracking engagement
 *
 * ### Privacy & Security
 *
 * - Security rules ensure only sender/recipient can read
 * - Can't access others' conversations
 * - Enforced at database level (not just UI)
 * - RLS equivalent in Firestore
 *
 * ### Example
 *
 * ```typescript
 * const message: Message = {
 *   id: 'msg-789',
 *   senderId: 'user-123',
 *   recipientId: 'user-456',
 *   content: 'Hello! How are you?',
 *   read: false,
 *   createdAt: Timestamp.now()
 * }
 *
 * // Later, when recipient reads it:
 * await markMessageAsRead(message.id)
 * // Sets: read = true, readAt = Timestamp.now()
 * ```
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
 * REF: todo-with-user-interface
 *
 * ## TodoWithUser Interface
 *
 * Extended Todo with user information for display in public feed.
 *
 * ### Extension Pattern
 *
 * ```typescript
 * interface TodoWithUser extends Todo {
 *   user?: { ... }
 * }
 * ```
 *
 * This means:
 * - Has all `Todo` fields
 * - Plus additional `user` field
 * - Type-safe inheritance
 *
 * ### Fields
 *
 * All fields from `Todo` interface, plus:
 *
 * | Field | Type | Required | Description |
 * |-------|------|----------|-------------|
 * | `user.displayName` | `string` | No | User's display name |
 * | `user.profilePicture` | `string` | No | User's profile picture URL |
 *
 * ### Use Case
 *
 * Public feed showing who created each todo:
 * - Join todo data with user data
 * - Display creator's name and picture
 * - One query instead of two
 *
 * ### Optional User
 *
 * - `user?` means might not have user data
 * - Check before accessing: `if (todo.user?.displayName)`
 * - Optional chaining `?.` prevents null errors
 *
 * ### Example
 *
 * ```typescript
 * const publicTodo: TodoWithUser = {
 *   id: 'todo-123',
 *   userId: 'user-456',
 *   title: 'Learn TypeScript',
 *   completed: false,
 *   isPublic: true,
 *   tags: ['learning'],
 *   createdAt: Timestamp.now(),
 *   updatedAt: Timestamp.now(),
 *   user: {
 *     displayName: 'Jane Doe',
 *     profilePicture: 'https://storage.../photo.jpg'
 *   }
 * }
 *
 * // Display in UI:
 * <div>
 *   <p>{publicTodo.title}</p>
 *   <p>By {publicTodo.user?.displayName ?? 'Anonymous'}</p>
 * </div>
 * ```
 */
export interface TodoWithUser extends Todo {
  user?: {
    displayName?: string
    profilePicture?: string
  }
}
// CLOSE: todo-with-user-interface

/**
 * REF: type-usage-guide
 *
 * ## Using These Types
 *
 * Import types in your components and functions.
 *
 * ### Import Syntax
 *
 * ```typescript
 * import type { Todo, User, Message } from '@/types'
 * ```
 *
 * ### Creating Typed Objects
 *
 * ```typescript
 * const todo: Todo = {
 *   id: '123',
 *   userId: 'user-456',
 *   title: 'Buy groceries',
 *   completed: false,
 *   isPublic: true,
 *   createdAt: Timestamp.now(),
 *   updatedAt: Timestamp.now(),
 * }
 * ```
 *
 * ### TypeScript Validation
 *
 * TypeScript catches errors at compile time:
 *
 * | Error Type | Example | TypeScript Message |
 * |------------|---------|-------------------|
 * | Missing field | No `title` | Property 'title' is missing |
 * | Wrong type | `completed: 'yes'` | Type 'string' not assignable to 'boolean' |
 * | Extra field | `invalid: true` | Object literal may only specify known properties |
 * | Typo | `titel: 'Task'` | Did you mean 'title'? |
 *
 * This catches errors **before runtime**!
 *
 * ### Function Parameters
 *
 * ```typescript
 * async function getTodo(id: string): Promise<Todo | null> {
 *   const doc = await getDoc(doc(db, 'todos', id))
 *   return doc.exists() ? { id: doc.id, ...doc.data() } as Todo : null
 * }
 * ```
 */
// CLOSE: type-usage-guide

/**
 * REF: type-vs-interface
 *
 * ## Type vs Interface
 *
 * Both define object shapes, with slight differences.
 *
 * ### Comparison
 *
 * | Feature | Interface | Type |
 * |---------|-----------|------|
 * | Extend other types | ✅ Yes | ✅ Yes |
 * | Implement by class | ✅ Yes | ❌ No |
 * | Union types | ❌ No | ✅ Yes |
 * | Intersection types | ❌ No | ✅ Yes |
 * | Declaration merging | ✅ Yes | ❌ No |
 * | Best for | Object shapes | Unions, utilities |
 *
 * ### When to Use Interface
 *
 * ```typescript
 * // ✅ Good: Data models
 * interface User {
 *   id: string
 *   email: string
 * }
 *
 * // ✅ Good: Can extend
 * interface Admin extends User {
 *   role: 'admin'
 * }
 * ```
 *
 * ### When to Use Type
 *
 * ```typescript
 * // ✅ Good: Union types
 * type Theme = 'light' | 'dark'
 * type Status = 'pending' | 'active' | 'completed'
 *
 * // ✅ Good: Complex utilities
 * type Nullable<T> = T | null
 * type ReadOnly<T> = { readonly [K in keyof T]: T[K] }
 * ```
 *
 * ### This Project's Convention
 *
 * - **Interfaces** for data models (User, Todo, Message)
 * - **Types** for utility types and unions
 * - Consistent pattern throughout codebase
 */
// CLOSE: type-vs-interface



// React types
declare module 'react' {
  export interface ReactNode {}
  export function useState<T>(initialValue: T): [T, (value: T) => void]
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void
  export function useContext<T>(context: any): T
  export function useRef<T>(initialValue: T): { current: T }
}

// Next.js types
declare module 'next/link' {
  export default function Link(props: { href: string; children: any; className?: string }): any
}

declare module 'next/navigation' {
  export function useRouter(): { push: (path: string) => void }
  export function useParams(): any
  export function redirect(path: string): never
}



// Firebase types
declare module 'firebase/app' {
  export function initializeApp(config: any): any
  export function getApps(): any[]
}

declare module 'firebase/auth' {
  export interface User {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
  }
  export function getAuth(app: any): any
  export function signInWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>
  export function createUserWithEmailAndPassword(auth: any, email: string, password: string): Promise<any>
  export function signOut(auth: any): Promise<void>
}

declare module 'firebase/firestore' {
  export class Timestamp {
    static now(): Timestamp
    toDate(): Date
  }
  export function getFirestore(app: any): any
  export function collection(db: any, path: string): any
  export function doc(collection: any, id: string): any
  export function getDoc(ref: any): Promise<any>
  export function getDocs(query: any): Promise<any>
  export function addDoc(collection: any, data: any): Promise<any>
  export function updateDoc(ref: any, data: any): Promise<void>
  export function deleteDoc(ref: any): Promise<void>
  export function query(collection: any, ...constraints: any[]): any
  export function where(field: string, operator: string, value: any): any
  export function orderBy(field: string, direction?: string): any
  export function limit(count: number): any
  export function onSnapshot(query: any, callback: (snapshot: any) => void): () => void
}
