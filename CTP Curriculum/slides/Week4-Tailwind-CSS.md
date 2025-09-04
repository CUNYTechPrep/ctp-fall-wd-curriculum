---
marp: true
theme: default
paginate: true
---

# Week 4: Tailwind CSS & Design Systems

**CTP Web Development Track**
*Beautiful, Responsive UIs with Utility-First CSS*

---

# Today's Agenda (Compact Session)

1. **Tailwind Fundamentals** (15 min)
2. **Component Styling Demo** (15 min)
3. **Hands-On Practice** (15 min)
4. **Team Design Systems** (30 min)
5. **Career Workshop** (50 min)

*Note: Condensed technical content for career workshop*

---

# The Problem with Traditional CSS

```css
/* styles.css - Gets messy fast */
.card { }
.card-header { }
.card-body { }
.card-footer { }
.card-primary { }
.card-secondary { }
.card-with-image { }
.card-horizontal { }
/* ... hundreds more ... */
```

**Issues:**
- Naming is hard
- Files grow huge
- Specificity wars
- Dead code accumulates

---

# Enter Tailwind CSS

## Utility-First Approach

```jsx
// No CSS file needed!
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-gray-800">
    Hello Tailwind!
  </h2>
  <p className="text-gray-600 mt-2">
    Style directly in your JSX
  </p>
</div>
```

**One class = One style**

---

# Why Tailwind?

## Industry Adoption
- GitHub, Netflix, NASA use it
- Faster development cycles
- Consistent designs
- Tiny production bundles

## Developer Experience
- IntelliSense autocomplete
- No context switching
- Instant visual feedback
- Mobile-first by default

---

# Core Utility Categories

## Layout
`flex` `grid` `block` `hidden`

## Spacing
`p-4` `m-2` `space-x-4`

## Typography
`text-xl` `font-bold` `uppercase`

## Colors
`bg-blue-500` `text-white` `border-gray-300`

## Effects
`shadow-lg` `rounded` `opacity-50`

---

# Responsive Design Made Easy

```jsx
// Mobile-first responsive design
<div className="
  w-full        // Mobile: full width
  sm:w-1/2      // Small screens: 50%
  md:w-1/3      // Medium screens: 33%
  lg:w-1/4      // Large screens: 25%
">
  Responsive content
</div>
```

## Breakpoints
- `sm:` 640px+
- `md:` 768px+
- `lg:` 1024px+
- `xl:` 1280px+

---

# Interactive States

```jsx
<button className="
  bg-blue-500 
  hover:bg-blue-600     // Hover state
  active:bg-blue-700    // Click state
  focus:ring-2          // Focus ring
  focus:ring-blue-400
  disabled:opacity-50   // Disabled state
  transition-colors     // Smooth transition
">
  Interactive Button
</button>
```

**All states handled with utilities!**

---

# Demo: Unstyled to Styled

## Before
```jsx
<div>
  <h2>Total</h2>
  <p>$1,234</p>
  <button>Add</button>
</div>
```

## After
```jsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-bold mb-2">Total</h2>
  <p className="text-3xl text-green-600 mb-4">$1,234</p>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Add
  </button>
</div>
```

---

# Component Patterns

## Card Component
```jsx
const Card = ({ children }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    {children}
  </div>
);
```

## Button Variants
```jsx
const buttonVariants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
};
```

---

# Customizing Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#3fbaeb',
          DEFAULT: '#0fa9e6',
          dark: '#0c87b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
      }
    }
  }
}
```

Use: `bg-brand` `text-brand-dark`

---

# Form Styling Example

```jsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-1">
      Email
    </label>
    <input
      type="email"
      className="
        w-full px-3 py-2 
        border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 
        focus:ring-blue-500
      "
    />
  </div>
  
  <button className="w-full bg-blue-500 text-white py-2 rounded">
    Submit
  </button>
</form>
```

---

# Responsive Grid

```jsx
// Responsive product grid
<div className="
  grid 
  grid-cols-1      // 1 column mobile
  sm:grid-cols-2   // 2 columns tablet
  lg:grid-cols-3   // 3 columns desktop
  xl:grid-cols-4   // 4 columns wide
  gap-4            // Space between
">
  {products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))}
</div>
```

---

# Dark Mode Support

```jsx
// Automatic dark mode adaptation
<div className="
  bg-white dark:bg-gray-800 
  text-gray-900 dark:text-white
">
  <h1 className="text-gray-800 dark:text-gray-100">
    Adapts to System Theme
  </h1>
</div>
```

Enable in config:
```javascript
module.exports = {
  darkMode: 'class', // or 'media'
}
```

---

# Performance Benefits

## Traditional CSS
- Ship ALL styles (50-500kb)
- Lots of unused CSS
- Grows over time

## Tailwind Production
- Only used utilities ship
- Typically 5-10kb
- PurgeCSS removes unused
- Consistent size

---

# Common Patterns Cheatsheet

## Container
`max-w-7xl mx-auto px-4`

## Card
`bg-white rounded-lg shadow p-6`

## Button
`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600`

## Input
`px-3 py-2 border rounded focus:ring-2`

---

# VS Code Setup

## Install Tailwind CSS IntelliSense

Features:
- Autocomplete for class names
- Hover preview of styles
- Syntax highlighting
- Linting

## Settings
```json
{
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

---

# Your Turn: Style Components

## Tasks:
1. ✅ Style your ExpenseForm
2. ✅ Create responsive layout
3. ✅ Add hover/focus states
4. ✅ Implement loading state

## Remember:
- Mobile-first approach
- Use IntelliSense
- Check documentation
- Test responsiveness

---

# Team Design System Time

## Create Your Brand

1. **Choose Colors**
   - Primary, secondary, accent
   - Success, warning, error

2. **Typography Scale**
   - Heading sizes
   - Body text styles

3. **Component Library**
   - Buttons, cards, forms
   - Consistent patterns

---

# Design Tokens Example

```javascript
// Your team's design system
const colors = {
  primary: '#2563eb',    // Blue
  secondary: '#64748b',  // Gray
  success: '#10b981',    // Green
  warning: '#f59e0b',    // Amber
  error: '#ef4444',      // Red
};

const spacing = {
  xs: '0.5rem',  // 8px
  sm: '1rem',    // 16px
  md: '1.5rem',  // 24px
  lg: '2rem',    // 32px
  xl: '3rem',    // 48px
};
```

---

# Resources & Next Steps

## Documentation
- [tailwindcss.com](https://tailwindcss.com)
- [Tailwind UI](https://tailwindui.com)
- [Headless UI](https://headlessui.com)

## This Week's Goals
- ✅ Style all components
- ✅ Responsive design
- ✅ Team design system
- ✅ Update resume (workshop)

---

# Quick Tips

1. **Start simple** - Add complexity gradually
2. **Use IntelliSense** - Let it guide you
3. **Mobile-first** - Build up from small screens
4. **Extract patterns** - Create reusable components
5. **Stay consistent** - Use your design tokens

---

## Exit Ticket

### Please share in the post-meeting Slack Thread!

1. 🎨 One Tailwind utility pattern you found most useful
2. 💡 How you'll apply responsive design in your project  
3. ❓ One styling challenge you still need to solve

### Thank you! Enjoy the Career Workshop! 🚀

---

# Next Week Preview

## Testing Fundamentals
- Vitest setup
- Component testing
- Test-driven development
- Coverage reports

**Come prepared with styled components ready to test!**
