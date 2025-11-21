/**
 * REF: Messages Page - Real-Time Chat / Messaging
 *
 * Implements peer-to-peer real-time messaging in a client-side SPA.
 *
 * ## UI Layout
 *
 * ```
 * ┌──────────────────────┬──────────────────────┐
 * │    Users Sidebar     │   Conversation       │
 * │  - List all users    │  - Messages display  │
 * │  - Highlight current │  - Auto-scroll to    │
 * │  - Click to select   │    latest message    │
 * │                      │  - Message form at   │
 * │                      │    bottom            │
 * └──────────────────────┴──────────────────────┘
 * ```
 *
 * ## Key Features
 * - **Two-way Conversations**: Between any two users
 * - **Auto-Scroll**: Scrolls to latest message
 * - **Read Receipts**: Shows "Read" indicator
 * - **Timestamps**: When each message was sent
 * - **Real-time**: Updates as messages arrive
 *
 * ## Message Document Structure
 *
 * ```typescript
 * {
 *   senderId: string      // User who sent
 *   recipientId: string   // User who receives
 *   content: string       // Message text
 *   read: boolean         // Has recipient seen it
 *   readAt?: Timestamp    // When they read it
 *   createdAt: Timestamp  // Server timestamp
 * }
 * ```
 *
 * ## Compound Query Challenge
 *
 * Getting messages between two users requires:
 * ```
 * (senderId = me AND recipientId = them) OR
 * (senderId = them AND recipientId = me)
 * ```
 *
 * **Problem**: Firestore doesn't support OR across different fields efficiently.
 *
 * **Solution** (in this app):
 * - Query all messages ordered by timestamp
 * - Filter in memory to current conversation
 * - Not ideal for millions of messages
 * - Works great for learning/small scale
 *
 * CLOSE
 */

import { useState, useEffect, useRef } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
  or,
  and,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'

interface Message {
  id: string
  senderId: string
  recipientId: string
  content: string
  read: boolean
  readAt?: Timestamp
  createdAt: Timestamp
}

interface User {
  id: string
  email: string
  displayName?: string
}

export default function Messages() {
  const { user } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // REF: FETCH USERS
/**
   * FETCH USERS
   *
   * Get all users to show in sidebar
   */
// CLOSE
  useEffect(() => {
    if (!user) return

    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const usersList = usersSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as User))
        .filter(u => u.id !== user.uid)

      setUsers(usersList)
      setLoading(false)
    }

    fetchUsers()
  }, [user])

  // REF: REAL-TIME CONVERSATION SUBSCRIPTION
/**
   * REAL-TIME CONVERSATION SUBSCRIPTION
   *
   * Subscribe to messages between current user and selected user
   *
   * ## Firestore Compound Query
   * Get messages where:
   * (senderId = me AND recipientId = them) OR
   * (senderId = them AND recipientId = me)
   *
   * ## Limitation
   * Firestore doesn't support OR across different fields easily
   * Must filter client-side or use separate queries
   *
   * ## Workaround
   * Query all messages involving either user, filter in memory
   */
// CLOSE
  useEffect(() => {
    if (!user || !selectedUserId) {
      setMessages([])
      return
    }

    // REF: QUERY MESSAGES
/**
     * QUERY MESSAGES
     *
     * Get all messages where user is sender or recipient
     * Filter to conversation in callback
     */
// CLOSE
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Message))

      // Filter to conversation between these two users
      const conversationMessages = allMessages.filter(
        msg =>
          (msg.senderId === user.uid && msg.recipientId === selectedUserId) ||
          (msg.senderId === selectedUserId && msg.recipientId === user.uid)
      )

      setMessages(conversationMessages)

      // Mark unread messages as read
      conversationMessages.forEach(msg => {
        if (msg.recipientId === user.uid && !msg.read) {
          updateDoc(doc(db, 'messages', msg.id), {
            read: true,
            readAt: Timestamp.now(),
          })
        }
      })

      scrollToBottom()
    })

    return () => unsubscribe()
  }, [user, selectedUserId])

  // REF: SEND MESSAGE
/**
   * SEND MESSAGE
   */
// CLOSE
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedUserId || !newMessage.trim()) return

    setSending(true)

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        recipientId: selectedUserId,
        content: newMessage.trim(),
        read: false,
        createdAt: Timestamp.now(),
      })

      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  // CLOSE: scrollToBottom

  /** REF: conditional-block
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  const selectedUser = users.find(u => u.id === selectedUserId)

  /** REF: component-return
   */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>
  // CLOSE: component-return

              <div className="grid grid-cols-4 gap-6 h-[600px]">
          {/* User List */}
          <div className="col-span-1 bg-white rounded-lg shadow overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Users</h2>
            </div>

            {/** REF: users-list
             * Maps through users and displays clickable list items.
             * Highlights selected user with blue background.
             */}
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                  selectedUserId === u.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium">{u.displayName || 'User'}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </button>
            ))}
            {/* CLOSE: users-list */}
          </div>

                {/* Conversation */}
          <div className="col-span-3 bg-white rounded-lg shadow flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-semibold">{selectedUser.displayName || selectedUser.email}</h2>
                </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
  /** REF: code-block
   */
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
  // CLOSE: code-block
                      >
                              <div
                          className={`max-w-[70%] px-4 py-2 rounded-lg ${
                            msg.senderId === user?.uid
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200'
                          }`}
                        >
                                <p>{msg.content}</p>
                          <div className="text-xs mt-1 opacity-70">
                            {msg.createdAt?.toDate().toLocaleTimeString()}
                            {msg.senderId === user?.uid && msg.read && ' • Read'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/** REF: message-input-form
                 * Message input form with text field and send button.
                 * Handles message submission and displays sending state.
                 */}
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
                {/* CLOSE: message-input-form */}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a user to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
// CLOSE: Messages

// REF: FIRESTORE SECURITY RULES FOR MESSAGES
/**
 * FIRESTORE SECURITY RULES FOR MESSAGES
 *
 * ```javascript
 * match /messages/{messageId} {
 *   allow read: if request.auth.uid == resource.data.senderId ||
 *                  request.auth.uid == resource.data.recipientId;
 *   allow create: if request.auth.uid == request.resource.data.senderId;
 *   allow update: if request.auth.uid == resource.data.recipientId;
 * }
 * ```
 */
// CLOSE

// REF: COMPOSITE INDEX REQUIRED
/**
 * COMPOSITE INDEX REQUIRED
 *
 * Firestore will prompt you to create index for:
 * Collection: messages
 * Fields: senderId (Ascending), createdAt (Ascending)
 *
 * Click the link in console error to auto-create!
 */
// CLOSE

// REF: For better performance with many users:
/**
 * ## Optimization: QUERY ONLY RELEVANT MESSAGES
 *
 * For better performance with many users:
 *
 * ```typescript
 * // Query 1: Messages I sent to them
 * const sentQuery = query(
 *   collection(db, 'messages'),
 *   where('senderId', '==', user.uid),
 *   where('recipientId', '==', selectedUserId),
 *   orderBy('createdAt', 'asc')
 * )
 *
 * // Query 2: Messages they sent to me
 * const receivedQuery = query(
 *   collection(db, 'messages'),
 *   where('senderId', '==', selectedUserId),
 *   where('recipientId', '==', user.uid),
 *   orderBy('createdAt', 'asc')
 * )
 *
 * // Merge results
 * const [sent, received] = await Promise.all([
 *   getDocs(sentQuery),
 *   getDocs(receivedQuery)
 * ])
 *
 * const allMessages = [...sent.docs, ...received.docs]
 *   .map(doc => ({ id: doc.id, ...doc.data() }))
 *   .sort((a, b) => a.createdAt - b.createdAt)
 * ```
 */
// CLOSE
