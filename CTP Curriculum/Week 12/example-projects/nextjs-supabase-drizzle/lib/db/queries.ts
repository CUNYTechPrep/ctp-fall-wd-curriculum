/**
 * REF: queries-file-overview
 *
 * # Drizzle Query Helpers - Type-Safe Database Operations
 *
 * This file contains reusable, type-safe database queries using Drizzle ORM.
 * Each function provides a clean API for common database operations with perfect
 * TypeScript type inference.
 *
 * ## Core Concepts
 *
 * | `Concept` | Description |
 * |---------|-------------|
 * | Type-safe queries | Drizzle provides compile-time type checking for all queries |
 * | Reusable operations | Functions encapsulate common patterns for DRY code |
 * | SQL-like syntax | Familiar query building with TypeScript benefits |
 * | Automatic inference | Return types derived from schema definitions |
 *
 * ## Benefits of Helper Functions
 *
 * - **DRY Principle**: Avoid repeating query logic across your application
 * - **Consistent Error Handling**: Centralized error management
 * - **Easier Testing**: Mock individual query functions
 * - **Single Optimization Point**: Performance improvements benefit all callers
 * - **Type Safety**: TypeScript catches errors before runtime
 *
 * ## File Organization
 *
 * Functions are organized by entity type:
 * 1. Todo Queries - CRUD operations for todos
 * 2. Public Feed Queries - Public todo discovery and search
 * 3. User Settings Queries - User preference management
 * 4. Message Queries - Messaging between users
 * 5. Attachment Queries - File attachment management
 */
// CLOSE: queries-file-overview

/**
 * REF: queries-imports
 *
 * ## Import Dependencies
 *
 * ### Drizzle ORM Operators
 *
 * | `Import` | Purpose | Example Usage |
 * |--------|---------|---------------|
 * | `eq` | Equality comparison | `where(eq(todos.id, '123'))` |
 * | `and` | Logical AND | `where(and(eq(...), eq(...)))` |
 * | `desc` | Descending sort | `orderBy(desc(todos.createdAt))` |
 * | `sql` | Raw SQL expressions | `sql\`count(*)\`` |
 *
 * ### Local Dependencies
 *
 * | `Import` | `Source` | Purpose |
 * |--------|--------|---------|
 * | `db` | `./client` | Drizzle database instance |
 * | `todos` | `./schema` | Todos table schema |
 * | `userSettings` | `./schema` | User settings table schema |
 * | `messages` | `./schema` | Messages table schema |
 * | `todoAttachments` | `./schema` | Attachments table schema |
 */
import { eq, and, desc, sql } from 'drizzle-orm'
import { db } from './client'
import { todos, userSettings, messages, todoAttachments } from './schema'
// CLOSE: queries-imports

/**
 * REF: todo-queries-section
 *
 * ## Todo CRUD Operations
 *
 * Functions for creating, reading, updating, and deleting todos. All functions
 * include proper type safety and handle the common use cases for todo management.
 */
// CLOSE: todo-queries-section

/**
 * REF: get-user-todos
 *
 * ## Get User Todos
 *
 * Retrieves all todos for a specific user, sorted by creation date (newest first).
 *
 * ### Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `userId` | `string` | `Yes` | The authenticated user's unique identifier |
 *
 * ### Returns
 *
 * `Promise<Todo[]>` - Array of todo objects with all fields
 *
 * ### Query Breakdown
 *
 * This function demonstrates the basic Drizzle query pattern:
 *
 * 1. `db.select()` - Initiates a SELECT query (selects all columns by default)
 * 2. `.from(todos)` - Specifies the source table
 * 3. `.where(eq(todos.userId, userId))` - Filters by user ID
 * 4. `.orderBy(desc(todos.createdAt))` - Sorts newest first
 *
 * ### SQL Equivalent
 *
 * ```sql
 * SELECT *
 * FROM todos
 * WHERE user_id = $1
 * ORDER BY created_at DESC
 * ```
 *
 * ### Type Inference
 *
 * Drizzle automatically infers the return type from the schema. No manual type
 * annotations needed! TypeScript knows the exact shape of each todo object.
 *
 * ### Example Usage
 *
 * ```typescript
 * const todos = await getUserTodos('user-123')
 * todos[0].title // TypeScript knows this is a string
 * todos[0].completed // TypeScript knows this is a boolean
 * ```
 */
export async function getUserTodos(userId: string) {
  return await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt))
}
// CLOSE: get-user-todos

/**
 * REF: create-todo
 *
 * ## Create Todo
 *
 * Inserts a new todo into the database and returns the created record with
 * all generated fields (ID, timestamps).
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `data.userId` | `string` | `Yes` | Owner of the todo |
 * | `data.title` | `string` | `Yes` | Todo title/description |
 * | `data.description` | `string` | `No` | Extended description |
 * | `data.isPublic` | `boolean` | `No` | Whether visible in public feed (default: `false`) |
 * | `data.tags` | `string[]` | `No` | Array of tag strings |
 *
 * ## Returns
 *
 * `Promise<Todo>` - The newly created todo object including:
 * - `id` - Auto-generated UUID
 * - `createdAt` - Timestamp of creation
 * - `updatedAt` - Initially same as createdAt
 * - All provided fields
 *
 * ## The RETURNING Clause
 *
 * The `.returning()` method is a PostgreSQL feature that returns the inserted row
 * in a single database round-trip. This is more efficient than:
 *
 * ```typescript
 * // Less efficient approach
 * await db.insert(todos).values(...)
 * const todo = await db.select().from(todos).where(eq(todos.id, id))
 * ```
 *
 * ### SQL Equivalent
 *
 * ```sql
 * INSERT INTO todos (user_id, title, description, is_public, tags, completed)
 * VALUES ($1, $2, $3, $4, $5, false)
 * RETURNING *
 * ```
 *
 * ### Default Values
 *
 * - `completed` is always set to `false` for new todos
 * - `isPublic` defaults to `false` if not provided
 * - Optional fields are set to `null` if not provided
 *
 * ### Example Usage
 *
 * ```typescript
 * const newTodo = await createTodo({
 *   userId: 'user-123',
 *   title: 'Buy groceries',
 *   description: 'Milk, eggs, bread',
 *   isPublic: true,
 *   tags: ['shopping', 'urgent']
 * })
 *
 * console.log(newTodo.id) // Auto-generated UUID
 * console.log(newTodo.completed) // false
 * ```
 */
export async function createTodo(data: {
  userId: string
  title: string
  description?: string
  isPublic?: boolean
  tags?: string[]
}) {
  const [todo] = await db
    .insert(todos)
    .values({
      userId: data.userId,
      title: data.title,
      description: data.description || null,
      isPublic: data.isPublic || false,
      tags: data.tags || null,
      completed: false,
    })
    .returning()

  return todo
}
// CLOSE: create-todo

/**
 * REF: update-todo
 *
 * ## Update Todo
 *
 * Updates one or more fields of an existing todo. Supports partial updates,
 * meaning you only need to provide the fields that changed.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `todoId` | `string` | `Yes` | ID of the todo to update |
 * | `updates.title` | `string` | `No` | New title |
 * | `updates.description` | `string` | `No` | New description |
 * | `updates.completed` | `boolean` | `No` | Completion status |
 * | `updates.isPublic` | `boolean` | `No` | Public visibility |
 * | `updates.tags` | `string[]` | `No` | New tag array |
 *
 * ## Returns
 *
 * `Promise<Todo>` - The updated todo with all fields
 *
 * ### Partial Updates Pattern
 *
 * This function demonstrates the partial update pattern:
 * - Only send fields that changed
 * - Spread operator merges updates with automatic fields
 * - `updatedAt` is always set to current time
 * - Bandwidth efficient - no need to send entire object
 *
 * ### Type Safety Features
 *
 * TypeScript provides compile-time validation:
 * - Field names must match schema
 * - Field types must match schema
 * - Typos caught before runtime
 *
 * ```typescript
 * // TypeScript error - invalid field
 * updateTodo('id', { invalid: true })
 *
 * // TypeScript error - wrong type
 * updateTodo('id', { completed: 'yes' })
 * ```
 *
 * ### SQL Equivalent
 *
 * ```sql
 * UPDATE todos
 * SET title = $1, updated_at = NOW()
 * WHERE id = $2
 * RETURNING *
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * // Update just the completion status
 * await updateTodo('todo-123', { completed: true })
 *
 * // Update multiple fields
 * await updateTodo('todo-123', {
 *   title: 'Updated title',
 *   tags: ['new', 'tags']
 * })
 * ```
 */
export async function updateTodo(
  todoId: string,
  updates: {
    title?: string
    description?: string
    completed?: boolean
    isPublic?: boolean
    tags?: string[]
  }
) {
  const [updated] = await db
    .update(todos)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(todos.id, todoId))
    .returning()

  return updated
}
// CLOSE: update-todo

/**
 * REF: delete-todo
 *
 * ## Delete Todo
 *
 * Permanently removes a todo from the database. Supports cascade deletion
 * for related records.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `todoId` | `string` | `Yes` | ID of the todo to delete |
 *
 * ## Returns
 *
 * `Promise<void>` - No return value
 *
 * ### Cascade Deletion
 *
 * If the database schema includes `ON DELETE CASCADE` for related tables,
 * deleting a todo will automatically:
 * - Delete all todo_attachments for this todo
 * - Remove any other related records
 * - Ensure no orphaned data remains
 *
 * ### SQL Equivalent
 *
 * ```sql
 * DELETE FROM todos WHERE id = $1
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * await deleteTodo('todo-123')
 * // Todo and all attachments are now deleted
 * ```
 */
export async function deleteTodo(todoId: string) {
  await db
    .delete(todos)
    .where(eq(todos.id, todoId))
}
// CLOSE: delete-todo

/**
 * REF: public-feed-queries-section
 *
 * ## Public Feed Queries
 *
 * Functions for discovering and searching public todos. These queries power
 * the public feed feature where users can browse todos marked as public.
 */
// CLOSE: public-feed-queries-section

/**
 * REF: get-public-todos
 *
 * ## Get Public Todos with Pagination
 *
 * Retrieves public todos with pagination support. Returns both the todos and
 * metadata needed for implementing pagination UI.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Default | Description |
 * |------|------|----------|---------|-------------|
 * | `limit` | `number` | `No` | `20` | Number of todos per page |
 * | `offset` | `number` | `No` | `0` | Number of todos to skip |
 *
 * ## Returns
 *
 * ```typescript
 * {
 *   todos: Todo[]      // Array of public todos
 *   total: number      // Total count of public todos
 *   hasMore: boolean   // Whether more pages exist
 * }
 * ```
 *
 * ## Advanced Pattern: Parallel Queries
 *
 * This function demonstrates executing multiple queries in parallel using
 * `Promise.all()`. This is more efficient than sequential queries:
 *
 * ```typescript
 * // Efficient - both queries run simultaneously
 * const [todos, count] = await Promise.all([query1, query2])
 *
 * // Less efficient - queries run one after another
 * const todos = await query1
 * const count = await query2
 * ```
 *
 * ## Count Query Pattern
 *
 * The count query uses PostgreSQL's aggregate function with type casting:
 * - `sql<number>\`count(*)\`` - Raw SQL for counting
 * - `::int` - Cast to integer type
 * - Returns `{ count: number }` object
 *
 * ### Pagination Metadata
 *
 * - `total` - Used to calculate total pages: `Math.ceil(total / limit)`
 * - `hasMore` - Simple check: if we got a full page, there might be more
 *
 * ### SQL Equivalent
 *
 * ```sql
 * -- Todos query
 * SELECT * FROM todos
 * WHERE is_public = true
 * ORDER BY created_at DESC
 * LIMIT 20 OFFSET 0
 *
 * -- Count query
 * SELECT count(*)::int FROM todos
 * WHERE is_public = true
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * // First page
 * const page1 = await getPublicTodos(20, 0)
 *
 * // Second page
 * const page2 = await getPublicTodos(20, 20)
 *
 * // Calculate total pages
 * const totalPages = Math.ceil(page1.total / 20)
 *
 * // Check if "Next" button should be shown
 * const showNext = page1.hasMore
 * ```
 */
export async function getPublicTodos(limit = 20, offset = 0) {
  const [todosData, countData] = await Promise.all([
    // Get todos
    db
      .select()
      .from(todos)
      .where(eq(todos.isPublic, true))
      .orderBy(desc(todos.createdAt))
      .limit(limit)
      .offset(offset),

    // Get total count for pagination
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(todos)
      .where(eq(todos.isPublic, true)),
  ])

  return {
    todos: todosData,
    total: countData[0]?.count || 0,
    hasMore: todosData.length === limit,
  }
}
// CLOSE: get-public-todos

/**
 * REF: search-public-todos
 *
 * ## Search Public Todos
 *
 * Performs full-text search on public todos using PostgreSQL's built-in
 * text search capabilities. Searches both title and description fields.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `searchTerm` | `string` | `Yes` | Search query (words or phrases) |
 *
 * ## Returns
 *
 * `Promise<Todo[]>` - Array of matching todos, sorted by creation date
 *
 * ## PostgreSQL Full-Text Search
 *
 * This function uses PostgreSQL's powerful text search features, which are
 * significantly faster and more flexible than LIKE queries.
 *
 * ### Key Functions
 *
 * | `Function` | Purpose |
 * |----------|---------|
 * | `to_tsvector('english', text)` | Converts text to searchable document vector |
 * | `plainto_tsquery('english', query)` | Converts search term to query format |
 * | `@@` | Match operator for text search |
 * | `COALESCE(description, '')` | Handle null descriptions |
 *
 * ### Why Full-Text Search?
 *
 * ```typescript
 * // SLOW - Must scan entire table
 * WHERE title LIKE '%search%' OR description LIKE '%search%'
 *
 * // FAST - Uses specialized index (GIN or GiST)
 * WHERE to_tsvector(title || ' ' || description) @@ plainto_tsquery('search')
 * ```
 *
 * ## Performance Optimization
 *
 * For best performance, add a GIN index:
 *
 * ```sql
 * CREATE INDEX idx_todos_fts ON todos
 * USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')))
 * ```
 *
 * ### Search Features
 *
 * - Stemming: "running" matches "run", "runs", "ran"
 * - Stop words: Ignores common words like "the", "a", "is"
 * - Language-aware: Uses English dictionary and rules
 * - Multiple words: Searches for all words in query
 *
 * ### SQL Equivalent
 *
 * ```sql
 * SELECT * FROM todos
 * WHERE is_public = true
 *   AND to_tsvector('english', title || ' ' || COALESCE(description, ''))
 *       @@ plainto_tsquery('english', $1)
 * ORDER BY created_at DESC
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * // Search for todos about groceries
 * const results = await searchPublicTodos('grocery shopping')
 *
 * // Finds todos with:
 * // - "Buy groceries"
 * // - "Shopping list"
 * // - "Grocery store run"
 * ```
 */
export async function searchPublicTodos(searchTerm: string) {
  return await db
    .select()
    .from(todos)
    .where(
      and(
        eq(todos.isPublic, true),
        sql`to_tsvector('english', ${todos.title} || ' ' || COALESCE(${todos.description}, '')) @@ plainto_tsquery('english', ${searchTerm})`
      )
    )
    .orderBy(desc(todos.createdAt))
}
// CLOSE: search-public-todos

/**
 * REF: filter-public-todos-by-tag
 *
 * ## Filter Public Todos by Tag
 *
 * Retrieves public todos that include a specific tag. Uses PostgreSQL array
 * operations for efficient filtering.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `tag` | `string` | `Yes` | Tag to filter by |
 *
 * ## Returns
 *
 * `Promise<Todo[]>` - Array of todos containing the tag
 *
 * ## PostgreSQL Array Operations
 *
 * PostgreSQL provides powerful operators for working with array columns:
 *
 * | `Operator` | Purpose | `Example` |
 * |----------|---------|---------|
 * | `= ANY(array)` | Check if value exists in array | `'urgent' = ANY(tags)` |
 * | `&& array` | Check if arrays overlap | `tags && ARRAY['urgent','work']` |
 * | `@> array` | Check if array contains all values | `tags @> ARRAY['urgent']` |
 *
 * ## Performance with GIN Index
 *
 * For optimal performance on array queries, create a GIN index:
 *
 * ```sql
 * CREATE INDEX idx_todos_tags ON todos USING GIN (tags)
 * ```
 *
 * GIN (Generalized Inverted Index) is designed for array and JSONB operations.
 *
 * ### SQL Equivalent
 *
 * ```sql
 * SELECT * FROM todos
 * WHERE is_public = true
 *   AND $1 = ANY(tags)
 * ORDER BY created_at DESC
 * ```
 *
 * ## Advanced Array Queries
 *
 * ```typescript
 * // Multiple tags (any match)
 * sql`tags && ARRAY[${tag1}, ${tag2}]`
 *
 * // All tags must be present
 * sql`tags @> ARRAY[${tag1}, ${tag2}]`
 *
 * // Get array length
 * sql`array_length(tags, 1) > 0`
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * // Find all public todos tagged "urgent"
 * const urgentTodos = await filterPublicTodosByTag('urgent')
 *
 * // Find todos with specific category
 * const workTodos = await filterPublicTodosByTag('work')
 * ```
 */
export async function filterPublicTodosByTag(tag: string) {
  return await db
    .select()
    .from(todos)
    .where(
      and(
        eq(todos.isPublic, true),
        sql`${tag} = ANY(${todos.tags})`
      )
    )
    .orderBy(desc(todos.createdAt))
}
// CLOSE: filter-public-todos-by-tag

/**
 * REF: user-settings-queries-section
 *
 * ## User Settings Queries
 *
 * Functions for managing user preferences and application settings. Each user
 * has a single settings record with preferences for theme, display, and accessibility.
 */
// CLOSE: user-settings-queries-section

/**
 * REF: get-user-settings
 *
 * ## Get User Settings
 *
 * Retrieves the settings record for a specific user. Returns null if no
 * settings exist yet.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `userId` | `string` | `Yes` | User's unique identifier |
 *
 * ## Returns
 *
 * `Promise<UserSettings | null>` - Settings object or null if not found
 *
 * ### Pattern: Single Result from Array
 *
 * Drizzle's `.select()` always returns an array. To get a single result:
 *
 * ```typescript
 * // Get first result or null
 * const result = await db.select().from(table).where(...).limit(1)
 * return result[0] || null
 * ```
 *
 * ### Alternative Patterns
 *
 * | `Pattern` | `Behavior` |
 * |---------|----------|
 * | `result[0] \|\| null` | Returns null if array is empty |
 * | `result[0] ?? null` | Same as above, slightly stricter |
 * | `.limit(1)` | Limits database query to 1 row |
 *
 * ### SQL Equivalent
 *
 * ```sql
 * SELECT * FROM user_settings
 * WHERE user_id = $1
 * LIMIT 1
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * const settings = await getUserSettings('user-123')
 *
 * if (settings) {
 *   console.log(settings.theme) // 'dark' or 'light'
 *   console.log(settings.fontSize) // 'medium', 'large', etc.
 * } else {
 *   // User hasn't set preferences yet, use defaults
 * }
 * ```
 */
export async function getUserSettings(userId: string) {
  const result = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)

  return result[0] || null
}
// CLOSE: get-user-settings

/**
 * REF: update-user-settings
 *
 * ## Update User Settings
 *
 * Updates one or more user preference fields. Supports partial updates.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `userId` | `string` | `Yes` | User whose settings to update |
 * | `updates.theme` | `string` | `No` | Theme preference (e.g., `'light'`, `'dark'`) |
 * | `updates.fontSize` | `string` | `No` | Font size (e.g., `'small'`, `'medium'`, `'large'`) |
 * | `updates.highContrast` | `boolean` | `No` | High contrast mode enabled |
 * | `updates.reducedMotion` | `boolean` | `No` | Reduced motion preference |
 *
 * ## Returns
 *
 * `Promise<UserSettings>` - Updated settings object
 *
 * ## UPSERT Pattern Alternative
 *
 * This function assumes settings already exist. For insert-or-update behavior,
 * use the UPSERT pattern with `onConflictDoUpdate`:
 *
 * ```typescript
 * export async function upsertUserSettings(userId: string, settings: {}) {
 *   const [result] = await db
 *     .insert(userSettings)
 *     .values({
 *       userId,
 *       ...settings,
 *       updatedAt: new Date(),
 *     })
 *     .onConflictDoUpdate({
 *       target: userSettings.userId,
 *       set: {
 *         ...settings,
 *         updatedAt: new Date(),
 *       },
 *     })
 *     .returning()
 *
 *   return result
 * }
 * ```
 *
 * ## When to Use UPSERT
 *
 * | `Scenario` | Best Approach |
 * |----------|---------------|
 * | Settings always exist | Use `UPDATE` (this function) |
 * | Settings may not exist | Use `UPSERT` (`onConflictDoUpdate`) |
 * | First-time setup | Use `INSERT` |
 *
 * ### SQL Equivalent
 *
 * ```sql
 * UPDATE user_settings
 * SET theme = $1, updated_at = NOW()
 * WHERE user_id = $2
 * RETURNING *
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * // Update just the theme
 * await updateUserSettings('user-123', {
 *   theme: 'dark'
 * })
 *
 * // Update multiple preferences
 * await updateUserSettings('user-123', {
 *   fontSize: 'large',
 *   highContrast: true,
 *   reducedMotion: true
 * })
 * ```
 */
export async function updateUserSettings(
  userId: string,
  updates: {
    theme?: string
    fontSize?: string
    highContrast?: boolean
    reducedMotion?: boolean
  }
) {
  const [updated] = await db
    .update(userSettings)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(userSettings.userId, userId))
    .returning()

  return updated
}
// CLOSE: update-user-settings

/**
 * REF: message-queries-section
 *
 * ## Message Queries
 *
 * Functions for managing user-to-user messaging. Includes conversation retrieval,
 * sending messages, read receipts, and unread counts.
 */
// CLOSE: message-queries-section

/**
 * REF: get-conversation
 *
 * ## Get Conversation
 *
 * Retrieves all messages between two users in chronological order. The conversation
 * includes messages in both directions (A→B and B→A).
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `userId` | `string` | `Yes` | Current user's ID |
 * | `otherUserId` | `string` | `Yes` | Other participant's ID |
 *
 * ## Returns
 *
 * `Promise<Message[]>` - All messages between the two users, oldest first
 *
 * ### Complex WHERE Clause
 *
 * This query demonstrates a bidirectional conversation pattern:
 *
 * ```sql
 * WHERE (sender_id = A AND recipient_id = B)
 *    OR (sender_id = B AND recipient_id = A)
 * ```
 *
 * This retrieves messages in both directions, creating a complete conversation thread.
 *
 * ### Raw SQL Pattern
 *
 * When Drizzle's query builder doesn't support complex conditions cleanly,
 * use the `sql` template literal:
 *
 * ```typescript
 * .where(sql`complex condition here`)
 * ```
 *
 * ### Chronological Ordering
 *
 * Messages are ordered by `createdAt` ascending (oldest first), which is typical
 * for chat interfaces where you scroll to see newer messages.
 *
 * ### SQL Equivalent
 *
 * ```sql
 * SELECT * FROM messages
 * WHERE (sender_id = $1 AND recipient_id = $2)
 *    OR (sender_id = $2 AND recipient_id = $1)
 * ORDER BY created_at ASC
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * // Get chat history between two users
 * const conversation = await getConversation('user-123', 'user-456')
 *
 * // Render messages in order
 * conversation.forEach(msg => {
 *   const isMine = msg.senderId === currentUserId
 *   console.log(`${isMine ? 'Me' : 'Them'}: ${msg.content}`)
 * })
 * ```
 */
export async function getConversation(userId: string, otherUserId: string) {
  return await db
    .select()
    .from(messages)
    .where(
      sql`(${messages.senderId} = ${userId} AND ${messages.recipientId} = ${otherUserId})
       OR (${messages.senderId} = ${otherUserId} AND ${messages.recipientId} = ${userId})`
    )
    .orderBy(messages.createdAt)
}
// CLOSE: get-conversation

/**
 * REF: send-message
 *
 * ## Send Message
 *
 * Creates a new message from one user to another.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `senderId` | `string` | `Yes` | User sending the message |
 * | `recipientId` | `string` | `Yes` | User receiving the message |
 * | `content` | `string` | `Yes` | Message text content |
 *
 * ## Returns
 *
 * `Promise<Message>` - The created message with generated ID and timestamp
 *
 * ### Default Values
 *
 * New messages are created with:
 * - `read: false` - Initially unread
 * - `createdAt` - Auto-generated timestamp
 * - `readAt: null` - Set later when message is read
 *
 * ### SQL Equivalent
 *
 * ```sql
 * INSERT INTO messages (sender_id, recipient_id, content, read)
 * VALUES ($1, $2, $3, false)
 * RETURNING *
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * const message = await sendMessage(
 *   'user-123',
 *   'user-456',
 *   'Hello there!'
 * )
 *
 * console.log(message.id) // Auto-generated ID
 * console.log(message.createdAt) // Timestamp
 * console.log(message.read) // false
 * ```
 */
export async function sendMessage(
  senderId: string,
  recipientId: string,
  content: string
) {
  const [message] = await db
    .insert(messages)
    .values({
      senderId,
      recipientId,
      content,
      read: false,
    })
    .returning()

  return message
}
// CLOSE: send-message

/**
 * REF: mark-message-as-read
 *
 * ## Mark Message as Read
 *
 * Updates a message to mark it as read and records the timestamp when it was read.
 * Used for read receipts and "delivered" indicators in chat interfaces.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `messageId` | `string` | `Yes` | ID of message to mark as read |
 *
 * ## Returns
 *
 * `Promise<void>` - No return value
 *
 * ### Read Receipt Pattern
 *
 * This function implements the read receipt pattern by tracking:
 * - `read` boolean - Whether message has been seen
 * - `readAt` timestamp - Exact time it was read
 *
 * ### Use Cases
 *
 * - Show "Read" vs "Delivered" status in UI
 * - Track when messages are seen
 * - Calculate response times
 * - Display "seen at" timestamps
 *
 * ### SQL Equivalent
 *
 * ```sql
 * UPDATE messages
 * SET read = true, read_at = NOW()
 * WHERE id = $1
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * // User opens chat and sees new message
 * await markMessageAsRead('message-789')
 *
 * // Now other user can see "Read" indicator
 * ```
 */
export async function markMessageAsRead(messageId: string) {
  await db
    .update(messages)
    .set({
      read: true,
      readAt: new Date(),
    })
    .where(eq(messages.id, messageId))
}
// CLOSE: mark-message-as-read

/**
 * REF: get-unread-count
 *
 * ## Get Unread Message Count
 *
 * Returns the number of unread messages for a user. Efficient aggregation query
 * that doesn't fetch message content.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `userId` | `string` | `Yes` | User to check unread count for |
 *
 * ## Returns
 *
 * `Promise<number>` - Count of unread messages
 *
 * ### Aggregation Pattern
 *
 * This demonstrates PostgreSQL aggregate functions in Drizzle:
 *
 * ```typescript
 * .select({ count: sql<number>`count(*)::int` })
 * ```
 *
 * ### Why This is Efficient
 *
 * | `Approach` | `Performance` |
 * |----------|-------------|
 * | `SELECT *` then count in JS | Fetches all message data |
 * | `SELECT count(*)` | Database only counts rows |
 * | With `::int` cast | Returns proper number type |
 *
 * ## Common Aggregate Functions
 *
 * ```typescript
 * // Count
 * sql<number>`count(*)`
 *
 * // Sum
 * sql<number>`sum(column_name)`
 *
 * // Average
 * sql<number>`avg(column_name)`
 *
 * // Min/Max
 * sql<number>`min(column_name)`
 * sql<number>`max(column_name)`
 * ```
 *
 * ### SQL Equivalent
 *
 * ```sql
 * SELECT count(*)::int FROM messages
 * WHERE recipient_id = $1
 *   AND read = false
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * const unreadCount = await getUnreadCount('user-123')
 *
 * // Show badge in UI
 * <Badge count={unreadCount} />
 *
 * // Conditionally render
 * {unreadCount > 0 && <NotificationDot />}
 * ```
 */
export async function getUnreadCount(userId: string) {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(messages)
    .where(
      and(
        eq(messages.recipientId, userId),
        eq(messages.read, false)
      )
    )

  return result[0]?.count || 0
}
// CLOSE: get-unread-count

/**
 * REF: attachment-queries-section
 *
 * ## Attachment Queries
 *
 * Functions for managing file attachments associated with todos.
 */
// CLOSE: attachment-queries-section

/**
 * REF: get-todo-attachments
 *
 * ## Get Todo Attachments
 *
 * Retrieves all file attachments for a specific todo, ordered by upload time.
 *
 * ## Parameters
 *
 * | Name | Type | `Required` | Description |
 * |------|------|----------|-------------|
 * | `todoId` | `string` | `Yes` | ID of the todo |
 *
 * ## Returns
 *
 * `Promise<TodoAttachment[]>` - Array of attachment objects
 *
 * ### Attachment Fields
 *
 * Each attachment includes:
 * - `id` - Unique attachment identifier
 * - `todoId` - Parent todo ID
 * - `fileName` - Original filename
 * - `fileUrl` - Storage URL (e.g., from Supabase Storage)
 * - `fileSize` - Size in bytes
 * - `mimeType` - File MIME type (e.g., 'image/png')
 * - `uploadedAt` - Upload timestamp
 *
 * ### SQL Equivalent
 *
 * ```sql
 * SELECT * FROM todo_attachments
 * WHERE todo_id = $1
 * ORDER BY uploaded_at ASC
 * ```
 *
 * ### Example Usage
 *
 * ```typescript
 * const attachments = await getTodoAttachments('todo-123')
 *
 * attachments.forEach(file => {
 *   console.log(`${file.fileName} (${file.fileSize} bytes)`)
 *   console.log(`Download: ${file.fileUrl}`)
 * })
 * ```
 */
export async function getTodoAttachments(todoId: string) {
  return await db
    .select()
    .from(todoAttachments)
    .where(eq(todoAttachments.todoId, todoId))
    .orderBy(todoAttachments.uploadedAt)
}
// CLOSE: get-todo-attachments

/**
 * REF: relational-queries-pattern
 *
 * ## Relational Queries Pattern
 *
 * Drizzle provides a relational query API for fetching related data in a single
 * query with automatic JOIN handling.
 *
 * ## Get Todos with Attachments
 *
 * This pattern demonstrates fetching a todo and all its attachments together:
 *
 * ```typescript
 * export async function getTodosWithAttachments(userId: string) {
 *   return await db.query.todos.findMany({
 *     where: eq(todos.userId, userId),
 *     with: {
 *       attachments: true,
 *     },
 *     orderBy: desc(todos.createdAt),
 *   })
 * }
 * ```
 *
 * ## Nested Result Structure
 *
 * The relational API returns nested objects instead of flat JOIN results:
 *
 * ```typescript
 * [
 *   {
 *     id: 'todo-1',
 *     title: 'Buy groceries',
 *     attachments: [
 *       { id: 'att-1', fileName: 'list.pdf' },
 *       { id: 'att-2', fileName: 'coupon.jpg' }
 *     ]
 *   },
 *   {
 *     id: 'todo-2',
 *     title: 'Book flight',
 *     attachments: [
 *       { id: 'att-3', fileName: 'passport.pdf' }
 *     ]
 *   }
 * ]
 * ```
 *
 * ## Benefits
 *
 * | Feature | Benefit |
 * |---------|---------|
 * | Automatic JOINs | No manual JOIN syntax needed |
 * | Type-safe | Full TypeScript inference for nested objects |
 * | N+1 Prevention | Single query instead of multiple |
 * | Clean structure | Nested data matches domain model |
 *
 * ## Advanced Relational Patterns
 *
 * ```typescript
 * // Multiple levels of nesting
 * db.query.users.findMany({
 *   with: {
 *     todos: {
 *       with: {
 *         attachments: true
 *       }
 *     }
 *   }
 * })
 *
 * // Filtered relations
 * db.query.todos.findMany({
 *   with: {
 *     attachments: {
 *       where: eq(todoAttachments.mimeType, 'image/png')
 *     }
 *   }
 * })
 * ```
 *
 * ### SQL Equivalent
 *
 * Drizzle handles the JOIN automatically:
 *
 * ```sql
 * SELECT t.*, a.*
 * FROM todos t
 * LEFT JOIN todo_attachments a ON t.id = a.todo_id
 * WHERE t.user_id = $1
 * ORDER BY t.created_at DESC
 * ```
 */
// CLOSE: relational-queries-pattern

/**
 * REF: transactions-pattern
 *
 * ## Database Transactions
 *
 * Transactions ensure multiple database operations succeed or fail together,
 * maintaining data consistency.
 *
 * ## Create Todo with Attachments
 *
 * This pattern demonstrates atomic creation of a todo and its attachments:
 *
 * ```typescript
 * export async function createTodoWithAttachments(
 *   userId: string,
 *   title: string,
 *   files: FileData[]
 * ) {
 *   return await db.transaction(async (tx) => {
 *     // Create todo
 *     const [todo] = await tx
 *       .insert(todos)
 *       .values({ userId, title })
 *       .returning()
 *
 *     // Create attachments
 *     await tx
 *       .insert(todoAttachments)
 *       .values(files.map(f => ({
 *         todoId: todo.id,
 *         fileName: f.name,
 *         fileUrl: f.url,
 *         fileSize: f.size,
 *         mimeType: f.type,
 *       })))
 *
 *     return todo
 *   })
 * }
 * ```
 *
 * ## Transaction Guarantees
 *
 * | `Scenario` | `Result` |
 * |----------|--------|
 * | All operations succeed | All changes committed |
 * | Any operation fails | All changes rolled back |
 * | Network error | All changes rolled back |
 * | Exception thrown | All changes rolled back |
 *
 * ## ACID Properties
 *
 * Transactions provide ACID guarantees:
 * - **Atomicity**: All or nothing
 * - **Consistency**: Database stays valid
 * - **Isolation**: Concurrent transactions don't interfere
 * - **Durability**: Committed changes persist
 *
 * ### Use Cases
 *
 * Use transactions when you need:
 * - Creating parent and child records together
 * - Transferring between accounts (debit + credit)
 * - Complex multi-table updates
 * - Ensuring data integrity across operations
 *
 * ## Transaction Error Handling
 *
 * ```typescript
 * try {
 *   const result = await db.transaction(async (tx) => {
 *     // Operations here
 *   })
 *   return result
 * } catch (error) {
 *   // Transaction was rolled back
 *   console.error('Transaction failed:', error)
 *   throw error
 * }
 * ```
 */
// CLOSE: transactions-pattern

/**
 * REF: performance-optimization-tips
 *
 * ## Performance Optimization Tips
 *
 * Best practices for writing efficient Drizzle queries.
 *
 * ## 1. Select Only Needed Columns
 *
 * Reduce data transfer by selecting specific columns:
 *
 * ```typescript
 * // Instead of SELECT *
 * db.select().from(todos)
 *
 * // Select only what you need
 * db.select({
 *   id: todos.id,
 *   title: todos.title,
 * }).from(todos)
 * ```
 *
 * ## 2. Use Database Indexes
 *
 * Add indexes for frequently queried columns:
 *
 * ```sql
 * -- Single column index
 * CREATE INDEX idx_todos_user ON todos(user_id);
 *
 * -- Composite index for common query
 * CREATE INDEX idx_todos_user_created
 * ON todos(user_id, created_at DESC);
 *
 * -- Full-text search index
 * CREATE INDEX idx_todos_fts ON todos
 * USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));
 *
 * -- Array operations index
 * CREATE INDEX idx_todos_tags ON todos USING GIN (tags);
 * ```
 *
 * ## 3. Batch Operations
 *
 * Insert/update multiple records in one query:
 *
 * ```typescript
 * // Instead of multiple inserts
 * for (const todo of todos) {
 *   await db.insert(todos).values(todo)
 * }
 *
 * // Batch insert
 * await db.insert(todos).values([todo1, todo2, todo3])
 * ```
 *
 * ## 4. Use Prepared Statements
 *
 * Reuse query plans for repeated queries:
 *
 * ```typescript
 * // Prepare once
 * const getUserTodosPrepared = db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, sql.placeholder('userId')))
 *   .prepare()
 *
 * // Execute multiple times efficiently
 * const user1Todos = await getUserTodosPrepared.execute({ userId: 'user-1' })
 * const user2Todos = await getUserTodosPrepared.execute({ userId: 'user-2' })
 * ```
 *
 * ## 5. Use Pagination
 *
 * Limit result sets for large tables:
 *
 * ```typescript
 * const PAGE_SIZE = 20
 * const page = 1
 *
 * db.select()
 *   .from(todos)
 *   .limit(PAGE_SIZE)
 *   .offset((page - 1) * PAGE_SIZE)
 * ```
 *
 * ## 6. Optimize Aggregations
 *
 * Use database aggregations instead of fetching all data:
 *
 * ```typescript
 * // Inefficient
 * const todos = await db.select().from(todos)
 * const count = todos.length
 *
 * // Efficient
 * const [{ count }] = await db
 *   .select({ count: sql<number>`count(*)` })
 *   .from(todos)
 * ```
 */
// CLOSE: performance-optimization-tips

/**
 * REF: debugging-queries
 *
 * ## Debugging Queries
 *
 * Tools and techniques for understanding and debugging Drizzle queries.
 *
 * ## View Generated SQL
 *
 * See exactly what SQL Drizzle generates:
 *
 * ```typescript
 * const query = db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, 'user-123'))
 *   .toSQL()
 *
 * console.log(query.sql)
 * // Output: SELECT * FROM todos WHERE user_id = $1
 *
 * console.log(query.params)
 * // Output: ['user-123']
 * ```
 *
 * ## Enable Query Logging
 *
 * Log all queries during development:
 *
 * ```typescript
 * import { drizzle } from 'drizzle-orm/postgres-js'
 * import postgres from 'postgres'
 *
 * const client = postgres(connectionString)
 * const db = drizzle(client, {
 *   schema,
 *   logger: true  // Enables logging
 * })
 * ```
 *
 * ## Custom Logger
 *
 * Implement custom logging logic:
 *
 * ```typescript
 * const db = drizzle(client, {
 *   schema,
 *   logger: {
 *     logQuery(query: string, params: unknown[]) {
 *       console.log('Query:', query)
 *       console.log('Params:', params)
 *       console.log('Time:', Date.now())
 *     }
 *   }
 * })
 * ```
 *
 * ## Explain Query Plans
 *
 * Analyze query performance with EXPLAIN:
 *
 * ```typescript
 * const result = await db.execute(sql`
 *   EXPLAIN ANALYZE
 *   SELECT * FROM todos WHERE user_id = ${'user-123'}
 * `)
 * console.log(result)
 * ```
 *
 * ## Common Debug Scenarios
 *
 * | `Issue` | `Solution` |
 * |-------|----------|
 * | Slow query | Use `EXPLAIN` to check index usage |
 * | Wrong results | Log SQL and verify `WHERE` clause |
 * | Type errors | Check schema matches database |
 * | Missing data | Verify JOINs and relations |
 */
// CLOSE: debugging-queries
