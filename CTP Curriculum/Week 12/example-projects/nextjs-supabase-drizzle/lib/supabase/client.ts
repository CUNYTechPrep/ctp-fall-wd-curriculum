/**
 * REF: supabase-client-overview
 *
 * # Supabase Client for Authentication and Storage
 *
 * This file provides the Supabase client specifically for authentication and file
 * storage in a hybrid Drizzle + Supabase architecture.
 *
 * ## Hybrid Architecture
 *
 * This project uses a hybrid approach combining the strengths of both libraries:
 *
 * | Feature | `Tool` | `Why` |
 * |---------|------|-----|
 * | Database queries | Drizzle ORM | Perfect type safety, complex queries |
 * | `Authentication` | `Supabase` | Battle-tested, feature-rich auth |
 * | File storage | `Supabase` | Easy uploads, CDN, transformations |
 * | Real-time | `Supabase` | Built-in subscriptions |
 *
 * ## Why Hybrid Approach?
 *
 * ### Drizzle Strengths
 * - Perfect TypeScript inference
 * - SQL-like query syntax
 * - Complex JOINs and queries
 * - Lightweight and fast
 *
 * ### Supabase Strengths
 * - Best-in-class authentication
 * - Easy file uploads and management
 * - Built-in CDN for storage
 * - Real-time subscriptions
 * - OAuth providers integration
 *
 * ### Best of Both Worlds
 * - Type-safe database operations (Drizzle)
 * - Proven authentication system (Supabase)
 * - Easy file management (Supabase)
 * - Each tool excels at what it does best
 *
 * ## File Organization
 *
 * ```
 * lib/
 * ├── db/
 * │   ├── client.ts    ← Drizzle for database
 * │   ├── schema.ts
 * │   └── queries.ts
 * └── supabase/
 *     └── client.ts    ← This file - Supabase for auth/storage
 * ```
 */
// CLOSE: supabase-client-overview

/**
 * REF: supabase-imports
 *
 * ## Import Dependencies
 *
 * ## Supabase SSR Package
 *
 * | `Import` | `Package` | Purpose |
 * |--------|---------|---------|
 * | `createBrowserClient` | @supabase/ssr | Creates client-side Supabase instance |
 *
 * ### Why @supabase/ssr?
 *
 * The SSR package provides:
 * - Automatic cookie handling
 * - Server and client compatibility
 * - Proper session management in Next.js
 * - Works with App Router and Pages Router
 *
 * ### Alternative Imports
 *
 * ```typescript
 * // For server-side (Server Components, API Routes)
 * import { createServerClient } from '@supabase/ssr'
 *
 * // For middleware
 * import { createMiddlewareClient } from '@supabase/ssr'
 * ```
 */
import { createBrowserClient } from '@supabase/ssr'
// CLOSE: supabase-imports

/**
 * REF: create-client-function
 *
 * ## Create Supabase Client
 *
 * Factory function that creates a Supabase browser client instance configured
 * for authentication and storage operations.
 *
 * ## Function Signature
 *
 * ```typescript
 * export const createClient = () => SupabaseClient
 * ```
 *
 * ## Environment Variables
 *
 * | `Variable` | Purpose | Where to Find |
 * |----------|---------|---------------|
 * | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Dashboard → Settings → API |
 * | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key | Dashboard → Settings → API |
 *
 * ### Environment Variable Setup
 *
 * Create `.env.local` in project root:
 *
 * ```bash
 * NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
 * ```
 *
 * ## Database Types Not Included
 *
 * Unlike pure Supabase projects, we don't pass database types to this client
 * because we use Drizzle for all database operations.
 *
 * ```typescript
 * // Pure Supabase approach (not used here)
 * createBrowserClient<Database>(url, key)
 *
 * // Our approach - no database types needed
 * createBrowserClient(url, key)
 * ```
 *
 * ## Usage Scope
 *
 * Use this client for:
 * - **Authentication**: `supabase.auth.signUp()`, `signIn()`, `signOut()`
 * - **Storage**: `supabase.storage.from('bucket').upload()`
 * - **Real-time**: `supabase.channel().on().subscribe()`
 *
 * Do NOT use for:
 * - **Database queries**: Use Drizzle instead (`db` from lib/db/client.ts)
 *
 * ## Example Usage
 *
 * ```typescript
 * // In a Client Component
 * import { createClient } from '@/lib/supabase/client'
 *
 * export default function LoginForm() {
 *   const supabase = createClient()
 *
 *   const handleLogin = async () => {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email: 'user@example.com',
 *       password: 'password'
 *     })
 *   }
 * }
 * ```
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
// CLOSE: create-client-function

/**
 * REF: when-to-use-comparison
 *
 * ## When to Use Supabase Client vs Drizzle
 *
 * Decision guide for choosing between Supabase client and Drizzle ORM.
 *
 * ## Use Supabase Client For
 *
 * | `Operation` | Why Supabase |
 * |-----------|--------------|
 * | `Authentication` | Built-in, secure, feature-complete |
 * | OAuth providers | Google, GitHub, etc. integration |
 * | File uploads | Easy API, CDN, transformations |
 * | File downloads | Signed URLs, public URLs |
 * | Real-time subscriptions | Built-in change detection |
 * | Simple CRUD (optional) | Quick prototyping |
 *
 * ## Use Drizzle For
 *
 * | `Operation` | Why Drizzle |
 * |-----------|-------------|
 * | Complex queries | SQL-like syntax, better ergonomics |
 * | JOINs across tables | Cleaner than Supabase |
 * | Type safety | Perfect TypeScript inference |
 * | `Transactions` | ACID guarantees |
 * | Schema migrations | Version controlled SQL |
 * | `Aggregations` | COUNT, SUM, AVG, etc. |
 * | Full-text search | PostgreSQL features |
 *
 * ## Hybrid Usage Pattern
 *
 * ```typescript
 * import { createClient } from '@/lib/supabase/client'
 * import { db } from '@/lib/db/client'
 * import { todos } from '@/lib/db/schema'
 * import { eq } from 'drizzle-orm'
 *
 * // 1. Auth with Supabase
 * const supabase = createClient()
 * const { data: { user } } = await supabase.auth.getUser()
 *
 * // 2. Database queries with Drizzle
 * const userTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, user.id))
 *
 * // 3. File storage with Supabase
 * await supabase.storage
 *   .from('attachments')
 *   .upload(path, file)
 *
 * // 4. Real-time with Supabase
 * supabase
 *   .channel('todos')
 *   .on('postgres_changes', { table: 'todos' }, handleChange)
 *   .subscribe()
 * ```
 */
// CLOSE: when-to-use-comparison

/**
 * REF: authentication-examples
 *
 * ## Authentication Examples
 *
 * Common authentication operations using Supabase Auth.
 *
 * ### Sign Up
 *
 * ```typescript
 * const supabase = createClient()
 *
 * const { data, error } = await supabase.auth.signUp({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   options: {
 *     data: {
 *       display_name: 'John Doe',
 *       avatar_url: 'https://...'
 *     },
 *     emailRedirectTo: 'https://yourapp.com/welcome'
 *   }
 * })
 * ```
 *
 * ### Sign In with Password
 *
 * ```typescript
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * })
 *
 * if (data.user) {
 *   // User signed in successfully
 * }
 * ```
 *
 * ### Sign In with OAuth
 *
 * ```typescript
 * // Google
 * await supabase.auth.signInWithOAuth({
 *   provider: 'google',
 *   options: {
 *     redirectTo: 'https://yourapp.com/auth/callback'
 *   }
 * })
 *
 * // GitHub
 * await supabase.auth.signInWithOAuth({
 *   provider: 'github'
 * })
 * ```
 *
 * ### Sign Out
 *
 * ```typescript
 * await supabase.auth.signOut()
 * ```
 *
 * ### Get Current User
 *
 * ```typescript
 * const { data: { user } } = await supabase.auth.getUser()
 *
 * if (user) {
 *   console.log(user.id)
 *   console.log(user.email)
 *   console.log(user.user_metadata.display_name)
 * }
 * ```
 *
 * ### Get Session
 *
 * ```typescript
 * const { data: { session } } = await supabase.auth.getSession()
 *
 * if (session) {
 *   console.log(session.access_token)
 *   console.log(session.user)
 * }
 * ```
 *
 * ### Password Reset
 *
 * ```typescript
 * // Request reset email
 * await supabase.auth.resetPasswordForEmail('user@example.com', {
 *   redirectTo: 'https://yourapp.com/reset-password'
 * })
 *
 * // Update password (after clicking email link)
 * await supabase.auth.updateUser({
 *   password: 'new-password'
 * })
 * ```
 *
 * ### Listen to Auth Changes
 *
 * ```typescript
 * supabase.auth.onAuthStateChange((event, session) => {
 *   if (event === 'SIGNED_IN') {
 *     console.log('User signed in:', session.user)
 *   }
 *   if (event === 'SIGNED_OUT') {
 *     console.log('User signed out')
 *   }
 * })
 * ```
 */
// CLOSE: authentication-examples

/**
 * REF: storage-examples
 *
 * ## Storage Examples
 *
 * File upload, download, and management with Supabase Storage.
 *
 * ### Upload File
 *
 * ```typescript
 * const supabase = createClient()
 *
 * const { data, error } = await supabase.storage
 *   .from('attachments')
 *   .upload(`${userId}/${filename}`, file, {
 *     cacheControl: '3600',
 *     upsert: false,  // Don't overwrite existing
 *     contentType: 'image/png'
 *   })
 *
 * if (data) {
 *   console.log('File path:', data.path)
 * }
 * ```
 *
 * ### Get Public URL
 *
 * ```typescript
 * const { data } = supabase.storage
 *   .from('attachments')
 *   .getPublicUrl('user-123/photo.jpg')
 *
 * console.log('Public URL:', data.publicUrl)
 * ```
 *
 * ### Get Signed URL (Temporary Access)
 *
 * ```typescript
 * const { data, error } = await supabase.storage
 *   .from('private-files')
 *   .createSignedUrl('document.pdf', 3600) // Valid for 1 hour
 *
 * console.log('Temporary URL:', data.signedUrl)
 * ```
 *
 * ### Download File
 *
 * ```typescript
 * const { data, error } = await supabase.storage
 *   .from('attachments')
 *   .download('user-123/photo.jpg')
 *
 * if (data) {
 *   // data is a Blob
 *   const url = URL.createObjectURL(data)
 *   // Use the URL for display or download
 * }
 * ```
 *
 * ### List Files in Bucket
 *
 * ```typescript
 * const { data, error } = await supabase.storage
 *   .from('attachments')
 *   .list('user-123/', {
 *     limit: 100,
 *     offset: 0,
 *     sortBy: { column: 'created_at', order: 'desc' }
 *   })
 *
 * data.forEach(file => {
 *   console.log(file.name, file.size, file.created_at)
 * })
 * ```
 *
 * ### Delete File
 *
 * ```typescript
 * await supabase.storage
 *   .from('attachments')
 *   .remove(['user-123/photo.jpg'])
 *
 * // Delete multiple files
 * await supabase.storage
 *   .from('attachments')
 *   .remove([
 *     'user-123/photo1.jpg',
 *     'user-123/photo2.jpg'
 *   ])
 * ```
 *
 * ### Move/Rename File
 *
 * ```typescript
 * await supabase.storage
 *   .from('attachments')
 *   .move('old-path/file.jpg', 'new-path/file.jpg')
 * ```
 *
 * ### Image Transformations
 *
 * ```typescript
 * const { data } = supabase.storage
 *   .from('attachments')
 *   .getPublicUrl('photo.jpg', {
 *     transform: {
 *       width: 300,
 *       height: 300,
 *       resize: 'cover',
 *       format: 'webp',
 *       quality: 80
 *     }
 *   })
 * ```
 */
// CLOSE: storage-examples

/**
 * REF: realtime-examples
 *
 * ## Real-Time Subscriptions
 *
 * Subscribe to database changes using Supabase Real-time.
 *
 * ### Subscribe to Table Changes
 *
 * ```typescript
 * const supabase = createClient()
 *
 * const channel = supabase
 *   .channel('db-changes')
 *   .on('postgres_changes', {
 *     event: '*',  // INSERT, UPDATE, DELETE, or *
 *     schema: 'public',
 *     table: 'todos',
 *     filter: `user_id=eq.${userId}`
 *   }, (payload) => {
 *     console.log('Change received:', payload)
 *
 *     if (payload.eventType === 'INSERT') {
 *       console.log('New record:', payload.new)
 *     }
 *
 *     if (payload.eventType === 'UPDATE') {
 *       console.log('Old:', payload.old)
 *       console.log('New:', payload.new)
 *     }
 *
 *     if (payload.eventType === 'DELETE') {
 *       console.log('Deleted:', payload.old)
 *     }
 *   })
 *   .subscribe()
 * ```
 *
 * ### Hybrid Pattern: Real-Time + Drizzle
 *
 * Use Supabase for change notifications, Drizzle for type-safe refetch:
 *
 * ```typescript
 * import { getUserTodos } from '@/lib/db/queries'
 *
 * supabase
 *   .channel('todos')
 *   .on('postgres_changes', {
 *     event: '*',
 *     table: 'todos',
 *     filter: `user_id=eq.${userId}`
 *   }, async () => {
 *     // Refetch with Drizzle for type safety
 *     const todos = await getUserTodos(userId)
 *     setTodos(todos)
 *   })
 *   .subscribe()
 * ```
 *
 * ### Cleanup Subscriptions
 *
 * ```typescript
 * // Remove specific channel
 * supabase.removeChannel(channel)
 *
 * // Remove all channels
 * supabase.removeAllChannels()
 * ```
 *
 * ### Benefits
 *
 * - Supabase broadcasts changes in real-time
 * - Drizzle provides type-safe data refetch
 * - Best of both worlds: real-time + type safety
 */
// CLOSE: realtime-examples

/**
 * REF: architecture-rationale
 *
 * ## Why This Hybrid Architecture?
 *
 * Comparison of different approaches and why the hybrid model wins.
 *
 * ## Problem: Supabase Client Alone
 *
 * | `Issue` | `Impact` |
 * |-------|--------|
 * | Limited type safety | Complex queries lose type information |
 * | Awkward JOINs | Nested selects or multiple queries |
 * | No migration system | Manual SQL or Supabase dashboard |
 * | Query builder limitations | Some SQL features hard to access |
 *
 * ## Problem: Drizzle Alone
 *
 * | `Issue` | `Impact` |
 * |-------|--------|
 * | Build auth from scratch | Time-consuming, security risks |
 * | Implement file storage | Need S3/CDN integration |
 * | Custom real-time | WebSockets, polling, or third-party |
 * | No OAuth integration | Manual provider setup |
 *
 * ## Solution: Hybrid Approach
 *
 * | Benefit | `How` |
 * |---------|-----|
 * | Proven authentication | Supabase handles it |
 * | Easy file management | Supabase Storage + CDN |
 * | Type-safe queries | Drizzle ORM |
 * | Complex database operations | Drizzle query builder |
 * | Real-time updates | Supabase subscriptions |
 * | Each tool excels | Use the right tool for each job |
 *
 * ## The Best of Both Worlds
 *
 * - Supabase: Best-in-class managed services (Auth, Storage, Real-time)
 * - Drizzle: Perfect type safety and powerful queries
 * - Together: Complete, type-safe, production-ready stack
 */
// CLOSE: architecture-rationale

/**
 * REF: exports
 *
 * ## Module Exports
 *
 * Export the client factory function for use throughout the application.
 */
export default createClient
// CLOSE: exports
