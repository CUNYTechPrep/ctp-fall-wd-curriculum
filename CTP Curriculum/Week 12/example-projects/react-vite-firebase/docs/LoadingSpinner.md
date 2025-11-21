# LoadingSpinner.tsx - Reusable Loading Indicator

## REF: LoadingSpinner Component

Displays an animated spinning loader with optional text for async operations. A flexible, accessible loading indicator component used throughout the app.

---

## Component Overview

### Purpose

- Show loading state during async operations
- Provide visual feedback to users
- Support multiple size variants
- Include optional loading text
- Fully accessible with ARIA attributes

### Key Features

| **Feature** | **Benefit** |
|-----------|-----------|
| **Three size variants** | sm, md, lg for any context |
| **Optional text** | Explain what's loading |
| **Hardware-accelerated** | Smooth 60fps animation |
| **Accessibility** | ARIA labels for screen readers |
| **Lightweight** | Pure CSS animation (no JavaScript) |

---

## Props Interface

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}
```

### Props Reference

| **Prop** | **Type** | **Default** | **Description** |
|---------|---------|-----------|-----------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size variant |
| `text` | `string \| undefined` | `undefined` | Optional loading message |

---

## Size Variants

### Size Mapping

| **Size** | **Width/Height** | **Border** | **Use Case** |
|---------|-----------------|-----------|------------|
| **sm** | 16px × 16px | 2px | Inline loading (buttons, small areas) |
| **md** | 32px × 32px | 4px | Default loading (pages, sections) |
| **lg** | 48px × 48px | 4px | Full-page loading (critical operations) |

### Tailwind Classes

```typescript
const sizeClasses = {
  sm: 'w-4 h-4 border-2',      // 16px, thin border
  md: 'w-8 h-8 border-4',      // 32px, medium border
  lg: 'w-12 h-12 border-4',    // 48px, thick border
}
```

---

## Usage Examples

### Small Spinner (Inline)

```typescript
<LoadingSpinner size="sm" />
```

**Use when:**
- Loading inside buttons
- Inline within lists
- Next to form fields
- Minimal space available

### Medium Spinner (Default)

```typescript
<LoadingSpinner text="Loading your todos..." />
```

**Use when:**
- Standard page loading
- Default size for most cases
- Medium-sized components
- Dialog boxes

### Large Spinner (Full-Page)

```typescript
<LoadingSpinner size="lg" text="Please wait..." />
```

**Use when:**
- Page-level loading
- Critical operations
- User needs clear feedback
- Full attention required

---

## Common Use Cases

### Full-Page Loading

```typescript
function MyPage() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Loading data..." />
      </div>
    )
  }

  return <div>Page content</div>
}
```

### Button Loading State

```typescript
function SubmitButton() {
  const [loading, setLoading] = useState(false)

  return (
    <button disabled={loading}>
      {loading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span>Submitting...</span>
        </div>
      ) : (
        'Submit'
      )}
    </button>
  )
}
```

### Protected Route Loading

```typescript
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner size="lg" text="Checking authentication..." />
  }

  if (!user) return <Navigate to="/signin" />
  return children
}
```

### Data Fetching

```typescript
function DataList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData().then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <LoadingSpinner text="Fetching data..." />
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

### Modal Loading

```typescript
function Modal() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="modal">
      {loading ? (
        <LoadingSpinner text="Uploading..." />
      ) : (
        <form>Upload your file</form>
      )}
    </div>
  )
}
```

---

## Accessibility Features

### ARIA Attributes

| **Attribute** | **Value** | **Purpose** |
|--------------|----------|-----------|
| `role` | `"status"` | Announces loading state to screen readers |
| `aria-label` | `"Loading"` | Provides context for assistive technology |

### Accessibility Benefits

- **Screen readers**: Announce loading state
- **Keyboard navigation**: No keyboard trap
- **Focus management**: Can be focused if needed
- **Semantic HTML**: Proper role attribute

### Best Practices

```typescript
// Good: Provides context
<LoadingSpinner size="lg" text="Loading your messages..." />

// Good: Used in semantic container
<div role="main">
  <LoadingSpinner />
</div>

// Avoid: No text for clarity
<LoadingSpinner />

// Avoid: Not visible to screen readers
<div style={{ display: 'none' }}>
  <LoadingSpinner />
</div>
```

---

## CSS Animation Details

### Border Trick

The spinner uses a clever CSS technique:

```css
.spinner {
  border: 4px solid blue;           /* All sides blue */
  border-top: 4px solid transparent; /* Top side transparent */
  border-radius: 50%;               /* Makes circle */
  animation: spin 1s linear infinite; /* Rotate continuously */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### How It Works

1. **Full blue border**: Creates the background circle
2. **Transparent top**: Creates the rotating indicator
3. **Rotation**: Shows progress visually
4. **Animation**: Hardware-accelerated (GPU)

### Performance Characteristics

| **Aspect** | **Details** |
|-----------|-----------|
| **GPU Accelerated** | Transform operations run on GPU |
| **No JavaScript** | Pure CSS animation |
| **60 FPS** | Smooth, flicker-free animation |
| **Low Battery Impact** | Minimal CPU usage |
| **Browser Support** | All modern browsers |

---

## Customization Options

### Change Color

```typescript
<div
  className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"
/>
```

### Custom Size

```typescript
<div
  className="w-16 h-16 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"
/>
```

### Different Animation

```typescript
// Pulse animation instead of spin
<div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse" />

// Bounce animation
<div className="w-8 h-8 bg-blue-600 rounded-full animate-bounce" />

// Multiple animated dots
<div className="flex gap-1">
  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75" />
  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150" />
</div>
```

---

## Alternative Loading Patterns

### Skeleton Screen (Recommended for Content)

Better UX for displaying content placeholders:

```typescript
function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  )
}
```

**When to use:**
- Loading lists of items
- Cards with content
- Tables with rows
- Provides better perceived performance

### Progress Bar (For Uploads)

```typescript
function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

**When to use:**
- File uploads (show percent)
- Long-running operations
- User wants to see progress

### Pulse Animation

```typescript
function PulseLoader() {
  return (
    <div className="flex gap-1">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-100" />
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-200" />
    </div>
  )
}
```

**When to use:**
- Subtle loading indicator
- Less intrusive than spinner
- Chat applications
- Real-time updating

### Shimmer Effect

```typescript
function ShimmerLoader() {
  return (
    <div className="bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded">
      <div className="h-12 w-full" />
    </div>
  )
}
```

**When to use:**
- Image loading
- Modern feel
- Indicates "something is coming"

---

## Performance Considerations

### Why CSS Animation Over JavaScript

| **Aspect** | **CSS Animation** | **JavaScript** |
|-----------|------------------|-----------------|
| **Rendering** | GPU-accelerated | CPU-based |
| **Performance** | 60 FPS smooth | Can drop frames |
| **Battery** | Low impact | Higher drain |
| **Complexity** | Simple | Complex event loops |

### Browser Optimization

Modern browsers optimize CSS transforms:
- `transform: rotate()` - Hardware accelerated
- `opacity` changes - Hardware accelerated
- Other properties - Software rendered

### Best Practices

```typescript
// Good: GPU accelerated
className="animate-spin"

// Avoid: CPU intensive
className="animate-pulse"  // If animating size

// Avoid: Heavy effects
style={{
  animation: 'spin 1s infinite',
  filter: 'drop-shadow(0 0 10px red)'  // Expensive!
}}
```

---

## Responsive Usage

### Mobile Considerations

```typescript
// Adjust size for mobile
<LoadingSpinner
  size={isMobile ? 'sm' : 'md'}
  text={isMobile ? undefined : "Loading..."}
/>
```

### Viewport-Based Size

```typescript
import { useMediaQuery } from '@/hooks/useMediaQuery'

function ResponsiveLoader() {
  const isMobile = useMediaQuery('(max-width: 640px)')

  return <LoadingSpinner size={isMobile ? 'sm' : 'lg'} />
}
```

---

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react'
import LoadingSpinner from './LoadingSpinner'

test('renders with default size', () => {
  render(<LoadingSpinner />)
  const spinner = screen.getByRole('status')
  expect(spinner).toHaveClass('w-8')
})

test('renders with custom size', () => {
  render(<LoadingSpinner size="lg" />)
  const spinner = screen.getByRole('status')
  expect(spinner).toHaveClass('w-12')
})

test('displays loading text', () => {
  render(<LoadingSpinner text="Loading..." />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})

test('has accessibility attributes', () => {
  render(<LoadingSpinner />)
  const spinner = screen.getByRole('status')
  expect(spinner).toHaveAttribute('aria-label', 'Loading')
})
```

---

## Integration Examples

### With useEffect

```typescript
function DataComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Fetching..." />
  return <div>{data}</div>
}
```

### With React Query

```typescript
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })

  if (isLoading) return <LoadingSpinner />
  return <div>{data}</div>
}
```

---

## CLOSE

LoadingSpinner is a simple yet powerful component that:
- Provides clear visual feedback to users
- Works in any context (full-page, inline, modal)
- Offers three size variants
- Fully accessible with ARIA attributes
- Hardware-accelerated for smooth performance

Use it whenever an operation takes non-trivial time to complete.
