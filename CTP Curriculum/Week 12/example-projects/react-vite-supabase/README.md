# React + Vite + Supabase Todo Application

A client-side todo application built with React, Vite, and Supabase.

## Features

- User authentication (sign up, sign in, sign out)
- Todo CRUD operations with real-time updates
- User accessibility settings
- Profile picture uploads
- Todo file attachments
- Public feed (searchable, filterable, paginated)
- Real-time messaging
- Tags for categorization
- PostgreSQL database with Row Level Security

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

## Why This Stack?

**Perfect Combination:**
- ✅ **Simple frontend** (React + Vite)
- ✅ **Powerful backend** (PostgreSQL)
- ✅ **Open-source** (can self-host)
- ✅ **Type-safe** (generate types from database)
- ✅ **Real-time** built-in
- ✅ **Cheap** hosting (static files + Supabase free tier)

**Best For:**
- Internal tools and dashboards
- CRUD applications
- Real-time collaborative apps
- Learning modern web development
- Projects needing SQL database

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (free tier available)

### Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   Get these from Supabase Dashboard → Project Settings → API

3. **Set Up Database:**
   Run these SQL commands in Supabase SQL Editor:

   ```sql
   -- Create tables (see database-schema.sql in project)
   -- Enable Row Level Security
   -- Create RLS policies
   ```

4. **Generate Types (Optional but Recommended):**
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
react-vite-supabase/
├── src/
│   ├── components/          # React components
│   ├── contexts/
│   │   └── AuthContext.tsx  # Supabase auth management
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client
│   │   └── database.types.ts  # Generated types
│   ├── pages/              # Page components
│   ├── App.tsx             # Root with routes
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
├── index.html
└── vite.config.ts
```

## Database Schema

See `database-schema.sql` for complete schema.

**Tables:**
- `user_profiles` - Extended user data
- `user_settings` - Accessibility preferences
- `todos` - Todo items
- `todo_attachments` - File metadata
- `messages` - Real-time messaging

**Row Level Security:**
All tables have RLS policies ensuring users can only access their own data (or public data where appropriate).

## Type Safety

Generate TypeScript types from your database:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

Then enjoy full autocomplete:

```typescript
import { supabase } from '@/lib/supabase'

const { data } = await supabase
  .from('todos') // ✅ Autocomplete table names
  .select('title, completed') // ✅ Autocomplete column names
  .eq('user_id', userId) // ✅ Type-checked values
```

## Real-time Subscriptions

Subscribe to database changes:

```typescript
const channel = supabase
  .channel('todos')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'todos',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Todo changed:', payload)
    // Update UI
  })
  .subscribe()

// Cleanup
return () => supabase.removeChannel(channel)
```

## Authentication

Supabase Auth is built-in:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { display_name: displayName }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})

// Sign out
await supabase.auth.signOut()

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Update UI
})
```

## Building for Production

```bash
npm run build
```

Creates optimized static files in `dist/`.

## Deployment

### Vercel
```bash
npx vercel
```

### Netlify
```bash
npx netlify deploy --prod
```

### Other Hosts
Upload `dist/` to any static host:
- Firebase Hosting
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

**Environment Variables:**
Set in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Row Level Security Example

```sql
-- Users can only see their own todos
CREATE POLICY "Users see own private todos"
ON todos FOR SELECT
USING (
  auth.uid() = user_id
  OR is_public = true
);

-- Users can only create their own todos
CREATE POLICY "Users create own todos"
ON todos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own todos
CREATE POLICY "Users update own todos"
ON todos FOR UPDATE
USING (auth.uid() = user_id);
```

## Comparison with Other Stacks

| Feature | React + Vite + Supabase | React + Vite + Firebase | Next.js + Supabase |
|---------|------------------------|-------------------------|-------------------|
| Database | PostgreSQL (SQL) | Firestore (NoSQL) | PostgreSQL (SQL) |
| Rendering | Client-side (SPA) | Client-side (SPA) | SSR + CSR |
| SEO | Poor | Poor | Excellent |
| Complexity | Simple | Simple | More complex |
| Deployment | Static files | Static files | Node.js server |
| Open Source | Yes | No | Backend only |
| Cost | Very cheap | Cheap | More expensive |

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router](https://reactrouter.com/)
- [PostgreSQL](https://www.postgresql.org/docs/)

## License

MIT
