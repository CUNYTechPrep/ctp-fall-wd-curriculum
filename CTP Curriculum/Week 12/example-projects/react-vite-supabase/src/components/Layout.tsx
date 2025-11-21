/**
 * REF: Application Layout Shell
 *
 * Wrapper component providing consistent navigation header, main content area,
 * and footer across all pages. Handles auth-dependent navigation display.
 *
 * CLOSE: Wrap page components with Layout to get header, navigation, and footer.
 * Displays different nav options based on authentication state.
 *
 * LAYOUT STRUCTURE:
 * ```
 * <Layout>
 *   <header>                    // Top navigation bar
 *     Logo + Branding
 *     {user ? Authenticated Nav : Public Nav}
 *   </header>
 *   <main>                      // Page content area
 *     {children}                // Page component renders here
 *   </main>
 *   <footer>                    // Bottom credit/info
 *     Copyright and stack info
 *   </footer>
 * </Layout>
 * ```
 *
 * ### Props
 * | `Prop` | Type | Purpose |
 * |------|------|---------|
 * | `children` | `ReactNode` | Page component to render in main area |
 *
 * NAVIGATION STATES:
 * | `State` | `Links` | `Buttons` |
 * |-------|-------|---------|
 * | `Authenticated` | Dashboard, Feed, Messages, Settings | Sign Out |
 * | Not Authenticated | `Home` | Sign In, Sign Up |
 *
 * ## Features
 * - Responsive header with flexbox
 * - Mobile hamburger-friendly navigation (implicit with Tailwind)
 * - Logo links back to home
 * - Sign Out button triggers auth logout
 * - Sticky footer with project credits
 * - Shadow below header for visual separation
 * - Gray background on page content area
 *
 * SUPABASE AUTH INTEGRATION:
 * - Gets user from useAuth() hook
 * - Calls signOut() on button click
 * - After logout, navigates to home (/)
 * - Navigates to authenticated pages after login
 *
 * ## Styling
 * - Tailwind CSS utility classes
 * - Flexbox for responsive alignment
 * - Gap spacing between nav items
 * - Hover transitions on links
 * - min-h-screen ensures footer at bottom
 * - flex flex-col on root for sticky footer
 *
 * FILE REFERENCES:
 * - ../contexts/AuthContext.tsx - useAuth() hook
 * - ../pages/* - Pages wrapped with Layout
 *
 * USED IN:
 * - Dashboard page
 * - Feed page
 * - Messages page
 * - Settings page
 * - (Landing, SignIn, SignUp typically don't use Layout)
 */

import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

/**
 * REF: layout-component
 */
export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              Todo App
            </Link>

            {user ? (
              <nav className="flex items-center gap-6">
                <Link to="/dashboard" className="hover:text-purple-600 transition">
                  Dashboard
                </Link>
                <Link to="/feed" className="hover:text-purple-600 transition">
                  Feed
                </Link>
                <Link to="/messages" className="hover:text-purple-600 transition">
                  Messages
                </Link>
                <Link to="/settings" className="hover:text-purple-600 transition">
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Sign Out
                </button>
              </nav>
            ) : (
              <nav className="flex gap-4">
                <Link to="/signin" className="px-4 py-2 text-purple-600">
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Sign Up
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>&copy; 2025 Todo App. Built with React, Vite, Supabase, and PostgreSQL.</p>
        </div>
      </footer>
    </div>
  )
}
// CLOSE: layout-component

/**
 * SUPABASE IN LAYOUT
 *
 * Could add real-time notifications:
 *
 * ```tsx
 * const [unreadCount, setUnreadCount] = useState(0)
 *
 * useEffect(() => {
 *   if (!user) return
 *
 *   // Subscribe to unread messages
 *   const channel = supabase
 *     .channel('notifications')
 *     .on('postgres_changes', {
 *       event: 'INSERT',
 *       schema: 'public',
 *       table: 'messages',
 *       filter: `recipient_id=eq.${user.id}`
 *     }, () => {
 *       // Increment count
 *       setUnreadCount(prev => prev + 1)
 *     })
 *     .subscribe()
 *
 *   return () => supabase.removeChannel(channel)
 * }, [user])
 *
 * <Link to="/messages">
 *   Messages {unreadCount > 0 && `(${unreadCount})`}
 * </Link>
 * ```
 */
