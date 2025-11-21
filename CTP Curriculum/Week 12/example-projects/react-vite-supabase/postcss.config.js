/**
 * REF: PostCSS Configuration for Tailwind CSS
 *
 * PostCSS processes CSS transformations via plugins.
 * This config enables Tailwind CSS and browser compatibility.
 *
 * CLOSE: Vite uses this config automatically when processing CSS files.
 * No manual invocation needed - runs during build and dev server.
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// CLOSE: PostCSS Configuration for Tailwind CSS
