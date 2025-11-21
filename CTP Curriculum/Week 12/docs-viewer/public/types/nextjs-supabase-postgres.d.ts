/**
 * REF: file-header
 *
 * # Database Type Definitions
 *
 * TypeScript types generated from Supabase database schema for type-safe database operations.
 *
 * ## What This File Does
 * - Provides TypeScript types for all database tables
 * - Auto-generated from actual Supabase schema
 * - Enables autocomplete and type checking for queries
 * - Prevents typos and data type errors
 *
 * ## Generation Command
 * ```bash
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 * ```
 *
 * ## Benefits
 * | Benefit | Description |
 * |---------|-------------|
 * | `Type Safety` | Catch errors at compile time, not runtime |
 * | `Autocomplete` | Full IDE support for table/column names |
 * | `Documentation` | Types serve as living documentation |
 * | `Refactoring` | Safe schema changes across codebase |
 *
 * ## Usage Example
 * ```typescript
 * import type { Database } from '@/types/database'
 * const supabase = createClient<Database>()
 * const { data } = await supabase.from('todos').select('*')
 * // data is fully typed with autocomplete!
 * ```
 */
// CLOSE: file-header

/**
 * REF: json-type
 *
 * ## Json Type Definition
 *
 * Recursive type for JSON data stored in PostgreSQL JSONB columns.
 *
 * ### Supported Types
 * - Primitives: `string`, `number`, `boolean`, `null`
 * - Objects: `{ [key: string]: Json }`
 * - Arrays: `Json[]`
 *
 * ### Use Cases
 * - Flexible metadata fields
 * - Dynamic configuration
 * - Nested data structures
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
// CLOSE: json-type

/**
 * REF: database-interface
 *
 * ## Main Database Interface
 *
 * Complete type definition for the entire Supabase database schema.
 *
 * ### Structure
 * | Section | Purpose |
 * |---------|---------|
 * | `public.Tables` | All database tables with Row/Insert/Update types |
 * | `public.Views` | Database views (none in this schema) |
 * | `public.Functions` | Database functions (none in this schema) |
 * | `public.Enums` | Enum types (none in this schema) |
 */
export interface Database {
  public: {
    Tables: {
      /**
       * REF: users-table
       *
       * ## Users Table
       *
       * Core user authentication records (managed by Supabase Auth).
       *
       * ### Schema
       * | Column | Type | Description |
       * |--------|------|-------------|
       * | `id` | `string` | UUID primary key |
       * | `email` | `string` | User's email (unique) |
       * | `created_at` | `string` | Account creation timestamp |
       *
       * ### Type Variations
       * - **Row**: Data returned from SELECT queries
       * - **Insert**: Data for INSERT operations (id, created_at optional)
       * - **Update**: Data for UPDATE operations (all fields optional)
       */
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      // CLOSE: users-table

      /**
       * REF: user-profiles-table
       *
       * ## User Profiles Table
       *
       * Extended user profile information beyond basic auth.
       *
       * ### Schema
       * | Column | Type | Description |
       * |--------|------|-------------|
       * | `id` | `string` | UUID primary key |
       * | `user_id` | `string` | Foreign key to users table |
       * | `display_name` | `string \| null` | User's display name |
       * | `profile_picture` | `string \| null` | URL to profile image |
       * | `created_at` | `string` | Profile creation timestamp |
       * | `updated_at` | `string` | Last update timestamp |
       *
       * ### Relationships
       * - `user_id` → `users.id` (one-to-one)
       */
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          profile_picture: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          profile_picture?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          profile_picture?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // CLOSE: user-profiles-table

      /**
       * REF: user-settings-table
       *
       * ## User Settings Table
       *
       * User preferences for UI customization and accessibility.
       *
       * ### Schema
       * | Column | Type | Default | Description |
       * |--------|------|---------|-------------|
       * | `id` | `string` | UUID | Primary key |
       * | `user_id` | `string` | - | Foreign key to users |
       * | `theme` | `string` | 'light' | UI theme preference |
       * | `font_size` | `string` | 'medium' | Text size preference |
       * | `high_contrast` | `boolean` | false | Accessibility setting |
       * | `reduced_motion` | `boolean` | false | Accessibility setting |
       * | `updated_at` | `string` | now() | Last change timestamp |
       *
       * ### Relationships
       * - `user_id` → `users.id` (one-to-one)
       */
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          font_size: string
          high_contrast: boolean
          reduced_motion: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          font_size?: string
          high_contrast?: boolean
          reduced_motion?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          font_size?: string
          high_contrast?: boolean
          reduced_motion?: boolean
          updated_at?: string
        }
      }
      // CLOSE: user-settings-table

      /**
       * REF: todos-table
       *
       * ## Todos Table
       *
       * Main todo items with rich features (tags, visibility, attachments).
       *
       * ### Schema
       * | Column | Type | Default | Description |
       * |--------|------|---------|-------------|
       * | `id` | `string` | UUID | Primary key |
       * | `user_id` | `string` | - | Todo owner (FK to users) |
       * | `title` | `string` | - | Todo title (required) |
       * | `description` | `string \| null` | null | Optional details |
       * | `completed` | `boolean` | false | Completion status |
       * | `is_public` | `boolean` | false | Visibility in feed |
       * | `tags` | `string[] \| null` | null | Categorization tags |
       * | `created_at` | `string` | now() | Creation timestamp |
       * | `updated_at` | `string` | now() | Last update timestamp |
       *
       * ### Features
       * - **Privacy**: Public todos appear in feed, private are user-only
       * - **Tags**: Array of strings for categorization
       * - **Timestamps**: Automatic tracking of creation/updates
       *
       * ### Relationships
       * - `user_id` → `users.id` (many-to-one)
       * - One todo → Many attachments
       */
      todos: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          is_public: boolean
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          is_public?: boolean
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          is_public?: boolean
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      // CLOSE: todos-table

      /**
       * REF: todo-attachments-table
       *
       * ## Todo Attachments Table
       *
       * File attachments linked to todos (images, documents, etc.).
       *
       * ### Schema
       * | Column | Type | Description |
       * |--------|------|-------------|
       * | `id` | `string` | UUID primary key |
       * | `todo_id` | `string` | Foreign key to todos table |
       * | `file_name` | `string` | Original filename |
       * | `file_url` | `string` | Supabase Storage URL |
       * | `file_size` | `number` | Size in bytes |
       * | `mime_type` | `string` | File content type |
       * | `uploaded_at` | `string` | Upload timestamp |
       *
       * ### Relationships
       * - `todo_id` → `todos.id` (many-to-one)
       *
       * ### Storage Integration
       * - Files stored in Supabase Storage bucket
       * - `file_url` is public URL for download
       * - Supports any file type (images, PDFs, etc.)
       */
      todo_attachments: {
        Row: {
          id: string
          todo_id: string
          file_name: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          todo_id: string
          file_name: string
          file_url: string
          file_size: number
          mime_type: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          todo_id?: string
          file_name?: string
          file_url?: string
          file_size?: number
          mime_type?: string
          uploaded_at?: string
        }
      }
      // CLOSE: todo-attachments-table

      /**
       * REF: messages-table
       *
       * ## Messages Table
       *
       * Direct messages between users for communication feature.
       *
       * ### Schema
       * | Column | Type | Default | Description |
       * |--------|------|---------|-------------|
       * | `id` | `string` | UUID | Primary key |
       * | `sender_id` | `string` | - | FK to users (sender) |
       * | `recipient_id` | `string` | - | FK to users (receiver) |
       * | `content` | `string` | - | Message text |
       * | `read` | `boolean` | false | Read status |
       * | `read_at` | `string \| null` | null | Timestamp when read |
       * | `created_at` | `string` | now() | Message sent time |
       *
       * ### Features
       * - **Read Tracking**: `read` flag + `read_at` timestamp
       * - **Bidirectional**: Sender and recipient both link to users
       * - **Real-time**: Can use Supabase subscriptions for live updates
       *
       * ### Relationships
       * - `sender_id` → `users.id` (many-to-one)
       * - `recipient_id` → `users.id` (many-to-one)
       */
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      // CLOSE: messages-table
    }

    /**
     * REF: database-views
     *
     * ## Database Views
     *
     * No views defined in this schema.
     * Views would appear here if created in the database.
     */
    Views: {
      [_ in never]: never
    }
    // CLOSE: database-views

    /**
     * REF: database-functions
     *
     * ## Database Functions
     *
     * No custom functions defined in this schema.
     * PostgreSQL functions would appear here if created.
     */
    Functions: {
      [_ in never]: never
    }
    // CLOSE: database-functions

    /**
     * REF: database-enums
     *
     * ## Database Enums
     *
     * No enum types defined in this schema.
     * PostgreSQL enums would appear here if created.
     */
    Enums: {
      [_ in never]: never
    }
    // CLOSE: database-enums
  }
}
// CLOSE: database-interface

/**
 * REF: usage-notes
 *
 * ## Type Usage Patterns
 *
 * ### Type-Safe Queries
 * ```typescript
 * import type { Database } from '@/types/database'
 * import { createClient } from '@supabase/supabase-js'
 *
 * const supabase = createClient<Database>(url, key)
 *
 * // Select with full typing
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 * // data: Database['public']['Tables']['todos']['Row'][] | null
 *
 * // Insert with validation
 * const { error } = await supabase
 *   .from('todos')
 *   .insert({ user_id: '...', title: 'New Todo' })
 * // TypeScript ensures required fields are provided
 *
 * // Update with partial data
 * const { error } = await supabase
 *   .from('todos')
 *   .update({ completed: true })
 *   .eq('id', todoId)
 * ```
 *
 * ### Helper Type Extraction
 * ```typescript
 * // Extract specific table types
 * type Todo = Database['public']['Tables']['todos']['Row']
 * type NewTodo = Database['public']['Tables']['todos']['Insert']
 * type TodoUpdate = Database['public']['Tables']['todos']['Update']
 *
 * // Use in function signatures
 * async function createTodo(todo: NewTodo): Promise<Todo> {
 *   const { data, error } = await supabase
 *     .from('todos')
 *     .insert(todo)
 *     .select()
 *     .single()
 *
 *   if (error) throw error
 *   return data
 * }
 * ```
 *
 * ### Regenerating Types
 * When database schema changes:
 * ```bash
 * # 1. Update database via Supabase dashboard or migrations
 * # 2. Regenerate types
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 * # 3. TypeScript will catch any breaking changes
 * ```
 */
// CLOSE: usage-notes



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



// Supabase types
declare module '@supabase/supabase-js' {
  export function createClient(url: string, key: string): any
  export interface User {
    id: string
    email?: string
  }
}

declare module '@supabase/ssr' {
  export function createBrowserClient(url: string, key: string): any
  export function createServerClient(url: string, key: string, options: any): any
}
