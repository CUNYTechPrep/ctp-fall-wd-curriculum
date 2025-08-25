# I DO Block 2: Advanced Types & Generics Demo - Detailed Guide

## Overview
Duration: 15 minutes  
Learning Target: Demonstrate advanced TypeScript patterns for scalable React applications

## Pre-Demo Context

### What Students Already Know
- Basic TypeScript types and interfaces
- How to type React components
- Simple prop and state typing
- Event handler types

### What We're Adding
- Generic components for reusability
- Custom hooks with full typing
- Discriminated unions for complex state
- Type utilities and helpers

## Part 1: Generic Components (7 minutes)

### Step 1: The Problem with Non-Generic Components (1 min)

Show the limitation first:

```typescript
// ❌ Without generics - lots of duplication
interface StringSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

interface NumberSelectProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

// We'd need separate components for each type!
```

**Think-Aloud:**
- "We're repeating the same pattern"
- "What if we need a select for other types?"
- "Generics let us write once, use everywhere"

### Step 2: Generic Select Component (3 min)

```typescript
// ✅ With generics - write once, use with any type

// First, let's define what a select option looks like
interface SelectOption<T> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Generic select component props
interface SelectProps<T> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

// Generic component with constraints
function Select<T extends string | number>({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '',
  id,
  name
}: SelectProps<T>) {
  // Handle change with proper typing
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    // Find the option to get the proper typed value
    const selectedOption = options.find(
      opt => String(opt.value) === selectedValue
    );
    
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  return (
    <select 
      id={id}
      name={name}
      value={value !== null ? String(value) : ''}
      onChange={handleChange}
      className={`select ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      
      {options.map(option => (
        <option 
          key={String(option.value)} 
          value={String(option.value)}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

### Step 3: Using the Generic Component (3 min)

```typescript
// Using with different types - TypeScript infers the generic type!

// Example 1: Category select (string type)
type Category = 'Food' | 'Transport' | 'Entertainment' | 'Other';

const CategorySelect = () => {
  const [category, setCategory] = useState<Category>('Food');
  
  const categoryOptions: SelectOption<Category>[] = [
    { value: 'Food', label: '🍔 Food' },
    { value: 'Transport', label: '🚗 Transport' },
    { value: 'Entertainment', label: '🎬 Entertainment' },
    { value: 'Other', label: '📦 Other' }
  ];
  
  return (
    <Select
      options={categoryOptions}
      value={category}
      onChange={setCategory} // TypeScript knows this expects Category type!
      placeholder="Choose a category"
    />
  );
};

// Example 2: Year select (number type)
const YearSelect = () => {
  const [year, setYear] = useState<number>(2024);
  
  const yearOptions: SelectOption<number>[] = Array.from(
    { length: 10 }, 
    (_, i) => ({
      value: 2024 - i,
      label: `Year ${2024 - i}`
    })
  );
  
  return (
    <Select
      options={yearOptions}
      value={year}
      onChange={setYear} // TypeScript knows this expects number!
    />
  );
};

// Example 3: More complex generic list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  emptyMessage?: string;
  className?: string;
}

function List<T>({ 
  items, 
  renderItem, 
  keyExtractor, 
  emptyMessage = 'No items',
  className = ''
}: ListProps<T>) {
  if (items.length === 0) {
    return <p className="empty-message">{emptyMessage}</p>;
  }
  
  return (
    <ul className={`list ${className}`}>
      {items.map((item, index) => (
        <li key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

// Using the generic list
const ExpenseList = ({ expenses }: { expenses: Expense[] }) => {
  return (
    <List
      items={expenses}
      keyExtractor={(expense) => expense.id}
      renderItem={(expense) => (
        <ExpenseCard expense={expense} />
      )}
      emptyMessage="No expenses yet"
    />
  );
};
```

**Key Points:**
- "T is a type variable - like a placeholder"
- "Constraints with extends limit what T can be"
- "TypeScript infers T from usage"
- "Same component, different types, full type safety"

## Part 2: Custom Hooks with TypeScript (8 minutes)

### Step 1: useLocalStorage Hook (4 min)

```typescript
// hooks/useLocalStorage.ts

// Generic hook that works with any serializable type
function useLocalStorage<T>(
  key: string, 
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  }
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Use custom serializers or default to JSON
  const serialize = options?.serialize || JSON.stringify;
  const deserialize = options?.deserialize || JSON.parse;
  
  // State initialization with error handling
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Wrapped setter with localStorage sync
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Handle function updates
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, serialize, storedValue]);

  // Remove value from storage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Usage examples
function SettingsComponent() {
  // Simple usage with primitive
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
  
  // Complex object
  const [userPrefs, setUserPrefs] = useLocalStorage<UserPreferences>(
    'userPrefs',
    { 
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      language: 'en'
    }
  );
  
  // With custom serialization (e.g., for Date objects)
  const [lastVisit, setLastVisit] = useLocalStorage<Date>(
    'lastVisit',
    new Date(),
    {
      serialize: (date) => date.toISOString(),
      deserialize: (str) => new Date(str)
    }
  );
  
  return (
    <div>
      <button onClick={() => setTheme(prev => 
        prev === 'light' ? 'dark' : 'light'
      )}>
        Toggle Theme: {theme}
      </button>
    </div>
  );
}
```

### Step 2: useAsync Hook for API Calls (4 min)

```typescript
// hooks/useAsync.ts

// Discriminated union for async state
type AsyncState<T> = 
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

// Hook options
interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: Error) => void;
}

// The hook itself
function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null
  });

  // Execute the async function
  const execute = useCallback(async () => {
    setState({ status: 'loading', data: null, error: null });
    
    try {
      const data = await asyncFunction();
      setState({ status: 'success', data, error: null });
      onSuccess?.(data);
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({ status: 'error', data: null, error: errorObj });
      onError?.(errorObj);
    }
  }, [asyncFunction, onSuccess, onError]);

  // Run immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  // Helper functions for better DX
  const isIdle = state.status === 'idle';
  const isLoading = state.status === 'loading';
  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';

  return {
    ...state,
    execute,
    isIdle,
    isLoading,
    isSuccess,
    isError
  };
}

// Usage with full type safety
interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const {
    data: user,
    error,
    isLoading,
    isError,
    execute: refetch
  } = useAsync<User>(
    () => fetch(`/api/users/${userId}`).then(res => res.json()),
    {
      onSuccess: (user) => {
        console.log('User loaded:', user.name);
      },
      onError: (error) => {
        console.error('Failed to load user:', error);
      }
    }
  );

  if (isLoading) return <div>Loading user...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Step 3: useDebounce Hook (2 min)

```typescript
// Quick example of another useful typed hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { data: results } = useAsync<SearchResult[]>(
    () => fetch(`/api/search?q=${debouncedSearch}`).then(res => res.json()),
    { immediate: false }
  );
  
  // Effect runs when debounced value changes
  useEffect(() => {
    if (debouncedSearch) {
      // Search is triggered here
    }
  }, [debouncedSearch]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## Key Patterns to Emphasize

### Generic Constraints
```typescript
// Constrain to objects with specific properties
function getProperty<T extends { id: number }>(obj: T): number {
  return obj.id;
}

// Multiple constraints
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

### Type Guards and Narrowing
```typescript
// Custom type guard
function isSuccessState<T>(
  state: AsyncState<T>
): state is { status: 'success'; data: T; error: null } {
  return state.status === 'success';
}

// Usage
if (isSuccessState(state)) {
  // TypeScript knows state.data is T here
  console.log(state.data);
}
```

### Utility Types in Practice
```typescript
// Make all properties optional for updates
type PartialExpense = Partial<Expense>;

// Pick only certain properties
type ExpenseSummary = Pick<Expense, 'id' | 'amount' | 'category'>;

// Omit properties
type NewExpense = Omit<Expense, 'id'>;

// Make properties readonly
type ReadonlyExpense = Readonly<Expense>;
```

## Common Questions & Answers

### Q: "When should I use generics?"
A: "When you find yourself writing similar code for different types. If you're copying and pasting just to change types, use generics."

### Q: "How do I know what to constrain T to?"
A: "Think about what operations you need to perform on T. If you need to access properties, constrain it. If it's just passing through, no constraint needed."

### Q: "Discriminated unions vs enums?"
A: "Discriminated unions are more flexible and work better with type narrowing. Use them for state machines and complex state."

## Live Coding Tips

1. **Start Simple**: Show basic generic first, add constraints later
2. **Use IntelliSense**: Hover to show inferred types
3. **Show Errors**: Demonstrate what happens with wrong types
4. **Real Examples**: Use actual UI components they'll build

## Assessment Points

Students should understand:
- What generics solve (code reuse with type safety)
- How to create generic components and hooks
- When to use discriminated unions
- How TypeScript narrows types in conditionals

## Transition to YOU DO
"Now you'll implement these patterns in your expense tracker. Choose one: a generic filter component, a custom hook, or discriminated union state. Remember: generics are about writing reusable, type-safe code!"