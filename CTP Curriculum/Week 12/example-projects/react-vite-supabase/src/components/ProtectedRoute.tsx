/**
 * REF: Protected Route Guard Component
 *
 * Wrapper component that ensures routes are only accessible to authenticated users.
 * Checks Supabase session and redirects to signin if user is not logged in.
 *
 * CLOSE: Use this component to wrap any Route elements that should require authentication.
 * If user is not authenticated, they are redirected to /signin page.
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
 *
 * GUARD FLOW:
 * 1. User navigates to protected route
 * 2. ProtectedRoute checks useAuth() hook
 * 3. If loading, show loading spinner
 * 4. If not authenticated, redirect to /signin
 * 5. If authenticated, render children component
 *
 * ## Authentication State
 * | `State` | `Behavior` |
 * |-------|----------|
 * | `Loading` | Show LoadingSpinner while checking session |
 * | Not authenticated | Redirect to /signin with replace=true |
 * | `Authenticated` | Render children as normal |
 *
 * TECH DETAILS:
 * - Uses React Router v6 Navigate component
 * - replace=true prevents back button issues
 * - Calls useAuth() hook from AuthContext
 * - Checks both user and loading states
 *
 * SECURITY NOTES:
 * - This is UX protection (good for user experience)
 * - Real security is at database level (RLS policies)
 * - Advanced users can bypass client-side checks
 * - RLS ensures database blocks unauthorized access
 * - Example: User bypasses route guard but tries Supabase query:
 *   - Their JWT token is checked
 *   - RLS policies validate ownership
 *   - Query fails with "policy violation" error
 *
 * FILE REFERENCES:
 * - ../contexts/AuthContext.tsx - useAuth() hook
 * - ../App.tsx - Routes using ProtectedRoute
 */

import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  /** REF: conditional-block
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <>{children}</>
}

/**
 * SUPABASE SESSION IN SPA
 *
 * Session stored in localStorage:
 * - Survives page reload
 * - Auto-refreshes before expiry
 * - Syncs across tabs
 *
 * useAuth() provides:
 * - user: Current user object (or null)
 * - loading: Auth check in progress
 * - session: Full session with tokens
 */

/**
 * RLS ENFORCEMENT
 *
 * Even if user bypasses this route guard:
 * - PostgreSQL RLS blocks unauthorized queries
 * - Database returns empty results
 * - Or returns "policy violation" error
 *
 * Client protection is UX
 * Database protection is security!
 */

/**
 * REF: auth-state-machine
 *
 * ## Authentication State Machine
 *
 * ### Three States
 * | State | Condition | Action |
 * |-------|-----------|--------|
 * | Loading | `loading === true` | Show spinner |
 * | Unauthenticated | `user === null && !loading` | Redirect to /signin |
 * | Authenticated | `user !== null && !loading` | Render children |
 *
 * ### Why Not Two States?
 * If we only checked `!user`:
 * - First render: user=null, redirect before check
 * - Flashes signin page briefly
 * - Poor UX, confusing
 *
 * **Solution:** Check loading flag
 * - Skip redirect while loading
 * - Wait for auth check to complete
 * - Show spinner instead
 * - Smooth transition to protected content
 *
 * ### Loading Timeline
 * 1. App mounts
 * 2. AuthContext calls getSession()
 * 3. loading = true
 * 4. While loading, ProtectedRoute shows spinner
 * 5. Token validated, user set
 * 6. loading = false
 * 7. ProtectedRoute renders children
 *
 * ### Token Refresh
 * - getSession() checks expiration
 * - Expired? Refresh token automatically
 * - Supabase client handles this
 * - User never sees "session expired" error
 * - Refresh happens transparent to user
 *
 * CLOSE: auth-state-machine
 */

