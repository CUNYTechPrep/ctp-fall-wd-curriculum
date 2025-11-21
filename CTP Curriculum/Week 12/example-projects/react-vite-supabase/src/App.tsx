/**
 * REF: Root Application Component
 *
 * Main entry point for the React + Vite + Supabase application.
 * Sets up authentication context, routing, and code splitting for all pages.
 *
 * CLOSE: This component wraps the entire app with AuthProvider and BrowserRouter.
 * It defines all routes (public and protected) and lazy loads page components.
 *
 * ## Architecture
 * | `Layer` | `Technology` | Purpose |
 * |-------|-----------|---------|
 * | `Provider` | AuthContext (Supabase) | Global authentication state |
 * | `Router` | React Router v6 | Client-side routing and navigation |
 * | Code Splitting | React.lazy + Suspense | Load pages on demand |
 * | `Protection` | ProtectedRoute component | Auth guards for private pages |
 * | `Styling` | Tailwind CSS | Responsive design and theming |
 *
 * ROUTING STRUCTURE:
 * | `Path` | `Component` | `Protected` | Purpose |
 * |------|-----------|-----------|---------|
 * | / | `Landing` | `No` | Public home page |
 * | /signin | `SignIn` | `No` | Authentication page |
 * | /signup | `SignUp` | `No` | Account creation |
 * | /dashboard | `Dashboard` | `Yes` | User's todos CRUD |
 * | /feed | `Feed` | `Yes` | Browse public todos |
 * | /messages | `Messages` | `Yes` | Real-time messaging |
 * | /settings | `Settings` | `Yes` | User preferences |
 * | * | Navigate / | `No` | 404 redirect to home |
 *
 * ## Tech Stack
 * - React 18 with Concurrent Features
 * - React Router v6 for client-side navigation
 * - React.lazy for code splitting
 * - Supabase Auth (via AuthContext)
 * - TypeScript for type safety
 *
 * ## Key Concepts
 * - SPA with client-side routing (no server routing)
 * - Protected routes via Supabase session validation
 * - Code splitting reduces initial bundle size
 * - LoadingFallback for lazy-loaded pages
 * - RLS ensures database-level security (not just UI)
 *
 * PROTECTED ROUTE FLOW:
 * 1. ProtectedRoute component checks useAuth() hook
 * 2. If loading, show LoadingFallback spinner
 * 3. If not authenticated, redirect to /signin
 * 4. Otherwise, render children component
 * 5. Even if bypassed, RLS policies block unauthorized database access
 *
 * ## Code Splitting Benefits
 * - Initial bundle only includes Landing, SignIn, SignUp
 * - Other pages loaded only when user navigates to them
 * - Faster app startup and better caching
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { lazy, Suspense } from 'react'

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Feed = lazy(() => import('./pages/Feed'))
const Messages = lazy(() => import('./pages/Messages'))
const Settings = lazy(() => import('./pages/Settings'))

/**
 * REF: loading-fallback-component
 *
 * ## Loading Fallback Component
 *
 * Displayed while lazy-loaded pages download and render.
 *
 * ### Purpose
 * - Show user something is loading
 * - Prevent blank screen during page load
 * - Consistent loading experience across app
 *
 * ### When Shown
 * - User navigates to lazy-loaded page
 * - Page chunk downloads from server
 * - Component renders with Suspense
 *
 * ### UX Considerations
 * - Keep it simple (just spinner or text)
 * - Use consistent styling with app theme
 * - Consider skeleton screens for better UX
 * - Keep load times under 1 second when possible
 */
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>
  )
}
// CLOSE: loading-fallback-component

/**
 * REF: protected-route-wrapper
 *
 * ## Protected Route Component
 *
 * Client-side route guard for authenticated pages.
 *
 * ### How It Works
 * 1. Gets user and loading state from useAuth() hook
 * 2. While loading: shows LoadingFallback (prevents redirect flashing)
 * 3. If no user: redirects to /signin with Navigate component
 * 4. If user exists: renders children component safely
 *
 * ### Key Parameters
 * - `children`: Protected component to render if authenticated
 *
 * ### Important Note: UX vs Security
 * | Aspect | Status |
 * |--------|--------|
 * | User Experience | Good (prevents seeing login UI) |
 * | True Security | Database-level (RLS policies) |
 * | Can Be Bypassed | Yes (disable JS, modify history) |
 * | Purpose | Improve UX, not protect data |
 *
 * **Real Security Layers:**
 * 1. RLS policies in PostgreSQL
 * 2. Supabase JWT verification
 * 3. Database query filters
 * 4. Client-side route guard (last line of defense)
 *
 * **Why This Works:**
 * Even if attacker bypasses client-side protection:
 * - Database RLS policies prevent data access
 * - Backend auth middleware validates JWT
 * - Queries return only authorized data
 * - Client code can't override security
 *
 * ### Usage Pattern
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 *
 * ### React Router Navigate
 * - `<Navigate to="/signin">`: Programmatic redirect
 * - `replace={true}`: Don't add to history (can't go back)
 * - `state={{ from: location }}`: Can pass location for return after login
 *
 * ### Client-Side Auth Check Timing
 * 1. App mounts
 * 2. AuthContext checks localStorage for session
 * 3. Calls getSession() to validate token
 * 4. If valid, user is set, loading becomes false
 * 5. Protected route renders based on user state
 * 6. If invalid, user is null, redirects to signin
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  /**
   * LOADING STATE HANDLING
   *
   * Show spinner while auth is checking
   * Prevents flashing redirect to signin
   */
  if (loading) {
    return <LoadingFallback />
  }

  /**
   * REDIRECT IF UNAUTHENTICATED
   *
   * User is null after auth check complete
   * Redirect to signin, don't add to history
   */
  if (!user) {
    return <Navigate to="/signin" replace />
  }

  /**
   * RENDER PROTECTED CONTENT
   *
   * User exists and is authenticated
   * Safe to show protected component
   */
  return <>{children}</>
}
// CLOSE: protected-route-wrapper

/**
 * REF: app-component-root
 *
 * ## Root App Component
 *
 * Assembles the entire application with providers and routing.
 *
 * ### Provider Stack (Order Matters!)
 *
 * ```
 * AuthProvider (outermost)
 * ├─ Manages global auth state
 * ├─ Initializes Supabase session
 * ├─ Listens for auth changes
 * │
 * └─ BrowserRouter
 *    ├─ Enables React Router
 *    ├─ Manages URL state
 *    └─ Provides navigation context
 *       │
 *       └─ Suspense
 *          ├─ Catches lazy loading fallback
 *          ├─ Shows LoadingFallback while chunks load
 *          │
 *          └─ Routes
 *             ├─ / (Landing - public)
 *             ├─ /signin (SignIn - public)
 *             ├─ /signup (SignUp - public)
 *             ├─ /dashboard (Dashboard - protected)
 *             ├─ /feed (Feed - protected)
 *             ├─ /messages (Messages - protected)
 *             ├─ /settings (Settings - protected)
 *             └─ * (404 redirect to /)
 * ```
 *
 * ### Route Categories
 *
 * **Public Routes (no auth required):**
 * - `/`: Landing page (marketing/info)
 * - `/signin`: Login form
 * - `/signup`: Registration form
 *
 * **Protected Routes (auth required):**
 * - `/dashboard`: User's personal todos
 * - `/feed`: Public todos from all users
 * - `/messages`: Direct messaging
 * - `/settings`: User preferences
 *
 * **Catch-all Route:**
 * - `*`: Any unmatched route redirects to `/`
 *
 * ### Code Splitting Strategy
 *
 * Each page is lazy-loaded:
 * - Initial bundle: Landing, SignIn, SignUp only
 * - Dashboard chunk: Downloaded when user navigates
 * - Feed chunk: Downloaded separately
 * - Messages chunk: Downloaded on demand
 * - Settings chunk: Downloaded when accessed
 *
 * **Benefits:**
 * - Smaller initial bundle (faster first page load)
 * - Faster time-to-interactive
 * - Lazy chunks cached separately
 * - Users only download pages they visit
 *
 * ### Component Composition
 * - AuthProvider provides user context globally
 * - ProtectedRoute wraps protected pages
 * - LoadingFallback shown while pages load
 * - Suspense component catches lazy errors
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes - No authentication required */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes - Require authentication */}
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

            {/* 404 Catch-all - Redirect unmatched routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
// CLOSE: app-component-root

/**
 * SUPABASE IN CLIENT-SIDE APP
 *
 * All operations happen in the browser:
 *
 * ```typescript
 * import { supabase } from './lib/supabase'
 *
 * // Queries run from browser
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *
 * // RLS automatically enforced
 * // User can only see their data
 * ```
 *
 * ## Advantages
 * - Simple architecture
 * - No server needed
 * - Deploy as static files
 * - Cheap hosting
 *
 * ## Security
 * - RLS enforced at database
 * - Auth tokens in localStorage
 * - HTTPS required for production
 */

/**
 * REAL-TIME IN CLIENT-SIDE APP
 *
 * Supabase Realtime works great in SPAs:
 *
 * ```typescript
 * useEffect(() => {
 *   const channel = supabase
 *     .channel('todos')
 *     .on('postgres_changes', {
 *       event: '*',
 *       schema: 'public',
 *       table: 'todos'
 *     }, handleChange)
 *     .subscribe()
 *
 *   return () => supabase.removeChannel(channel)
 * }, [])
 * ```
 *
 * Works across all browser tabs and devices!
 */

/**
 * DEPLOYMENT
 *
 * Build for production:
 * ```bash
 * npm run build
 * ```
 *
 * Deploy `dist/` to:
 * - Vercel: npx vercel
 * - Netlify: npx netlify deploy
 * - Firebase Hosting: firebase deploy
 * - GitHub Pages: gh-pages package
 * - Any static host!
 *
 * ## Environment Variables
 * Set in hosting platform:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 */

/**
 * NAVIGATION PATTERNS
 *
 * Using Link component:
 * ```typescript
 * import { Link } from 'react-router-dom'
 *
 * <Link to="/dashboard">Dashboard</Link>
 * ```
 *
 * Using useNavigate hook:
 * ```typescript
 * import { useNavigate } from 'react-router-dom'
 *
 * const navigate = useNavigate()
 * navigate('/dashboard')
 * ```
 *
 * Redirect on condition:
 * ```typescript
 * if (success) {
 *   return <Navigate to="/dashboard" />
 * }
 * ```
 */

/**
 * PERFORMANCE OPTIMIZATIONS
 *
 * 1. **Lazy Loading:**
 *    - Splits code into chunks
 *    - Loads pages on demand
 *    - Reduces initial bundle
 *
 * 2. **Supabase Caching:**
 *    - Enable client-side caching
 *    - Reduces database queries
 *    - Faster perceived performance
 *
 * 3. **Memoization:**
 *    - Use useMemo for expensive calculations
 *    - Use useCallback for stable functions
 *    - Prevent unnecessary re-renders
 *
 * 4. **Virtual Scrolling:**
 *    - For large lists (react-window)
 *    - Only render visible items
 *    - Smooth scrolling even with 1000s of items
 */

/**
 * COMPARING WITH NEXT.JS
 *
 * | Feature | React+Vite+Supabase | Next.js+Supabase |
 * |---------|-------------------|------------------|
 * | `Routing` | React Router | File-based |
 * | `Rendering` | Client-only | SSR + CSR |
 * | `SEO` | `Poor` | `Excellent` |
 * | `Complexity` | `Low` | `Medium` |
 * | `Server` | `None` | `Node.js` |
 * | `Hosting` | `Static` | `Dynamic` |
 * | `Cost` | `Cheaper` | More expensive |
 * | Speed (Dev) | Faster (Vite) | Fast (Next.js) |
 *
 * Choose SPA when:
 * - Building internal tools
 * - SEO doesn't matter
 * - Want simplest architecture
 * - Learning React fundamentals
 */
