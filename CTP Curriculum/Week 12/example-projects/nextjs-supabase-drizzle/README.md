

# Next.js + Supabase + Drizzle ORM Todo Application

A full-stack todo application built with Next.js 15, Supabase, and Drizzle ORM for type-safe database access.

## Features

- User authentication (sign up, sign in, sign out) - Supabase Auth
- Todo CRUD operations with real-time updates
- User accessibility settings
- Profile picture uploads - Supabase Storage
- Todo file attachments
- Public feed (searchable, filterable, paginated)
- Real-time messaging
- Tags for categorization
- **Type-safe database queries with Drizzle ORM**

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Drizzle ORM (type-safe queries)
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

## Why This Stack?

**Best of Both Worlds:**
- ✅ Supabase Auth & Storage (best-in-class)
- ✅ Drizzle ORM for perfect TypeScript inference
- ✅ Type-safe queries without losing SQL power
- ✅ Still use Supabase Realtime subscriptions
- ✅ Faster queries than Supabase client for complex operations

**Drizzle Benefits:**
- Full TypeScript autocomplete
- SQL-like syntax (easy to learn)
- Lightweight (< 10KB)
- Perfect type inference
- Migrations built-in

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project

### Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

3. **Generate Migrations:**
   ```bash
   npm run db:generate
   ```

4. **Apply to Database:**
   ```bash
   npm run db:push
   ```
   Or copy SQL from `drizzle/` folder to Supabase SQL editor

5. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
nextjs-supabase-drizzle/
├── lib/
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema definition
│   │   ├── client.ts        # Drizzle client setup
│   │   └── queries.ts       # Reusable type-safe queries
│   └── supabase/
│       ├── client.ts        # Supabase client (for Auth/Storage)
│       └── server.ts        # Supabase server client
├── drizzle/                 # Generated SQL migrations
└── drizzle.config.ts        # Drizzle configuration
```

## Drizzle ORM Usage

### Define Schema (`lib/db/schema.ts`)

```typescript
export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  completed: boolean('completed').default(false),
})
```

### Query with Type Safety

```typescript
import { db } from '@/lib/db/client'
import { todos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// SELECT with full autocomplete
const userTodos = await db
  .select()
  .from(todos)
  .where(eq(todos.userId, userId))

// INSERT with type checking
const [newTodo] = await db
  .insert(todos)
  .values({ userId, title: 'New todo' })
  .returning()

// UPDATE
await db
  .update(todos)
  .set({ completed: true })
  .where(eq(todos.id, todoId))
```

### Relations and Joins

```typescript
const todosWithAttachments = await db.query.todos.findMany({
  where: eq(todos.userId, userId),
  with: {
    attachments: true,
  },
})
```

## Hybrid Approach

**Use Drizzle for:**
- Complex queries with joins
- Type-safe CRUD operations
- Transactions
- Aggregations

**Use Supabase Client for:**
- Authentication (Auth)
- File uploads (Storage)
- Real-time subscriptions

```typescript
// Auth with Supabase
const { data: { user } } = await supabase.auth.getUser()

// Queries with Drizzle
const todos = await db.select().from(todos).where(eq(todos.userId, user.id))

// Realtime with Supabase
supabase
  .channel('todos')
  .on('postgres_changes', { table: 'todos' }, handleChange)
  .subscribe()
```

## Database Migrations

### Create Migration

```bash
npm run db:generate
```

Generates SQL in `drizzle/` folder.

### Apply Migration

**Option 1: Drizzle Kit**
```bash
npm run db:push
```

**Option 2: Supabase Dashboard**
1. Copy SQL from `drizzle/` folder
2. Paste in Supabase SQL Editor
3. Run

### Drizzle Studio

View and edit database:
```bash
npm run db:studio
```

Opens local admin UI at https://local.drizzle.studio

## Row Level Security

**Important:** Drizzle doesn't enforce RLS automatically!

Create RLS policies in Supabase:

```sql
CREATE POLICY "Users see own todos"
ON todos FOR SELECT
USING (auth.uid() = user_id);
```

Or use service role key with Drizzle (server-side only).

## Type Safety Example

```typescript
// ❌ Type error caught at compile time
await db.insert(todos).values({
  userId: 123, // Error: Expected string (UUID)
  title: 42,   // Error: Expected string
})

// ✅ Correct types
await db.insert(todos).values({
  userId: user.id,
  title: 'Valid todo',
})

// Full autocomplete
const results = await db.select().from(todos)
results[0].title  // ✅ TypeScript knows this is a string
results[0].userId // ✅ TypeScript knows this is a UUID
```

## Performance

Drizzle generates efficient SQL:

```typescript
// This code...
await db.select().from(todos).where(eq(todos.userId, userId))

// Generates this SQL:
// SELECT * FROM todos WHERE user_id = $1
```

No N+1 queries, no ORM overhead!

## Deployment

Same as other Next.js projects:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted

Environment variables needed:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`

## Learn More

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

MIT
