# Week 6: Next.js (App Router)
## Migrating from Vite to Next.js

---

## Agenda

1. What is Next.js? (10 min)
2. App Router vs Pages Router (5 min)
3. File-based Routing & Layouts (15 min)
4. Server vs Client Components (15 min)
5. Migrating from Vite (15 min)
6. Demo: Building a Todo App (20 min)
7. Q&A and Next Steps (10 min)

---

## What is Next.js?

**Next.js is a React framework** that gives you building blocks to create web applications.

By framework, we mean Next.js handles the tooling and configuration needed for React, and provides additional structure, features, and optimizations for your application.

---

## Why Next.js?

**Problems Next.js Solves:**
- ❌ Setting up routing manually (React Router)
- ❌ Configuring build tools (Vite, Webpack)
- ❌ SEO challenges with client-side rendering
- ❌ Slow initial page loads
- ❌ Need separate backend for API routes

**Next.js provides:**
- ✅ Built-in file-based routing
- ✅ Zero-config setup
- ✅ Server-side rendering for SEO
- ✅ Automatic code splitting
- ✅ API routes in the same project

---

## Next.js Features

- **File-based Routing**: Folder structure = URL structure
- **Server & Client Components**: Choose where code runs
- **API Routes**: Backend endpoints in same project
- **Image Optimization**: Automatic image compression
- **Fast Refresh**: See changes instantly
- **TypeScript Support**: Built-in, zero-config
- **CSS Support**: CSS Modules, Tailwind, Sass, etc.

---

## Who Uses Next.js?

- Netflix (streaming platform)
- TikTok (social media)
- Twitch (live streaming)
- Hulu (streaming service)
- Nike (e-commerce)
- Notion (productivity)
- OpenAI (ChatGPT interface)

**Next.js powers some of the world's largest websites!**

---

## App Router vs Pages Router

| Feature | Pages Router (Old) | App Router (New) |
|---------|-------------------|------------------|
| Directory | `pages/` | `app/` |
| Release | 2016 | 2022 (Next.js 13+) |
| Routing | File-based | File-based |
| Layouts | Manual | Built-in |
| Server Components | ❌ | ✅ |
| Data Fetching | `getServerSideProps` | `async/await` |
| Status | Maintained | **Recommended** |

**We'll use the App Router (new way)!**

---

## Project Structure

```
my-nextjs-app/
├── app/                    # App Router directory
│   ├── layout.tsx         # Root layout (required)
│   ├── page.tsx           # Home page (/)
│   ├── about/
│   │   └── page.tsx       # About page (/about)
│   ├── blog/
│   │   ├── page.tsx       # Blog list (/blog)
│   │   └── [slug]/
│   │       └── page.tsx   # Blog post (/blog/:slug)
│   └── api/               # API routes
│       └── hello/
│           └── route.ts   # API endpoint
├── public/                # Static files
├── package.json
└── next.config.js
```

---

## Creating a Next.js App

```bash
npx create-next-app@latest my-app

# Answer prompts:
✓ Would you like to use TypeScript? Yes
✓ Would you like to use ESLint? Yes
✓ Would you like to use Tailwind CSS? No (for now)
✓ Would you like to use `src/` directory? No
✓ Would you like to use App Router? Yes ← IMPORTANT!
✓ Would you like to customize the default import alias? No

cd my-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## File-based Routing

**In Next.js, folders define routes:**

| File | Route | URL |
|------|-------|-----|
| `app/page.tsx` | Home | `/` |
| `app/about/page.tsx` | About | `/about` |
| `app/blog/page.tsx` | Blog list | `/blog` |
| `app/blog/[slug]/page.tsx` | Blog post | `/blog/hello-world` |
| `app/products/[id]/page.tsx` | Product | `/products/123` |

**No routing configuration needed!**

---

## Creating a Page

Every route needs a `page.tsx` file:

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our Next.js app!</p>
    </div>
  )
}
```

**That's it!** Visit `/about` to see it.

---

## Layouts

Layouts wrap pages with shared UI (navigation, headers, footers).

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
        <main>{children}</main>
        <footer>© 2024 My App</footer>
      </body>
    </html>
  )
}
```

**Layouts persist across page navigation!**

---

## Nested Layouts

You can nest layouts for specific sections:

```
app/
├── layout.tsx           # Root layout (all pages)
├── page.tsx
└── dashboard/
    ├── layout.tsx       # Dashboard layout (only dashboard pages)
    ├── page.tsx         # /dashboard
    └── settings/
        └── page.tsx     # /dashboard/settings
```

Dashboard pages get **both** layouts applied!

---

## Dynamic Routes

Use square brackets `[param]` for dynamic segments:

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  return <h1>Post: {params.slug}</h1>
}
```

**Matches:**
- `/blog/hello-world` → `slug = "hello-world"`
- `/blog/nextjs-tutorial` → `slug = "nextjs-tutorial"`

---

## Navigation

**Use the `<Link>` component:**

```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  )
}
```

**Benefits:**
- Client-side navigation (no page reload)
- Automatic prefetching
- Faster than `<a>` tags

---

## Programmatic Navigation

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function MyButton() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

**Note:** Must be in a Client Component (`'use client'`)

---

## Server Components

**Default in Next.js App Router**

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

**No `useEffect` needed!** Data fetching happens on the server.

---

## Server Components Benefits

✅ **Better Performance**: Less JavaScript sent to browser  
✅ **SEO-Friendly**: HTML pre-rendered with data  
✅ **Security**: Sensitive code stays on server  
✅ **Direct Database Access**: No need for API routes  
✅ **Smaller Bundle**: React code runs on server  

**Use Server Components by default!**

---

## Client Components

**For interactivity: state, effects, event handlers**

```tsx
'use client' // ← This directive is REQUIRED

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Without `'use client'`, you'll get an error!**

---

## When to Use Each?

| Use Server Components for: | Use Client Components for: |
|----------------------------|----------------------------|
| Fetching data | State (`useState`) |
| Accessing backend resources | Effects (`useEffect`) |
| Keeping sensitive info secret | Event handlers (`onClick`) |
| Large dependencies | Browser APIs |
| Static content | Interactivity |

**Rule of thumb:** Server by default, Client when needed.

---

## Server vs Client Example

```tsx
// Server Component (default)
async function ServerPosts() {
  const posts = await fetch('...').then(r => r.json())
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
}

// Client Component (interactive)
'use client'
function ClientCounter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}

// Mix them together!
export default function Page() {
  return (
    <>
      <ServerPosts />
      <ClientCounter />
    </>
  )
}
```

---

## API Routes

Create backend endpoints in the same project:

```tsx
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello from API!' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ received: body })
}
```

**Access at:** `http://localhost:3000/api/hello`

---

## API Route Methods

```tsx
// app/api/todos/route.ts
export async function GET() { /* ... */ }
export async function POST(request) { /* ... */ }
export async function PUT(request) { /* ... */ }
export async function DELETE(request) { /* ... */ }
```

Each HTTP method is a separate export!

---

## Dynamic API Routes

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id
  
  return NextResponse.json({ 
    user: `User ${userId}` 
  })
}
```

**Matches:** `/api/users/123`, `/api/users/456`, etc.

---

## Migrating from Vite to Next.js

**Key Changes:**

| Vite | Next.js |
|------|---------|
| React Router | File-based routing |
| `<Link to="">` | `<Link href="">` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` |
| All client-side | Server + Client Components |
| Separate backend | Built-in API routes |

---

## Migration Step 1: Create Next.js Project

```bash
# Create new Next.js app
npx create-next-app@latest my-app-nextjs

# Choose App Router: Yes ✓
```

Don't delete your Vite app yet! We'll migrate piece by piece.

---

## Migration Step 2: Identify Component Types

**Review each component:**

```tsx
// ✅ Server Component (no state/effects/handlers)
function Header() {
  return <header><h1>My App</h1></header>
}

// ❌ Client Component (has state)
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Add `'use client'` only to components that need it!**

---

## Migration Step 3: Convert Routes

**Vite with React Router:**
```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/blog/:id" element={<BlogPost />} />
</Routes>
```

**Next.js:**
```
app/
├── page.tsx           # Home (/)
├── about/
│   └── page.tsx       # About (/about)
└── blog/
    └── [id]/
        └── page.tsx   # BlogPost (/blog/:id)
```

---

## Migration Step 4: Update Navigation

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

**Simple find-and-replace!**

---

## Migration Step 5: Environment Variables

**Vite (`.env`):**
```bash
VITE_API_URL=https://api.example.com
VITE_API_KEY=secret123
```

**Next.js (`.env.local`):**
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
API_KEY=secret123
```

**Usage:**
```tsx
// Vite
const url = import.meta.env.VITE_API_URL

// Next.js
const url = process.env.NEXT_PUBLIC_API_URL
```

---

## Migration Step 6: Move API Logic

If you have a separate backend, you can move it to API routes:

**Before (Vite + Express):**
```javascript
// server.js
app.get('/api/todos', (req, res) => {
  res.json(todos)
})
```

**After (Next.js):**
```tsx
// app/api/todos/route.ts
export async function GET() {
  return NextResponse.json(todos)
}
```

**One project instead of two!**

---

## Migration Checklist

- [ ] Create new Next.js project
- [ ] Copy components to `app/` directory
- [ ] Add `'use client'` to interactive components
- [ ] Convert React Router routes to file-based routes
- [ ] Update `<Link>` and `useRouter` imports
- [ ] Update environment variables
- [ ] Move API logic to API routes (optional)
- [ ] Test each page
- [ ] Update deployment config

---

## Common Migration Issues

**Issue:** `useState` not working  
**Fix:** Add `'use client'` to top of file

**Issue:** `window is not defined`  
**Fix:** Use `useEffect` or check `typeof window !== 'undefined'`

**Issue:** Routes not found  
**Fix:** Make sure you have `page.tsx` in each route folder

**Issue:** Environment variables undefined  
**Fix:** Use `.env.local` and prefix with `NEXT_PUBLIC_`

---

## Demo: Todo App

Let's build a complete todo app together:

**Features:**
- List todos (`/todos`)
- Add todo (`/todos/new`)
- View/edit todo (`/todos/[id]`)
- API routes for CRUD operations

**We'll demonstrate:**
- File-based routing
- Server & Client Components
- Forms and navigation
- API routes

---

## Demo: Project Structure

```
app/
├── layout.tsx              # Root layout with nav
├── page.tsx                # Home page
├── todos/
│   ├── page.tsx           # List todos
│   ├── new/
│   │   └── page.tsx       # Add todo
│   └── [id]/
│       └── page.tsx       # Todo detail
└── api/
    └── todos/
        ├── route.ts       # GET, POST
        └── [id]/
            └── route.ts   # GET, PUT, DELETE
```

---

## Demo: API Routes

```tsx
// app/api/todos/route.ts
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
```

---

## Demo: List Todos

```tsx
// app/todos/page.tsx
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

---

## Demo: Add Todo

```tsx
// app/todos/new/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTodoPage() {
  const [text, setText] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
    router.push('/todos')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button>Add</button>
    </form>
  )
}
```

---

## Best Practices

✅ Use Server Components by default  
✅ Add `'use client'` only when needed  
✅ Use `<Link>` for navigation (not `<a>`)  
✅ Use TypeScript for type safety  
✅ Keep API routes simple  
✅ Use environment variables for secrets  
✅ Organize by feature, not type  

---

## Performance Tips

- **Image Optimization:** Use `<Image>` component
- **Code Splitting:** Automatic with file-based routing
- **Lazy Loading:** Use `dynamic()` for heavy components
- **Caching:** Next.js caches fetch requests automatically
- **Static Generation:** Pre-render pages at build time

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)

---

## Common Pitfalls to Avoid

❌ Forgetting `'use client'` for interactive components  
❌ Using `next/router` instead of `next/navigation`  
❌ Accessing `window` in Server Components  
❌ Not prefixing public env vars with `NEXT_PUBLIC_`  
❌ Missing `page.tsx` in route folders  
❌ Using `<a>` instead of `<Link>`  

---

## Questions?

**Today we covered:**
- ✅ What Next.js is and why use it
- ✅ App Router vs Pages Router
- ✅ File-based routing and layouts
- ✅ Server vs Client Components
- ✅ Migrating from Vite
- ✅ Building a complete app

**Next week:** CI/CD & Deployment

---

## Next Steps

1. **Today:** Start migrating your expense tracker
2. **This week:** Complete the migration
3. **Ask questions:** In class, office hours, or Discord
4. **Explore:** Try adding new features to your app
5. **Read docs:** Next.js documentation is excellent

**Let's build something amazing with Next.js!** 🚀

---
