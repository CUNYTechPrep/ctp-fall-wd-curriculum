/**
 * REF: shared-types-supabase
 *
 * # Shared Type Definitions
 *
 * Central type definitions for React + Vite + Supabase application.
 */

/**
 * REF: attachment-interface-supabase
 *
 * ## Attachment Interface
 */
export interface Attachment {
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  uploadedAt?: string
}
// CLOSE: attachment-interface-supabase

/**
 * REF: todo-interface-supabase
 *
 * ## Todo Interface
 */
export interface Todo {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  is_public: boolean
  tags?: string[]
  attachments?: Attachment[]
  created_at: string
  updated_at: string
}
// CLOSE: todo-interface-supabase

/**
 * REF: user-interface-supabase
 *
 * ## User Interface
 */
export interface User {
  id: string
  email: string
  display_name?: string
  photo_url?: string
  created_at: string
}
// CLOSE: user-interface-supabase

/**
 * REF: message-interface-supabase
 *
 * ## Message Interface
 */
export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  read: boolean
  read_at?: string
  created_at: string
}
// CLOSE: message-interface-supabase

/**
 * REF: settings-interface-supabase
 *
 * ## Settings Interface
 */
export interface Settings {
  user_id: string
  theme: 'light' | 'dark'
  font_size: 'small' | 'medium' | 'large'
  high_contrast: boolean
  reduced_motion: boolean
}
// CLOSE: settings-interface-supabase
// CLOSE: shared-types-supabase
