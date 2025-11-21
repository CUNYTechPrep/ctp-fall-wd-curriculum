/**
 * Button Component - Reusable UI Element
 *
 * A flexible, accessible button component with variants.
 *
 * ## Key Concepts
 * - Component reusability
 * - Variant patterns
 * - TypeScript prop types
 * - Accessibility (ARIA)
 *
 * WHY REUSABLE COMPONENTS?
 * - Consistent UI across app
 * - DRY (Don't Repeat Yourself)
 * - Easy to update styling globally
 * - Type-safe with TypeScript
 *
 * VARIANT PATTERN:
 * - Different visual styles (primary, secondary, danger)
 * - Same functionality
 * - Configured via props
 *
 */

// REF: Import statement
import { ButtonHTMLAttributes, ReactNode } from 'react'
// CLOSE: Import statement

/**
 * BUTTON PROPS INTERFACE
 *
 * Extends HTML button attributes
 * Adds custom props for variants
 *
 * TYPESCRIPT BENEFITS:
 * - Autocomplete for props
 * - Type checking at compile time
 * - Self-documenting
 */
// REF: JSX element
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state */
  loading?: boolean
  /** Button content */
  children: ReactNode
}
// CLOSE: JSX element

/**
 * BUTTON COMPONENT
 *
 * @param variant - Visual style (default: 'primary')
 * @param size - Button size (default: 'md')
 * @param loading - Shows loading state
 * @param children - Button content
 * @param ...props - All other HTML button props (onClick, disabled, etc.)
 *
 * ### Usage
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Save
 * </Button>
 *
 * <Button variant="danger" loading={isDeleting}>
 *   Delete
 * </Button>
 * ```
 */
/**
 * REF: button-component
 *
 * ## Button Component
 *
 * A flexible, accessible button component with support for multiple variants, sizes,
 * and loading states. Extends native HTML button attributes for full compatibility.
 *
 * ### Props
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | Visual style variant |
 * | `size` | `'sm' \| 'md' \| 'lg'` | Button size |
 * | `loading` | `boolean` | Shows loading spinner and disables button |
 * | `children` | `ReactNode` | Button content |
 * | `...props` | `ButtonHTMLAttributes` | All native button attributes |
 *
 * ### Features
 * - Multiple visual variants for different contexts
 * - Three size options
 * - Loading state with spinner
 * - Full TypeScript type safety
 * - Accessibility compliant (ARIA, focus rings)
 * - Dark mode support
 *
 * ### Example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Save Changes
 * </Button>
 *
 * <Button variant="danger" loading={isDeleting}>
 *   {isDeleting ? 'Deleting...' : 'Delete'}
 * </Button>
 * ```
 */

// REF: Function: export
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
// CLOSE: Function: export
  /**
   * VARIANT STYLES
   *
   * Object mapping for different visual styles
   * Tailwind classes for each variant
   */
// REF: Constant: variantStyles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
  }
// CLOSE: Constant: variantStyles

  /**
   * SIZE STYLES
   */
// REF: Constant: sizeStyles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
// CLOSE: Constant: sizeStyles

  /**
   * BASE STYLES
   *
   * Common styles applied to all buttons
   */
// REF: Constant: baseStyles
  const baseStyles = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
// CLOSE: Constant: baseStyles

  /**
   * COMBINE STYLES
   *
   * Merge base, variant, size, and custom classes
   */
// REF: Constant: combinedClassName
  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim()
// CLOSE: Constant: combinedClassName

  /**
   * RENDER
   *
   * ## Accessibility
   * - Disabled when loading
   * - aria-busy for screen readers
   * - Focus ring for keyboard navigation
   * - Semantic button element
   */
// REF: JSX return
  return (
    <button
      className={combinedClassName}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
// CLOSE: JSX return

/**
 * USAGE EXAMPLES
 *
 * Primary action:
 * ```tsx
 * <Button variant="primary" onClick={handleSave}>
 *   Save Changes
 * </Button>
 * ```
 *
 * Secondary action:
 * ```tsx
 * <Button variant="secondary" onClick={handleCancel}>
 *   Cancel
 * </Button>
 * ```
 *
 * Destructive action:
 * ```tsx
 * <Button variant="danger" onClick={handleDelete}>
 *   Delete Todo
 * </Button>
 * ```
 *
 * With loading state:
 * ```tsx
 * <Button loading={isSubmitting} onClick={handleSubmit}>
 *   {isSubmitting ? 'Saving...' : 'Save'}
 * </Button>
 * ```
 *
 * Different sizes:
 * ```tsx
 * <Button size="sm">Small</Button>
 * <Button size="md">Medium</Button>
 * <Button size="lg">Large</Button>
 * ```
 *
 * Form submit:
 * ```tsx
 * <Button type="submit">
 *   Submit Form
 * </Button>
 * ```
 */

/**
 * EXTENDING THE COMPONENT
 *
 * Add icons:
 * ```tsx
 * interface ButtonProps {
 *   icon?: ReactNode
 *   iconPosition?: 'left' | 'right'
 * }
 *
 * {iconPosition === 'left' && icon}
 * {children}
 * {iconPosition === 'right' && icon}
 * ```
 *
 * Add full width option:
 * ```tsx
 * interface ButtonProps {
 *   fullWidth?: boolean
 * }
 *
 * const widthClass = fullWidth ? 'w-full' : ''
 * ```
 *
 * Add as prop (render as link):
 * ```tsx
 * interface ButtonProps {
 *   as?: 'button' | 'a'
 *   href?: string
 * }
 *
 * const Component = as === 'a' ? 'a' : 'button'
 * return <Component className={...} href={href}>{children}</Component>
 * ```
 */

/**
 * ACCESSIBILITY ENHANCEMENTS
 *
 * Add ARIA labels:
 * ```tsx
 * <Button aria-label="Delete todo">
 *   <TrashIcon />
 * </Button>
 * ```
 *
 * Keyboard shortcuts:
 * ```tsx
 * <Button onClick={handleSave} accessKey="s">
 *   Save (Alt+S)
 * </Button>
 * ```
 *
 * Focus management:
 * ```tsx
 * const buttonRef = useRef<HTMLButtonElement>(null)
 *
 * useEffect(() => {
 *   buttonRef.current?.focus()
 * }, [])
 *
 * <Button ref={buttonRef}>Auto-focused</Button>
 * ```
 */

/**
 * TESTING
 *
 * Component can be easily tested:
 *
 * ```typescript
 * import { render, screen, fireEvent } from '@testing-library/react'
 * import Button from './Button'
 *
 * test('calls onClick when clicked', () => {
 *   const handleClick = jest.fn()
 *   render(<Button onClick={handleClick}>Click me</Button>)
 *
 *   fireEvent.click(screen.getByText('Click me'))
 *   expect(handleClick).toHaveBeenCalledTimes(1)
 * })
 *
 * test('shows loading state', () => {
 *   render(<Button loading>Save</Button>)
 *   expect(screen.getByText('Loading...')).toBeInTheDocument()
 * })
 * ```
 */
