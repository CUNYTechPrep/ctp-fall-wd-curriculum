# Week 3: TypeScript Integration

---

## Welcome to Type Safety!

### Today's Mission

- 🛡️ Add TypeScript to catch bugs before runtime
- 🏗️ Build type-safe component architecture
- 🚀 Master advanced TypeScript patterns
- 📐 Design team project type systems

> "TypeScript catches errors before your code even runs!"

---

## Why TypeScript Matters

### A Live Demonstration

<div style="display: flex;">
<div style="flex: 1;">

**JavaScript - Bug Ships to Production**
```javascript
function calculateTotal(expenses) {
  return expenses.reduce((total, expense) => {
    return total + expense.ammount; // Typo!
  }, 0);
}

console.log(calculateTotal(userExpenses)); 
// NaN 😱
```

</div>
<div style="flex: 1;">

**TypeScript - Error Caught Immediately**
```typescript
interface Expense {
  amount: number;
  category: string;
}

function calculateTotal(expenses: Expense[]) {
  return expenses.reduce((total, expense) => {
    return total + expense.ammount; 
    // ❌ Property 'ammount' does not exist
  }, 0);
}
```

</div>
</div>

---

## Think-Pair-Share

### Your Debugging Horror Stories (5 min)

**Think:** What bugs have you encountered that better typing could prevent?

**Pair:** Share a debugging horror story

**Share:** Let's collect preventable bug patterns!

---

## Industry Context

### Who Uses TypeScript?
- Microsoft (created it)
- Google (Angular)
- Facebook (parts of React)
- Airbnb, Netflix, Slack, Discord...

**Learning TypeScript = Career Advantage** 🚀

---

# TypeScript Fundamentals

---

## TypeScript Mental Model

### What TypeScript Is

**JavaScript + Type System**

```typescript
// Regular JavaScript
let count = 0;
let message = "Hello";

// TypeScript adds types
let count: number = 0;
let message: string = "Hello";
```

### Key Benefits:
- ✅ Catches errors at compile time
- ✅ Incredible IDE support
- ✅ Self-documenting code
- ✅ Easier refactoring

---

## Basic Types

### The Foundation

```typescript
// Primitives
let count: number = 0;
let message: string = "Hello";
let isActive: boolean = true;
let data: any = "anything"; // Escape hatch - avoid!

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Union types - multiple possibilities
let id: string | number = "abc123";
id = 123; // Also valid!

// Literal types - exact values
let status: "pending" | "success" | "error" = "pending";
```

---

## Interfaces: Defining Shapes

### Your Data Contracts

```typescript
// Define the shape of your data
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional with ?
}

// Use the interface
const user: User = {
  id: 1,
  name: "Sarah",
  email: "sarah@example.com"
  // age is optional
};

// TypeScript ensures correctness
user.name = 123; // ❌ Type 'number' not assignable to 'string'
```

---

## Type Inference

### TypeScript is Smart!

```typescript
// TypeScript infers types when possible
const message = "Hello"; // Knows it's string
const count = 42; // Knows it's number

// Function return types inferred
function add(a: number, b: number) {
  return a + b; // Knows it returns number
}

// Array method inference
const doubled = [1, 2, 3].map(n => n * 2);
// TypeScript knows doubled is number[]
```

### When to Be Explicit:
- Function parameters (always)
- Empty arrays
- Complex state
- API responses

---

# React + TypeScript

---

## Typing React Components

### Props with Interfaces

```typescript
// Define your props interface
interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

// Type your component
const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  variant = "primary",
  disabled = false 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
```

---

## Typing State

### useState with TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  // Simple state - TypeScript infers
  const [count, setCount] = useState(0);
  
  // Complex state - be explicit
  const [user, setUser] = useState<User | null>(null);
  
  // Array state
  const [users, setUsers] = useState<User[]>([]);
  
  // Union type state
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
}
```

---

## Event Handling Types

### Common Event Types

```typescript
// Form submission
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle form
};

// Input changes
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

// Button clicks
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log('Clicked!');
};

// Select changes
const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedValue = e.target.value;
};
```

---

# Live TypeScript Migration

---

## Converting ExpenseCard

### Before: JavaScript

```jsx
function ExpenseCard({ amount, category, description, date }) {
  return (
    <div className="expense-card">
      {/* Component JSX */}
    </div>
  );
}
```

### After: TypeScript

```tsx
interface Expense {
  id: number;
  amount: number;
  category: 'Food' | 'Transport' | 'Entertainment' | 'Other';
  description: string;
  date: string;
}

interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: number) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onDelete }) => {
  // Component implementation
};
```

---

## TypeScript Catches Bugs!

### Real Examples

```typescript
// ❌ Wrong prop type
<ExpenseCard 
  expense={{
    id: "123", // Error: Type 'string' not assignable to 'number'
    amount: 50,
    category: "Groceries", // Error: Not a valid category
    description: "Shopping",
    date: "2024-01-15"
  }}
/>

// ❌ Typo in property
const total = expense.ammount; // Property 'ammount' does not exist

// ❌ Wrong event handler
<button onClick={(expense) => {}}> 
// Error: Expected (e: MouseEvent) => void
```

---

## IntelliSense Magic

### Your New Superpower

**Before TypeScript:**
- Guess property names
- Check documentation
- Console.log to explore

**With TypeScript:**
- Autocomplete everything
- Hover for type info
- Go to definition
- Refactor with confidence

```typescript
// Type "expense." and see all properties!
expense.| // amount, category, date, description, id
```

---

# Advanced TypeScript Patterns

---

## Generic Components

### Write Once, Use Everywhere

```typescript
// Generic Select Component
interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function Select<T extends string | number>({ 
  options, 
  value, 
  onChange 
}: SelectProps<T>) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as T)}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
```

---

## Using Generic Components

### Type Safety with Any Data

```typescript
// String select
const CategorySelect = () => {
  const [category, setCategory] = useState<string>('Food');
  
  return (
    <Select
      options={[
        { value: 'Food', label: '🍔 Food' },
        { value: 'Transport', label: '🚗 Transport' }
      ]}
      value={category}
      onChange={setCategory} // TypeScript ensures string type!
    />
  );
};

// Number select  
const YearSelect = () => {
  const [year, setYear] = useState<number>(2024);
  
  return (
    <Select
      options={yearOptions}
      value={year}
      onChange={setYear} // TypeScript ensures number type!
    />
  );
};
```

---

## Custom Hooks with TypeScript

### Type-Safe Reusable Logic

```typescript
// Generic localStorage hook
function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

---

## Discriminated Unions

### Type-Safe State Machines

```typescript
// API call state
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// TypeScript narrows types in conditionals
function handleState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'idle':
      return <p>Ready to load</p>;
    case 'loading':
      return <p>Loading...</p>;
    case 'success':
      return <p>Data: {state.data}</p>; // TypeScript knows data exists!
    case 'error':
      return <p>Error: {state.error}</p>; // TypeScript knows error exists!
  }
}
```

---

# Your Turn: TypeScript Migration

---

## YOU DO: Component Migration

### Convert Your Components

1. **Rename files:** `.jsx` → `.tsx`
2. **Create interfaces** for props
3. **Type your state** 
4. **Fix TypeScript errors**

```typescript
// Start with this structure
interface HeaderProps {
  userName?: string;
  title?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = 'Guest',
  title = 'Expense Tracker'
}) => {
  // Your implementation
};
```

---

## YOU DO: Advanced Features

### Choose One to Implement

1. **Generic Filter Component**
   ```typescript
   function Filter<T>({ options, value, onChange }: FilterProps<T>)
   ```

2. **Custom Hook with Types**
   ```typescript
   function useExpenses(): UseExpensesReturn
   ```

3. **Discriminated Union State**
   ```typescript
   type PageState = 
     | { view: 'list'; filter: Filter }
     | { view: 'add'; draft: Partial<Expense> }
     | { view: 'edit'; expense: Expense }
   ```

---

# Team Architecture Planning

---

## Type-Safe Architecture

### Design Your Type System

```typescript
// Example: StudyBuddy App Types
interface User {
  id: string;
  email: string;
  courses: Course[];
  availability: TimeSlot[];
}

interface StudySession {
  id: string;
  participants: User[];
  course: Course;
  startTime: Date;
  status: 'scheduled' | 'active' | 'completed';
}

interface Course {
  code: string; // "CS 101"
  name: string;
  semester: 'Fall' | 'Spring' | 'Summer';
}
```

---

## Team Type Architecture

### Create Your types/index.ts

**Structure to Follow:**
```
types/
  ├── index.ts       // Main exports
  ├── models.ts      // Data models
  ├── api.ts         // API contracts
  └── components.ts  // Component props
```

**Documentation Required:**
- Core data models
- API request/response types
- Shared component interfaces
- State management types

---

## Architecture Decision Record

### Document Your TypeScript Strategy

```markdown
# ADR-002: TypeScript Architecture

## Context
We need type safety for our [Project] to prevent bugs and improve developer experience.

## Decision
- Use interfaces for all data models
- Strict TypeScript configuration
- Shared types in /types directory
- No `any` types without justification

## Consequences
✅ Catch errors at compile time
✅ Better IDE support
❌ Initial learning curve
❌ Slightly longer build times
```

---

# Debugging TypeScript

---

## Reading TypeScript Errors

### Common Errors Decoded

**"Type 'string' is not assignable to type 'number'"**
- You're passing wrong type
- Check expected vs actual

**"Property 'X' does not exist on type 'Y'"**
- Typo in property name
- Or missing from interface

**"Cannot find name 'useState'"**
- Missing import from React

**"Argument of type 'X' is not assignable to parameter of type 'Y'"**
- Function expects different type
- Check function signature

---

## TypeScript Tips

### Pro Strategies

1. **Let TypeScript Infer When Possible**
   ```typescript
   // Explicit (sometimes unnecessary)
   const name: string = "Sarah";
   
   // Inferred (often sufficient)
   const name = "Sarah";
   ```

2. **Use Union Types for Flexibility**
   ```typescript
   type Status = 'idle' | 'loading' | 'success' | 'error';
   ```

3. **Avoid `any` - Use `unknown` Instead**
   ```typescript
   // Bad
   const data: any = fetchData();
   
   // Good  
   const data: unknown = fetchData();
   if (isValidData(data)) { /* use data */ }
   ```

---

# Wrap Up

---

## Today's Achievements

### You're Now TypeScript Developers! 🎉

**Technical Growth:**
- ✅ Converted React components to TypeScript
- ✅ Created comprehensive interfaces
- ✅ Implemented advanced patterns
- ✅ Designed type architectures

**Key Insights:**
- TypeScript prevents entire bug categories
- Types are living documentation
- Generics enable reusability
- Teams need shared type definitions

---

## Before Next Week

### Individual Work:
1. Complete TypeScript migration
2. Zero TypeScript errors
3. Add types to expense tracker
4. Document type decisions

### Team Work:
1. Finalize type architecture
2. Create shared types file
3. Review each other's types
4. Plan UI implementation

---

## Week 4 Preview

### Styling with Tailwind CSS

**Plus: Career Workshop #1**
- Resume building for developers
- Portfolio preparation
- LinkedIn optimization
- GitHub profile enhancement

### Get Ready For:
- Modern CSS with Tailwind
- Responsive design
- Component styling patterns
- Professional presence building

---

## Exit Ticket

### Tell Us:

1. 🎯 Rate your TypeScript confidence (1-5)
2. 🤔 Most challenging TypeScript concept today
3. 🛠️ One type pattern you'll use in your project
4. 🔗 Team: Link to your types architecture

### Great work today! See you next week! 🚀