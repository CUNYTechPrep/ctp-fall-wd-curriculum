/**
 * REF: Firebase Configuration for React + Vite SPA
 *
 * Initializes Firebase services for a client-side-only React application.
 *
 * ## Architecture Overview
 *
 * This is a **fully client-side application** with no backend server.
 *
 * ### Comparison: React Vite vs Next.js
 *
 * | Feature | React + Vite | `Next.js` |
 * |---------|--------------|---------|
 * | **Rendering** | Client-side only | SSR + Client |
 * | **Build Tool** | Vite (fastest) | Webpack-based |
 * | **Routing** | `react-router-dom` | File-based pages |
 * | **API Routes** | External API | Built-in API routes |
 * | **SEO** | Poor (JS content) | Good (pre-rendered) |
 * | **Deployment** | Static hosting | Server/Vercel |
 * | **Complexity** | `Lower` | `Higher` |
 * | **Learning Curve** | `Easy` | `Moderate` |
 *
 * ### Firebase Services Exported
 * - **auth**: Firebase Authentication (sign up, sign in, session)
 * - **db**: Firestore Database (todos, messages, users)
 * - **storage**: Cloud Storage (file uploads, images)
 *
 * ### Why Client-Side Only for This Project?
 * - Demonstrates core React + Firebase patterns
 * - No backend infrastructure needed
 * - Faster to develop and deploy
 * - Lower operational cost
 * - Perfect for learning
 *
 * CLOSE
 */

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// REF: FIREBASE CONFIGURATION
/**
 * FIREBASE CONFIGURATION
 *
 * These values come from Firebase Console > Project Settings
 *
 * VITE_* PREFIX:
 * - Required by Vite for env vars
 * - Vite only exposes vars with this prefix
 * - Security by default
 */
// CLOSE
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
// CLOSE: FIREBASE CONFIGURATION

// REF: INITIALIZE FIREBASE
/**
 * INITIALIZE FIREBASE
 *
 * Simple one-time initialization
 * No need for singleton pattern complexity in SPA
 */
// CLOSE
const app = initializeApp(firebaseConfig)
// CLOSE: INITIALIZE FIREBASE

// REF: EXPORT FIREBASE SERVICES
/**
 * EXPORT FIREBASE SERVICES
 *
 * auth: Authentication (sign up, sign in, sign out)
 * db: Firestore database (todos, messages, etc.)
 * storage: Cloud Storage (files, images)
 *
 * ## Usage in Components
 * ```typescript
 * import { auth, db } from '@/lib/firebase'
 *
 * // Use anywhere in your app
 * const user = auth.currentUser
 * const todos = await getDocs(collection(db, 'todos'))
 * ```
 */
// CLOSE
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
// CLOSE: EXPORT FIREBASE SERVICES

// REF: CLIENT-SIDE AUTH PERSISTENCE
/**
 * CLIENT-SIDE AUTH PERSISTENCE
 *
 * Firebase automatically:
 * - Stores auth tokens in localStorage
 * - Restores session on page reload
 * - Handles token refresh
 * - Syncs across tabs
 *
 * No cookies needed in client-only apps!
 */
// CLOSE

// REF: ROUTING IN SPA
/**
 * ROUTING IN SPA
 *
 * Use React Router for navigation:
 *
 * ```typescript
 * import { BrowserRouter, Routes, Route } from 'react-router-dom'
 *
 * <BrowserRouter>
 *   <Routes>
 *     <Route path="/" element={<Landing />} />
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Routes>
 * </BrowserRouter>
 * ```
 *
 * No file-based routing like Next.js
 */
// CLOSE

// REF: PROTECTED ROUTES PATTERN
/**
 * PROTECTED ROUTES PATTERN
 *
 * Wrap routes that need authentication:
 *
 * ```typescript
 * function ProtectedRoute({ children }) {
 *   const { user, loading } = useAuth()
 *
 *   if (loading) return <LoadingSpinner />
 *   if (!user) return <Navigate to="/login" />
 *
 *   return children
 * }
 *
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
// CLOSE

// REF: DEPLOYMENT
/**
 * DEPLOYMENT
 *
 * Build static files:
 * ```bash
 * npm run build
 * ```
 *
 * Deploys `dist/` folder to:
 * - Vercel: `vercel --prod`
 * - Netlify: `netlify deploy --prod`
 * - Firebase Hosting: `firebase deploy`
 * - GitHub Pages: Copy dist/ to gh-pages branch
 * - Any static host!
 *
 * CHEAP/FREE HOSTING:
 * - Vercel: Free for personal projects
 * - Netlify: Free tier generous
 * - Firebase Hosting: Free tier available
 * - GitHub Pages: Free for public repos
 */
// CLOSE

// REF: SEO CONSIDERATIONS
/**
 * SEO CONSIDERATIONS
 *
 * Client-side apps have poor SEO by default:
 * - Content loads after JavaScript
 * - Search engines see empty HTML
 * - Social media previews don't work well
 *
 * ## Solutions
 * - Use Next.js if SEO critical
 * - Or implement prerendering (react-snap)
 * - Or use Firebase Hosting dynamic links
 * - For internal/authenticated apps, SEO doesn't matter!
 */
// CLOSE

// REF: PERFORMANCE TIPS
/**
 * PERFORMANCE TIPS
 *
 * Code splitting with React lazy:
 * ```typescript
 * const Dashboard = lazy(() => import('./pages/Dashboard'))
 *
 * <Suspense fallback={<LoadingSpinner />}>
 *   <Dashboard />
 * </Suspense>
 * ```
 *
 * This loads Dashboard.js only when needed!
 */
// CLOSE

// REF: VITE-SPECIFIC FEATURES
/**
 * VITE-SPECIFIC FEATURES
 *
 * - Lightning-fast HMR (Hot Module Replacement)
 * - No bundling in dev (uses native ES modules)
 * - Optimized production builds with Rollup
 * - Smaller bundle sizes than webpack
 * - Built-in TypeScript support
 *
 * Why Vite is faster:
 * - Only transforms files on request in dev
 * - No full bundle rebuild on change
 * - Instant server start
 */
// CLOSE

export default app
// CLOSE: Firebase Configuration for React + Vite SPA
