/**
 * Root Layout for Next.js + Supabase Application
 *
 * REF:
 * Root layout that wraps all pages in the application.
 *
 * ## Key Concepts
 *
 * | Concept | Description |
 * |---------|-------------|
 * | Next.js App Router | Layout pattern for shared UI |
 * | Global providers | Auth context wraps entire app |
 * | Metadata | SEO optimization |
 * | Font optimization | Next.js automatic font loading |
 *
 * ## Supabase with Next.js
 *
 * **Integration Points:**
 * - Auth provider wraps entire app
 * - Server and client components coexist
 * - Cookie-based auth (better than localStorage)
 * - Real-time subscriptions in client components
 */

// REF: Import statement
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
// CLOSE: Import statement

/**
 * FONT OPTIMIZATION
 *
 * REF: Next.js automatically optimizes fonts
 *
 * ## Optimization Features
 *
 * | Feature | Benefit |
 * |---------|---------|
 * | Build-time download | No runtime font requests |
 * | Self-hosting | No external dependencies |
 * | Subsetting | Only needed characters included |
 * | Preloading | Faster page loads |
 *
 * **Usage:**
 * ```typescript
 * const inter = Inter({ subsets: ['latin'] })
 * // Apply with: className={inter.className}
 * ```
 */

// REF: Constant: inter
const inter = Inter({ subsets: ['latin'] })
// CLOSE: Constant: inter

/**
 * METADATA FOR SEO
 *
 * REF: Static metadata for the entire site
 *
 * ## Important Fields
 *
 * | Field | Purpose |
 * |-------|---------|
 * | `title` | Page title (shows in browser tab) |
 * | `description` | Meta description (SEO + social) |
 * | `openGraph` | Social media previews |
 *
 * **Can be overridden per page:**
 * ```typescript
 * // In page.tsx
 * export const metadata = {
 *   title: 'Dashboard - Todo App'
 * }
 * ```
 */

// REF: Constant: metadata
export const metadata: Metadata = {
  title: 'Todo App - Next.js + Supabase',
  description: 'A full-stack todo application with PostgreSQL and real-time features',
}
// CLOSE: Constant: metadata

/**
 * ROOT LAYOUT COMPONENT
 *
 * REF: Server component that wraps all pages
 *
 * ## Structure
 *
 * **Layers:**
 * 1. HTML shell (html, body tags)
 * 2. Font className applied
 * 3. AuthProvider wraps children
 * 4. Page content rendered in children
 *
 * ## Why Wrap in Auth Provider?
 *
 * **Benefits:**
 * - Makes auth state available everywhere
 * - `useAuth()` hook works in any component
 * - Single source of truth for user
 * - Handles auth state changes globally
 *
 * @param children - All page content renders here
 */

// REF: Function: export
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
// CLOSE: Function: export

// REF: JSX return
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* REF: AuthProvider wraps all pages for global auth state */}
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* CLOSE: */}
      </body>
    </html>
  )
}
// CLOSE: JSX return

/**
 * LAYOUT HIERARCHY IN NEXT.JS
 *
 * REF: Understanding layout nesting
 *
 * ## File Structure
 *
 * ```
 * app/layout.tsx (this file)
 *   └── app/page.tsx (landing page)
 *   └── app/(dashboard)/layout.tsx (dashboard layout)
 *       └── app/(dashboard)/dashboard/page.tsx
 *       └── app/(dashboard)/feed/page.tsx
 *       └── app/(dashboard)/messages/page.tsx
 * ```
 *
 * **Nesting Rules:**
 * - Each layout wraps its children
 * - Nested layouts compose together
 * - Layouts persist across navigation
 * - Only page content re-renders
 */

/**
 * SERVER VS CLIENT COMPONENTS
 *
 * REF: Understanding component types in this layout
 *
 * ## This Layout (Server Component)
 *
 * **Characteristics:**
 * - Runs on server
 * - Can fetch data directly
 * - Smaller client bundle
 * - Better SEO
 * - No client-side state
 *
 * ## AuthProvider (Client Component)
 *
 * **Characteristics:**
 * - Has 'use client' directive
 * - Manages state
 * - Listens to auth changes
 * - Provides context to children
 *
 * ## Best Practice
 *
 * | Component Type | Use When |
 * |----------------|----------|
 * | Server | Default for layouts |
 * | Client | Need interactivity/state |
 *
 * **Pattern:**
 * - Keep layouts as server components when possible
 * - Only mark client when needed for interactivity
 * - Server components can render client components
 * - Client components CANNOT render server components
 */
