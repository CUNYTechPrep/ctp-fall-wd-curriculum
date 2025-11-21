/**
 * REF: postcss-config-file
 *
 * # PostCSS Configuration
 *
 * Configures PostCSS plugins for CSS processing in the Next.js application.
 *
 * ## What is PostCSS?
 *
 * **PostCSS** is a tool for transforming CSS with JavaScript plugins.
 *
 * Think of it like Babel for CSS:
 * - Takes your CSS code as input
 * - Runs it through configured plugins
 * - Outputs transformed CSS
 *
 * ## PostCSS vs Sass/Less
 *
 * | Feature | `PostCSS` | Sass/Less |
 * |---------|---------|-----------|
 * | **Approach** | Plugin-based transformation | Full preprocessor language |
 * | **Flexibility** | Use only what you need | All-or-nothing |
 * | **Performance** | Fast, minimal overhead | Slower compilation |
 * | **Modern CSS** | Uses actual CSS syntax | Custom syntax |
 * | **Ecosystem** | Huge plugin library | Built-in features only |
 *
 * ## Plugins Used in This Project
 *
 * This project uses two essential PostCSS plugins:
 *
 * 1. **Tailwind CSS** - Generates utility-first CSS classes
 * 2. **Autoprefixer** - Adds vendor prefixes for browser compatibility
 *
 * ## How It Works
 *
 * ```
 * Your CSS → PostCSS → Tailwind Plugin → Autoprefixer → Output CSS
 * ```
 */
// CLOSE: postcss-config-file

/**
 * REF: postcss-plugins-config
 *
 * # PostCSS Plugins Configuration
 *
 * Exports the plugins that PostCSS will use to transform CSS.
 *
 * ## Configuration Format
 *
 * PostCSS uses a simple object where:
 * - **Keys**: Plugin names
 * - **Values**: Plugin options (empty object `{}` for defaults)
 *
 * ```javascript
 * module.exports = {
 *   plugins: {
 *     'plugin-name': { option: value },
 *     'another-plugin': {},
 *   },
 * }
 * ```
 */
module.exports = {
  plugins: {
    // CLOSE: postcss-plugins-config

    /**
     * REF: tailwind-css-plugin
     *
     * # Tailwind CSS Plugin
     *
     * Processes Tailwind CSS directives and generates utility classes.
     *
     * ## What Tailwind Does
     *
     * Tailwind processes three main directives in your CSS:
     *
     * | `Directive` | Purpose | Example Output |
     * |-----------|---------|----------------|
     * | `@tailwind base` | CSS reset and base styles | Normalizes browser defaults |
     * | `@tailwind components` | Component-level styles | `.btn`, `.card`, etc. |
     * | `@tailwind utilities` | Utility classes | `.flex`, `.text-center`, etc. |
     *
     * ## How It Works
     *
     * ### Development Mode
     *
     * 1. **Scan files**: Looks for Tailwind classes in JS/TS/JSX files
     * 2. **Generate CSS**: Creates CSS for all found classes
     * 3. **Output**: Serves complete CSS file (~3-4MB uncompressed)
     * 4. **Fast**: Uses JIT (Just-In-Time) mode for instant updates
     *
     * ### Production Mode
     *
     * 1. **Scan files**: Same as development
     * 2. **Purge**: Removes unused classes
     * 3. **Generate**: Only creates CSS for used classes
     * 4. **Minify**: Compresses the output
     * 5. **Result**: Tiny CSS file (~10-20KB)
     *
     * ## Example Transformation
     *
     * **Your Component:**
     * ```tsx
     * <div className="flex items-center gap-4 p-4 bg-blue-500 rounded-lg">
     *   <span className="text-white font-bold">Hello</span>
     * </div>
     * ```
     *
     * **Generated CSS:**
     * ```css
     * .flex { display: flex; }
     * .items-center { align-items: center; }
     * .gap-4 { gap: 1rem; }
     * .p-4 { padding: 1rem; }
     * .bg-blue-500 { background-color: #3b82f6; }
     * .rounded-lg { border-radius: 0.5rem; }
     * .text-white { color: #fff; }
     * .font-bold { font-weight: 700; }
     * ```
     *
     * ## Configuration Source
     *
     * Tailwind reads its configuration from `tailwind.config.ts`:
     * - Theme colors
     * - Spacing scale
     * - Breakpoints
     * - Custom utilities
     * - Content paths to scan
     *
     * ## JIT (Just-In-Time) Mode
     *
     * Modern Tailwind uses JIT compilation:
     *
     * **Traditional Mode (Old):**
     * - Generates all possible classes upfront
     * - Huge development CSS files
     * - Slower build times
     *
     * **JIT Mode (Current):**
     * - Generates only used classes
     * - Fast development builds
     * - Same CSS in dev and production
     * - Supports arbitrary values: `w-[137px]`
     *
     * ## Performance Benefits
     *
     * - **No runtime**: CSS is generated at build time
     * - **Small bundles**: Only used classes included
     * - **Fast styles**: No CSS-in-JS overhead
     * - **Cacheable**: CSS file can be cached forever
     */
    tailwindcss: {},
    // CLOSE: tailwind-css-plugin

    /**
     * REF: autoprefixer-plugin
     *
     * # Autoprefixer Plugin
     *
     * Automatically adds vendor prefixes to CSS properties for browser compatibility.
     *
     * ## What Problem Does It Solve?
     *
     * Different browsers need different CSS prefixes for experimental features:
     *
     * - `-webkit-`: Chrome, Safari, newer Edge
     * - `-moz-`: Firefox
     * - `-ms-`: Old Edge, IE
     * - `-o-`: Old Opera
     *
     * Writing these manually is tedious and error-prone!
     *
     * ## Example Transformation
     *
     * **Your CSS:**
     * ```css
     * .box {
     *   display: flex;
     *   user-select: none;
     *   backdrop-filter: blur(10px);
     * }
     * ```
     *
     * **Output CSS:**
     * ```css
     * .box {
     *   display: -webkit-box;
     *   display: -ms-flexbox;
     *   display: flex;
     *   -webkit-user-select: none;
     *   -moz-user-select: none;
     *   -ms-user-select: none;
     *   user-select: none;
     *   -webkit-backdrop-filter: blur(10px);
     *   backdrop-filter: blur(10px);
     * }
     * ```
     *
     * ## Browser Support Targets
     *
     * Autoprefixer uses **Browserslist** to determine which browsers to support.
     *
     * ### Default Browserslist Query
     *
     * If not configured, uses these defaults:
     * - `> 0.5%` - Browsers with >0.5% market share
     * - `last 2 versions` - Last 2 versions of each browser
     * - `Firefox ESR` - Firefox Extended Support Release
     * - `not dead` - Browsers still receiving updates
     *
     * ### Custom Browserslist
     *
     * You can customize in `package.json`:
     *
     * ```json
     * {
     *   "browserslist": [
     *     ">0.2%",
     *     "not dead",
     *     "not op_mini all"
     *   ]
     * }
     * ```
     *
     * Or in `.browserslistrc` file:
     * ```
     * > 0.2%
     * not dead
     * not op_mini all
     * ```
     *
     * ## Smart Prefix Addition
     *
     * Autoprefixer only adds prefixes when needed:
     *
     * - **Widely supported features**: No prefixes added
     * - **Experimental features**: All relevant prefixes added
     * - **Old features**: Removes outdated prefixes
     *
     * **Example - No prefixes needed:**
     * ```css
     * .box {
     *   color: red;  /* No prefixes needed */
     *   margin: 10px; /* Universal support */
     * }
     * ```
     *
     * ## Benefits
     *
     * | Benefit | Description |
     * |---------|-------------|
     * | **Automatic** | No manual prefix management |
     * | **Optimized** | Only adds necessary prefixes |
     * | **Up-to-date** | Uses Can I Use database |
     * | **Clean code** | Write standard CSS |
     * | **Future-proof** | Updates as browsers evolve |
     *
     * ## No Configuration Needed
     *
     * Autoprefixer works out of the box with sensible defaults:
     * - Supports all modern browsers
     * - Automatically updates with browser changes
     * - Uses latest Can I Use data
     *
     * Just include it in PostCSS config and it works!
     */
    autoprefixer: {},
    // CLOSE: autoprefixer-plugin
  },
}

/**
 * REF: postcss-processing-flow
 *
 * # How PostCSS Processes CSS
 *
 * Understanding the CSS transformation pipeline in development and production.
 *
 * ## Development Build Flow
 *
 * When you run `npm run dev`:
 *
 * ```
 * 1. Next.js starts development server
 *    ↓
 * 2. Reads app/globals.css
 *    ↓
 * 3. PostCSS processes the CSS
 *    ↓
 * 4. Tailwind plugin runs
 *    • Scans files for class names
 *    • Generates CSS for found classes
 *    • Uses JIT mode for speed
 *    ↓
 * 5. Autoprefixer plugin runs
 *    • Adds vendor prefixes
 *    • Based on browserslist config
 *    ↓
 * 6. CSS served to browser
 *    • Hot reloads on changes
 *    • Fast updates with HMR
 * ```
 *
 * ### Development Characteristics
 *
 * - **Full CSS**: Includes all used classes
 * - **Unminified**: Readable for debugging
 * - **Source maps**: Map CSS to source files
 * - **Fast updates**: JIT compilation
 * - **Size**: ~50-200KB (not optimized)
 *
 * ## Production Build Flow
 *
 * When you run `npm run build`:
 *
 * ```
 * 1. Next.js starts production build
 *    ↓
 * 2. Scans all files for CSS usage
 *    ↓
 * 3. Tailwind plugin runs
 *    • Scans ALL files for classes
 *    • Generates only used classes
 *    • Removes unused utilities
 *    ↓
 * 4. Autoprefixer plugin runs
 *    • Adds necessary prefixes
 *    • Removes outdated prefixes
 *    ↓
 * 5. CSS optimization
 *    • Minification
 *    • Deduplication
 *    • Compression
 *    ↓
 * 6. Output optimized CSS
 *    • Hashed filename for caching
 *    • Example: styles.a3f4b2.css
 * ```
 *
 * ### Production Characteristics
 *
 * - **Minimal CSS**: Only used classes
 * - **Minified**: Compressed, no whitespace
 * - **Optimized**: Dead code eliminated
 * - **Cacheable**: Hashed filenames
 * - **Size**: ~10-20KB (highly optimized)
 *
 * ## Performance Comparison
 *
 * | `Aspect` | `Development` | `Production` |
 * |--------|-------------|------------|
 * | CSS Size | ~100KB | ~15KB |
 * | `Minified` | `No` | `Yes` |
 * | Source Maps | `Yes` | `Optional` |
 * | All Utilities | `Yes` | No, only used |
 * | Build Time | Fast (<1s) | Slower (5-10s) |
 * | `Prefixes` | `All` | Only needed |
 *
 * ## Example: Size Reduction
 *
 * **Development CSS:**
 * ```css
 * /* Includes everything you might use */
 * .flex { display: flex; }
 * .grid { display: grid; }
 * .block { display: block; }
 * /* ... 1000s more classes */
 * ```
 *
 * **Production CSS (if only using flex and grid):**
 * ```css
 * .flex{display:flex}.grid{display:grid}
 * ```
 */
// CLOSE: postcss-processing-flow

/**
 * REF: nextjs-postcss-integration
 *
 * # Integration with Next.js
 *
 * How Next.js automatically uses PostCSS for CSS processing.
 *
 * ## Automatic Detection
 *
 * Next.js automatically uses PostCSS when it finds:
 *
 * 1. **postcss.config.js** - This configuration file
 * 2. **CSS imports** - Any `.css` file imported in components
 *
 * ### No Additional Setup Needed
 *
 * - No webpack configuration required
 * - No babel plugins needed
 * - No build script modifications
 * - Just works out of the box!
 *
 * ## CSS Import Flow
 *
 * **In your component:**
 * ```tsx
 * import './styles.css'  // Any CSS import
 * ```
 *
 * **Next.js automatically:**
 * 1. Detects the CSS import
 * 2. Runs it through PostCSS
 * 3. Applies configured plugins
 * 4. Bundles the result
 * 5. Injects into the page
 *
 * ## Global CSS
 *
 * **app/layout.tsx:**
 * ```tsx
 * import './globals.css'  // Processed by PostCSS
 * ```
 *
 * **app/globals.css:**
 * ```css
 * @tailwind base;      // ← Tailwind plugin processes this
 * @tailwind components; // ← Tailwind plugin processes this
 * @tailwind utilities;  // ← Tailwind plugin processes this
 *
 * .custom-class {
 *   display: flex;     // ← Autoprefixer adds prefixes
 * }
 * ```
 *
 * ## CSS Modules
 *
 * PostCSS also works with CSS Modules:
 *
 * ```tsx
 * import styles from './Button.module.css'
 * ```
 *
 * Both plugins apply to module CSS as well!
 *
 * ## Configuration Loading
 *
 * Next.js looks for PostCSS config in this order:
 *
 * 1. `postcss.config.js` (this file) ✓
 * 2. `postcss.config.json`
 * 3. `.postcssrc`
 * 4. Default config (if none found)
 *
 * ## Customizing PostCSS
 *
 * You can add more plugins if needed:
 *
 * ```javascript
 * module.exports = {
 *   plugins: {
 *     tailwindcss: {},
 *     autoprefixer: {},
 *     'postcss-preset-env': {}, // Additional plugin
 *     cssnano: {},               // CSS minification
 *   },
 * }
 * ```
 *
 * ## Performance Optimization
 *
 * Next.js optimizes PostCSS processing:
 *
 * - **Caching**: Processed CSS cached between builds
 * - **Parallel**: Processes CSS in parallel with JS
 * - **Incremental**: Only reprocesses changed files
 * - **Fast Refresh**: CSS updates without full reload
 */
// CLOSE: nextjs-postcss-integration

