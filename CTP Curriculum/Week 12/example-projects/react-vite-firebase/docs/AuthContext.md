# AuthContext.tsx - Global Authentication State

## REF: Authentication Context

Manages authentication state globally across the SPA using React Context API and Firebase Authentication.

---

## Overview

### Purpose

Provides authentication state and methods to all components without prop drilling, while automatically persisting sessions and syncing across browser tabs.

### Architecture: Context + Provider Pattern

```
AuthContext (type definition)
    ↓
AuthProvider (wraps app, provides value)
    ↓
useAuth() hook (consume context)
    ↓
Components (use hook to access auth state)
```

### Single Source of Truth

Instead of passing `user` prop down through many components:

```typescript
// BAD: Prop drilling
<App user={user}>
  <Layout user={user}>
    <Navbar user={user}>
      <Menu user={user} />
    </Navbar>
  </Layout>
</App>

// GOOD: Context + Hook
<AuthProvider>
  <App />  // Can use useAuth() anywhere
</AuthProvider>
```

---

## SPA Auth vs Server-Side Rendering (SSR)

### Comparison Table

| **Aspect** | **SPA (This App)** | **SSR (Next.js)** |
|-----------|-------------------|-------------------|
| **Storage** | `localStorage` | HTTP cookies |
| **State** | React context | Server session |
| **Refresh** | Client-side | Server-side |
| **Security** | Lower (client) | Higher (server) |
| **Complexity** | Lower | Higher |
| **XSS Risk** | localStorage vulnerable | HTTPOnly cookies safer |
| **Scalability** | Stateless | Requires session store |

### Why SPA Uses localStorage

```typescript
// Firebase automatically stores token here
localStorage.setItem('firebase:authUser:...', JSON.stringify({
  uid: 'user123',
  email: 'user@example.com',
  accessToken: 'eyJhbGc...',
  expirationTime: 1704067200000
}))
```

**Pros:**
- Automatic persistence across page reloads
- Easy to access from any component
- No server-side session needed

**Cons:**
- Vulnerable to XSS attacks
- Anyone can read it with JavaScript
- Must protect from malicious scripts

---

## Firebase Auth Persistence

### Automatic Features

Firebase **automatically handles**:

- **Stores auth tokens in localStorage**
- **Persists session across page refreshes**
- **Syncs auth state across browser tabs**
- **Refreshes tokens before expiry**
- **Handles token rotation**

### Key Implication

**You don't need to manage tokens manually!**

```typescript
// Firebase does this automatically:
// 1. Get token from localStorage
// 2. Verify token still valid
// 3. Refresh if expired
// 4. Update localStorage
// 5. Sync across tabs
// 6. All transparent to you!
```

---

## Component Structure

### AuthContextType Interface

```typescript
interface AuthContextType {
  user: User | null              // Current logged-in user
  loading: boolean               // Whether auth is initializing
  signUp: (email, password, displayName?) => Promise<void>
  signIn: (email, password) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (displayName?, photoURL?) => Promise<void>
}
```

### User Object (Firebase)

```typescript
interface User {
  uid: string                    // Unique user ID
  email: string                  // User email
  displayName?: string           // User's display name
  photoURL?: string              // Profile picture URL
  emailVerified: boolean         // Is email verified?
  isAnonymous: boolean           // Anonymous user?
  metadata: {
    creationTime: number         // When account created
    lastSignInTime: number       // Last login
  }
}
```

---

## AuthProvider Component

### Purpose

Wraps the entire application and provides auth state to all children.

### Provider Pattern Benefits

| **Benefit** | **Impact** |
|-----------|-----------|
| **Avoid prop drilling** | Don't pass user through many components |
| **Centralized logic** | All auth logic in one place |
| **Easy to consume** | Use `useAuth()` anywhere |
| **Single source of truth** | Auth state consistent everywhere |

### Implementation

```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ... auth methods ...

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### Usage in App

```typescript
// App.tsx
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* All routes here can use useAuth() */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

---

## Auth State Listener

### onAuthStateChanged Hook

```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setUser(user)
    setLoading(false)

    if (user) {
      // Create user document in Firestore
      const userRef = doc(db, 'users', user.uid)
      await setDoc(
        userRef,
        {
          email: user.email,
          displayName: user.displayName || '',
          profilePicture: user.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }  // Don't overwrite existing data
      )

      // Create user settings document
      const settingsRef = doc(db, 'userSettings', user.uid)
      await setDoc(
        settingsRef,
        {
          userId: user.uid,
          theme: 'light',
          fontSize: 'medium',
          highContrast: false,
          reducedMotion: false,
          updatedAt: new Date(),
        },
        { merge: true }
      )
    }
  })

  return unsubscribe  // Cleanup
}, [])
```

### What Triggers onAuthStateChanged

| **Event** | **When** | **What Happens** |
|----------|---------|-----------------|
| **User signs up** | New account created | Fires with new user |
| **User signs in** | Authentication succeeds | Fires with user |
| **User signs out** | Logout requested | Fires with null |
| **Token refreshes** | Token expired, auto-refresh | Fires with updated user |
| **Page loads** | Browser refresh/new tab | Fires, restores session |
| **Cross-tab sync** | User signs in other tab | Fires with user |

### Cleanup Function

```typescript
return unsubscribe

// When component unmounts:
// - Stop listening for auth changes
// - Prevent memory leaks
// - Free up resources
```

---

## Authentication Methods

### Sign Up

```typescript
const signUp = async (
  email: string,
  password: string,
  displayName?: string
) => {
  // 1. Create Firebase Auth user
  const result = await createUserWithEmailAndPassword(auth, email, password)

  // 2. Update profile with display name
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName })
  }

  // 3. onAuthStateChanged automatically:
  //    - Updates user state
  //    - Triggers user document creation
  //    - User is logged in
}
```

**Flow:**
1. Create auth user with email/password
2. Update profile with display name
3. `onAuthStateChanged` fires automatically
4. User document created in Firestore
5. User logged in

### Sign In

```typescript
const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password)
  // onAuthStateChanged fires automatically
}
```

**Error Codes (Firebase):**

| **Error** | **Cause** | **User Message** |
|----------|----------|-----------------|
| `auth/wrong-password` | Incorrect password | "Wrong password" |
| `auth/user-not-found` | Email doesn't exist | "Account not found" |
| `auth/too-many-requests` | Too many failed attempts | "Too many login attempts" |
| `auth/network-request-failed` | No internet | "Network error" |
| `auth/invalid-email` | Invalid email format | "Invalid email" |

### Sign Out

```typescript
const signOut = async () => {
  await firebaseSignOut(auth)
  // Firebase automatically:
  // - Clears localStorage
  // - Invalidates tokens
  // - Triggers onAuthStateChanged with null
  // - Context updates user to null
}
```

### Update Profile

```typescript
const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
) => {
  if (!user) return

  const updates: { displayName?: string; photoURL?: string } = {}
  if (displayName !== undefined) updates.displayName = displayName
  if (photoURL !== undefined) updates.photoURL = photoURL

  // 1. Update Firebase Auth profile
  await updateProfile(user, updates)

  // 2. Update Firestore user document
  await setDoc(
    doc(db, 'users', user.uid),
    {
      displayName: displayName || user.displayName,
      profilePicture: photoURL || user.photoURL,
      updatedAt: new Date(),
    },
    { merge: true }  // Preserve other fields
  )
}
```

**Why two updates?**
- Firebase Auth: For `auth.currentUser` (authentication)
- Firestore: For queries and display (database)

---

## useAuth Hook

### Purpose

Custom hook to access auth context from any component.

### Implementation

```typescript
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
```

### Error Handling

```typescript
// WRONG - useAuth outside AuthProvider
<div>
  <MyComponent />  // Error: useAuth must be used within AuthProvider
</div>

// RIGHT - useAuth inside AuthProvider
<AuthProvider>
  <div>
    <MyComponent />  // Works fine
  </div>
</AuthProvider>
```

### Usage Examples

```typescript
// Example 1: Check if user is logged in
function Dashboard() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/signin" />
  return <div>Hello {user.email}</div>
}

// Example 2: Sign out
function UserMenu() {
  const { user, signOut } = useAuth()

  return (
    <div>
      <span>{user?.displayName}</span>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

// Example 3: Sign up
function SignUpForm() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signUp(email, password)
    // User is now logged in
  }

  return <form onSubmit={handleSubmit}>...</form>
}

// Example 4: Loading state
function ProtectedComponent() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/signin" />
  return <div>Protected content</div>
}
```

---

## User Document Structure

### What Gets Stored

When a user signs up or logs in, a document is created:

```typescript
// Firestore: /users/{userId}
{
  email: "user@example.com",
  displayName: "John Doe",
  profilePicture: "https://...",
  createdAt: Timestamp(2024, 1, 15),
  updatedAt: Timestamp(2024, 1, 15)
}

// Firestore: /userSettings/{userId}
{
  userId: "abc123def456",
  theme: "light",
  fontSize: "medium",
  highContrast: false,
  reducedMotion: false,
  updatedAt: Timestamp(2024, 1, 15)
}
```

### Why Both Documents?

**`users` collection:**
- Profile information
- Public data (email, name, picture)
- Used for displaying user info
- Queried for user lists

**`userSettings` collection:**
- Personal preferences
- Private settings
- Theme, font size, accessibility
- Not shared with other users

---

## Advanced Features

### Email Verification

```typescript
import { sendEmailVerification } from 'firebase/auth'

const verifyEmail = async () => {
  if (!user) return
  await sendEmailVerification(user)
  // Email sent with verification link
}
```

### Password Reset

```typescript
import { sendPasswordResetEmail } from 'firebase/auth'

const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email)
  // Email sent with reset link
}
```

### Social Authentication

```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  // User is now logged in with Google
}
```

### Phone Authentication

```typescript
import { signInWithPhoneNumber } from 'firebase/auth'

const signInWithPhone = async (phoneNumber: string) => {
  const appVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth)
  const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  // Sends OTP to phone
}
```

### Anonymous Authentication

```typescript
import { signInAnonymously } from 'firebase/auth'

const signInAnon = async () => {
  const result = await signInAnonymously(auth)
  // User logged in anonymously (no email/password)
}
```

---

## Security Considerations

### localStorage Vulnerability

```typescript
// localStorage is NOT secure!
// Anyone with JavaScript access can read it:
const token = localStorage.getItem('firebase:authUser:...')

// To protect against XSS:
// 1. Sanitize all user input
// 2. Use Content Security Policy headers
// 3. Keep dependencies updated
// 4. Use httpOnly cookies (requires backend)
```

### Token Management

```typescript
// Firebase automatically refreshes tokens
// You don't need to do anything!

// But if implementing custom backend:
const token = await user?.getIdToken()
// Use token in API requests:
fetch('/api/data', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Password Requirements

When implementing password validation:

```typescript
const isValidPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&              // At least 8 chars
    /[A-Z]/.test(password) &&            // At least 1 uppercase
    /[a-z]/.test(password) &&            // At least 1 lowercase
    /[0-9]/.test(password) &&            // At least 1 number
    /[!@#$%^&*]/.test(password)           // At least 1 special char
  )
}
```

---

## Testing

### Mock useAuth

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

// Mock the auth hook
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: '123', email: 'test@example.com' },
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
    updateUserProfile: jest.fn(),
  })
}))

test('displays user email', () => {
  render(<MyComponent />)
  expect(screen.getByText('test@example.com')).toBeInTheDocument()
})
```

### Test Sign In

```typescript
test('signs in user', async () => {
  const { signIn } = useAuth()

  await signIn('user@example.com', 'Password123!')

  expect(user).not.toBeNull()
  expect(user.email).toBe('user@example.com')
})
```

---

## Common Patterns

### Check Authentication Before Data Access

```typescript
function MyData() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!user) return  // Don't fetch if not authenticated

    const unsubscribe = onSnapshot(
      collection(db, 'myData'),
      (snapshot) => {
        setData(snapshot.docs)
      }
    )

    return unsubscribe
  }, [user])

  if (!user) return <Navigate to="/signin" />
  return <div>{/* Display data */}</div>
}
```

### Combine with useEffect

```typescript
useEffect(() => {
  if (!user) {
    // Reset state when user logs out
    setData(null)
    return
  }

  // Fetch user-specific data
  fetchUserData(user.uid)
}, [user])
```

---

## CLOSE

AuthContext provides:
- **Global authentication state** without prop drilling
- **Automatic session persistence** across page reloads
- **Cross-tab synchronization** of auth state
- **Simple methods** for signup, signin, signout
- **Profile management** with Firestore sync

The context pattern + Firebase's automatic persistence = minimal code, maximum functionality!
