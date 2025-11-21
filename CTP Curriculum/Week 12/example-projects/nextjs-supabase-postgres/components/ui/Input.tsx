/**
 * Input Component - Reusable Form Input
 *
 * A flexible, accessible input component with validation states.
 *
 * ## Key Concepts
 * - Controlled vs uncontrolled inputs
 * - Form validation states
 * - Accessibility with labels
 * - TypeScript prop types
 *
 * ## Controlled Inputs
 * - Value controlled by React state
 * - onChange updates state
 * - Single source of truth
 * - React has full control
 *
 * WHY REUSABLE INPUTS?
 * - Consistent styling
 * - Built-in validation display
 * - Accessibility baked in
 * - Easy to enhance globally
 *
 */

// REF: Control flow
import { InputHTMLAttributes, forwardRef } from 'react'
// CLOSE: Control flow

/**
 * INPUT PROPS
 *
 * Extends HTML input attributes
 * Adds custom props for our needs
 */
// REF: JSX element
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string
  /** Error message to display */
  error?: string
  /** Helper text */
  helperText?: string
  /** Is field required? */
  required?: boolean
}
// CLOSE: JSX element

/**
 * INPUT COMPONENT
 *
 * Uses forwardRef to allow parent components to access the input element
 *
 * WHY forwardRef?
 * - Allows passing ref from parent
 * - Parent can call input.focus()
 * - Needed for form libraries
 * - Best practice for reusable inputs
 *
 * ### Usage
 * ```tsx
 * const inputRef = useRef<HTMLInputElement>(null)
 *
 * <Input
 *   ref={inputRef}
 *   label="Email"
 *   type="email"
 *   error={errors.email}
 *   required
 * />
 *
 * // Later:
 * inputRef.current?.focus()
 * ```
 */
/**
 * REF: input-component
 *
 * ## Input Component
 *
 * A flexible, accessible form input component with built-in label, error, and helper text support.
 * Uses forwardRef to allow parent components to access the input element directly.
 *
 * ### Props
 * | Name | Type | Description |
 * |------|------|-------------|
 * | `label` | `string` | Label text displayed above input |
 * | `error` | `string` | Error message to display (adds red styling) |
 * | `helperText` | `string` | Helper text displayed below input |
 * | `required` | `boolean` | Shows required indicator (*) |
 * | `...props` | `InputHTMLAttributes` | All native input attributes |
 *
 * ### Features
 * - Full accessibility support (ARIA attributes)
 * - Label association with htmlFor/id
 * - Error and validation states
 * - Helper text for guidance
 * - Required field indicator
 * - Dark mode support
 * - forwardRef for direct element access
 *
 * ### Example
 * ```tsx
 * const inputRef = useRef<HTMLInputElement>(null)
 *
 * <Input
 *   ref={inputRef}
 *   label="Email Address"
 *   type="email"
 *   error={errors.email}
 *   helperText="We'll never share your email"
 *   required
 * />
 * ```
 */
// REF: Constant: Input
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, required, className = '', ...props }, ref) => {
// CLOSE: Constant: Input
    /**
     * GENERATE UNIQUE ID
     *
     * For associating label with input
     * Uses prop id if provided, otherwise generates one
     */
// REF: Constant: inputId
    const inputId = props.id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`
// CLOSE: Constant: inputId

    /**
     * STYLE VARIATIONS
     *
     * Different border colors based on state
     */
// REF: Constant: borderClass
    const borderClass = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500 dark:border-gray-600'
// CLOSE: Constant: borderClass

// REF: JSX return
    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
// CLOSE: JSX return

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2 border rounded-lg
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed
            dark:bg-gray-700 dark:text-white
            ${borderClass}
            ${className}
          `.trim()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` :
            helperText ? `${inputId}-helper` :
            undefined
          }
          required={required}
          {...props}
        />

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

/**
 * USAGE EXAMPLES
 *
 * Basic:
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   required
 * />
 * ```
 *
 * With error:
 * ```tsx
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 6 characters"
 * />
 * ```
 *
 * With helper text:
 * ```tsx
 * <Input
 *   label="Username"
 *   helperText="Only letters, numbers, and underscores"
 * />
 * ```
 *
 * With ref:
 * ```tsx
 * const inputRef = useRef<HTMLInputElement>(null)
 *
 * <Input ref={inputRef} label="Focus me" />
 *
 * // Later:
 * inputRef.current?.focus()
 * inputRef.current?.select()
 * ```
 *
 * Controlled:
 * ```tsx
 * const [value, setValue] = useState('')
 *
 * <Input
 *   value={value}
 *   onChange={(e) => setValue(e.target.value)}
 * />
 * ```
 */

/**
 * FORM INTEGRATION
 *
 * With React Hook Form:
 * ```tsx
 * import { useForm } from 'react-hook-form'
 *
 * const { register, formState: { errors } } = useForm()
 *
 * <Input
 *   label="Email"
 *   {...register('email', { required: 'Email is required' })}
 *   error={errors.email?.message}
 * />
 * ```
 *
 * With Formik:
 * ```tsx
 * import { useFormik } from 'formik'
 *
 * const formik = useFormik({ ... })
 *
 * <Input
 *   label="Email"
 *   name="email"
 *   value={formik.values.email}
 *   onChange={formik.handleChange}
 *   error={formik.errors.email}
 * />
 * ```
 */

/**
 * ACCESSIBILITY FEATURES
 *
 * This component includes:
 * - ✅ Label association (htmlFor/id)
 * - ✅ Required indicator (*)
 * - ✅ Error announcements (role="alert")
 * - ✅ ARIA attributes (aria-invalid, aria-describedby)
 * - ✅ Focus management (ref)
 * - ✅ Keyboard accessible
 *
 * WCAG COMPLIANCE:
 * - 2.1.1 Keyboard: Fully keyboard accessible
 * - 2.4.6 Headings and Labels: Clear labels
 * - 3.3.1 Error Identification: Errors clearly identified
 * - 3.3.2 Labels or Instructions: Helper text provided
 * - 4.1.3 Status Messages: Error role="alert"
 */

/**
 * EXTENDING THE COMPONENT
 *
 * Add input addons:
 * ```tsx
 * interface InputProps {
 *   leftAddon?: ReactNode
 *   rightAddon?: ReactNode
 * }
 *
 * <div className="flex">
 *   {leftAddon && <span className="...">{leftAddon}</span>}
 *   <input ... />
 *   {rightAddon && <span className="...">{rightAddon}</span>}
 * </div>
 * ```
 *
 * Add character counter:
 * ```tsx
 * {maxLength && (
 *   <p className="text-xs text-gray-500 mt-1">
 *     {value.length} / {maxLength}
 *   </p>
 * )}
 * ```
 *
 * Add password visibility toggle:
 * ```tsx
 * const [showPassword, setShowPassword] = useState(false)
 *
 * <input type={showPassword ? 'text' : 'password'} />
 * <button onClick={() => setShowPassword(!showPassword)}>
 *   {showPassword ? 'Hide' : 'Show'}
 * </button>
 * ```
 */
