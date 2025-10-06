# Week 6 Lesson Plan: Next.js (App Router)

## Learning Objectives

By the end of this week, students will be able to:
1. Understand what Next.js is and why it's useful
2. Differentiate between the App Router and Pages Router
3. Create pages and layouts using the App Router
4. Understand Server Components vs Client Components
5. **Important** Migrating Vite app to NextJS
6. Implement API routes in Next.js
7. Fetch data from API routes in client components
8. Build a basic CRUD application (Todo app)

---

## Lesson Outline (2-3 hours)

### Part 1: Introduction to Next.js (30 min)
- **What is Next.js?**
  - React framework for production
  - Built-in routing, SSR, SSG, API routes
  - Performance optimizations out of the box
  
- **App Router vs Pages Router**
  - App Router (new, recommended)
  - Uses the `app/` directory
  - Built on React Server Components

- **Setup**
  - `npx create-next-app@latest`
  - Project structure walkthrough

### Part 2: File-based Routing (30 min)
- **Creating Pages**
  - `app/page.tsx` → Home page
  - `app/about/page.tsx` → About page
  - `app/todos/page.tsx` → Todos list
  
- **Layouts**
  - `app/layout.tsx` → Root layout
  - Shared navigation, headers, footers
  - Nested layouts

- **Dynamic Routes**
  - `app/todos/[id]/page.tsx` → Todo detail page
  - Using `useParams()` hook

### Part 3: Server vs Client Components (30 min)
- **Server Components (default)**
  - Rendered on the server
  - Can use async/await directly
  - No client-side JavaScript

- **Client Components**
  - Use `'use client'` directive
  - For interactivity (useState, useEffect, event handlers)
  - Runs in the browser

- **When to Use Each**
  - Server: data fetching, static content
  - Client: forms, interactivity, browser APIs

### Part 4: API Routes (30 min)
- **Creating API Routes**
  - `app/api/todos/route.ts` → GET, POST
  - `app/api/todos/[id]/route.ts` → GET, PUT, DELETE
  
- **Request and Response**
  - `NextRequest`, `NextResponse`
  - Handling JSON data
  - HTTP methods

### Part 5: Building the Todo App (30-60 min)
- **Demo Walkthrough**
  - List todos (`/todos`)
  - Add todo (`/todos/new`)
  - View/edit todo (`/todos/[id]`)
  - API routes for CRUD operations

- **Hands-on Coding**
  - Students follow along
  - Implement features step-by-step

---

## Migrating from Vite to Next.js

Why migrate?
- Built-in routing (no React Router)
- API routes (no separate backend)
- Better SEO (server-side rendering)
- Easier deployment

---

## Migration Steps

1. Create new Next.js project
2. Identify Server vs Client components
3. Convert routing to file-based
4. Move API logic to API routes
5. Update environment variables

---

## Component Migration

**Vite Component:**
```tsx
// src/components/Counter.tsx
export function Counter() { ... }
```

**Next.js Component (Client):**
```tsx
// app/components/Counter.tsx
'use client'
export function Counter() { ... }
```

---

## Routing Migration

| Vite (React Router) | Next.js (App Router) |
|---------------------|----------------------|
| `<Route path="/" />` | `app/page.tsx` |
| `<Route path="/about" />` | `app/about/page.tsx` |
| `<Route path="/blog/:id" />` | `app/blog/[id]/page.tsx` |

---

## Navigation Migration

**Vite:**
```tsx
import { Link, useNavigate } from 'react-router-dom'
<Link to="/about">About</Link>
navigate('/home')
```

**Next.js:**
```tsx
import Link from 'next/link'
import { useRouter } from 'next/navigation'
<Link href="/about">About</Link>
router.push('/home')
```

---

## Environment Variables

**Vite:**
```bash
VITE_API_KEY=secret
```
```tsx
import.meta.env.VITE_API_KEY
```

**Next.js:**
```bash
NEXT_PUBLIC_API_KEY=secret
```
```tsx
process.env.NEXT_PUBLIC_API_KEY
```

---

## Common Migration Issues

❌ Forgetting `'use client'`  
❌ Wrong import: `next/router` vs `next/navigation`  
❌ Accessing `window` in Server Components  
❌ Environment variables without `NEXT_PUBLIC_`  
❌ Not restarting dev server after env changes  

---

## Assignment

**Migrate Your Expense Tracker**

Convert your Vite expense tracker to Next.js:
- File-based routing
- Server & Client components
- API routes
- CRUD operations

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Deployment](https://vercel.com/docs)

---

## Notes for Instructor

- Emphasize the difference between Server and Client Components
- Show Chrome DevTools Network tab to demonstrate API calls
- Encourage students to experiment with the demo repo
- Common pitfalls:
  - Forgetting `'use client'` directive
  - Mixing server and client logic
  - Not handling async properly in Server Components