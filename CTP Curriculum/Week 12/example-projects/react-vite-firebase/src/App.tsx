/**
 * REF: Root App Component with React Router
 *
 * Main application component that sets up routing, authentication, and lazy-loaded pages.
 *
 * ## Architecture
 *
 * ### Provider Hierarchy
 * ```
 * <AuthProvider>           // Global auth state & context
 *   <BrowserRouter>        // Client-side routing
 *     <Suspense>           // Code splitting fallback
 *       <Routes>           // All route definitions
 *         <Route>          // Individual routes
 *         <Route>          // With code splitting
 *       </Routes>
 *     </Suspense>
 *   </BrowserRouter>
 * </AuthProvider>
 * ```
 *
 * ## SPA vs Traditional Web Apps
 *
 * | `Aspect` | SPA (This App) | Traditional Server |
 * |--------|----------------|-------------------|
 * | **Navigation** | JavaScript re-renders | Server sends new HTML |
 * | **Page Reload** | No (state preserved) | Yes (state lost) |
 * | **Speed** | Fast (no reload) | Slow (network + render) |
 * | **Initial Load** | Large JS | Smaller HTML |
 * | **SEO** | Poor (content loads later) | Good (HTML has content) |
 * | **User Feel** | Like desktop app | Traditional website |
 *
 * ## React Router v6 Key Components
 *
 * - **`<BrowserRouter>`**: Enables routing with HTML5 History API
 * - **`<Routes>`**: Container for all route definitions
 * - **`<Route>`**: Maps URL path to component
 * - **`<Navigate>`**: Programmatic redirect
 * - **`<Link>`**: Navigation without page reload
 *
 * ## Code Splitting with lazy() + Suspense
 *
 * Pages loaded on-demand, not upfront:
 * - Smaller initial bundle
 * - Faster first page load
 * - Pages loaded when accessed
 * - Better for large apps
 *
 * CLOSE
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Lazy load pages for code splitting
import { lazy, Suspense } from 'react'

// REF: lazy() + Suspense enable code splitting
/**
 * ## Lazy Loading Pages
 *
 * lazy() + Suspense enable code splitting
 *
 * ## Benefits
 * - Smaller initial bundle
 * - Faster first page load
 * - Pages loaded on demand
 * - Better performance
 *
 * ## How It Works
 * 1. lazy(() => import()) creates dynamic import
 * 2. Webpack/Vite creates separate chunk
 * 3. <Suspense> shows fallback while loading
 * 4. Component renders when loaded
 */
// CLOSE
const Landing = lazy(() => import('./pages/Landing'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Feed = lazy(() => import('./pages/Feed'))
const Messages = lazy(() => import('./pages/Messages'))
const Settings = lazy(() => import('./pages/Settings'))
// CLOSE: LAZY LOADING PAGES

// REF: Shown while lazy-loaded components download
/**
 * ## Loading Component
 *
 * Shown while lazy-loaded components download
 */
// CLOSE
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>
  )
}
// CLOSE: LOADING COMPONENT

// REF: Wraps routes that require authentication.
/**
 * ## Protected Route Component
 *
 * Wraps routes that require authentication.
 *
 * ### Parameters
 *
 * | Parameter | Type | Description |
 * |-----------|------|-------------|
 * | `children` | `React.ReactNode` | The protected component to render |
 *
 * ### Flow
 *
 * 1. Check if user is authenticated via `useAuth()`
 * 2. If loading, show `<LoadingFallback />` spinner
 * 3. If not authenticated, redirect to `/signin`
 * 4. If authenticated, render `children`
 *
 * ### React Router Navigate
 *
 * - **Programmatic redirect** - Uses `<Navigate>` component
 * - **Replace option** - Replaces current history entry
 * - **Similar to** - `router.push()` in Next.js
 */
// CLOSE
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingFallback />
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}
// CLOSE: PROTECTED ROUTE COMPONENT

/**
 * REF: app-component
 *
 * ## App Component
 *
 * Root component that sets up routing and authentication providers.
 *
 * ### Structure
 *
 * 1. **AuthProvider** - Provides auth state globally
 * 2. **BrowserRouter** - Enables client-side routing
 * 3. **Suspense** - Handles lazy loading fallback
 * 4. **Routes** - Contains all route definitions
 *
 * ### Route Definitions
 *
 * | Route | Access | Description |
 * |-------|--------|-------------|
 * | `/` | Public | Landing page |
 * | `/signin` | Public | Sign in page |
 * | `/signup` | Public | Sign up page |
 * | `/dashboard` | Protected | User's todos |
 * | `/feed` | Protected | Public feed |
 * | `/messages` | Protected | Real-time messaging |
 * | `/settings` | Protected | User settings |
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
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
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
// CLOSE: APP COMPONENT

// REF: NAVIGATION IN SPA
/**
 * NAVIGATION IN SPA
 *
 * Use Link component for internal navigation:
 *
 * ```typescript
 * import { Link } from 'react-router-dom'
 *
 * <Link to="/dashboard">Go to Dashboard</Link>
 * ```
 *
 * Benefits over <a>:
 * - No page reload
 * - Faster navigation
 * - Preserves app state
 * - History API integration
 */
// CLOSE

// REF: PROGRAMMATIC NAVIGATION
/**
 * PROGRAMMATIC NAVIGATION
 *
 * Navigate with JavaScript:
 *
 * ```typescript
 * import { useNavigate } from 'react-router-dom'
 *
 * function MyComponent() {
 *   const navigate = useNavigate()
 *
 *   const handleClick = () => {
 *     navigate('/dashboard')
 *   }
 * }
 * ```
 */
// CLOSE

// REF: ROUTE PARAMETERS
/**
 * ROUTE PARAMETERS
 *
 * Dynamic routes with params:
 *
 * ```typescript
 * <Route path="/todos/:id" element={<TodoDetail />} />
 *
 * // In component:
 * import { useParams } from 'react-router-dom'
 *
 * function TodoDetail() {
 *   const { id } = useParams()
 *   // Use id to fetch todo
 * }
 * ```
 */
// CLOSE

// REF: QUERY PARAMETERS
/**
 * QUERY PARAMETERS
 *
 * Access URL query params:
 *
 * ```typescript
 * import { useSearchParams } from 'react-router-dom'
 *
 * function Feed() {
 *   const [searchParams] = useSearchParams()
 *   const tag = searchParams.get('tag')
 *   // Use tag to filter
 * }
 * ```
 */
// CLOSE

// REF: ROUTE GUARDS
/**
 * ROUTE GUARDS
 *
 * Additional protection patterns:
 *
 * ```typescript
 * // Redirect authenticated users away from auth pages
 * function AuthRoute({ children }) {
 *   const { user } = useAuth()
 *
 *   if (user) {
 *     return <Navigate to="/dashboard" />
 *   }
 *
 *   return children
 * }
 *
 * <Route path="/signin" element={<AuthRoute><SignIn /></AuthRoute>} />
 * ```
 */
// CLOSE

// REF: CODE SPLITTING ANALYSIS
/**
 * CODE SPLITTING ANALYSIS
 *
 * With lazy loading, your bundle splits:
 *
 * - main.js: App, Router, Auth context (~50KB)
 * - Landing.js: Landing page (~20KB)
 * - Dashboard.js: Dashboard page (~30KB)
 * - Messages.js: Messages page (~25KB)
 *
 * Total: ~125KB (but users only download what they need!)
 *
 * Without lazy loading: ~125KB upfront
 * With lazy loading: ~50KB initial, rest on demand
 */
// CLOSE

// REF: VITE BUILD OPTIMIZATIONS
/**
 * VITE BUILD OPTIMIZATIONS
 *
 * Vite automatically:
 * - Tree shakes unused code
 * - Minifies JavaScript
 * - Optimizes images
 * - Generates source maps
 * - Creates efficient chunks
 *
 * Build output:
 * ```
 * dist/
 * ├── index.html
 * ├── assets/
 * │   ├── index-a1b2c3.js
 * │   ├── Dashboard-d4e5f6.js
 * │   └── Messages-g7h8i9.js
 * └── favicon.ico
 * ```
 *
 * Hash in filenames enables long-term caching!
 */
// CLOSE
