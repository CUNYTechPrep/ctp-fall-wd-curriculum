# I DO Block 2: Props and State Demo - Detailed Guide

## Overview
Duration: 15 minutes  
Learning Target: Demonstrate state management and prop passing to create interactive components

## Pre-Demo Setup

### Quick Recap
- Components built in Block 1 are static
- Now we'll make them interactive
- State holds data that changes over time
- Props pass data and functions between components

### Key Concepts to Reinforce
- State is private to a component
- Props flow down, events flow up
- Never mutate state directly
- React re-renders when state changes

## Part 1: Adding State to ExpenseList (7 minutes)

### Step 1: Import useState and Enhance ExpenseList (2 min)

```jsx
// Enhanced ExpenseList.jsx
import { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import './ExpenseList.css';

function ExpenseList() {
  // State for managing expenses - explain useState syntax
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 45.99,
      category: 'Food',
      description: 'Lunch at cafe',
      date: '2024-01-15'
    }
  ]);

  // State for filter - demonstrate multiple state variables
  const [filterCategory, setFilterCategory] = useState('All');

  return (
    <div className="expense-list">
      {/* Component JSX */}
    </div>
  );
}
```

**Think-Aloud Points:**
- "useState returns an array: [value, setter]"
- "We destructure it for cleaner code"
- "Initial state can be a value or a function"
- "Each state variable is independent"

### Step 2: Add Computed Values and Filtering (3 min)

```jsx
function ExpenseList() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 45.99,
      category: 'Food',
      description: 'Lunch at cafe',
      date: '2024-01-15'
    },
    {
      id: 2,
      amount: 120.00,
      category: 'Transport',
      description: 'Monthly metro card',
      date: '2024-01-14'
    }
  ]);

  const [filterCategory, setFilterCategory] = useState('All');

  // Calculate total - derived state
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Filter expenses based on category
  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory);

  // Get unique categories for filter
  const categories = ['All', ...new Set(expenses.map(e => e.category))];

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <h2>Recent Expenses</h2>
        <p className="expense-total">
          Total: ${total.toFixed(2)} ({filteredExpenses.length} items)
        </p>
      </div>

      <div className="expense-controls">
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="expense-filter"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="expense-list-items">
        {filteredExpenses.map(expense => (
          <ExpenseCard
            key={expense.id}
            amount={expense.amount}
            category={expense.category}
            description={expense.description}
            date={expense.date}
          />
        ))}
      </div>
    </div>
  );
}
```

**Think-Aloud Points:**
- "Derived state (total, filtered) calculated on each render"
- "Don't store what you can calculate"
- "Filter creates a new array, doesn't modify original"
- "onChange handler updates state, triggering re-render"

### Step 3: Add CRUD Operations (2 min)

```jsx
function ExpenseList() {
  const [expenses, setExpenses] = useState([/* ... */]);
  const [filterCategory, setFilterCategory] = useState('All');

  // Add new expense - explain state immutability
  const addExpense = (newExpense) => {
    setExpenses([...expenses, { 
      ...newExpense, 
      id: Date.now() // Simple ID generation
    }]);
  };

  // Delete expense - filter creates new array
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Update expense - map creates new array
  const updateExpense = (id, updates) => {
    setExpenses(expenses.map(expense => 
      expense.id === id 
        ? { ...expense, ...updates }
        : expense
    ));
  };

  // Pass callbacks to children via props
  return (
    <div className="expense-list">
      {/* Header and controls */}
      
      <ExpenseForm onAddExpense={addExpense} />

      <div className="expense-list-items">
        {filteredExpenses.map(expense => (
          <ExpenseCard
            key={expense.id}
            amount={expense.amount}
            category={expense.category}
            description={expense.description}
            date={expense.date}
            onDelete={() => deleteExpense(expense.id)}
            onEdit={(updates) => updateExpense(expense.id, updates)}
          />
        ))}
      </div>
    </div>
  );
}
```

**Key Points:**
- "Never mutate state directly - always create new arrays/objects"
- "Spread operator (...) creates shallow copies"
- "Callbacks (like onDelete) let children communicate up"
- "Arrow functions in props can cause performance issues (we'll optimize later)"

## Part 2: Creating Interactive Form Component (8 minutes)

### Step 1: Build Controlled Form Component (4 min)

```jsx
// ExpenseForm.jsx
import { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ onAddExpense }) {
  // Form state - single object vs multiple states
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Handle input changes - single handler for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form className="expense-form">
      {/* Form fields */}
    </form>
  );
}

export default ExpenseForm;
```

**Think-Aloud Points:**
- "Controlled components - React controls form values"
- "Single source of truth in state"
- "Computed property names [name]: value"
- "Real-time validation feedback"

### Step 2: Complete Form with Validation (4 min)

```jsx
function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.description.length > 50) {
      newErrors.description = 'Description must be less than 50 characters';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert amount to number before passing up
      await onAddExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Reset form on success
      setFormData({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      // Show success message (could use toast)
      console.log('Expense added successfully!');
    } catch (error) {
      setErrors({ submit: 'Failed to add expense. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Add New Expense</h3>
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      
      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          className={errors.amount ? 'error' : ''}
          disabled={isSubmitting}
        />
        {errors.amount && (
          <span className="field-error">{errors.amount}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select 
          id="category"
          name="category" 
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What did you spend on?"
          className={errors.description ? 'error' : ''}
          disabled={isSubmitting}
        />
        {errors.description && (
          <span className="field-error">{errors.description}</span>
        )}
        <span className="field-hint">
          {formData.description.length}/50 characters
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={new Date().toISOString().split('T')[0]}
          disabled={isSubmitting}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
```

### Form Styling

```css
/* ExpenseForm.css */
.expense-form {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.expense-form h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #1F2937;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-group input.error {
  border-color: #DC2626;
}

.field-error {
  display: block;
  color: #DC2626;
  font-size: 14px;
  margin-top: 4px;
}

.field-hint {
  display: block;
  color: #6B7280;
  font-size: 14px;
  margin-top: 4px;
}

.error-message {
  background: #FEE2E2;
  border: 1px solid #FCA5A5;
  color: #DC2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: #4338CA;
}

.submit-button:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

/* Responsive layout */
@media (min-width: 768px) {
  .expense-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .expense-form h3,
  .error-message,
  .submit-button {
    grid-column: span 2;
  }
}
```

## Key Concepts Emphasized Throughout Demo

### State Management Patterns
1. **State Initialization**
   - Use function for expensive computations
   - Set sensible defaults

2. **State Updates**
   - Always immutable updates
   - Use functional updates when depending on previous state
   - Batch updates happen automatically

3. **Form Handling**
   - Controlled components for predictable behavior
   - Single source of truth
   - Real-time validation
   - Proper error handling

### Event Handling Best Practices
```jsx
// Good: Named functions for clarity
const handleDelete = (id) => {
  setExpenses(prev => prev.filter(e => e.id !== id));
};

// Avoid: Inline complex logic
onClick={() => {
  // Complex logic here
}}

// Good: Prevent default for forms
const handleSubmit = (e) => {
  e.preventDefault();
  // Handle submission
};
```

### Props Patterns
```jsx
// Callback props for child-to-parent communication
<ExpenseForm onAddExpense={addExpense} />

// Multiple props including callbacks
<ExpenseCard
  {...expense}
  onDelete={() => deleteExpense(expense.id)}
  onEdit={(updates) => updateExpense(expense.id, updates)}
/>

// Default props with destructuring
function Component({ title = "Default Title", items = [] }) {
  // Component logic
}
```

## Common Questions & Teaching Points

### Q: "Why not just modify the array directly?"
A: "React uses Object.is() to detect changes. If you mutate, the reference stays the same, so React doesn't know to re-render."

### Q: "When should I use multiple useState vs one object?"
A: "Use separate useState for unrelated data. Use object for related form fields or complex state."

### Q: "Why do we need key in map?"
A: "Keys help React identify which items have changed, added, or removed. Use stable, unique IDs."

## Debugging Scenarios to Demonstrate

### 1. State Not Updating
```jsx
// Wrong - mutating state
const handleAdd = (item) => {
  expenses.push(item); // ❌ Mutation
  setExpenses(expenses); // ❌ Same reference
};

// Right - creating new array
const handleAdd = (item) => {
  setExpenses([...expenses, item]); // ✅ New array
};
```

### 2. Stale Closure Issue
```jsx
// Problem - using stale state
setTimeout(() => {
  setCount(count + 1); // Uses old count
}, 1000);

// Solution - functional update
setTimeout(() => {
  setCount(prev => prev + 1); // Always current
}, 1000);
```

### 3. Event Handler Reference
```jsx
// Problem - new function every render
<button onClick={() => handleClick(id)}>

// Solution - useCallback or stable reference
const handleClick = useCallback((id) => {
  // Handle click
}, []);
```

## Professional Insights

1. **"This is how forms work in production React apps"**
   - Controlled components are predictable
   - Validation provides better UX
   - Error states guide users

2. **"State management gets complex - that's why Redux/Context exist"**
   - Local state is perfect for UI state
   - Lift state up when sharing between components
   - Consider state management libraries for large apps

3. **"Performance considerations come later"**
   - First make it work
   - Then make it right
   - Finally make it fast

## Assessment Points

Watch for understanding of:
- State vs props distinction
- Immutability importance
- Event handling syntax
- Controlled component concept
- Parent-child communication

## Transition to YOU DO
"Now you'll add interactivity to your components. Remember: state for data that changes, props for passing data down, callbacks for communication up. Make your expense tracker come alive!"