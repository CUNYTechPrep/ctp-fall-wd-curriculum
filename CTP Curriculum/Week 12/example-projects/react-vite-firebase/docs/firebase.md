# firebase.ts - Firebase Configuration

## REF: Firebase Configuration Module

Initializes Firebase services for a client-side-only React SPA application.

---

## Architecture Overview

### What is This App?

This is a **fully client-side application** with **no backend server**.

### Comparison: React Vite vs Next.js

| **Feature** | **React + Vite** | **Next.js** |
|-----------|------------------|-----------|
| **Rendering** | Client-side only | SSR + Client |
| **Build Tool** | Vite (fastest) | Webpack-based |
| **Routing** | `react-router-dom` | File-based pages |
| **API Routes** | External API only | Built-in API routes |
| **SEO** | Poor (JS loads content) | Good (pre-rendered) |
| **Deployment** | Static hosting | Server/Vercel |
| **Complexity** | Lower | Higher |
| **Learning Curve** | Easy | Moderate |
| **Speed** | Faster to develop | More features |

### Client-Side Only Architecture

```
┌─────────────────────────────────────────────┐
│              Browser (Client)                │
│  ┌──────────────────────────────────────┐   │
│  │         React Application            │   │
│  │  - React Router for routing          │   │
│  │  - Firebase SDK for auth/database    │   │
│  │  - All code runs in browser          │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
        ┌──────────────────────┐
        │   Firebase Backend   │
        │  - Authentication    │
        │  - Firestore DB      │
        │  - Cloud Storage     │
        └──────────────────────┘
```

---

## Firebase Services Exported

### Three Core Services

| **Service** | **Purpose** | **Use Cases** |
|-----------|-----------|--------------|
| **auth** | Authentication | Sign up, sign in, session management |
| **db** | Firestore Database | Store todos, messages, user data |
| **storage** | Cloud Storage | Upload files, profile pictures, images |

### Usage in Components

```typescript
import { auth, db, storage } from '@/lib/firebase'

// Get current user
const user = auth.currentUser

// Fetch todos from Firestore
const todos = await getDocs(collection(db, 'todos'))

// Upload file to Cloud Storage
const storageRef = ref(storage, 'uploads/file.pdf')
await uploadBytes(storageRef, file)
```

---

## Firebase Configuration

### Environment Variables

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
```

### Where These Come From

1. Create project in Firebase Console
2. Go to Project Settings
3. Copy configuration values
4. Store in `.env.local` file (NOT committed to git)

### VITE_ Prefix Requirement

**Why `VITE_` prefix?**

```typescript
// WRONG - Won't work with Vite
const apiKey = import.meta.env.FIREBASE_API_KEY

// RIGHT - Vite exposes only VITE_ prefixed vars
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
```

**Security by default**: Vite only exposes variables with `VITE_` prefix to the browser, preventing accidental exposure of secrets.

### .env.local File

```bash
# .env.local (NOT in git)
VITE_FIREBASE_API_KEY=AIzaSyDxxx...
VITE_FIREBASE_AUTH_DOMAIN=myapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-app-12345
VITE_FIREBASE_STORAGE_BUCKET=my-app-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

---

## Initialization

### One-Time Setup

```typescript
import { initializeApp } from 'firebase/app'

const app = initializeApp(firebaseConfig)
```

**Important:** Call `initializeApp()` only once in your entire app. Firebase handles the rest automatically.

### No Singleton Pattern Needed

Unlike some libraries, Firebase doesn't require singleton pattern in SPAs:

```typescript
// This is fine - Firebase handles it internally
const app = initializeApp(firebaseConfig)

// You can export and reuse everywhere
export const auth = getAuth(app)
export const db = getFirestore(app)
```

---

## Service Exports

### Authentication Service

```typescript
import { getAuth } from 'firebase/auth'

export const auth = getAuth(app)
```

**Used for:**
- `signInWithEmailAndPassword(auth, email, password)`
- `createUserWithEmailAndPassword(auth, email, password)`
- `onAuthStateChanged(auth, callback)`
- `signOut(auth)`

### Firestore Service

```typescript
import { getFirestore } from 'firebase/firestore'

export const db = getFirestore(app)
```

**Used for:**
- `getDocs(collection(db, 'todos'))`
- `addDoc(collection(db, 'todos'), data)`
- `updateDoc(doc(db, 'todos', 'id'), updates)`
- `deleteDoc(doc(db, 'todos', 'id'))`
- `onSnapshot(collection(db, 'todos'), callback)`

### Cloud Storage Service

```typescript
import { getStorage } from 'firebase/storage'

export const storage = getStorage(app)
```

**Used for:**
- `uploadBytes(ref(storage, 'path'), file)`
- `getDownloadURL(ref(storage, 'path'))`
- `deleteObject(ref(storage, 'path'))`

---

## Client-Side Auth Persistence

### How Firebase Persists Sessions

```typescript
// User logs in
await signInWithEmailAndPassword(auth, email, password)

// Firebase automatically:
// 1. Generates and stores auth token
// 2. Saves to localStorage
// 3. Sets up token refresh
// 4. Returns user object
```

### localStorage Structure

```javascript
// Storage after login:
localStorage.getItem('firebase:authUser:...')
// Returns:
{
  "uid": "user123abc",
  "email": "user@example.com",
  "emailVerified": false,
  "displayName": "John Doe",
  "photoURL": "https://...",
  "accessToken": "eyJhbGc...",
  "expirationTime": 1704067200000,
  ...
}
```

### Automatic Features

| **Feature** | **What Happens** |
|-----------|-----------------|
| **Persistence** | Token survives page reload |
| **Token Refresh** | Automatically refreshes before expiry |
| **Cross-Tab Sync** | Sign in one tab, logged in all tabs |
| **Session Restore** | App remembers user on page load |

### No Manual Token Management

```typescript
// You DON'T do this:
const token = localStorage.getItem('token')
fetch('/api/data', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Firebase handles it automatically!
// Just use the SDK methods
```

---

## Deployment Considerations

### Static Hosting Platforms

```bash
# Build for deployment
npm run build

# Outputs dist/ folder
# Deploy dist/ to:
```

| **Platform** | **Command** | **Cost** |
|-----------|-----------|---------|
| **Vercel** | `vercel --prod` | Free tier available |
| **Netlify** | `netlify deploy --prod` | Free tier generous |
| **Firebase Hosting** | `firebase deploy` | Free tier available |
| **GitHub Pages** | Copy dist/ to gh-pages | Free (public repos) |
| **AWS S3** | `aws s3 sync dist/ s3://bucket` | Pay per request |

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Automatic builds on git push
# Free SSL/HTTPS
# CDN distribution
```

### Build Output

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── main-abc123.js      # Main bundle (hashed)
│   ├── main-abc123.css     # Styles (hashed)
│   └── Dashboard-def456.js # Lazy-loaded page
└── favicon.ico
```

**Hash in filenames**: When you update code, only changed files need new downloads!

---

## SEO Considerations

### SPA SEO Limitations

Client-side apps have poor SEO because:

| **Problem** | **Impact** |
|-----------|-----------|
| **Content loads via JS** | Search engines see empty HTML |
| **No pre-rendering** | Meta tags not in initial HTML |
| **Dynamic content** | Crawlers don't wait for content |
| **Social previews** | Open Graph tags missing |

### Solutions

#### Option 1: Use Next.js

```typescript
// Next.js provides server-side rendering
export default function HomePage() {
  return <h1>Title for SEO</h1>
}
```

**Pros:** Full SEO support
**Cons:** More complex, requires server

#### Option 2: Static Pre-rendering

```bash
npm i react-snap

# In package.json:
"build": "vite build && react-snap"
```

**Pros:** Better than pure SPA
**Cons:** Only works for static content

#### Option 3: Accept Poor SEO

```typescript
// For internal/authenticated apps, SEO doesn't matter!
// Examples:
// - Company dashboard
// - Project management tool
// - Todo app (this project)
// - Real-time chat

// Focus on UX instead of SEO
```

#### Option 4: Firebase Hosting Dynamic Links

```typescript
// Firebase can generate dynamic preview cards
// Works for social media sharing
// But not search engines
```

---

## Performance Optimization

### Code Splitting

```typescript
// Lazy load pages with React lazy()
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Only loads when accessed
// Smaller initial bundle
// Faster page load
```

### Vite Build Features

Vite automatically:

- **Tree shakes** unused code
- **Minifies** JavaScript
- **Optimizes** images
- **Creates chunks** for code splitting
- **Generates source maps** for debugging
- **Adds hashes** for cache busting

### Bundle Analysis

```bash
# Check bundle size
npm install -D rollup-plugin-visualizer

# In vite.config.ts:
import { visualizer } from 'rollup-plugin-visualizer'

export default {
  plugins: [visualizer()]
}
```

### Performance Tips

```typescript
// 1. Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'))

// 2. Code split vendor code
// Vite does this automatically

// 3. Compress images
// Use WebP format when possible
<img src="image.webp" />

// 4. Use service workers for offline
// (Advanced topic)

// 5. Monitor Core Web Vitals
// LCP, FID, CLS scores
```

---

## Vite-Specific Features

### Hot Module Replacement (HMR)

```typescript
// Changes to this file trigger reload
// Changes to components trigger hot update
// State is preserved when possible
// Instant feedback in browser
```

**You don't need to configure anything!**

### Development Server

```bash
npm run dev

# Vite starts server on localhost:5173
# 1. No bundling in dev (native ES modules)
# 2. Only transforms requested files
# 3. Instant server start
# 4. Lightning-fast HMR
```

### Production Build

```bash
npm run build

# Uses Rollup for optimization
# Tree shaking
# Code splitting
# Minification
# Source maps
```

### Why Vite is Faster

| **Aspect** | **Impact** |
|-----------|-----------|
| **No bundling in dev** | Instant server start |
| **Request-based transform** | Only transform what's needed |
| **Native ES modules** | Browsers understand imports |
| **Optimized chunks** | Better code splitting |
| **Rollup bundling** | Production ready |

---

## Security Checklist

### Frontend Security

- [x] Environment variables prefixed with `VITE_`
- [x] `.env.local` in `.gitignore`
- [x] No secrets in code
- [x] HTTPS for all requests (automatic with Vercel/Netlify)
- [x] Content Security Policy headers

### Firebase Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only logged-in users can read
    match /todos/{document=**} {
      allow read, write: if request.auth != null;
    }

    // Only owner can read their data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### Backend Security

- [x] Verify auth tokens on server
- [x] Validate all user input
- [x] Use HTTPS only
- [x] Rate limiting
- [x] Log security events

---

## Environment Setup

### 1. Firebase Console Setup

```
1. Go to firebase.google.com
2. Create new project
3. Go to Project Settings
4. Copy config values
```

### 2. Create .env.local

```bash
cp .env.example .env.local
```

### 3. Update Values

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain.firebaseapp.com
# ... other values
```

### 4. Test Connection

```typescript
import { auth } from '@/lib/firebase'
console.log('Firebase configured:', auth.app.name)
```

---

## Troubleshooting

### Firebase Not Initializing

```typescript
// Error: Firebase is not defined
// Solution: Check all imports are correct

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
```

### Cannot Read Environment Variables

```typescript
// Error: undefined environment variable
// Solution: Check VITE_ prefix

// WRONG:
import.meta.env.FIREBASE_API_KEY

// RIGHT:
import.meta.env.VITE_FIREBASE_API_KEY

// Also: Restart dev server after .env.local changes
```

### CORS Issues

```typescript
// Error: CORS blocked request to Firebase
// Solution: Firebase handles this automatically

// If you see CORS errors, likely:
// 1. Network is down
// 2. Firebase project deleted
// 3. API key invalid
```

### Authentication Errors

```typescript
// Common Firebase auth error codes:
'auth/invalid-api-key' → Invalid API key
'auth/permission-denied' → Firestore rules deny access
'auth/network-request-failed' → No internet connection
'auth/user-not-found' → Email not registered
'auth/wrong-password' → Incorrect password
```

---

## CLOSE

This firebase.ts module:
- **Initializes Firebase SDK** with your project config
- **Exports three services**: auth, db, storage
- **Enables client-side authentication** via localStorage
- **Requires environment variables** for configuration
- **Supports fully client-side apps** (no backend server)

All Firebase features are transparent and automatic - just use the SDK methods!
