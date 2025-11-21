/**
 * REF: Application Entry Point - React 18 + Vite
 *
 * Main entry point that initializes the React application and mounts it to the DOM.
 *
 * ## React 18 Evolution
 *
 * ### React 17 (Old)
 * ```typescript
 * ReactDOM.render(<App />, document.getElementById('root'))
 * ```
 *
 * ### React 18 (New)
 * ```typescript
 * ReactDOM.createRoot(document.getElementById('root')).render(<App />)
 * ```
 *
 * ## Why React 18 is Better
 *
 * | Feature | React 17 | React 18 |
 * |---------|----------|----------|
 * | **API** | Legacy render | Modern createRoot |
 * | **Concurrent Rendering** | `No` | `Yes` |
 * | **Automatic Batching** | `Conditional` | `Always` |
 * | **Suspense** | `Experimental` | `Stable` |
 * | **Transitions** | `No` | Yes (useTransition) |
 * | **Performance** | `Good` | `Better` |
 *
 * ### Key React 18 Features
 * - **Concurrent rendering**: Prioritizes urgent updates
 * - **Automatic batching**: Combines multiple state updates
 * - **Suspense**: Better support for async rendering
 * - **useTransition**: Non-urgent updates don't block UI
 *
 * ## StrictMode Development Tool
 *
 * **Only runs in development**, caught in double-rendering:
 * 1. Component mounts
 * 2. Effects run
 * 3. Components **unmount** (StrictMode only)
 * 4. Effects cleanup runs
 * 5. Components **remount** (StrictMode only)
 * 6. Effects run again
 *
 * **Purpose**: Ensure effects are idempotent and cleanup works properly.
 * **Result**: Catches bugs that would appear randomly in production.
 *
 * CLOSE
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// REF: STRICT MODE WRAPPER
/**
 * STRICT MODE WRAPPER
 *
 * StrictMode is a development tool that:
 * - Identifies unsafe lifecycles
 * - Warns about legacy API usage
 * - Detects unexpected side effects
 * - Double-invokes effects (helps find bugs!)
 *
 * WHY EFFECTS RUN TWICE?
 * - Simulates mounting/unmounting
 * - Helps ensure cleanup functions work
 * - Catches effects that aren't idempotent
 * - Only in development, not production
 *
 * Example:
 * ```typescript
 * useEffect(() => {
 *   console.log('Mount') // Runs twice in StrictMode!
 *
 *   return () => {
 *     console.log('Cleanup') // Also runs twice
 *   }
 * }, [])
 * ```
 */
// CLOSE

// REF: CREATE ROOT
/**
 * CREATE ROOT
 *
 * React 18's new root API
 *
 * ## Process
 * 1. document.getElementById('root'): Find root element in index.html
 * 2. createRoot(): Create React root
 * 3. .render(): Render app into root
 *
 * ## Root Element
 * Defined in index.html:
 * ```html
 * <div id="root"></div>
 * ```
 *
 * React takes over this div and manages all rendering
 */
// CLOSE
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// CLOSE: CREATE ROOT

// REF: NON-NULL ASSERTION (!)
/**
 * NON-NULL ASSERTION (!)
 *
 * document.getElementById('root')!
 *
 * The ! tells TypeScript:
 * "I know this element exists, trust me"
 *
 * ## Alternatives
 * ```typescript
 * const root = document.getElementById('root')
 * if (!root) throw new Error('Root element not found')
 * ReactDOM.createRoot(root).render(...)
 * ```
 *
 * The ! is fine here because index.html has the root div
 */
// CLOSE

// REF: CSS IMPORTS
/**
 * CSS IMPORTS
 *
 * import './index.css'
 *
 * Vite handles CSS imports:
 * - Processes Tailwind directives
 * - Minifies CSS
 * - Adds to bundle
 * - Injects into page as <style> tag
 *
 * In production build:
 * - CSS extracted to separate file
 * - Cached separately
 * - Parallel loading with JS
 */
// CLOSE

// REF: HOT MODULE REPLACEMENT
/**
 * HOT MODULE REPLACEMENT
 *
 * Vite automatically enables HMR:
 * - Changes to this file trigger full reload
 * - Changes to components trigger hot update
 * - State preserved when possible
 * - Instant feedback
 *
 * You don't need to configure anything!
 */
// CLOSE

// REF: REACT 18 CONCURRENT FEATURES
/**
 * REACT 18 CONCURRENT FEATURES
 *
 * Using createRoot() enables:
 *
 * 1. **Automatic Batching:**
 * ```typescript
 * setState1(...)
 * setState2(...)
 * setState3(...)
 * // All batched into one render!
 * ```
 *
 * 2. **Transitions:**
 * ```typescript
 * import { useTransition } from 'react'
 *
 * const [isPending, startTransition] = useTransition()
 *
 * startTransition(() => {
 *   setSearchTerm(term) // Lower priority update
 * })
 * ```
 *
 * 3. **Suspense for Data Fetching:**
 * ```typescript
 * <Suspense fallback={<Loading />}>
 *   <DataComponent />
 * </Suspense>
 * ```
 */
// CLOSE

// REF: BUILD OUTPUT
/**
 * BUILD OUTPUT
 *
 * When you run: npm run build
 *
 * Vite processes this file and creates:
 * ```
 * dist/
 * ├── index.html (with script tag to main.js)
 * ├── assets/
 * │   ├── main-abc123.js (this file + App + dependencies)
 * │   └── main-abc123.css (styles)
 * ```
 *
 * The hash (abc123) changes when content changes
 * Enables long-term caching!
 */
// CLOSE

// REF: DEBUGGING
/**
 * DEBUGGING
 *
 * If you see "Root element not found":
 * 1. Check index.html has <div id="root"></div>
 * 2. Check file is in public/ or root directory
 * 3. Check Vite config for HTML plugin
 *
 * If you see "Cannot find module ./App.tsx":
 * 1. Check file exists in src/
 * 2. Check import path is correct
 * 3. Check file extension included (.tsx)
 */
// CLOSE
