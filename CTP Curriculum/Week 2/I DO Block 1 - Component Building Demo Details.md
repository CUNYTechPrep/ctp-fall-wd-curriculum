# I DO Block 1: Component Building Demo - Detailed Guide

## Overview
Duration: 20 minutes  
Learning Target: Demonstrate building production-quality React components with professional patterns

## Pre-Demo Setup

### Environment Preparation
- CodeSpaces with React project initialized
- File structure ready to create
- Browser DevTools open for debugging
- React Developer Tools extension enabled

### Mental Model to Establish
- Components are reusable UI building blocks
- Props flow down, events flow up
- Each component has a single responsibility
- Think in terms of composition, not inheritance

## Part 1: Setup & File Structure (3 minutes)

### Creating Professional Component Structure

#### 1. Explain the Organization (1 min)
"We're going to organize our components in a scalable way. Each component gets its own folder with all related files."

```bash
# In the terminal, create structure
mkdir -p src/components/ExpenseCard
mkdir -p src/components/ExpenseList
```

#### 2. File Structure Explanation
```
src/
  components/
    ExpenseCard/
      ExpenseCard.jsx      # Component logic
      ExpenseCard.css      # Component styles
      index.js            # Export file
    ExpenseList/
      ExpenseList.jsx
      ExpenseList.css
      index.js
```

#### 3. Think-Aloud Points
- "This scales better than a flat structure"
- "Related files stay together"
- "Easy to find and move components"
- "Each component is self-contained"

### Create Index Files (2 min)
```javascript
// ExpenseCard/index.js
export { default } from './ExpenseCard';

// This pattern allows us to import like:
// import ExpenseCard from './components/ExpenseCard';
// Instead of:
// import ExpenseCard from './components/ExpenseCard/ExpenseCard';
```

## Part 2: Build ExpenseCard Component (8 minutes)

### Step 1: Component Shell (1 min)

```jsx
// ExpenseCard.jsx
import './ExpenseCard.css';

function ExpenseCard() {
  return (
    <article className="expense-card">
      <h3>ExpenseCard Component</h3>
    </article>
  );
}

export default ExpenseCard;
```

**Think-Aloud:**
- "Start simple, build incrementally"
- "Using semantic HTML - article for self-contained content"
- "Function components are the modern standard"

### Step 2: Add Props Interface (2 min)

```jsx
/**
 * Displays a single expense item
 * @param {Object} props
 * @param {number} props.amount - Expense amount in dollars
 * @param {string} props.category - Expense category
 * @param {string} props.description - Expense description
 * @param {string} props.date - Expense date
 */
function ExpenseCard({ amount, category, description, date }) {
  return (
    <article className="expense-card">
      <div className="expense-header">
        <span className="expense-category">{category}</span>
        <time className="expense-date">{date}</time>
      </div>
      <div className="expense-body">
        <p className="expense-description">{description}</p>
        <p className="expense-amount">${amount}</p>
      </div>
    </article>
  );
}
```

**Think-Aloud:**
- "JSDoc comments help Copilot and teammates"
- "Destructuring props makes code cleaner"
- "Semantic HTML improves accessibility"

### Step 3: Add Formatting Logic (3 min)

```jsx
function ExpenseCard({ amount, category, description, date }) {
  // Format currency for display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Determine color based on amount
  const amountClass = amount > 100 ? 'expense-high' : 'expense-normal';

  return (
    <article className="expense-card">
      <div className="expense-header">
        <span className="expense-category">{category}</span>
        <time className="expense-date" dateTime={date}>
          {formattedDate}
        </time>
      </div>
      <div className="expense-body">
        <p className="expense-description">{description}</p>
        <p className={`expense-amount ${amountClass}`}>
          {formattedAmount}
        </p>
      </div>
    </article>
  );
}
```

**Think-Aloud:**
- "Formatting logic stays in the component"
- "Using Intl API for proper localization"
- "Conditional styling based on business logic"
- "dateTime attribute for accessibility"

### Step 4: Complete Component with PropTypes (2 min)

```jsx
import PropTypes from 'prop-types';
import './ExpenseCard.css';

function ExpenseCard({ amount, category, description, date }) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const amountClass = amount > 100 ? 'expense-high' : 'expense-normal';

  return (
    <article className="expense-card">
      <div className="expense-header">
        <span className="expense-category">{category}</span>
        <time className="expense-date" dateTime={date}>
          {formattedDate}
        </time>
      </div>
      <div className="expense-body">
        <p className="expense-description">{description}</p>
        <p className={`expense-amount ${amountClass}`}>
          {formattedAmount}
        </p>
      </div>
    </article>
  );
}

// PropTypes for runtime type checking
ExpenseCard.propTypes = {
  amount: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired
};

export default ExpenseCard;
```

## Part 3: Add Professional Styling (5 minutes)

### Create ExpenseCard.css

```css
/* ExpenseCard.css */

/* Container styling with modern card design */
.expense-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

/* Hover effect for interactivity */
.expense-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Header layout */
.expense-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

/* Category badge styling */
.expense-category {
  background: #4F46E5;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Date styling */
.expense-date {
  color: #6B7280;
  font-size: 14px;
}

/* Body content */
.expense-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

/* Description text */
.expense-description {
  color: #374151;
  font-size: 16px;
  margin: 0;
  flex: 1;
}

/* Amount styling with size emphasis */
.expense-amount {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  margin-left: 16px;
}

/* Conditional amount colors */
.expense-amount.expense-high {
  color: #DC2626; /* Red for high expenses */
}

.expense-amount.expense-normal {
  color: #059669; /* Green for normal expenses */
}

/* Responsive design */
@media (max-width: 640px) {
  .expense-card {
    padding: 12px;
  }
  
  .expense-body {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .expense-amount {
    margin-left: 0;
    margin-top: 8px;
  }
}
```

**Styling Explanation Points:**
- "Modern card design with subtle shadows"
- "Hover effects provide user feedback"
- "Flexbox for responsive layouts"
- "Mobile-first responsive design"
- "Semantic color choices (red for high, green for normal)"

## Part 4: Create Container Component (4 minutes)

### Build ExpenseList Component

```jsx
// ExpenseList.jsx
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import './ExpenseList.css';

function ExpenseList() {
  // Temporary mock data - will come from state later
  const expenses = [
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
    },
    {
      id: 3,
      amount: 25.50,
      category: 'Entertainment',
      description: 'Movie tickets',
      date: '2024-01-13'
    }
  ];

  // Calculate total for summary
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="expense-list">
      <div className="expense-list-header">
        <h2>Recent Expenses</h2>
        <p className="expense-total">Total: ${total.toFixed(2)}</p>
      </div>
      
      <div className="expense-list-items">
        {expenses.length === 0 ? (
          <p className="expense-empty">No expenses yet. Add your first expense!</p>
        ) : (
          expenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              amount={expense.amount}
              category={expense.category}
              description={expense.description}
              date={expense.date}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
```

### ExpenseList Styling

```css
/* ExpenseList.css */
.expense-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.expense-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.expense-list-header h2 {
  margin: 0;
  color: #1F2937;
  font-size: 28px;
}

.expense-total {
  font-size: 20px;
  font-weight: 600;
  color: #4F46E5;
}

.expense-list-items {
  /* Space for expense cards */
}

.expense-empty {
  text-align: center;
  color: #6B7280;
  padding: 40px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 2px dashed #E5E7EB;
}
```

### Key Teaching Points

**Think-Aloud Moments:**
1. "Always use key prop in lists - React needs it for efficient updates"
2. "Check for empty states - better UX"
3. "Container components manage data, presentational components display it"
4. "Calculate derived values (like total) in render"

**Best Practices Highlighted:**
- Component composition
- Separation of concerns
- Props validation
- Semantic HTML
- Responsive design
- Empty state handling

## Common Student Questions & Answers

### Q: "Why separate CSS files?"
A: "Component-specific styles prevent conflicts and make components portable. When you move a component, its styles go with it."

### Q: "When should I use className vs class?"
A: "Always use className in React. 'class' is a reserved word in JavaScript."

### Q: "Why destructure props?"
A: "Cleaner code and you immediately see what props the component expects."

### Q: "Should every component have PropTypes?"
A: "In production code, yes. It's like lightweight TypeScript for runtime checking."

## Debugging Tips to Share

### Common Errors:
1. **"Cannot read property 'map' of undefined"**
   - Always provide default props or check existence
   
2. **"Each child should have a unique key"**
   - Use stable, unique IDs, not array indexes

3. **"Objects are not valid as React child"**
   - Can't render objects directly, extract values

### VS Code Tips:
- Use ES7 React snippets extension
- `rafce` creates a functional component
- Emmet works in JSX with proper settings

## Professional Insights to Share

1. **"This component structure is how we build at scale"**
   - Real companies use this exact pattern
   - Makes code reviews easier
   - New developers can navigate quickly

2. **"Props make components reusable across your app"**
   - Same ExpenseCard for different contexts
   - Easy to test in isolation
   - Clear component contracts

3. **"Separation of concerns - each component has one job"**
   - ExpenseCard displays one expense
   - ExpenseList manages the collection
   - App coordinates everything

## Assessment Checkpoints

During the demo, check understanding:
- Can students identify props in the component?
- Do they understand the map function usage?
- Can they explain why we need keys?
- Do they see the parent-child relationship?

## Transition to YOU DO
"Now it's your turn to create components. Remember the patterns we just used - clear props, semantic HTML, and thoughtful styling. You'll create Header and ExpenseSummary components."