/**
 * REF: Application Entry Point
 *
 * Bootstrap module that mounts the React application to the DOM.
 * Handles React initialization, strict mode, and root setup.
 *
 * CLOSE: This is the very first file executed. It finds the #root element in HTML,
 * creates a React root, and renders the App component with StrictMode enabled.
 *
 * ## Execution Flow
 * 1. Vite loads main.tsx on page load
 * 2. import statements are parsed
 * 3. React and ReactDOM libraries are loaded
 * 4. App component is loaded
 * 5. CSS is injected into document
 * 6. ReactDOM.createRoot() finds #root div in HTML
 * 7. StrictMode wrapper is applied
 * 8. App component is rendered
 * 9. AuthProvider and BrowserRouter initialize
 * 10. Initial route and components are rendered
 *
 * ## Tech Stack
 * | `Component` | `Role` |
 * |-----------|------|
 * | `ReactDOM` | React rendering engine |
 * | React 18 | Concurrent rendering features |
 * | `StrictMode` | Development helper for detecting issues |
 * | `App` | Root application component |
 * | Tailwind CSS | Utility-first CSS framework |
 *
 * FILE REFERENCES:
 * - ./App.tsx - Root component with routing
 * - ./index.css - Global styles with Tailwind directives
 *
 * VITE HOT MODULE REPLACEMENT:
 * - In development, changes are detected immediately
 * - Component state is preserved across edits (when possible)
 * - Error overlay shows compilation issues
 * - No full page reload needed
 *
 * PRODUCTION BUILD:
 * - npm run build creates dist/ folder
 * - Files are minified and bundled
 * - Assets get content-hash filenames for caching
 * - Source maps are created for debugging (optional)
 *
 * ## Key Concepts
 * - Entry point for entire application
 * - Mounts to single <div id="root"> in HTML
 * - StrictMode helps catch React best practice violations
 * - React 18 enables concurrent rendering
 * - All subsequent components inherit from here
 */

  /** REF: imports
   */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
  // CLOSE: imports

/**
 * RENDER APPLICATION
 *
 * React 18 concurrent features enabled
 * StrictMode helps find bugs in development
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/**
 * REACT + SUPABASE ARCHITECTURE
 *
 * Simple but powerful:
 * - Frontend: React (UI, state, routing)
 * - Backend: Supabase (auth, database, storage)
 * - Database: PostgreSQL (SQL power)
 * - Security: RLS (database-level)
 * - Deployment: Static files (cheap!)
 *
 * All from the browser:
 * ```typescript
 * import { supabase } from './lib/supabase'
 *
 * // Query PostgreSQL from browser
 * const { data } = await supabase
 *   .from('todos')
 *   .select('*')
 *
 * // RLS ensures you only get your data
 * ```
 */

/**
 * VITE HOT MODULE REPLACEMENT
 *
 * In development, Vite provides:
 * - Instant HMR (hot module replacement)
 * - Preserves component state
 * - Shows errors as overlay
 * - No full page reload
 *
 * This is why Vite is so fast!
 */

/**
 * PRODUCTION BUILD
 *
 * When you run: npm run build
 *
 * Vite creates:
 * - dist/index.html (entry point)
 * - dist/assets/main-[hash].js (app bundle)
 * - dist/assets/main-[hash].css (styles)
 *
 * Hashed filenames enable:
 * - Long-term caching
 * - Cache busting on updates
 * - Parallel downloads
 */

/**
 * REF: react-18-features
 *
 * ## React 18 New Features
 *
 * ### Concurrent Rendering
 * React 18 can pause and resume rendering:
 * - Low-priority updates don't block UI
 * - Typing stays responsive during rendering
 * - Complex renders don't freeze app
 * - User interactions always prioritized
 *
 * ### Automatic Batching
 * Multiple state updates happen together:
 * ```typescript
 * setTitle(...)
 * setDescription(...)
 * // Both batched into one render
 * ```
 *
 * ### useTransition Hook
 * Mark updates as non-urgent:
 * ```typescript
 * const [isPending, startTransition] = useTransition()
 *
 * startTransition(() => {
 *   setSearchResults(...)  // Low priority
 * })
 *
 * {isPending && <Spinner />}
 * ```
 *
 * ### Suspense for Data
 * Lazy load components with data:
 * ```typescript
 * <Suspense fallback={<Loading />}>
 *   <UserProfile />
 * </Suspense>
 * ```
 *
 * CLOSE: react-18-features
 */

