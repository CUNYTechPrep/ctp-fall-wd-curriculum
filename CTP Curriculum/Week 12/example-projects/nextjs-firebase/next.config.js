/**
 * REF: nextjs-config-file
 *
 * # Next.js Configuration
 *
 * Configures Next.js build and runtime behavior for the Firebase Todo application.
 *
 * ## Key Concepts
 *
 * | `Concept` | Description |
 * |---------|-------------|
 * | **Next.js Config** | Controls framework behavior and build settings |
 * | **Image Optimization** | Configure allowed external image domains |
 * | **Build Settings** | Customize compilation and bundling |
 * | **Runtime Settings** | Server and client runtime configuration |
 *
 * ## What is next.config.js?
 *
 * The `next.config.js` file is the central configuration file for Next.js applications.
 * It allows you to customize:
 * - Image optimization settings
 * - Redirects and rewrites
 * - Environment variables
 * - Webpack configuration
 * - Build output settings
 * - API routes behavior
 *
 * ## Configuration Object
 *
 * Type-checked with JSDoc `@type` annotation for autocomplete and IntelliSense.
 *
 * ## Why This File Matters
 *
 * - **Security**: Controls which external domains can serve optimized images
 * - **Performance**: Enables Next.js optimizations and caching
 * - **Deployment**: Configures build behavior for production
 * - **Integration**: Connects with Firebase Storage and other services
 */
// CLOSE: nextjs-config-file

/**
 * REF: nextjs-config-type
 *
 * # Next.js Configuration Type
 *
 * TypeScript type annotation for configuration autocomplete.
 *
 * ## JSDoc Type Annotation
 *
 * The `@type` comment provides type checking and autocomplete even in JavaScript files.
 *
 * ```javascript
 * // Without @type: No autocomplete
 * const nextConfig = { ... }
 *
 * // With @type: Full autocomplete and type checking
 * / ** @type {import('next').NextConfig} * /
 * const nextConfig = { ... }
 * ```
 *
 * ## Benefits
 *
 * - **Autocomplete**: Get suggestions for valid config options
 * - **Type Safety**: Catch errors before runtime
 * - **Documentation**: See inline docs for each option
 * - **No TypeScript**: Get TypeScript benefits in JavaScript
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // CLOSE: nextjs-config-type

  /**
   * REF: image-configuration
   *
   * # Image Configuration
   *
   * Configures Next.js Image component optimization for external images.
   *
   * ## The Next.js Image Component
   *
   * Next.js provides an optimized `<Image>` component that:
   * - Automatically optimizes images
   * - Serves WebP/AVIF formats when supported
   * - Lazy loads images below the fold
   * - Prevents Cumulative Layout Shift (CLS)
   * - Resizes images on-demand
   *
   * ## Security: Allowed Domains
   *
   * For security, Next.js only optimizes images from allowed domains.
   *
   * ### Configured Domains
   *
   * | `Domain` | Purpose |
   * |--------|---------|
   * | `firebasestorage.googleapis.com` | Firebase Storage images (profile pictures, attachments) |
   *
   * ### Why Domain Allowlist?
   *
   * - **Security**: Prevents arbitrary URL loading and potential attacks
   * - **Performance**: Limits optimization to trusted sources
   * - **Cost Control**: Prevents abuse of image optimization service
   * - **Privacy**: Doesn't leak data to unknown domains
   *
   * ## How It Works
   *
   * 1. **Client requests image**: `<Image src="https://firebasestorage.googleapis.com/..." />`
   * 2. **Next.js checks domain**: Is it in the allowed list?
   * 3. **Domain allowed**: Image is optimized and served
   * 4. **Domain blocked**: Error thrown, image not loaded
   *
   * ## Usage Example
   *
   * ```tsx
   * import Image from 'next/image'
   *
   * function ProfilePicture({ user }) {
   *   return (
   *     <Image
   *       src={user.photoURL} // Firebase Storage URL
   *       width={200}
   *       height={200}
   *       alt={user.displayName}
   *       className="rounded-full"
   *     />
   *   )
   * }
   * ```
   *
   * ## What Next.js Does
   *
   * - **Checks domain**: Verifies URL is from `firebasestorage.googleapis.com`
   * - **Optimizes**: Converts to WebP/AVIF, resizes, compresses
   * - **Caches**: Stores optimized version for fast subsequent loads
   * - **Serves**: Returns optimized image to browser
   *
   * ## Adding More Domains
   *
   * To allow images from other domains:
   *
   * ```javascript
   * images: {
   *   domains: [
   *     'firebasestorage.googleapis.com',
   *     'example.com',
   *     'cdn.mysite.com',
   *   ],
   * }
   * ```
   */
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // CLOSE: image-configuration
}

/**
 * REF: config-export
 *
 * # Configuration Export
 *
 * CommonJS export for Next.js to read the configuration.
 *
 * ## Why CommonJS?
 *
 * Next.js requires CommonJS format (`module.exports`) instead of ES modules (`export default`).
 *
 * - **Compatibility**: Works in all Node.js versions
 * - **Synchronous**: Config is read synchronously during build
 * - **Standard**: Matches Node.js configuration convention
 *
 * ## How Next.js Uses This
 *
 * 1. **Build time**: Next.js reads this file when you run `npm run build`
 * 2. **Development**: Reads on server start for `npm run dev`
 * 3. **Runtime**: Some settings used during SSR and API routes
 */
module.exports = nextConfig
// CLOSE: config-export

/**
 * REF: additional-config-options
 *
 * # Additional Configuration Options
 *
 * Examples of other common Next.js configuration options you might add.
 *
 * ## Redirects
 *
 * Permanently or temporarily redirect URLs.
 *
 * ```javascript
 * async redirects() {
 *   return [
 *     {
 *       source: '/old-dashboard',
 *       destination: '/dashboard',
 *       permanent: true, // 308 permanent redirect
 *     },
 *     {
 *       source: '/blog/:slug',
 *       destination: '/posts/:slug',
 *       permanent: false, // 307 temporary redirect
 *     },
 *   ]
 * }
 * ```
 *
 * ## Rewrites
 *
 * Proxy requests to different URLs without changing the browser URL.
 *
 * ```javascript
 * async rewrites() {
 *   return [
 *     {
 *       source: '/api/firebase/:path*',
 *       destination: 'https://firebaseapp.com/:path*',
 *     },
 *   ]
 * }
 * ```
 *
 * ## Environment Variables
 *
 * Expose environment variables to the browser (use with caution).
 *
 * ```javascript
 * env: {
 *   // Server-side only (default)
 *   DATABASE_URL: process.env.DATABASE_URL,
 *
 *   // Client-side (must use NEXT_PUBLIC_ prefix)
 *   NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
 * }
 * ```
 *
 * ## Webpack Customization
 *
 * Extend or customize the webpack configuration.
 *
 * ```javascript
 * webpack: (config, { isServer }) => {
 *   // Add custom webpack plugins
 *   if (!isServer) {
 *     config.resolve.fallback = {
 *       ...config.resolve.fallback,
 *       fs: false,
 *     }
 *   }
 *   return config
 * }
 * ```
 *
 * ## React Strict Mode
 *
 * Enable React's Strict Mode for highlighting potential problems.
 *
 * ```javascript
 * reactStrictMode: true,
 * ```
 *
 * ## SWC Minification
 *
 * Use faster SWC compiler for minification instead of Terser.
 *
 * ```javascript
 * swcMinify: true,
 * ```
 *
 * ## Output Configuration
 *
 * Configure build output for different deployment targets.
 *
 * ```javascript
 * output: 'standalone', // For Docker deployments
 * ```
 *
 * ## Experimental Features
 *
 * Enable experimental Next.js features.
 *
 * ```javascript
 * experimental: {
 *   serverActions: true,
 *   appDir: true,
 * }
 * ```
 *
 * ## Full Example
 *
 * ```javascript
 * const nextConfig = {
 *   reactStrictMode: true,
 *   swcMinify: true,
 *
 *   images: {
 *     domains: ['firebasestorage.googleapis.com'],
 *     formats: ['image/avif', 'image/webp'],
 *   },
 *
 *   async redirects() {
 *     return [
 *       {
 *         source: '/old-page',
 *         destination: '/new-page',
 *         permanent: true,
 *       },
 *     ]
 *   },
 *
 *   webpack: (config) => {
 *     // Custom webpack config
 *     return config
 *   },
 * }
 * ```
 */
// CLOSE: additional-config-options
