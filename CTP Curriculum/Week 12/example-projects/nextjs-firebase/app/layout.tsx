/**
 * REF: root-layout
 *
 * # Root Layout - Application Shell
 *
 * The root layout wraps all pages in the application.
 *
 * ## Key Concepts
 *
 * - **Next.js Layout:** Wraps pages with common UI
 * - **Font Optimization:** Next.js optimizes Google Fonts
 * - **Global Providers:** AuthProvider wraps entire app
 * - **Metadata:** SEO tags for the site
 *
 * ## Layout Hierarchy
 *
 * ```
 * app/layout.tsx (this file)
 *   └── app/page.tsx (landing)
 *   └── app/(dashboard)/layout.tsx (dashboard shell)
 *       └── app/(dashboard)/dashboard/page.tsx
 *       └── app/(dashboard)/feed/page.tsx
 *       └── etc.
 * ```
 *
 * Layouts nest and compose together.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * REF: font-optimization
 *
 * ## Font Optimization with Next.js
 *
 * Next.js automatically optimizes Google Fonts:
 * - Downloads at build time
 * - Self-hosts (no external requests)
 * - Subsetting (only needed characters)
 * - Preloading (faster page loads)
 *
 * ### Inter Font
 *
 * Modern, clean sans-serif font.
 * `subsets: ['latin']` includes only Latin characters.
 */
const inter = Inter({ subsets: ['latin'] })
// CLOSE: font-optimization

/**
 * REF: metadata-export
 *
 * ## Metadata for SEO
 *
 * Static metadata applied to all pages.
 *
 * ### Can Override Per Page
 *
 * ```typescript
 * // In app/dashboard/page.tsx
 * export const metadata = {
 *   title: 'Dashboard - Todo App'
 * }
 * ```
 *
 * Child pages can override parent metadata.
 */
export const metadata: Metadata = {
  title: 'Todo App - Next.js + Firebase',
  description: 'A full-stack todo application with real-time features',
}
// CLOSE: metadata-export

/**
 * REF: root-layout-component
 *
 * ## RootLayout Component
 *
 * The outermost layout component.
 *
 * ### Structure
 *
 * - `<html>`: Root HTML element
 * - `<body>`: Body with font applied
 * - `<AuthProvider>`: Makes auth available everywhere
 * - `{children}`: Nested pages render here
 *
 * ### Why AuthProvider Here?
 *
 * Wrap at root level so:
 * - All components can use `useAuth()`
 * - No need to pass user as props
 * - Single auth state for entire app
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
// CLOSE: root-layout-component
// CLOSE: root-layout
