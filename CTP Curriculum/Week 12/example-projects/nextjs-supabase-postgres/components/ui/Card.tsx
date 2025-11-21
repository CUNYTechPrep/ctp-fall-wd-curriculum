/**
 * Card Component - Reusable Container
 *
 * A flexible card component for grouping content.
 *
 * ## Key Concepts
 * - Composition pattern (children prop)
 * - Variant system for different styles
 * - Semantic HTML
 *
 * ## Composition Pattern
 * - Accept children as prop
 * - Wrap with styling
 * - Flexible and reusable
 *
 */

// REF: Import statement
import { HTMLAttributes, ReactNode } from 'react'
// CLOSE: Import statement

// REF: JSX element
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'bordered' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}
// CLOSE: JSX element

/**
 * REF: card-component
 *
 * ## Card Component
 *
 * A flexible container component for grouping related content with consistent styling.
 * Uses the composition pattern to accept any children and wrap them with card styling.
 *
 * ### Props
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `children` | `ReactNode` | Content to display inside card |
 * | `variant` | `'default' \| 'bordered' \| 'elevated'` | Visual style variant |
 * | `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | Internal padding size |
 * | `...props` | `HTMLAttributes<HTMLDivElement>` | All native div attributes |
 *
 * ### Features
 * - Composition pattern for maximum flexibility
 * - Multiple style variants
 * - Configurable padding
 * - Dark mode support
 * - Semantic HTML structure
 *
 * ### Example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */

// REF: Function: export
export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 shadow',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow',
  }
// CLOSE: Function: export

// REF: Constant: paddingStyles
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
// CLOSE: Constant: paddingStyles

// REF: JSX return
  return (
    <div
      className={`rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
// CLOSE: JSX return

/**
 * USAGE EXAMPLES
 *
 * Simple card:
 * ```tsx
 * <Card>
 *   <h2>Title</h2>
 *   <p>Content here</p>
 * </Card>
 * ```
 *
 * With variants:
 * ```tsx
 * <Card variant="elevated">
 *   <h2>Elevated Card</h2>
 * </Card>
 * ```
 *
 * Custom padding:
 * ```tsx
 * <Card padding="lg">
 *   <h2>Large Padding</h2>
 * </Card>
 * ```
 *
 * With custom classes:
 * ```tsx
 * <Card className="max-w-md mx-auto">
 *   <h2>Centered Card</h2>
 * </Card>
 * ```
 */

/**
 * SUBCOMPONENTS PATTERN
 *
 * Create compound components:
 *
 * ```tsx
 * export function CardHeader({ children }: { children: ReactNode }) {
 *   return (
 *     <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
 *       {children}
 *     </div>
 *   )
 * }
 *
 * export function CardBody({ children }: { children: ReactNode }) {
 *   return <div className="space-y-4">{children}</div>
 * }
 *
 * export function CardFooter({ children }: { children: ReactNode }) {
 *   return (
 *     <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
 *       {children}
 *     </div>
 *   )
 * }
 * ```
 *
 * Usage:
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <h2>Title</h2>
 *   </CardHeader>
 *   <CardBody>
 *     <p>Content</p>
 *   </CardBody>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
