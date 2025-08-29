# Individual Project Week 3: Adding TypeScript

## Overview
Duration: 25 minutes  
Learning Target: Add TypeScript to your React expense tracker for type safety

## Prerequisites
- Completed Week 2 (React expense tracker)
- Working React components
- Basic understanding of JavaScript types

## Learning Goals
- Understand TypeScript benefits
- Add TypeScript to React project
- Define types and interfaces
- Type React components and props

## Part 1: TypeScript Setup (5 minutes)

### Add TypeScript to Existing React App
```bash
# In your expense-tracker-react directory
npm install --save typescript @types/node @types/react @types/react-dom

# Rename files from .js to .tsx
mv src/App.js src/App.tsx
mv src/components/ExpenseForm.js src/components/ExpenseForm.tsx
mv src/components/ExpenseList.js src/components/ExpenseList.tsx

# Start the app (it will create tsconfig.json)
npm start
```

### Project Structure Update
```
expense-tracker-react/
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── ExpenseForm.tsx
│   │   └── ExpenseList.tsx
│   └── types/
│       └── Expense.ts
├── tsconfig.json
└── package.json
```

## Part 2: Define Your Types (10 minutes)

### Create Type Definitions
```typescript
// src/types/Expense.ts

// TODO: Define the Expense interface with properties:
// - id (number)
// - amount (number)
// - description (string)
// - category (Category type)
// - date (string)

// TODO: Define Category as a union type
// Include: 'food' | 'transport' | 'entertainment' | 'bills' | 'other'

// TODO: Define ExpenseFormData interface
// Think: How is this different from Expense?
```

### Why Use Interfaces?
- Catch errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Refactoring safety

## Part 3: Type Your Components (10 minutes)

### Type the App Component
```typescript
// src/App.tsx
import React, { useState } from 'react';
// TODO: Import your Expense type
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  // TODO: Add type to the useState for expenses array
  // Hint: useState<Type[]>([])
  const [expenses, setExpenses] = useState([]);
  
  // TODO: Add parameter and return types to addExpense
  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };
  
  // TODO: Add parameter and return types to deleteExpense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  return (
    <div className="App">
      <h1>💰 Expense Tracker</h1>
      <ExpenseForm onAddExpense={addExpense} />
      <ExpenseList 
        expenses={expenses} 
        onDeleteExpense={deleteExpense} 
      />
    </div>
  );
}

export default App;
```

### Type the ExpenseForm Component
```typescript
// src/components/ExpenseForm.tsx
import React, { useState } from 'react';
// TODO: Import FormEvent and ChangeEvent types from React
// TODO: Import your Expense and Category types

// TODO: Define ExpenseFormProps interface
// What props does this component receive?

function ExpenseForm(/* TODO: Add props with type */) {
  // TODO: Add types to all state variables
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  
  // TODO: Add parameter and return type
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Create newExpense with proper type
    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toLocaleDateString()
    };
    
    onAddExpense(newExpense);
    
    // Reset form
    setAmount('');
    setDescription('');
    setCategory('food');
  };
  
  // TODO: Add parameter and return type for change handlers
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  
  // Return JSX...
}
```

### Type the ExpenseList Component
```typescript
// src/components/ExpenseList.tsx
import React from 'react';
// TODO: Import your Expense type

// TODO: Define ExpenseListProps interface
// What props does this component receive?

function ExpenseList(/* TODO: Add props with type */) {
  // TODO: Add type to the total calculation
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount, 
    0
  );
  
  return (
    <div className="expense-list">
      <h2>Your Expenses</h2>
      <div className="total">
        Total: ${total.toFixed(2)}
      </div>
      
      {/* TODO: Add type to the expense parameter in map */}
      {expenses.map((expense) => (
        <div key={expense.id} className="expense-item">
          <div>
            <strong>{expense.description}</strong>
            <small>{expense.category} - {expense.date}</small>
          </div>
          <div>
            ${expense.amount.toFixed(2)}
            <button onClick={() => onDeleteExpense(expense.id)}>
              ❌
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
```

## Part 4: Advanced TypeScript Features

### Utility Types
```typescript
// Make all properties optional
type PartialExpense = Partial<Expense>;

// Make all properties required
type RequiredExpense = Required<Expense>;

// Pick only certain properties
type ExpensePreview = Pick<Expense, 'description' | 'amount'>;

// Omit certain properties
type ExpenseWithoutId = Omit<Expense, 'id'>;
```

### Generic Components
```typescript
// A reusable list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
```

### Type Guards
```typescript
// Check if a value is an Expense
function isExpense(value: any): value is Expense {
  return (
    typeof value.id === 'number' &&
    typeof value.amount === 'number' &&
    typeof value.description === 'string'
  );
}

// Use it
if (isExpense(data)) {
  // TypeScript knows data is an Expense here
  console.log(data.amount);
}
```

## Part 5: TypeScript Best Practices

### Strict Mode Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Common Type Patterns
```typescript
// Union types for multiple possibilities
type Status = 'pending' | 'completed' | 'failed';

// Const assertions for literal types
const CATEGORIES = ['food', 'transport', 'bills'] as const;
type Category = typeof CATEGORIES[number];

// Function types
type CalculateTotal = (expenses: Expense[]) => number;

// Optional properties
interface User {
  name: string;
  email?: string; // Optional
}
```

## Part 6: Documentation Updates (5 minutes)

### Update Your README
Add to your README.md:
```markdown
## Week 3 Progress
[TODO: Document TypeScript integration]
- [ ] Added TypeScript to project
- [ ] Created type definitions for...
- [ ] Typed all components
- [ ] Benefits observed:
- [ ] Challenges encountered:

## Type Safety Statistics
[TODO: Track your progress]
- Components typed: X/Y
- Type errors fixed: X
- Any types remaining: X

## Updated Architecture
[TODO: Document how TypeScript changed your architecture]
```

### Create ADR-003: TypeScript Adoption
Create: `docs/decisions/ADR-003-typescript-adoption.md`

```markdown
# ADR-003: TypeScript Adoption

## Status
[TODO: Accepted/Proposed]

## Context
[TODO: Why add TypeScript to your React project?]
Consider:
- What bugs could TypeScript prevent?
- What development experience improvements?
- Why now and not from the start?

## Decision
[TODO: Explain your TypeScript strategy]
- Strict mode or gradual?
- How will you handle third-party libraries?

## Consequences
**Positive:**
[TODO: Benefits you're experiencing]

**Negative:**
[TODO: Challenges you're facing]

## Migration Strategy
[TODO: How are you converting JS to TS?]
- File by file?
- Component by component?
- All at once?

## Type Coverage Goals
[TODO: What's your target?]
- 100% type coverage?
- Allow some 'any' types?
```

### Update User Stories
Update: `docs/planning/user-stories.md`
```markdown
## Week 3 Technical Improvements
[TODO: Document technical debt addressed]
- [ ] All user inputs are type-safe
- [ ] Component props are validated
- [ ] Data models are well-defined

## Developer Experience Improvements
[TODO: How has TypeScript helped?]
- Autocomplete works for...
- Caught these bugs at compile time...
- Refactoring is easier because...
```

### Update Technical Roadmap
Update: `docs/planning/roadmap.md`
```markdown
### Week 3: [TODO: Update with your focus]
[TODO: Track your TypeScript progress]
- [ ] [Your planned Week 3 tasks]
- [ ] [What did you complete?]
- [ ] [What was harder than expected?]

### Technical Debt Log
[TODO: Start tracking technical debt]
- [ ] [What shortcuts did you take?]
- [ ] [What needs refactoring?]
- [ ] [What would you do differently?]

### Architecture Evolution
[TODO: Document how your project has evolved]
- Week 1: [What did you build?]
- Week 2: [How did it change?]
- Week 3: [Current state?]
```

### Create Architecture Diagram
Create: `docs/technical/architecture.md`
```markdown
# Architecture Overview

## Current Stack (Week 3)
[TODO: Document your current architecture]

```
┌─────────────────┐
│   TypeScript    │
├─────────────────┤
│     React       │
├─────────────────┤
│   Components    │
│  - ExpenseForm  │
│  - ExpenseList  │
│  - [TODO: Add]  │
├─────────────────┤
│     State       │
│   useState()    │
├─────────────────┤
│   Data Types    │
│  - Expense      │
│  - Category     │
│  - [TODO: Add]  │
└─────────────────┘
```

## Data Flow
[TODO: Document how data flows through your app]

## Component Hierarchy
[TODO: Show parent-child relationships]
```

## Week 3 Checklist
- [ ] TypeScript installed and configured
- [ ] All components converted to .tsx
- [ ] Types/interfaces defined
- [ ] Props properly typed
- [ ] State properly typed
- [ ] Event handlers typed
- [ ] No TypeScript errors
- [ ] Autocomplete working in IDE

## Common TypeScript Errors

### "Property does not exist on type"
```typescript
// Problem
const value = e.target.value; // Error!

// Solution - Type the event
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value; // Works!
};
```

### "Type 'X' is not assignable to type 'Y'"
```typescript
// Problem
const [amount, setAmount] = useState<number>(''); // Error!

// Solution - Match types
const [amount, setAmount] = useState<string>(''); // Correct
```

### "Object is possibly 'undefined'"
```typescript
// Problem
const first = expenses[0].amount; // Could be undefined

// Solution - Check first
const first = expenses[0]?.amount ?? 0;
```

## Debugging TypeScript
```typescript
// Check types in VS Code
// Hover over variables to see types

// Use type assertions carefully
const element = document.getElementById('myId') as HTMLInputElement;

// Console log types (dev only)
console.log('Type of expense:', typeof expense);
```

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [DefinitelyTyped](https://definitelytyped.org/) - Types for libraries

## Project Status After Week 3
You now have:
- ✅ HTML/CSS foundation (Week 1)
- ✅ React components and state (Week 2)
- ✅ TypeScript type safety (Week 3)

## Next Steps
Week 4+: Consider adding:
- React Router for navigation
- Context API or Redux for state
- API integration
- Testing with Jest
- Deployment to Vercel/Netlify

## Remember
- TypeScript is a tool to help you
- Start simple, add types gradually
- Use 'any' sparingly (defeats the purpose)
- The goal is fewer bugs, not perfect types!