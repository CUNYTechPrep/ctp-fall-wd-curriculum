/**
 * REF: file-header
 *
 * # Root Layout - Next.js Application Shell
 *
 * This is the root layout component that wraps the entire Next.js application. It's required
 * in the app directory and provides the foundational HTML structure.
 *
 * ## Purpose
 * - Define global HTML structure (html, body tags)
 * - Load and apply fonts
 * - Include global styles
 * - Wrap app with context providers
 * - Set metadata for SEO
 *
 * ## Architecture
 * This layout persists across page navigations and doesn't re-render, making it ideal for:
 * - Authentication providers
 * - Theme providers
 * - Global UI elements
 * - Font loading
 */
// CLOSE: file-header

/**
 * REF: type-imports
 *
 * ## TypeScript Type Imports
 *
 * ## Metadata Type
 * Type definition from Next.js for page metadata configuration.
 *
 * ### Why Type-Only Import?
 * - Doesn't affect bundle size
 * - Provides compile-time type checking
 * - Required for Next.js 13+ metadata API
 *
 * ### Usage
 * Used to type the metadata export that defines page title, description, and other SEO properties.
 */
import type { Metadata } from 'next'
// CLOSE: type-imports

/**
 * REF: font-optimization
 *
 * ## Next.js Font Optimization
 *
 * ## Inter Font from Google Fonts
 * Next.js provides automatic Google Fonts optimization through next/font/google.
 *
 * ### How It Works
 * 1. Font is downloaded at build time
 * 2. Self-hosted in your application (no Google request at runtime)
 * 3. Automatic font subsetting for smaller file sizes
 * 4. Zero layout shift with font-display: swap
 *
 * ### Configuration
 * - `subsets: ['latin']` - Only include Latin characters
 * - Significantly reduces font file size
 * - Can add more subsets if needed (cyrillic, greek, etc.)
 *
 * ### Performance Benefits
 * - No external font requests
 * - Reduced bandwidth usage
 * - Improved Core Web Vitals
 * - Better privacy (no Google tracking)
 */
import { Inter } from 'next/font/google'
// CLOSE: font-optimization

/**
 * REF: global-styles
 *
 * ## Global Styles Import
 *
 * ## Tailwind CSS Configuration
 * This import loads the global stylesheet that contains:
 * - Tailwind CSS base styles
 * - Tailwind component classes
 * - Tailwind utility classes
 * - Custom global CSS rules
 *
 * ### Loading Strategy
 * - Imported only in root layout
 * - Applies to entire application
 * - Contains Tailwind directives (@tailwind base, components, utilities)
 *
 * ### Why Only Here?
 * CSS is global by nature, so importing in the root layout ensures it's loaded once
 * and available everywhere without duplication.
 */
import './globals.css'
// CLOSE: global-styles

/**
 * REF: auth-provider-import
 *
 * ## Authentication Context Provider
 *
 * ## AuthProvider Component
 * React Context Provider that manages authentication state globally.
 *
 * ### What It Provides
 * - User authentication state
 * - Sign in method
 * - Sign out method
 * - Sign up method
 * - Loading state
 *
 * ### Integration
 * - Wraps Supabase auth
 * - Makes useAuth() hook available to all components
 * - Handles auth state changes automatically
 * - Manages JWT tokens and sessions
 *
 * ### Why in Root Layout?
 * Placing the provider here makes auth state available to every page and component
 * in the application without prop drilling.
 */
import { AuthProvider } from '@/contexts/AuthContext'
// CLOSE: auth-provider-import

/**
 * REF: font-instance
 *
 * ## Font Configuration Instance
 *
 * ## Creating Inter Font Instance
 * Creates a configured instance of the Inter font that can be applied to elements.
 *
 * ### Configuration
 * - `subsets: ['latin']` - Character set to include
 *
 * ### Usage Pattern
 * - Created once as module-level constant
 * - Applied via className in body element
 * - Next.js generates optimized CSS automatically
 * - Returns an object with className and style properties
 */
const inter = Inter({ subsets: ['latin'] })
// CLOSE: font-instance

/**
 * REF: metadata-export
 *
 * ## Metadata Export - SEO Configuration
 *
 * ## Next.js Metadata API
 * Static metadata that defines SEO properties for the application.
 *
 * ### Fields
 * - `title` - Page title shown in browser tab and search results
 * - `description` - Page description for search result snippets and social shares
 *
 * ### SEO Best Practices
 * - Title: 50-60 characters optimal for search results
 * - Description: 150-160 characters for Google snippet display
 * - Include relevant keywords naturally
 * - Accurately describe the page content
 *
 * ### How It Works
 * - Defined at build time
 * - Automatically converted to HTML meta tags
 * - Can be overridden in child pages
 * - Improves SEO and social sharing
 *
 * ### Social Sharing
 * These values are used by:
 * - Search engines (Google, Bing)
 * - Social platforms (Twitter, Facebook)
 * - Messaging apps with link previews
 */
export const metadata: Metadata = {
  title: 'Todo App - Next.js + Supabase + Drizzle',
  description: 'Full-stack todo app with type-safe database queries using Drizzle ORM',
}
// CLOSE: metadata-export

/**
 * REF: root-layout-component
 *
 * ## RootLayout Component - Application Shell
 *
 * ## Required Root Layout
 * This is the required root layout for all Next.js 13+ applications.
 *
 * ### Component Type
 * - Server Component (default in Next.js 15)
 * - Renders on the server
 * - No client-side JavaScript needed for layout itself
 *
 * ### Requirements
 * - Must exist in app directory root
 * - Must include html and body tags
 * - Only place these tags can be defined
 *
 * ### Props
 * - `children` - All page content rendered inside this layout
 *
 * ### Behavior
 * - Wraps all pages and nested layouts
 * - Preserves state on navigation (doesn't re-render)
 * - Provides consistent structure across the app
 *
 * ### Provider Pattern
 * - AuthProvider wraps children for global auth state
 * - Makes useAuth() available everywhere
 * - Client components can consume server-rendered layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/**
       * REF: html-element
       *
       * # HTML Root Element
       *
       * ## Language Attribute
       * The `lang` attribute specifies the document's language.
       *
       * ### Accessibility Benefits
       * - Screen readers use this for proper pronunciation
       * - Helps with text-to-speech engines
       * - Required for WCAG 2.0 compliance
       * - Supports browser translation features
       *
       * ### Values
       * - "en" for English
       * - "es" for Spanish
       * - "fr" for French
       * - Use ISO 639-1 codes
       */}
      <html lang="en">
        {/* CLOSE: html-element */}

        {/**
         * REF: body-element
         *
         * # Body Element with Font
         *
         * ## Font Application
         * The `inter.className` applies the optimized Inter font.
         *
         * ### How It Works
         * - `inter.className` returns a generated class name like "__className_a1b2c3"
         * - Next.js automatically injects CSS for this class
         * - CSS includes font-family and font-display settings
         * - No Flash of Unstyled Text (FOUT) thanks to optimization
         *
         * ### Generated CSS
         * Next.js generates something like:
         * ```css
         * .__className_a1b2c3 {
         *   font-family: '__Inter_a1b2c3', sans-serif;
         *   font-display: swap;
         * }
         * ```
         */}
        <body className={inter.className}>
          {/* CLOSE: body-element */}

          {/**
           * REF: auth-provider-wrapper
           *
           * # AuthProvider Context Wrapper
           *
           * ## Global Authentication State
           * Wraps the entire application with authentication context.
           *
           * ### What It Provides
           * - `user` - Current authenticated user object or null
           * - `loading` - Boolean indicating initial auth check
           * - `signIn(email, password)` - Method to sign in
           * - `signUp(email, password, metadata)` - Method to create account
           * - `signOut()` - Method to sign out
           *
           * ### Implementation Details
           * - Uses Supabase auth under the hood
           * - Listens to auth state changes automatically
           * - Provides type-safe auth methods
           * - Integrates with Drizzle queries (use user.id for filtering)
           *
           * ### Usage in Components
           * ```typescript
           * import { useAuth } from '@/contexts/AuthContext'
           *
           * function MyComponent() {
           *   const { user, signIn, signOut } = useAuth()
           *
           *   if (!user) return <div>Please sign in</div>
           *
           *   return <div>Welcome {user.email}</div>
           * }
           * ```
           *
           * ### Why Client Component?
           * - AuthProvider uses React hooks (useState, useEffect)
           * - Listens to Supabase auth state changes
           * - Must be a client component
           * - But wrapping server components is perfectly fine
           *
           * ### Server/Client Boundary
           * - This is a client component
           * - children can still be server components
           * - React handles the boundary automatically
           */}
          <AuthProvider>
            {children}
          </AuthProvider>
          {/* CLOSE: auth-provider-wrapper */}
        </body>
      </html>
    </>
  )
}
// CLOSE: root-layout-component

/**
 * REF: architecture-notes
 *
 * ## Hybrid Architecture Notes
 *
 * ## Why Supabase + Drizzle?
 *
 * ### Supabase Strengths
 * - Best-in-class authentication system
 * - Easy file storage with S3-compatible API
 * - Real-time subscriptions via WebSockets
 * - Row Level Security for data protection
 * - Auto-generated REST API
 *
 * ### Drizzle Strengths
 * - Perfect TypeScript type inference
 * - SQL-like query syntax that's familiar
 * - Type-safe database operations
 * - Powerful migration system
 * - No code generation needed
 * - Better autocomplete than any ORM
 *
 * ### Best of Both Worlds
 * - Use Supabase for auth, storage, and real-time
 * - Use Drizzle for type-safe database queries
 * - Each tool does what it's best at
 * - Clean separation of concerns
 * - Maximum developer experience
 */
// CLOSE: architecture-notes
