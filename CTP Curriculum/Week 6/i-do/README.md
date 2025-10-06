# Week 6 - I Do: Next.js App Router

## Overview

This is the instructor-led demonstration for Week 6. The instructor will build a Next.js Todo application from scratch, explaining each concept as they go.

## Topics Demonstrated

1. Setting up a Next.js project
2. Creating pages with the App Router
3. Understanding Server vs Client Components
4. Building layouts and navigation
5. Creating API routes
6. Implementing CRUD operations
7. Fetching data from API routes

## Demo Flow

### Part 1: Setup (5 min)
```bash
npx create-next-app@latest week06-demo
cd week06-demo
npm run dev
```

### Part 2: Pages and Layouts (15 min)
- Create `app/layout.tsx` with navigation
- Create `app/page.tsx` (home)
- Create `app/about/page.tsx`
- Explain file-based routing

### Part 3: Server vs Client Components (10 min)
- Show server component example (home page)
- Create client component with state (about page)
- Explain `'use client'` directive

### Part 4: API Routes (20 min)
- Create `app/api/todos/route.ts`
  - Implement GET (list all)
  - Implement POST (create)
- Create `app/api/todos/[id]/route.ts`
  - Implement GET (single)
  - Implement PUT (update)
  - Implement DELETE

### Part 5: Todo App (30 min)
- Create `app/todos/page.tsx` (list todos)
- Create `app/todos/new/page.tsx` (add form)
- Create `app/todos/[id]/page.tsx` (detail/edit)
- Demonstrate fetching and mutation

## Key Concepts to Emphasize

- **File-based routing**: Folder structure determines URLs
- **Server Components**: Default, no `'use client'` needed
- **Client Components**: For interactivity, state, effects
- **API Routes**: Backend endpoints in the same project
- **Navigation**: Using `<Link>` and `useRouter`

## Live Coding Tips

- Start with the simplest example
- Build incrementally
- Show the browser after each change
- Use Chrome DevTools to show network requests
- Explain errors when they happen
- Encourage questions throughout

## Code Repository

The complete code is available in `/workspaces/ctp-fall-wd-curriculum/week06-nextjs-demo`
