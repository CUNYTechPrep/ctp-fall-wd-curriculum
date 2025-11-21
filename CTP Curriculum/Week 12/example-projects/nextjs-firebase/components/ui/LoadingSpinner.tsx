/**
 * REF: loading-spinner
 *
 * # LoadingSpinner Component
 *
 * Reusable loading indicator for async operations.
 *
 * ## Key Concepts
 *
 * - **Reusable components** - DRY principle
 * - **Props for customization** - Size and text
 * - **CSS animations** - Tailwind's `animate-spin`
 * - **Accessibility** - ARIA roles
 *
 * ## Usage
 *
 * ```tsx
 * <LoadingSpinner size="lg" text="Loading todos..." />
 * ```
 *
 * ## Why Separate Component?
 *
 * - Consistent loading UI across app
 * - Easy to update in one place
 * - Can swap implementation later
 */

/**
 * REF: spinner-props
 *
 * ## Component Props
 *
 * - `size?`: Spinner size (sm, md, lg)
 * - `text?`: Optional loading message
 * - `className?`: Additional CSS classes
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}
// CLOSE: spinner-props

/**
 * REF: spinner-component
 *
 * ## LoadingSpinner Function
 *
 * Renders animated spinner with optional text.
 */
export default function LoadingSpinner({
  size = 'md',
  text,
  className = '',
}: LoadingSpinnerProps) {
  /**
   * REF: size-mapping
   *
   * ## Size Classes Mapping
   *
   * Maps size prop to Tailwind classes.
   *
   * - `sm`: Small (16px)
   * - `md`: Medium (32px)
   * - `lg`: Large (48px)
   */
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }
  // CLOSE: size-mapping

  /**
   * REF: spinner-render
   *
   * ## Spinner UI
   *
   * Animated spinning circle with optional text.
   *
   * ### Animation
   *
   * - `border-current`: Uses text color for border
   * - `border-t-transparent`: Top border invisible (creates gap)
   * - `rounded-full`: Circular shape
   * - `animate-spin`: Tailwind rotation animation
   *
   * ### Accessibility
   *
   * - `role="status"`: ARIA role for loading state
   * - `aria-label`: Screen reader description
   */
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Spinner */}
      <div
        className={`
          ${sizeClasses[size]}
          border-current
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="Loading"
      />

      {/* Optional Text */}
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {text}
        </p>
      )}
    </div>
  )
}
// CLOSE: spinner-render
// CLOSE: spinner-component
// CLOSE: loading-spinner
