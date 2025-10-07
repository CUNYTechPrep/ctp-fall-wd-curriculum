# Week 6 Lesson Plan: Next.js & Migration from Vite

## Overview
This week introduces Next.js, a powerful React framework that provides built-in routing, server-side rendering, and API routes. Students will learn the fundamentals of the Next.js App Router and migrate their existing Vite expense tracker application to Next.js.

## Learning Objectives

By the end of this week, fellows will be able to:

1. **Understand Next.js fundamentals:** Explain what Next.js is, its benefits, and when to use it
2. **Distinguish App Router from Pages Router:** Understand the differences and why App Router is recommended
3. **Implement file-based routing:** Create pages, nested routes, and dynamic routes using the App Router
4. **Build layouts:** Create shared layouts and understand layout composition
5. **Differentiate Server and Client Components:** Know when to use each and how to implement them
6. **Migrate Vite applications:** Convert existing Vite/React applications to Next.js
7. **Create API routes:** Build backend endpoints within the Next.js application
8. **Build full-stack features:** Implement complete CRUD operations with frontend and backend

## Pre-Class Preparation

### For Instructors:
- [ ] Set up Next.js demo project with todo app
- [ ] Prepare side-by-side comparison of Vite and Next.js versions
- [ ] Test all demo code and ensure dependencies are up to date
- [ ] Review common migration issues and solutions
- [ ] Prepare LocalHost development environment

### For Students:
- [ ] Complete Week 5 review assignments
- [ ] Have Vite expense tracker application ready
- [ ] Review React fundamentals (components, state, props)
- [ ] Ensure Node.js 18+ is installed
- [ ] Read: [Next.js Documentation - Getting Started](https://nextjs.org/docs)

## Session Outline (3 hours)

### Block 1: Introduction to Next.js (30 minutes)

**Lecture (15 min):**
- What is Next.js and why use it?
- Next.js vs Vite
- App Router vs Pages Router
- Real-world examples (Netflix, TikTok, Twitch)

**Demo (15 min):**
- Create a new Next.js project: `npx create-next-app@latest`
- Walk through project structure
- Explain key files: `layout.tsx`, `page.tsx`, `next.config.js`
- Run dev server and explore the default app
- Show hot reload and fast refresh

**Key Talking Points:**
- "Next.js is framework on top of React - it provides structure and conventions"
- The App Router maps web urls to files
- From Vite -> NextJS: Components are transferrable (with use-client)

### Block 2: File-Based Routing & Layouts (45 minutes)

**I DO - Instructor Demo (20 min):**
- Create multiple pages: home, about, blog
- Discuss nested routes: `app/blog/[slug]/page.tsx`
- Discuss shared layout with navigation
- Show how layouts compose and persist
- Demonstrate `<Link>` component for navigation

**Code Example:**
```tsx
// app/layout.tsx
import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}

// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>
}
```

**WE DO - Guided Practice (15 min):**
- Students create their own pages
- Add navigation links
- Create a dynamic route
- Test navigation between pages

**YOU DO - Independent Practice (10 min):**
- Create a contact page
- Add it to navigation
- Create a `/products/[id]` dynamic route
- Share screens and troubleshoot together

**Common Issues to Address:**
- Forgetting to create `page.tsx` in route folders
- Confusion about when to use folders vs files
- Layout not applying to all pages

### Block 3: Server vs Client Components (40 minutes)

**Lecture (15 min):**
- What are Server Components?
- What are Client Components?
- When to use each
- The `'use client'` directive
- Performance implications

**Visual Aid:**
```
Server Components (Default)     Client Components ('use client')
├─ Run on server                ├─ Run in browser
├─ Can access backend           ├─ Can use state/effects
├─ Better for SEO               ├─ Can have event handlers
├─ Smaller bundle size          ├─ Interactive features
└─ Cannot use hooks             └─ Needs 'use client' directive
```

**I DO - Instructor Demo (15 min):**
```tsx
// Server Component (default)
async function ServerPosts() {
  const posts = await fetch('https://api.example.com/posts')
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
}

// Client Component
'use client'
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// Mix them together
export default function Page() {
  return (
    <>
      <ServerPosts />
      <Counter />
    </>
  )
}
```

**WE DO - Guided Practice (10 min):**
- Identify which components from their Vite app need `'use client'`
- Convert a simple component to Next.js
- Add `'use client'` where needed
- Test and verify functionality

**Key Talking Points:**
- "Server Components are the default - only add 'use client' when you need interactivity"
- "If you see 'useState is not a function', you forgot 'use client'"
- "Most of your app can be Server Components - better performance!"

### Break (10 minutes)

### Block 4: Migrating from Vite to Next.js (45 minutes)

**Lecture (10 min):**
- Key differences between Vite and Next.js
- Migration strategy overview
- Common pitfalls and solutions

**Comparison Table:**
| Aspect | Vite | Next.js |
|--------|------|---------|
| Routing | React Router | File-based |
| Navigation | `<Link to="">` | `<Link href="">` |
| Navigate | `useNavigate()` | `useRouter()` from `next/navigation` |
| Env Vars | `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` |
| Entry | `main.tsx` | `layout.tsx` |

**I DO - Live Migration (20 min):**
- Take a Vite component from expense tracker
- Create equivalent Next.js structure
- Update imports and navigation
- Add `'use client'` where needed
- Test the migrated component

**Migration Checklist (show on screen):**
- [ ] Create new Next.js project
- [ ] Copy components to `app/` directory
- [ ] Convert routes to file-based structure
- [ ] Update all `<Link>` imports and props
- [ ] Update `useNavigate` to `useRouter`
- [ ] Add `'use client'` to interactive components
- [ ] Update environment variables
- [ ] Test all pages and navigation

**WE DO - Guided Migration (15 min):**
- Students start migrating one page from their expense tracker
- Instructor circulates and helps
- Address common issues as they arise

**Common Migration Issues:**
```tsx
// ❌ Wrong - Vite style
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()

// ✅ Correct - Next.js style
'use client'
import { useRouter } from 'next/navigation'
const router = useRouter()

// ❌ Wrong - accessing window in Server Component
const width = window.innerWidth

// ✅ Correct - use effect in Client Component
'use client'
useEffect(() => {
  const width = window.innerWidth
}, [])
```

### Block 5: API Routes (40 minutes)

**Lecture (10 min):**
- What are API routes in Next.js?
- File-based API routing
- HTTP methods (GET, POST, PUT, DELETE)
- `NextRequest` and `NextResponse`

**I DO - Create API Routes (20 min):**
```tsx
// app/api/todos/route.ts
import { NextResponse } from 'next/server'

let todos = []
let nextId = 1

export async function GET() {
  return NextResponse.json(todos)
}

export async function POST(request) {
  const { text } = await request.json()
  const todo = { id: nextId++, text, done: false }
  todos.push(todo)
  return NextResponse.json(todo, { status: 201 })
}

// app/api/todos/[id]/route.ts
export async function GET(request, { params }) {
  const todo = todos.find(t => t.id === Number(params.id))
  if (!todo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(todo)
}

export async function PUT(request, { params }) {
  const data = await request.json()
  const index = todos.findIndex(t => t.id === Number(params.id))
  todos[index] = { ...todos[index], ...data }
  return NextResponse.json(todos[index])
}

export async function DELETE(request, { params }) {
  todos = todos.filter(t => t.id !== Number(params.id))
  return NextResponse.json({ success: true })
}
```

**WE DO - Test API Routes (10 min):**
- Use browser to test GET endpoint
- Use `curl` or Postman to test POST
- Show DevTools Network tab
- Demonstrate error handling

### Block 6: Building a Complete Todo App (30 minutes)

**I DO - Complete CRUD App (30 min):**

Build the full application together:

1. **List Todos Page** (`app/todos/page.tsx`)
```tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TodosPage() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch('/api/todos')
      .then(r => r.json())
      .then(setTodos)
  }, [])

  return (
    <div>
      <h1>Todos</h1>
      <Link href="/todos/new">Add Todo</Link>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <Link href={`/todos/${todo.id}`}>{todo.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

2. **Add Todo Page** (`app/todos/new/page.tsx`)
3. **Todo Detail Page** (`app/todos/[id]/page.tsx`)

**Key Teaching Moments:**
- "See how the API route and frontend are in the same project?"
- "Notice we're using fetch to our own API - it's just like any other API"
- "The `useRouter` hook lets us navigate after creating a todo"

## Homework Assignment

### Assignment: Migrate Your Expense Tracker to Next.js

**Objective:** Convert your existing Vite expense tracker application to Next.js using the App Router.

**Requirements:**

1. **Setup (Required):**
   - [ ] Create new Next.js project with TypeScript
   - [ ] Use App Router (not Pages Router)
   - [ ] Set up proper `.gitignore` and `.env.local`

2. **Pages (Required):**
   - [ ] Home page showing expense summary
   - [ ] Expenses list page with filtering
   - [ ] Add expense page with form
   - [ ] Expense detail page (view/edit/delete)
   - [ ] All pages properly navigable with `<Link>`

3. **Components (Required):**
   - [ ] Identify and migrate all components
   - [ ] Add `'use client'` only where needed
   - [ ] Create a shared layout with navigation
   - [ ] Maintain existing styling

4. **Routing (Required):**
   - [ ] Use file-based routing for all pages
   - [ ] Implement dynamic route for expense detail
   - [ ] Replace all React Router code with Next.js navigation

5. **API Routes (Optional - Bonus):**
   - [ ] Create API routes for CRUD operations
   - [ ] Move data management to API layer
   - [ ] Update frontend to use API routes

6. **Documentation (Required):**
   - [ ] Update README with Next.js setup instructions
   - [ ] Document migration decisions
   - [ ] Note differences from Vite version

**Submission:**
- Push to GitHub with tag `week6-nextjs-migration`
- Submit GitHub repository link
- Include a brief reflection (3-5 sentences) on what was challenging

**Evaluation Criteria:**
- [ ] Application runs without errors
- [ ] All pages accessible and functional
- [ ] Proper use of Server vs Client Components
- [ ] Correct file-based routing structure
- [ ] Clean code with proper TypeScript types
- [ ] Git history shows incremental progress

**Bonus Challenges:**
- Deploy to Vercel
- Add loading states and error handling
- Implement API routes for all CRUD operations
- Add form validation
- Create a custom 404 page

## Additional Resources

### Documentation:
- [Next.js Official Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Migration from Vite](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)

### Video Tutorials:
- [Next.js App Router Tutorial](https://www.youtube.com/watch?v=gSSsZReIFRk)
- [Server vs Client Components Explained](https://www.youtube.com/watch?v=VIwWgV3Lc6s)

### Practice Projects:
- [Next.js Examples Repository](https://github.com/vercel/next.js/tree/canary/examples)
- [Learn Next.js](https://nextjs.org/learn)

## Instructor Notes

### Time Management:
- If running short on time, prioritize Blocks 1-4
- API Routes (Block 5) can be homework if needed
- The Todo app (Block 6) reinforces everything learned

### Common Student Questions:

**Q: "Why use Next.js when Vite is simpler?"**
A: Next.js provides routing, SEO, and backend in one package. As apps grow, these features become essential. It's also the industry standard for React apps.

**Q: "When should I use Server Components?"**
A: Use Server Components by default. Only add `'use client'` when you need state, effects, or event handlers.

**Q: "Can I still use React Router?"**
A: Technically yes, but it defeats the purpose of Next.js. File-based routing is simpler and more powerful.

**Q: "Do I need a separate backend?"**
A: Not for simple CRUD operations. API routes can handle most backend needs. For complex logic or databases, you might want a separate backend later.

### Troubleshooting Guide:

**Error: "You're importing a component that needs useState..."**
- Solution: Add `'use client'` to the top of the file

**Error: "window is not defined"**
- Solution: Use `useEffect` or check `typeof window !== 'undefined'`

**Error: "Module not found: Can't resolve 'next/link'"**
- Solution: Wrong import path. Should be `import Link from 'next/link'` (not `next/router`)

**Error: "Page not found" (404)**
- Solution: Make sure you have `page.tsx` in the route folder

### Assessment Checkpoints:

**During Class:**
- [ ] Students can create a new Next.js project
- [ ] Students understand file-based routing
- [ ] Students can distinguish Server vs Client Components
- [ ] Students can create a simple page with navigation

**By End of Week:**
- [ ] Migrated expense tracker is functional
- [ ] Proper use of `'use client'` directive
- [ ] File-based routing implemented correctly
- [ ] Code is pushed to GitHub

### Next Week Preview:
"Next week we'll add CI/CD to your Next.js apps and deploy them. Your migrated expense tracker will be live on the internet!"

## Reflection Questions for Students

Post these in Discord/Slack after class:

1. What was the most challenging part of migrating from Vite to Next.js?
2. When would you choose to use a Client Component vs Server Component?
3. How does file-based routing compare to React Router in terms of developer experience?
4. What feature of Next.js are you most excited to use in your team project?

## Success Metrics

By the end of this week, successful students will:
- [ ] Have a working Next.js application migrated from Vite
- [ ] Understand when to use Server vs Client Components
- [ ] Be comfortable with file-based routing
- [ ] Know how to create and use API routes
- [ ] Be ready to deploy Next.js apps in Week 7
