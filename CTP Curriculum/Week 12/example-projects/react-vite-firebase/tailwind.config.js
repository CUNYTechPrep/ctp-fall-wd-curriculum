/**
 * REF: Tailwind CSS Configuration
 *
 * Configures Tailwind CSS for the React + Vite SPA.
 *
 * ## How Tailwind Works in Vite
 *
 * ### Build Pipeline
 * ```
 * Source Files (TSX, CSS)
 *    ↓
 * PostCSS (processes Tailwind directives)
 *    ↓
 * Vite (bundles and optimizes)
 *    ↓
 * Browser (applies styles)
 * ```
 *
 * ### Development vs Production
 *
 * | `Stage` | `Behavior` | File Size |
 * |-------|----------|-----------|
 * | **Development** | All utilities available | ~3-5 MB |
 * | **Production** | Only used classes | ~10-50 KB |
 *
 * ### CSS Purging / Tree-Shaking
 * Tailwind automatically removes unused CSS in production:
 * 1. Scans all files in `content` array for class names
 * 2. Identifies used utilities (e.g., `bg-blue-600`)
 * 3. Includes only those in final CSS
 * 4. Drops everything else
 * 5. Result: Tiny stylesheet
 *
 * ## Responsive Design Approach
 *
 * Tailwind uses **mobile-first** breakpoints:
 * - `sm`: 640px and up
 * - `md`: 768px and up
 * - `lg`: 1024px and up
 * - `xl`: 1280px and up
 * - `2xl`: 1536px and up
 *
 * Write mobile styles first, then add responsive variants:
 * ```jsx
 * <div className="text-sm md:text-base lg:text-lg">
 *   Responsive text
 * </div>
 * ```
 *
 * ## Dark Mode Support
 *
 * Uses system preference (`prefers-color-scheme`):
 * ```jsx
 * <div className="bg-white dark:bg-gray-800">
 *   Light mode white, dark mode gray
 * </div>
 * ```
 *
 * CLOSE
 */

/** @type {import('tailwindcss').Config} */
export default {
  // REF: CONTENT PATHS
/**
   * CONTENT PATHS
   *
   * Tell Tailwind which files to scan for class names
   *
   * GLOB PATTERNS:
   * - ./index.html: Root HTML file
   * - ./src/**/*.{js,ts,jsx,tsx}: All source files
   *
   * Tailwind scans these files looking for classes like:
   * - className="bg-blue-600"
   * - className={`text-${size}`} (dynamic classes)
   *
   * SAFELIST:
   * Dynamic classes need safelisting:
   * ```javascript
   * safelist: [
   *   'bg-blue-600',
   *   'text-sm',
   *   'text-lg',
   * ]
   * ```
   */
// CLOSE
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // REF: DARK MODE STRATEGY
/**
   * DARK MODE STRATEGY
   *
   * 'media': Uses prefers-color-scheme (system preference)
   * 'class': Manual toggle with 'dark' class on <html>
   *
   * We use 'media' by default
   * Can add manual toggle later
   */
// CLOSE
  darkMode: 'media',

  // REF: THEME CUSTOMIZATION
/**
   * THEME CUSTOMIZATION
   *
   * Extend or override Tailwind's default theme
   */
// CLOSE
  theme: {
    extend: {
      // REF: CUSTOM COLORS
/**
       * CUSTOM COLORS
       *
       * Add brand colors:
       * ```javascript
       * colors: {
       *   brand: {
       *     50: '#f0f9ff',
       *     100: '#e0f2fe',
       *     // ... up to 900
       *   }
       * }
       * ```
       *
       * Use as: bg-brand-500, text-brand-700
       */
// CLOSE

      // REF: CUSTOM SPACING
/**
       * CUSTOM SPACING
       *
       * Add custom spacing values:
       * ```javascript
       * spacing: {
       *   '128': '32rem',
       *   '144': '36rem',
       * }
       * ```
       */
// CLOSE

      // REF: CUSTOM BREAKPOINTS
/**
       * CUSTOM BREAKPOINTS
       *
       * Add custom responsive breakpoints:
       * ```javascript
       * screens: {
       *   '3xl': '1920px',
       * }
       * ```
       */
// CLOSE
    },
  },

  // REF: PLUGINS
/**
   * PLUGINS
   *
   * Extend Tailwind with plugins
   *
   * POPULAR PLUGINS:
   * ```javascript
   * plugins: [
   *   require('@tailwindcss/forms'),       // Better form styles
   *   require('@tailwindcss/typography'),  // Prose classes for content
   *   require('@tailwindcss/aspect-ratio'),// Aspect ratio utilities
   *   require('@tailwindcss/line-clamp'),  // Text truncation
   * ]
   * ```
   */
// CLOSE
  plugins: [],
}

// REF: JIT MODE (JUST-IN-TIME)
/**
 * JIT MODE (JUST-IN-TIME)
 *
 * Tailwind v3+ uses JIT by default:
 * - Generates classes on-demand
 * - Faster build times
 * - All variants available
 * - Arbitrary values work: p-[17px]
 * - Smaller dev bundle
 *
 * No configuration needed - it just works!
 */
// CLOSE

// REF: ARBITRARY VALUES
/**
 * ARBITRARY VALUES
 *
 * Create one-off utilities:
 * - bg-[#1da1f2]: Custom background color
 * - w-[347px]: Specific width
 * - top-[117px]: Exact positioning
 * - grid-cols-[1fr_500px_2fr]: Custom grid
 *
 * Great for unique designs!
 */
// CLOSE

// REF: RESPONSIVE DESIGN
/**
 * RESPONSIVE DESIGN
 *
 * Tailwind mobile-first breakpoints:
 * - sm: @media (min-width: 640px)
 * - md: @media (min-width: 768px)
 * - lg: @media (min-width: 1024px)
 * - xl: @media (min-width: 1280px)
 * - 2xl: @media (min-width: 1536px)
 *
 * Usage:
 * ```jsx
 * <div className="text-sm md:text-base lg:text-lg">
 *   Responsive text
 * </div>
 * ```
 *
 * Mobile: text-sm
 * Tablet: text-base
 * Desktop: text-lg
 */
// CLOSE

// REF: DARK MODE
/**
 * DARK MODE
 *
 * Usage with dark: prefix:
 * ```jsx
 * <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
 *   Content
 * </div>
 * ```
 *
 * Automatically swaps based on preference!
 */
// CLOSE

// REF: PRODUCTION OPTIMIZATION
/**
 * PRODUCTION OPTIMIZATION
 *
 * In production build, Tailwind:
 * 1. Scans all content files
 * 2. Finds used classes
 * 3. Generates only those classes
 * 4. Minifies CSS
 * 5. Compresses with gzip
 *
 * Result: Tiny CSS file (usually 5-20KB)
 */
// CLOSE
