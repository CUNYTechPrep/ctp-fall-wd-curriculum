# YOU DO Block 2: Interactive Components - Detailed Guide

## Overview
Duration: 15 minutes  
Learning Target: Students add interactivity to their expense tracker components using React state and event handling

## Pre-Activity Context

### What Students Should Know
- Basic component structure from YOU DO Block 1
- useState hook syntax from I DO Block 2
- Event handling basics
- Props passing between components

### Interactive Features to Implement

Students choose ONE primary feature to implement:

1. **Toggle Expense Visibility** - Show/hide expense details
2. **Expense Counter** - Track additions/deletions with visual feedback
3. **Category Filter** - Dynamic filtering with state
4. **Sort Functionality** - Sort by amount, date, or category

## Feature Option 1: Toggle Expense Visibility (Recommended for Beginners)

### Implementation Guide

#### Step 1: Add State to ExpenseCard (3 min)

```jsx
// Enhanced ExpenseCard.jsx
import { useState } from 'react';
import './ExpenseCard.css';

function ExpenseCard({ amount, category, description, date }) {
  // State for controlling detail visibility
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString();

  // Toggle function
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className={`expense-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="expense-header" onClick={toggleExpanded}>
        <div className="expense-main-info">
          <span className="expense-category">{category}</span>
          <p className="expense-amount">{formattedAmount}</p>
        </div>
        <button 
          className="expand-button"
          aria-label={isExpanded ? 'Hide details' : 'Show details'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="expense-details">
          <p className="expense-description">{description}</p>
          <time className="expense-date">{formattedDate}</time>
        </div>
      )}
    </article>
  );
}
```

#### Step 2: Add Transition Styles (2 min)

```css
/* Add to ExpenseCard.css */
.expense-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expense-main-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.expand-button {
  background: none;
  border: none;
  font-size: 16px;
  color: #6B7280;
  cursor: pointer;
  padding: 8px;
  transition: transform 0.2s;
}

.expense-card.expanded .expand-button {
  transform: rotate(0deg);
}

.expense-details {
  padding-top: 12px;
  border-top: 1px solid #E5E7EB;
  margin-top: 12px;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Feature Option 2: Expense Counter with Visual Feedback

### Implementation Guide

#### Step 1: Add Counter State to App Level (3 min)

```jsx
// In App.jsx or parent component
import { useState, useEffect } from 'react';

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([
    { id: 1, amount: 45.99, category: 'Food', description: 'Lunch', date: '2024-01-15' }
  ]);
  
  const [stats, setStats] = useState({
    added: 0,
    deleted: 0,
    modified: 0
  });
  
  const [recentAction, setRecentAction] = useState(null);

  // Add expense with tracking
  const addExpense = (newExpense) => {
    setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
    setStats(prev => ({ ...prev, added: prev.added + 1 }));
    setRecentAction({ type: 'added', timestamp: Date.now() });
  };

  // Delete expense with tracking
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
    setStats(prev => ({ ...prev, deleted: prev.deleted + 1 }));
    setRecentAction({ type: 'deleted', timestamp: Date.now() });
  };

  // Clear recent action after 3 seconds
  useEffect(() => {
    if (recentAction) {
      const timer = setTimeout(() => setRecentAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [recentAction]);

  return (
    <div>
      <ActivityTracker stats={stats} recentAction={recentAction} />
      {/* Rest of components */}
    </div>
  );
}
```

#### Step 2: Create Activity Tracker Component (2 min)

```jsx
// ActivityTracker.jsx
function ActivityTracker({ stats, recentAction }) {
  return (
    <div className="activity-tracker">
      <h3>Session Activity</h3>
      <div className="activity-stats">
        <div className="stat-item added">
          <span className="stat-icon">➕</span>
          <span className="stat-count">{stats.added}</span>
          <span className="stat-label">Added</span>
        </div>
        <div className="stat-item deleted">
          <span className="stat-icon">➖</span>
          <span className="stat-count">{stats.deleted}</span>
          <span className="stat-label">Deleted</span>
        </div>
        <div className="stat-item modified">
          <span className="stat-icon">✏️</span>
          <span className="stat-count">{stats.modified}</span>
          <span className="stat-label">Modified</span>
        </div>
      </div>
      
      {recentAction && (
        <div className={`recent-action ${recentAction.type}`}>
          Expense {recentAction.type}!
        </div>
      )}
    </div>
  );
}
```

## Feature Option 3: Category Filter with Multi-Select

### Implementation Guide

#### Step 1: Create Filter Component (4 min)

```jsx
// CategoryFilter.jsx
import { useState } from 'react';

function CategoryFilter({ categories, onFilterChange }) {
  const [selectedCategories, setSelectedCategories] = useState(new Set(['All']));

  const toggleCategory = (category) => {
    const newSelected = new Set(selectedCategories);
    
    if (category === 'All') {
      // If "All" is clicked, clear other selections
      setSelectedCategories(new Set(['All']));
      onFilterChange(['All']);
    } else {
      // Remove "All" if it's selected
      newSelected.delete('All');
      
      // Toggle the specific category
      if (newSelected.has(category)) {
        newSelected.delete(category);
      } else {
        newSelected.add(category);
      }
      
      // If no categories selected, select "All"
      if (newSelected.size === 0) {
        newSelected.add('All');
      }
      
      setSelectedCategories(newSelected);
      onFilterChange(Array.from(newSelected));
    }
  };

  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${selectedCategories.has('All') ? 'active' : ''}`}
          onClick={() => toggleCategory('All')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${selectedCategories.has(cat) ? 'active' : ''}`}
            onClick={() => toggleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <p className="filter-count">
        {selectedCategories.has('All') 
          ? 'Showing all categories' 
          : `Filtering ${selectedCategories.size} categories`}
      </p>
    </div>
  );
}
```

#### Step 2: Filter Styling (2 min)

```css
/* CategoryFilter.css */
.category-filter {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.filter-btn {
  padding: 8px 16px;
  border: 2px solid #E5E7EB;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: #4F46E5;
}

.filter-btn.active {
  background: #4F46E5;
  color: white;
  border-color: #4F46E5;
  transform: scale(1.05);
}

.filter-count {
  margin-top: 12px;
  font-size: 14px;
  color: #6B7280;
}
```

## Feature Option 4: Sort Functionality

### Implementation Guide

#### Step 1: Add Sort State and Logic (4 min)

```jsx
// In ExpenseList.jsx
import { useState, useMemo } from 'react';

function ExpenseList({ expenses }) {
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  // Memoized sorted expenses
  const sortedExpenses = useMemo(() => {
    const sorted = [...expenses];
    
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle date sorting
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle string sorting (category)
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sorted;
  }, [expenses, sortConfig]);

  // Handle sort change
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="expense-list">
      <SortControls 
        sortConfig={sortConfig} 
        onSort={handleSort} 
      />
      
      <div className="expense-items">
        {sortedExpenses.map(expense => (
          <ExpenseCard key={expense.id} {...expense} />
        ))}
      </div>
    </div>
  );
}
```

#### Step 2: Create Sort Controls (2 min)

```jsx
// SortControls.jsx
function SortControls({ sortConfig, onSort }) {
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="sort-controls">
      <span className="sort-label">Sort by:</span>
      <button 
        className={`sort-btn ${sortConfig.key === 'date' ? 'active' : ''}`}
        onClick={() => onSort('date')}
      >
        Date {getSortIcon('date')}
      </button>
      <button 
        className={`sort-btn ${sortConfig.key === 'amount' ? 'active' : ''}`}
        onClick={() => onSort('amount')}
      >
        Amount {getSortIcon('amount')}
      </button>
      <button 
        className={`sort-btn ${sortConfig.key === 'category' ? 'active' : ''}`}
        onClick={() => onSort('category')}
      >
        Category {getSortIcon('category')}
      </button>
    </div>
  );
}
```

## Connecting Components Together (3 minutes)

### Parent-Child Communication Pattern

```jsx
// Parent Component (App.jsx or ExpenseList.jsx)
function ParentComponent() {
  const [filter, setFilter] = useState('All');
  const [expenses, setExpenses] = useState([/* ... */]);
  
  // Filter logic
  const filteredExpenses = filter === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === filter);
  
  // Callback for child
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    console.log(`Filter changed to: ${newFilter}`);
  };
  
  return (
    <>
      <FilterComponent 
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />
      <ExpenseList expenses={filteredExpenses} />
    </>
  );
}
```

## Common Implementation Patterns

### Pattern 1: Toggle State
```jsx
const [isVisible, setIsVisible] = useState(false);
const toggle = () => setIsVisible(!isVisible);
```

### Pattern 2: Multi-Select State
```jsx
const [selected, setSelected] = useState(new Set());
const toggle = (item) => {
  const newSet = new Set(selected);
  newSet.has(item) ? newSet.delete(item) : newSet.add(item);
  setSelected(newSet);
};
```

### Pattern 3: Computed Values
```jsx
const totalByCategory = useMemo(() => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
}, [expenses]);
```

## Success Criteria

### Core Requirements:
- [ ] At least one interactive feature implemented
- [ ] State updates trigger re-renders correctly
- [ ] Event handlers work without errors
- [ ] Props passed between components successfully
- [ ] User interactions feel responsive

### Code Quality:
- [ ] useState hook used correctly
- [ ] Event handlers properly bound
- [ ] No direct state mutations
- [ ] Clear variable and function names
- [ ] Console free of errors

### Bonus Points:
- [ ] Animation/transitions added
- [ ] Multiple features combined
- [ ] Accessibility considerations (ARIA labels)
- [ ] Performance optimization (useMemo/useCallback)

## Debugging Guide

### Common Issues:

1. **State Not Updating Visually**
```jsx
// Wrong - mutating array
expenses.push(newExpense);
setExpenses(expenses);

// Right - creating new array
setExpenses([...expenses, newExpense]);
```

2. **Event Handler Not Working**
```jsx
// Wrong - calling function immediately
<button onClick={handleClick()}>

// Right - passing function reference
<button onClick={handleClick}>
// or
<button onClick={() => handleClick(id)}>
```

3. **Infinite Re-renders**
```jsx
// Wrong - updating state in render
const Component = () => {
  const [count, setCount] = useState(0);
  setCount(count + 1); // Causes infinite loop
  
  return <div>{count}</div>;
};

// Right - update in event handler or effect
const Component = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Update based on some condition
  }, []);
  
  return <div>{count}</div>;
};
```

## Assessment Rubric

### Functionality (40%)
- Feature works as expected
- State updates correctly
- No console errors
- Smooth user experience

### Implementation (30%)
- Proper use of hooks
- Clean event handling
- Efficient state updates
- Good component structure

### Code Quality (20%)
- Readable code
- Meaningful names
- Proper formatting
- Comments where helpful

### Innovation (10%)
- Creative solutions
- Extra features
- Good UX decisions
- Performance considerations

## Tips for Instructors

1. **Encourage experimentation** - It's okay to try and fail
2. **Promote peer help** - Students can learn from each other
3. **Show debugging process** - How to use React DevTools
4. **Celebrate small wins** - Even simple interactivity is an achievement
5. **Prepare for questions** - Have examples of each feature ready