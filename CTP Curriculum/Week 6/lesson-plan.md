# Week 6 Lesson Plan: Next.js (App Router)

## Learning Objectives

By the end of this week, students will be able to:
1. Understand what Next.js is and why it's useful
2. Differentiate between the App Router and Pages Router
3. Create pages and layouts using the App Router
4. Understand Server Components vs Client Components
5. **Migrate existing Vite/React components to Next.js**
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

### Part 4: Migrating from Vite to Next.js (30 min)
- **Key Differences**
  - React Router → File-based routing
  - Import.meta.env → process.env
  - Vite config → Next.js config
  
- **Migration Steps**
  - Converting components to pages
  - Adding `'use client'` where needed
  - Moving API calls to API routes
  - Updating navigation from React Router to Next.js Link

- **Common Pitfalls**
  - Window/document access (use useEffect)
  - Environment variables (.env.local)
  - CSS imports and modules

### Part 5: API Routes (30 min)
- **Creating API Routes**
  - `app/api/todos/route.ts` → GET, POST
  - `app/api/todos/[id]/route.ts` → GET, PUT, DELETE
  
- **Request and Response**
  - `NextRequest`, `NextResponse`
  - Handling JSON data
  - HTTP methods

### Part 6: Building the Todo App (30-60 min)
- **Demo Walkthrough**
  - Migrate Vite expense tracker components
  - List todos (`/todos`)
  - Add todo (`/todos/new`)
  - View/edit todo (`/todos/[id]`)
  - API routes for CRUD operations

- **Hands-on Coding**
  - Students follow along
  - Implement features step-by-step

---

## Assignment

**Migrate Your Expense Tracker to Next.js**

Requirements:
1. Use Next.js App Router
2. Convert existing Vite components to Next.js pages
3. Add `'use client'` directive where needed
4. Create at least 2 API routes (GET, POST)
5. Use both Server and Client Components
6. Implement basic CRUD operations

**Due:** Before Week 7

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Migrating from Vite](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)

---

## Notes for Instructor

- Emphasize the difference between Server and Client Components
- Show Chrome DevTools Network tab to demonstrate API calls
- Highlight migration patterns from Vite to Next.js
- Reference students' existing expense tracker projects
- Common pitfalls:
  - Forgetting `'use client'` directive
  - Mixing server and client logic
  - Not handling async properly in Server Components
  - Window/document access in Server Components
