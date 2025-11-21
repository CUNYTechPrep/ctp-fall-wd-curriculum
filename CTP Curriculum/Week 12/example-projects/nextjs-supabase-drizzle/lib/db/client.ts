/**
 * REF: client-file-overview
 *
 * # Drizzle Client Configuration
 *
 * This file initializes the Drizzle ORM instance with a PostgreSQL connection.
 * It serves as the central database client for the entire application.
 *
 * ## Architecture Overview
 *
 * | `Component` | Purpose | Handled By |
 * |-----------|---------|------------|
 * | Database queries | Type-safe data operations | Drizzle ORM (this file) |
 * | User authentication | Sign in/out, sessions | Supabase Auth |
 * | File storage | Upload/download files | Supabase Storage |
 * | Real-time subscriptions | Live data updates | Supabase Realtime |
 *
 * ## Why Drizzle ORM?
 *
 * ### Benefits Over Other ORMs
 *
 * | Feature | `Drizzle` | `Prisma` | `TypeORM` |
 * |---------|---------|--------|---------|
 * | TypeScript Inference | `Perfect` | `Good` | `Fair` |
 * | SQL-like Syntax | `Yes` | `No` | `No` |
 * | Bundle Size | < 10KB | ~20KB | `Large` |
 * | Code Generation | `No` | `Yes` | `Yes` |
 * | Full SQL Support | `Yes` | `Limited` | `Limited` |
 * | `Performance` | `Excellent` | `Good` | `Good` |
 *
 * ## Hybrid Architecture Benefits
 *
 * ### Why Use Both Drizzle and Supabase Client?
 *
 * - **Drizzle**: Perfect for complex queries, joins, type safety
 * - **Supabase Client**: Proven auth system, easy file storage
 * - **Best of Both Worlds**: Type-safe DB + managed services
 *
 * ## File Structure
 *
 * ```
 * lib/db/
 * ├── client.ts    ← This file - Database connection
 * ├── schema.ts    ← Table definitions
 * └── queries.ts   ← Query functions
 * ```
 */
// CLOSE: client-file-overview

/**
 * REF: client-imports
 *
 * ## Import Dependencies
 *
 * ## Drizzle ORM Packages
 *
 * | `Import` | `Package` | Purpose |
 * |--------|---------|---------|
 * | `drizzle` | drizzle-orm/postgres-js | Creates Drizzle instance |
 * | `postgres` | `postgres` | PostgreSQL client library |
 * | `* as schema` | ./schema | Table schema definitions |
 *
 * ## Why postgres.js?
 *
 * - Lightweight and fast PostgreSQL client
 * - Connection pooling built-in
 * - Works in Node.js and serverless environments
 * - Compatible with Supabase PostgreSQL
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
// CLOSE: client-imports

/**
 * REF: database-connection-string
 *
 * ## Database Connection String
 *
 * The DATABASE_URL environment variable contains the PostgreSQL connection string
 * with authentication credentials and server information.
 *
 * ### Connection String Format
 *
 * ```
 * postgresql://[user]:[password]@[host]:[port]/[database]?[options]
 * ```
 *
 * ### Supabase Connection String Format
 *
 * ```
 * postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
 * ```
 *
 * ### Components Explained
 *
 * | `Component` | `Example` | Description |
 * |-----------|---------|-------------|
 * | `Protocol` | `postgresql://` | Database type |
 * | `User` | `postgres` | Database username (default for Supabase) |
 * | `Password` | `[YOUR_PASSWORD]` | From Supabase dashboard |
 * | `Host` | `db.[PROJECT_REF].supabase.co` | Supabase database server |
 * | `Port` | `5432` | PostgreSQL default port |
 * | `Database` | `postgres` | Database name |
 *
 * ## Finding Your Supabase Connection String
 *
 * 1. Go to Supabase Dashboard
 * 2. Select your project
 * 3. Navigate to Settings → Database
 * 4. Find "Connection string" section
 * 5. Choose "URI" tab
 * 6. Copy the connection string
 * 7. Replace `[YOUR-PASSWORD]` with your actual password
 *
 * ## Security Best Practices
 *
 * | `Practice` | Why Important |
 * |----------|---------------|
 * | Never commit to git | Prevents credential leaks |
 * | Use environment variables | Separates config from code |
 * | Rotate passwords regularly | Limits exposure if compromised |
 * | Use .env.local | Keeps secrets out of repository |
 * | Different creds per environment | Isolates prod from dev |
 *
 * ## Environment Variable Setup
 *
 * Create `.env.local` in project root:
 *
 * ```bash
 * DATABASE_URL="postgresql://postgres:password@db.project.supabase.co:5432/postgres"
 * ```
 *
 * ## Connection String Validation
 *
 * This validation ensures the environment variable is set before the app starts,
 * preventing runtime errors from missing configuration.
 */
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const connectionString = process.env.DATABASE_URL
// CLOSE: database-connection-string

/**
 * REF: postgres-client-configuration
 *
 * ## PostgreSQL Client Configuration
 *
 * Creates a postgres.js client with a connection pool for efficient database access.
 *
 * ## Connection Pooling
 *
 * Connection pooling reuses database connections instead of creating new ones
 * for each query, dramatically improving performance.
 *
 * ### How Connection Pooling Works
 *
 * ```
 * Request 1 ──→ [Pool] ──→ Connection A ──→ Database
 * Request 2 ──→ [Pool] ──→ Connection B ──→ Database
 * Request 3 ──→ [Pool] ──→ (waits) ──→ Connection A ──→ Database
 * ```
 *
 * ### Configuration Options
 *
 * | `Option` | Default | Purpose |
 * |--------|---------|---------|
 * | `prepare` | `true` | Enable prepared statements (must be false for Supabase) |
 * | `max` | `10` | Maximum connections in pool |
 * | `idle_timeout` | `0` | Seconds before closing idle connections |
 * | `connect_timeout` | `30` | Seconds to wait for connection |
 *
 * ## Why prepare: false?
 *
 * Supabase uses **Transaction Pooling Mode** by default:
 *
 * | Pool Mode | Prepared Statements | Connection Limit | Best For |
 * |-----------|-------------------|------------------|----------|
 * | `Transaction` | `No` | High (unlimited) | Serverless, high traffic |
 * | `Session` | `Yes` | Low (~60) | Traditional servers |
 *
 * ### Transaction vs Session Mode
 *
 * **Transaction Mode** (Supabase default):
 * - Connection assigned per transaction
 * - No prepared statements
 * - Supports many concurrent connections
 * - Perfect for serverless/edge functions
 *
 * **Session Mode**:
 * - Connection assigned for entire session
 * - Prepared statements supported
 * - Limited concurrent connections
 * - Better for long-running processes
 *
 * ## Additional Configuration Options
 *
 * ```typescript
 * const client = postgres(connectionString, {
 *   prepare: false,           // Required for Supabase
 *   max: 20,                  // Increase pool size
 *   idle_timeout: 20,         // Close idle after 20s
 *   connect_timeout: 10,      // Fail after 10s
 *   ssl: 'require',           // Enforce SSL
 *   onnotice: () => {},       // Suppress notices
 * })
 * ```
 *
 * ## Example Usage
 *
 * The client is used internally by Drizzle but can also execute raw SQL:
 *
 * ```typescript
 * // Raw query (if needed)
 * const result = await client`SELECT * FROM todos WHERE id = ${todoId}`
 * ```
 */
const client = postgres(connectionString, { prepare: false })
// CLOSE: postgres-client-configuration

/**
 * REF: drizzle-instance
 *
 * ## Drizzle ORM Instance
 *
 * Creates the main Drizzle database instance that provides type-safe query builders
 * and automatic type inference from the schema.
 *
 * ### Initialization Parameters
 *
 * | Parameter | Type | Purpose |
 * |-----------|------|---------|
 * | `client` | PostgreSQL client | Connection to database |
 * | `schema` | Schema object | Table definitions for type inference |
 *
 * ## The Magic of Drizzle
 *
 * Drizzle provides several "magical" features that make development easier:
 *
 * ### 1. Automatic Type Inference
 *
 * No manual type annotations needed:
 *
 * ```typescript
 * // Drizzle automatically knows the return type!
 * const todos = await db.select().from(todos)
 * // TypeScript knows: Todo[]
 *
 * todos[0].title   // ✅ TypeScript knows this is a string
 * todos[0].fake    // ❌ TypeScript error - property doesn't exist
 * ```
 *
 * ### 2. Perfect Autocomplete
 *
 * Your IDE provides intelligent suggestions:
 *
 * ```typescript
 * db.select().from(todos).where(eq(todos.   // IDE suggests all column names
 * ```
 *
 * ### 3. Compile-Time Type Checking
 *
 * Errors caught before running code:
 *
 * ```typescript
 * // ❌ TypeScript error - completed is boolean, not string
 * db.update(todos).set({ completed: 'yes' })
 *
 * // ✅ Correct
 * db.update(todos).set({ completed: true })
 * ```
 *
 * ### 4. No Code Generation
 *
 * Unlike Prisma, Drizzle doesn't require a separate generation step:
 *
 * | `ORM` | `Workflow` |
 * |-----|----------|
 * | `Prisma` | Edit schema → Generate → Use |
 * | `Drizzle` | Edit schema → Use immediately |
 *
 * ## Schema Integration
 *
 * By passing the schema to Drizzle, we enable:
 * - Relational queries with `.query` API
 * - Type inference for all tables
 * - Automatic JOIN generation
 * - Nested data fetching
 *
 * ## Usage Examples
 *
 * ```typescript
 * // Import the db instance
 * import { db } from '@/lib/db/client'
 * import { todos } from '@/lib/db/schema'
 * import { eq } from 'drizzle-orm'
 *
 * // Simple query
 * const allTodos = await db.select().from(todos)
 *
 * // Filtered query
 * const userTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, userId))
 *
 * // Insert with returning
 * const [newTodo] = await db
 *   .insert(todos)
 *   .values({ userId, title: 'New todo' })
 *   .returning()
 *
 * // Relational query
 * const todosWithAttachments = await db.query.todos.findMany({
 *   with: { attachments: true }
 * })
 * ```
 */
export const db = drizzle(client, { schema })
// CLOSE: drizzle-instance

/**
 * REF: query-builder-examples
 *
 * ## Query Builder Examples
 *
 * Comprehensive examples of common database operations using Drizzle's query builder.
 *
 * ### SELECT Queries
 *
 * ```typescript
 * import { db } from './client'
 * import { todos } from './schema'
 * import { eq, and, desc } from 'drizzle-orm'
 *
 * // Simple SELECT
 * const allTodos = await db.select().from(todos)
 *
 * // With WHERE clause
 * const userTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, userId))
 *
 * // With multiple conditions
 * const completedUserTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(and(
 *     eq(todos.userId, userId),
 *     eq(todos.completed, true)
 *   ))
 *
 * // With ORDER BY
 * const sortedTodos = await db
 *   .select()
 *   .from(todos)
 *   .where(eq(todos.userId, userId))
 *   .orderBy(desc(todos.createdAt))
 * ```
 *
 * ### INSERT Queries
 *
 * ```typescript
 * // Insert single record
 * const [newTodo] = await db
 *   .insert(todos)
 *   .values({
 *     userId,
 *     title: 'New todo',
 *     completed: false,
 *   })
 *   .returning()
 *
 * // Insert multiple records
 * const newTodos = await db
 *   .insert(todos)
 *   .values([
 *     { userId, title: 'Todo 1' },
 *     { userId, title: 'Todo 2' },
 *   ])
 *   .returning()
 * ```
 *
 * ### UPDATE Queries
 *
 * ```typescript
 * // Update single record
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
 * ### DELETE Queries
 *
 * ```typescript
 * // Delete single record
 * await db
 *   .delete(todos)
 *   .where(eq(todos.id, todoId))
 *
 * // Delete multiple records
 * await db
 *   .delete(todos)
 *   .where(eq(todos.userId, userId))
 * ```
 *
 * ### JOIN Queries
 *
 * ```typescript
 * import { todoAttachments } from './schema'
 *
 * // LEFT JOIN
 * const todosWithAttachments = await db
 *   .select({
 *     todo: todos,
 *     attachment: todoAttachments,
 *   })
 *   .from(todos)
 *   .leftJoin(todoAttachments, eq(todos.id, todoAttachments.todoId))
 *   .where(eq(todos.userId, userId))
 * ```
 */
// CLOSE: query-builder-examples

/**
 * REF: relational-queries-api
 *
 * ## Relational Queries API
 *
 * Drizzle's relational API provides a cleaner way to fetch related data without
 * writing explicit JOINs.
 *
 * ### Basic Relational Query
 *
 * ```typescript
 * // Get todos with their attachments
 * const todosWithAttachments = await db.query.todos.findMany({
 *   where: eq(todos.userId, userId),
 *   with: {
 *     attachments: true,
 *   },
 * })
 * ```
 *
 * ### Nested Relations
 *
 * ```typescript
 * // Multiple levels of nesting
 * const users = await db.query.users.findMany({
 *   with: {
 *     todos: {
 *       with: {
 *         attachments: true
 *       }
 *     }
 *   }
 * })
 * ```
 *
 * ### Filtering Relations
 *
 * ```typescript
 * // Get todos with only image attachments
 * const todos = await db.query.todos.findMany({
 *   with: {
 *     attachments: {
 *       where: sql`mime_type LIKE 'image/%'`
 *     }
 *   }
 * })
 * ```
 *
 * ### Benefits
 *
 * - No manual JOIN syntax
 * - Automatic type inference for nested objects
 * - Cleaner, more readable code
 * - Prevents N+1 query problems
 */
// CLOSE: relational-queries-api

/**
 * REF: transactions-overview
 *
 * ## Database Transactions
 *
 * Transactions ensure data consistency by making multiple operations atomic.
 *
 * ### Basic Transaction
 *
 * ```typescript
 * await db.transaction(async (tx) => {
 *   const [todo] = await tx
 *     .insert(todos)
 *     .values({ userId, title })
 *     .returning()
 *
 *   await tx
 *     .insert(todoAttachments)
 *     .values({ todoId: todo.id, fileName, fileUrl })
 *
 *   // If ANY operation fails, ALL operations are rolled back
 * })
 * ```
 *
 * ### Error Handling in Transactions
 *
 * ```typescript
 * try {
 *   const result = await db.transaction(async (tx) => {
 *     // Your operations
 *     return someValue
 *   })
 * } catch (error) {
 *   // Transaction was automatically rolled back
 *   console.error('Transaction failed:', error)
 * }
 * ```
 *
 * See queries.ts for more transaction examples.
 */
// CLOSE: transactions-overview

/**
 * REF: raw-sql-execution
 *
 * ## Raw SQL Execution
 *
 * For complex queries not supported by the query builder, use raw SQL.
 *
 * ### Using sql Template
 *
 * ```typescript
 * import { sql } from 'drizzle-orm'
 *
 * // Full-text search
 * const results = await db.execute(sql`
 *   SELECT *
 *   FROM todos
 *   WHERE to_tsvector('english', title) @@ plainto_tsquery('english', ${searchTerm})
 * `)
 *
 * // Complex aggregations
 * const stats = await db.execute(sql`
 *   SELECT
 *     user_id,
 *     COUNT(*) as total_todos,
 *     SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_count
 *   FROM todos
 *   GROUP BY user_id
 * `)
 * ```
 *
 * ### When to Use Raw SQL
 *
 * - PostgreSQL-specific features (full-text search, JSON operators)
 * - Complex aggregations
 * - Window functions
 * - CTEs (Common Table Expressions)
 * - Performance-critical queries requiring specific optimization
 */
// CLOSE: raw-sql-execution

/**
 * REF: migrations-workflow
 *
 * ## Migrations Workflow
 *
 * Drizzle Kit generates and manages database migrations based on schema changes.
 *
 * ### Generate Migration
 *
 * ```bash
 * npm run db:generate
 * ```
 *
 * This creates SQL files in the `drizzle/` folder based on schema changes.
 *
 * ### Push to Database
 *
 * ```bash
 * npm run db:push
 * ```
 *
 * Applies migrations directly to the database (dev/prototyping).
 *
 * ### Apply Migrations to Supabase
 *
 * 1. Generate migration with `npm run db:generate`
 * 2. Copy SQL from `drizzle/` folder
 * 3. Paste into Supabase SQL Editor
 * 4. Run the migration
 *
 * ### Migration Best Practices
 *
 * - Always review generated SQL before applying
 * - Test migrations on staging environment first
 * - Keep migrations in version control
 * - Never edit applied migrations
 * - Create new migration for changes
 */
// CLOSE: migrations-workflow

/**
 * REF: performance-characteristics
 *
 * ## Performance Characteristics
 *
 * Drizzle is designed for optimal performance with minimal overhead.
 *
 * ### Performance Features
 *
 * | Feature | Benefit |
 * |---------|---------|
 * | No N+1 queries | Relational API uses JOINs |
 * | Efficient SQL generation | Only fetches needed data |
 * | Connection pooling | Reuses connections |
 * | Prepared statements | When supported by pool mode |
 * | Minimal runtime | Small bundle size |
 *
 * ### Benchmarks
 *
 * Compared to other ORMs:
 * - **vs Prisma**: ~2x faster queries
 * - **vs TypeORM**: Similar or better performance
 * - **vs Raw SQL**: < 1% overhead
 *
 * ### Optimization Tips
 *
 * See queries.ts performance-optimization-tips section for detailed guidance.
 */
// CLOSE: performance-characteristics

/**
 * REF: debugging-tools
 *
 * ## Debugging Tools
 *
 * Tools for inspecting generated SQL and diagnosing issues.
 *
 * ### View Generated SQL
 *
 * ```typescript
 * const query = db.select().from(todos).toSQL()
 * console.log(query.sql)    // SELECT * FROM todos
 * console.log(query.params) // []
 * ```
 *
 * ### Enable Query Logging
 *
 * ```typescript
 * const db = drizzle(client, {
 *   schema,
 *   logger: true  // Logs all queries to console
 * })
 * ```
 *
 * See queries.ts debugging-queries section for more tools.
 */
// CLOSE: debugging-tools

/**
 * REF: supabase-auth-integration
 *
 * ## Supabase Auth Integration
 *
 * Important considerations when using Drizzle with Supabase authentication.
 *
 * ## Row Level Security (RLS)
 *
 * **Critical**: Drizzle does NOT automatically enforce Supabase Row Level Security!
 *
 * ### Security Options
 *
 * ### Option 1: Service Role Key (Server-side only)
 *
 * ```typescript
 * // Uses DATABASE_URL with service role credentials
 * // Bypasses RLS - YOU must enforce security in code
 * // NEVER expose service role key to client!
 * ```
 *
 * ### Option 2: Supabase Client with RLS
 *
 * ```typescript
 * // Use Supabase client for RLS-protected operations
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *   .eq('user_id', userId)
 * ```
 *
 * ### Option 3: Hybrid Approach (Recommended)
 *
 * | `Operation` | `Use` | `Why` |
 * |-----------|-----|-----|
 * | Complex queries | `Drizzle` | Type safety, joins, complex logic |
 * | User-specific data | Supabase Client | RLS enforced automatically |
 * | Server actions | `Drizzle` | Full control, type safety |
 * | Client components | Supabase Client | RLS protection |
 *
 * ### Best Practices
 *
 * 1. Use Drizzle in server-side code only
 * 2. Always validate user authentication
 * 3. Manually check user ownership in queries
 * 4. Use Supabase client for RLS when appropriate
 * 5. Never send service role credentials to client
 */
// CLOSE: supabase-auth-integration

/**
 * REF: exports
 *
 * ## Module Exports
 *
 * Export the database instance for use throughout the application.
 */
export default db
// CLOSE: exports
