/**
 * Drizzle Kit Configuration
 *
 * REF: Drizzle Kit Configuration for Migration Management
 *
 * This file configures Drizzle Kit - the CLI tool that handles database
 * migrations, schema introspection, and the visual database studio.
 *
 * ## Drizzle ORM vs Drizzle Kit
 *
 * | `Aspect` | Drizzle ORM | Drizzle Kit |
 * |--------|-------------|-------------|
 * | Purpose | Runtime database queries | Build-time migrations |
 * | When Used | Application code | Development/deployment |
 * | `Package` | drizzle-orm | drizzle-kit |
 * | `Runs` | In production | In development |
 * | `Output` | Query results | SQL migration files |
 *
 * ## Drizzle Kit Commands
 *
 * | `Command` | `Script` | Purpose | `Output` |
 * |---------|--------|---------|--------|
 * | `generate` | npm run db:generate | Create migration SQL | drizzle/*.sql |
 * | `push` | npm run db:push | Apply to database | Updates DB schema |
 * | `studio` | npm run db:studio | Visual editor | Opens UI at local.drizzle.studio |
 * | `check` | drizzle-kit check | Validate schema | Shows errors/warnings |
 * | `introspect` | drizzle-kit introspect | Reverse engineer | Creates schema from DB |
 *
 * ## Configuration Options
 *
 * **schema:** Path to schema files
 * - Single file: './lib/db/schema.ts'
 * - Multiple files: './lib/db/*.schema.ts'
 * - Glob pattern: './lib/db/**\/*.ts'
 *
 * **out:** Migration output directory
 * - Where to save .sql files
 * - Usually 'drizzle/' or 'migrations/'
 * - Commit to version control
 *
 * **driver:** Database type
 * - 'pg' for PostgreSQL (this project)
 * - 'mysql2' for MySQL
 * - 'better-sqlite3' for SQLite
 * - 'turso' for libSQL
 *
 * **dbCredentials:** Connection details
 * - connectionString for PostgreSQL
 * - host/port/database for others
 * - Uses environment variables
 *
 * CLOSE: Drizzle Kit Configuration for Migration Management
 */

import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

/**
 * REF: Environment Variable Loading
 *
 * Manually load .env.local because Drizzle Kit runs outside Next.js context.
 *
 * ## Why Manual Loading?
 *
 * | `Context` | Env Loading | `Why` |
 * |---------|-------------|-----|
 * | Next.js App | `Automatic` | Built into Next.js |
 * | Drizzle Kit | Manual (dotenv) | Runs as CLI tool, not in Next.js |
 * | This File | `dotenv.config()` | Need DATABASE_URL for migrations |
 *
 * **Without dotenv.config():**
 * - process.env.DATABASE_URL would be undefined
 * - Drizzle Kit commands would fail
 * - No connection to database
 *
 * **With dotenv.config():**
 * - Loads variables from .env.local
 * - Makes DATABASE_URL available
 * - Drizzle Kit can connect to database
 *
 * CLOSE: Environment Variable Loading
 */
dotenv.config({ path: '.env.local' })

/**
 * REF: Drizzle Kit Configuration Object
 *
 * Main configuration for migration generation and database management.
 *
 * ## Configuration Reference
 *
 * | `Option` | Type | `Required` | Description |
 * |--------|------|----------|-------------|
 * | `schema` | `string` | `Yes` | Path to schema files |
 * | `out` | `string` | `Yes` | Migration output directory |
 * | `driver` | `string` | `Yes` | Database driver type |
 * | `dbCredentials` | `object` | `Yes` | Connection details |
 * | `verbose` | `boolean` | `No` | Detailed logging |
 * | `strict` | `boolean` | `No` | Fail on warnings |
 *
 * CLOSE: Drizzle Kit Configuration Object
 */
export default {
  /**
   * REF: Schema Location
   *
   * Path to TypeScript schema definitions.
   *
   * **Single File (this project):**
   * ```typescript
   * schema: './lib/db/schema.ts'
   * ```
   *
   * **Multiple Files:**
   * ```typescript
   * schema: './lib/db/*.schema.ts'
   * ```
   *
   * **Nested Directories:**
   * ```typescript
   * schema: './lib/db/**\/*.ts'
   * ```
   *
   * CLOSE: Schema Location
   */
  schema: './lib/db/schema.ts',

  /**
   * REF: Migration Output Directory
   *
   * Where generated SQL migration files are saved.
   *
   * ## Migration Files Created
   *
   * ```
   * drizzle/
   * ├── 0000_initial_schema.sql
   * ├── 0001_add_messages_table.sql
   * ├── 0002_add_indexes.sql
   * └── meta/
   *     ├── 0000_snapshot.json
   *     ├── 0001_snapshot.json
   *     └── _journal.json
   * ```
   *
   * **Important:**
   * - Apply migrations in numerical order
   * - Commit to version control
   * - Don't modify after applying
   * - meta/ folder tracks migration state
   *
   * CLOSE: Migration Output Directory
   */
  out: './drizzle',

  /**
   * REF: Database Driver
   *
   * Specifies which database type to use.
   *
   * ## Supported Drivers
   *
   * | `Driver` | `Database` | `Package` |
   * |--------|----------|---------|
   * | `pg` | `PostgreSQL` | `postgres` |
   * | `mysql2` | `MySQL` | `mysql2` |
   * | better-sqlite3 | `SQLite` | better-sqlite3 |
   * | `turso` | Turso/libSQL | @libsql/client |
   *
   * **This Project:** PostgreSQL (pg)
   * **Why:** Supabase uses PostgreSQL
   *
   * CLOSE: Database Driver
   */
  driver: 'pg',

  /**
   * REF: Database Credentials
   *
   * Connection details for PostgreSQL database.
   *
   * ## PostgreSQL Connection String Format
   *
   * ```
   * postgresql://[user]:[password]@[host]:[port]/[database]
   * ```
   *
   * ## Supabase Connection String
   *
   * ```
   * postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   * ```
   *
   * **Finding Your Connection String:**
   * 1. Go to Supabase Dashboard
   * 2. Project Settings → Database
   * 3. Connection String → URI
   * 4. Copy and add to .env.local
   *
   * ## Security Best Practices
   *
   * - Store in .env.local (never commit)
   * - Add .env.local to .gitignore
   * - Use different credentials per environment
   * - Rotate passwords regularly
   * - Don't share connection strings
   *
   * CLOSE: Database Credentials
   */
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },

  /**
   * REF: Verbose Logging
   *
   * Enable detailed console output during operations.
   *
   * **When true:**
   * - Shows SQL being generated
   * - Displays connection status
   * - Logs each migration step
   * - Helpful for debugging
   *
   * **When false:**
   * - Minimal output
   * - Only errors shown
   * - Cleaner logs
   *
   * CLOSE: Verbose Logging
   */
  verbose: true,

  /**
   * REF: Strict Mode
   *
   * Fail fast on warnings and potential issues.
   *
   * **When true:**
   * - Warnings become errors
   * - Generation fails on issues
   * - Ensures clean migrations
   * - Good for CI/CD
   *
   * **When false:**
   * - Warnings allowed
   * - Generation continues
   * - More permissive
   *
   * **Recommendation:** Keep true for production
   *
   * CLOSE: Strict Mode
   */
  strict: true,
} satisfies Config

/**
 * REF: Complete Migration Workflow
 *
 * Step-by-step process for evolving your database schema.
 *
 * ## Workflow Steps
 *
 * | `Step` | `Action` | `Command` | `Output` |
 * |------|--------|---------|--------|
 * | `1` | Modify Schema | Edit schema.ts | Updated TypeScript |
 * | `2` | Generate SQL | npm run db:generate | Migration .sql file |
 * | `3` | Review SQL | Open drizzle/*.sql | Verify changes |
 * | `4` | Apply Migration | npm run db:push | Database updated |
 * | `5` | Commit Files | git add/commit | Version controlled |
 *
 * ## Detailed Example
 *
 * **1. Modify Schema:**
 * ```typescript
 * // lib/db/schema.ts
 * export const todos = pgTable('todos', {
 *   id: uuid('id').primaryKey(),
 *   title: text('title').notNull(),
 *   priority: integer('priority').default(0), // NEW FIELD
 * })
 * ```
 *
 * **2. Generate Migration:**
 * ```bash
 * npm run db:generate
 * # Output: Created drizzle/0003_add_priority.sql
 * ```
 *
 * **3. Review Generated SQL:**
 * ```sql
 * -- drizzle/0003_add_priority.sql
 * ALTER TABLE todos ADD COLUMN priority INTEGER DEFAULT 0;
 * ```
 *
 * **4. Apply to Database:**
 * ```bash
 * npm run db:push
 * # Applies all pending migrations
 * ```
 *
 * **5. Commit to Git:**
 * ```bash
 * git add drizzle/0003_add_priority.sql
 * git add drizzle/meta/
 * git commit -m "Add priority field to todos"
 * ```
 *
 * CLOSE: Complete Migration Workflow
 */

/**
 * REF: Drizzle Studio - Visual Database Editor
 *
 * Built-in database admin UI for browsing and editing data.
 *
 * ## Starting Drizzle Studio
 *
 * ```bash
 * npm run db:studio
 * # Opens: https://local.drizzle.studio
 * ```
 *
 * ## Features
 *
 * | Feature | Description | Similar To |
 * |---------|-------------|------------|
 * | Browse Tables | View all tables and columns | `phpMyAdmin` |
 * | Edit Data | Insert, update, delete records | `TablePlus` |
 * | Run Queries | Execute SQL directly | `pgAdmin` |
 * | View Relations | See foreign key relationships | `DataGrip` |
 * | Export Data | Download as JSON/CSV | `DBeaver` |
 * | Generate Queries | Get Drizzle code for operations | `-` |
 *
 * ## Advantages Over Other Tools
 *
 * - **No Installation:** Runs in browser
 * - **Schema Aware:** Knows your Drizzle schema
 * - **Type Safe:** Uses your schema types
 * - **Free:** No license needed
 * - **Integrated:** Part of Drizzle Kit
 *
 * CLOSE: Drizzle Studio - Visual Database Editor
 */

/**
 * REF: Schema Introspection (Reverse Engineering)
 *
 * Generate Drizzle schema from existing database.
 *
 * ## When to Use
 *
 * | `Scenario` | Introspect? | `Why` |
 * |----------|-------------|-----|
 * | Existing database | `Yes` | Start with current schema |
 * | Legacy migration | `Yes` | Convert to Drizzle |
 * | New project | `No` | Write schema directly |
 * | After manual SQL | `Maybe` | Sync schema with DB |
 *
 * ## How to Introspect
 *
 * ```bash
 * drizzle-kit introspect:pg
 * # Generates: lib/db/schema.ts from database
 * ```
 *
 * ## Generated Output
 *
 * Creates TypeScript schema matching your database:
 * ```typescript
 * // Auto-generated from database
 * export const todos = pgTable('todos', {
 *   id: uuid('id').primaryKey(),
 *   title: text('title').notNull(),
 *   // ... all columns from DB
 * })
 * ```
 *
 * CLOSE: Schema Introspection (Reverse Engineering)
 */

/**
 * REF: Comparison with Other Migration Tools
 *
 * How Drizzle Kit compares to alternatives.
 *
 * ## Migration Tools Comparison
 *
 * | Feature | Drizzle Kit | Prisma Migrate | `TypeORM` | `Knex.js` |
 * |---------|-------------|----------------|---------|---------|
 * | Migration Format | `SQL` | Prisma DSL | `TypeScript` | `JavaScript` |
 * | Visual Studio | Yes (built-in) | Yes (separate) | `No` | `No` |
 * | `Introspection` | `Yes` | `Yes` | `Yes` | `No` |
 * | Type Safety | `Perfect` | `Good` | `Good` | `None` |
 * | `Speed` | `Fast` | `Slow` | `Medium` | `Fast` |
 * | Learning Curve | `Low` | `Medium` | `High` | `Low` |
 * | Bundle Size | `Small` | `Large` | `Large` | `Medium` |
 * | SQL Control | `Full` | `Limited` | `Medium` | `Full` |
 *
 * ## Why Choose Drizzle Kit
 *
 * **Best For:**
 * - Perfect TypeScript inference
 * - SQL-first developers
 * - Performance-critical apps
 * - Lightweight bundles
 * - Direct SQL control
 *
 * CLOSE: Comparison with Other Migration Tools
 */

/**
 * REF: Troubleshooting Common Issues
 *
 * Solutions to frequently encountered problems.
 *
 * ## DATABASE_URL Not Found
 *
 * **Error:**
 * ```
 * Error: DATABASE_URL environment variable is required
 * ```
 *
 * **Solutions:**
 * - Verify .env.local exists in project root
 * - Check dotenv.config() path is correct
 * - Ensure variable name is exactly DATABASE_URL
 * - Try: `echo $DATABASE_URL` to verify it loads
 *
 * ## Connection Refused
 *
 * **Error:**
 * ```
 * Error: connect ECONNREFUSED
 * ```
 *
 * **Solutions:**
 * - Verify database is running (Supabase project active)
 * - Check connection string format
 * - Confirm firewall allows connection
 * - Test connection with psql or pgAdmin
 *
 * ## Permission Denied
 *
 * **Error:**
 * ```
 * Error: permission denied for schema public
 * ```
 *
 * **Solutions:**
 * - Use service role key, not anon key
 * - Check user has CREATE/ALTER permissions
 * - Verify user can modify schema
 * - Grant permissions: `GRANT ALL ON SCHEMA public TO user`
 *
 * ## Migration Already Applied
 *
 * **Error:**
 * ```
 * Error: migration 0001 already exists
 * ```
 *
 * **Solutions:**
 * - Check drizzle/meta/_journal.json
 * - Compare with database migration table
 * - May need to manually mark as applied
 * - Don't modify existing migration files
 *
 * CLOSE: Troubleshooting Common Issues
 */
