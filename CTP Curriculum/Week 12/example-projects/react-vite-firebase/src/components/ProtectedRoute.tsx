/**
 * REF: ProtectedRoute Component - Route Guard for React Router
 *
 * Wraps routes that require authentication and redirects unauthenticated users.
 *
 * ## Overview
 * This component implements **client-side route protection** for authenticated pages.
 *
 * ### How It Works
 * 1. Checks authentication state via `useAuth()` hook
 * 2. If loading: Shows loading spinner
 * 3. If not authenticated: Redirects to `/signin`
 * 4. If authenticated: Renders protected content
 *
 * ## Important: UX vs Security
 *
 * | `Aspect` | Client-Side | Real Security |
 * |--------|------------|---------------|
 * | `Level` | UX Protection | Data Protection |
 * | Can Be Bypassed | Yes (disable JS) | No (server-enforced) |
 * | Purpose | Better UX | Prevent data access |
 * | `Implementation` | React Router | Firestore Rules |
 *
 * ### Key Points
 * - **NOT true security**: JavaScript can be disabled, history can be manipulated
 * - **IS good UX**: Prevents showing protected UI to unauthenticated users
 * - **Real security**: Enforced by Firestore Security Rules on the backend
 * - Even if client is compromised, database rules protect data
 *
 * CLOSE
 */

import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

// REF: 1. Check if user is authenticated
/**
 * ## Protected Route Component
 *
 * @param children - The protected content to render
 *
 * ## Flow
 * 1. Check if user is authenticated
 * 2. If loading auth state, show loading
 * 3. If not authenticated, redirect to signin
 * 4. If authenticated, render children
 *
 * ### Usage
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
 */
// CLOSE
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // REF: LOADING STATE
/**
   * LOADING STATE
   *
   * Show loading while checking auth
   * Prevents flash of redirect
   */
// CLOSE
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // REF: REDIRECT IF NOT AUTHENTICATED
/**
   * REDIRECT IF NOT AUTHENTICATED
   *
   * Navigate component from React Router
   * - replace: Don't add to history (can't go back)
   * - to: Destination route
   *
   * User sees signin page instead of protected content
   */
// CLOSE
  if (!user) {
    return <Navigate to="/signin" replace />
  }

  // REF: RENDER PROTECTED CONTENT
/**
   * RENDER PROTECTED CONTENT
   *
   * User is authenticated, safe to show content
   */
// CLOSE
  return <>{children}</>
}
// CLOSE: PROTECTED ROUTE COMPONENT

// REF: ADVANCED PATTERNS
/**
 * ADVANCED PATTERNS
 *
 * Redirect with return URL:
 * ```tsx
 * import { useLocation } from 'react-router-dom'
 *
 * const location = useLocation()
 *
 * if (!user) {
 *   return <Navigate
 *     to="/signin"
 *     state={{ from: location.pathname }}
 *     replace
 *   />
 * }
 * ```
 *
 * Then in SignIn page:
 * ```tsx
 * const location = useLocation()
 * const from = location.state?.from || '/dashboard'
 *
 * // After signin:
 * navigate(from)
 * ```
 */
// CLOSE

// REF: ROLE-BASED PROTECTION
/**
 * ROLE-BASED PROTECTION
 *
 * Protect based on user role:
 *
 * ```tsx
 * function AdminRoute({ children }: { children: ReactNode }) {
 *   const { user } = useAuth()
 *
 *   if (!user) return <Navigate to="/signin" />
 *
 *   if (user.role !== 'admin') {
 *     return <Navigate to="/dashboard" />
 *   }
 *
 *   return <>{children}</>
 * }
 * ```
 */
// CLOSE

// REF: PERMISSION-BASED PROTECTION
/**
 * PERMISSION-BASED PROTECTION
 *
 * Check specific permissions:
 *
 * ```tsx
 * function PermissionRoute({
 *   children,
 *   permission
 * }: {
 *   children: ReactNode
 *   permission: string
 * }) {
 *   const { user, hasPermission } = useAuth()
 *
 *   if (!user) return <Navigate to="/signin" />
 *
 *   if (!hasPermission(permission)) {
 *     return <Navigate to="/unauthorized" />
 *   }
 *
 *   return <>{children}</>
 * }
 * ```
 */
// CLOSE

/**
 * REF: security-note
 *
 * ## Remember: This is UX, Not Security
 *
 * Client-side route protection limitations:
 *
 * | Aspect | Status | Notes |
 * |--------|--------|-------|
 * | User experience | ✅ Good | Improves UX, prevents showing protected UI |
 * | Redirects | ✅ Good | Automatically redirects to `/signin` |
 * | JavaScript bypass | ❌ Bad | Can be bypassed by disabling JS |
 * | Database security | ✅ Required | **Real security is in Firestore rules**
 * - ❌ Bad: Can be modified in browser devtools
 *
 * REAL SECURITY:
 * - Firestore security rules (Firebase projects)
 * - Row Level Security (Supabase projects)
 * - API authentication (server-side)
 *
 * These enforce security at the source (database)
 * Even if client is compromised, data is protected!
 */

// REF: LOADING IMPROVEMENT
/**
 * LOADING IMPROVEMENT
 *
 * Better loading component:
 *
 * ```tsx
 * import LoadingSpinner from './LoadingSpinner'
 *
 * if (loading) {
 *   return (
 *     <div className="flex min-h-screen items-center justify-center">
 *       <LoadingSpinner size="lg" text="Checking authentication..." />
 *     </div>
 *   )
 * }
 * ```
 */
// CLOSE

// REF: TESTING
/**
 * TESTING
 *
 * Test protected routes:
 *
 * ```typescript
 * import { render, screen } from '@testing-library/react'
 * import { MemoryRouter } from 'react-router-dom'
 * import ProtectedRoute from './ProtectedRoute'
 *
 * test('redirects when not authenticated', () => {
 *   render(
 *     <MemoryRouter>
 *       <ProtectedRoute>
 *         <div>Protected Content</div>
 *       </ProtectedRoute>
 *     </MemoryRouter>
 *   )
 *
 *   expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
 * })
 * ```
 */
// CLOSE
