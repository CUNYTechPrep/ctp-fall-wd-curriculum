/**
 * REF: Landing Page - SPA Entry Point & Marketing
 *
 * Public home page showcasing app features for new users.
 *
 * ## Purpose
 * Entry point for unauthenticated users. Displays app features and provides
 * sign in/sign up links. Visible without authentication.
 *
 * ## Content Structure
 * - **Hero**: Title, description, CTA buttons
 * - **Feature Cards**: 4-card grid highlighting key features
 * - **Footer**: Tech stack information
 *
 * ## SEO Limitations
 * This SPA landing page has limitations for search engines:
 * - Content loads via JavaScript (after page load)
 * - Search engines may not see dynamic content
 * - Social media previews won't work well
 * - No pre-rendered HTML
 *
 * **Solutions** (if SEO needed):
 * 1. Use Next.js for server-side rendering
 * 2. Static pre-rendering with react-snap
 * 3. Accept poor SEO (fine for internal tools)
 *
 * ## For This Project
 * - SEO doesn't matter (learning project)
 * - Demonstrates SPA patterns
 * - Simpler than SSR for beginners
 *
 * CLOSE
 */

import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Welcome to Todo App
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          A full-stack todo application built with React, Vite, and Firebase featuring
          real-time updates, public feed, and messaging.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link
            to="/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              See changes instantly across all devices with Firebase real-time listeners.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Vite's instant HMR and optimized builds make development a breeze.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Public Feed</h3>
            <p className="text-gray-600">
              Share todos with the community. Search, filter, and discover.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Real-time Messaging</h3>
            <p className="text-gray-600">
              Chat with other users with instant delivery and read receipts.
            </p>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Built with React 18 • Vite • Firebase • TypeScript • Tailwind CSS</p>
        </div>
      </div>
    </main>
  )
}
// CLOSE: Landing

// REF: REACT ROUTER LINK
/**
 * REACT ROUTER LINK
 *
 * Using Link instead of <a> tags:
 *
 * ## Benefits
 * - No page reload
 * - Preserves app state
 * - Faster navigation
 * - History API integration
 * - Prefetching (with some routers)
 *
 * ### Usage
 * ```typescript
 * import { Link } from 'react-router-dom'
 *
 * <Link to="/dashboard">Go to Dashboard</Link>
 * ```
 */
// CLOSE

// REF: SEO CONSIDERATIONS FOR SPA
/**
 * SEO CONSIDERATIONS FOR SPA
 *
 * This landing page has poor SEO because:
 * - Content loads after JavaScript
 * - Search engines see empty HTML
 * - Meta tags not in initial HTML
 * - Social media previews don't work well
 *
 * ## Solutions
 * 1. Use Next.js for SSR (see other projects)
 * 2. Prerender with react-snap
 * 3. Server-side rendering
 * 4. Or accept poor SEO (fine for internal tools)
 *
 * For this project:
 * - It's a learning project, SEO doesn't matter
 * - Demonstrates SPA patterns
 * - Simpler than SSR for beginners
 */
// CLOSE

// REF: TAILWIND RESPONSIVE DESIGN
/**
 * TAILWIND RESPONSIVE DESIGN
 *
 * md:grid-cols-2: Two columns on medium screens and up
 * gap-6: Spacing between grid items
 * p-6: Padding inside cards
 *
 * ## Breakpoints
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 */
// CLOSE
