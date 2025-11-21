/**
 * REF: dashboard-layout
 *
 * # Dashboard Layout - Protected Pages Shell
 *
 * Layout for all authenticated dashboard pages.
 *
 * ## Key Concepts
 *
 * - **Client Component:** Uses hooks (needs 'use client')
 * - **Protected Routes:** Redirects if not authenticated
 * - **Nested Layout:** Wraps dashboard pages
 * - **Shared UI:** Header, nav, footer for all dashboard pages
 *
 * ## Route Protection
 *
 * This layout protects all routes inside `app/(dashboard)/`:
 * - `/dashboard`
 * - `/feed`
 * - `/messages`
 * - `/settings`
 *
 * If user not logged in → redirect to `/signin`
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

/**
 * REF: dashboard-layout-component
 *
 * ## DashboardLayout Component
 *
 * Protected layout with navigation.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  /**
   * Get auth state and navigation.
   */
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  /**
   * REF: auth-redirect
   *
   * ## Authentication Check
   *
   * Redirect to signin if not authenticated.
   *
   * ### Effect Dependencies
   *
   * - `user`: Auth state
   * - `loading`: Wait for auth check
   * - `router`: Navigation function
   *
   * ### Why Effect?
   *
   * - Runs after render
   * - Waits for auth state
   * - Redirects client-side
   */
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])
  // CLOSE: auth-redirect

  /**
   * Show loading state while checking auth.
   */
  /** REF: conditional-block
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  /**
   * Return null if no user (will redirect).
   */
  if (!user) {
    return null
  }

  /**
   * REF: handle-signout
   *
   * ## Sign Out Handler
   *
   * Logs out user and redirects home.
   */
  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }
  // CLOSE: handle-signout

  /**
   * REF: dashboard-shell
   *
   * ## Dashboard UI Shell
   *
   * Provides consistent UI for all dashboard pages.
   *
   * ### Structure
   *
   * 1. **Header** with logo and navigation
   * 2. **Main** content area (children render here)
   * 3. **Footer** with copyright
   */
  return (
    <div className="min-h-screen flex flex-col">
      {/**
       * ## Navigation Header
       *
       * Sticky header with logo and navigation links.
       *
       * ### Navigation Items
       *
       * - My Todos: Personal todo list
       * - Public Feed: Community todos
       * - Messages: Real-time chat
       * - Settings: User preferences
       * - Sign Out: Logout button
       */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold">
              Todo App
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="hover:text-blue-600 transition"
              >
                My Todos
              </Link>
              <Link
                href="/feed"
                className="hover:text-blue-600 transition"
              >
                Public Feed
              </Link>
              <Link
                href="/messages"
                className="hover:text-blue-600 transition"
              >
                Messages
              </Link>
              <Link
                href="/settings"
                className="hover:text-blue-600 transition"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/**
       * ## Main Content Area
       *
       * Where child pages render.
       *
       * `flex-1` makes it expand to fill available space.
       */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/**
       * ## Footer
       *
       * Sticky footer at bottom of page.
       *
       * `mt-auto` pushes it to bottom with flexbox.
       */}
      <footer className="bg-white dark:bg-gray-800 shadow mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2025 Todo App. Built with Next.js and Firebase.</p>
        </div>
      </footer>
    </div>
  )
}
// CLOSE: dashboard-shell
// CLOSE: dashboard-layout-component
// CLOSE: dashboard-layout
