/**
 * REF: firestore-file-header
 *
 * # Firestore Database Operations
 *
 * Centralized database operations for Firebase Firestore.
 *
 * ## Key Concepts
 *
 * - **Firestore:** NoSQL document database
 * - **Collections:** Groups of documents (like tables)
 * - **Documents:** Individual records (like rows)
 * - **Real-time:** Listen to changes with `onSnapshot`
 *
 * ## Why Helper Functions?
 *
 * - **Reusability:** Don't repeat query logic
 * - **Type safety:** TypeScript types enforced
 * - **Error handling:** Centralized error management
 * - **Consistency:** Same patterns throughout app
 *
 * ## File Organization
 *
 * This file contains 15+ helper functions grouped by:
 * 1. User operations
 * 2. Todo CRUD operations
 * 3. Public feed operations
 * 4. Settings operations
 * 5. Message operations
 * 6. Real-time subscriptions
 *
 * **Audio Guide:** `audio/nextjs-firebase/firestore-operations.mp3`
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from './client'
import type { Todo, UserSettings, Message, TodoAttachment } from '@/types'

/**
 * REF: firestore-collections
 *
 * ## Collection References
 *
 * Create typed collection references for each Firestore collection.
 *
 * ### Why Export These?
 *
 * - Reuse across functions
 * - Consistent collection names
 * - Type safety
 * - Easy to change collection name (one place)
 *
 * ### Firestore Structure
 *
 * ```
 * firestore/
 * ├── users/              # User profiles
 * ├── todos/              # Todo items
 * ├── userSettings/       # User preferences
 * ├── todoAttachments/    # File metadata
 * └── messages/           # Chat messages
 * ```
 */
export const usersCollection = collection(db, 'users')
export const todosCollection = collection(db, 'todos')
export const userSettingsCollection = collection(db, 'userSettings')
export const todoAttachmentsCollection = collection(db, 'todoAttachments')
export const messagesCollection = collection(db, 'messages')
// CLOSE: firestore-collections

/**
 * REF: timestamp-helper
 *
 * ## Timestamp Conversion Helper
 *
 * Converts Firestore `Timestamp` to JavaScript `Date`.
 *
 * ### Usage
 *
 * ```typescript
 * const todo = await getTodo(id)
 * const date = timestampToDate(todo.createdAt)
 * console.log(date.toLocaleDateString())
 * ```
 *
 * **Simple utility** for common operation.
 */
export const timestampToDate = (timestamp: Timestamp) => timestamp.toDate()
// CLOSE: timestamp-helper

/**
 * REF: get-user-by-id
 *
 * ## Get User by ID
 *
 * Fetches a single user document by ID.
 *
 * ### Parameters
 *
 * - `userId`: User's unique identifier
 *
 * ### Returns
 *
 * - User object with ID if exists
 * - `null` if not found
 *
 * ### Firestore Pattern
 *
 * ```typescript
 * getDoc(doc(collection, id))
 * ```
 *
 * Standard pattern for fetching single document.
 */
export async function getUserById(userId: string) {
  const userDoc = await getDoc(doc(usersCollection, userId))
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null
}
// CLOSE: get-user-by-id

/**
 * REF: create-update-user
 *
 * ## Create or Update User
 *
 * Updates user document (creates if doesn't exist).
 *
 * ### Parameters
 *
 * - `userId`: User ID (document ID)
 * - `data`: Partial user data to update
 *
 * ### Behavior
 *
 * - If document exists → updates fields
 * - If doesn't exist → creates with provided data
 * - Always sets `updatedAt` to current time
 *
 * ### Use Case
 *
 * Called after user signs in to sync profile data.
 */
export async function createOrUpdateUser(userId: string, data: Partial<DocumentData>) {
  const userRef = doc(usersCollection, userId)
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}
// CLOSE: create-update-user

/**
 * REF: create-todo
 *
 * ## Create Todo
 *
 * Creates a new todo document in Firestore.
 *
 * ### Parameters
 *
 * - `userId`: Owner of the todo
 * - `todoData`: Partial todo data (title, description, etc.)
 *
 * ### Returns
 *
 * Complete todo object with generated `id`.
 *
 * ### Default Values
 *
 * Automatically sets:
 * - `completed: false`
 * - `isPublic: false` (unless specified)
 * - `tags: []` (unless specified)
 * - `createdAt: now()`
 * - `updatedAt: now()`
 *
 * ### Firestore AddDoc
 *
 * `addDoc()` auto-generates unique ID:
 * - Returns `DocumentReference`
 * - Contains generated ID
 * - Add to returned object
 */
export async function createTodo(userId: string, todoData: Partial<Todo>) {
  const todo = {
    userId,
    title: todoData.title,
    description: todoData.description || '',
    completed: false,
    isPublic: todoData.isPublic || false,
    tags: todoData.tags || [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  const docRef = await addDoc(todosCollection, todo)
  return { id: docRef.id, ...todo }
}
// CLOSE: create-todo

/**
 * REF: get-user-todos
 *
 * ## Get User's Todos
 *
 * Fetches all todos for a specific user.
 *
 * ### Firestore Query
 *
 * ```typescript
 * query(
 *   collection,
 *   where('userId', '==', userId),
 *   orderBy('createdAt', 'desc')
 * )
 * ```
 *
 * **Filters** by userId, **orders** by newest first.
 *
 * ### Returns
 *
 * Array of todos with IDs included.
 *
 * ### Composite Index Required
 *
 * Firebase will prompt to create index for:
 * - Collection: `todos`
 * - Fields: `userId` (Ascending), `createdAt` (Descending)
 */
export async function getUserTodos(userId: string) {
  const q = query(
    todosCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo))
}
// CLOSE: get-user-todos

/**
 * REF: update-todo
 *
 * ## Update Todo
 *
 * Updates specific fields of a todo.
 *
 * ### Parameters
 *
 * - `todoId`: Todo to update
 * - `data`: Partial todo data (only changed fields)
 *
 * ### Partial Updates
 *
 * Only sends fields that changed:
 * - More efficient
 * - Prevents overwriting other fields
 * - Automatic `updatedAt` timestamp
 */
export async function updateTodo(todoId: string, data: Partial<Todo>) {
  const todoRef = doc(todosCollection, todoId)
  await updateDoc(todoRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}
// CLOSE: update-todo

/**
 * REF: delete-todo
 *
 * ## Delete Todo
 *
 * Permanently removes a todo from Firestore.
 *
 * ### Cascade Delete
 *
 * **Also delete:**
 * - Todo attachments (from Storage and Firestore)
 * - Any related data
 *
 * This function only deletes the todo document.
 * Caller responsible for cleanup.
 */
export async function deleteTodo(todoId: string) {
  await deleteDoc(doc(todosCollection, todoId))
}
// CLOSE: delete-todo

/**
 * REF: get-public-todos
 *
 * ## Get Public Todos (Paginated)
 *
 * Fetches public todos with pagination support.
 *
 * ### Parameters
 *
 * - `limitCount`: Number of todos per page (default: 20)
 * - `lastDoc`: Last document from previous page (for pagination)
 *
 * ### Returns
 *
 * Object with:
 * - `todos`: Array of public todos
 * - `lastDoc`: Last document (for next page)
 * - `hasMore`: Whether more todos exist
 *
 * ### Pagination Pattern
 *
 * ```typescript
 * // Page 1
 * const { todos, lastDoc, hasMore } = await getPublicTodos(20)
 *
 * // Page 2
 * const page2 = await getPublicTodos(20, lastDoc)
 * ```
 */
export async function getPublicTodos(limitCount = 20, lastDoc?: QueryDocumentSnapshot) {
  let q = query(
    todosCollection,
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )

  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }

  const snapshot = await getDocs(q)
  return {
    todos: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo)),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === limitCount,
  }
}
// CLOSE: get-public-todos

/**
 * REF: search-public-todos
 *
 * ## Search Public Todos
 *
 * Searches public todos by title and description.
 *
 * ### Limitation
 *
 * **Firestore doesn't support full-text search natively.**
 *
 * This implementation:
 * 1. Fetches all public todos
 * 2. Filters client-side
 *
 * ### For Production
 *
 * Consider using:
 * - **Algolia** for full-text search
 * - **Typesense** for open-source alternative
 * - **ElasticSearch** for advanced features
 *
 * ### Client-Side Filtering
 *
 * Not scalable for large datasets!
 * - Fetches all public todos
 * - Filters in JavaScript
 * - Works for < 1000 items
 */
export async function searchPublicTodos(searchTerm: string, limitCount = 20) {
  const q = query(
    todosCollection,
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )

  const snapshot = await getDocs(q)
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo))

  // Client-side filtering
  return todos.filter(
    todo =>
      todo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
// CLOSE: search-public-todos

/**
 * REF: filter-by-tag
 *
 * ## Filter Public Todos by Tag
 *
 * Finds public todos containing a specific tag.
 *
 * ### Firestore Array Query
 *
 * ```typescript
 * where('tags', 'array-contains', tag)
 * ```
 *
 * Searches array fields efficiently.
 *
 * ### Composite Index Required
 *
 * Firebase will prompt for index:
 * - Collection: `todos`
 * - Fields: `isPublic`, `tags`, `createdAt`
 *
 * ### Limitation
 *
 * Can only query **one tag** at a time.
 * For multiple tags, use `array-contains-any`.
 */
export async function filterPublicTodosByTag(tag: string, limitCount = 20) {
  const q = query(
    todosCollection,
    where('isPublic', '==', true),
    where('tags', 'array-contains', tag),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo))
}
// CLOSE: filter-by-tag

/**
 * REF: get-user-settings
 *
 * ## Get User Settings
 *
 * Fetches user's accessibility preferences.
 *
 * ### Returns
 *
 * - `UserSettings` object if exists
 * - `null` if not found
 *
 * ### Document ID = User ID
 *
 * Settings document ID matches user ID:
 * - One settings doc per user
 * - Easy to fetch
 * - No query needed
 */
export async function getUserSettings(userId: string) {
  const settingsDoc = await getDoc(doc(userSettingsCollection, userId))
  return settingsDoc.exists()
    ? ({ id: settingsDoc.id, ...settingsDoc.data() } as UserSettings)
    : null
}
// CLOSE: get-user-settings

/**
 * REF: update-user-settings
 *
 * ## Update User Settings
 *
 * Updates user's accessibility preferences.
 *
 * ### Parameters
 *
 * - `userId`: User's ID
 * - `settings`: Partial settings to update
 *
 * ### Partial Updates
 *
 * Only update changed fields:
 * ```typescript
 * updateUserSettings(userId, { theme: 'dark' })
 * // Only updates theme, keeps other settings
 * ```
 *
 * ### Auto-Updated Field
 *
 * `updatedAt` automatically set to current time.
 */
export async function updateUserSettings(userId: string, settings: Partial<UserSettings>) {
  const settingsRef = doc(userSettingsCollection, userId)
  await updateDoc(settingsRef, {
    ...settings,
    updatedAt: Timestamp.now(),
  })
}
// CLOSE: update-user-settings

/**
 * REF: message-operations
 *
 * # Message Operations
 *
 * Real-time messaging functionality between users.
 *
 * ## Key Concepts
 *
 * - **Direct messages** - One-to-one communication
 * - **Read status** - Track message delivery and read receipts
 * - **Conversation threads** - Messages between two users
 * - **Unread counts** - Badge notifications
 *
 * ## Security Considerations
 *
 * Messages require authentication and proper access control:
 * - Users can only send messages as themselves
 * - Recipients can mark messages as read
 * - Conversation history is private
 */

/**
 * REF: send-message
 *
 * ## Send Direct Message
 *
 * Creates a new message between two users.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `senderId` | `string` | ID of the user sending the message |
 * | `recipientId` | `string` | ID of the user receiving the message |
 * | `content` | `string` | Message text content |
 *
 * ### Returns
 *
 * Message object with generated ID and timestamp.
 *
 * ### Example
 *
 * ```typescript
 * const message = await sendMessage(
 *   currentUser.uid,
 *   otherUser.uid,
 *   "Hello! How are you?"
 * )
 * ```
 */
export async function sendMessage(senderId: string, recipientId: string, content: string) {
  const message = {
    senderId,
    recipientId,
    content,
    read: false,
    createdAt: Timestamp.now(),
  }
  const docRef = await addDoc(messagesCollection, message)
  return { id: docRef.id, ...message }
}
// CLOSE: send-message

/**
 * REF: get-conversation
 *
 * ## Get Conversation History
 *
 * Retrieves all messages between two specific users.
 *
 * ### Implementation Note
 *
 * This queries for messages where senderId is either user,
 * then filters client-side for the specific conversation.
 * For production with many messages, consider:
 * - Composite indexes for efficient querying
 * - Pagination for large conversations
 * - Dedicated conversation collection
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `userId` | `string` | Current user's ID |
 * | `otherUserId` | `string` | Other participant's ID |
 *
 * ### Returns
 *
 * Array of messages sorted by creation time.
 *
 * ### Example
 *
 * ```typescript
 * const messages = await getConversation(
 *   currentUser.uid,
 *   selectedUser.uid
 * )
 * ```
 */
export async function getConversation(userId: string, otherUserId: string) {
  const q = query(
    messagesCollection,
    where('senderId', 'in', [userId, otherUserId]),
    orderBy('createdAt', 'asc')
  )

  const snapshot = await getDocs(q)
  const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message))

  // Filter for conversation between these two users
  return messages.filter(
    msg =>
      (msg.senderId === userId && msg.recipientId === otherUserId) ||
      (msg.senderId === otherUserId && msg.recipientId === userId)
  )
}
// CLOSE: get-conversation

/**
 * REF: mark-message-read
 *
 * ## Mark Message as Read
 *
 * Updates a message's read status and timestamp.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `messageId` | `string` | ID of the message to mark as read |
 *
 * ### Side Effects
 *
 * - Sets `read` field to `true`
 * - Adds `readAt` timestamp
 * - Triggers real-time updates for sender
 *
 * ### Example
 *
 * ```typescript
 * // Mark message as read when user views it
 * await markMessageAsRead(message.id)
 * ```
 */
export async function markMessageAsRead(messageId: string) {
  const messageRef = doc(messagesCollection, messageId)
  await updateDoc(messageRef, {
    read: true,
    readAt: Timestamp.now(),
  })
}
// CLOSE: mark-message-read

/**
 * REF: unread-count
 *
 * ## Get Unread Message Count
 *
 * Counts unread messages for a specific user.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `userId` | `string` | ID of the recipient user |
 *
 * ### Returns
 *
 * Number of unread messages.
 *
 * ### Use Cases
 *
 * - Badge notifications in UI
 * - Push notification triggers
 * - Dashboard statistics
 *
 * ### Example
 *
 * ```typescript
 * const unreadCount = await getUnreadMessageCount(user.uid)
 * setBadgeCount(unreadCount)
 * ```
 */
export async function getUnreadMessageCount(userId: string) {
  const q = query(
    messagesCollection,
    where('recipientId', '==', userId),
    where('read', '==', false)
  )

  const snapshot = await getDocs(q)
  return snapshot.size
}
// CLOSE: unread-count
// CLOSE: message-operations

/**
 * REF: realtime-subscriptions
 *
 * # Real-time Subscriptions
 *
 * Live data listeners that automatically update when data changes.
 *
 * ## Key Concepts
 *
 * - **onSnapshot listeners** - React to database changes
 * - **Automatic updates** - UI refreshes without polling
 * - **Unsubscribe cleanup** - Prevent memory leaks
 * - **Optimistic UI** - Instant feedback before server confirms
 *
 * ## Performance Considerations
 *
 * - Each listener counts against concurrent connection limit
 * - Unsubscribe when component unmounts
 * - Consider debouncing rapid updates
 * - Use query limits to reduce bandwidth
 */

/**
 * REF: subscribe-user-todos
 *
 * ## Subscribe to User's Todos
 *
 * Sets up real-time listener for a user's todo list.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `userId` | `string` | User ID to watch |
 * | `callback` | `Function` | Called with updated todos |
 *
 * ### Returns
 *
 * Unsubscribe function to cleanup listener.
 *
 * ### Example
 *
 * ```typescript
 * useEffect(() => {
 *   const unsubscribe = subscribeToUserTodos(user.uid, (todos) => {
 *     setTodos(todos)
 *   })
 *   return () => unsubscribe() // Cleanup
 * }, [user?.uid])
 * ```
 *
 * ### Real-time Flow
 *
 * 1. User creates/updates/deletes todo
 * 2. Firestore broadcasts change
 * 3. All active listeners receive update
 * 4. Callback fires with new data
 * 5. UI re-renders automatically
 */
export function subscribeToUserTodos(userId: string, callback: (todos: Todo[]) => void) {
  const q = query(
    todosCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, snapshot => {
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo))
    callback(todos)
  })
}
// CLOSE: subscribe-user-todos

/**
 * REF: subscribe-conversation
 *
 * ## Subscribe to Conversation
 *
 * Real-time listener for messages between two users.
 *
 * ### Implementation Note
 *
 * Currently fetches ALL messages then filters client-side.
 * This is inefficient for large message volumes.
 *
 * **Production improvements:**
 * - Use composite index for bidirectional query
 * - Implement pagination for message history
 * - Consider conversation rooms/channels pattern
 * - Cache messages locally with IndexedDB
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `userId` | `string` | Current user ID |
 * | `otherUserId` | `string` | Other participant ID |
 * | `callback` | `Function` | Called with message updates |
 *
 * ### Returns
 *
 * Unsubscribe function for cleanup.
 *
 * ### Example
 *
 * ```typescript
 * useEffect(() => {
 *   if (!selectedUser) return
 *
 *   const unsubscribe = subscribeToConversation(
 *     user.uid,
 *     selectedUser.id,
 *     (messages) => {
 *       setMessages(messages)
 *       scrollToBottom()
 *     }
 *   )
 *   return () => unsubscribe()
 * }, [selectedUser])
 * ```
 */
export function subscribeToConversation(
  userId: string,
  otherUserId: string,
  callback: (messages: Message[]) => void
) {
  const q = query(messagesCollection, orderBy('createdAt', 'asc'))

  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Message))
      .filter(
        msg =>
          (msg.senderId === userId && msg.recipientId === otherUserId) ||
          (msg.senderId === otherUserId && msg.recipientId === userId)
      )
    callback(messages)
  })
}
// CLOSE: subscribe-conversation

/**
 * REF: subscribe-public-feed
 *
 * ## Subscribe to Public Feed
 *
 * Real-time listener for community todos marked as public.
 *
 * ### Features
 *
 * - Live updates when todos become public
 * - Automatic removal when todos become private
 * - Sorted by newest first
 * - Limited to prevent overwhelming UI
 *
 * ### Parameters
 *
 * | Parameter | Type | Default | Description |
 * |-----------|------|---------|-------------|
 * | `callback` | `Function` | `-` | Called with todo updates |
 * | `limitCount` | `number` | `20` | Maximum todos to fetch |
 *
 * ### Returns
 *
 * Unsubscribe function for cleanup.
 *
 * ### Example
 *
 * ```typescript
 * useEffect(() => {
 *   const unsubscribe = subscribeToPublicFeed((publicTodos) => {
 *     setTodos(publicTodos)
 *     setLoading(false)
 *   }, 20)
 *
 *   return () => unsubscribe()
 * }, [])
 * ```
 *
 * ### Performance Notes
 *
 * - Limit prevents large data transfers
 * - Index on `isPublic` field for efficiency
 * - Consider pagination for browsing all public todos
 */
export function subscribeToPublicFeed(callback: (todos: Todo[]) => void, limitCount = 20) {
  const q = query(
    todosCollection,
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )

  return onSnapshot(q, snapshot => {
    const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo))
    callback(todos)
  })
}
// CLOSE: subscribe-public-feed
// CLOSE: realtime-subscriptions
// CLOSE: firestore-file-header
