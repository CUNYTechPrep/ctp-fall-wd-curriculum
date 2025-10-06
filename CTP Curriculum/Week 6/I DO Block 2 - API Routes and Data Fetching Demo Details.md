# I DO Block 2: API Routes and Data Fetching Demo - Detailed Guide

## Overview
Duration: 25 minutes  
Learning Target: Demonstrate creating API routes and fetching data in Next.js

## Pre-Demo Setup
- Next.js project from Block 1 running
- Browser DevTools open (Network tab)
- Terminal ready for testing with curl
- VS Code ready

## Demo Flow

### Part 1: Create First API Route (7 minutes)

#### 1. Explain API Routes Purpose
"API routes let us create backend endpoints in the same Next.js project. No separate Express server needed!"

#### 2. Create Hello API Route
```bash
# Create API directory structure
mkdir -p app/api/hello
code app/api/hello/route.ts
```

**Type this live:**
```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString()
  })
}
```

**Explain:**
- "route.ts is special - it handles HTTP requests"
- "GET function handles GET requests"
- "NextResponse.json returns JSON"
- "This becomes /api/hello endpoint"

#### 3. Test the API Route
```bash
# Test with curl
curl http://localhost:3000/api/hello
```

**Show in browser:**
- Navigate to http://localhost:3000/api/hello
- "See? Just a JSON API endpoint!"
- Show Network tab - 200 OK response

#### 4. Add POST Handler
```typescript
// Add to route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ 
    message: 'Data received!',
    data: body
  })
}
```

**Test with curl:**
```bash
curl -X POST http://localhost:3000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"name":"Student"}'
```

### Part 2: Build Todo API (10 minutes)

#### 1. Create In-Memory Data Store
```bash
code app/api/todos/route.ts
```

**Type this live:**
```typescript
import { NextRequest, NextResponse } from 'next/server'

// In-memory storage (will reset on server restart)
let todos: { id: number; text: string; done: boolean }[] = [
  { id: 1, text: 'Learn Next.js', done: false },
  { id: 2, text: 'Build a project', done: false }
]

let nextId = 3

export async function GET() {
  return NextResponse.json(todos)
}

export async function POST(request: NextRequest) {
  const { text } = await request.json()
  
  const newTodo = {
    id: nextId++,
    text,
    done: false
  }
  
  todos.push(newTodo)
  
  return NextResponse.json(newTodo, { status: 201 })
}
```

**Key Points:**
- "This is in-memory - resets on restart"
- "In production, you'd use a database"
- "Status 201 means 'Created'"

#### 2. Test the Todos API
```bash
# Get all todos
curl http://localhost:3000/api/todos

# Create a new todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"Test the API"}'

# Get todos again to see the new one
curl http://localhost:3000/api/todos
```

#### 3. Create Single Todo Route
```bash
mkdir -p app/api/todos/[id]
code app/api/todos/[id]/route.ts
```

**Type this live:**
```typescript
import { NextRequest, NextResponse } from 'next/server'

// Import todos from parent route (simplified for demo)
// In production, use a shared data layer
let todos: { id: number; text: string; done: boolean }[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const todo = todos.find(t => t.id === Number(params.id))
  
  if (!todo) {
    return NextResponse.json(
      { error: 'Todo not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(todo)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { text, done } = await request.json()
  const index = todos.findIndex(t => t.id === Number(params.id))
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Todo not found' },
      { status: 404 }
    )
  }
  
  todos[index] = { ...todos[index], text, done }
  
  return NextResponse.json(todos[index])
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = todos.findIndex(t => t.id === Number(params.id))
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Todo not found' },
      { status: 404 }
    )
  }
  
  todos.splice(index, 1)
  
  return NextResponse.json({ success: true })
}
```

**Explain:**
- "params gives us the [id] from URL"
- "Each HTTP method (GET, PUT, DELETE) is a separate function"
- "404 status when todo not found"

### Part 3: Fetch Data in Client Component (8 minutes)

#### 1. Create Todos List Page
```bash
code app/todos/page.tsx
```

**Type this live:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Todo = {
  id: number
  text: string
  done: boolean
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => {
        setTodos(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>My Todos</h1>
      <Link href="/todos/new">Add New Todo</Link>
      <ul style={{ marginTop: '1rem' }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ padding: '0.5rem 0' }}>
            <Link href={`/todos/${todo.id}`}>
              {todo.text} {todo.done && '✅'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Key Teaching Moments:**
- "useEffect runs after component mounts"
- "We fetch from our own API route"
- "Loading state improves user experience"
- "Open Network tab - see the API call!"

#### 2. Add to Navigation
```bash
code app/layout.tsx
```

**Add todos link:**
```typescript
<Link href="/todos" style={{ marginRight: '1rem' }}>Todos</Link>
```

#### 3. Show in Browser
- Navigate to /todos
- Open DevTools Network tab
- "See the fetch request to /api/todos"
- "The data loads after the page"

## Common Issues & Solutions

### Data Not Persisting
**Explain:**
- "In-memory storage resets on server restart"
- "In production, use PostgreSQL, MongoDB, etc."

### CORS Errors
- "Won't happen with Next.js - same origin"
- "API and frontend in same project"

### Type Errors
```typescript
// Always define types for clarity
type Todo = {
  id: number
  text: string
  done: boolean
}
```

## Key Teaching Points

1. **API Routes:**
   - Create backend in same project
   - File-based like pages
   - Each HTTP method is a function

2. **Data Fetching:**
   - Client components use fetch/useEffect
   - Server components can use async/await directly
   - Loading states improve UX

3. **Request/Response:**
   - NextRequest for request data
   - NextResponse for responses
   - Proper status codes (200, 201, 404)

## Think-Aloud Moments
- "Notice we didn't need to set up Express or configure CORS"
- "The API route and frontend are perfectly in sync"
- "In DevTools, you can see exactly what data is being sent"
- "This pattern scales to production applications"

## Wrap-up Questions
- "What's the difference between a page and an API route?"
- "When would you use GET vs POST?"
- "Why do we need 'use client' for the todos page?"

## Transition to Block 3
"We can fetch data, but we need to add and edit todos. Next, we'll build forms and handle mutations to complete our CRUD application."
