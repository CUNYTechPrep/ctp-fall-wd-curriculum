/**
 * REF: Loading Spinner Component
 *
 * Reusable animated spinner component for showing loading states.
 * Used while Supabase queries execute or components load.
 *
 * CLOSE: Import and use this component anywhere you need to show a loading indicator.
 * Accepts optional size and text props for customization.
 *
 * ### Props
 * | `Prop` | Type | Default | Purpose |
 * |------|------|---------|---------|
 * | `size` | `'sm'` | `'md'` | `'lg'` | `'md'` | Spinner diameter |
 * | `text` | `string` | `undefined` | Optional loading message below spinner |
 *
 * USAGE EXAMPLES:
 * ```tsx
 * // Default size (medium)
 * <LoadingSpinner />
 *
 * // With text
 * <LoadingSpinner text="Loading todos..." />
 *
 * // Small size
 * <LoadingSpinner size="sm" />
 *
 * // Large size with text
 * <LoadingSpinner size="lg" text="Fetching messages..." />
 * ```
 *
 * ## Styling
 * - CSS animation with spinning rotation
 * - Tailwind CSS for responsive sizing
 * - Flexbox centered layout
 * - Color: Purple-600 (brand color)
 * - Accessible with aria-label
 *
 * SIZE SPECIFICATIONS:
 * | `Size` | CSS Classes | `Usage` |
 * |------|-------------|-------|
 * | `sm` | w-4 h-4 border-2 | Inline loading indicators |
 * | `md` | w-8 h-8 border-4 | Standard loading screens |
 * | `lg` | w-12 h-12 border-4 | Full-page loading |
 *
 * ## Animation
 * - animate-spin class from Tailwind
 * - Continuous 1-second rotation
 * - Smooth, hardware-accelerated (uses transform)
 * - border-t-transparent creates spinning effect
 *
 * ## Accessibility
 * - role="status" indicates loading to screen readers
 * - aria-label="Loading" provides description
 * - No keyboard interaction needed
 *
 * USED IN:
 * - ProtectedRoute (auth loading)
 * - Dashboard (todo fetching)
 * - Settings (file upload)
 * - Messages page (conversation loading)
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function LoadingSpinner({
  size = 'md',
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }

  /** REF: component-return
   */
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
  // CLOSE: component-return
          ${sizeClasses[size]}
          border-purple-600
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />

      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}

/**
 * REF: spinner-animation
 *
 * ## CSS Animation Technique
 *
 * Uses Tailwind animate-spin for hardware acceleration:
 * - Rotates element continuously
 * - 1 second per full rotation
 * - Linear timing (no easing)
 * - GPU-accelerated transform
 * - No JavaScript during animation
 *
 * ### Border Trick
 * - Full border: border-blue-600
 * - Top transparent: border-t-transparent
 * - Creates "spinning" illusion
 * - Simple and performant
 *
 * ### Alternative Approaches
 * 1. SVG spinner (more control)
 * 2. Lottie animation (complex)
 * 3. GIF image (larger file)
 * 4. Canvas animation (complex)
 *
 * **Best for:** Loading spinners, simple animations
 *
 * CLOSE: spinner-animation
 */
