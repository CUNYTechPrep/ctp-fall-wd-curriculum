/**
 * REF: LoadingSpinner Component - Reusable Loading Indicator
 *
 * Displays an animated spinning loader with optional text for async operations.
 *
 * ## Overview
 * A flexible, accessible loading indicator component with three size options.
 * Used throughout the app for async operations like data fetching and form submissions.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size variant |
 * | `text` | `string \| undefined` | `undefined` | Optional loading text |
 *
 * ## Usage Examples
 *
 * ```typescript
 * // Small spinner without text (inline usage)
 * <LoadingSpinner size="sm" />
 *
 * // Medium with loading text (default)
 * <LoadingSpinner text="Loading your todos..." />
 *
 * // Large spinner for full-page loading
 * <LoadingSpinner size="lg" text="Please wait..." />
 * ```
 *
 * ## Common Use Cases
 *
 * ### Full-Page Loading
 * ```typescript
 * if (loading) {
 *   return (
 *     <div className="flex min-h-screen items-center justify-center">
 *       <LoadingSpinner text="Loading data..." />
 *     </div>
 *   )
 * }
 * ```
 *
 * ### Inline Loading (Button)
 * ```typescript
 * <button disabled={loading}>
 *   {loading ? <LoadingSpinner size="sm" /> : 'Submit'}
 * </button>
 * ```
 *
 * ### Protected Route
 * ```typescript
 * function ProtectedRoute({ children }) {
 *   const { user, loading } = useAuth()
 *
 *   if (loading) return <LoadingSpinner text="Checking authentication..." />
 *   if (!user) return <Navigate to="/signin" />
 *
 *   return children
 * }
 * ```
 *
 * ## Accessibility Features
 * - `role="status"`: Announces loading state to screen readers
 * - `aria-label="Loading"`: Provides context for assistive tech
 * - Visual + text options for different user needs
 *
 * ## CSS Animation
 *
 * Uses Tailwind's `animate-spin` utility:
 * - Rotates 360 degrees continuously
 * - Linear timing function
 * - 1 second duration per rotation
 * - Hardware-accelerated transform
 *
 * The border trick:
 * - Full border: `border-blue-600`
 * - Top border transparent: `border-t-transparent`
 * - Creates classic spinner appearance
 *
 * CLOSE
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

// REF: LOADING SPINNER COMPONENT
/**
 * LOADING SPINNER COMPONENT
 *
 * @param size - Size variant: 'sm', 'md', or 'lg'
 * @param text - Optional text to display below spinner
 *
 * SIZE CLASSES:
 * - sm: 16px x 16px, 2px border (inline usage)
 * - md: 32px x 32px, 4px border (default)
 * - lg: 48px x 48px, 4px border (full-page loading)
 */
// CLOSE
export default function LoadingSpinner({
  size = 'md',
  text,
}: LoadingSpinnerProps) {
  // REF: SIZE MAPPING
/**
   * SIZE MAPPING
   *
   * Maps size prop to Tailwind classes
   * Uses object lookup for clean mapping
   */
// CLOSE
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }
  // CLOSE: SIZE MAPPING

  /** REF: spinner-render
   * Renders spinner with size-based classes and optional message.
   * Centers content and displays loading animation.
   */
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Spinner Circle */}
      <div
        className={`
          ${sizeClasses[size]}
          border-blue-600
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />

      {/* Optional Loading Text */}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
    // CLOSE: spinner-render
  )
}
// CLOSE: LOADING SPINNER COMPONENT

// REF: PERFORMANCE CONSIDERATIONS
/**
 * PERFORMANCE CONSIDERATIONS
 *
 * CSS animations are hardware-accelerated:
 * - Uses GPU for transform operations
 * - No JavaScript execution during animation
 * - Smooth 60fps animation
 * - Low battery impact
 *
 * Better than:
 * - JavaScript-based rotation
 * - GIF images (larger file size)
 * - SVG animations (can be heavier)
 */
// CLOSE

// REF: CUSTOMIZATION OPTIONS
/**
 * CUSTOMIZATION OPTIONS
 *
 * Change color:
 * ```typescript
 * <div className="border-red-600 border-t-transparent" />
 * ```
 *
 * Custom size:
 * ```typescript
 * <div className="w-16 h-16 border-8" />
 * ```
 *
 * Different animation:
 * ```typescript
 * // Pulse animation instead of spin
 * <div className="animate-pulse bg-blue-600 rounded-full" />
 * ```
 */
// CLOSE

// REF: ALTERNATIVE LOADING PATTERNS
/**
 * ALTERNATIVE LOADING PATTERNS
 *
 * Skeleton screens (better UX for content loading):
 * ```typescript
 * <div className="animate-pulse space-y-4">
 *   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
 *   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
 * </div>
 * ```
 *
 * Progress bar (for uploads):
 * ```typescript
 * <div className="w-full bg-gray-200 rounded">
 *   <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
 * </div>
 * ```
 *
 * Dots animation:
 * ```typescript
 * <div className="flex gap-1">
 *   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
 *   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75" />
 *   <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150" />
 * </div>
 * ```
 */
// CLOSE
