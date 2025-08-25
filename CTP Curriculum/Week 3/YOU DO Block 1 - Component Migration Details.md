# YOU DO Block 1: Component Migration - Detailed Guide

## Overview
Duration: 15 minutes  
Learning Target: Students convert their React components to TypeScript, gaining hands-on experience with type annotations

## Pre-Activity Setup

### Student Checklist
- Working React components from Week 2
- TypeScript configured in project (tsconfig.json)
- VS Code showing TypeScript errors
- Understanding of basic types from I DO Block 1

### Migration Order (Recommended)
1. Simple components first (Header, ExpenseSummary)
2. Components with props (ExpenseCard)
3. Components with state (ExpenseList, ExpenseForm)
4. Complex components with both

## Part 1: Preparation Steps (2 minutes)

### Step 1: Install TypeScript Dependencies

```bash
# If not already installed
npm install --save-dev typescript @types/react @types/react-dom
```

### Step 2: Rename Files

```bash
# Start with one component at a time
mv src/components/Header/Header.jsx src/components/Header/Header.tsx
mv src/components/ExpenseSummary/ExpenseSummary.jsx src/components/ExpenseSummary/ExpenseSummary.tsx
```

### Step 3: Create Types Directory

```bash
mkdir src/types
touch src/types/index.ts
touch src/types/expense.ts
```

## Part 2: Define Core Types (3 minutes)

### Create Shared Type Definitions

```typescript
// src/types/expense.ts
export interface Expense {
  id: number;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // ISO date string
}

export type ExpenseCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Shopping'
  | 'Bills'
  | 'Other';

// Utility type for creating expenses (no ID yet)
export type NewExpense = Omit<Expense, 'id'>;

// For partial updates
export type ExpenseUpdate = Partial<Expense> & { id: number };

// For summary calculations
export interface ExpenseSummaryData {
  total: number;
  count: number;
  average: number;
  byCategory: Record<ExpenseCategory, number>;
}
```

```typescript
// src/types/index.ts
export * from './expense';

// Add other shared types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Budget {
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  categories?: Partial<Record<ExpenseCategory, number>>;
}
```

## Part 3: Migrate Simple Components (5 minutes)

### Header Component Migration

```typescript
// src/components/Header/Header.tsx
import React from 'react';
import './Header.css';

interface HeaderProps {
  userName?: string;
  title?: string;
  onLogout?: () => void;
  onNavigate?: (route: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = 'Guest',
  title = 'Expense Tracker',
  onLogout,
  onNavigate
}) => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const navItems: Array<{ label: string; route: string }> = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Reports', route: '/reports' },
    { label: 'Settings', route: '/settings' }
  ];

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">{title}</h1>
          <p className="app-tagline">Track your spending, reach your goals</p>
        </div>
        
        <div className="header-right">
          <p className="user-greeting">
            {getGreeting()}, {userName}!
          </p>
          
          <nav className="header-nav">
            {navItems.map(item => (
              <button 
                key={item.route}
                className="nav-button"
                onClick={() => onNavigate?.(item.route)}
              >
                {item.label}
              </button>
            ))}
            
            {onLogout && (
              <button 
                className="nav-button logout-button"
                onClick={onLogout}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### ExpenseSummary Component Migration

```typescript
// src/components/ExpenseSummary/ExpenseSummary.tsx
import React from 'react';
import { Expense, ExpenseCategory } from '../../types';
import './ExpenseSummary.css';

interface ExpenseSummaryProps {
  expenses: Expense[];
  budget?: number;
  onCategoryClick?: (category: ExpenseCategory) => void;
}

interface SummaryCard {
  label: string;
  value: string | number;
  type: 'currency' | 'number' | 'percentage';
  status?: 'good' | 'warning' | 'danger';
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ 
  expenses = [],
  budget = 0,
  onCategoryClick
}) => {
  // Calculate statistics with proper typing
  const calculateStats = (): SummaryCard[] => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;
    
    const cards: SummaryCard[] = [
      {
        label: 'Total Spent',
        value: total,
        type: 'currency'
      },
      {
        label: 'Expenses',
        value: count,
        type: 'number'
      },
      {
        label: 'Average',
        value: average,
        type: 'currency'
      }
    ];

    // Add budget card if budget is provided
    if (budget > 0) {
      const remaining = budget - total;
      const percentUsed = (total / budget) * 100;
      
      cards.push({
        label: 'Budget Remaining',
        value: remaining,
        type: 'currency',
        status: remaining < 0 ? 'danger' : remaining < budget * 0.2 ? 'warning' : 'good'
      });
    }

    return cards;
  };

  // Calculate spending by category
  const categoryBreakdown = expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const formatValue = (card: SummaryCard): string => {
    switch (card.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(card.value as number);
      case 'percentage':
        return `${(card.value as number).toFixed(1)}%`;
      default:
        return String(card.value);
    }
  };

  const summaryCards = calculateStats();

  return (
    <div className="expense-summary">
      <div className="summary-cards">
        {summaryCards.map((card, index) => (
          <div 
            key={index}
            className={`summary-card ${card.status ? `status-${card.status}` : ''}`}
          >
            <h3 className="summary-label">{card.label}</h3>
            <p className="summary-value">{formatValue(card)}</p>
          </div>
        ))}
      </div>

      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="category-breakdown">
          <h3>Spending by Category</h3>
          <div className="category-list">
            {Object.entries(categoryBreakdown).map(([category, amount]) => (
              <button
                key={category}
                className="category-item"
                onClick={() => onCategoryClick?.(category as ExpenseCategory)}
              >
                <span className="category-name">{category}</span>
                <span className="category-amount">
                  ${amount.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSummary;
```

## Part 4: Migrate Components with State (5 minutes)

### ExpenseForm Component Migration

```typescript
// src/components/ExpenseForm/ExpenseForm.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { NewExpense, ExpenseCategory } from '../../types';
import './ExpenseForm.css';

interface ExpenseFormProps {
  onSubmit: (expense: NewExpense) => void;
  categories?: ExpenseCategory[];
  initialData?: Partial<NewExpense>;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  onSubmit,
  categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Other'],
  initialData
}) => {
  // Form state with proper typing
  const [formData, setFormData] = useState<NewExpense>({
    amount: initialData?.amount || 0,
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Type-safe input change handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validation with typed return
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 100) {
      newErrors.description = 'Description must be less than 100 characters';
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    if (selectedDate > today) {
      newErrors.date = 'Date cannot be in the future';
    }

    return newErrors;
  };

  // Form submission with proper event typing
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        amount: 0,
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      setErrors({});
    } catch (error) {
      setErrors({ 
        amount: 'Failed to add expense. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Add New Expense</h3>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="amount">
            Amount <span className="required">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            className={errors.amount ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.amount && (
            <span className="error-message">{errors.amount}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            maxLength={100}
            className={errors.description ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
          <span className="character-count">
            {formData.description.length}/100
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="date">
            Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={errors.date ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.date && (
            <span className="error-message">{errors.date}</span>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
```

## Common Migration Patterns

### Pattern 1: Event Handler Types

```typescript
// Input events
onChange: (e: ChangeEvent<HTMLInputElement>) => void
onChange: (e: ChangeEvent<HTMLSelectElement>) => void
onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void

// Form events
onSubmit: (e: FormEvent<HTMLFormElement>) => void

// Mouse events
onClick: (e: MouseEvent<HTMLButtonElement>) => void
onMouseEnter: (e: MouseEvent<HTMLDivElement>) => void

// Keyboard events
onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
```

### Pattern 2: State Types

```typescript
// Simple state
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>('');

// Complex state
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<Item[]>([]);

// Union type state
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
```

### Pattern 3: Props with Children

```typescript
interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}
```

## Troubleshooting Guide

### Common TypeScript Errors and Fixes

1. **Cannot find module './Component.css'**
```typescript
// Add to src/types/global.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
```

2. **Parameter implicitly has an 'any' type**
```typescript
// Bad
const handleClick = (e) => { }

// Good
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { }
```

3. **Type 'undefined' is not assignable to type 'string'**
```typescript
// Use optional chaining and defaults
const value = props.text ?? 'default';

// Or conditional rendering
{props.text && <p>{props.text}</p>}
```

4. **Property does not exist on type**
```typescript
// Make sure interface includes all properties
interface Props {
  title: string;
  // Add missing property
  subtitle?: string;
}
```

## Success Checklist

### Per Component:
- [ ] File renamed to .tsx
- [ ] Props interface defined
- [ ] State types added
- [ ] Event handlers typed
- [ ] No TypeScript errors
- [ ] IntelliSense working

### Overall:
- [ ] Shared types created
- [ ] All components migrated
- [ ] App still runs correctly
- [ ] No `any` types (unless justified)
- [ ] Props documented with interfaces

## Tips for Success

1. **Start Small**: Migrate simplest components first
2. **Use IntelliSense**: Let VS Code help with types
3. **Read Errors Carefully**: TypeScript errors are descriptive
4. **Don't Over-Type**: Let inference work where possible
5. **Test as You Go**: Ensure functionality isn't broken

## Extension Challenges

For students who finish early:

1. **Add JSDoc Comments**
```typescript
/**
 * Displays a summary of expense statistics
 * @param expenses - Array of expense objects
 * @param budget - Optional monthly budget
 * @param onCategoryClick - Callback when category is clicked
 */
```

2. **Create Type Guards**
```typescript
function isExpense(obj: any): obj is Expense {
  return (
    typeof obj.id === 'number' &&
    typeof obj.amount === 'number' &&
    typeof obj.category === 'string'
  );
}
```

3. **Use Generics**
```typescript
function useLocalState<T>(key: string, initialValue: T) {
  // Implementation
}
```