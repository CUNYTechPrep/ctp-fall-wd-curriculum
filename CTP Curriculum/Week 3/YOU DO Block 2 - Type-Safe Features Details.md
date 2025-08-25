# YOU DO Block 2: Type-Safe Features - Detailed Guide

## Overview
Duration: 15 minutes  
Learning Target: Students implement advanced TypeScript features in their expense tracker, choosing from generic components, custom hooks, or discriminated union state management

## Pre-Activity Context

### What Students Have Completed
- Basic TypeScript migration of components
- Simple prop and state typing
- Understanding of generics from I DO Block 2
- Familiarity with discriminated unions

### Feature Options
Students choose ONE to implement:
1. **Generic Filter Component** - Reusable filtering for any data type
2. **Custom Hook** - useExpenses or useLocalStorage with full typing
3. **Discriminated Union State** - Loading/Success/Error state management

## Feature Option 1: Generic Filter Component

### Implementation Guide

#### Step 1: Define the Generic Filter (5 min)

```typescript
// src/components/Filter/Filter.tsx
import React, { useState, useMemo } from 'react';
import './Filter.css';

// Generic filter option interface
interface FilterOption<T> {
  value: T;
  label: string;
  count?: number;
  icon?: string;
}

// Props for the generic filter
interface FilterProps<T> {
  options: FilterOption<T>[];
  value: T | T[];
  onChange: (value: T | T[]) => void;
  multiple?: boolean;
  showCounts?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

// Generic filter component
function Filter<T extends string | number>({
  options,
  value,
  onChange,
  multiple = false,
  showCounts = false,
  label,
  placeholder = 'Select...',
  className = ''
}: FilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  // Handle single selection
  const handleSingleSelect = (selectedValue: T) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  // Handle multiple selection
  const handleMultiSelect = (selectedValue: T) => {
    if (!Array.isArray(value)) return;
    
    const currentValues = value as T[];
    const newValues = currentValues.includes(selectedValue)
      ? currentValues.filter(v => v !== selectedValue)
      : [...currentValues, selectedValue];
    
    onChange(newValues);
  };

  // Check if option is selected
  const isSelected = (optionValue: T): boolean => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  // Get display text
  const displayText = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option?.label || placeholder;
      }
      return `${value.length} selected`;
    }
    
    const option = options.find(opt => opt.value === value);
    return option?.label || placeholder;
  }, [value, options, multiple, placeholder]);

  return (
    <div className={`filter-container ${className}`}>
      {label && <label className="filter-label">{label}</label>}
      
      <div className="filter-wrapper">
        <button
          className="filter-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="filter-display">{displayText}</span>
          <span className="filter-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="filter-dropdown">
            {options.map(option => (
              <button
                key={String(option.value)}
                className={`filter-option ${isSelected(option.value) ? 'selected' : ''}`}
                onClick={() => 
                  multiple 
                    ? handleMultiSelect(option.value)
                    : handleSingleSelect(option.value)
                }
              >
                {multiple && (
                  <span className="filter-checkbox">
                    {isSelected(option.value) ? '☑' : '☐'}
                  </span>
                )}
                
                {option.icon && <span className="filter-icon">{option.icon}</span>}
                
                <span className="filter-option-label">{option.label}</span>
                
                {showCounts && option.count !== undefined && (
                  <span className="filter-count">({option.count})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Filter;
```

#### Step 2: Use the Generic Filter (3 min)

```typescript
// In ExpenseList.tsx or App.tsx
import Filter from './components/Filter/Filter';
import { ExpenseCategory } from './types';

function ExpenseFilters() {
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  
  // Category filter options with counts
  const categoryOptions: FilterOption<ExpenseCategory | 'All'>[] = [
    { value: 'All', label: 'All Categories', icon: '📊' },
    { value: 'Food', label: 'Food', icon: '🍔', count: 23 },
    { value: 'Transport', label: 'Transport', icon: '🚗', count: 15 },
    { value: 'Entertainment', label: 'Entertainment', icon: '🎬', count: 8 },
    { value: 'Shopping', label: 'Shopping', icon: '🛒', count: 12 },
    { value: 'Bills', label: 'Bills', icon: '📄', count: 5 },
    { value: 'Other', label: 'Other', icon: '📦', count: 3 }
  ];

  // Month filter options
  const monthOptions: FilterOption<number>[] = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    // ... etc
  ];

  return (
    <div className="expense-filters">
      <Filter
        options={categoryOptions}
        value={selectedCategory}
        onChange={setSelectedCategory}
        label="Category"
        showCounts
      />
      
      <Filter
        options={monthOptions}
        value={selectedMonths}
        onChange={setSelectedMonths}
        multiple
        label="Months"
        placeholder="Select months..."
      />
    </div>
  );
}
```

#### Step 3: Filter Styling (2 min)

```css
/* Filter.css */
.filter-container {
  position: relative;
  min-width: 200px;
}

.filter-label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-trigger {
  width: 100%;
  padding: 8px 12px;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-trigger:hover {
  border-color: #4F46E5;
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
}

.filter-option {
  width: 100%;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}

.filter-option:hover {
  background: #F3F4F6;
}

.filter-option.selected {
  background: #EEF2FF;
  color: #4F46E5;
  font-weight: 500;
}
```

## Feature Option 2: Custom Hook - useExpenses

### Implementation Guide

#### Step 1: Create the Hook (5 min)

```typescript
// src/hooks/useExpenses.ts
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Expense, NewExpense, ExpenseCategory } from '../types';

// Hook configuration options
interface UseExpensesOptions {
  initialExpenses?: Expense[];
  persistence?: {
    enabled: boolean;
    key?: string;
  };
  validation?: {
    maxAmount?: number;
    requiredFields?: (keyof NewExpense)[];
  };
}

// Return type for the hook
interface UseExpensesReturn {
  // Data
  expenses: Expense[];
  totalAmount: number;
  expensesByCategory: Record<ExpenseCategory, Expense[]>;
  
  // Actions
  addExpense: (expense: NewExpense) => Promise<Expense>;
  updateExpense: (id: number, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  deleteMultiple: (ids: number[]) => Promise<void>;
  clearAll: () => void;
  
  // Filtering and sorting
  filterByCategory: (category: ExpenseCategory | null) => void;
  filterByDateRange: (start: Date, end: Date) => void;
  sortBy: (key: keyof Expense, direction: 'asc' | 'desc') => void;
  search: (term: string) => void;
  
  // State
  isLoading: boolean;
  error: string | null;
  filteredExpenses: Expense[];
  selectedCategory: ExpenseCategory | null;
  searchTerm: string;
}

// The main hook
export function useExpenses(
  options: UseExpensesOptions = {}
): UseExpensesReturn {
  const {
    initialExpenses = [],
    persistence = { enabled: true, key: 'expenses' },
    validation = {}
  } = options;

  // Core state
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (persistence.enabled && typeof window !== 'undefined') {
      const saved = localStorage.getItem(persistence.key || 'expenses');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved expenses:', e);
        }
      }
    }
    return initialExpenses;
  });

  // Filter and search state
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expense;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });

  // Loading and error state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist expenses to localStorage
  useEffect(() => {
    if (persistence.enabled && typeof window !== 'undefined') {
      localStorage.setItem(persistence.key || 'expenses', JSON.stringify(expenses));
    }
  }, [expenses, persistence]);

  // Validate expense
  const validateExpense = (expense: NewExpense): string | null => {
    if (validation.maxAmount && expense.amount > validation.maxAmount) {
      return `Amount cannot exceed $${validation.maxAmount}`;
    }
    
    if (validation.requiredFields) {
      for (const field of validation.requiredFields) {
        if (!expense[field]) {
          return `${field} is required`;
        }
      }
    }
    
    return null;
  };

  // Add expense
  const addExpense = useCallback(async (newExpense: NewExpense): Promise<Expense> => {
    setError(null);
    
    // Validate
    const validationError = validateExpense(newExpense);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const expense: Expense = {
        ...newExpense,
        id: Date.now()
      };
      
      setExpenses(prev => [...prev, expense]);
      return expense;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add expense';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [validateExpense]);

  // Update expense
  const updateExpense = useCallback(async (
    id: number, 
    updates: Partial<Expense>
  ): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update expense';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete expense
  const deleteExpense = useCallback(async (id: number): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete multiple
  const deleteMultiple = useCallback(async (ids: number[]): Promise<void> => {
    setError(null);
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setExpenses(prev => prev.filter(expense => !ids.includes(expense.id)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete expenses';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setExpenses([]);
    setError(null);
  }, []);

  // Computed values
  const { filteredExpenses, totalAmount, expensesByCategory } = useMemo(() => {
    let filtered = [...expenses];
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(exp => exp.category === selectedCategory);
    }
    
    // Apply date range filter
    if (dateRange) {
      filtered = filtered.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= dateRange.start && expDate <= dateRange.end;
      });
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.description.toLowerCase().includes(term) ||
        exp.category.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        const aTime = new Date(aVal as string).getTime();
        const bTime = new Date(bVal as string).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortConfig.direction === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
    
    // Calculate totals
    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Group by category
    const byCategory = expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = [];
      }
      acc[exp.category].push(exp);
      return acc;
    }, {} as Record<ExpenseCategory, Expense[]>);
    
    return {
      filteredExpenses: filtered,
      totalAmount: total,
      expensesByCategory: byCategory
    };
  }, [expenses, selectedCategory, dateRange, searchTerm, sortConfig]);

  // Filter actions
  const filterByCategory = useCallback((category: ExpenseCategory | null) => {
    setSelectedCategory(category);
  }, []);

  const filterByDateRange = useCallback((start: Date, end: Date) => {
    setDateRange({ start, end });
  }, []);

  const sortBy = useCallback((key: keyof Expense, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
  }, []);

  const search = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    // Data
    expenses,
    totalAmount,
    expensesByCategory,
    
    // Actions
    addExpense,
    updateExpense,
    deleteExpense,
    deleteMultiple,
    clearAll,
    
    // Filtering and sorting
    filterByCategory,
    filterByDateRange,
    sortBy,
    search,
    
    // State
    isLoading,
    error,
    filteredExpenses,
    selectedCategory,
    searchTerm
  };
}
```

#### Step 2: Use the Hook (3 min)

```typescript
// In a component
import { useExpenses } from '../hooks/useExpenses';

function ExpenseManager() {
  const {
    filteredExpenses,
    totalAmount,
    addExpense,
    deleteExpense,
    filterByCategory,
    search,
    isLoading,
    error
  } = useExpenses({
    persistence: { enabled: true },
    validation: {
      maxAmount: 10000,
      requiredFields: ['amount', 'description', 'category']
    }
  });

  const handleAddExpense = async (expense: NewExpense) => {
    try {
      await addExpense(expense);
      // Show success message
    } catch (err) {
      // Error is already in the hook's error state
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      
      <ExpenseForm onSubmit={handleAddExpense} disabled={isLoading} />
      
      <input
        type="text"
        placeholder="Search expenses..."
        onChange={(e) => search(e.target.value)}
      />
      
      <div className="total">
        Total: ${totalAmount.toFixed(2)}
      </div>
      
      {filteredExpenses.map(expense => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          onDelete={() => deleteExpense(expense.id)}
        />
      ))}
    </div>
  );
}
```

## Feature Option 3: Discriminated Union State

### Implementation Guide

#### Step 1: Define State Types (2 min)

```typescript
// src/types/state.ts

// Base state for any async operation
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading'; progress?: number }
  | { status: 'success'; data: T; timestamp: number }
  | { status: 'error'; error: Error; canRetry: boolean };

// Specific state for expenses
export type ExpensePageState =
  | { view: 'list'; filter: ExpenseFilter; sort: SortConfig }
  | { view: 'add'; draft: Partial<NewExpense> }
  | { view: 'edit'; expense: Expense; changes: Partial<Expense> }
  | { view: 'detail'; expense: Expense };

// Form submission state
export type FormState<T> =
  | { status: 'idle' }
  | { status: 'validating'; fields: (keyof T)[] }
  | { status: 'submitting'; progress?: number }
  | { status: 'success'; data: T }
  | { status: 'error'; errors: Record<keyof T, string[]> };

// Complex filter state
export interface ExpenseFilter {
  categories: ExpenseCategory[];
  dateRange: { start: Date; end: Date } | null;
  amountRange: { min: number; max: number } | null;
  searchTerm: string;
}

export interface SortConfig {
  field: keyof Expense;
  direction: 'asc' | 'desc';
}
```

#### Step 2: Implement State Management (4 min)

```typescript
// src/components/ExpensePageWithState.tsx
import React, { useReducer, useEffect } from 'react';
import { 
  AsyncState, 
  ExpensePageState, 
  FormState 
} from '../types/state';
import { Expense, NewExpense } from '../types';

// Action types
type ExpenseAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; expenses: Expense[] }
  | { type: 'LOAD_ERROR'; error: Error }
  | { type: 'CHANGE_VIEW'; view: ExpensePageState }
  | { type: 'UPDATE_FILTER'; filter: Partial<ExpenseFilter> }
  | { type: 'SORT'; field: keyof Expense; direction: 'asc' | 'desc' };

// Reducer with discriminated unions
function expenseReducer(
  state: {
    data: AsyncState<Expense[]>;
    page: ExpensePageState;
  },
  action: ExpenseAction
) {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        data: { status: 'loading' as const }
      };
      
    case 'LOAD_SUCCESS':
      return {
        ...state,
        data: {
          status: 'success' as const,
          data: action.expenses,
          timestamp: Date.now()
        }
      };
      
    case 'LOAD_ERROR':
      return {
        ...state,
        data: {
          status: 'error' as const,
          error: action.error,
          canRetry: true
        }
      };
      
    case 'CHANGE_VIEW':
      return {
        ...state,
        page: action.view
      };
      
    case 'UPDATE_FILTER':
      if (state.page.view !== 'list') return state;
      return {
        ...state,
        page: {
          ...state.page,
          filter: { ...state.page.filter, ...action.filter }
        }
      };
      
    case 'SORT':
      if (state.page.view !== 'list') return state;
      return {
        ...state,
        page: {
          ...state.page,
          sort: { field: action.field, direction: action.direction }
        }
      };
      
    default:
      return state;
  }
}

// Component using discriminated unions
function ExpensePageWithState() {
  const [state, dispatch] = useReducer(expenseReducer, {
    data: { status: 'idle' },
    page: {
      view: 'list',
      filter: {
        categories: [],
        dateRange: null,
        amountRange: null,
        searchTerm: ''
      },
      sort: { field: 'date', direction: 'desc' }
    }
  });

  // Load expenses
  useEffect(() => {
    if (state.data.status === 'idle') {
      dispatch({ type: 'LOAD_START' });
      
      fetch('/api/expenses')
        .then(res => res.json())
        .then(expenses => {
          dispatch({ type: 'LOAD_SUCCESS', expenses });
        })
        .catch(error => {
          dispatch({ type: 'LOAD_ERROR', error });
        });
    }
  }, [state.data.status]);

  // Type-safe rendering based on state
  const renderContent = () => {
    // Handle async state
    switch (state.data.status) {
      case 'idle':
        return <div>Ready to load expenses</div>;
        
      case 'loading':
        return (
          <div className="loading">
            <div className="spinner" />
            <p>Loading expenses...</p>
            {state.data.progress && (
              <progress value={state.data.progress} max={100} />
            )}
          </div>
        );
        
      case 'error':
        return (
          <div className="error">
            <p>Error: {state.data.error.message}</p>
            {state.data.canRetry && (
              <button onClick={() => dispatch({ type: 'LOAD_START' })}>
                Retry
              </button>
            )}
          </div>
        );
        
      case 'success':
        // Handle page state
        switch (state.page.view) {
          case 'list':
            return (
              <ExpenseListView
                expenses={state.data.data}
                filter={state.page.filter}
                sort={state.page.sort}
                onFilterChange={(filter) => 
                  dispatch({ type: 'UPDATE_FILTER', filter })
                }
                onSort={(field, direction) => 
                  dispatch({ type: 'SORT', field, direction })
                }
                onAddClick={() => 
                  dispatch({ 
                    type: 'CHANGE_VIEW', 
                    view: { view: 'add', draft: {} } 
                  })
                }
              />
            );
            
          case 'add':
            return (
              <ExpenseAddView
                draft={state.page.draft}
                onSubmit={async (expense) => {
                  // Handle submission
                  dispatch({ 
                    type: 'CHANGE_VIEW', 
                    view: { 
                      view: 'list',
                      filter: state.page.view === 'list' 
                        ? state.page.filter 
                        : { categories: [], dateRange: null, amountRange: null, searchTerm: '' },
                      sort: state.page.view === 'list'
                        ? state.page.sort
                        : { field: 'date', direction: 'desc' }
                    }
                  });
                }}
                onCancel={() => 
                  dispatch({ 
                    type: 'CHANGE_VIEW', 
                    view: { 
                      view: 'list',
                      filter: { categories: [], dateRange: null, amountRange: null, searchTerm: '' },
                      sort: { field: 'date', direction: 'desc' }
                    }
                  })
                }
              />
            );
            
          case 'edit':
            return (
              <ExpenseEditView
                expense={state.page.expense}
                changes={state.page.changes}
                onSave={async (updates) => {
                  // Handle save
                }}
                onCancel={() => 
                  dispatch({ 
                    type: 'CHANGE_VIEW', 
                    view: { 
                      view: 'detail', 
                      expense: state.page.expense 
                    }
                  })
                }
              />
            );
            
          case 'detail':
            return (
              <ExpenseDetailView
                expense={state.page.expense}
                onEdit={() => 
                  dispatch({ 
                    type: 'CHANGE_VIEW', 
                    view: { 
                      view: 'edit', 
                      expense: state.page.expense,
                      changes: {}
                    }
                  })
                }
                onBack={() => 
                  dispatch({ 
                    type: 'CHANGE_VIEW', 
                    view: { 
                      view: 'list',
                      filter: { categories: [], dateRange: null, amountRange: null, searchTerm: '' },
                      sort: { field: 'date', direction: 'desc' }
                    }
                  })
                }
              />
            );
        }
    }
  };

  return <div className="expense-page">{renderContent()}</div>;
}
```

#### Step 3: Form State Example (4 min)

```typescript
// Form component with discriminated union state
function ExpenseFormWithState({ onSubmit }: { onSubmit: (expense: NewExpense) => void }) {
  const [formState, setFormState] = useState<FormState<NewExpense>>({
    status: 'idle'
  });

  const [formData, setFormData] = useState<NewExpense>({
    amount: 0,
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const validate = (): Record<keyof NewExpense, string[]> | null => {
    const errors: Record<keyof NewExpense, string[]> = {
      amount: [],
      category: [],
      description: [],
      date: []
    };

    if (formData.amount <= 0) {
      errors.amount.push('Amount must be positive');
    }
    if (formData.amount > 10000) {
      errors.amount.push('Amount seems too high');
    }

    if (!formData.description.trim()) {
      errors.description.push('Description is required');
    }
    if (formData.description.length > 100) {
      errors.description.push('Description too long');
    }

    const hasErrors = Object.values(errors).some(arr => arr.length > 0);
    return hasErrors ? errors : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start validation
    setFormState({ 
      status: 'validating', 
      fields: ['amount', 'description', 'date', 'category'] 
    });

    const errors = validate();
    if (errors) {
      setFormState({ status: 'error', errors });
      return;
    }

    // Start submission
    setFormState({ status: 'submitting' });

    try {
      await onSubmit(formData);
      setFormState({ status: 'success', data: formData });
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          amount: 0,
          category: 'Food',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        setFormState({ status: 'idle' });
      }, 2000);
    } catch (error) {
      setFormState({
        status: 'error',
        errors: {
          amount: [],
          category: [],
          description: ['Failed to save expense'],
          date: []
        }
      });
    }
  };

  // Render based on form state
  const renderFormState = () => {
    switch (formState.status) {
      case 'idle':
        return null;
        
      case 'validating':
        return (
          <div className="form-status validating">
            Validating {formState.fields.join(', ')}...
          </div>
        );
        
      case 'submitting':
        return (
          <div className="form-status submitting">
            <div className="spinner" />
            Saving expense...
            {formState.progress && (
              <progress value={formState.progress} max={100} />
            )}
          </div>
        );
        
      case 'success':
        return (
          <div className="form-status success">
            ✓ Expense added successfully!
          </div>
        );
        
      case 'error':
        return (
          <div className="form-errors">
            {Object.entries(formState.errors).map(([field, errors]) => 
              errors.map((error, idx) => (
                <div key={`${field}-${idx}`} className="error">
                  {field}: {error}
                </div>
              ))
            )}
          </div>
        );
    }
  };

  const isDisabled = formState.status === 'submitting' || formState.status === 'validating';

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {renderFormState()}
      
      {/* Form fields with error highlighting */}
      <input
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: +e.target.value })}
        className={
          formState.status === 'error' && formState.errors.amount.length > 0 
            ? 'error' 
            : ''
        }
        disabled={isDisabled}
      />
      
      {/* Other fields... */}
      
      <button type="submit" disabled={isDisabled}>
        {formState.status === 'submitting' ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  );
}
```

## Common Patterns & Best Practices

### Type Narrowing with Discriminated Unions
```typescript
// Helper function for type narrowing
function isSuccessState<T>(
  state: AsyncState<T>
): state is { status: 'success'; data: T; timestamp: number } {
  return state.status === 'success';
}

// Usage
if (isSuccessState(dataState)) {
  // TypeScript knows dataState.data exists here
  console.log(dataState.data);
}
```

### Generic Constraints
```typescript
// Ensure T has required properties
function sortBy<T extends { [key: string]: any }>(
  items: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
```

### Utility Types
```typescript
// Make certain properties required
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Usage
type DraftExpense = Partial<Expense>;
type ValidExpense = RequireFields<DraftExpense, 'amount' | 'description'>;
```

## Success Criteria

### For Any Feature:
- [ ] TypeScript compiles without errors
- [ ] No `any` types used
- [ ] Feature is genuinely reusable
- [ ] Code is more maintainable than before
- [ ] IntelliSense provides helpful suggestions

### Feature-Specific:
- **Generic Filter**: Works with multiple data types
- **Custom Hook**: Encapsulates complex logic cleanly  
- **Discriminated Unions**: Impossible states are impossible

## Debugging Tips

1. **Type Inference Not Working**
   - Add explicit type annotations
   - Check generic constraints
   - Use `as const` for literal types

2. **Complex Generic Errors**
   - Break down into smaller pieces
   - Add intermediate type aliases
   - Use IDE to see inferred types

3. **Union Type Issues**
   - Ensure discriminator property is unique
   - Use type guards for narrowing
   - Check exhaustiveness in switches

## Assessment Rubric

- **Implementation (40%)**: Feature works correctly
- **Type Safety (30%)**: Proper use of TypeScript features
- **Reusability (20%)**: Can be used in multiple contexts
- **Code Quality (10%)**: Clean, readable, documented