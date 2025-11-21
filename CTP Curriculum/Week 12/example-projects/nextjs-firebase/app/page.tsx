/**
 * REF: landing-page-component
 *
 * # Landing Page - Application Home
 *
 * The main landing page that welcomes users and provides navigation to auth pages.
 *
 * ## Key Concepts
 *
 * - **Server Component** - No 'use client' directive (default in App Router)
 * - **Client-side navigation** - Next.js Link component
 * - **Responsive design** - Grid layouts that adapt to screen size
 * - **Tailwind CSS** - Utility-first CSS framework
 * - **Dark mode support** - All colors use dark: variants
 *
 * ## Page Structure
 *
 * 1. **Hero section** - Title and description
 * 2. **Call-to-action buttons** - Sign In/Sign Up links
 * 3. **Feature cards** - 4 key app features
 * 4. **Responsive layout** - Adapts to mobile/tablet/desktop
 *
 * ## Server Component Benefits
 *
 * As a server component (no 'use client'):
 * - **Rendered on server** - Faster initial page load
 * - **No JavaScript needed** - Pure HTML output
 * - **Better SEO** - Content in HTML for crawlers
 * - **Smaller bundle** - No client-side JavaScript overhead
 *
 * ## Performance Optimization
 *
 * - No client-side hooks or state
 * - Static content (no fetching needed)
 * - Can be cached at CDN
 * - Link prefetching happens client-side
 */
// CLOSE: landing-page-component

import Link from 'next/link'

/**
 * REF: home-component
 *
 * # Home Component
 *
 * Main landing page component serving the root (/) route.
 *
 * ## Server Component Implementation
 *
 * This is a server component by default (no 'use client'):
 * - Rendered entirely on server
 * - All content sent as HTML
 * - Links provide client-side navigation
 * - No React hooks needed
 *
 * ## Next.js Link Component
 *
 * Benefits over traditional `<a>` tags:
 * - **Client-side navigation** - No full page reload
 * - **Automatic prefetching** - Linked pages pre-loaded
 * - **Route validation** - Errors caught at build time
 * - **Optimized performance** - No unnecessary requests
 */
export default function Home() {
  /**
   * REF: page-render
   *
   * # Page Render
   *
   * Returns JSX for the complete landing page layout.
   *
   * ## Page Structure
   *
   * 1. **Main container** - Full-screen centered flex layout
   * 2. **Hero section** - Title and brief description
   * 3. **CTA buttons** - Sign In and Sign Up navigation
   * 4. **Feature grid** - 4 cards showcasing app features
   * 5. **Responsive design** - Adapts to all screen sizes
   *
   * ## Layout Techniques
   *
   * - **Flexbox** - Full-screen centering
   * - **Grid** - Feature cards (1 column mobile, 2 columns tablet+)
   * - **Max-width** - Content container for readability
   * - **Padding** - Spacing and margins
   *
   * ## Color System
   *
   * - **Light mode** - White backgrounds, dark text
   * - **Dark mode** - Dark backgrounds, light text
   * - **Interactive** - Blue for primary, gray for secondary
   */
  return (
    /**
     * ## Main Container
     *
     * Full-screen centered layout using Flexbox.
     *
     * ### Tailwind Classes
     *
     * - `flex min-h-screen`: Full viewport height with flex
     * - `flex-col`: Vertical stacking
     * - `items-center justify-center`: Center content
     * - `p-24`: Large padding all around
     */
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/**
       * ## Content Container
       *
       * Max-width container with centered text.
       *
       * Keeps content readable (not too wide).
       */}
      <div className="max-w-2xl text-center">
        {/**
         * ## Hero Title
         *
         * Main heading for the landing page.
         *
         * - `text-5xl`: Very large text
         * - `font-bold`: Bold weight
         * - `mb-6`: Margin bottom
         */}
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Todo App
        </h1>

        {/**
         * ## Description
         *
         * Brief overview of the application.
         *
         * Uses `dark:` variant for dark mode text color.
         */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          A full-stack todo application built with Next.js and Firebase featuring
          real-time updates, public feed, and messaging.
        </p>

        {/**
         * ## Call-to-Action Buttons
         *
         * Primary navigation to authentication pages.
         *
         * ### Next.js Link Component
         *
         * Using `Link` instead of `<a>`:
         * - **Client-side navigation:** No page reload
         * - **Prefetching:** Link targets pre-loaded
         * - **Better UX:** Faster navigation
         *
         * ### Button Styling
         *
         * - **Sign In:** Blue background (primary action)
         * - **Sign Up:** Gray background (secondary action)
         * - **Hover states:** Darker on hover
         * - **Dark mode:** Adjusted colors
         */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/signin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sign Up
          </Link>
        </div>

        {/**
         * ## Feature Grid
         *
         * Showcases main application features.
         *
         * ### Responsive Layout
         *
         * - **Mobile:** Single column (`grid-cols-1`)
         * - **Tablet+:** Two columns (`md:grid-cols-2`)
         * - **Gap:** Spacing between cards
         *
         * Each card highlights a key feature of the app.
         */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/**
           * ### Feature Card: Real-time Todos
           *
           * Highlights the core todo CRUD functionality.
           *
           * - Real-time updates via Firestore listeners
           * - Cross-device synchronization
           * - Instant updates without refresh
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Real-time Todos</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create, update, and delete todos with instant synchronization across all devices.
            </p>
          </div>

          {/**
           * ### Feature Card: Public Feed
           *
           * Community sharing feature.
           *
           * - Share todos publicly
           * - Search across all public todos
           * - Filter by tags
           * - Discover what others are working on
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Public Feed</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share your todos with the community. Search, filter, and discover public todos.
            </p>
          </div>

          {/**
           * ### Feature Card: Messaging
           *
           * Real-time chat between users.
           *
           * - One-on-one messaging
           * - Read receipts
           * - Instant delivery
           * - Conversation history
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Messaging</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Chat with other users in real-time with delivery receipts.
            </p>
          </div>

          {/**
           * ### Feature Card: Accessibility
           *
           * User preference customization.
           *
           * - Theme switching (light/dark)
           * - Font size adjustment
           * - High contrast mode
           * - Reduced motion option
           * - WCAG compliant
           */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customize your experience with theme, font size, contrast, and motion settings.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
  // CLOSE: page-render
}
// CLOSE: home-component

/**
 * REF: responsive-design-pattern
 *
 * # Responsive Design Pattern
 *
 * Uses Tailwind's responsive utilities for mobile-first design.
 *
 * ## Breakpoints
 *
 * ```
 * grid-cols-1 md:grid-cols-2
 * ```
 *
 * | Screen Size | `Classes` | `Layout` |
 * |-------------|---------|--------|
 * | Mobile < 768px | `grid-cols-1` | 1 column |
 * | Tablet 768px+ | `md:grid-cols-2` | 2 columns |
 * | Desktop 1024px+ | (can add `lg:`) | Can further customize |
 *
 * ## Mobile-First Approach
 *
 * - Default: single column (mobile-optimized)
 * - md: prefix applies at 768px and up
 * - Ensures good mobile experience first
 * - Enhances on larger screens
 */
// CLOSE: responsive-design-pattern

/**
 * REF: dark-mode-support
 *
 * # Dark Mode Support
 *
 * All colors use Tailwind's dark: variants for automatic theme switching.
 *
 * ## Dark Mode Implementation
 *
 * ```tsx
 * className="bg-white dark:bg-gray-800"
 * className="text-gray-600 dark:text-gray-300"
 * ```
 *
 * ## How It Works
 *
 * - dark: prefix applies when dark mode is active
 * - Detected from user's system preference
 * - Can be overridden by settings page
 * - Automatically switches via CSS
 *
 * ## Color Pairs
 *
 * | `Light` | `Dark` | Purpose |
 * |-------|------|---------|
 * | `bg-white` | `bg-gray-800` | Card backgrounds |
 * | `text-gray-600` | `text-gray-300` | Body text |
 * | `bg-blue-600` | (same) | Buttons (primary) |
 * | `bg-gray-200` | `bg-gray-700` | Buttons (secondary) |
 */
// CLOSE: dark-mode-support

/**
 * REF: nextjs-app-router
 *
 * # Next.js App Router
 *
 * This file is in `app/page.tsx` and uses the App Router pattern.
 *
 * ## Route Mapping
 *
 * - **File path** - app/page.tsx
 * - **Route** - / (root)
 * - **Type** - Server component (no 'use client')
 *
 * ## Component Type
 *
 * | `Aspect` | `Behavior` |
 * |--------|----------|
 * | `Rendering` | Server-side, no client JavaScript |
 * | `SEO` | Excellent (content in HTML) |
 * | `Performance` | Fast initial load |
 * | `Interactivity` | Links provide client-side nav |
 *
 * ## Benefits
 *
 * - No client-side JavaScript for page itself
 * - Links handled by Next.js router (client-side)
 * - Perfect for static landing pages
 * - Can be cached at CDN
 * - Automatic static generation
 */
// CLOSE: nextjs-app-router

