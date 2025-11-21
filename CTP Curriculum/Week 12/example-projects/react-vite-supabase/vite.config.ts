/**
 * REF: Vite Build Configuration
 *
 * Configures Vite bundler for React development and production builds.
 * Includes optimizations for Supabase client and React library.
 *
 * CLOSE: Vite reads this file automatically. Configuration handles development server,
 * build optimization, plugin setup, and path aliases.
 *
 * ## Configuration Sections
 * | `Section` | Purpose |
 * |---------|---------|
 * | `plugins` | Register Vite plugins (React, etc) |
 * | `resolve` | Module resolution and aliases |
 * | `server` | Development server settings |
 * | `build` | Production build optimization |
 *
 * ## Plugins
 * ```typescript
 * plugins: [react()]
 * ```
 * - @vitejs/plugin-react: Handles JSX transformation and Fast Refresh
 * - Fast Refresh: Preserves component state during edits
 *
 * RESOLVE CONFIGURATION:
 * ```typescript
 * resolve: {
 *   alias: {
 *     '@': path.resolve(__dirname, './src')  // @/components -> src/components
 *   }
 * }
 * ```
 * - Allows importing with @ prefix for shorter paths
 * - Usage: `import Foo from '@/components/Foo'`
 * - vs: `import Foo from '../../../components/Foo'`
 *
 * ## Development Server
 * ```typescript
 * server: {
 *   port: 5173,
 *   open: true  // Auto-open browser on npm run dev
 * }
 * ```
 * - port: 5173 (Vite default, change if needed)
 * - open: true opens browser automatically
 * - HMR (Hot Module Replacement) enabled by default
 *
 * ## Build Configuration
 * | `Option` | `Value` | Purpose |
 * |--------|-------|---------|
 * | `outDir` | `'dist'` | Output folder for production build |
 * | `sourcemap` | `true` | Generate source maps for debugging |
 * | `rollupOptions.output.manualChunks` | {...} | Code splitting strategy |
 *
 * ## Code Splitting Strategy
 * ```typescript
 * manualChunks: {
 *   'react-vendor': ['react', 'react-dom', 'react-router-dom'],
 *   'supabase-vendor': ['@supabase/supabase-js']
 * }
 * ```
 * - Separates large libraries into separate bundle chunks
 * - Benefits: Better caching, parallel loading, smaller app bundle
 * - react-vendor: ~180KB
 * - supabase-vendor: ~200KB
 * - main app: ~50KB (example)
 *
 * ## Build Output
 * After `npm run build`:
 * ```
 * dist/
 *   ├─ index.html (entry point)
 *   └─ assets/
 *       ├─ react-vendor-abc123.js
 *       ├─ supabase-vendor-def456.js
 *       ├─ index-ghi789.js
 *       └─ style-jkl012.css
 * ```
 *
 * HASHED FILENAMES:
 * - Content-based hashes (abc123, def456, etc)
 * - Changes to code = different hash
 * - Enables long-term caching
 * - CDN/browser cache files forever
 * - Updates automatically detected by new hash
 *
 * ## Development Workflow
 * 1. `npm run dev` starts Vite dev server
 * 2. Open http://localhost:5173 in browser
 * 3. Edit code, save file
 * 4. Vite detects change
 * 5. Module reloaded via HMR
 * 6. Browser updates instantly
 * 7. Component state preserved (Fast Refresh)
 *
 * PRODUCTION BUILD:
 * 1. `npm run build` runs Vite production build
 * 2. Code is minified and optimized
 * 3. Unnecessary code is tree-shaken (removed)
 * 4. Output written to dist/ folder
 * 5. dist/ ready for deployment to any static host
 *
 * SUPABASE-SPECIFIC OPTIMIZATIONS:
 * - WebSocket support: Vite handles transparently
 * - Environment variables: VITE_ prefix required
 * - Realtime subscriptions: No special config needed
 * - Storage uploads: Works from browser as-is
 *
 * ## Deployment
 * Deploy `dist/` folder to:
 * - Vercel: Automatic from Git
 * - Netlify: Automatic from Git
 * - Firebase Hosting: `firebase deploy`
 * - GitHub Pages: `gh-pages` package
 * - AWS S3 + CloudFront
 * - Any static host with HTTP server
 *
 * FILE REFERENCES:
 * - package.json - npm scripts calling Vite
 * - .env - Environment variables (development)
 * - .env.production - Environment variables (production)
 *
 * ## Key Concepts
 * - Lightning-fast development (Vite uses esbuild)
 * - Instant HMR (Hot Module Replacement)
 * - Code splitting for optimal caching
 * - Tree-shaking removes unused code
 * - Sourcemaps for debugging production code
 */

  /** REF: imports
   */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
  // CLOSE: imports

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,

    /**
     * SUPABASE CLIENT CHUNKING
     *
     * Supabase client is large (~200KB)
     * Split into separate chunk for better caching
     */
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },

  /**
   * OPTIMIZATIONS FOR SUPABASE
   *
   * Supabase client uses WebSockets:
   * - Ensure WebSocket proxy configured if needed
   * - Works out of the box in most cases
   *
   * Development proxy (if backend on different port):
   * ```javascript
   * server: {
   *   proxy: {
   *     '/api': {
   *       target: 'http://localhost:3001',
   *       changeOrigin: true,
   *       ws: true, // Enable WebSocket proxy
   *     },
   *   },
   * }
   * ```
   */
})

/**
 * ENVIRONMENT VARIABLES IN VITE
 *
 * Must use VITE_ prefix:
 * - VITE_SUPABASE_URL ✅
 * - SUPABASE_URL ❌ (won't work)
 *
 * Access in code:
 * ```typescript
 * import.meta.env.VITE_SUPABASE_URL
 * ```
 *
 * Build-time embedding:
 * - Values embedded at build time
 * - Not runtime environment variables
 * - Can't change after build
 */

/**
 * SUPABASE REALTIME WEBSOCKET
 *
 * Supabase Realtime uses WebSockets
 * Vite handles this automatically in dev
 *
 * For production:
 * - Ensure hosting supports WebSockets
 * - Vercel: ✅ Yes
 * - Netlify: ✅ Yes
 * - Firebase Hosting: ✅ Yes
 * - GitHub Pages: ❌ No (static only, but Supabase handles connection)
 *
 * Actually, client connects directly to Supabase,
 * so hosting doesn't need WebSocket support!
 */

/**
 * BUILD PERFORMANCE
 *
 * Vite build is fast:
 * - Uses Rollup for production
 * - esbuild for dependencies
 * - Parallel processing
 * - Aggressive caching
 *
 * Typical build times:
 * - Small app: 5-10 seconds
 * - Medium app: 15-30 seconds
 * - Large app: 30-60 seconds
 *
 * Much faster than Webpack!
 */
