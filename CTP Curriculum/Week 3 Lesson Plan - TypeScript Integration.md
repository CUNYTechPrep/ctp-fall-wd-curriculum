## LEARNING OBJECTIVES

### Content Objectives (What students will know):
- Identify TypeScript's type system and explain how static typing prevents runtime errors
- Compare JavaScript and TypeScript development and justify the industry shift to TypeScript
- Analyze type inference patterns and evaluate when explicit types vs inference is appropriate
- Describe generic types and explain how they enable reusable, type-safe components

### Language Objectives (How students will communicate learning):
- **Reading:** Interpret TypeScript compiler errors, type definitions, and React TypeScript patterns
- **Writing:** Create interfaces for props and state, document types with JSDoc comments, and write type-safe code
- **Speaking:** Articulate type safety benefits, explain type errors to teammates, and present architecture decisions
- **Listening:** Understand technical discussions about types, process feedback on type design, and collaborate on interfaces

### Learning Objectives (What students will be able to do):
By the end of this session, students will be able to:
- Convert existing React JavaScript components to TypeScript with proper type annotations
- Create and implement interfaces for component props, state, and data models
- Debug TypeScript errors effectively using compiler messages and IDE features
- Design type-safe architecture for team projects with shared type definitions

## MATERIALS & PREPARATION

### Instructor Prep:
- Presentation prepared: TypeScript + React slides with progression examples (20 slides)
- Code examples: JavaScript to TypeScript migration showing common patterns
- Error examples: Common TypeScript errors and their solutions prepared
- Architecture templates: Type definition structure for team projects
- Demo project: Expense tracker with TypeScript migration ready
- Assessment materials: TypeScript conversion rubric and architecture checklist

### TA Prep:
- TypeScript proficiency: Strong understanding of types, interfaces, generics
- Error diagnosis: Ability to quickly interpret and fix TypeScript errors
- Migration patterns: Knowledge of JS to TS conversion strategies
- Architecture guidance: Understanding of type organization in large projects
- IDE support: Familiar with VS Code TypeScript features

### Student Requirements:
- **Completed from Week 2:** React components built and working
- **Team status:** Teams formed with repositories created
- **Individual work:** Expense tracker with basic components
- **Preparation:** TypeScript documentation reviewed

### Technology Setup:
- **Development:** CodeSpaces with TypeScript configured
- **Type definitions:** @types/react and @types/node installed
- **IDE features:** TypeScript IntelliSense enabled
- **Team tools:** Shared type definition files structure
- **Resources:** TypeScript playground, React TypeScript CheatSheet

## SESSION TIMELINE

| Time | Duration | Activity | Format | Assessment |
|------|----------|----------|---------|------------|
| 0-10 min | 10 min | Launch & Why TypeScript Matters | Interactive Demo | Engagement check |
| 10-30 min | 20 min | Lecture: TypeScript Fundamentals for React | Instructor presentation | Concept understanding |
| 30-50 min | 20 min | I DO Block 1: React + TypeScript Patterns | Live coding | Pattern recognition |
| 50-65 min | 15 min | YOU DO Block 1: Component Migration | Individual practice | Successful migration |
| 65-75 min | 10 min | BREAK | Informal | None |
| 75-90 min | 15 min | I DO Block 2: Advanced Types & Generics | Live coding | Type comprehension |
| 90-105 min | 15 min | YOU DO Block 2: Type-Safe Features | Individual practice | Type implementation |
| 105-115 min | 10 min | BREAK | Informal | None |
| 115-145 min | 30 min | TEAM PROJECT: Architecture Planning | Team collaboration | Architecture document |
| 145-150 min | 5 min | Wrap-up & Week 4 Preview | Reflection | Exit ticket |

## LAUNCH (10 minutes)

### Hook:
"Let me show you something that will save you hours of debugging and make you infinitely more employable. TypeScript catches errors before your code even runs - it's like having a senior developer reviewing your code in real-time."

### Live Bug Prevention Demo (5 min):

**Show JavaScript Bug:**
```javascript
// JavaScript - This bug ships to production
function calculateTotal(expenses) {
  return expenses.reduce((total, expense) => {
    return total + expense.ammount; // Typo! But JS doesn't care
  }, 0);
}

// Later in the code...
const userExpenses = [
  { amount: 50, category: "Food" },
  { amount: 30, category: "Transport" }
];

console.log(calculateTotal(userExpenses)); // NaN 😱
```

**Show TypeScript Prevention:**
```typescript
// TypeScript - Error caught immediately
interface Expense {
  amount: number;
  category: string;
}

function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => {
    return total + expense.ammount; // ❌ Error: Property 'ammount' does not exist
  }, 0);
}
```

### Think-Pair-Share (5 min):
- **Think:** "What bugs have you encountered that better typing could prevent?"
- **Pair:** Share a debugging horror story
- **Share:** Instructor collects examples of preventable bugs

### Industry Context:
"TypeScript adoption has grown in JavaScript projects over the last 5 years. Many major tech companies now use it. Learning TypeScript is a leg up in the market."

## LECTURE: TypeScript Fundamentals for React (20 minutes)

### Learning Target:
Students will understand TypeScript's type system and its application to React development

### Instructional Strategy: Progressive Enhancement from JavaScript to TypeScript

### Presentation Content Structure:

**TypeScript Mental Model (5 minutes)**
- **What TypeScript Is:**
  - JavaScript + Type System
  - Compiles to regular JavaScript
  - Catches errors at compile time
  - Provides incredible IDE support
  
- **The Type System:**
  ```typescript
  // Basic types
  let count: number = 0;
  let message: string = "Hello";
  let isActive: boolean = true;
  let data: any = "anything"; // Escape hatch - avoid!
  
  // Arrays
  let numbers: number[] = [1, 2, 3];
  let strings: Array<string> = ["a", "b", "c"];
  
  // Union types
  let id: string | number = "abc123";
  id = 123; // Also valid!
  
  // Literal types
  let status: "pending" | "success" | "error" = "pending";
  ```

**React + TypeScript Patterns (7 minutes)**
- **Typing Props with Interfaces:**
  ```typescript
  // Define the shape of your props
  interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: "primary" | "secondary"; // Optional prop
    disabled?: boolean;
  }
  
  // Use in component
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

- **Typing State:**
  ```typescript
  interface User {
    id: number;
    name: string;
    email: string;
  }
  
  function UserProfile() {
    // TypeScript infers type from initial value
    const [count, setCount] = useState(0);
    
    // Explicit type for complex state
    const [user, setUser] = useState<User | null>(null);
    
    // Array of objects
    const [users, setUsers] = useState<User[]>([]);
    
    return <div>...</div>;
  }
  ```

**Type Inference vs Explicit Types (4 minutes)**
- **When TypeScript Infers:**
  ```typescript
  // TypeScript knows this is a string
  const message = "Hello World";
  
  // Knows this returns a number
  function add(a: number, b: number) {
    return a + b;
  }
  
  // Infers array methods
  const doubled = [1, 2, 3].map(n => n * 2);
  ```

- **When to Be Explicit:**
  ```typescript
  // Function parameters - always explicit
  function greet(name: string): string {
    return `Hello ${name}`;
  }
  
  // Empty arrays need type
  const items: string[] = [];
  
  // API responses
  const [data, setData] = useState<ApiResponse | null>(null);
  ```

**Event Handling in TypeScript (4 minutes)**
- **Typing Events:**
  ```typescript
  // Form events
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form
  };
  
  // Input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  // Click events
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked!');
  };
  
  // Generic event handler
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
  };
  ```

### Visual Elements:
- Before/after code comparisons
- Error message examples with explanations
- Type flow diagrams
- IDE autocomplete demonstrations

### Engagement Techniques:
- "What type would you use for a user's age?"
- "Is this valid TypeScript?" (show edge cases)
- "What error would this produce?"

## I DO BLOCK 1: React + TypeScript Patterns (20 minutes)

### Learning Target:
Demonstrate converting React components to TypeScript with professional patterns

### Demonstration Sequence:

**Convert ExpenseCard to TypeScript (10 min)**

```tsx
// ExpenseCard.tsx (renamed from .jsx)
import React from 'react';
import './ExpenseCard.css';

// Define the shape of an expense
export interface Expense {
  id: number;
  amount: number;
  category: 'Food' | 'Transport' | 'Entertainment' | 'Other';
  description: string;
  date: string;
}

// Define component props
interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: number) => void; // Optional callback
  onEdit?: (expense: Expense) => void;
  highlighted?: boolean;
}

// Typed functional component
const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  expense, 
  onDelete, 
  onEdit,
  highlighted = false 
}) => {
  // Format currency with type safety
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(expense.amount);

  // Type-safe date formatting
  const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Determine style based on amount
  const getAmountClass = (): string => {
    if (expense.amount > 100) return 'expense-high';
    if (expense.amount > 50) return 'expense-medium';
    return 'expense-low';
  };

  // Typed event handlers
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.(expense.id); // Optional chaining
  };

  const handleEdit = () => {
    onEdit?.(expense);
  };

  return (
    <article 
      className={`expense-card ${highlighted ? 'highlighted' : ''}`}
      onClick={handleEdit}
    >
      <div className="expense-header">
        <span className="expense-category">
          {expense.category}
        </span>
        <time className="expense-date">
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
          aria-label="Delete expense"
        >
          ×
        </button>
      )}
    </article>
  );
};

export default ExpenseCard;
```

- Think-aloud points:
  - "Interface for data shape - single source of truth"
  - "Optional props with ? - provides flexibility"
  - "Union types for categories - only valid options"
  - "Optional chaining (?.) for callbacks"
  - "Event types for handlers"

**Convert ExpenseList with Generic State (10 min)**

```tsx
// ExpenseList.tsx
import React, { useState, useMemo } from 'react';
import ExpenseCard, { Expense } from '../ExpenseCard/ExpenseCard';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import './ExpenseList.css';

// Filter type
type FilterCategory = Expense['category'] | 'All';

// Sort options
type SortOption = 'date' | 'amount' | 'category';

interface ExpenseListProps {
  initialExpenses?: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  initialExpenses = [] 
}) => {
  // Typed state
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Type-safe add function
  const addExpense = (newExpense: Omit<Expense, 'id'>): void => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now()
    };
    setExpenses(prev => [...prev, expense]);
  };

  // Type-safe delete
  const deleteExpense = (id: number): void => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Type-safe update
  const updateExpense = (updatedExpense: Expense): void => {
    setExpenses(prev => 
      prev.map(exp => 
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    );
  };

  // Computed values with useMemo
  const filteredAndSorted = useMemo(() => {
    let result = [...expenses];

    // Filter
    if (filter !== 'All') {
      result = result.filter(exp => exp.category === filter);
    }

    // Search
    if (searchTerm) {
      result = result.filter(exp => 
        exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [expenses, filter, sortBy, searchTerm]);

  // Calculate total with type safety
  const total: number = filteredAndSorted.reduce(
    (sum, exp) => sum + exp.amount, 
    0
  );

  return (
    <div className="expense-list-container">
      <div className="expense-controls">
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterCategory)}
        >
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      <div className="expense-summary">
        <h2>Total: ${total.toFixed(2)}</h2>
        <p>{filteredAndSorted.length} expenses</p>
      </div>

      <ExpenseForm onSubmit={addExpense} />

      <div className="expense-items">
        {filteredAndSorted.map(expense => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onDelete={deleteExpense}
            onEdit={updateExpense}
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
```

- Think-aloud points:
  - "Omit utility type - reuse interface minus fields"
  - "Type assertions for select elements"
  - "Generic state with explicit types"
  - "useMemo for performance with type inference"

### Professional Insights:
- "This is production-level TypeScript"
- "Types are documentation that never gets outdated"
- "IDE now knows everything about your code"

## YOU DO BLOCK 1: Component Migration (15 minutes)

### Learning Target:
Students convert their React components to TypeScript

### Activity Structure:

**Migration Tasks (10 minutes)**
1. Rename `.jsx` files to `.tsx`
2. Create interfaces for props
3. Add types to state
4. Type event handlers
5. Fix any TypeScript errors

**Requirements:**
- At least 2 components converted
- Proper interface definitions
- No `any` types unless justified
- All TypeScript errors resolved

**Verification (5 minutes)**
- Run TypeScript compiler
- Check for type errors
- Test functionality preserved
- Use IDE autocomplete

### Success Criteria:
- Components compile without errors
- Props properly typed
- State types defined
- Event handlers typed
- Autocomplete working

### Common Migration Issues:
```typescript
// Problem: Implicit any
const handleClick = (e) => { } // ❌

// Solution: Explicit type
const handleClick = (e: React.MouseEvent) => { } // ✅

// Problem: Children prop
interface Props {
  children: any; // ❌
}

// Solution: React.ReactNode
interface Props {
  children: React.ReactNode; // ✅
}
```

## BREAK (10 minutes)

## I DO BLOCK 2: Advanced Types & Generics (15 minutes)

### Learning Target:
Demonstrate advanced TypeScript patterns for scalable React applications

### Demonstration Sequence:

**Generic Components (7 min)**

```tsx
// Generic Select Component
interface SelectOption<T> {
  value: T;
  label: string;
}

interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
}

function Select<T extends string | number>({ 
  options, 
  value, 
  onChange, 
  placeholder 
}: SelectProps<T>) {
  return (
    <select 
      value={value as string | number}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Usage with different types
const CategorySelect = () => {
  const [category, setCategory] = useState<string>('food');
  
  return (
    <Select
      options={[
        { value: 'food', label: 'Food' },
        { value: 'transport', label: 'Transport' }
      ]}
      value={category}
      onChange={setCategory}
    />
  );
};
```

**Custom Hooks with TypeScript (8 min)**

```typescript
// useLocalStorage hook with generics
function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get from local storage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Wrapped setter function
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

// useApi hook with proper typing
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useApi<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json() as T;
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ 
          data: null, 
          loading: false, 
          error: error as Error 
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
}

// Usage in component
interface User {
  id: number;
  name: string;
  email: string;
}

function UserList() {
  const { data: users, loading, error } = useApi<User[]>('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!users) return <div>No users found</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

- Think-aloud points:
  - "Generics make components reusable with type safety"
  - "Custom hooks can be typed just like functions"
  - "Union types for loading states"
  - "Type assertions for API responses"

### Key Concepts:
- Generic components for reusability
- Custom hooks with TypeScript
- Discriminated unions for state
- Type guards and assertions

## YOU DO BLOCK 2: Type-Safe Features (15 minutes)

### Learning Target:
Students implement advanced TypeScript features in their expense tracker

### Activity Structure:

**Choose One Advanced Feature (10 minutes)**
1. **Generic Filter Component:**
   - Create reusable filter for any data type
   - Use generics and constraints

2. **Custom Hook:**
   - `useExpenses` with full typing
   - Or `useLocalStorage` for persistence

3. **Discriminated Union State:**
   - Loading/Success/Error states
   - Type-safe state handling

**Implementation (5 minutes)**
- Apply chosen pattern
- Ensure full type safety
- Test with different inputs
- Document with comments

### Success Criteria:
- Advanced TypeScript feature implemented
- No type errors
- Improved code reusability
- Clear type definitions

### Example Patterns:
```typescript
// Discriminated unions for state
type RequestState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Type guards
function isExpense(item: any): item is Expense {
  return item && typeof item.amount === 'number';
}

// Utility types
type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};
```

## BREAK (10 minutes)

## TEAM PROJECT: Architecture Planning (30 minutes)

### Learning Target:
Teams create type-safe architecture plans for their projects

### Activity Structure:

**Type Architecture Design (15 minutes)**

Teams create `types/index.ts`:
```typescript
// Example for a Study Buddy app
// types/index.ts

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  courses: Course[];
  availability: TimeSlot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  code: string; // "CS 101"
  name: string;
  semester: 'Fall' | 'Spring' | 'Summer';
  year: number;
}

export interface TimeSlot {
  dayOfWeek: DayOfWeek;
  startTime: string; // "14:00"
  endTime: string;   // "16:00"
}

export type DayOfWeek = 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday' 
  | 'Sunday';

// Study session types
export interface StudySession {
  id: string;
  course: Course;
  participants: User[];
  location: Location;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  notes?: string;
}

export type SessionStatus = 
  | 'scheduled' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled';

export interface Location {
  type: 'in-person' | 'virtual';
  details: string; // Room number or Zoom link
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Form types
export interface SessionFormData {
  courseId: string;
  date: string;
  startTime: string;
  duration: number; // in minutes
  location: Location;
  maxParticipants: number;
}

// State types
export interface AppState {
  user: User | null;
  sessions: StudySession[];
  ui: UIState;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  activeModal: ModalType | null;
}

export type ModalType = 
  | 'createSession' 
  | 'editProfile' 
  | 'viewDetails' 
  | null;
```

**Component Interface Planning (10 minutes)**

Teams document component props:
```typescript
// components/types.ts

// Layout components
export interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
}

// Feature components
export interface SessionCardProps {
  session: StudySession;
  currentUser: User;
  onJoin: (sessionId: string) => void;
  onCancel: (sessionId: string) => void;
  onEdit?: (session: StudySession) => void;
}

export interface SessionListProps {
  sessions: StudySession[];
  loading: boolean;
  error: string | null;
  filter?: SessionFilter;
  onFilterChange: (filter: SessionFilter) => void;
}

export interface SessionFilter {
  course?: string;
  date?: DateRange;
  status?: SessionStatus[];
  hasSpace?: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Form components
export interface FormFieldProps<T> {
  name: keyof T;
  label: string;
  value: T[keyof T];
  onChange: (value: T[keyof T]) => void;
  error?: string;
  required?: boolean;
}

// Hook return types
export interface UseSessionsReturn {
  sessions: StudySession[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  create: (data: SessionFormData) => Promise<StudySession>;
  update: (id: string, data: Partial<StudySession>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
```

**API Contract Definition (5 minutes)**

Teams define API types:
```typescript
// api/types.ts

// Request types
export interface CreateSessionRequest {
  courseId: string;
  startTime: string; // ISO date
  duration: number;
  location: Location;
  maxParticipants: number;
}

export interface UpdateUserRequest {
  name?: string;
  courses?: string[]; // Course IDs
  availability?: TimeSlot[];
}

// Response types
export interface SessionsResponse {
  sessions: StudySession[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// Error responses
export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors?: ValidationError[];
}
```

### Team Deliverables:
1. `types/index.ts` with core data models
2. Component prop interfaces documented
3. API contract types defined
4. ADR for TypeScript decisions

### Architecture ADR Template:
```markdown
# ADR-002: TypeScript Architecture

## Status
Accepted

## Context
We need to establish TypeScript patterns and type organization for our [Project Name].

## Decision
We will:
- Use interfaces for all data models
- Create a centralized types directory
- Use strict TypeScript configuration
- Avoid `any` types except for third-party integrations

## Type Organization
- `/types/index.ts` - Core data models
- `/types/api.ts` - API contracts
- `/components/[Component]/types.ts` - Component-specific types
- `/hooks/types.ts` - Custom hook types

## Consequences
### Positive
- Type safety across the application
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

### Negative
- Initial setup time
- Learning curve for team members
- Build time slightly increased
```

## WRAP-UP & REFLECTION (5 minutes)

### Today's Achievements:
"You've transformed your JavaScript into type-safe TypeScript! Your code now catches errors before runtime, provides incredible IDE support, and documents itself. Teams have architected type-safe foundations for scalable projects."

### Technical Growth:
- Converted components to TypeScript
- Created comprehensive interfaces
- Implemented advanced type patterns
- Designed type architecture

### Key Takeaways:
- TypeScript prevents entire categories of bugs
- Types are living documentation
- Generics enable reusable, type-safe code
- Team type definitions ensure consistency

### Next Week Preview:
"Week 4: Styling with Tailwind CSS and our first Career Workshop on resume building. We'll make our applications beautiful while preparing for the job market."

### Exit Ticket (Google Form):
1. Rate your TypeScript confidence (1-5)
2. Most challenging TypeScript concept today
3. One type pattern you'll use in your project
4. Team: Link to your types architecture

### Homework:
- Complete TypeScript migration for all components
- Add types to your expense tracker
- Team: Finalize type definitions
- Team: Create 3 typed component stubs

## ADDENDUM: UDL & DIFFERENTIATION

### Multiple Means of Representation:
- **Visual:** Type diagrams, error screenshots, IDE tooltips
- **Auditory:** Live coding with type explanations
- **Reading:** TypeScript documentation and cheatsheets
- **Kinesthetic:** Immediate type error feedback

### Multiple Means of Engagement:
- **Relevance:** Industry demand for TypeScript skills
- **Challenge:** Advanced patterns for interested students
- **Support:** Pair programming for struggling students
- **Choice:** Multiple implementation options

### Multiple Means of Action/Expression:
- **Coding:** Direct TypeScript implementation
- **Documentation:** Type definition files
- **Diagramming:** Type relationship diagrams
- **Teaching:** Explain types to teammates

### Specific Support Strategies:

**For Advanced Students:**
- Implement discriminated unions
- Create generic utility types
- Use conditional types
- Explore type guards and predicates
- Research advanced patterns (mapped types, template literals)

**For Struggling Students:**
- Start with simple type annotations
- Provide TypeScript cheatsheet
- Use `// @ts-ignore` temporarily
- Focus on props/state first
- Gradual migration approach

**For English Language Learners:**
- TypeScript keyword glossary
- Visual type diagrams preferred
- Native language comments okay
- Extra time for error message comprehension

**For Different Learning Styles:**
- **Visual:** Type relationship diagrams, color-coded examples
- **Auditory:** Recorded TypeScript explanations
- **Read/Write:** Comprehensive type documentation
- **Kinesthetic:** Interactive TypeScript playground

### Common TypeScript Challenges:

**Type Errors:**
```typescript
// Common: Type 'string | undefined' is not assignable to type 'string'
// Solution: Use optional chaining or default values
const value = props.text ?? 'default';

// Common: Object is possibly 'null'
// Solution: Type guards
if (user) {
  console.log(user.name);
}

// Common: Property does not exist on type
// Solution: Proper interface definition
interface Props {
  name: string;
  age?: number; // Optional
}
```

**Migration Strategy:**
1. Start with `.tsx` extension
2. Add basic types to props
3. Type event handlers
4. Add state types
5. Fix remaining errors
6. Refactor for better types

**Team Architecture Challenges:**
- **Over-engineering:** Start simple, refactor later
- **Naming conflicts:** Use namespaces or prefixes
- **Shared types:** Create central types file
- **Version control:** Commit types separately

### Resources Provided:
- TypeScript + React CheatSheet
- Common error solutions guide
- Type definition examples
- Migration checklist
- Video tutorials for common patterns