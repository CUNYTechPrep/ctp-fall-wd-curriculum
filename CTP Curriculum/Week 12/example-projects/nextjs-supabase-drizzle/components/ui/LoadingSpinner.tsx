/**
 * REF: loading-spinner-component
 *
 * # LoadingSpinner Component
 *
 * Reusable loading indicator with size variants.
 *
 * ## Key Concepts
 *
 * - **Reusable UI components** - DRY principle
 * - **Props customization** - Size and text options
 * - **CSS animations** - Tailwind animate-spin
 * - **Accessibility** - ARIA attributes
 * - **TypeScript props** - Type-safe interface
 *
 * ## Use Cases
 *
 * - Loading states in forms
 * - Page-level loading indicators
 * - Async operation feedback
 * - Data fetching states
 */

/**
 * REF: spinner-props
 *
 * ## LoadingSpinner Props
 *
 * | `Prop` | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `size` | 'sm' \| 'md' \| `'lg'` | `'md'` | Spinner size |
 * | `text` | `string` | `undefined` | Optional loading text |
 *
 * ### Size Variants
 *
 * - **sm**: Small (4x4) - for inline use
 * - **md**: Medium (8x8) - default
 * - **lg**: Large (12x12) - full-page loading
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}
// CLOSE: spinner-props

/**
 * REF: spinner-function
 *
 * ## LoadingSpinner Function
 *
 * Component function with prop destructuring.
 */
export default function LoadingSpinner({
  size = 'md',
  text,
}: LoadingSpinnerProps) {
  // CLOSE: spinner-function

  /**
   * REF: size-classes
   *
   * ## Size Classes Mapping
   *
   * Maps size prop to Tailwind classes.
   *
   * | `Size` | `Classes` | `Dimensions` |
   * |------|---------|------------|
   * | `sm` | w-4 h-4 border-2 | 16x16px, 2px border |
   * | `md` | w-8 h-8 border-4 | 32x32px, 4px border |
   * | `lg` | w-12 h-12 border-4 | 48x48px, 4px border |
   */
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }
  // CLOSE: size-classes

  /**
   * REF: spinner-render
   *
   * ## Spinner Render
   *
   * Flex container with spinner and optional text.
   */
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/**
       * REF: spinner-element
       *
       * ## Animated Spinner
       *
       * Circular div with rotation animation.
       *
       * ### Animation
       *
       * - `animate-spin` - Continuous rotation
       * - `border-current` - Uses text color
       * - `border-t-transparent` - Creates spinner gap
       * - `rounded-full` - Perfect circle
       */}
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
      {/* CLOSE: spinner-element */}

      {/**
       * REF: loading-text
       *
       * ## Optional Loading Text
       *
       * Displays text below spinner when provided.
       */}
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {text}
        </p>
      )}
      {/* CLOSE: loading-text */}
    </div>
  )
}
// CLOSE: spinner-render
// CLOSE: loading-spinner-component
