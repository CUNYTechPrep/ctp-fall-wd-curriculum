## LEARNING OBJECTIVES

### Content Objectives (What students will know):
- Understand component isolation and testing with React Cosmos
- Describe the benefits of developing components in isolation
- Analyze component variations and edge cases through fixtures
- Identify utility-first CSS principles and explain Tailwind's design philosophy
- Compare traditional CSS approaches with utility-first methodology

### Language Objectives (How students will communicate learning):
- **Reading:** Interpret Cosmos fixtures, component documentation, Tailwind utility classes, and configuration files
- **Writing:** Write Cosmos fixtures, create styled components using utility classes, and document design decisions
- **Speaking:** Demonstrate component variations, explain testing strategies, articulate design choices, and present styled interfaces
- **Listening:** Review component testing approaches, understand design feedback, process styling requirements, and collaborate on UI decisions

### Learning Objectives (What students will be able to do):
By the end of this session, students will be able to:
- Set up React Cosmos for component development and testing
- Create fixtures to test component variations in isolation
- Develop components in isolation before integration
- Style React components using Tailwind utility classes
- Implement responsive layouts with Tailwind breakpoints
- Combine Cosmos fixtures with Tailwind styling for comprehensive component testing

## MATERIALS & PREPARATION

### Instructor Prep:
- Presentation prepared: React Cosmos fundamentals & Tailwind CSS styling (15 slides max - compact for career workshop)
- React Cosmos demo: Component isolation and testing setup with fixtures
- Code examples: Expense tracker components with Cosmos fixtures
- Component library: Button, card, and form components with fixtures and Tailwind styling
- Design system: Color palette, spacing scale, and typography examples
- Career workshop materials coordinated with career services

### TA Prep:
- React Cosmos: Understanding of fixtures, component testing, and isolation
- Component testing: Knowledge of testing patterns and edge cases
- Tailwind proficiency: Understanding of utility classes and responsive modifiers
- Design patterns: Knowledge of common Tailwind component patterns
- Troubleshooting: Ability to debug testing and styling issues quickly

### Student Requirements:
- **Completed from Week 3:** TypeScript components working
- **Individual work:** Expense tracker with TypeScript integration
- **Team status:** Type architecture defined and documented
- **Preparation:** Basic CSS knowledge refreshed

### Technology Setup:
- **Development:** CodeSpaces with React Cosmos and Tailwind CSS installed
- **Testing:** React Cosmos configured with basic setup and fixtures folder
- **Extensions:** Tailwind CSS IntelliSense for VS Code
- **Configuration:** cosmos.config.json and tailwind.config.js ready
- **Resources:** Cosmos documentation, Tailwind docs, component examples

## COMPACT SESSION TIMELINE (Adjusted for Career Workshop)

| Time | Duration | Activity | Format | Assessment |
|------|----------|----------|---------|------------|
| 0-5 min | 5 min | Launch & React Cosmos Introduction | Demo | Engagement |
| 5-15 min | 10 min | Lecture: Component Isolation with Cosmos | Presentation | Understanding |
| 15-25 min | 10 min | I DO: Creating Component Fixtures | Live coding | Pattern recognition |
| 25-35 min | 10 min | Tailwind CSS Fundamentals | Presentation | CSS concepts |
| 35-50 min | 15 min | YOU DO: Create Fixtures & Style Components | Practice | Implementation |
| 50-60 min | 10 min | BREAK | Informal | None |
| 60-90 min | 30 min | Team Project: Component Library with Cosmos & Tailwind | Collaboration | Fixtures & styling |
| 90-100 min | 10 min | BREAK | Informal | None |
| 100-150 min | 50 min | CAREER WORKSHOP: Resume Building | Career Services | Resume draft |

## LAUNCH (5 minutes)

### Hook:
"How do you know if your component works with different props, states, and edge cases? Let me show you React Cosmos - it's like Storybook but simpler and perfect for testing components in isolation!"

### Live Cosmos Demo (3 min):

**Show Component in Isolation:**
```tsx
// ExpenseCard.fixture.tsx
import { ExpenseCard } from './ExpenseCard';

export default {
  'Default': () => <ExpenseCard expense={mockExpense} />,
  'High Amount': () => <ExpenseCard expense={{...mockExpense, amount: 999}} />,
  'Long Description': () => <ExpenseCard expense={{...mockExpense, description: 'Very long...'}} />,
  'With Actions': () => <ExpenseCard expense={mockExpense} onEdit={console.log} onDelete={console.log} />
};
```

**Benefits Demonstrated:**
- Test component variations without running full app
- See all states side-by-side
- Develop UI components before backend is ready
- Perfect for team collaboration

### Why Component Testing Matters (2 min):
- Catch UI bugs early in development
- Document component behavior visually
- Speed up development with hot reloading
- Build reliable component libraries

## LECTURE: Component Isolation with React Cosmos (10 minutes)

### What is React Cosmos? (3 minutes)

**Component Development Platform:**
- Sandbox for building React components in isolation
- Visual testing tool for different component states
- Living documentation of your component library
- Simpler alternative to Storybook

**Installation & Setup:**
```bash
npm install --save-dev react-cosmos

# Add to package.json scripts:
"cosmos": "cosmos",
"cosmos:export": "cosmos-export"
```

### Creating Fixtures (4 minutes)

**Basic Fixture Structure:**
```tsx
// Button.fixture.tsx
import { Button } from './Button';

export default {
  'Primary': () => <Button variant="primary">Click Me</Button>,
  'Secondary': () => <Button variant="secondary">Cancel</Button>,
  'Disabled': () => <Button disabled>Disabled</Button>,
  'Loading': () => <Button loading>Loading...</Button>
};
```

**Advanced Fixtures with Props:**
```tsx
// ExpenseCard.fixture.tsx
import { ExpenseCard } from './ExpenseCard';
import { useValue } from 'react-cosmos/client';

export default () => {
  const [amount] = useValue('amount', { defaultValue: 50 });
  const [category] = useValue('category', { 
    defaultValue: 'Food',
    options: ['Food', 'Transport', 'Entertainment']
  });
  
  return (
    <ExpenseCard 
      expense={{ 
        id: 1, 
        amount, 
        category,
        description: 'Sample expense'
      }} 
    />
  );
};
```

### Benefits for Teams (3 minutes)

**Development Workflow:**
- Build components before integration
- Test edge cases visually
- Share component library with team
- Document component API through fixtures

## TAILWIND CSS FUNDAMENTALS (10 minutes)

### Utility-First Philosophy (3 minutes)

**Traditional CSS vs Tailwind:**
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

**Core Utility Classes:**
- **Layout:** `flex`, `grid`, `block`, `inline`
- **Spacing:** `p-4`, `m-2`, `space-x-4`
- **Typography:** `text-lg`, `font-bold`, `text-center`
- **Colors:** `bg-blue-500`, `text-gray-700`, `border-red-400`
- **Effects:** `shadow-md`, `rounded-lg`, `opacity-75`

### Responsive Design (4 minutes)

**Mobile-First Breakpoints:**
```jsx
// Responsive card that stacks on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Content A</div>
  <div className="w-full md:w-1/2">Content B</div>
</div>

// Breakpoint prefixes:
// sm: (640px+)  md: (768px+)  lg: (1024px+)  xl: (1280px+)
```

### State Variants (3 minutes)

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
```

## I DO: Creating Component Fixtures (10 minutes)

### Step 1: Install and Configure Cosmos:

```bash
# Install React Cosmos
npm install --save-dev react-cosmos

# Create cosmos.config.json
{
  "staticPath": "public",
  "watchDirs": ["src"],
  "userDepsFilePath": "src/cosmos.userdeps.js"
}
```

### Step 2: Create Your First Fixture:

```tsx
// src/components/ExpenseCard.fixture.tsx
import { ExpenseCard } from './ExpenseCard';

// Simple fixture with multiple states
export default {
  'Default': () => (
    <ExpenseCard 
      expense={{
        id: 1,
        amount: 45.99,
        category: 'Food',
        description: 'Lunch at cafe',
        date: new Date().toISOString()
      }}
    />
  ),
  
  'High Amount Warning': () => (
    <ExpenseCard 
      expense={{
        id: 2,
        amount: 250.00,
        category: 'Entertainment',
        description: 'Concert tickets',
        date: new Date().toISOString()
      }}
    />
  ),
  
  'With Actions': () => (
    <ExpenseCard 
      expense={{
        id: 3,
        amount: 75.50,
        category: 'Transport',
        description: 'Monthly metro pass',
        date: new Date().toISOString()
      }}
      onEdit={(exp) => console.log('Edit:', exp)}
      onDelete={(id) => console.log('Delete:', id)}
    />
  )
};

### Step 3: Interactive Fixtures with Controls:

```tsx
// Button.fixture.tsx with interactive controls
import { Button } from './Button';
import { useValue, useSelect } from 'react-cosmos/client';

export default () => {
  const [text] = useValue('text', { defaultValue: 'Click Me' });
  const [variant] = useSelect('variant', {
    defaultValue: 'primary',
    options: ['primary', 'secondary', 'danger']
  });
  const [size] = useSelect('size', {
    defaultValue: 'md',
    options: ['sm', 'md', 'lg']
  });
  const [disabled] = useValue('disabled', { defaultValue: false });
  
  return (
    <Button 
      variant={variant} 
      size={size} 
      disabled={disabled}
      onClick={() => console.log('Button clicked!')}
    >
      {text}
    </Button>
  );
};
```

### Running Cosmos:

```bash
# Add to package.json scripts
"scripts": {
  "cosmos": "cosmos",
  "cosmos:export": "cosmos-export"
}

# Run Cosmos
npm run cosmos
# Opens at http://localhost:5000
```

## TAILWIND STYLING DEMO (10 minutes)

### Transform ExpenseCard with Tailwind:

```tsx
// ExpenseCard.tsx with full Tailwind styling
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

## YOU DO: Create Fixtures & Style Components (15 minutes)

### Tasks:
1. **Create Cosmos Fixtures for Your Components:**
   - Create ExpenseForm.fixture.tsx with empty, filled, and error states
   - Create ExpenseList.fixture.tsx with 0, 1, and many items
   - Test edge cases (long text, large numbers)

2. **Apply Tailwind Styling:**
   - Style form inputs with hover and focus states
   - Create responsive grid layout for expense cards
   - Add loading and empty states with Tailwind

3. **Combine Cosmos + Tailwind:**
   - Use fixtures to test responsive breakpoints
   - Verify dark mode support in Cosmos
   - Test component accessibility with different states

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

## TEAM PROJECT: Component Library with Cosmos & Tailwind (30 minutes)

### Part 1: Set Up Cosmos for Team Components:

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