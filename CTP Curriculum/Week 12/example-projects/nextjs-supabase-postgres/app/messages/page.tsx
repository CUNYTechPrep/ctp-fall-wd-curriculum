/**
 * Messages Page - Real-time Chat with PostgreSQL
 *
 * REF:
 * Real-time messaging using Supabase Realtime and PostgreSQL for storage.
 * Demonstrates RLS for privacy, real-time sync, and transaction safety.
 *
 * | Feature | `Mechanism` | Benefit |
 * |---------|-----------|---------|
 * | `Storage` | `PostgreSQL` | ACID guarantees |
 * | Real-time | Realtime Broadcast | Instant delivery |
 * | `Security` | RLS policies | Database enforced |
 * | `Efficiency` | `Indexes` | Fast conversation queries |
 *
 * CLOSE:
 *
 * **Messaging Flow:**
 * 1. User sends message → INSERT into PostgreSQL
 * 2. Supabase detects change via LISTEN
 * 3. Broadcasts to subscribed clients
 * 4. Recipient receives in real-time
 * 5. Recipient marks read → UPDATE
 * 6. Sender sees "Read" indicator
 */

// REF: client-component-directive
'use client'
// CLOSE: client-component-directive

// REF: react-auth-supabase-imports
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
// CLOSE: react-auth-supabase-imports

// REF: message-and-user-type-definitions
type Message = Database['public']['Tables']['messages']['Row']
type User = {
  id: string
  email: string
  display_name?: string
}
// CLOSE: message-and-user-type-definitions

// REF: messages-page-component
export default function MessagesPage() {
  const { user } = useAuth()
  const supabase = createClient()
// CLOSE: messages-page-component

// REF: Constant declaration
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
// CLOSE: Constant declaration

// REF: Constant: messagesEndRef
  const messagesEndRef = useRef<HTMLDivElement>(null)
// CLOSE: Constant: messagesEndRef

  /**
   * FETCH USERS
   *
   * REF: Get all users except current user for message sidebar
   *
   * | `Optimization` | Benefit |
   * |---|---|
   * | Select specific columns | Reduce bandwidth |
   * | .neq() filter | Exclude self |
   * | No unnecessary joins | Faster query |
   *
   * CLOSE: Always select only needed columns
   */
// REF: Function: useEffect
  useEffect(() => {
    if (!user) return
// CLOSE: Function: useEffect

// REF: Async function: const
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, display_name')
        .neq('user_id', user.id)
// CLOSE: Async function: const

// REF: Control flow
      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data?.map(p => ({
          id: p.user_id,
          email: '',
          display_name: p.display_name || undefined,
        })) || [])
      }
// CLOSE: Control flow

      setLoading(false)
    }

    fetchUsers()
  }, [user, supabase])

  /**
   * FETCH CONVERSATION
   *
   * REF: Get all messages in bidirectional conversation
   *
   * **Logic:**
   * ```
   * (sender = me AND recipient = them) OR
   * (sender = them AND recipient = me)
   * ```
   *
   * **Supabase:**
   * - `.or()` - Combine with OR logic
   * - Complex filter strings
   *
   * CLOSE: Order by created_at ascending to show chronological order
   */
// REF: Function: useEffect
  useEffect(() => {
    if (!user || !selectedUserId) {
      setMessages([])
      return
    }
// CLOSE: Function: useEffect

// REF: Async function: const
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
// CLOSE: Async function: const

// REF: Control flow
      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data || [])
// CLOSE: Control flow

        // Mark received messages as read
// REF: Function: data
        data?.forEach(msg => {
          if (msg.recipient_id === user.id && !msg.read) {
            supabase
              .from('messages')
              .update({ read: true, read_at: new Date().toISOString() })
              .eq('id', msg.id)
              .then()
          }
        })
// CLOSE: Function: data

        scrollToBottom()
      }
    }

    fetchMessages()

    /**
     * REAL-TIME SUBSCRIPTION
     *
     * REF: Listen for new messages in real-time
     *
     * | `Characteristic` | `Value` |
     * |---|---|
     * | `Latency` | < 100ms typical |
     * | `Scale` | Thousands concurrent |
     * | `Tech` | PostgreSQL LISTEN/NOTIFY |
     * | `Events` | INSERT, UPDATE, DELETE |
     *
     * CLOSE: Client-side filtering for conversation relevance
     */
// REF: Constant: channel
    const channel = supabase
      .channel(`conversation-${user.id}-${selectedUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message
// CLOSE: Constant: channel

          // Only add if it's part of this conversation
// REF: Control flow
          if (
            (newMsg.sender_id === user.id && newMsg.recipient_id === selectedUserId) ||
            (newMsg.sender_id === selectedUserId && newMsg.recipient_id === user.id)
          ) {
            setMessages(prev => [...prev, newMsg])
            scrollToBottom()
// CLOSE: Control flow

            // Mark as read if we're the recipient
// REF: Control flow
            if (newMsg.recipient_id === user.id) {
              supabase
                .from('messages')
                .update({ read: true, read_at: new Date().toISOString() })
                .eq('id', newMsg.id)
                .then()
            }
          }
        }
      )
      .subscribe()
// CLOSE: Control flow

// REF: Function: return
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, selectedUserId, supabase])
// CLOSE: Function: return

  /**
   * SEND MESSAGE
   *
   * REF: Insert message into database with RLS protection
   *
   * **Security Chain:**
   * 1. Client sends message
   * 2. RLS policy enforces sender_id = auth.uid()
   * 3. Can't spoof sender_id
   * 4. Database rejects unauthorized inserts
   *
   * CLOSE: RLS prevents impersonation - database is the source of truth
   */
// REF: Async function: const
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
// CLOSE: Async function: const

// REF: JSX return
    if (!user || !selectedUserId || !newMessage.trim()) return
// CLOSE: JSX return

    setSending(true)

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedUserId,
          content: newMessage.trim(),
        })

// REF: Control flow
      if (error) throw error
// CLOSE: Control flow

      setNewMessage('')
      scrollToBottom()
    } catch (error: any) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

// REF: Function: const
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
// CLOSE: Function: const

// REF: Control flow
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }
// CLOSE: Control flow

// REF: Function: const
  const selectedUser = users.find(u => u.id === selectedUserId)
// CLOSE: Function: const

  /**
   * MAIN RENDER
   *
   * Two-column layout:
   * - Left: User list
   * - Right: Conversation
   */
// REF: JSX return
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>
// CLOSE: JSX return

// REF: JSX element
        <div className="grid grid-cols-4 gap-6 h-[600px]">
          {/* User List */}
          <div className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Users</h2>
            </div>
// CLOSE: JSX element

// REF: Function: users
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedUserId === u.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium">{u.display_name || 'User'}</div>
              </button>
            ))}
          </div>
// CLOSE: Function: users

          {/* Conversation */}
// REF: JSX element
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-semibold">{selectedUser.display_name || 'User'}</h2>
                </div>
// CLOSE: JSX element

// REF: JSX element
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          msg.sender_id === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700'
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
// CLOSE: JSX element

// REF: JSX element
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
// CLOSE: JSX element

/**
 * ## Production DATABASE INDEXING
 *
 * REF: Essential indexes for messaging performance
 *
 * **Create these indexes:**
 * ```sql
 * -- Recipient message queries
 * CREATE INDEX idx_messages_recipient
 * ON messages(recipient_id, created_at DESC);
 *
 * -- Sender message queries
 * CREATE INDEX idx_messages_sender
 * ON messages(sender_id, created_at DESC);
 *
 * -- Conversation queries
 * CREATE INDEX idx_messages_conversation
 * ON messages(sender_id, recipient_id, created_at);
 *
 * -- Unread message notification
 * CREATE INDEX idx_messages_unread
 * ON messages(recipient_id, read, created_at)
 * WHERE read = false;
 * ```
 *
 * CLOSE: Queries instant even with millions of messages
 */

/**
 * ADVANCED FEATURES (Future)
 *
 * REF: Common messaging features to add
 *
 * | Feature | `Implementation` | Benefit |
 * |---------|---|---|
 * | Typing indicators | Presence API | See who's typing |
 * | `Reactions` | message_reactions table | Emoji reactions |
 * | `Search` | Full-text search | Find old messages |
 * | `Attachments` | Storage + metadata | Share files |
 * | Group chat | `conversation_participants` | Multi-user rooms |
 *
 * CLOSE: Build incrementally based on user needs
 */
