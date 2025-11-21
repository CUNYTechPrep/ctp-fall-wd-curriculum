# Next.js + Supabase + Drizzle - Learning Guide

## 🎯 Project Overview

Type-safe full-stack application combining Supabase Auth/Storage with Drizzle ORM for perfect TypeScript inference.

## 🔑 Key Features & Implementation Details

### Cross-Cutting Concerns

**Authentication:**
- Implementation: Supabase Auth
- Location: [`lib/supabase/client.ts`](/docs/nextjs-supabase-drizzle/lib/supabase/client.ts), [`contexts/AuthContext.tsx`](/docs/nextjs-supabase-drizzle/contexts/AuthContext.tsx)
- Pattern: Supabase for auth, Drizzle for database
- Features: Email/password, session management, hybrid approach

**Database:**
- Implementation: **Drizzle ORM with PostgreSQL**
- Schema: [`lib/db/schema.ts`](/docs/nextjs-supabase-drizzle/lib/db/schema.ts)
- Client: [`lib/db/client.ts`](/docs/nextjs-supabase-drizzle/lib/db/client.ts)
- Queries: [`lib/db/queries.ts`](/docs/nextjs-supabase-drizzle/lib/db/queries.ts)
- Pattern: Type-safe, SQL-like query builder
- Features: Perfect TypeScript inference, migrations, relations

**Security:**
- Implementation: Application-level + optional RLS
- Pattern: Filter by userId in queries
- Features: Type-safe authorization checks

**Storage:**
- Implementation: Supabase Storage
- Location: [`lib/supabase/client.ts`](/docs/nextjs-supabase-drizzle/lib/supabase/client.ts)
- Pattern: Use Supabase for files, Drizzle for metadata
- Features: File uploads, public URLs

**Rendering:**
- Implementation: Hybrid SSR + CSR
- Pattern: Server Components with Drizzle queries
- Features: Fast initial load, type-safe data fetching

**ORM:**
- Implementation: **Drizzle ORM**
- Pattern: Schema-first, type inference
- Features: SQL-like syntax, perfect types, migrations

## 📚 Learning Flows

### Flow 1: Drizzle Schema & Type Inference (20 minutes)

**Goal:** Master Drizzle's type-safe schema system

**Path:**
1. **Start:** [`lib/db/schema.ts`](/docs/nextjs-supabase-drizzle/lib/db/schema.ts)
   - Table definitions with pgTable
   - Column types (uuid, text, boolean, timestamp)
   - Default values and constraints
   - Relations between tables
   - Type inference magic

2. **Next:** [`lib/db/client.ts`](/docs/nextjs-supabase-drizzle/lib/db/client.ts)
   - Drizzle client initialization
   - PostgreSQL connection
   - prepare: false for Supabase
   - Using the schema

3. **Then:** [`drizzle.config.ts`](/docs/nextjs-supabase-drizzle/drizzle.config.ts)
   - Drizzle Kit configuration
   - Migration generation
   - Database connection

**Key Concepts:**
- Schema-first development
- Type inference (no manual types!)
- InferSelectModel, InferInsertModel
- Relations and joins
- pgTable API


---

### Flow 2: Type-Safe Queries (25 minutes)

**Goal:** Learn Drizzle's query builder

**Path:**
1. **Start:** [`lib/db/queries.ts`](/docs/nextjs-supabase-drizzle/lib/db/queries.ts)
   - SELECT queries with .select().from()
   - WHERE clauses with eq(), and(), or()
   - ORDER BY with .orderBy()
   - INSERT with .insert().values().returning()
   - UPDATE with .update().set().where()
   - DELETE with .delete().where()
   - Complex queries (getConversation)

2. **Next:** [`app/dashboard/page.tsx`](/docs/nextjs-supabase-drizzle/app/dashboard/page.tsx)
   - Using query helpers
   - Type inference in action
   - Error handling
   - State management with typed data

**Key Concepts:**
- SQL-like query syntax
- Type-safe operations
- Query helpers pattern
- Returning inserted data
- Complex WHERE conditions


---

### Flow 3: Hybrid Supabase + Drizzle (20 minutes)

**Goal:** Understand when to use each tool

**Path:**
1. **Start:** [`lib/supabase/client.ts`](/docs/nextjs-supabase-drizzle/lib/supabase/client.ts)
   - Supabase client for auth/storage
   - Why not use for database queries

2. **Next:** [`contexts/AuthContext.tsx`](/docs/nextjs-supabase-drizzle/contexts/AuthContext.tsx)
   - Supabase for authentication
   - Drizzle for profile creation
   - Best of both worlds

3. **Then:** [`app/dashboard/page.tsx`](/docs/nextjs-supabase-drizzle/app/dashboard/page.tsx)
   - Auth from Supabase context
   - Database queries with Drizzle
   - Real-time with Supabase (optional)

**Key Concepts:**
- Hybrid architecture
- When to use Supabase
- When to use Drizzle
- Combining both effectively


---

### Flow 4: Migrations with Drizzle Kit (15 minutes)

**Goal:** Learn database migration system

**Path:**
1. **Start:** [`drizzle.config.ts`](/docs/nextjs-supabase-drizzle/drizzle.config.ts)
   - Configuration for Drizzle Kit
   - Schema location
   - Output directory
   - Database connection

2. **Then:** [`lib/db/schema.ts`](/docs/nextjs-supabase-drizzle/lib/db/schema.ts)
   - Make a change to schema
   - Understand migration generation

3. **Commands:**
   ```bash
   npm run db:generate  # Generate migration SQL
   npm run db:push      # Apply to database
   npm run db:studio    # Visual database editor
   ```

**Key Concepts:**
- Schema-driven migrations
- SQL generation from schema
- Drizzle Kit commands
- Drizzle Studio


---

### Flow 5: Perfect TypeScript Inference (20 minutes)

**Goal:** See Drizzle's type safety in action

**Path:**
1. **Start:** [`lib/db/schema.ts`](/docs/nextjs-supabase-drizzle/lib/db/schema.ts)
   - Define a table
   - See how types are created

2. **Next:** [`lib/db/queries.ts`](/docs/nextjs-supabase-drizzle/lib/db/queries.ts)
   - No manual type annotations
   - InferSelectModel, InferInsertModel
   - Autocomplete in action

3. **Then:** [`components/todos/TodoForm.tsx`](/docs/nextjs-supabase-drizzle/components/todos/TodoForm.tsx)
   - createTodo() is fully typed
   - TypeScript validates arguments
   - Compile-time errors

4. **Try:** Make intentional type errors
   - Wrong type for field
   - Non-existent field
   - See compile errors!

**Key Concepts:**
- Type inference from schema
- No manual type definitions
- Compile-time safety
- Perfect autocomplete


---

### Flow 6: Components with Drizzle Types (15 minutes)

**Goal:** Build components with inferred types

**Path:**
1. **Start:** [`components/todos/TodoForm.tsx`](/docs/nextjs-supabase-drizzle/components/todos/TodoForm.tsx)
   - Using createTodo helper
   - Type-safe form submission

2. **Next:** [`components/todos/TodoList.tsx`](/docs/nextjs-supabase-drizzle/components/todos/TodoList.tsx)
   - InferSelectModel for todo type
   - Type-safe props

3. **Then:** [`components/todos/TodoItem.tsx`](/docs/nextjs-supabase-drizzle/components/todos/TodoItem.tsx)
   - Type-safe update operations
   - Partial<Todo> for updates

**Key Concepts:**
- InferSelectModel for queries
- InferInsertModel for inserts
- Partial types for updates
- Type-safe component props


---

## 🎓 Recommended Learning Order

### Beginner (Learn Drizzle Basics) - 4-6 hours
1. Flow 1: Schema & Type Inference (20 min)
2. Flow 2: Type-Safe Queries (25 min)
3. Flow 5: TypeScript Inference (20 min)
4. Experiment with queries (3-5 hours)

### Intermediate (Build Features) - 6-8 hours
1. Complete Beginner Path
2. Flow 3: Hybrid Approach (20 min)
3. Flow 6: Components (15 min)
4. Build your own features (5-7 hours)

### Advanced (Master Drizzle) - 8-10 hours
1. Complete Intermediate Path
2. Flow 4: Migrations (15 min)
3. Study all query helpers
4. Build complete app with Drizzle (7-9 hours)

## 🌟 Why This Stack is Unique

**Best TypeScript experience of all 5 projects:**
- Perfect type inference (no manual types!)
- Compile-time safety
- SQL-like syntax
- Great for teams (clear contracts)

**Hybrid approach:**
- Supabase: Auth and Storage (best-in-class)
- Drizzle: Database queries (perfect types)
- Each tool does what it's best at!

## 🔗 Quick Reference

### Drizzle
- Schema: [`lib/db/schema.ts`](/docs/nextjs-supabase-drizzle/lib/db/schema.ts)
- Client: [`lib/db/client.ts`](/docs/nextjs-supabase-drizzle/lib/db/client.ts)
- Queries: [`lib/db/queries.ts`](/docs/nextjs-supabase-drizzle/lib/db/queries.ts)
- Config: [`drizzle.config.ts`](/docs/nextjs-supabase-drizzle/drizzle.config.ts)

### Supabase
- Client: [`lib/supabase/client.ts`](/docs/nextjs-supabase-drizzle/lib/supabase/client.ts)
- Auth: [`contexts/AuthContext.tsx`](/docs/nextjs-supabase-drizzle/contexts/AuthContext.tsx)

### Pages
- Dashboard: [`app/dashboard/page.tsx`](/docs/nextjs-supabase-drizzle/app/dashboard/page.tsx)
- Feed: [`app/feed/page.tsx`](/docs/nextjs-supabase-drizzle/app/feed/page.tsx)
- Messages: [`app/messages/page.tsx`](/docs/nextjs-supabase-drizzle/app/messages/page.tsx)
- Settings: [`app/settings/page.tsx`](/docs/nextjs-supabase-drizzle/app/settings/page.tsx)

### Components
- TodoForm: [`components/todos/TodoForm.tsx`](/docs/nextjs-supabase-drizzle/components/todos/TodoForm.tsx)
- TodoList: [`components/todos/TodoList.tsx`](/docs/nextjs-supabase-drizzle/components/todos/TodoList.tsx)
- TodoItem: [`components/todos/TodoItem.tsx`](/docs/nextjs-supabase-drizzle/components/todos/TodoItem.tsx)

---

**This project is 100% complete and ready for learning!**

**Start with Flow 1 to understand Drizzle's type inference magic!**

Audio guides may be added in future updates.
