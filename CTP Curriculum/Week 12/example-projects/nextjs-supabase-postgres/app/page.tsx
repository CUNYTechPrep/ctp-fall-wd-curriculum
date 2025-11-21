/**
 * Landing Page with Server-Side Rendering
 *
 * REF:
 * Static home page built as Server Component with no client-side JavaScript.
 * Demonstrates optimal performance for content-heavy pages.
 *
 * | Component Type | JS Sent | Initial Load | SEO | Bundle Size |
 * |---|---|---|---|---|
 * | Server | None | Fastest | Best | Smallest |
 * | Client | Full | Slower | Worse | Larger |
 *
 * ## Server Component Benefits
 *
 * **Performance:**
 * - No hydration delay
 * - Content in HTML for SEO
 * - Smaller client bundle
 * - Better Core Web Vitals
 *
 * **Use Cases:**
 * - Landing pages
 * - Marketing content
 * - Static dashboards
 * - Documentation
 */

// REF: Import statement
import Link from 'next/link'
// CLOSE: Import statement

/**
 * LANDING PAGE COMPONENT
 *
 * REF: Server Component (no 'use client' directive)
 *
 * | Aspect | Server | Client |
 * |--------|--------|--------|
 * | Rendering | HTML only | Needs hydration |
 * | State | None | Possible |
 * | Interactivity | Navigation only | Event handlers |
 * | Performance | Best | Standard |
 *
 * ## Component Structure
 *
 * **Sections:**
 * 1. Hero section with title and description
 * 2. Call-to-action buttons (Sign In/Sign Up)
 * 3. Features grid showcasing app capabilities
 * 4. Tech stack badge
 */

// REF: Function: export
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
// CLOSE: Function: export
        {/*
          REF: Main Heading
          Semantic HTML with Tailwind CSS styling
        */}
// REF: JSX element
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Todo App
        </h1>
        {/* CLOSE: */}
// CLOSE: JSX element

        {/*
          REF: Description paragraph
          Introduces app features and tech stack
        */}
// REF: JSX element
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A full-stack todo application built with Next.js and Supabase featuring
          PostgreSQL database, real-time updates, and Row Level Security.
        </p>
        {/* CLOSE: */}
// CLOSE: JSX element

        {/*
          REF: Call to Action Buttons

          | Feature | Implementation |
          |---------|----------------|
          | Navigation | `Next.js Link` |
          | Styling | `Tailwind CSS` |
          | Accessibility | Semantic links |
          | Performance | Prefetching |
        */}
// REF: JSX element
        <div className="flex gap-4 justify-center">
          {/* REF: Sign In link - primary action */}
          <Link
            href="/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          {/* CLOSE: */}
// CLOSE: JSX element

          {/* REF: Sign Up link - secondary action */}
          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sign Up
          </Link>
          {/* CLOSE: */}
        </div>
        {/* CLOSE: CTA buttons section */}

        {/*
          REF: Features Grid

          Showcases key application features:
          - PostgreSQL Database
          - Real-time Updates
          - Row Level Security
          - Open Source

          **Grid Layout:**
          - 1 column on mobile
          - 2 columns on medium+ screens
        */}
// REF: JSX element
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* REF: Feature 1 - PostgreSQL Database */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">PostgreSQL Database</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Powerful SQL database with full ACID compliance, relations, and advanced queries.
            </p>
          </div>
          {/* CLOSE: */}
// CLOSE: JSX element

          {/* REF: Feature 2 - Real-time Updates */}
// REF: JSX element
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Real-time Updates</h3>
            <p className="text-gray-600 dark:text-gray-300">
              See changes instantly across all devices with PostgreSQL's built-in real-time.
            </p>
          </div>
          {/* CLOSE: */}
// CLOSE: JSX element

          {/* REF: Feature 3 - Row Level Security */}
// REF: JSX element
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Row Level Security</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Database-level security policies ensure data protection at the source.
            </p>
          </div>
          {/* CLOSE: */}
// CLOSE: JSX element

          {/* REF: Feature 4 - Open Source */}
// REF: JSX element
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Open Source</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Built on open-source technologies - no vendor lock-in, self-hostable.
            </p>
          </div>
          {/* CLOSE: */}
        </div>
        {/* CLOSE: Features grid */}
// CLOSE: JSX element

        {/*
          REF: Tech Stack Badge
          Lists all technologies used in the application
        */}
// REF: JSX element
        <div className="mt-12 text-sm text-gray-500">
          <p>Built with Next.js 15 • Supabase • PostgreSQL • TypeScript • Tailwind CSS</p>
        </div>
        {/* CLOSE: */}
      </div>
    </main>
  )
}
// CLOSE: JSX element

/**
 * PAGE METADATA
 *
 * REF: Override layout metadata per route
 *
 * ## Metadata Pattern
 *
 * **Example:**
 * ```typescript
 * export const metadata = {
 *   title: 'Home - Todo App',
 *   description: 'Discover todos shared by community'
 * }
 * ```
 *
 * **SEO Benefits:**
 * - Unique title per page
 * - Descriptive meta tags
 * - Social media previews
 * - Search engine optimization
 */

/**
 * RENDERING STRATEGY
 *
 * REF: Control how this page is generated
 *
 * | Mode | Generation | Cache | Speed | When |
 * |------|---|---|---|---|
 * | Static | Build time | CDN | Fastest | Content never changes |
 * | Dynamic | Per request | None | Slower | Uses cookies/headers |
 * | ISR | Build + on-demand | Time-based | Fast | Content changes slowly |
 *
 * ## This Page Strategy
 *
 * **Mode:** Static
 * - Generated at build time
 * - Served from CDN
 * - No cookies or headers used
 * - Content rarely changes
 *
 * **To Change:**
 * ```typescript
 * // Dynamic rendering
 * export const dynamic = 'force-dynamic'
 *
 * // ISR with 60s revalidation
 * export const revalidate = 60
 * ```
 */
