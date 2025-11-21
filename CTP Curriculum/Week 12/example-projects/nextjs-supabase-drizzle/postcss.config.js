/**
 * REF: file-header
 *
 * # PostCSS Configuration
 *
 * Configuration for PostCSS, a tool for transforming CSS with JavaScript plugins.
 *
 * ## What is PostCSS?
 * Tool that processes CSS through JavaScript plugins for:
 * - Modern CSS transformation
 * - Automatic vendor prefixing
 * - CSS optimization
 * - Preprocessor features
 *
 * ## Role in Tailwind
 * PostCSS bridges Tailwind and browser-ready CSS:
 * | `Step` | `Process` |
 * |------|---------|
 * | `1` | Tailwind generates utility CSS |
 * | `2` | PostCSS processes the CSS |
 * | `3` | Autoprefixer adds vendor prefixes |
 * | `4` | Output is browser-ready CSS |
 */
// CLOSE: file-header

/**
 * REF: module-export
 *
 * ## CommonJS Module Export
 *
 * Exports configuration as CommonJS module (required for PostCSS).
 */
module.exports = {
  /**
   * REF: plugins-config
   *
   * ## PostCSS Plugins
   *
   * Plugins run in specified order.
   *
   * ### Execution Order
   * 1. `tailwindcss`: Generates Tailwind utilities
   * 2. `autoprefixer`: Adds vendor prefixes
   *
   * ### Why Order Matters
   * Tailwind must generate CSS before autoprefixer can prefix it.
   */
  plugins: {
    /**
     * REF: tailwindcss-plugin
     *
     * ## Tailwind CSS Plugin
     *
     * Processes Tailwind directives and generates utility classes.
     *
     * ### What It Does
     * 1. Reads `tailwind.config.ts`
     * 2. Scans content files for classes
     * 3. Generates CSS for used utilities
     * 4. Injects CSS into build
     *
     * ### Tailwind Directives
     * In `globals.css`:
     * ```css
     * @tailwind base;       // Base styles, CSS reset
     * @tailwind components; // Component classes
     * @tailwind utilities;  // Utility classes
     * ```
     *
     * ### Output Example
     * Input: `bg-blue-500`
     * ```css
     * .bg-blue-500 {
     *   background-color: rgb(59 130 246);
     * }
     * ```
     *
     * ### Configuration
     * Empty object `{}` = use `tailwind.config.ts` settings.
     */
    tailwindcss: {},
    // CLOSE: tailwindcss-plugin

    /**
     * REF: autoprefixer-plugin
     *
     * ## Autoprefixer Plugin
     *
     * Automatically adds vendor prefixes to CSS properties.
     *
     * ### What It Does
     * Adds browser-specific prefixes based on:
     * - Browser targets (from package.json or .browserslistrc)
     * - Can I Use database for browser support
     *
     * ### Vendor Prefixes
     * | `Prefix` | `Browser` |
     * |--------|---------|
     * | `-webkit-` | Chrome, Safari, newer Edge |
     * | `-moz-` | `Firefox` |
     * | `-ms-` | Old IE, old Edge |
     * | `-o-` | Old Opera |
     *
     * ### Example Transformation
     * Input CSS:
     * ```css
     * .example {
     *   display: flex;
     *   user-select: none;
     *   backdrop-filter: blur(10px);
     * }
     * ```
     *
     * Output CSS:
     * ```css
     * .example {
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
     * ### Browser Targets
     * Default: Last 2 versions of major browsers.
     *
     * Customize in `package.json`:
     * ```json
     * {
     *   "browserslist": [
     *     "> 1%",
     *     "last 2 versions",
     *     "not dead"
     *   ]
     * }
     * ```
     *
     * ### Benefits
     * - Automatic cross-browser compatibility
     * - No manual prefix management
     * - Only adds needed prefixes
     * - Updates with browser changes
     *
     * ### Configuration
     * Empty object `{}` = use default settings.
     */
    autoprefixer: {},
    // CLOSE: autoprefixer-plugin
  },
}
// CLOSE: plugins-config
// CLOSE: module-export

/**
 * REF: nextjs-integration
 *
 * ## How PostCSS Integrates with Next.js
 *
 * Next.js automatically uses PostCSS if config exists.
 *
 * ### Build Process Flow
 * 1. **Developer writes Tailwind**
 *    ```tsx
 *    <div className="flex items-center gap-4">
 *    ```
 *
 * 2. **Tailwind generates CSS**
 *    ```css
 *    .flex { display: flex; }
 *    .items-center { align-items: center; }
 *    .gap-4 { gap: 1rem; }
 *    ```
 *
 * 3. **Autoprefixer adds prefixes**
 *    ```css
 *    .flex {
 *      display: -webkit-box;
 *      display: -ms-flexbox;
 *      display: flex;
 *    }
 *    ```
 *
 * 4. **Next.js bundles and optimizes**
 *    - Minifies in production
 *    - Removes unused CSS
 *    - Optimizes for performance
 *
 * ### Development vs Production
 * | `Mode` | `Characteristics` |
 * |------|----------------|
 * | `Development` | Fast, unminified, all utilities |
 * | `Production` | Minified, only used utilities, prefixed |
 */
// CLOSE: nextjs-integration

/**
 * REF: additional-plugins
 *
 * ## Adding Additional PostCSS Plugins
 *
 * Extend configuration with more plugins.
 *
 * ### cssnano (Minification)
 * ```javascript
 * // Install: npm install cssnano
 * module.exports = {
 *   plugins: {
 *     tailwindcss: {},
 *     autoprefixer: {},
 *     ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
 *   },
 * }
 * ```
 *
 * ### postcss-nested (Nested CSS)
 * ```javascript
 * // Install: npm install postcss-nested
 * module.exports = {
 *   plugins: {
 *     'postcss-nested': {},
 *     tailwindcss: {},
 *     autoprefixer: {},
 *   },
 * }
 * ```
 *
 * ### postcss-import (CSS Imports)
 * ```javascript
 * // Install: npm install postcss-import
 * module.exports = {
 *   plugins: {
 *     'postcss-import': {},
 *     tailwindcss: {},
 *     autoprefixer: {},
 *   },
 * }
 * ```
 *
 * ### Plugin Order
 * Always maintain correct order:
 * 1. Import/preprocessor plugins first
 * 2. Tailwind in the middle
 * 3. Autoprefixer and optimization last
 */
// CLOSE: additional-plugins

/**
 * REF: troubleshooting
 *
 * ## Troubleshooting
 *
 * ### Common Issues
 *
 * #### PostCSS not processing
 * - Ensure `postcss.config.js` in project root
 * - Restart Next.js dev server
 * - Check for syntax errors
 *
 * #### Vendor prefixes not added
 * - Check autoprefixer in plugins
 * - Verify browser targets
 * - Ensure autoprefixer after Tailwind
 *
 * #### Tailwind classes not working
 * - Check `tailwind.config.ts` content paths
 * - Ensure Tailwind plugin first
 * - Verify directives in CSS file
 *
 * ### Debug Mode
 * ```javascript
 * module.exports = {
 *   plugins: {
 *     tailwindcss: { config: './tailwind.config.ts' },
 *     autoprefixer: {},
 *   },
 * }
 * ```
 */
// CLOSE: troubleshooting

/**
 * REF: resources
 *
 * ## Resources
 *
 * ### Official Documentation
 * - PostCSS: https://postcss.org/
 * - Autoprefixer: https://github.com/postcss/autoprefixer
 * - Tailwind PostCSS: https://tailwindcss.com/docs/installation/using-postcss
 *
 * ### Browser Support
 * - Can I Use: https://caniuse.com/
 * - Browserslist: https://browsersl.ist/
 *
 * ### Next.js Integration
 * - CSS Support: https://nextjs.org/docs/basic-features/built-in-css-support
 * - PostCSS Config: https://nextjs.org/docs/advanced-features/customizing-postcss-config
 */
// CLOSE: resources
