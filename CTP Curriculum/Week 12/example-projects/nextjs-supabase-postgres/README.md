# Next.js + Supabase (Postgres) Todo Application

A full-stack todo application built with Next.js 15 and Supabase PostgreSQL.

## Features

- User authentication (sign up, sign in, sign out)
- Todo CRUD operations with real-time updates
- User accessibility settings (theme, font size, contrast, motion)
- Profile picture uploads
- Todo file attachments
- Public feed of todos (searchable, filterable, paginated)
- Real-time messaging between users
- Tags for categorization
- Responsive design
- PostgreSQL with Row Level Security

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime (PostgreSQL)
- **ORM:** Supabase Client (auto-generated types)
- **Rendering:** Server Components + Client Components (hybrid)
- **API:** REST API routes + Server Actions

## Why Supabase?

**Supabase vs Firebase:**
- ✅ **PostgreSQL:** Powerful SQL database with relations, joins, transactions
- ✅ **Open Source:** Self-hostable, no vendor lock-in
- ✅ **Row Level Security:** Database-level access control
- ✅ **Real-time:** Built into PostgreSQL, not a separate service
- ✅ **Auto-generated API:** REST API created from your schema
- ✅ **Type Safety:** Generate TypeScript types from database

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project created (free tier available)

### Setup

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Note your project URL and anon key

2. **Clone and Install:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set Up Database:**
   - Run the SQL migrations in `supabase/migrations/`
   - Or use Supabase Studio to create tables
   - Enable Row Level Security
   - Apply RLS policies

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Tables

**users** (created by Supabase Auth)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**user_profiles**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  display_name TEXT,
  profile_picture TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**user_settings**
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  theme TEXT DEFAULT 'light',
  font_size TEXT DEFAULT 'medium',
  high_contrast BOOLEAN DEFAULT FALSE,
  reduced_motion BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

**todos**
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**todo_attachments**
```sql
CREATE TABLE todo_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

**messages**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

### Todos
```sql
-- Users can see their own private todos
CREATE POLICY "Users can see own private todos"
ON todos FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

-- Users can create their own todos
CREATE POLICY "Users can create own todos"
ON todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update own todos
CREATE POLICY "Users can update own todos"
ON todos FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete own todos
CREATE POLICY "Users can delete own todos"
ON todos FOR DELETE
USING (auth.uid() = user_id);
```

### Messages
```sql
-- Users can read messages they sent or received
CREATE POLICY "Users can read their messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send messages as themselves
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Recipients can mark messages as read
CREATE POLICY "Recipients can mark as read"
ON messages FOR UPDATE
USING (auth.uid() = recipient_id);
```

## Real-time Subscriptions

Supabase provides real-time updates via PostgreSQL:

```typescript
const supabase = createClient()

// Subscribe to todo changes
const channel = supabase
  .channel('todos')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'todos',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Todo changed:', payload)
  })
  .subscribe()

// Cleanup
supabase.removeChannel(channel)
```

## Type Safety

Generate TypeScript types from your database:

```bash
npx supabase gen types typescript --project-id your-project-id > types/database.ts
```

Then use them:

```typescript
import type { Database } from '@/types/database'

const supabase = createClient<Database>()

// Full autocomplete!
const { data } = await supabase.from('todos').select('*')
```

## Storage

Upload files to Supabase Storage:

```typescript
const { data, error } = await supabase.storage
  .from('attachments')
  .upload(`${userId}/${todoId}/${filename}`, file)
```

Get public URL:

```typescript
const { data } = supabase.storage
  .from('attachments')
  .getPublicUrl(path)
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Vercel automatically detects Next.js and configures build settings.

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted

## Next.js Features Demonstrated

This project showcases the FULL power of Next.js 15:

### ✅ Server Components
- `/dashboard-ssr` - Server-side data fetching
- Fetch data before rendering
- No loading states needed
- Better SEO and performance

### ✅ Client Components
- `/dashboard` - Client-side real-time updates
- Interactive UI with hooks
- Real-time subscriptions
- Optimistic updates

### ✅ API Routes
- `GET /api/todos` - List todos
- `POST /api/todos` - Create todo
- `GET /api/todos/[id]` - Get specific todo
- `PATCH /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo
- `POST /api/upload` - File upload
- `GET /api/search` - Full-text search

### ✅ Server Actions (Next.js 15)
- `app/actions.ts` - Server functions called from client
- Type-safe mutations
- Progressive enhancement
- No API routes needed

### ✅ Middleware
- `middleware.ts` - Session refresh and route protection
- Runs on every request
- Keeps auth tokens fresh
- Protects routes automatically

### ✅ Hybrid Rendering
- Server components for initial load (SEO, performance)
- Client components for interactivity (real-time, forms)
- Best of both worlds!

## Project Structure

```
nextjs-supabase-postgres/
├── app/
│   ├── (auth)/                     # Auth pages
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/                  # Client-side dashboard
│   ├── dashboard-ssr/              # Server-side dashboard
│   ├── feed/                       # Public feed
│   ├── messages/                   # Real-time messaging
│   ├── settings/                   # User settings
│   ├── api/                        # API routes
│   │   ├── todos/
│   │   │   ├── route.ts           # GET, POST
│   │   │   └── [id]/route.ts      # GET, PATCH, DELETE
│   │   ├── upload/route.ts        # File upload
│   │   └── search/route.ts        # Full-text search
│   ├── actions.ts                  # Server Actions
│   └── layout.tsx
├── components/
│   └── todos/
│       └── TodoListClient.tsx      # Client component for SSR page
├── contexts/
│   └── AuthContext.tsx             # Supabase auth
├── lib/
│   └── supabase/
│       ├── client.ts               # Browser client
│       └── server.ts               # Server client
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── types/
│   └── database.ts                 # Generated types
└── middleware.ts                   # Route protection
```

## Documentation

All code files include comprehensive inline documentation explaining:
- What the code does
- Why architectural decisions were made
- How Supabase features work
- Security considerations
- Best practices
- Server vs client rendering trade-offs
- When to use API routes vs Server Actions

View the generated documentation at the project's GitHub Pages site.

## Comparison with Other Projects

**vs Next.js + Firebase (Project 1):**
- This project: PostgreSQL (SQL), RLS, SSR, API routes
- Firebase: Firestore (NoSQL), client-only, simpler

**vs Next.js + Drizzle (Project 3):**
- This project: Supabase client for queries
- Drizzle: Type-safe ORM for perfect TypeScript

**vs React + Vite + Supabase (Project 5):**
- This project: Server-side rendering, API routes, middleware
- Vite: Client-only SPA, simpler deployment

This project is the **most feature-complete** example, demonstrating:
- ✅ Server Components
- ✅ Client Components
- ✅ API Routes
- ✅ Server Actions
- ✅ Middleware
- ✅ PostgreSQL
- ✅ Row Level Security
- ✅ Real-time
- ✅ Full-text search

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
