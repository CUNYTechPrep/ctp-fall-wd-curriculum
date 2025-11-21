# Next.js + Supabase (Postgres) - Learning Guide

## 🎯 Project Overview

The most feature-complete example showcasing ALL Next.js 15 capabilities with PostgreSQL.

## 🔑 Key Features & Implementation Details

### Cross-Cutting Concerns

**Authentication:**
- Implementation: Supabase Auth with cookie-based sessions
- Client: [`lib/supabase/client.ts`](/docs/nextjs-supabase-postgres/lib/supabase/client.ts) (browser)
- Server: [`lib/supabase/server.ts`](/docs/nextjs-supabase-postgres/lib/supabase/server.ts) (SSR)
- Context: [`contexts/AuthContext.tsx`](/docs/nextjs-supabase-postgres/contexts/AuthContext.tsx)
- Pattern: Server + Client hybrid
- Features: Email/password, session refresh, metadata storage

**Database:**
- Implementation: PostgreSQL via Supabase
- Queries: Direct Supabase client queries
- Location: Multiple files (inline queries)
- Pattern: Type-safe with generated types
- Features: SQL queries, joins, full-text search, RLS

**Security:**
- Implementation: Row Level Security (RLS)
- Location: `supabase/policies/*.sql`
- Pattern: Database-level access control
- Features: User-based policies, automatic enforcement

**Rendering:**
- Implementation: **Hybrid SSR + CSR**
- SSR Pages: [`app/dashboard-ssr/page.tsx`](/docs/nextjs-supabase-postgres/app/dashboard-ssr/page.tsx)
- CSR Pages: [`app/dashboard/page.tsx`](/docs/nextjs-supabase-postgres/app/dashboard/page.tsx), [`app/feed/page.tsx`](/docs/nextjs-supabase-postgres/app/feed/page.tsx), etc.
- Pattern: Server Components + Client Components
- Features: SEO, fast initial load, interactivity

**API Layer:**
- Implementation: **Next.js API Routes + Server Actions**
- API Routes: [`app/api/todos/route.ts`](/docs/nextjs-supabase-postgres/app/api/todos/route.ts), [`app/api/todos/[id]/route.ts`](/docs/nextjs-supabase-postgres/app/api/todos/[id]/route.ts), etc.
- Server Actions: [`app/actions.ts`](/docs/nextjs-supabase-postgres/app/actions.ts)
- Middleware: [`middleware.ts`](/docs/nextjs-supabase-postgres/middleware.ts)
- Pattern: RESTful + Type-safe mutations
- Features: Server-side validation, file uploads, search

**Real-time:**
- Implementation: Supabase Realtime (PostgreSQL LISTEN/NOTIFY)
- Pattern: Channel subscriptions with postgres_changes
- Features: Live updates, low latency, scalable

**Storage:**
- Implementation: Supabase Storage (S3-compatible)
- Pattern: Direct uploads with RLS
- Features: Public/private buckets, image optimization

## 📚 Learning Flows

### Flow 1: Supabase Setup & Configuration (15 minutes)

**Goal:** Understand Supabase client and server setup

**Path:**
1. **Start:** [`lib/supabase/client.ts`](/docs/nextjs-supabase-postgres/lib/supabase/client.ts)
   - Browser-side Supabase client
   - Cookie configuration
   - When to use this client

2. **Next:** [`lib/supabase/server.ts`](/docs/nextjs-supabase-postgres/lib/supabase/server.ts)
   - Server-side Supabase client
   - Cookie management for SSR
   - Async cookies in Next.js 15

3. **Then:** [`types/database.ts`](/docs/nextjs-supabase-postgres/types/database.ts)
   - Generated TypeScript types
   - Table definitions
   - Type safety with Supabase

4. **Finally:** `.env.example`
   - Required environment variables
   - Public vs private keys

**Key Concepts:**
- Client vs server Supabase
- Cookie-based authentication
- Type generation from database
- Environment variables


---

### Flow 2: Server-Side Rendering (SSR) (25 minutes)

**Goal:** Master Next.js Server Components with Supabase

**Path:**
1. **Start:** [`app/dashboard-ssr/page.tsx`](/docs/nextjs-supabase-postgres/app/dashboard-ssr/page.tsx)
   - Async server component
   - Data fetching before render
   - No loading states needed
   - Passing data to client component

2. **Next:** [`components/todos/TodoListClient.tsx`](/docs/nextjs-supabase-postgres/components/todos/TodoListClient.tsx)
   - Client component receiving server data
   - Real-time subscription after hydration
   - Progressive enhancement pattern

3. **Compare with:** [`app/dashboard/page.tsx`](/docs/nextjs-supabase-postgres/app/dashboard/page.tsx)
   - Pure client-side rendering
   - useEffect for data fetching
   - Loading states required
   - See the difference!

**Key Concepts:**
- Server Components (async, no 'use client')
- Client Components ('use client' directive)
- Data fetching on server
- Hydration and progressive enhancement
- SSR vs CSR trade-offs


---

### Flow 3: API Routes & RESTful Design (25 minutes)

**Goal:** Learn server-side API design with Next.js

**Path:**
1. **Start:** [`app/api/todos/route.ts`](/docs/nextjs-supabase-postgres/app/api/todos/route.ts)
   - GET and POST handlers
   - Request/response handling
   - Authentication checking
   - Error handling

2. **Next:** [`app/api/todos/[id]/route.ts`](/docs/nextjs-supabase-postgres/app/api/todos/[id]/route.ts)
   - Dynamic route parameters
   - GET, PATCH, DELETE methods
   - Authorization checks
   - RESTful patterns

3. **Then:** [`app/api/upload/route.ts`](/docs/nextjs-supabase-postgres/app/api/upload/route.ts)
   - FormData handling
   - File validation
   - Storage integration
   - Metadata saving

4. **Finally:** [`app/api/search/route.ts`](/docs/nextjs-supabase-postgres/app/api/search/route.ts)
   - PostgreSQL full-text search
   - Query parameter handling
   - Search implementation

**Key Concepts:**
- Next.js API Routes
- RESTful API design
- HTTP methods (GET, POST, PATCH, DELETE)
- Server-side validation
- File upload handling
- PostgreSQL full-text search


---

### Flow 4: Server Actions (Next.js 15 Feature) (20 minutes)

**Goal:** Understand the newest Next.js feature

**Path:**
1. **Start:** [`app/actions.ts`](/docs/nextjs-supabase-postgres/app/actions.ts)
   - 'use server' directive
   - Type-safe server functions
   - createTodo, updateTodo, deleteTodo
   - Revalidation

2. **Compare with:** [`app/api/todos/route.ts`](/docs/nextjs-supabase-postgres/app/api/todos/route.ts)
   - Server Actions vs API Routes
   - When to use each
   - Trade-offs

**Key Concepts:**
- 'use server' directive
- Server Actions vs API Routes
- Type-safe mutations
- Progressive enhancement
- revalidatePath for cache updates


---

### Flow 5: Middleware & Session Management (15 minutes)

**Goal:** Learn request interception and auth

**Path:**
1. **Start:** [`middleware.ts`](/docs/nextjs-supabase-postgres/middleware.ts)
   - Request interception
   - Session refresh logic
   - Route protection
   - Cookie management
   - Redirect logic

**Key Concepts:**
- Next.js Middleware
- Request/response modification
- Session token refresh
- Route protection at edge
- Cookie handling


---

### Flow 6: Row Level Security (RLS) (25 minutes)

**Goal:** Master PostgreSQL security policies

**Path:**
1. **Start:** [`supabase/migrations/001_initial_schema.sql`](/docs/nextjs-supabase-postgres/supabase/migrations/001_initial_schema.sql)
   - Table definitions
   - RLS enablement
   - Policy creation
   - Index definitions
   - Database triggers

2. **Next:** [`supabase/policies/todos_policies.sql`](/docs/nextjs-supabase-postgres/supabase/policies/todos_policies.sql)
   - Todo access policies
   - USING vs WITH CHECK
   - Policy testing
   - Debug techniques

3. **Then:** [`supabase/policies/storage_policies.sql`](/docs/nextjs-supabase-postgres/supabase/policies/storage_policies.sql)
   - Storage bucket policies
   - Path-based access
   - File type validation

**Key Concepts:**
- Row Level Security (RLS)
- PostgreSQL policies
- auth.uid() function
- USING clause (SELECT)
- WITH CHECK clause (INSERT/UPDATE)
- Policy testing and debugging


---

### Flow 7: PostgreSQL Features (20 minutes)

**Goal:** Learn PostgreSQL-specific capabilities

**Path:**
1. **Start:** [`supabase/migrations/001_initial_schema.sql`](/docs/nextjs-supabase-postgres/supabase/migrations/001_initial_schema.sql)
   - PostgreSQL data types
   - Array columns (tags)
   - Indexes (GIN, B-tree)
   - Full-text search index
   - Triggers

2. **Next:** [`app/feed/page.tsx`](/docs/nextjs-supabase-postgres/app/feed/page.tsx)
   - Full-text search implementation
   - Array operations (tags)
   - Pagination with range()

3. **Then:** [`app/api/search/route.ts`](/docs/nextjs-supabase-postgres/app/api/search/route.ts)
   - Server-side full-text search
   - to_tsvector and plainto_tsquery
   - Search ranking

**Key Concepts:**
- PostgreSQL arrays
- GIN indexes
- Full-text search
- Database triggers
- to_tsvector/plainto_tsquery


---

### Flow 8: Real-time with Supabase (15 minutes)

**Goal:** Understand PostgreSQL real-time

**Path:**
1. **Start:** [`app/dashboard/page.tsx`](/docs/nextjs-supabase-postgres/app/dashboard/page.tsx)
   - Channel creation
   - postgres_changes event
   - Subscription setup
   - Cleanup

2. **Next:** [`app/messages/page.tsx`](/docs/nextjs-supabase-postgres/app/messages/page.tsx)
   - Real-time messaging
   - Event filtering
   - Optimistic updates

**Key Concepts:**
- Supabase Realtime channels
- postgres_changes events
- Event filtering
- Subscription cleanup


---

### Flow 9: Components & UI Patterns (20 minutes)

**Goal:** Learn reusable component patterns

**Path:**
1. **Start:** [`components/ui/Button.tsx`](/docs/nextjs-supabase-postgres/components/ui/Button.tsx)
   - Variant system
   - Prop composition
   - TypeScript props

2. **Next:** [`components/ui/Input.tsx`](/docs/nextjs-supabase-postgres/components/ui/Input.tsx)
   - forwardRef pattern
   - Validation states
   - Accessibility

3. **Then:** [`components/todos/TodoForm.tsx`](/docs/nextjs-supabase-postgres/components/todos/TodoForm.tsx)
   - Form composition
   - State management
   - Array handling (tags)

4. **Finally:** [`components/todos/TodoList.tsx`](/docs/nextjs-supabase-postgres/components/todos/TodoList.tsx) and [`TodoItem.tsx`](/docs/nextjs-supabase-postgres/TodoItem.tsx)
   - List rendering
   - Component composition
   - Callbacks

**Key Concepts:**
- Reusable components
- Variant patterns
- forwardRef
- Component composition
- Props and callbacks


---

## 🎓 Recommended Learning Order

### Beginner (Start Here) - 6-8 hours
1. Flow 1: Supabase Setup (15 min)
2. Flow 2: Server-Side Rendering (25 min)
3. Flow 9: Components (20 min)
4. Run the project and experiment (5-7 hours)

### Intermediate - 8-10 hours
1. Complete Beginner Path
2. Flow 3: API Routes (25 min)
3. Flow 4: Server Actions (20 min)
4. Flow 5: Middleware (15 min)
5. Build your own features (6-8 hours)

### Advanced - 10-12 hours
1. Complete Intermediate Path
2. Flow 6: Row Level Security (25 min)
3. Flow 7: PostgreSQL Features (20 min)
4. Flow 8: Real-time (15 min)
5. Study all inline documentation
6. Build a complete application (8-10 hours)

## 🌟 Why This Project is Special

**Only project that shows ALL Next.js 15 features:**
- ✅ Server Components
- ✅ Client Components
- ✅ API Routes
- ✅ Server Actions
- ✅ Middleware
- ✅ PostgreSQL
- ✅ Row Level Security
- ✅ Real-time
- ✅ Full-text search

**This is the most complete Next.js + Supabase example available!**

## 🔗 Quick Reference

### Configuration
- Supabase Client: [`lib/supabase/client.ts`](/docs/nextjs-supabase-postgres/lib/supabase/client.ts)
- Supabase Server: [`lib/supabase/server.ts`](/docs/nextjs-supabase-postgres/lib/supabase/server.ts)
- Types: [`types/database.ts`](/docs/nextjs-supabase-postgres/types/database.ts)
- Middleware: [`middleware.ts`](/docs/nextjs-supabase-postgres/middleware.ts)

### Server Features
- SSR Dashboard: [`app/dashboard-ssr/page.tsx`](/docs/nextjs-supabase-postgres/app/dashboard-ssr/page.tsx)
- API Routes: `app/api/`
- Server Actions: [`app/actions.ts`](/docs/nextjs-supabase-postgres/app/actions.ts)

### Client Features
- CSR Dashboard: [`app/dashboard/page.tsx`](/docs/nextjs-supabase-postgres/app/dashboard/page.tsx)
- Feed: [`app/feed/page.tsx`](/docs/nextjs-supabase-postgres/app/feed/page.tsx)
- Messages: [`app/messages/page.tsx`](/docs/nextjs-supabase-postgres/app/messages/page.tsx)
- Settings: [`app/settings/page.tsx`](/docs/nextjs-supabase-postgres/app/settings/page.tsx)

### Security
- RLS Policies: `supabase/policies/`
- Migrations: `supabase/migrations/`

### Components
- UI: `components/ui/`
- Todos: `components/todos/`

---

**Start with Flow 1 and follow the learning paths!**

Audio guides may be added in future updates.
