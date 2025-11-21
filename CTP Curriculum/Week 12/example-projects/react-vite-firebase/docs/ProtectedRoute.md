# ProtectedRoute.tsx - Route Guard Component

## REF: ProtectedRoute Component

Wraps routes that require authentication and redirects unauthenticated users to the sign-in page.

---

## Overview

This component implements **client-side route protection** for authenticated pages in the SPA.

### How It Works

**Flow Chart:**

```
User visits /dashboard
        ↓
useAuth() checks authentication
        ↓
Is loading?
├─ YES → Show loading spinner
└─ NO  → Continue
        ↓
Is user authenticated?
├─ NO  → Redirect to /signin
└─ YES → Render protected content
```

### Step-by-Step Process

1. **Check authentication state** via `useAuth()` hook
2. **If loading**: Shows loading spinner (prevents flash of redirect)
3. **If not authenticated**: Redirects to `/signin` page
4. **If authenticated**: Renders protected content

---

## Client-Side vs Real Security

### Important Distinction

This component provides **UX protection**, not **true security**.

| **Aspect** | **Client-Side** | **Real Security** |
|-----------|----------------|-------------------|
| **Level** | UX Protection | Data Protection |
| **Can Be Bypassed** | Yes (disable JavaScript) | No (server-enforced) |
| **Purpose** | Better user experience | Prevent data access |
| **Implementation** | React Router | Firestore Rules |
| **Where Enforced** | Browser | Database |

### Key Points

**Client-Side Route Protection:**
- ✅ Prevents showing protected UI to unauthenticated users
- ✅ Improves user experience
- ✅ Redirects users to appropriate pages
- ❌ **Can be bypassed by disabling JavaScript**
- ❌ **Can be modified in browser DevTools**
- ❌ **Does NOT prevent unauthorized data access**

**Real Security (Backend):**
- ✅ Enforced by Firestore Security Rules
- ✅ Enforced by Row Level Security (Supabase)
- ✅ Enforced by API authentication
- ✅ **Protects data even if client is compromised**

### Example

```typescript
// This is what ANYONE can do:
// 1. Disable JavaScript in browser
// 2. Use DevTools to modify code
// 3. Make API calls directly

// Firestore rules PREVENT this:
// match /todos/{todoId} {
//   allow read: if request.auth.uid == resource.data.userId;
// }
```

---

## Implementation

### Component Structure

```typescript
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // Loading state - show spinner
  if (loading) {
    return <div>Loading...</div>
  }

  // Not authenticated - redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />
  }

  // Authenticated - render children
  return <>{children}</>
}
```

### Props

```typescript
interface ProtectedRouteProps {
  children: ReactNode  // Component to render if authenticated
}
```

---

## Usage in Routes

### Basic Usage

```typescript
import { Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Multiple Protected Routes

```typescript
<Routes>
  {/* Public */}
  <Route path="/" element={<Landing />} />
  <Route path="/signin" element={<SignIn />} />

  {/* Protected */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/messages"
    element={
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    }
  />
</Routes>
```

---

## Key Features

### Loading State Handling

```typescript
if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>
  )
}
```

**Why this matters:**
- Prevents "flash of redirect" (showing signin briefly)
- Gives feedback to user that app is checking auth
- Better perceived performance

### Redirect Behavior

```typescript
if (!user) {
  return <Navigate to="/signin" replace />
}
```

**`replace` option:**
- Replaces current history entry
- User can't "back" to protected page
- Clean redirect without breaking browser back button

### React Router Navigate Component

| **Property** | **Purpose** |
|-------------|-----------|
| `to="/signin"` | Destination route |
| `replace` | Don't add to history (can't go back) |
| Difference from `<Link>` | Programmatic redirect, not user click |

---

## Advanced Patterns

### Pattern 1: Redirect to Return URL

```typescript
import { useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner />

  if (!user) {
    return (
      <Navigate
        to="/signin"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  return <>{children}</>
}
```

**Then in SignIn page:**

```typescript
function SignIn() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignIn = async () => {
    await signIn()
    const from = location.state?.from || '/dashboard'
    navigate(from)
  }

  return <form onSubmit={handleSignIn}>...</form>
}
```

**Benefit**: User returns to where they tried to go, not default page.

### Pattern 2: Role-Based Protection (RBAC)

```typescript
function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/signin" />

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

// Usage:
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  }
/>
```

### Pattern 3: Permission-Based Protection

```typescript
function PermissionRoute({
  children,
  permission
}: {
  children: ReactNode
  permission: string
}) {
  const { user, hasPermission } = useAuth()

  if (!user) return <Navigate to="/signin" />

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" />
  }

  return <>{children}</>
}

// Usage:
<Route
  path="/delete-users"
  element={
    <PermissionRoute permission="delete_users">
      <UserManagement />
    </PermissionRoute>
  }
/>
```

### Pattern 4: Multiple Auth States

```typescript
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  if (user.isBlocked) {
    return <Navigate to="/account-blocked" replace />
  }

  return <>{children}</>
}
```

---

## Testing

### Test Unauthenticated Access

```typescript
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Mock useAuth
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false
  })
}))

test('redirects when not authenticated', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  )

  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
})
```

### Test Authenticated Access

```typescript
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: '123', email: 'user@example.com' },
    loading: false
  })
}))

test('renders children when authenticated', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  )

  expect(screen.getByText('Protected Content')).toBeInTheDocument()
})
```

### Test Loading State

```typescript
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: true
  })
}))

test('shows loading while checking auth', () => {
  render(
    <MemoryRouter>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MemoryRouter>
  )

  expect(screen.getByText('Loading...')).toBeInTheDocument()
})
```

---

## Common Mistakes

### Mistake 1: Forgetting Loading State

```typescript
// WRONG - Flashes signin briefly
if (!user) {
  return <Navigate to="/signin" replace />
}
return children

// RIGHT - Wait for auth check to complete
if (loading) return <LoadingSpinner />
if (!user) return <Navigate to="/signin" replace />
return children
```

### Mistake 2: Not Using `replace`

```typescript
// WRONG - User can go back to signin
return <Navigate to="/signin" />

// RIGHT - Prevents backward navigation
return <Navigate to="/signin" replace />
```

### Mistake 3: Treating as Real Security

```typescript
// WRONG - Thinking this is secure
<ProtectedRoute>
  <SecretData />
</ProtectedRoute>

// RIGHT - Real security is backend
// Apply Firestore rules to prevent unauthorized reads
// match /secretData/{docId} {
//   allow read: if request.auth.uid == resource.data.owner;
// }
```

### Mistake 4: Not Showing LoadingSpinner

```typescript
// WRONG - Generic Loading text
if (loading) return <div>Loading...</div>

// RIGHT - Use LoadingSpinner component
if (loading) return <LoadingSpinner size="lg" text="Checking auth..." />
```

---

## Integration with useAuth Hook

### How useAuth Works

```typescript
function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
```

### Must be Inside AuthProvider

```typescript
// App.tsx
<AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

**Order matters:** AuthProvider must wrap the entire app for ProtectedRoute to work.

---

## Real Security Implementation

### Backend Protection (Firestore)

```javascript
// firestore.rules
match /dashboards/{userId} {
  // Only the owner can read their dashboard
  allow read: if request.auth.uid == userId;

  // Only the owner can write
  allow write: if request.auth.uid == userId;
}

match /messages/{messageId} {
  // Only sender and recipient can read
  allow read: if request.auth.uid == resource.data.senderId ||
                 request.auth.uid == resource.data.recipientId;

  // Only authenticated users can create
  allow create: if request.auth != null;

  // Only recipient can mark as read
  allow update: if request.auth.uid == resource.data.recipientId;
}
```

### API Authentication (Backend Server)

```typescript
// Backend: Verify token on every request
app.post('/api/todos', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Verify Firebase token
  admin.auth().verifyIdToken(token)
    .then(decodedToken => {
      // Token valid, process request
      const userId = decodedToken.uid
      // Fetch user's todos
    })
    .catch(error => {
      res.status(401).json({ error: 'Invalid token' })
    })
})
```

---

## Security Checklist

### Frontend ✅

- [x] Use ProtectedRoute for authenticated pages
- [x] Show loading state while checking auth
- [x] Redirect to signin when not authenticated
- [x] Use `replace` option to prevent back navigation

### Backend ✅

- [x] Set up Firestore Security Rules
- [x] Validate user ID on data access
- [x] Reject unauthorized requests
- [x] Verify auth tokens on API requests

### Overall ✅

- [x] Never trust client-side checks
- [x] Always verify on backend
- [x] Use HTTPS for all requests
- [x] Store sensitive data server-side
- [x] Implement rate limiting
- [x] Log security events

---

## Performance Optimization

### Minimize Flash

```typescript
// Good: Uses existing auth state
if (loading) return null  // Don't show spinner if already cached

// Better: Show cached UI while checking
if (loading && !cachedUser) return <LoadingSpinner />
if (!user && !cachedUser) return <Navigate to="/signin" />
return children
```

### Lazy Load Protected Routes

```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'))

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </ProtectedRoute>
  }
/>
```

---

## CLOSE

ProtectedRoute implements client-side route protection by:
- Checking authentication state
- Handling loading gracefully
- Redirecting unauthenticated users
- Rendering protected content when authorized

Remember: This is **UX protection**, not **security**. Always enforce security rules on the backend!
