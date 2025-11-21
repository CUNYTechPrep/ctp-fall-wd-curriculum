# React + Vite + Supabase - Learning Guide

## 🎯 Project Overview

A client-side SPA with PostgreSQL database - combining simplicity of React + Vite with power of SQL.

## 🔑 Key Features & Implementation Details

### Cross-Cutting Concerns

**Architecture:**
- Implementation: **Single Page Application (SPA) with PostgreSQL**
- Pattern: Client-side only, PostgreSQL via Supabase
- Deployment: Static files
- Features: Simple + Powerful

**Build Tool:**
- Implementation: Vite
- Location: [`vite.config.ts`](/docs/react-vite-supabase/vite.config.ts)
- Pattern: Fast HMR, optimized builds
- Features: Instant dev server, code splitting

**Routing:**
- Implementation: React Router DOM v6
- Location: [`src/App.tsx`](/docs/react-vite-supabase/src/App.tsx)
- Pattern: Client-side routing
- Features: Protected routes, lazy loading

**Authentication:**
- Implementation: Supabase Auth (client-side)
- Location: [`src/lib/supabase.ts`](/docs/react-vite-supabase/src/lib/supabase.ts), [`src/contexts/AuthContext.tsx`](/docs/react-vite-supabase/src/contexts/AuthContext.tsx)
- Pattern: localStorage sessions
- Features: Email/password, auto-refresh

**Database:**
- Implementation: **PostgreSQL via Supabase**
- Location: [`src/lib/supabase.ts`](/docs/react-vite-supabase/src/lib/supabase.ts) (queries in components)
- Pattern: Client queries with RLS protection
- Features: SQL database from browser!

**Security:**
- Implementation: **Row Level Security (RLS)**
- Pattern: Database-level access control
- Features: Policies enforce security at source

**Real-time:**
- Implementation: Supabase Realtime (PostgreSQL)
- Pattern: postgres_changes subscriptions
- Features: Live updates, low latency

## 📚 Learning Flows

### Flow 1: PostgreSQL from the Browser (20 minutes)

**Goal:** Understand how PostgreSQL works in a SPA

**Path:**
1. **Start:** [`src/lib/supabase.ts`](/docs/react-vite-supabase/src/lib/supabase.ts)
   - Supabase client initialization
   - PostgreSQL connection via REST API
   - localStorage for sessions
   - How RLS protects data

2. **Next:** [`src/pages/Dashboard.tsx`](/docs/react-vite-supabase/src/pages/Dashboard.tsx)
   - Direct PostgreSQL queries from browser
   - .from('todos').select()
   - RLS automatically filtering
   - Type-safe queries

3. **Understand:** How this is secure
   - RLS policies in database
   - Can't bypass from client
   - Database is the security layer

**Key Concepts:**
- PostgreSQL from browser (unique!)
- Supabase REST API
- Row Level Security
- Client-side SQL queries


---

### Flow 2: Supabase Client in SPA (15 minutes)

**Goal:** Learn Supabase client-side patterns

**Path:**
1. **Start:** [`src/lib/supabase.ts`](/docs/react-vite-supabase/src/lib/supabase.ts)
   - createClient for browser
   - Configuration options
   - localStorage storage

2. **Next:** [`src/contexts/AuthContext.tsx`](/docs/react-vite-supabase/src/contexts/AuthContext.tsx)
   - Auth state management
   - onAuthStateChange
   - Session persistence

3. **Then:** Any page with queries
   - Direct database queries
   - { data, error } pattern
   - Type-safe operations

**Key Concepts:**
- Supabase client in SPA
- localStorage vs cookies
- Session management
- Client-side queries


---

### Flow 3: Row Level Security (RLS) from Client (20 minutes)

**Goal:** Understand database-level security

**Path:**
1. **Start:** Review RLS concept
   - Database enforces security
   - Policies filter queries
   - auth.uid() in policies

2. **Next:** [`src/pages/Dashboard.tsx`](/docs/react-vite-supabase/src/pages/Dashboard.tsx)
   - Query all todos
   - RLS automatically filters to user's
   - Try to access others' data (blocked!)

3. **Understand:** Security model
   - Client protection is UX
   - Database protection is security
   - RLS can't be bypassed

**Key Concepts:**
- Row Level Security
- Database-level security
- auth.uid() function
- Client vs database security


---

### Flow 4: Real-time with PostgreSQL (15 minutes)

**Goal:** Learn Supabase Realtime

**Path:**
1. **Start:** [`src/pages/Dashboard.tsx`](/docs/react-vite-supabase/src/pages/Dashboard.tsx)
   - Channel creation
   - postgres_changes subscription
   - Event handling
   - Cleanup

2. **Next:** [`src/pages/Messages.tsx`](/docs/react-vite-supabase/src/pages/Messages.tsx)
   - Real-time messaging
   - INSERT event listening
   - Optimistic updates

**Key Concepts:**
- Supabase Realtime channels
- postgres_changes events
- WebSocket connections
- Subscription cleanup


---

### Flow 5: Type Generation from Database (15 minutes)

**Goal:** Learn type-safe Supabase queries

**Path:**
1. **Understand:** Type generation process
   ```bash
   npx supabase gen types typescript --project-id YOUR_ID > src/lib/database.types.ts
   ```

2. **See:** How types are used
   - Import Database type
   - Table row types
   - Insert types
   - Update types

3. **Then:** [`src/pages/Dashboard.tsx`](/docs/react-vite-supabase/src/pages/Dashboard.tsx)
   - Type-safe queries
   - Autocomplete
   - Compile-time errors

**Key Concepts:**
- Type generation from database
- Database-driven types
- Type-safe queries
- Autocomplete benefits


---

### Flow 6: Components in SPA (15 minutes)

**Goal:** React component patterns

**Path:**
1. **Start:** [`src/components/TodoForm.tsx`](/docs/react-vite-supabase/src/components/TodoForm.tsx)
   - Controlled inputs
   - Supabase insert
   - Form validation

2. **Next:** [`src/components/TodoList.tsx`](/docs/react-vite-supabase/src/components/TodoList.tsx)
   - List rendering
   - Inline TodoItem
   - Props and callbacks

3. **Then:** [`src/components/Layout.tsx`](/docs/react-vite-supabase/src/components/Layout.tsx)
   - Layout composition
   - Navigation
   - Children prop

**Key Concepts:**
- Component composition
- Controlled forms
- Props and callbacks
- Layout patterns


---

### Flow 7: Static Deployment (10 minutes)

**Goal:** Deploy SPA to production

**Path:**
1. **Start:** [`vite.config.ts`](/docs/react-vite-supabase/vite.config.ts)
   - Build configuration
   - Output optimization

2. **Next:** Build the app
   ```bash
   npm run build
   ```
   - See dist/ output
   - Hashed filenames
   - Optimized bundles

3. **Then:** Deploy options
   - Vercel, Netlify, Firebase Hosting
   - Static file hosting
   - Environment variables

**Key Concepts:**
- Production builds
- Static deployment
- SPA routing fallback
- CDN deployment


---

## 🎓 Recommended Learning Order

### Beginner (Learn SPA Basics) - 3-5 hours
1. Flow 1: Vite Setup (15 min)
2. Flow 2: React Router (20 min)
3. Flow 6: Components (15 min)
4. Experiment with React (2-4 hours)

### Intermediate (Add Database) - 5-7 hours
1. Complete Beginner Path
2. Flow 3: RLS Security (20 min)
3. Flow 4: Real-time (15 min)
4. Build features (4-6 hours)

### Advanced (Type Safety & Deploy) - 7-9 hours
1. Complete Intermediate Path
2. Flow 5: Type Generation (15 min)
3. Flow 7: Deployment (10 min)
4. Build complete app (6-8 hours)

## 🌟 Why This Stack

**Unique combination:**
- React + Vite: Simple, fast SPA
- Supabase PostgreSQL: SQL power from browser
- Open-source: Can self-host everything
- Type-safe: Generated types from database

**Best for:**
- Learning React + PostgreSQL
- Internal tools and dashboards
- Open-source projects
- Simple deployment needs

## 🔗 Quick Reference

### Core Files
- **Vite:** [`vite.config.ts`](/docs/react-vite-supabase/vite.config.ts)
- **Supabase:** [`src/lib/supabase.ts`](/docs/react-vite-supabase/src/lib/supabase.ts)
- **Router:** [`src/App.tsx`](/docs/react-vite-supabase/src/App.tsx)
- **Auth:** [`src/contexts/AuthContext.tsx`](/docs/react-vite-supabase/src/contexts/AuthContext.tsx)

### Pages
- Landing: [`src/pages/Landing.tsx`](/docs/react-vite-supabase/src/pages/Landing.tsx)
- Auth: [`src/pages/SignIn.tsx`](/docs/react-vite-supabase/src/pages/SignIn.tsx), [`SignUp.tsx`](/docs/react-vite-supabase/SignUp.tsx)
- Dashboard: [`src/pages/Dashboard.tsx`](/docs/react-vite-supabase/src/pages/Dashboard.tsx)
- Feed: [`src/pages/Feed.tsx`](/docs/react-vite-supabase/src/pages/Feed.tsx)
- Messages: [`src/pages/Messages.tsx`](/docs/react-vite-supabase/src/pages/Messages.tsx)
- Settings: [`src/pages/Settings.tsx`](/docs/react-vite-supabase/src/pages/Settings.tsx)

### Components
- TodoForm: [`src/components/TodoForm.tsx`](/docs/react-vite-supabase/src/components/TodoForm.tsx)
- TodoList: [`src/components/TodoList.tsx`](/docs/react-vite-supabase/src/components/TodoList.tsx)
- Layout: [`src/components/Layout.tsx`](/docs/react-vite-supabase/src/components/Layout.tsx)
- ProtectedRoute: [`src/components/ProtectedRoute.tsx`](/docs/react-vite-supabase/src/components/ProtectedRoute.tsx)

---

**This project is 100% complete and ready for learning!**

**Start with Flow 1 to understand the SPA + PostgreSQL combination!**

Audio guides may be added in future updates.
