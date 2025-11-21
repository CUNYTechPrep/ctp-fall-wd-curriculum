/**
 * REF: Vite Configuration for React + TypeScript SPA
 *
 * This file configures Vite, a modern build tool for fast development and optimized production builds.
 *
 * ## Overview
 * Vite provides:
 * - Lightning-fast development server with Hot Module Replacement (HMR)
 * - Instant server start without bundling overhead
 * - Optimized production builds using Rollup
 * - Native TypeScript support
 * - Path aliases for cleaner imports
 * - Automatic CSS processing with PostCSS
 *
 * ## Why Vite?
 *
 * | `Aspect` | `Vite` | `Webpack` |
 * |--------|------|---------|
 * | Dev Start | `Instant` | 10-30 seconds |
 * | `HMR` | Changes only | Full rebuild |
 * | Hot Reload | Sub-second | Several seconds |
 * | `Production` | Rollup (optimized) | `Webpack` |
 * | ES Modules | Native (dev) | `Bundled` |
 *
 * ## How Vite Achieves Speed
 *
 * ### Development Mode
 * 1. **No Initial Bundling**: Serves files directly to browser
 * 2. **Native ES Modules**: Leverages browser's module system
 * 3. **On-Demand Transform**: Only transforms requested files
 * 4. **File Caching**: Caches transformed modules
 * 5. **HMR Granularity**: Updates only the changed module
 *
 * ### Production Mode
 * - Uses Rollup for optimal code splitting
 * - Tree-shakes unused code
 * - Minifies JavaScript and CSS
 * - Optimizes asset loading
 * - Creates efficient chunks
 *
 * CLOSE
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// REF: VITE CONFIGURATION EXPORT
/**
 * VITE CONFIGURATION EXPORT
 *
 * defineConfig provides TypeScript autocomplete for config options
 */
// CLOSE
export default defineConfig({
  // REF: PLUGINS
/**
   * PLUGINS
   *
   * @vitejs/plugin-react:
   * - Enables React Fast Refresh (HMR for React)
   * - Transforms JSX to JavaScript
   * - Supports React hooks and features
   * - Automatic JSX runtime (no need to import React)
   */
// CLOSE
  plugins: [react()],

  // REF: PATH ALIASES
/**
   * PATH ALIASES
   *
   * Allows importing with @ instead of relative paths
   *
   * ### Before
   * import Component from '../../../components/Component'
   *
   * ### After
   * import Component from '@/components/Component'
   *
   * ## Benefits
   * - Cleaner imports
   * - Easier refactoring
   * - No counting ../../../
   * - Works with TypeScript
   */
// CLOSE
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // REF: SERVER CONFIGURATION
/**
   * SERVER CONFIGURATION
   *
   * Development server settings
   */
// CLOSE
  server: {
    port: 5173, // Default Vite port
    open: true, // Auto-open browser on start
    // REF: CORS Configuration (if needed for API)
/**
     * CORS Configuration (if needed for API)
     */
// CLOSE
    // cors: true,
    // REF: Proxy API requests (if you have a separate backend)
/**
     * Proxy API requests (if you have a separate backend)
     */
// CLOSE
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3001',
    //     changeOrigin: true,
    //   },
    // },
  },

  // REF: BUILD CONFIGURATION
/**
   * BUILD CONFIGURATION
   *
   * Production build settings
   */
// CLOSE
  build: {
    // REF: OUTPUT DIRECTORY
/**
     * OUTPUT DIRECTORY
     */
// CLOSE
    outDir: 'dist',

    // REF: SOURCE MAPS
/**
     * SOURCE MAPS
     *
     * Generate source maps for debugging production builds
     * Set to false to reduce build size
     */
// CLOSE
    sourcemap: true,

    // REF: CHUNK SIZE WARNING
/**
     * CHUNK SIZE WARNING
     *
     * Warn if chunk exceeds size (in KB)
     * Helps catch large dependencies
     */
// CLOSE
    chunkSizeWarningLimit: 1000,

    // REF: ROLLUP OPTIONS
/**
     * ROLLUP OPTIONS
     *
     * Advanced build configuration
     */
// CLOSE
    rollupOptions: {
      output: {
        // REF: MANUAL CHUNKS
/**
         * MANUAL CHUNKS
         *
         * Split large dependencies into separate chunks
         * Improves caching and parallel loading
         */
// CLOSE
        manualChunks: {
          // Vendor chunk for React and React Router
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Firebase in its own chunk
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
        },
      },
    },
  },

  // REF: OPTIMIZATIONS
/**
   * OPTIMIZATIONS
   *
   * Vite automatically:
   * - Minifies JavaScript
   * - Tree-shakes unused code
   * - Optimizes CSS
   * - Compresses assets
   * - Generates efficient chunks
   */
// CLOSE
})

/**
 * REF: Environment Variables
 *
 * Access environment variables in code using `import.meta.env`:
 *
 * ```typescript
 * const apiUrl = import.meta.env.VITE_API_URL
 * const isDev = import.meta.env.DEV
 * const isProd = import.meta.env.PROD
 * ```
 *
 * ### Built-in Variables
 * - `import.meta.env.MODE`: `'development'` or `'production'`
 * - `import.meta.env.DEV`: boolean (true in dev)
 * - `import.meta.env.PROD`: boolean (true in prod)
 * - `import.meta.env.BASE_URL`: Base path for routing
 * - `import.meta.env.COMMAND`: `'serve'` or `'build'`
 * - `import.meta.env.SSR`: boolean (true if SSR)
 *
 * ### Custom Variables
 * Custom variables **must start with `VITE_`** prefix:
 * - Defined in `.env` files
 * - Embedded at build time (not runtime)
 * - Only `VITE_*` variables exposed to client
 * - Security: other env vars hidden
 *
 * Example `.env`:
 * ```
 * VITE_API_URL=https://api.example.com
 * VITE_APP_NAME=My App
 * SECRET_KEY=hidden  # Not exposed to client
 * ```
 *
 * CLOSE
 */

/**
 * REF: Vite Plugin Ecosystem
 *
 * Popular Vite plugins extend functionality:
 *
 * ```typescript
 * import react from '@vitejs/plugin-react'
 * import svgr from 'vite-plugin-svgr'
 * import { VitePWA } from 'vite-plugin-pwa'
 * import compression from 'vite-plugin-compression'
 *
 * export default defineConfig({
 *   plugins: [
 *     react(),
 *     svgr(),              // Import SVGs as React components
 *     VitePWA({            // Progressive Web App support
 *       registerType: 'autoUpdate',
 *       manifest: { ... }
 *     }),
 *     compression()        // Gzip compression
 *   ]
 * })
 * ```
 *
 * CLOSE
 */

/**
 * REF: Build Output Structure
 *
 * After running `npm run build`, the `dist/` folder contains:
 *
 * ```
 * dist/
 * ├── index.html                    # Entry point
 * ├── favicon.ico                   # Favicon
 * └── assets/
 *     ├── index-a1b2c3d4.js         # Main app bundle
 *     ├── react-vendor-e5f6g7h8.js  # React & React DOM
 *     ├── Dashboard-m3n4o5p6.js     # Lazy-loaded chunk
 *     ├── Messages-n7o8p9q0.js      # Lazy-loaded chunk
 *     └── index-q7r8s9t0.css        # Compiled CSS
 * ```
 *
 * ### File Hashing
 * - **Hash in filename**: Enables aggressive long-term caching
 * - **Cache busting**: Hash changes when content changes
 * - **Parallel downloads**: Separate files load in parallel
 * - **Browser caching**: Old versions served until hash updates
 *
 * CLOSE
 */

/**
 * REF: Deployment Checklist
 *
 * ### Pre-Deployment
 * 1. [ ] Set environment variables in hosting platform
 * 2. [ ] Update base URL if not root domain
 * 3. [ ] Configure security headers
 * 4. [ ] Enable HTTPS
 * 5. [ ] Set cache headers for assets
 *
 * ### Build & Test
 * 1. [ ] Build locally: `npm run build`
 * 2. [ ] Preview: `npm run preview`
 * 3. [ ] Test all routes work
 * 4. [ ] Check console for errors
 * 5. [ ] Test lazy-loaded chunks load
 *
 * ### SPA Routing Configuration
 * Client-side routing requires **SPA fallback**: all URLs must serve `index.html`.
 * React Router handles actual routing in the browser.
 *
 * **Platform-specific examples:**
 * - **Vercel**: Automatic (no config needed)
 * - **Netlify**: Add `_redirects` file
 * - **Firebase**: Configure in `firebase.json`
 * - **GitHub Pages**: Use `HashRouter` or redirects
 *
 * **Fallback rule example (Netlify):**
 * ```
 * /* /index.html 200
 * ```
 *
 * CLOSE
 */
