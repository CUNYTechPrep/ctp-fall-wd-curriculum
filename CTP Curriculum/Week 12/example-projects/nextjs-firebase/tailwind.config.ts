/**
 * REF: file-header
 *
 * # Tailwind CSS Configuration
 *
 * Configuration for Tailwind CSS in the Next.js + Firebase project.
 *
 * ## What is Tailwind?
 * Utility-first CSS framework that generates styles based on class names used in your code.
 *
 * ## How It Works
 * | Step | Process |
 * |------|---------|
 * | `1` | Scans files in `content` array |
 * | `2` | Finds Tailwind classes (e.g., `bg-blue-500`) |
 * | `3` | Generates only CSS for used classes |
 * | `4` | Results in minimal bundle size |
 *
 * ## Benefits
 * - **JIT**: Just-In-Time compilation for fast builds
 * - **Tree-shaking**: Only includes used styles
 * - **Type-safe**: With TypeScript configuration
 * - **Customizable**: Extend theme as needed
 */
// CLOSE: file-header

/**
 * REF: imports
 *
 * ## Import TypeScript Types
 *
 * Import `Config` type for type-safe configuration.
 */
import type { Config } from 'tailwindcss'
// CLOSE: imports

/**
 * REF: config-object
 *
 * ## Tailwind Configuration Object
 *
 * Main configuration with TypeScript typing for IDE support and validation.
 */
const config: Config = {
  /**
   * REF: content-paths
   *
   * ## Content Paths
   *
   * Specifies which files Tailwind should scan for class names.
   *
   * ### Glob Patterns
   * | Pattern | Matches | Purpose |
   * |---------|---------|---------|
   * | `./pages/**\/*.{js,ts,jsx,tsx,mdx}` | Pages directory | Pages Router |
   * | `./components/**\/*.{js,ts,jsx,tsx,mdx}` | Components | React components |
   * | `./app/**\/*.{js,ts,jsx,tsx,mdx}` | App directory | App Router |
   *
   * ### File Extensions
   * - `.js` / `.jsx`: JavaScript/React
   * - `.ts` / `.tsx`: TypeScript/React
   * - `.mdx`: Markdown + JSX
   *
   * ### Performance
   * Only scans these paths, generates only needed CSS.
   *
   * ### Example Detection
   * ```tsx
   * <div className="bg-blue-500 text-white p-4 rounded-lg">
   *   // Tailwind finds: bg-blue-500, text-white, p-4, rounded-lg
   * </div>
   * ```
   */
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // CLOSE: content-paths

  /**
   * REF: theme-config
   *
   * ## Theme Configuration
   *
   * Customize or extend Tailwind's default theme.
   *
   * ### Extend vs Replace
   * - `extend`: Adds to defaults (recommended)
   * - Direct properties: Replace defaults
   *
   * ### Default Configuration
   * Empty `extend` uses all Tailwind defaults:
   * - Color palette (blue, red, green, etc.)
   * - Spacing scale (1, 2, 4, 8, etc.)
   * - Breakpoints (sm, md, lg, xl, 2xl)
   * - Font families
   *
   * ### Extending Example
   * ```typescript
   * theme: {
   *   extend: {
   *     colors: {
   *       primary: '#3b82f6',
   *       secondary: '#8b5cf6',
   *     },
   *     spacing: {
   *       '128': '32rem',
   *     },
   *     fontFamily: {
   *       custom: ['Inter', 'sans-serif'],
   *     },
   *   },
   * }
   * ```
   *
   * ### Usage After Extending
   * ```tsx
   * <div className="bg-primary text-secondary p-128 font-custom" />
   * ```
   */
  theme: {
    extend: {},
  },
  // CLOSE: theme-config

  /**
   * REF: plugins-config
   *
   * ## Plugins Configuration
   *
   * Array of Tailwind plugins for additional functionality.
   *
   * ### What Are Plugins?
   * Add new utilities, components, or features to Tailwind.
   *
   * ### Popular Plugins
   * | Plugin | Purpose |
   * |--------|---------|
   * | `@tailwindcss/forms` | Better form styling |
   * | `@tailwindcss/typography` | Prose/markdown styling |
   * | `@tailwindcss/aspect-ratio` | Aspect ratio utilities |
   * | `@tailwindcss/line-clamp` | Line clamping |
   *
   * ### Adding Plugins
   * ```bash
   * npm install @tailwindcss/forms
   * ```
   * ```typescript
   * import forms from '@tailwindcss/forms'
   *
   * plugins: [forms],
   * ```
   *
   * ### Default
   * Empty array = no additional plugins, all default utilities available.
   */
  plugins: [],
  // CLOSE: plugins-config
}
// CLOSE: config-object

/**
 * REF: export
 *
 * ## Export Configuration
 *
 * Export config for Next.js and Tailwind to use automatically.
 */
export default config
// CLOSE: export

/**
 * REF: usage-patterns
 *
 * ## Common Tailwind Patterns in Project
 *
 * Examples of Tailwind usage throughout the codebase.
 *
 * ### Layout Classes
 * ```tsx
 * // Flexbox
 * <div className="flex items-center justify-between gap-4">
 *
 * // Grid
 * <div className="grid grid-cols-3 gap-6">
 *
 * // Spacing
 * <div className="p-4 m-2 space-y-3">
 * ```
 *
 * ### Styling Classes
 * ```tsx
 * // Colors
 * <div className="bg-blue-500 text-white">
 *
 * // Typography
 * <h1 className="text-2xl font-bold">
 *
 * // Borders
 * <div className="border border-gray-300 rounded-lg">
 * ```
 *
 * ### Responsive Classes
 * ```tsx
 * // Mobile-first breakpoints
 * <div className="w-full md:w-1/2 lg:w-1/3">
 * // Full width mobile, half tablet, third desktop
 * ```
 *
 * ### Dark Mode Classes
 * ```tsx
 * <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
 * ```
 *
 * ### State Classes
 * ```tsx
 * <button className="bg-blue-500 hover:bg-blue-700 focus:ring-2 active:scale-95">
 * ```
 */
// CLOSE: usage-patterns

/**
 * REF: performance-notes
 *
 * ## Performance Optimizations
 *
 * Tailwind automatically optimizes CSS output.
 *
 * ### JIT Mode
 * - Generates styles on-demand
 * - Faster build times
 * - Smaller CSS bundles
 * - Arbitrary value support (e.g., `w-[73px]`)
 *
 * ### Production Build
 * ```bash
 * npm run build
 * ```
 * - Removes unused CSS
 * - Minifies output
 * - Optimizes for performance
 *
 * ### Bundle Size
 * | Environment | CSS Size |
 * |-------------|----------|
 * | `Development` | All utilities available |
 * | `Production` | Only used utilities |
 * | `Typical` | 10-50KB gzipped |
 */
// CLOSE: performance-notes

/**
 * REF: resources
 *
 * ## Customization Resources
 *
 * ### Official Documentation
 * - Main docs: https://tailwindcss.com/docs
 * - Configuration: https://tailwindcss.com/docs/configuration
 * - Theme: https://tailwindcss.com/docs/theme
 * - Plugins: https://tailwindcss.com/docs/plugins
 * - Dark Mode: https://tailwindcss.com/docs/dark-mode
 *
 * ### VS Code Extension
 * **Tailwind CSS IntelliSense**
 * - Class name autocomplete
 * - CSS value preview on hover
 * - Class name validation
 * - Syntax highlighting
 */
// CLOSE: resources
