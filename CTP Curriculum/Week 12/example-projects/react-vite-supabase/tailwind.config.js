/**
 * REF: Tailwind CSS Configuration
 *
 * Configures Tailwind CSS utility-first framework for the React application.
 * Defines content scanning, dark mode, theme customization, and plugin setup.
 *
 * CLOSE: Tailwind reads this config at build time to generate CSS.
 * Scans specified files for class usage and tree-shakes unused styles.
 *
 * CONFIGURATION SECTIONS:
 * | Section | Purpose |
 * |---------|---------|
 * | content | File paths to scan for classes |
 * | darkMode | Dark mode strategy |
 * | theme | Design tokens (colors, fonts, spacing) |
 * | theme.extend | Add custom tokens without replacing defaults |
 * | plugins | Third-party Tailwind extensions |
 *
 * CONTENT PATHS:
 * ```javascript
 * content: [
 *   './index.html',              // Root HTML file
 *   './src/**\/*.{js,ts,jsx,tsx}' // All source files (JS, TS, JSX, TSX)
 * ]
 * ```
 * - Tailwind scans these files for class names
 * - Unused classes are removed (tree-shaking)
 * - Keeps bundle size small
 * - Supports glob patterns
 *
 * DARK MODE STRATEGY:
 * | Value | Trigger | Usage |
 * |-------|---------|-------|
 * | 'media' | OS preference (prefers-color-scheme) | Automatic based on system |
 * | 'class' | .dark class on root element | Manual toggle via JavaScript |
 *
 * Current: 'media' (automatic dark mode based on OS)
 *
 * THEME EXTENSION:
 * - theme.extend: {} - Currently empty (using Tailwind defaults)
 * - Can add custom colors, spacing, fonts, etc.
 * - Example:
 * ```javascript
 * theme: {
 *   extend: {
 *     colors: {
 *       brand: '#7c3aed',
 *       'brand-dark': '#5b21b6'
 *     },
 *     spacing: {
 *       '128': '32rem'
 *     }
 *   }
 * }
 * ```
 *
 * PLUGINS:
 * - plugins: [] - Currently empty
 * - Common plugins:
 *   - @tailwindcss/forms - Better form styling
 *   - @tailwindcss/typography - Prose styles
 *   - @tailwindcss/aspect-ratio - Aspect ratio utilities
 *   - @tailwindcss/line-clamp - Line clamping
 *
 * BUILD PROCESS:
 * 1. Vite runs Tailwind plugin
 * 2. Tailwind reads this config file
 * 3. Scans content files for class names
 * 4. Generates CSS for used classes only
 * 5. Injects CSS into bundle
 * 6. Tree-shakes unused utilities
 * 7. Minifies for production
 *
 * PERFORMANCE:
 * - Development: Generates all utilities (~3MB uncompressed)
 * - Production: Only used classes (~5-20KB compressed)
 * - JIT (Just-In-Time) compiler for instant builds
 * - Hot reload updates CSS immediately
 *
 * UTILITY CLASSES:
 * Tailwind provides thousands of utilities:
 * - Layout: flex, grid, container, space-y-4
 * - Typography: text-xl, font-bold, leading-tight
 * - Colors: bg-purple-600, text-white, border-gray-300
 * - Spacing: p-4, m-2, gap-6
 * - Sizing: w-full, h-screen, max-w-md
 * - Effects: shadow-lg, rounded-lg, hover:bg-blue-700
 * - Responsive: sm:text-base, md:grid-cols-2, lg:px-8
 * - State: hover:, focus:, active:, disabled:
 *
 * RESPONSIVE DESIGN:
 * Default breakpoints:
 * | Prefix | Min Width | Target |
 * |--------|-----------|--------|
 * | (none) | 0px | Mobile-first base |
 * | sm: | 640px | Small tablets |
 * | md: | 768px | Tablets |
 * | lg: | 1024px | Laptops |
 * | xl: | 1280px | Desktops |
 * | 2xl: | 1536px | Large screens |
 *
 * Usage:
 * ```jsx
 * <div className="text-sm md:text-base lg:text-lg">
 *   Responsive text size
 * </div>
 * ```
 *
 * DARK MODE CLASSES:
 * With darkMode: 'media':
 * ```jsx
 * <div className="bg-white dark:bg-gray-900">
 *   Automatically switches based on OS preference
 * </div>
 * ```
 *
 * CUSTOMIZATION EXAMPLES:
 * Add custom theme values:
 * ```javascript
 * theme: {
 *   extend: {
 *     colors: {
 *       'todo-purple': '#7c3aed'
 *     },
 *     fontFamily: {
 *       sans: ['Inter', 'sans-serif']
 *     },
 *     borderRadius: {
 *       'xl': '1rem'
 *     }
 *   }
 * }
 * ```
 *
 * FILE REFERENCES:
 * - src/index.css - Imports Tailwind directives
 * - vite.config.ts - Vite processes Tailwind CSS
 * - postcss.config.js - PostCSS configuration for Tailwind
 *
 * KEY CONCEPTS:
 * - Utility-first CSS framework
 * - JIT (Just-In-Time) compilation
 * - Tree-shaking removes unused styles
 * - Mobile-first responsive design
 * - Automatic dark mode support
 * - No custom CSS needed (utilities cover most cases)
 * - Smaller bundle size vs traditional CSS
 * - Consistent design tokens
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  plugins: [],
}

/**
 * TAILWIND IN PRODUCTION
 *
 * Build output:
 * - Scans all files in content array
 * - Extracts class names used
 * - Generates CSS for those classes only
 * - Minifies and compresses
 * - Typical size: 5-15KB gzipped
 *
 * Compare to Bootstrap (~50KB gzipped):
 * - Tailwind: Only what you use
 * - Bootstrap: Everything whether you use it or not
 */

/**
 * POSTCSS INTEGRATION
 *
 * Tailwind uses PostCSS:
 * - Processes @tailwind directives
 * - Injects generated utilities
 * - Applies autoprefixer
 * - Minifies in production
 *
 * See postcss.config.js for configuration
 */

/**
 * VITE + TAILWIND
 *
 * In development:
 * - Instant HMR for CSS changes
 * - JIT generates classes on-demand
 * - No need to rebuild entire CSS
 * - See changes immediately
 *
 * In production:
 * - npm run build
 * - Tailwind purges unused styles
 * - CSS minified and hashed
 * - Ready for deployment
 */
