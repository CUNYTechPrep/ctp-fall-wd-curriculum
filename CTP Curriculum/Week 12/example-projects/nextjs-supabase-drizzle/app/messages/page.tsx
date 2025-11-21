/**
 * REF: file-header
 *
 * # Messages Page - Real-time Chat with Drizzle Queries
 *
 * Real-time messaging using Supabase Realtime + Drizzle type-safe queries.
 *
 * ## Architecture Pattern
 * This page demonstrates the hybrid approach:
 * - **Drizzle**: Type-safe database operations
 * - **Supabase**: Real-time broadcasts
 * - **Combine**: Best of both worlds
 *
 * ## Key Benefits
 * | Feature | `Tool` | Benefit |
 * |---------|------|---------|
 * | `Queries` | `Drizzle` | Perfect type inference |
 * | Real-time | `Supabase` | Instant updates |
 * | Type safety | `Drizzle` | Compile-time validation |
 * | `Subscriptions` | `Supabase` | WebSocket connections |
 */
// CLOSE: file-header

'use client'

/**
 * REF: imports
 *
 * ## Import Dependencies
 *
 * ### React Hooks
 * - `useState`: Form state and messages array
 * - `useEffect`: Loading data and subscriptions
 * - `useRef`: Scroll management
 *
 * ### Custom Hooks
 * - `useAuth`: Get current user from context
 *
 * ### Database Layer
 * - `createClient`: Supabase client for real-time
 * - `getConversation`: Drizzle query for messages
 * - `sendMessage`: Drizzle mutation for creating messages
 * - `markMessageAsRead`: Drizzle mutation for read status
 */
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { getConversation, sendMessage, markMessageAsRead } from '@/lib/db/queries'
// CLOSE: imports

/**
 * REF: component-function
 *
 * ## MessagesPage Component
 *
 * Main page component for real-time messaging interface.
 */
export default function MessagesPage() {
  const { user } = useAuth()
  const supabase = createClient()
  // CLOSE: component-function

  /**
   * REF: state-management
   *
   * ## State Variables
   *
   * | `State` | Type | Purpose |
   * |-------|------|---------|
   * | `users` | `any[]` | List of available users to message |
   * | `selectedUserId` | `string \| null` | Currently selected conversation |
   * | `messages` | `any[]` | Messages in current conversation |
   * | `newMessage` | `string` | Input field value |
   * | `loading` | `boolean` | Initial loading state |
   * | `sending` | `boolean` | Message send in progress |
   * | `messagesEndRef` | `RefObject` | Ref for auto-scrolling |
   */
  const [users, setUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  // CLOSE: state-management

  /**
   * REF: fetch-users-effect
   *
   * ## Fetch Users Effect
   *
   * Loads list of users available for messaging.
   *
   * ### Using Drizzle Alternative
   * Could use type-safe Drizzle query:
   * ```typescript
   * import { userProfiles } from '@/lib/db/schema'
   * import { ne } from 'drizzle-orm'
   *
   * const users = await db
   *   .select()
   *   .from(userProfiles)
   *   .where(ne(userProfiles.userId, currentUserId))
   * ```
   *
   * ### Current Implementation
   * Uses Supabase client for simplicity in this example.
   */
  useEffect(() => {
    if (!user) return

    const fetchUsers = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('id, user_id, display_name')
        .neq('user_id', user.id)

      setUsers(data || [])
      setLoading(false)
    }

    fetchUsers()
  }, [user, supabase])
  // CLOSE: fetch-users-effect

  /**
   * REF: conversation-effect
   *
   * ## Load Conversation Effect
   *
   * Loads messages and sets up real-time subscription when user selects conversation.
   *
   * ### Hybrid Pattern Flow
   * 1. **Initial Load**: Use Drizzle's `getConversation()` for type-safe fetch
   * 2. **Mark as Read**: Use Drizzle's `markMessageAsRead()` mutation
   * 3. **Subscribe**: Use Supabase for real-time PostgreSQL changes
   * 4. **Refetch**: On new messages, refetch with Drizzle
   */
  useEffect(() => {
    if (!user || !selectedUserId) {
      setMessages([])
      return
    }

    /**
     * REF: load-messages
     *
     * ## Load Messages Function
     *
     * Uses Drizzle query helper for type-safe message fetching.
     *
     * ### Benefits
     * - Perfect type inference
     * - SQL-like syntax
     * - Compile-time validation
     */
    const loadMessages = async () => {
      try {
        const conversation = await getConversation(user.id, selectedUserId)
        setMessages(conversation)

        // Mark unread messages as read
        conversation.forEach(msg => {
          if (msg.recipientId === user.id && !msg.read) {
            markMessageAsRead(msg.id)
          }
        })

        scrollToBottom()
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }
    // CLOSE: load-messages

    loadMessages()

    /**
     * REF: realtime-subscription
     *
     * ## Real-time Subscription Setup
     *
     * Listen for new messages and refetch with Drizzle.
     *
     * ### Hybrid Pattern Benefits
     * - Supabase broadcasts changes instantly
     * - Drizzle fetches with type safety
     * - Best of both worlds
     *
     * ### How It Works
     * 1. Supabase detects INSERT on messages table
     * 2. Triggers callback via WebSocket
     * 3. Callback re-fetches with type-safe Drizzle query
     * 4. UI updates with new message
     */
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => {
        loadMessages() // Refetch with Drizzle
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // CLOSE: realtime-subscription
  }, [user, selectedUserId, supabase])
  // CLOSE: conversation-effect

  /**
   * REF: send-message-handler
   *
   * ## Send Message Handler
   *
   * Handles form submission for sending new messages.
   *
   * ### Type-Safe Creation
   * Uses Drizzle's `sendMessage()` helper with full type validation:
   * - `userId` validated as string
   * - `recipientId` validated as string
   * - `content` validated as string
   *
   * ### Process
   * 1. Validate input
   * 2. Set loading state
   * 3. Call type-safe mutation
   * 4. Clear form on success
   * 5. Handle errors
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedUserId || !newMessage.trim()) return

    setSending(true)

    try {
      await sendMessage(user.id, selectedUserId, newMessage.trim())
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Error sending:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }
  // CLOSE: send-message-handler

  /**
   * REF: scroll-helper
   *
   * ## Scroll to Bottom Helper
   *
   * Smoothly scrolls to latest message.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  // CLOSE: scroll-helper

  /**
   * REF: loading-state
   *
   * ## Loading State UI
   *
   * Shows loading indicator while fetching initial data.
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }
  // CLOSE: loading-state

  const selectedUser = users.find(u => u.user_id === selectedUserId)

  /**
   * REF: main-layout
   *
   * ## Main Messages Layout
   *
   * Two-column layout with user list and conversation view.
   */
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-4 gap-6 h-[600px]">
        {/**
         * REF: user-list
         *
         * ## User List Sidebar
         *
         * Shows all available users to start conversations with.
         */}
        <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Users</h2>
          </div>

          {users.map(u => (
            <button
              key={u.id}
              onClick={() => setSelectedUserId(u.user_id)}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedUserId === u.user_id ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
            >
              <div className="font-medium">{u.display_name || 'User'}</div>
            </button>
          ))}
        </div>
        {/* CLOSE: user-list */}

        {/**
         * REF: conversation-view
         *
         * ## Conversation View
         *
         * Shows messages and input for selected conversation.
         */}
        <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
          {selectedUser ? (
            <>
              {/**
               * REF: conversation-header
               *
               * ## Conversation Header
               *
               * Shows selected user's name.
               */}
              <div className="p-4 border-b">
                <h2 className="font-semibold">{selectedUser.display_name || 'User'}</h2>
              </div>
              {/* CLOSE: conversation-header */}

              {/**
               * REF: messages-list
               *
               * ## Messages List
               *
               * Scrollable list of messages in conversation.
               *
               * ### Message Display
               * - Sent messages: Right-aligned, blue background
               * - Received messages: Left-aligned, gray background
               * - Timestamps shown below each message
               * - Read receipts for sent messages
               */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        msg.senderId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                        {msg.senderId === user?.id && msg.read && ' • Read'}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {/* CLOSE: messages-list */}

              {/**
               * REF: message-form
               *
               * ## Message Input Form
               *
               * Form for typing and sending new messages.
               */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Send
                  </button>
                </div>
              </form>
              {/* CLOSE: message-form */}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a user to start messaging
            </div>
          )}
        </div>
        {/* CLOSE: conversation-view */}
      </div>
    </div>
  )
  // CLOSE: main-layout
}

/**
 * REF: drizzle-query-examples
 *
 * ## Drizzle Message Query Examples
 *
 * From `lib/db/queries.ts`, showing type-safe message operations.
 *
 * ### Get Conversation Query
 * ```typescript
 * export async function getConversation(userId: string, otherUserId: string) {
 *   return await db
 *     .select()
 *     .from(messages)
 *     .where(
 *       sql`(${messages.senderId} = ${userId} AND ${messages.recipientId} = ${otherUserId})
 *        OR (${messages.senderId} = ${otherUserId} AND ${messages.recipientId} = ${userId})`
 *     )
 *     .orderBy(messages.createdAt)
 * }
 * ```
 *
 * ### Send Message Mutation
 * ```typescript
 * export async function sendMessage(
 *   senderId: string,
 *   recipientId: string,
 *   content: string
 * ) {
 *   const [message] = await db
 *     .insert(messages)
 *     .values({ senderId, recipientId, content })
 *     .returning()
 *
 *   return message
 * }
 * ```
 *
 * ### Benefits
 * - Fully typed parameters
 * - SQL power with type safety
 * - Compile-time error checking
 * - Perfect IDE autocomplete
 */
// CLOSE: drizzle-query-examples
