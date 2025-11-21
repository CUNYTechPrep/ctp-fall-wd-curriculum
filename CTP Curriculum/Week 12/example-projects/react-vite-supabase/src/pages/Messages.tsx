/**
 * REF: Real-time Messaging Page
 *
 * Two-column messaging interface for direct communication between users.
 * Left column lists users, right column shows conversation with real-time updates.
 *
 * CLOSE: Protected page showing user list and direct messaging conversation.
 * Uses Supabase real-time to instantly show new messages.
 *
 * PAGE LAYOUT:
 * ```
 * ┌──────────────────────────┐
 * │    MESSAGES HEADER       │
 * ├─────────────┬────────────┤
 * │   USERS     │     CHAT   │
 * │  (1/4 col)  │   (3/4 col)│
 * │             │            │
 * │ - User 1    │ Conversation│
 * │ - User 2    │ + Input     │
 * │ - User 3    │            │
 * └─────────────┴────────────┘
 * ```
 *
 * ## Features
 * | Feature | Purpose |
 * |---------|---------|
 * | User List | Select conversation partner |
 * | `Conversation` | Message history with timestamps |
 * | `Input` | Type and send messages |
 * | Read Status | Shows "Read" indicator |
 * | Auto Scroll | Scrolls to latest message |
 *
 * MESSAGE STRUCTURE:
 * | `Field` | Type | Purpose |
 * |-------|------|---------|
 * | `id` | `UUID` | Message identifier |
 * | `sender_id` | `UUID` | Who sent the message |
 * | `recipient_id` | `UUID` | Who receives the message |
 * | `content` | `text` | Message text |
 * | `read` | `boolean` | Whether recipient read it |
 * | `read_at` | `timestamp` | When recipient read it |
 * | `created_at` | `timestamp` | Message timestamp |
 *
 * ## Data Flow
 * 1. Component mounts
 * 2. Fetch user_profiles (list of users)
 * 3. Display all users except current user
 * 4. User clicks a user to select
 * 5. Fetch messages between current user and selected user
 * 6. Subscribe to new messages
 * 7. Mark received messages as read
 * 8. User types and sends message
 * 9. INSERT into messages table
 * 10. Real-time subscription fires
 * 11. New message appears instantly in UI
 * 12. Auto-scroll to newest message
 *
 * QUERY PATTERNS:
 * ```typescript
 * // Fetch users (everyone except current)
 * .from('user_profiles')
 *   .select('id, user_id, display_name')
 *   .neq('user_id', user.id)
 *
 * // Fetch conversation (both directions)
 * .from('messages')
 *   .select('*')
 *   .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedUserId}),
 *         and(sender_id.eq.${selectedUserId},recipient_id.eq.${user.id})`)
 *   .order('created_at', { ascending: true })
 *
 * // Mark as read
 * .from('messages')
 *   .update({ read: true, read_at: new Date().toISOString() })
 *   .eq('id', messageId)
 *
 * // Send message
 * .from('messages')
 *   .insert({ sender_id: user.id, recipient_id, content })
 * ```
 *
 * REAL-TIME SUBSCRIPTION:
 * - Subscribes to message INSERT events
 * - Filters by sender or recipient (or uses broadcast)
 * - Shows message if from/to selected user
 * - Auto-marks as read if user is recipient
 * - Scrolls viewport to latest message
 *
 * MESSAGE STYLING:
 * | `Role` | `Alignment` | `Color` | `Bubble` |
 * |------|-----------|-------|--------|
 * | `Sent` | `Right` | `Purple` | with arrow |
 * | `Received` | `Left` | `Gray` | with arrow |
 * | `Time` | Below text | `Gray` | `smaller` |
 * | Read status | After time | `Subtle` | if sent |
 *
 * STATE MANAGEMENT:
 * | `State` | Type | Purpose |
 * |-------|------|---------|
 * | `users` | `User[]` | All available users |
 * | `selectedUserId` | string \| `null` | Currently selected user |
 * | `messages` | `Message[]` | Messages in conversation |
 * | `newMessage` | `string` | Input field value |
 * | `loading` | `boolean` | Initial data load |
 *
 * UX FEATURES:
 * - User list has hover background
 * - Selected user has purple background
 * - Messages scroll to bottom on new message
 * - Input disabled if no user selected
 * - Shows "Select a user" placeholder
 * - Auto-marks messages as read
 * - Displays read receipts for sent messages
 *
 * FILE REFERENCES:
 * - ../lib/supabase.ts - Supabase client
 * - ../contexts/AuthContext.tsx - useAuth() hook
 * - ../App.tsx - Route definition
 *
 * ## Key Concepts
 * - Real-time message delivery
 * - Bi-directional conversations
 * - Read receipts
 * - User presence (implicit via activity)
 * - PostgreSQL JSON queries for OR logic
 * - WebSocket subscriptions
 */

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  read: boolean
  read_at: string | null
  created_at: string
}

/**
 * REF: messages-page-component
 */
export default function Messages() {
  const { user } = useAuth()

  const [users, setUsers] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  /**
   * FETCH USERS
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
  }, [user])

  /**
   * FETCH CONVERSATION
   */
  useEffect(() => {
    if (!user || !selectedUserId) {
      setMessages([])
      return
    }

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      setMessages(data || [])

      // Mark as read
      data?.forEach(msg => {
        if (msg.recipient_id === user.id && !msg.read) {
          supabase
            .from('messages')
            .update({ read: true, read_at: new Date().toISOString() })
            .eq('id', msg.id)
            .then()
        }
      })

      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    fetchMessages()

    /**
     * REAL-TIME SUBSCRIPTION
     */
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMsg = payload.new as Message

        if (
          (newMsg.sender_id === user.id && newMsg.recipient_id === selectedUserId) ||
          (newMsg.sender_id === selectedUserId && newMsg.recipient_id === user.id)
        ) {
          setMessages(prev => [...prev, newMsg])
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

          if (newMsg.recipient_id === user.id) {
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMsg.id)
              .then()
          }
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, selectedUserId])

  /**
   * SEND MESSAGE
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedUserId || !newMessage.trim()) return

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: selectedUserId,
        content: newMessage.trim()
      })

    if (error) {
      console.error('Error:', error)
      return
    }

    setNewMessage('')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>
  }

  const selectedUser = users.find(u => u.user_id === selectedUserId)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>

        <div className="grid grid-cols-4 gap-6 h-[600px]">
          {/* User List */}
          <div className="col-span-1 bg-white rounded-lg shadow overflow-y-auto">
            <div className="p-4 border-b"><h2 className="font-semibold">Users</h2></div>

            {users.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.user_id)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedUserId === u.user_id ? 'bg-purple-50' : ''
                }`}
              >
                {u.display_name || 'User'}
              </button>
            ))}
          </div>

          {/* Conversation */}
          <div className="col-span-3 bg-white rounded-lg shadow flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-semibold">{selectedUser.display_name || 'User'}</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          msg.sender_id === user?.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className="text-xs mt-1 opacity-70">
                          {new Date(msg.created_at).toLocaleTimeString()}
                          {msg.sender_id === user?.id && msg.read && ' • Read'}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                    >
                      Send
                    </button>
                  </div>
                </form>
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
// CLOSE: messages-page-component
