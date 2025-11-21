/**
 * REF: Public Landing Page
 *
 * Homepage showcasing the application features and providing entry points
 * for signin and signup. Accessible to all users (no authentication required).
 *
 * CLOSE: This is the first page users see. It displays project description,
 * key features, and navigation buttons to auth pages.
 *
 * PAGE STRUCTURE:
 * | `Section` | Purpose |
 * |---------|---------|
 * | `Header` | Large headline and description |
 * | CTA Buttons | Sign In and Sign Up links |
 * | Feature Cards | 2x2 grid of key features |
 * | `Footer` | Stack information |
 *
 * ## Features Highlighted
 * | Feature | Benefit |
 * |---------|---------|
 * | PostgreSQL Power | Full SQL database with relations |
 * | Lightning Fast | Vite's instant HMR |
 * | Open Source | No vendor lock-in |
 * | Row Level Security | Database-level data protection |
 *
 * ## Routing
 * - Uses React Router Link components (client-side navigation)
 * - No server round-trip, instant navigation
 * - Links to /signin and /signup pages
 *
 * ## Styling
 * - Gradient background (purple to white)
 * - Tailwind CSS utilities
 * - Responsive grid for feature cards
 * - Max-width container for readability
 * - Centered text and flexbox alignment
 *
 * TECH STACK DISPLAY:
 * - Lists all dependencies in footer
 * - Shows integration of React, Vite, Supabase, PostgreSQL, etc.
 *
 * USER JOURNEY:
 * 1. User visits / (root URL)
 * 2. Router renders Landing component
 * 3. User sees features and benefits
 * 4. User clicks "Sign In" or "Sign Up"
 * 5. Router navigates to /signin or /signup
 * 6. Component unmounts, auth page mounts
 * 7. No server involved, instant page switch
 *
 * ## Key Concepts
 * - Static HTML generated with React
 * - No database queries on this page
 * - Pure presentation layer
 * - Entry point for auth flow
 * - Shows app benefits to convince users to sign up
 */

import { Link } from 'react-router-dom'

/**
 * REF: landing-page-component
 */
export default function Landing() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900">
          Welcome to Todo App
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          A modern todo application built with React, Vite, and Supabase featuring
          PostgreSQL database, real-time updates, and Row Level Security.
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
            <h3 className="font-bold text-lg mb-2">PostgreSQL Power</h3>
            <p className="text-gray-600">
              Full SQL database with relations, joins, and advanced queries.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Vite's instant HMR makes development incredibly fast.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Open Source</h3>
            <p className="text-gray-600">
              Built entirely with open-source tools. No vendor lock-in!
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Row Level Security</h3>
            <p className="text-gray-600">
              Database-level security policies protect your data.
            </p>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Built with React 18 • Vite • Supabase • PostgreSQL • TypeScript • Tailwind CSS</p>
        </div>
      </div>
    </main>
  )
}
// CLOSE: landing-page-component

/**
 * REACT + VITE + SUPABASE STACK
 *
 * Why this combination?
 * - React: Popular, well-documented
 * - Vite: Fastest build tool
 * - Supabase: PostgreSQL + auth + storage in one
 * - Open-source: Can self-host everything
 * - Simple: No server needed (SPA)
 * - Powerful: SQL database from browser
 *
 * Perfect for:
 * - Internal tools
 * - CRUD applications
 * - Dashboards
 * - Learning projects
 */
