# I DO Block 3: Complete Todo App Demo - Detailed Guide

## Overview
Duration: 30 minutes  
Learning Target: Complete the CRUD todo application with forms and detail pages

## Pre-Demo Setup
- Next.js project with API routes from Block 2
- Browser ready with /todos page open
- DevTools ready (Network and Console tabs)

## Demo Flow

### Part 1: Create New Todo Form (10 minutes)

#### 1. Create New Todo Page
```bash
mkdir app/todos/new
code app/todos/new/page.tsx
```

**Type this live:**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTodoPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        router.push('/todos')
      } else {
        alert('Failed to create todo')
      }
    } catch (error) {
      alert('Error creating todo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Add New Todo</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            required
            style={{
              padding: '0.5rem',
              width: '300px',
              fontSize: '1rem'
            }}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

**Key Teaching Moments:**
- "useRouter lets us navigate programmatically"
- "preventDefault stops form from refreshing page"
- "Loading state disables button during submit"
- "router.push navigates after success"
- "Show Network tab when submitting"

#### 2. Test the Form
- Click "Add New Todo" link
- Fill in the form
- Submit and watch Network tab
- See redirect to /todos with new item

**Think-aloud:**
- "Notice the POST request in Network tab"
- "The page navigates automatically on success"
- "Error handling with try/catch"

### Part 2: Todo Detail Page (10 minutes)

#### 1. Create Detail Page
```bash
code app/todos/[id]/page.tsx
```

**Type this live:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Todo = {
  id: number
  text: string
  done: boolean
}

export default function TodoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [todo, setTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    fetch(`/api/todos/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTodo(data)
        setEditText(data.text)
        setLoading(false)
      })
  }, [params.id])

  async function toggleDone() {
    if (!todo) return

    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: todo.text, 
        done: !todo.done 
      }),
    })

    if (response.ok) {
      const updated = await response.json()
      setTodo(updated)
    }
  }

  async function saveEdit() {
    if (!todo) return

    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: editText, 
        done: todo.done 
      }),
    })

    if (response.ok) {
      const updated = await response.json()
      setTodo(updated)
      setEditing(false)
    }
  }

  async function deleteTodo() {
    if (!todo || !confirm('Delete this todo?')) return

    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      router.push('/todos')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!todo) return <div>Todo not found</div>

  return (
    <div>
      <h1>Todo Detail</h1>
      
      {editing ? (
        <div>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '1rem', width: '300px' }}
          />
          <button onClick={saveEdit} style={{ marginLeft: '0.5rem' }}>
            Save
          </button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: '0.5rem' }}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '1.5rem' }}>
            {todo.text} {todo.done && '✅'}
          </p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={toggleDone}>
          Mark as {todo.done ? 'Not Done' : 'Done'}
        </button>
        <button 
          onClick={deleteTodo} 
          style={{ marginLeft: '0.5rem', background: '#dc3545', color: 'white' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
```

**Explain step-by-step:**
- "useParams gets the [id] from URL"
- "We fetch the single todo on mount"
- "Edit mode toggles between view and edit"
- "Each action (toggle, edit, delete) calls the API"
- "Optimistic UI updates improve feel"

#### 2. Test Full CRUD Flow
**Demonstrate:**
1. Click a todo from the list
2. Show detail page loads
3. Toggle done status - watch Network tab
4. Edit the text
5. Delete and see redirect

**Think-aloud:**
- "Every action makes an API call"
- "The UI updates immediately"
- "Confirm dialog prevents accidental deletes"

### Part 3: Add Styling and Polish (10 minutes)

#### 1. Create Styles File
```bash
code app/todos/todos.module.css
```

**Type this:**
```css
.container {
  max-width: 600px;
  margin: 0 auto;
}

.todoList {
  list-style: none;
  padding: 0;
}

.todoItem {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todoItem:hover {
  background: #f9f9f9;
}

.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.button {
  padding: 0.5rem 1rem;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background: #0051cc;
}

.buttonDanger {
  background: #dc3545;
}

.buttonDanger:hover {
  background: #c82333;
}

.form {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
```

#### 2. Apply Styles to Todos Page
```bash
code app/todos/page.tsx
```

**Update with CSS modules:**
```typescript
import styles from './todos.module.css'

// In the component:
<div className={styles.container}>
  <h1>My Todos</h1>
  <Link href="/todos/new" className={styles.button}>
    Add New Todo
  </Link>
  <ul className={styles.todoList}>
    {todos.map(todo => (
      <li key={todo.id} className={styles.todoItem}>
        <Link href={`/todos/${todo.id}`}>
          <span className={todo.done ? styles.done : ''}>
            {todo.text}
          </span>
        </Link>
      </li>
    ))}
  </ul>
</div>
```

**Explain:**
- "CSS Modules scope styles to the component"
- "No global CSS conflicts"
- "Import and use like JavaScript objects"

#### 3. Show Final Result
- Navigate through the app
- Add, edit, toggle, delete todos
- "This is a complete CRUD application!"

## Common Issues & Solutions

### State Not Updating
```typescript
// Always create new objects/arrays
setTodos([...todos, newTodo])  // ✅
setTodos(todos.push(newTodo))  // ❌
```

### Router Not Working
```typescript
// Must import from 'next/navigation' in App Router
import { useRouter } from 'next/navigation'  // ✅
import { useRouter } from 'next/router'       // ❌ (Pages Router)
```

### API Route Shared State
**Explain:**
- "In production, use a database"
- "In-memory is fine for learning"
- "Could use a singleton pattern for demo"

## Key Teaching Points

1. **Forms in Next.js:**
   - Controlled components with useState
   - Prevent default form behavior
   - Loading states during submission
   - Programmatic navigation on success

2. **CRUD Operations:**
   - Create: POST request
   - Read: GET request
   - Update: PUT request
   - Delete: DELETE request

3. **User Experience:**
   - Loading states
   - Error handling
   - Confirmation dialogs
   - Immediate UI updates

## Think-Aloud Moments
- "This is the same pattern used in production apps"
- "Notice how everything stays in one project"
- "The API and frontend share TypeScript types"
- "We could deploy this to Vercel right now"

## Wrap-up Questions
- "What would you change to add user authentication?"
- "How would you persist data to a database?"
- "What other features could you add?"

## Extension Ideas
- "Add categories or tags"
- "Add due dates"
- "Add search/filter"
- "Add drag-and-drop reordering"
- "Connect to a real database"

## Final Demonstration
1. Show complete flow: list → add → edit → delete
2. Open DevTools and show all network requests
3. Explain how this scales to larger applications
4. Preview deployment to Vercel (if time permits)
