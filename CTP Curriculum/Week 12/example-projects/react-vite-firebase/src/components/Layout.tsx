/**
 * REF: Layout Component - App Shell / Root Layout
 *
 * Provides consistent header, navigation, and footer for all authenticated pages.
 *
 * ## Overview
 * A wrapper component that applies shared UI elements (header, nav, footer) to all pages.
 * Uses conditional rendering to show different navigation based on auth state.
 *
 * ## Layout Structure
 *
 * ```
 * ┌─────────────────────────────────┐
 * │     Header + Navigation         │
 * │  - Logo/Title                   │
 * │  - Auth-specific links          │
 * │  - Sign In/Sign Up buttons      │
 * ├─────────────────────────────────┤
 * │                                 │
 * │     Main Content (children)     │
 * │     Flexible page content       │
 * │                                 │
 * ├─────────────────────────────────┤
 * │          Footer                 │
 * │   Copyright & attribution       │
 * └─────────────────────────────────┘
 * ```
 *
 * ## Navigation States
 *
 * | `State` | `Links` | `Buttons` |
 * |-------|-------|---------|
 * | **Logged In** | Dashboard, Feed, Messages, Settings | Sign Out |
 * | **Logged Out** | (none) | Sign In, Sign Up |
 *
 * CLOSE
 */

import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // REF: SIGN OUT HANDLER
/**
   * SIGN OUT HANDLER
   *
   * Logs out and redirects to home
   */
// CLOSE
  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }
  // CLOSE: SIGN OUT HANDLER

  /** REF: main-layout-structure
   * Main layout component structure with header and content area.
   * Sets up full-screen container with gray background.
   */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Todo App
            </Link>
            {/* CLOSE: main-layout-structure */}

            {/** REF: navigation-menu
             * Main navigation menu with conditional rendering.
             * Shows different links based on authentication status.
             */}
            {/* Navigation */}
            {user ? (
              <nav className="flex items-center gap-6">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  My Todos
                </Link>
                <Link
                  to="/feed"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Public Feed
                </Link>
                <Link
                  to="/messages"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Messages
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-700 hover:text-blue-600 transition"
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
            ) : (
              <nav className="flex items-center gap-4">
                <Link
                  to="/signin"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </nav>
            )}
            {/* CLOSE: navigation-menu */}
          </div>
        </div>
      </header>

            {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

            {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>&copy; 2025 Todo App. Built with React, Vite, and Firebase.</p>
        </div>
      </footer>
    </div>
  )
}
// CLOSE: Layout

// REF: USAGE IN PAGES
/**
 * USAGE IN PAGES
 *
 * Wrap page content:
 *
 * ```tsx
 * import Layout from '../components/Layout'
 *
 * export default function Dashboard() {
 *   return (
 *     <Layout>
 *       <h1>Dashboard</h1>
 *       <TodoList todos={todos} />
 *     </Layout>
 *   )
 * }
 * ```
 *
 * Or wrap in App.tsx:
 * ```tsx
 * <BrowserRouter>
 *   <Layout>
 *     <Routes>
 *       <Route path="/dashboard" element={<Dashboard />} />
 *     </Routes>
 *   </Layout>
 * </BrowserRouter>
 * ```
 */
// CLOSE

// REF: RESPONSIVE NAVIGATION
/**
 * RESPONSIVE NAVIGATION
 *
 * Add mobile menu:
 *
 * ```tsx
 * const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
 *
 * <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
 *   Menu
 * </button>
 *
 * {mobileMenuOpen && (
 *   <nav className="md:hidden">
 *     <Link to="/dashboard">Dashboard</Link>
 *     {/* ... */}
 *   </nav>
 * )}
 * ```
 */
// CLOSE

// REF: ACTIVE LINK STYLING
/**
 * ACTIVE LINK STYLING
 *
 * Highlight current page:
 *
 * ```tsx
 * import { useLocation } from 'react-router-dom'
 *
 * const location = useLocation()
 * const isActive = location.pathname === '/dashboard'
 *
 * <Link
 *   to="/dashboard"
 *   className={isActive ? 'text-blue-600 font-bold' : 'text-gray-700'}
 * >
 *   Dashboard
 * </Link>
 * ```
 */
// CLOSE
