/**
 * REF: messages-page
 *
 * # Messages Page
 *
 * Real-time messaging system between users.
 *
 * ## Key Concepts
 *
 * - **Real-time chat** - Messages update instantly without refresh
 * - **User selection** - Choose who to chat with
 * - **Message sending** - Create and send messages
 * - **Read receipts** - Track when messages are read
 * - **Auto-scrolling** - Keep newest messages visible
 * - **Two-column layout** - Users on left, conversation on right
 *
 * ## Architecture
 *
 * | `Component` | Purpose |
 * |-----------|---------|
 * | User list | Shows all users for messaging |
 * | Conversation area | Display messages and input |
 * | Message bubbles | Individual message display |
 * | Input form | Text input and send button |
 * | Auto-scroll ref | Tracks message container |
 *
 * ## Data Flow
 *
 * 1. **Load users** - Fetch all registered users on mount
 * 2. **Select user** - User clicks on someone to chat with
 * 3. **Subscribe to messages** - Real-time listener for conversation
 * 4. **Send message** - Form submission creates new message
 * 5. **Mark as read** - Automatically mark received messages as read
 * 6. **Auto-scroll** - Show newest messages at bottom
 *
 * ## Security
 *
 * - **Firestore rules** - Users can only read their own messages
 * - **Sender validation** - Server validates user identity
 * - **No impersonation** - Can't send as other users
 * - **Private conversations** - Only participants can read messages
 */
// CLOSE: messages-page

'use client'

  /** REF: imports
   */
import { useState, useEffect, useRef } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from '@/contexts/AuthContext'
import {
  // CLOSE: imports
  subscribeToConversation,
  sendMessage,
  markMessageAsRead,
} from '@/lib/firebase/firestore'
import { db } from '@/lib/firebase/client'
import { Message } from '@/types'

/**
 * USER INTERFACE
 *
 * Simple user type for displaying in user list
 */
interface User {
  id: string
  email: string
  displayName?: string
}

export default function MessagesPage() {
  const { user } = useAuth()

  /**
   * STATE MANAGEMENT
   *
   * users: List of all users we can message
   * selectedUserId: Currently selected conversation partner
   * messages: All messages in current conversation
   * newMessage: Text input for composing message
   * loading: Initial load state
   * sending: Prevents double-sending messages
   */
  /** REF: messages-state-variables
   * State management for messaging functionality.
   * Tracks users, selected conversation, messages, and UI states.
   */
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  // CLOSE: messages-state-variables

  /**
   * AUTO-SCROLL REF
   *
   * Used to scroll to bottom of messages when new message arrives
   * useRef persists across renders without causing re-renders
   */
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * LOAD ALL USERS EFFECT
   *
   * Fetch all registered users for the user list
   * In production, you might want to limit this or add search
   *
   * FIRESTORE QUERY:
   * - collection('users'): Get users collection
   * - getDocs(): Fetch all documents
   * - Filter out current user from list
   */
  useEffect(() => {
    if (!user) return

    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'))
        const snapshot = await getDocs(usersQuery)

        const usersList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          } as User))
          .filter(u => u.id !== user.uid) // Don't show current user

        setUsers(usersList)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user])

  /**
   * REAL-TIME CONVERSATION SUBSCRIPTION
   *
   * Subscribe to messages between current user and selected user
   *
 * ### Flow
   * 1. User selects someone to chat with
   * 2. Subscribe to all messages between them
   * 3. Mark received messages as read
   * 4. Auto-scroll to show new messages
   *
   * CLEANUP:
   * - Unsubscribe when switching conversations
   * - Unsubscribe when component unmounts
   */
  /** REF: code-block
   */
  useEffect(() => {
    if (!user || !selectedUserId) {
      setMessages([])
  // CLOSE: code-block
      return
    }

    const unsubscribe = subscribeToConversation(
      user.uid,
      selectedUserId,
      (conversationMessages) => {
        setMessages(conversationMessages)

        // Mark unread messages from other user as read
  /** REF: code-block
   */
        conversationMessages.forEach(msg => {
          if (msg.recipientId === user.uid && !msg.read) {
            markMessageAsRead(msg.id)
  // CLOSE: code-block
          }
        })

        // Scroll to bottom to show newest messages
        scrollToBottom()
      }
    )

    return () => unsubscribe()
  }, [user, selectedUserId])

  /**
   * AUTO-SCROLL TO BOTTOM
   *
   * Scrolls message container to show newest message
   * Called when new message arrives or user switches conversations
   *
   * scrollIntoView() is a browser API that scrolls element into view
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /**
   * SEND MESSAGE HANDLER
   *
   * Validates input, sends message to Firestore, clears input
   *
   * @param e - Form event
   *
   * OPTIMISTIC UI:
   * - Message appears immediately in UI via real-time listener
   * - No need to manually update messages array
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedUserId || !newMessage.trim()) return

    setSending(true)

    try {
      await sendMessage(user.uid, selectedUserId, newMessage.trim())
      setNewMessage('') // Clear input
      scrollToBottom() // Scroll to show sent message
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  /**
   * USER SELECTION HANDLER
   *
   * Called when user clicks on someone in the user list
   */
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId)
  }

  /**
   * LOADING STATE
   */
  /** REF: conditional-block
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl">Loading messages...</div>
      </div>
    )
  }

  /**
   * SELECTED USER INFO
   *
   * Find the user object for the selected conversation
   */
  const selectedUser = users.find(u => u.id === selectedUserId)

  /**
   * REF: messages-page-render
   *
   * # Messages Page Render
   *
   * Two-column layout: user list on left, conversation on right.
   *
   * ## Layout Structure
   *
   * | Column | `Width` | Purpose |
   * |--------|-------|---------|
   * | `Users` | 1/4 screen | List of users to message |
   * | `Conversation` | 3/4 screen | Messages and input form |
   *
   * ## User List (Left Sidebar)
   *
   * - **Header** - "Users" title
   * - **List items** - Scrollable list of users
   * - **Selection** - Highlight selected user
   * - **Info** - Shows name and email
   * - **Empty state** - Message when no users
   *
   * ## Conversation Area (Right Side)
   *
   * - **Header** - Selected user's name/email
   * - **Messages** - Scrollable message history
   * - **Message bubbles** - Different style for sent/received
   * - **Read indicator** - Shows "Read" for sent messages
   * - **Input form** - Text input and send button
   * - **Empty state** - Message when no conversation selected
   *
   * ## Auto-Scroll
   *
   * - messagesEndRef div at bottom of list
   * - scrollIntoView() called when messages arrive
   * - Smooth animation for better UX
   *
   * ## Responsive
   *
   * - grid-cols-1 md:grid-cols-4: Adapts to screen size
   * - Mobile: Can show either list or conversation
   * - Tablet+: Shows both side-by-side
   */
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
        {/* USER LIST (Left Sidebar) */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold">Users</h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => handleSelectUser(u.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                  selectedUserId === u.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
              >
                <div className="font-medium">{u.displayName || 'User'}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </button>
            ))}

            {users.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No other users found
              </div>
            )}
          </div>
        </div>

        {/* CONVERSATION AREA (Right Side) */}
        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
          {selectedUser ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-semibold">
                  {selectedUser.displayName || selectedUser.email}
                </h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === user?.uid ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          msg.senderId === user?.uid
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
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

                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a user to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
  // CLOSE: messages-page-render
}
