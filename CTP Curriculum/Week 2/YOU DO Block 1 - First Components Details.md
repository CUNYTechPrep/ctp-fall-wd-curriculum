# YOU DO Block 1: First Components - Detailed Guide

## Overview
Duration: 15 minutes  
Learning Target: Students create their first React components for the expense tracker

## Pre-Activity Setup

### Student Preparation Checklist
- CodeSpaces open with React project
- ExpenseCard and ExpenseList from demo visible for reference  
- Understanding of props and component structure
- App.jsx ready for importing new components

### Component Requirements

Students will create two components:

1. **Header Component**
   - App title and tagline
   - Navigation placeholder
   - User greeting (with props)
   - Responsive design

2. **ExpenseSummary Component**  
   - Total expenses display
   - Number of expenses
   - Average expense
   - Visual indicators

## Part 1: Header Component Creation (7 minutes)

### Step 1: File Structure Setup (1 min)

Students should create:
```bash
src/
  components/
    Header/
      Header.jsx
      Header.css
      index.js
```

### Step 2: Basic Header Component (3 min)

**Starter Code Guidance:**

```jsx
// Header.jsx
import './Header.css';

/**
 * Application header with title and navigation
 * @param {Object} props
 * @param {string} props.userName - Name of the logged-in user
 * @param {string} props.title - Application title
 */
function Header({ userName = 'Guest', title = 'Expense Tracker' }) {
  return (
    <header className="app-header">
      {/* Add your header content here */}
    </header>
  );
}

export default Header;
```

**Expected Student Implementation:**

```jsx
function Header({ userName = 'Guest', title = 'Expense Tracker' }) {
  // Get current hour for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
            <button className="nav-button">Dashboard</button>
            <button className="nav-button">Reports</button>
            <button className="nav-button">Settings</button>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

### Step 3: Header Styling (3 min)

**CSS Guidelines for Students:**

```css
/* Header.css */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.app-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.app-tagline {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-greeting {
  font-size: 16px;
  margin: 0;
}

.header-nav {
  display: flex;
  gap: 12px;
}

.nav-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .header-right {
    flex-direction: column;
  }
  
  .header-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
}
```

## Part 2: ExpenseSummary Component Creation (6 minutes)

### Step 1: Component Structure (2 min)

**File Setup:**
```bash
src/
  components/
    ExpenseSummary/
      ExpenseSummary.jsx
      ExpenseSummary.css
      index.js
```

### Step 2: ExpenseSummary Implementation (2 min)

**Starter Guidance:**

```jsx
// ExpenseSummary.jsx
import './ExpenseSummary.css';

/**
 * Displays summary statistics for expenses
 * @param {Object} props
 * @param {Array} props.expenses - Array of expense objects
 * @param {number} props.budget - Monthly budget (optional)
 */
function ExpenseSummary({ expenses = [], budget = 0 }) {
  // Calculate summary statistics here
  
  return (
    <div className="expense-summary">
      {/* Add your summary cards here */}
    </div>
  );
}

export default ExpenseSummary;
```

**Expected Implementation:**

```jsx
function ExpenseSummary({ expenses = [], budget = 0 }) {
  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expenseCount = expenses.length;
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
  
  // Calculate budget usage percentage
  const budgetUsage = budget > 0 ? (totalExpenses / budget) * 100 : 0;
  const budgetRemaining = budget - totalExpenses;
  
  // Determine budget status color
  const getBudgetStatus = () => {
    if (budgetUsage >= 100) return 'over-budget';
    if (budgetUsage >= 80) return 'warning';
    return 'good';
  };
  
  return (
    <div className="expense-summary">
      <div className="summary-card">
        <h3 className="summary-label">Total Spent</h3>
        <p className="summary-value">${totalExpenses.toFixed(2)}</p>
      </div>
      
      <div className="summary-card">
        <h3 className="summary-label">Expenses</h3>
        <p className="summary-value">{expenseCount}</p>
      </div>
      
      <div className="summary-card">
        <h3 className="summary-label">Average</h3>
        <p className="summary-value">${averageExpense.toFixed(2)}</p>
      </div>
      
      {budget > 0 && (
        <div className={`summary-card budget-card ${getBudgetStatus()}`}>
          <h3 className="summary-label">Budget Status</h3>
          <p className="summary-value">${budgetRemaining.toFixed(2)}</p>
          <div className="budget-progress">
            <div 
              className="budget-progress-bar"
              style={{ width: `${Math.min(budgetUsage, 100)}%` }}
            />
          </div>
          <p className="budget-percentage">{budgetUsage.toFixed(1)}% used</p>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Summary Styling (2 min)

```css
/* ExpenseSummary.css */
.expense-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-label {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #1F2937;
}

/* Budget card specific styles */
.budget-card {
  grid-column: span 2;
}

.budget-card.good .summary-value {
  color: #10B981;
}

.budget-card.warning .summary-value {
  color: #F59E0B;
}

.budget-card.over-budget .summary-value {
  color: #EF4444;
}

.budget-progress {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  margin: 16px 0 8px 0;
  overflow: hidden;
}

.budget-progress-bar {
  height: 100%;
  background: #10B981;
  transition: width 0.3s ease;
}

.warning .budget-progress-bar {
  background: #F59E0B;
}

.over-budget .budget-progress-bar {
  background: #EF4444;
}

.budget-percentage {
  margin: 0;
  font-size: 14px;
  color: #6B7280;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .expense-summary {
    grid-template-columns: 1fr;
  }
  
  .budget-card {
    grid-column: span 1;
  }
}
```

## Part 3: Integration and Testing (2 minutes)

### Import and Use Components in App.jsx

```jsx
// App.jsx
import Header from './components/Header';
import ExpenseSummary from './components/ExpenseSummary';
import ExpenseList from './components/ExpenseList';
import './App.css';

function App() {
  // Mock data for testing
  const mockExpenses = [
    { id: 1, amount: 45.99, category: 'Food', description: 'Lunch', date: '2024-01-15' },
    { id: 2, amount: 120.00, category: 'Transport', description: 'Gas', date: '2024-01-14' },
    { id: 3, amount: 25.50, category: 'Entertainment', description: 'Movie', date: '2024-01-13' }
  ];
  
  return (
    <div className="app">
      <Header userName="Sarah" />
      
      <main className="app-main">
        <ExpenseSummary 
          expenses={mockExpenses} 
          budget={500} 
        />
        
        <ExpenseList />
      </main>
    </div>
  );
}

export default App;
```

## Success Criteria Checklist

### For Header Component:
- [ ] Accepts and uses props (userName, title)
- [ ] Has default prop values
- [ ] Includes dynamic greeting based on time
- [ ] Responsive design implemented
- [ ] Professional styling applied
- [ ] No console errors

### For ExpenseSummary Component:
- [ ] Accepts expenses array prop
- [ ] Calculates total, count, and average
- [ ] Handles empty expense array gracefully
- [ ] Optional budget prop with visual indicator
- [ ] Grid layout responsive to screen size
- [ ] Clean, professional appearance

### Code Quality:
- [ ] Proper file organization
- [ ] JSDoc comments included
- [ ] Meaningful variable names
- [ ] No inline styles
- [ ] CSS classes follow naming convention

## Common Issues & Solutions

### Issue 1: Props not working
```jsx
// Problem: Forgetting to destructure
function Header(props) {
  return <h1>{userName}</h1>; // userName is undefined
}

// Solution: Destructure props
function Header({ userName }) {
  return <h1>{userName}</h1>;
}
```

### Issue 2: Calculations returning NaN
```jsx
// Problem: Not handling empty arrays
const average = total / expenses.length; // NaN when empty

// Solution: Check length first
const average = expenses.length > 0 ? total / expenses.length : 0;
```

### Issue 3: Styling not applied
```jsx
// Problem: Forgetting to import CSS
function Header() { /* ... */ }

// Solution: Import at top
import './Header.css';
```

## Extension Challenges

For students who finish early:

1. **Add Icons**
   - Use emoji or icon library
   - Add icons to summary cards
   - Create icon button components

2. **Enhanced Interactivity**
   - Add theme toggle to Header
   - Make nav buttons highlight active page
   - Add animation to budget progress bar

3. **Additional Features**
   - Add date range to ExpenseSummary
   - Show most expensive category
   - Add sparkline chart

## Tips for Success

1. **Start Simple**
   - Get basic structure working first
   - Add styling incrementally
   - Test with different props

2. **Use DevTools**
   - Check React Developer Tools
   - Inspect component props
   - Monitor console for errors

3. **Ask for Help**
   - Share screen if stuck
   - Check against reference implementation
   - Pair with another student

## Assessment Rubric

### Functionality (40%)
- Components render without errors
- Props are properly used
- Calculations are correct
- Default props work

### Code Quality (30%)
- Proper file structure
- Clean, readable code
- Appropriate naming
- Comments where helpful

### Styling (20%)
- Professional appearance
- Responsive design
- Consistent with app theme
- Proper CSS organization

### Best Practices (10%)
- PropTypes or default props
- No console warnings
- Semantic HTML used
- Accessibility considered