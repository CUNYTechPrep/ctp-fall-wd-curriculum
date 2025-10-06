# I DO Block 4: Migrating Vite to Next.js Demo - Detailed Guide

## Overview
Duration: 25 minutes  
Learning Target: Demonstrate how to migrate a Vite/React application to Next.js

## Pre-Demo Setup
- Have a simple Vite expense tracker ready
- New Next.js project created
- Both projects open in VS Code (split view)
- Terminal ready

## Demo Flow

### Part 1: Understanding the Differences (5 minutes)

#### 1. Compare Project Structures
**Show Vite structure:**
```
vite-app/
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
├── public/
├── index.html
└── vite.config.ts
```

**Show Next.js structure:**
```
nextjs-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
├── public/
└── next.config.js
```

**Explain:**
- "Vite has a single entry point (index.html + main.tsx)"
- "Next.js uses file-based routing (no index.html)"
- "Next.js includes built-in API routes"

#### 2. Key Migration Points
**Routing:**
- Vite: React Router (`<Route>`, `<Link>`, `useNavigate`)
- Next.js: File-based (`page.tsx`, `<Link>`, `useRouter`)

**Environment Variables:**
- Vite: `import.meta.env.VITE_API_KEY`
- Next.js: `process.env.NEXT_PUBLIC_API_KEY`

**Dev Server:**
- Vite: `npm run dev` (port 5173)
- Next.js: `npm run dev` (port 3000)

### Part 2: Migrate Components (8 minutes)

#### 1. Identify Component Types
**Show Vite ExpenseList component:**
```typescript
// Vite: src/components/ExpenseList.tsx
import { useState, useEffect } from 'react'

export function ExpenseList() {
  const [expenses, setExpenses] = useState([])
  
  useEffect(() => {
    fetch('/api/expenses')
      .then(r => r.json())
      .then(setExpenses)
  }, [])
  
  return (
    <div>
      <h1>Expenses</h1>
      <ul>
        {expenses.map(e => <li key={e.id}>{e.name}</li>)}
      </ul>
    </div>
  )
}
```

**Explain:**
- "This uses useState and useEffect"
- "It's interactive - needs `'use client'`"
- "Let's migrate this to Next.js"

#### 2. Create Next.js Page
```bash
code app/expenses/page.tsx
```

**Type this live:**
```typescript
'use client'

import { useState, useEffect } from 'react'

type Expense = {
  id: number
  name: string
  amount: number
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  
  useEffect(() => {
    fetch('/api/expenses')
      .then(r => r.json())
      .then(setExpenses)
  }, [])
  
  return (
    <div>
      <h1>Expenses</h1>
      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.name} - ${e.amount}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Key Points:**
- "Added `'use client'` at the top"
- "Changed export to default"
- "The rest is identical!"

#### 3. Migrate Static Component
**Show Vite Header component:**
```typescript
// Vite: src/components/Header.tsx
export function Header() {
  return (
    <header>
      <h1>Expense Tracker</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/expenses">Expenses</a>
      </nav>
    </header>
  )
}
```

**Explain:**
- "This is just static markup"
- "No state, no effects"
- "Perfect for Server Component!"

**Create Next.js version:**
```bash
code app/components/Header.tsx
```

**Type this live:**
```typescript
import Link from 'next/link'

export function Header() {
  return (
    <header>
      <h1>Expense Tracker</h1>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/expenses">Expenses</Link>
      </nav>
    </header>
  )
}
```

**Key Points:**
- "No `'use client'` needed!"
- "Changed `<a>` to `<Link>`"
- "Changed `href` paths to Next.js routes"

### Part 3: Migrate Routing (6 minutes)

#### 1. Show Vite Router
```typescript
// Vite: src/router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/expenses/:id" element={<ExpenseDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**Explain:**
- "In Vite, we define routes in code"
- "In Next.js, we define routes with files"

#### 2. Create Equivalent Next.js Routes
```bash
# Create route structure
mkdir -p app/expenses/[id]
touch app/page.tsx
touch app/expenses/page.tsx
touch app/expenses/[id]/page.tsx
```

**Show the mapping:**
| Vite Route | Next.js File |
|------------|--------------|
| `path="/"` | `app/page.tsx` |
| `path="/expenses"` | `app/expenses/page.tsx` |
| `path="/expenses/:id"` | `app/expenses/[id]/page.tsx` |

#### 3. Migrate Navigation
**Vite navigation:**
```typescript
import { useNavigate } from 'react-router-dom'

function AddButton() {
  const navigate = useNavigate()
  return <button onClick={() => navigate('/expenses/new')}>Add</button>
}
```

**Next.js navigation:**
```typescript
'use client'
import { useRouter } from 'next/navigation'

function AddButton() {
  const router = useRouter()
  return <button onClick={() => router.push('/expenses/new')}>Add</button>
}
```

**Explain:**
- "Import from `next/navigation` (NOT `next/router`)"
- "`router.push()` instead of `navigate()`"
- "Still needs `'use client'` for onClick"

### Part 4: Migrate Environment Variables (3 minutes)

#### 1. Show Vite Environment Variables
```typescript
// Vite: .env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=secret123

// Usage in code:
const apiUrl = import.meta.env.VITE_API_URL
```

#### 2. Convert to Next.js
```bash
# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000
API_KEY=secret123
EOF
```

**Update code:**
```typescript
// Next.js: Client-side
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// Next.js: Server-side (API routes)
const apiKey = process.env.API_KEY
```

**Explain:**
- "Use `.env.local` (not `.env`)"
- "`NEXT_PUBLIC_` prefix for client-side access"
- "No prefix needed for server-only variables"
- "Restart dev server after changes!"

### Part 5: Common Migration Issues (3 minutes)

#### 1. Window/Document Access
**Problem:**
```typescript
// This breaks in Server Components
const width = window.innerWidth
```

**Solution:**
```typescript
'use client'
import { useEffect, useState } from 'react'

function Component() {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])
  
  return <div>Width: {width}</div>
}
```

#### 2. CSS Imports
**Vite:**
```typescript
import './styles.css'
```

**Next.js - Option 1 (Global):**
```typescript
// app/layout.tsx
import './globals.css'
```

**Next.js - Option 2 (Modules):**
```typescript
import styles from './component.module.css'
```

#### 3. Absolute Imports
**Vite:**
```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': '/src'
  }
}

// Usage:
import { Button } from '@/components/Button'
```

**Next.js:**
```typescript
// tsconfig.json (already configured)
"paths": {
  "@/*": ["./*"]
}

// Usage (same):
import { Button } from '@/components/Button'
```

## Migration Checklist

**Use this during demo:**
- [ ] Create Next.js project
- [ ] Identify Server vs Client components
- [ ] Add `'use client'` to interactive components
- [ ] Convert React Router to file-based routing
- [ ] Update `<Link>` and `useRouter` imports
- [ ] Migrate environment variables
- [ ] Move API logic to API routes
- [ ] Update CSS imports
- [ ] Test each page

## Key Teaching Points

1. **Not Everything Needs Migration:**
   - Start with one page/feature
   - Incremental migration is fine
   - Keep Vite running while building Next.js

2. **Server Components Are Default:**
   - Only add `'use client'` when needed
   - Server components are faster
   - Better for SEO

3. **File-Based Routing:**
   - Simpler than React Router config
   - Easier to understand URL structure
   - No route configuration file

## Think-Aloud Moments
- "Most components just need `'use client'` added"
- "The actual React code stays the same"
- "File-based routing is easier to visualize"
- "This is why Next.js is becoming the standard"

## Wrap-up Questions
- "Which components should be Server Components?"
- "What changes are needed for routing?"
- "How do environment variables differ?"

## Next Steps
"Now take your expense tracker and migrate it. Start with one page, test it, then migrate the next. You'll be surprised how similar it is!"
