# I DO Block 1: React + TypeScript Patterns Demo - Detailed Guide

## Overview
Duration: 20 minutes  
Learning Target: Demonstrate converting React components to TypeScript with professional patterns

## Pre-Demo Setup

### Environment Check
- Ensure TypeScript is installed in project
- VS Code TypeScript IntelliSense working
- React Developer Tools showing component props
- TypeScript errors visible in terminal

### Key Messages to Convey
- TypeScript prevents entire categories of bugs
- Types are self-documenting code
- Start simple, add complexity gradually
- The compiler is your friend, not your enemy

## Part 1: TypeScript Setup & Configuration (3 minutes)

### Step 1: Show TypeScript Config (1 min)

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Think-Aloud Points:**
- "strict: true enables all strict type checking"
- "This catches more bugs but requires more explicit types"
- "noUnusedLocals helps keep code clean"

### Step 2: File Extensions & Basic Types (2 min)

```bash
# Rename files
mv ExpenseCard.jsx ExpenseCard.tsx
mv ExpenseList.jsx ExpenseList.tsx
```

Show basic TypeScript types:
```typescript
// Basic types
let count: number = 0;
let message: string = "Hello";
let isActive: boolean = true;
let items: string[] = ["a", "b", "c"];

// Union types
let id: string | number = "abc123";

// Type aliases
type Category = 'Food' | 'Transport' | 'Entertainment' | 'Other';

// Interfaces
interface User {
  id: number;
  name: string;
  email: string;
}
```

## Part 2: Convert ExpenseCard to TypeScript (10 minutes)

### Step 1: Define the Expense Interface (2 min)

```typescript
// types/expense.ts - Create shared types file
export interface Expense {
  id: number;
  amount: number;
  category: 'Food' | 'Transport' | 'Entertainment' | 'Other';
  description: string;
  date: string; // ISO date string
}

// You can also create type aliases for specific fields
export type ExpenseCategory = Expense['category'];

// Utility type for creating new expenses (without ID)
export type NewExpense = Omit<Expense, 'id'>;

// Type for expense updates  
export type ExpenseUpdate = Partial<Expense> & { id: number };
```

**Think-Aloud Points:**
- "Single source of truth for data shapes"
- "Union types for categories ensure only valid values"
- "Utility types (Omit, Partial) reduce duplication"

### Step 2: Type the ExpenseCard Component (4 min)

```typescript
// ExpenseCard.tsx
import React from 'react';
import { Expense } from '../../types/expense';
import './ExpenseCard.css';

// Define component props interface
interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: number) => void;
  onEdit?: (expense: Expense) => void;
  highlighted?: boolean;
  className?: string;
}

// React.FC provides children prop and return type
const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  onDelete, 
  onEdit,
  highlighted = false,
  className = ''
}) => {
  // TypeScript infers these are strings
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(expense.amount);

  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Type-safe category styling
  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
      'Food': '#10B981',
      'Transport': '#3B82F6', 
      'Entertainment': '#8B5CF6',
      'Other': '#6B7280'
    };
    return colors[category];
  };

  // Typed event handlers
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.(expense.id); // Optional chaining
  };

  const handleClick = () => {
    onEdit?.(expense);
  };

  // Determine amount severity for styling
  const getAmountClass = (): string => {
    if (expense.amount > 100) return 'expense-high';
    if (expense.amount > 50) return 'expense-medium';
    return 'expense-low';
  };

  return (
    <article 
      className={`expense-card ${highlighted ? 'highlighted' : ''} ${className}`}
      onClick={onEdit ? handleClick : undefined}
      style={{ cursor: onEdit ? 'pointer' : 'default' }}
    >
      <div className="expense-header">
        <span 
          className="expense-category"
          style={{ backgroundColor: getCategoryColor(expense.category) }}
        >
          {expense.category}
        </span>
        <time className="expense-date" dateTime={expense.date}>
          {formattedDate}
        </time>
      </div>
      
      <div className="expense-body">
        <p className="expense-description">
          {expense.description}
        </p>
        <p className={`expense-amount ${getAmountClass()}`}>
          {formattedAmount}
        </p>
      </div>

      {onDelete && (
        <button 
          className="expense-delete"
          onClick={handleDelete}
          aria-label={`Delete expense: ${expense.description}`}
          type="button"
        >
          ×
        </button>
      )}
    </article>
  );
};

export default ExpenseCard;
```

**Key Teaching Points:**
- Interface for props provides IntelliSense
- Optional props with `?` 
- Event types for handlers (React.MouseEvent)
- Record type for category colors mapping
- Optional chaining for callbacks

### Step 3: Show TypeScript Benefits (4 min)

Demonstrate these TypeScript catches:

```typescript
// ❌ TypeScript Error Examples

// 1. Wrong prop type
<ExpenseCard 
  expense={{
    id: "123", // Error: Type 'string' is not assignable to type 'number'
    amount: 50,
    category: "Groceries", // Error: Type '"Groceries"' is not assignable
    description: "Shopping",
    date: "2024-01-15"
  }}
/>

// 2. Missing required props
<ExpenseCard /> // Error: Property 'expense' is missing

// 3. Typo in property name
<ExpenseCard 
  expense={{
    id: 1,
    ammount: 50, // Error: 'ammount' does not exist
    category: "Food",
    description: "Lunch",
    date: "2024-01-15"
  }}
/>

// 4. Wrong event handler signature
<ExpenseCard 
  expense={validExpense}
  onDelete={(expense) => { }} // Error: Expected (id: number) => void
/>
```

Show IntelliSense benefits:
- Hover over props to see types
- Autocomplete for category values
- Function parameter hints
- Go to definition for interfaces

## Part 3: Convert ExpenseList with Generic State (10 minutes)

### Step 1: Complex State and Props Typing (5 min)

```typescript
// ExpenseList.tsx
import React, { useState, useMemo, useCallback } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import { Expense, ExpenseCategory, NewExpense } from '../../types/expense';
import './ExpenseList.css';

// Type alias for filter options
type FilterOption = ExpenseCategory | 'All';

// Sort configuration type
interface SortConfig {
  key: keyof Expense;
  direction: 'asc' | 'desc';
}

// Component props
interface ExpenseListProps {
  initialExpenses?: Expense[];
  onExpenseChange?: (expenses: Expense[]) => void;
  budget?: number;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  initialExpenses = [],
  onExpenseChange,
  budget
}) => {
  // Typed state - TypeScript infers types from initial values
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<FilterOption>('All');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Type-safe expense operations
  const addExpense = useCallback((newExpense: NewExpense): void => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now()
    };
    
    setExpenses(prev => {
      const updated = [...prev, expense];
      onExpenseChange?.(updated);
      return updated;
    });
  }, [onExpenseChange]);

  const deleteExpense = useCallback((id: number): void => {
    setExpenses(prev => {
      const updated = prev.filter(exp => exp.id !== id);
      onExpenseChange?.(updated);
      return updated;
    });
  }, [onExpenseChange]);

  const updateExpense = useCallback((updatedExpense: Expense): void => {
    setExpenses(prev => {
      const updated = prev.map(exp => 
        exp.id === updatedExpense.id ? updatedExpense : exp
      );
      onExpenseChange?.(updated);
      return updated;
    });
  }, [onExpenseChange]);

  // Memoized computations with proper typing
  const { filteredExpenses, totalAmount, categories } = useMemo(() => {
    // Filter expenses
    let filtered = expenses;
    
    if (filter !== 'All') {
      filtered = filtered.filter(exp => exp.category === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(exp => 
        exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort expenses
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Type guard for date comparison
      if (sortConfig.key === 'date') {
        const aTime = new Date(aValue as string).getTime();
        const bTime = new Date(bValue as string).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      }
      
      // Type guard for number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      return sortConfig.direction === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    // Calculate total
    const total = sorted.reduce((sum, exp) => sum + exp.amount, 0);

    // Get unique categories
    const uniqueCategories = Array.from(
      new Set(expenses.map(exp => exp.category))
    );

    return {
      filteredExpenses: sorted,
      totalAmount: total,
      categories: uniqueCategories
    };
  }, [expenses, filter, sortConfig, searchTerm]);

  // Type-safe sort handler
  const handleSort = (key: keyof Expense) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calculate budget status if budget provided
  const budgetStatus = budget 
    ? {
        used: totalAmount,
        remaining: budget - totalAmount,
        percentage: (totalAmount / budget) * 100,
        isOverBudget: totalAmount > budget
      }
    : null;

  return (
    <div className="expense-list-container">
      {/* Search and filter controls */}
      <div className="expense-controls">
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
          className="filter-select"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Summary section */}
      <div className="expense-summary">
        <h2>
          Total: {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(totalAmount)}
        </h2>
        <p>{filteredExpenses.length} expenses</p>
        
        {budgetStatus && (
          <div className={`budget-status ${budgetStatus.isOverBudget ? 'over-budget' : ''}`}>
            <p>Budget: ${budget.toFixed(2)}</p>
            <p>Remaining: ${budgetStatus.remaining.toFixed(2)}</p>
            <div className="budget-bar">
              <div 
                className="budget-progress"
                style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add expense form */}
      <ExpenseForm onSubmit={addExpense} categories={categories} />

      {/* Sort controls */}
      <div className="sort-controls">
        <button 
          onClick={() => handleSort('date')}
          className={sortConfig.key === 'date' ? 'active' : ''}
        >
          Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          onClick={() => handleSort('amount')}
          className={sortConfig.key === 'amount' ? 'active' : ''}
        >
          Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
        <button 
          onClick={() => handleSort('category')}
          className={sortConfig.key === 'category' ? 'active' : ''}
        >
          Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      {/* Expense items */}
      <div className="expense-items">
        {filteredExpenses.length === 0 ? (
          <p className="no-expenses">
            {searchTerm ? 'No expenses match your search.' : 'No expenses yet. Add your first expense!'}
          </p>
        ) : (
          filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={deleteExpense}
              onEdit={updateExpense}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
```

### Step 2: Show Advanced TypeScript Patterns (5 min)

```typescript
// Advanced patterns to demonstrate

// 1. Generic constraints for reusable logic
function sortItems<T extends { date: string }>(
  items: T[], 
  direction: 'asc' | 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return direction === 'asc' ? aTime - bTime : bTime - aTime;
  });
}

// 2. Type guards
function isExpense(item: any): item is Expense {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'number' &&
    typeof item.amount === 'number' &&
    ['Food', 'Transport', 'Entertainment', 'Other'].includes(item.category)
  );
}

// 3. Discriminated unions for state management
type ExpenseState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Expense[] }
  | { status: 'error'; error: string };

// Usage with type narrowing
function renderExpenses(state: ExpenseState) {
  switch (state.status) {
    case 'idle':
      return <p>Ready to load expenses</p>;
    case 'loading':
      return <p>Loading...</p>;
    case 'success':
      return <ExpenseList initialExpenses={state.data} />;
    case 'error':
      return <p>Error: {state.error}</p>;
  }
}

// 4. Utility types for forms
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

type ExpenseFormState = {
  [K in keyof NewExpense]: FormField<NewExpense[K]>;
};
```

## Key Teaching Points Throughout Demo

### TypeScript Benefits to Emphasize

1. **Catch Errors at Compile Time**
   - Show red squiggles in VS Code
   - Demonstrate fixing a type error
   - "This would have been a runtime bug"

2. **Incredible IDE Support**
   - Autocomplete for props
   - Go to definition
   - Refactoring with confidence
   - Hover for type information

3. **Self-Documenting Code**
   - Interfaces show component contracts
   - No need to guess prop types
   - Team members understand code faster

4. **Refactoring Safety**
   - Change an interface, see all broken usages
   - Rename properties across codebase
   - Add new required props safely

### Common Patterns to Highlight

```typescript
// Optional props with defaults
interface Props {
  title?: string;
  count?: number;
}

const Component: React.FC<Props> = ({ 
  title = 'Default Title',
  count = 0 
}) => { };

// Children prop typing
interface Props {
  children: React.ReactNode;
}

// Event handler typing
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// State with union types
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
```

## Common Student Questions

### Q: "Do I need to type everything?"
A: "No! TypeScript has excellent type inference. Only add types where necessary:
- Function parameters
- Complex state
- API responses
- Shared interfaces"

### Q: "React.FC vs regular function?"
A: "Both work! React.FC provides children type but some teams avoid it. Choose consistency."

### Q: "Any vs unknown?"
A: "Use `unknown` when you truly don't know the type. It forces you to check before using. `any` disables all type checking."

### Q: "How do I type children?"
A: "`React.ReactNode` accepts everything renderable: strings, numbers, elements, arrays, null."

## Debugging TypeScript Errors

Show how to read common errors:

```typescript
// Error: Type 'string' is not assignable to type 'number'
// Look at the expected type (number) vs what you provided (string)

// Error: Property 'X' does not exist on type 'Y'  
// You're trying to access a property that's not in the interface

// Error: Cannot find name 'useState'
// Missing import from React

// Error: JSX element type does not have any construct or call signatures
// Usually means you're importing incorrectly
```

## Assessment Checkpoint
By the end, students should understand:
- Basic TypeScript types
- How to create interfaces for props
- How to type state and events  
- Benefits of TypeScript in React
- How to read TypeScript errors

## Transition to YOU DO
"Now it's your turn to add TypeScript to your components. Start with simple types, then add complexity. Remember: the goal is to catch bugs before they happen!"