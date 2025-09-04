## LEARNING OBJECTIVES

### Content Objectives (What students will know):
- Identify utility-first CSS principles and explain Tailwind's design philosophy
- Compare traditional CSS approaches with utility-first methodology
- Analyze responsive design patterns using Tailwind's breakpoint system
- Describe component composition using utility classes

### Language Objectives (How students will communicate learning):
- **Reading:** Interpret Tailwind documentation, utility class names, and configuration files
- **Writing:** Create styled components using utility classes and document design decisions
- **Speaking:** Articulate design choices, present styled interfaces, and explain responsive strategies
- **Listening:** Understand design feedback, process styling requirements, and collaborate on UI decisions

### Learning Objectives (What students will be able to do):
By the end of this session, students will be able to:
- Style React components using Tailwind utility classes
- Implement responsive layouts with Tailwind breakpoints
- Create reusable component styles using Tailwind patterns
- Configure and customize Tailwind for team projects

## MATERIALS & PREPARATION

### Instructor Prep:
- Presentation prepared: Tailwind CSS fundamentals (15 slides max - compact for career workshop)
- Code examples: Expense tracker with complete Tailwind styling
- Design system: Color palette, spacing scale, and typography examples
- Component library: Styled button, card, and form components
- Career workshop materials coordinated with career services

### TA Prep:
- Tailwind proficiency: Understanding of utility classes and responsive modifiers
- Design patterns: Knowledge of common Tailwind component patterns
- Troubleshooting: Ability to debug styling issues quickly
- VS Code extensions: Tailwind CSS IntelliSense installed and configured

### Student Requirements:
- **Completed from Week 3:** TypeScript components working
- **Individual work:** Expense tracker with TypeScript integration
- **Team status:** Type architecture defined and documented
- **Preparation:** Basic CSS knowledge refreshed

### Technology Setup:
- **Development:** CodeSpaces with Tailwind CSS installed
- **Extensions:** Tailwind CSS IntelliSense for VS Code
- **Configuration:** tailwind.config.js ready for customization
- **Resources:** Tailwind documentation, component examples

## COMPACT SESSION TIMELINE (Adjusted for Career Workshop)

| Time | Duration | Activity | Format | Assessment |
|------|----------|----------|---------|------------|
| 0-5 min | 5 min | Launch & Tailwind Philosophy | Demo | Engagement |
| 5-20 min | 15 min | Lecture: Tailwind Fundamentals | Presentation | Understanding |
| 20-35 min | 15 min | I DO: Component Styling | Live coding | Pattern recognition |
| 35-50 min | 15 min | YOU DO: Style Your Components | Practice | Implementation |
| 50-60 min | 10 min | BREAK | Informal | None |
| 60-90 min | 30 min | Team Project: Design System Setup | Collaboration | Design tokens |
| 90-100 min | 10 min | BREAK | Informal | None |
| 100-150 min | 50 min | CAREER WORKSHOP: Resume Building | Career Services | Resume draft |

## LAUNCH (5 minutes)

### Hook:
"Watch me transform this bland component into a polished interface in 30 seconds using just class names - no CSS files needed!"

### Live Transformation Demo (3 min):

**Before (Plain React):**
```jsx
<div>
  <h2>Total Expenses</h2>
  <p>$1,234.56</p>
  <button>Add Expense</button>
</div>
```

**After (With Tailwind):**
```jsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-2">Total Expenses</h2>
  <p className="text-3xl font-bold text-green-600 mb-4">$1,234.56</p>
  <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
    Add Expense
  </button>
</div>
```

### Why Tailwind Matters (2 min):
- Used by major companies (GitHub, Netflix, NASA)
- Faster development with utility classes
- Consistent design without custom CSS
- Smaller production bundles with PurgeCSS

## LECTURE: Tailwind Fundamentals (15 minutes)

### Core Concepts (5 minutes)

**Utility-First Philosophy:**
```jsx
// Traditional CSS approach
<div className="card">
  <h2 className="card-title">Title</h2>
</div>

// Tailwind approach
<div className="bg-white rounded-lg shadow p-4">
  <h2 className="text-xl font-bold">Title</h2>
</div>
```

**Utility Class Categories:**
- **Layout:** `flex`, `grid`, `block`, `inline`
- **Spacing:** `p-4`, `m-2`, `space-x-4`
- **Typography:** `text-lg`, `font-bold`, `text-center`
- **Colors:** `bg-blue-500`, `text-gray-700`, `border-red-400`
- **Effects:** `shadow-md`, `rounded-lg`, `opacity-75`

### Responsive Design (5 minutes)

**Mobile-First Breakpoints:**
```jsx
// Responsive card that stacks on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Content A</div>
  <div className="w-full md:w-1/2">Content B</div>
</div>

// Breakpoint prefixes:
// sm: (640px+)  md: (768px+)  lg: (1024px+)  xl: (1280px+)  2xl: (1536px+)
```

### State Variants (5 minutes)

**Interactive States:**
```jsx
<button className="
  bg-blue-500 
  hover:bg-blue-600 
  active:bg-blue-700 
  focus:outline-none 
  focus:ring-2 
  focus:ring-blue-400
  disabled:bg-gray-300 
  disabled:cursor-not-allowed
  transition-colors
">
  Click Me
</button>

// Dark mode support
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Adapts to theme
</div>
```

## I DO: Component Styling Demo (15 minutes)

### Transform ExpenseCard with Tailwind:

```tsx
// ExpenseCard.tsx with Tailwind
import React from 'react';
import { Expense } from './types';

interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: number) => void;
  onEdit?: (expense: Expense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  onDelete, 
  onEdit 
}) => {
  const categoryColors: Record<string, string> = {
    Food: 'bg-green-100 text-green-800',
    Transport: 'bg-blue-100 text-blue-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  const getAmountColor = () => {
    if (expense.amount > 100) return 'text-red-600';
    if (expense.amount > 50) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <article className="
      bg-white 
      rounded-lg 
      shadow-sm 
      hover:shadow-md 
      transition-shadow 
      p-4 
      border 
      border-gray-200
      cursor-pointer
      relative
      group
    "
    onClick={() => onEdit?.(expense)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className={`
          px-2 
          py-1 
          rounded-full 
          text-xs 
          font-medium 
          ${categoryColors[expense.category]}
        `}>
          {expense.category}
        </span>
        <time className="text-sm text-gray-500">
          {new Date(expense.date).toLocaleDateString()}
        </time>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <p className="text-gray-700 line-clamp-2">
          {expense.description}
        </p>
        <p className={`text-2xl font-bold ${getAmountColor()}`}>
          ${expense.amount.toFixed(2)}
        </p>
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(expense.id);
          }}
          className="
            absolute 
            top-2 
            right-2
            w-8 
            h-8
            bg-red-500 
            text-white 
            rounded-full
            opacity-0 
            group-hover:opacity-100
            transition-opacity
            flex 
            items-center 
            justify-center
            hover:bg-red-600
            focus:outline-none
            focus:ring-2
            focus:ring-red-400
          "
          aria-label="Delete expense"
        >
          ×
        </button>
      )}
    </article>
  );
};
```

### Create Reusable Button Component:

```tsx
// Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
  };

  const sizes = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${widthClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
```

## YOU DO: Style Your Components (15 minutes)

### Tasks:
1. **Apply Tailwind to ExpenseForm:**
   - Style form inputs with Tailwind
   - Add hover and focus states
   - Make it responsive

2. **Create a Layout Component:**
   - Header with navigation
   - Responsive sidebar
   - Main content area

3. **Style the ExpenseList:**
   - Grid layout for cards
   - Responsive breakpoints
   - Loading and empty states

### Example Starting Point:

```tsx
// ExpenseForm.tsx with Tailwind
const ExpenseForm = ({ onSubmit }) => {
  return (
    <form className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          className="
            w-full 
            px-3 
            py-2 
            border 
            border-gray-300 
            rounded-md
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500
            focus:border-transparent
          "
          placeholder="Enter expense description..."
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            className="
              w-full 
              px-3 
              py-2 
              border 
              border-gray-300 
              rounded-md
              focus:outline-none 
              focus:ring-2 
              focus:ring-blue-500
            "
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select className="
            w-full 
            px-3 
            py-2 
            border 
            border-gray-300 
            rounded-md
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500
          ">
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <Button type="submit" fullWidth>
        Add Expense
      </Button>
    </form>
  );
};
```

## BREAK (10 minutes)

## TEAM PROJECT: Design System Setup (30 minutes)

### Create Team Design Tokens:

**tailwind.config.js customization:**
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Team brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
```

### Team Deliverables:
1. Configure Tailwind for your project theme
2. Create 3 styled components using Tailwind
3. Document your design system choices
4. Set up dark mode support (optional)

### Component Library Structure:
```
/components
  /ui
    Button.tsx
    Card.tsx
    Input.tsx
    Modal.tsx
  /layout
    Header.tsx
    Sidebar.tsx
    Footer.tsx
```

## CAREER WORKSHOP: Resume Building (50 minutes)
*Led by Career Services Team*

### Topics Covered:
- Technical resume best practices
- Highlighting projects effectively
- ATS optimization
- Action verbs and metrics
- GitHub profile optimization

### Deliverable:
- Updated technical resume draft
- GitHub profile review
- LinkedIn updates

## WRAP-UP (5 minutes via Slack/Async)

### This Week's Achievement:
"You've learned Tailwind CSS for rapid UI development and worked on your professional resume. Your expense tracker is now beautifully styled!"

### Homework:
- Complete Tailwind styling for all components
- Finish resume based on workshop feedback
- Team: Implement consistent design system
- Team: Create at least 5 shared UI components

### Next Week Preview:
"Week 5: Testing Fundamentals - Write tests for your components and learn TDD practices."

## Individual Project Requirements:
- Apply Tailwind to all components
- Create at least one reusable styled component
- Implement responsive design (mobile + desktop)
- Use Tailwind configuration for custom theme
- No custom CSS files (Tailwind only)

## Resources:
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Headless UI](https://headlessui.com/)
- [Tailwind UI Components](https://tailwindui.com/components) (free samples)
- [Tailwind Play](https://play.tailwindcss.com/)