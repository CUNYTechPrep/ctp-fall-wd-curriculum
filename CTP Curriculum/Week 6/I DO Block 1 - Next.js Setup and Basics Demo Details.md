# I DO Block 1: Next.js Setup and Basics Demo - Detailed Guide

## Overview
Duration: 20 minutes  
Learning Target: Demonstrate Next.js project creation, file-based routing, and basic page structure

## Pre-Demo Setup
- Node.js installed in CodeSpace
- Terminal ready with clear screen
- Browser ready to show localhost:3000
- VS Code with file explorer visible

## Demo Flow

### Part 1: Create Next.js Project (5 minutes)

#### 1. Explain Next.js Purpose
"Next.js is a React framework that adds routing, server-side rendering, and build optimization. Think of it as React with superpowers built-in."

#### 2. Create New Project
```bash
# Create Next.js app
npx create-next-app@latest week06-demo

# Options to select:
# ✓ Would you like to use TypeScript? Yes
# ✓ Would you like to use ESLint? Yes
# ✓ Would you like to use Tailwind CSS? No (for simplicity)
# ✓ Would you like to use `src/` directory? No
# ✓ Would you like to use App Router? Yes (IMPORTANT!)
# ✓ Would you like to customize the default import alias? No
```

**Think-aloud:**
- "We're choosing the App Router - this is the new, recommended way"
- "TypeScript gives us better autocomplete and catches errors"
- "We'll skip Tailwind for now to focus on Next.js concepts"

#### 3. Explore Project Structure
```bash
cd week06-demo
tree -L 2 -I 'node_modules'
```

**Explain each directory:**
```
week06-demo/
├── app/              # App Router directory (our main focus)
│   ├── layout.tsx    # Root layout (wraps all pages)
│   ├── page.tsx      # Home page (/)
│   └── globals.css   # Global styles
├── public/           # Static files (images, etc.)
├── next.config.js    # Next.js configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript config
```

**Key Points:**
- "The app/ folder is where all our pages live"
- "layout.tsx wraps every page - perfect for navigation"
- "page.tsx files become actual routes"

### Part 2: Understanding Layouts and Pages (5 minutes)

#### 1. Examine Root Layout
```bash
# Open layout.tsx
code app/layout.tsx
```

**Explain the code:**
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Teaching Points:**
- "This wraps EVERY page in your app"
- "children is whatever page we're on"
- "Notice we're rendering the full HTML - this is server-side"
- "Perfect place for navigation, headers, footers"

#### 2. Examine Home Page
```bash
code app/page.tsx
```

**Explain:**
- "This is the home page - served at /"
- "It's a Server Component by default (runs on server)"
- "No 'use client' needed unless we want interactivity"

#### 3. Start Development Server
```bash
npm run dev
```

**Show in browser:**
- Navigate to http://localhost:3000
- "Notice hot reload - changes appear instantly"
- "Check the Network tab - HTML is pre-rendered"

### Part 3: File-Based Routing (6 minutes)

#### 1. Create About Page
```bash
# Create about directory and page
mkdir app/about
code app/about/page.tsx
```

**Type this live:**
```typescript
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page.</p>
    </div>
  )
}
```

**Explain:**
- "Folder name = route name"
- "app/about/page.tsx becomes /about"
- "Save and visit /about in browser"

#### 2. Demonstrate Dynamic Routes
```bash
# Create blog with dynamic route
mkdir -p app/blog/[slug]
code app/blog/[slug]/page.tsx
```

**Type this live:**
```typescript
export default function BlogPost({ 
  params 
}: { 
  params: { slug: string } 
}) {
  return (
    <div>
      <h1>Blog Post</h1>
      <p>You are reading: {params.slug}</p>
    </div>
  )
}
```

**Key Points:**
- "Square brackets make it dynamic"
- "params.slug gives us the URL value"
- "Try /blog/hello, /blog/world - all work!"

#### 3. Add Navigation to Layout
```bash
code app/layout.tsx
```

**Update with navigation:**
```typescript
import Link from 'next/link'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
          <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link href="/about" style={{ marginRight: '1rem' }}>About</Link>
          <Link href="/blog/my-first-post">Blog</Link>
        </nav>
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
```

**Explain:**
- "Link component for client-side navigation"
- "No page refresh - notice the speed!"
- "Navigation persists across pages"

### Part 4: Server vs Client Components (4 minutes)

#### 1. Create Counter (Client Component)
```bash
mkdir app/counter
code app/counter/page.tsx
```

**Type this live:**
```typescript
'use client'

import { useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Counter (Client Component)</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Key Teaching Moments:**
- "Notice the 'use client' at the top - THIS IS CRUCIAL"
- "Without it, we can't use useState, useEffect, or event handlers"
- "Client components run in the browser"
- "Server components (default) run on the server"

#### 2. Add to Navigation
```bash
code app/layout.tsx
```

**Add counter link:**
```typescript
<Link href="/counter" style={{ marginRight: '1rem' }}>Counter</Link>
```

#### 3. Demonstrate the Difference
**Show in browser:**
- "View page source on /about (server component) - full HTML"
- "View page source on /counter - less pre-rendered"
- "Use React DevTools to show component tree"

**Think-aloud:**
- "Server components: data fetching, static content"
- "Client components: interactivity, state, effects"
- "Use server by default, client when needed"

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors
- Check syntax carefully
- Ensure proper exports
- Verify file extensions (.tsx)

## Key Teaching Points

1. **File-Based Routing:**
   - Folder structure = URL structure
   - page.tsx creates a route
   - [param] creates dynamic routes

2. **Server vs Client:**
   - Server is default (faster, better SEO)
   - Client for interactivity
   - 'use client' directive is the switch

3. **Layouts:**
   - Shared UI across pages
   - Persist across navigation
   - Nested layouts are possible

## Think-Aloud Moments
- "Notice how fast navigation is - no full page reload"
- "The HTML is already rendered - great for SEO"
- "We're building a full-stack app in one project"
- "This same pattern works for huge applications"

## Wrap-up Questions
- "What happens if we forget 'use client'?"
- "How would you create a /blog page that lists all posts?"
- "When would you use a server component vs client component?"

## Transition to Block 2
"Now that we understand pages and routing, let's add API routes to handle data. This is where Next.js really shines - backend and frontend in one project."
