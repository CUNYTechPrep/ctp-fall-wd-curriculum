/**
 * Drizzle ORM Schema Definition
 *
 * REF: Drizzle Type-Safe Database Schema
 *
 * This file defines the complete database schema using Drizzle ORM, providing
 * perfect TypeScript inference and type-safe database operations throughout
 * the application.
 *
 * ## Core Drizzle Concepts
 *
 * | `Concept` | Description | Benefit |
 * |---------|-------------|---------|
 * | Schema-first | Define tables in TypeScript | Single source of truth |
 * | Type inference | Auto-generate types from schema | No manual type definitions |
 * | SQL-like syntax | Familiar query patterns | Easy learning curve |
 * | Code-first | Schema in code, not SQL | Version controlled, refactorable |
 * | Migration generation | Auto-generate SQL from changes | Database evolution tracking |
 *
 * ## Drizzle vs Other ORMs
 *
 * | Feature | `Drizzle` | `Prisma` | `TypeORM` | Raw SQL |
 * |---------|---------|--------|---------|---------|
 * | Type Safety | `Perfect` | `Good` | `Good` | `None` |
 * | Bundle Size | `~10KB` | `~1MB` | `~500KB` | `0KB` |
 * | Learning Curve | `Low` | `Medium` | `High` | `Medium` |
 * | SQL-like | `Yes` | `No` | `Partial` | `Yes` |
 * | `Performance` | `Excellent` | `Good` | `Good` | `Best` |
 * | `Autocomplete` | `Perfect` | `Good` | `Good` | `None` |
 *
 * ## Why Drizzle with Supabase?
 *
 * **Problem with Supabase Client Alone:**
 * - Type safety isn't perfect for complex queries
 * - JOIN operations can be awkward
 * - TypeScript inference limited for nested queries
 * - No built-in migration system
 *
 * **Solution with Drizzle:**
 * - Perfect TypeScript inference for ALL queries
 * - SQL-like syntax for complex operations
 * - Built-in migration generation
 * - Still use Supabase Auth and Storage
 *
 * **Hybrid Architecture:**
 * ```
 * Supabase Auth → User authentication
 * Supabase Storage → File uploads
 * Supabase Realtime → Live subscriptions
 * Drizzle ORM → All database queries
 * ```
 *
 * ## Schema to SQL Workflow
 *
 * ```typescript
 * // 1. Define schema in TypeScript
 * export const todos = pgTable('todos', {
 *   id: uuid('id').primaryKey(),
 *   title: text('title').notNull()
 * })
 *
 * // 2. Generate migration SQL
 * // Run: npm run db:generate
 * // Creates: drizzle/0001_migration.sql
 *
 * // 3. Apply to database
 * // Run: npm run db:push
 * // Or copy SQL to Supabase SQL Editor
 *
 * // 4. Types automatically available
 * const todos = await db.select().from(todos)
 * // TypeScript knows exact shape!
 * ```
 *
 * CLOSE: Drizzle Type-Safe Database Schema
 */

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * REF: User Profiles Table
 *
 * Extends Supabase Auth users with application-specific profile data.
 *
 * ## Table Structure
 *
 * | Column | Type | Constraints | Description |
 * |--------|------|-------------|-------------|
 * | `id` | `UUID` | `PRIMARY KEY`, `DEFAULT random` | Profile ID |
 * | `user_id` | `UUID` | `NOT NULL`, `UNIQUE` | References `auth.users` |
 * | `display_name` | `TEXT` | `NULL` | User's display name |
 * | `profile_picture` | `TEXT` | `NULL` | URL to profile image |
 * | `created_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT now()` | Profile creation time |
 * | `updated_at` | `TIMESTAMP` | `NOT NULL`, `DEFAULT now()` | Last update time |
 *
 * ## Why Separate Profile Table?
 *
 * **Supabase Auth Schema:**
 * - `auth.users` - Managed by Supabase (email, password, etc.)
 * - Cannot directly modify auth schema
 * - Limited custom fields (user_metadata)
 *
 * **Application Profile:**
 * - `user_profiles` - Our custom table
 * - Full control over fields
 * - Easy to query and update
 * - Links to auth.users via user_id
 *
 * ## Usage Example
 *
 * ```typescript
 * // Create profile after signup
 * await db.insert(userProfiles).values({
 *   userId: authUser.id,
 *   displayName: 'John Doe'
 * })
 *
 * // Query user profile
 * const profile = await db
 *   .select()
 *   .from(userProfiles)
 *   .where(eq(userProfiles.userId, userId))
 *   .limit(1)
 * ```
 *
 * CLOSE: User Profiles Table
 */
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  displayName: text('display_name'),
  profilePicture: text('profile_picture'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * REF: User Settings Table
 *
 * Stores per-user accessibility and appearance preferences.
 *
 * ## Table Structure
 *
 * | Column | Type | Constraints | Default | Description |
 * |--------|------|-------------|---------|-------------|
 * | `id` | `UUID` | `PRIMARY KEY` | `random()` | Settings ID |
 * | `user_id` | `UUID` | `NOT NULL`, `UNIQUE` | `-` | References `auth.users` |
 * | `theme` | `TEXT` | `NOT NULL` | `'light'` | UI theme (`light`/`dark`) |
 * | `font_size` | `TEXT` | `NOT NULL` | `'medium'` | Font size (`small`/`medium`/`large`) |
 * | `high_contrast` | `BOOLEAN` | `NOT NULL` | `false` | High contrast mode |
 * | `reduced_motion` | `BOOLEAN` | `NOT NULL` | `false` | Disable animations |
 * | `updated_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Last update time |
 *
 * ## Drizzle Features Demonstrated
 *
 * **Type-Safe Defaults:**
 * ```typescript
 * theme: text('theme').default('light').notNull()
 * // TypeScript knows: theme is string, never null, defaults to 'light'
 * ```
 *
 * **Constraint Enforcement:**
 * - `notNull()` - Field required
 * - `unique()` - One row per user
 * - `default()` - Automatic value if not provided
 *
 * ## Accessibility Features
 *
 * | Setting | Values | Purpose |
 * |---------|--------|---------|
 * | `theme` | `light`, `dark` | Color scheme preference |
 * | `font_size` | `small`, `medium`, `large` | Text sizing for readability |
 * | `high_contrast` | `true`, `false` | Enhanced contrast for vision |
 * | `reduced_motion` | `true`, `false` | Disable animations for vestibular |
 *
 * ## Usage Example
 *
 * ```typescript
 * // Get user settings
 * const settings = await db
 *   .select()
 *   .from(userSettings)
 *   .where(eq(userSettings.userId, userId))
 *   .limit(1)
 *
 * // Update settings (type-safe!)
 * await db
 *   .update(userSettings)
 *   .set({ theme: 'dark', fontSize: 'large' })
 *   .where(eq(userSettings.userId, userId))
 * ```
 *
 * CLOSE: User Settings Table
 */
export const userSettings = pgTable('user_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  theme: text('theme').default('light').notNull(),
  fontSize: text('font_size').default('medium').notNull(),
  highContrast: boolean('high_contrast').default(false).notNull(),
  reducedMotion: boolean('reduced_motion').default(false).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * REF: Todos Table
 *
 * Main table for storing todo items with full CRUD capabilities.
 *
 * ## Table Structure
 *
 * | Column | Type | Constraints | Default | Description |
 * |--------|------|-------------|---------|-------------|
 * | `id` | `UUID` | `PRIMARY KEY` | `random()` | Todo ID |
 * | `user_id` | `UUID` | `NOT NULL` | `-` | Owner of todo |
 * | `title` | `TEXT` | `NOT NULL` | `-` | Todo title |
 * | `description` | `TEXT` | `NULL` | `-` | Optional description |
 * | `completed` | `BOOLEAN` | `NOT NULL` | `false` | Completion status |
 * | `is_public` | `BOOLEAN` | `NOT NULL` | `false` | Public feed visibility |
 * | `tags` | `TEXT[]` | `NULL` | `-` | Array of tags |
 * | `created_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Creation time |
 * | `updated_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Last update |
 *
 * ## PostgreSQL Array Type
 *
 * **Drizzle Syntax:**
 * ```typescript
 * tags: text('tags').array()
 * ```
 *
 * **Benefits of Arrays:**
 * - Store multiple tags in single column
 * - No separate tags table needed
 * - Efficient with GIN indexes
 * - Native PostgreSQL support
 *
 * **Query Operations:**
 * ```typescript
 * // Check if tag exists
 * sql`${tag} = ANY(${todos.tags})`
 *
 * // Multiple tags (intersection)
 * sql`${todos.tags} && ${arrayOfTags}`
 *
 * // All tags match (containment)
 * sql`${todos.tags} @> ${arrayOfTags}`
 * ```
 *
 * ## Usage Examples
 *
 * ```typescript
 * // Create todo with tags
 * await db.insert(todos).values({
 *   userId,
 *   title: 'Learn Drizzle',
 *   tags: ['typescript', 'database', 'orm']
 * })
 *
 * // Query by tag
 * const tagged = await db
 *   .select()
 *   .from(todos)
 *   .where(sql`'typescript' = ANY(${todos.tags})`)
 *
 * // Public todos only
 * const publicTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.isPublic, true))
 * ```
 *
 * CLOSE: Todos Table
 */
export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

/**
 * REF: Todo Attachments Table
 *
 * Stores metadata for files attached to todos.
 *
 * ## Table Structure
 *
 * | Column | Type | Constraints | Description |
 * |--------|------|-------------|-------------|
 * | `id` | `UUID` | `PRIMARY KEY` | Attachment ID |
 * | `todo_id` | `UUID` | `NOT NULL` | References `todos` table |
 * | `file_name` | `TEXT` | `NOT NULL` | Original filename |
 * | `file_url` | `TEXT` | `NOT NULL` | Supabase Storage URL |
 * | `file_size` | `INTEGER` | `NOT NULL` | Size in bytes |
 * | `mime_type` | `TEXT` | `NOT NULL` | File MIME type |
 * | `uploaded_at` | `TIMESTAMP` | `NOT NULL` | Upload timestamp |
 *
 * ## Cascade Delete Pattern
 *
 * **Database Level:**
 * ```sql
 * ALTER TABLE todo_attachments
 * ADD CONSTRAINT fk_todo
 * FOREIGN KEY (todo_id) REFERENCES todos(id)
 * ON DELETE CASCADE;
 * ```
 *
 * **Benefits:**
 * - When todo deleted, attachments auto-removed from DB
 * - Prevents orphaned records
 * - Data consistency guaranteed
 *
 * **Important:** Must manually delete files from Supabase Storage!
 *
 * ## Complete Delete Flow
 *
 * ```typescript
 * // 1. Get attachments before deleting todo
 * const attachments = await db
 *   .select()
 *   .from(todoAttachments)
 *   .where(eq(todoAttachments.todoId, todoId))
 *
 * // 2. Delete files from Supabase Storage
 * for (const attach of attachments) {
 *   await supabase.storage
 *     .from('attachments')
 *     .remove([attach.fileUrl])
 * }
 *
 * // 3. Delete todo (cascade deletes DB records)
 * await db.delete(todos).where(eq(todos.id, todoId))
 * ```
 *
 * ## Usage with Drizzle Relations
 *
 * ```typescript
 * // Get todo with attachments
 * const todosWithFiles = await db.query.todos.findMany({
 *   with: { attachments: true }
 * })
 *
 * // Access: todosWithFiles[0].attachments[]
 * ```
 *
 * CLOSE: Todo Attachments Table
 */
export const todoAttachments = pgTable('todo_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  todoId: uuid('todo_id').notNull(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

/**
 * REF: Messages Table
 *
 * Real-time messaging system between users.
 *
 * ## Table Structure
 *
 * | Column | Type | Constraints | Default | Description |
 * |--------|------|-------------|---------|-------------|
 * | `id` | `UUID` | `PRIMARY KEY` | `random()` | Message ID |
 * | `sender_id` | `UUID` | `NOT NULL` | `-` | Who sent message |
 * | `recipient_id` | `UUID` | `NOT NULL` | `-` | Who receives message |
 * | `content` | `TEXT` | `NOT NULL` | `-` | Message content |
 * | `read` | `BOOLEAN` | `NOT NULL` | `false` | Read status |
 * | `read_at` | `TIMESTAMP` | `NULL` | `-` | When message was read |
 * | `created_at` | `TIMESTAMP` | `NOT NULL` | `now()` | Send time |
 *
 * ## Message Status Flow
 *
 * **Initial State:**
 * - read: false
 * - read_at: null
 *
 * **After Reading:**
 * ```typescript
 * await db
 *   .update(messages)
 *   .set({ read: true, readAt: new Date() })
 *   .where(eq(messages.id, messageId))
 * ```
 *
 * ## Query Patterns
 *
 * **Get Conversation:**
 * ```typescript
 * const conversation = await db
 *   .select()
 *   .from(messages)
 *   .where(
 *     sql`(sender_id = ${user1} AND recipient_id = ${user2})
 *      OR (sender_id = ${user2} AND recipient_id = ${user1})`
 *   )
 *   .orderBy(messages.createdAt)
 * ```
 *
 * **Unread Count:**
 * ```typescript
 * const unread = await db
 *   .select({ count: sql<number>`count(*)::int` })
 *   .from(messages)
 *   .where(and(
 *     eq(messages.recipientId, userId),
 *     eq(messages.read, false)
 *   ))
 * ```
 *
 * CLOSE: Messages Table
 */
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id').notNull(),
  recipientId: uuid('recipient_id').notNull(),
  content: text('content').notNull(),
  read: boolean('read').default(false).notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * REF: Drizzle Relations
 *
 * Define relationships between tables for type-safe JOIN operations.
 *
 * ## Benefits of Relations
 *
 * | Feature | Without Relations | With Relations |
 * |---------|------------------|----------------|
 * | `Joins` | Manual SQL | `Automatic` |
 * | Type Safety | `Partial` | `Complete` |
 * | Nested Queries | `Complex` | `Simple` |
 * | `Autocomplete` | `Limited` | `Perfect` |
 *
 * ## Usage Comparison
 *
 * **Without Relations (Manual Join):**
 * ```typescript
 * const result = await db
 *   .select()
 *   .from(todos)
 *   .leftJoin(todoAttachments, eq(todos.id, todoAttachments.todoId))
 * // Result: Flat array, manual grouping needed
 * ```
 *
 * **With Relations (Automatic Nested):**
 * ```typescript
 * const todosWithAttachments = await db.query.todos.findMany({
 *   with: { attachments: true }
 * })
 * // Result: Nested structure automatically!
 * // todosWithAttachments[0].attachments[]
 * ```
 *
 * ## Relation Types
 *
 * **One-to-Many (todos → attachments):**
 * - One todo has many attachments
 * - Defined with `many()`
 *
 * **Many-to-One (attachment → todo):**
 * - Each attachment belongs to one todo
 * - Defined with `one()`
 *
 * CLOSE: Drizzle Relations
 */
export const todosRelations = relations(todos, ({ many }) => ({
  attachments: many(todoAttachments),
}))

export const todoAttachmentsRelations = relations(todoAttachments, ({ one }) => ({
  todo: one(todos, {
    fields: [todoAttachments.todoId],
    references: [todos.id],
  }),
}))

/**
 * REF: Drizzle Type Inference
 *
 * Automatic TypeScript type generation from database schema.
 *
 * ## Type Inference APIs
 *
 * | `API` | Purpose | Example Usage |
 * |-----|---------|---------------|
 * | `InferSelectModel` | `SELECT` query types | Reading from database |
 * | `InferInsertModel` | `INSERT` operation types | Creating new records |
 * | `typeof table` | Direct table reference | Generic type operations |
 *
 * ## Usage Examples
 *
 * ```typescript
 * import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
 * import { todos } from './schema'
 *
 * // SELECT type (all fields, including defaults)
 * type Todo = InferSelectModel<typeof todos>
 * // {
 * //   id: string
 * //   userId: string
 * //   title: string
 * //   description: string | null
 * //   completed: boolean
 * //   isPublic: boolean
 * //   tags: string[] | null
 * //   createdAt: Date
 * //   updatedAt: Date
 * // }
 *
 * // INSERT type (required fields only)
 * type NewTodo = InferInsertModel<typeof todos>
 * // {
 * //   userId: string         // required
 * //   title: string          // required
 * //   description?: string   // optional
 * //   completed?: boolean    // optional (has default)
 * //   isPublic?: boolean     // optional (has default)
 * //   tags?: string[]        // optional
 * // }
 * ```
 *
 * ## Benefits
 *
 * **No Manual Definitions:**
 * - Types automatically sync with schema
 * - Change schema, types update instantly
 * - Zero maintenance overhead
 *
 * **Perfect Autocomplete:**
 * - IDE knows all fields
 * - Correct types for each column
 * - Catches typos immediately
 *
 * **Refactoring Safety:**
 * - Rename column → all usages flagged
 * - Change type → compile errors shown
 * - No runtime surprises
 *
 * CLOSE: Drizzle Type Inference
 */

/**
 * REF: Drizzle Query Examples
 *
 * Comprehensive examples of type-safe database operations.
 *
 * ## Basic CRUD Operations
 *
 * **SELECT (Read):**
 * ```typescript
 * // All todos
 * const allTodos = await db.select().from(todos)
 *
 * // With filter
 * const userTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, userId))
 *
 * // With ordering
 * const sorted = await db
 *   .select()
 *   .from(todos)
 *   .orderBy(desc(todos.createdAt))
 *
 * // With limit/offset (pagination)
 * const paginated = await db
 *   .select()
 *   .from(todos)
 *   .limit(20)
 *   .offset(40)
 * ```
 *
 * **INSERT (Create):**
 * ```typescript
 * // Single insert
 * const [newTodo] = await db
 *   .insert(todos)
 *   .values({
 *     userId,
 *     title: 'New todo',
 *     completed: false
 *   })
 *   .returning()
 *
 * // Batch insert
 * const created = await db
 *   .insert(todos)
 *   .values([
 *     { userId, title: 'Todo 1' },
 *     { userId, title: 'Todo 2' },
 *     { userId, title: 'Todo 3' }
 *   ])
 *   .returning()
 * ```
 *
 * **UPDATE (Modify):**
 * ```typescript
 * // Update specific record
 * await db
 *   .update(todos)
 *   .set({ completed: true, updatedAt: new Date() })
 *   .where(eq(todos.id, todoId))
 *
 * // Update with returning
 * const [updated] = await db
 *   .update(todos)
 *   .set({ title: 'Updated title' })
 *   .where(eq(todos.id, todoId))
 *   .returning()
 * ```
 *
 * **DELETE (Remove):**
 * ```typescript
 * // Delete specific record
 * await db
 *   .delete(todos)
 *   .where(eq(todos.id, todoId))
 *
 * // Delete with condition
 * await db
 *   .delete(todos)
 *   .where(and(
 *     eq(todos.userId, userId),
 *     eq(todos.completed, true)
 *   ))
 * ```
 *
 * ## Advanced Queries
 *
 * **JOIN Operations:**
 * ```typescript
 * // Manual join
 * const todosWithAttachments = await db
 *   .select()
 *   .from(todos)
 *   .leftJoin(todoAttachments, eq(todos.id, todoAttachments.todoId))
 *
 * // Relational join
 * const nested = await db.query.todos.findMany({
 *   with: { attachments: true }
 * })
 * ```
 *
 * **Aggregations:**
 * ```typescript
 * // Count
 * const [{ count }] = await db
 *   .select({ count: sql<number>`count(*)::int` })
 *   .from(todos)
 *
 * // Group by
 * const byUser = await db
 *   .select({
 *     userId: todos.userId,
 *     count: sql<number>`count(*)::int`
 *   })
 *   .from(todos)
 *   .groupBy(todos.userId)
 * ```
 *
 * CLOSE: Drizzle Query Examples
 */

/**
 * REF: Database Migrations with Drizzle Kit
 *
 * Schema evolution and version control for your database.
 *
 * ## Migration Workflow
 *
 * | `Step` | `Command` | `Output` | Purpose |
 * |------|---------|--------|---------|
 * | 1. Modify schema | Edit `schema.ts` | `-` | Define changes |
 * | 2. Generate SQL | `npm run db:generate` | `.sql` file | Create migration |
 * | 3. Review SQL | Check `drizzle/` folder | `-` | Verify changes |
 * | 4. Apply migration | `npm run db:push` | Database updated | Deploy changes |
 * | 5. Commit | `git add drizzle/` | `-` | Version control |
 *
 * ## Detailed Steps
 *
 * **1. Generate Migration:**
 * ```bash
 * npm run db:generate
 * #  Creates: drizzle/0001_migration_name.sql
 * #  Creates: drizzle/meta/0001_snapshot.json
 * ```
 *
 * **2. Review Generated SQL:**
 * ```sql
 * -- drizzle/0001_add_tags_column.sql
 * ALTER TABLE todos ADD COLUMN tags TEXT[];
 * CREATE INDEX idx_todos_tags ON todos USING GIN(tags);
 * ```
 *
 * **3. Apply to Database:**
 *
 * Option A - Drizzle Kit:
 * ```bash
 * npm run db:push
 * ```
 *
 * Option B - Supabase Dashboard:
 * 1. Copy SQL from drizzle/ folder
 * 2. Open Supabase SQL Editor
 * 3. Paste and execute
 *
 * ## Migration Best Practices
 *
 * **Always:**
 * - Review generated SQL before applying
 * - Test migrations in development first
 * - Commit migrations to version control
 * - Apply migrations in order (0001, 0002, etc.)
 *
 * **Never:**
 * - Modify applied migration files
 * - Skip migration numbers
 * - Delete meta/ folder
 * - Apply migrations out of order
 *
 * ## Rollback Strategy
 *
 * Drizzle doesn't auto-generate rollbacks. Create manually:
 *
 * ```sql
 * -- Migration: 0002_add_column.sql
 * ALTER TABLE todos ADD COLUMN priority INTEGER;
 *
 * -- Rollback: 0002_rollback.sql (create separately)
 * ALTER TABLE todos DROP COLUMN priority;
 * ```
 *
 * CLOSE: Database Migrations with Drizzle Kit
 */
