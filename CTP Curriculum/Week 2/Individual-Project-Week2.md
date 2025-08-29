# Individual Project Week 2: Introduction to React

## Overview
Duration: 25 minutes  
Learning Target: Convert your HTML expense tracker to a React application

## Prerequisites
- Completed Week 1 (HTML/CSS expense form)
- Basic understanding of JavaScript
- Node.js installed

## Learning Goals
- Set up a React project
- Convert HTML to React components
- Understand props and state
- Handle user events in React

## Part 1: React Setup (5 minutes)

### Create React App
```bash
# In your project parent directory
npx create-react-app expense-tracker-react
cd expense-tracker-react
npm start
```

### New Project Structure
```
expense-tracker-react/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── components/
│       ├── ExpenseForm.js
│       └── ExpenseList.js
├── package.json
└── README.md
```

## Part 2: Your First Component (10 minutes)

### Clean Up App.js
```javascript
// src/App.js
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>💰 Expense Tracker</h1>
      {/* TODO: Add your components here */}
    </div>
  );
}

export default App;
```

### Copy Your CSS
Copy your Week 1 CSS into `src/App.css`

### Create ExpenseForm Component
```javascript
// src/components/ExpenseForm.js
import React from 'react';

function ExpenseForm() {
  // TODO: Add state for form inputs
  
  // TODO: Add handleSubmit function
  
  return (
    <form className="expense-form">
      {/* TODO: Convert your HTML form here */}
      {/* Hint: className instead of class */}
      {/* Hint: onChange instead of oninput */}
    </form>
  );
}

export default ExpenseForm;
```

## Part 3: Understanding State (10 minutes)

### Using useState Hook
```javascript
// At the top of your component
import React, { useState } from 'react';

function ExpenseForm() {
  // TODO: Create state variables for:
  // - amount (string)
  // - description (string)
  // - category (string)
  
  // TODO: Create handler functions for:
  // - handleAmountChange
  // - handleDescriptionChange
  // - handleCategoryChange
  
  // TODO: Create handleSubmit function that:
  // - Prevents default form submission
  // - Creates an expense object
  // - Clears the form
  
  return (
    <form>
      {/* TODO: Add form inputs with:
          - value prop connected to state
          - onChange prop connected to handler
          - proper type and required attributes
      */}
    </form>
  );
}
```

### Managing Expenses List in App.js
```javascript
// src/App.js
import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  // TODO: Create state for expenses array
  
  // TODO: Create addExpense function that:
  // - Takes an expense object as parameter
  // - Adds it to the expenses array
  // Hint: Use spread operator [...oldArray, newItem]
  
  // TODO: Create deleteExpense function that:
  // - Takes an id as parameter
  // - Removes the expense with that id
  // Hint: Use array.filter()
  
  return (
    <div className="App">
      <h1>💰 Expense Tracker</h1>
      {/* TODO: Pass addExpense function as prop */}
      <ExpenseForm />
      {/* TODO: Pass expenses array and deleteExpense as props */}
      <ExpenseList />
    </div>
  );
}
```

## Part 4: Props and Component Communication

### Passing Props to ExpenseForm
```javascript
// In App.js
// TODO: Pass your addExpense function as a prop called onAddExpense
<ExpenseForm /* add prop here */ />

// In ExpenseForm.js
function ExpenseForm(/* receive props here */) {
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TODO: Create newExpense object with:
    // - id: Date.now()
    // - amount: parsed as float
    // - description: from state
    // - category: from state
    // - date: new Date().toLocaleDateString()
    
    // TODO: Call the function passed via props
    
    // TODO: Reset form by setting all state values to initial values
  };
}
```

### Create ExpenseList Component
```javascript
// src/components/ExpenseList.js
function ExpenseList(/* TODO: receive props */) {
  // TODO: Calculate total from expenses array
  // Hint: Use array.reduce() or loop through array
  
  return (
    <div className="expense-list">
      <h2>Your Expenses</h2>
      
      {/* TODO: Display the total */}
      
      {/* TODO: Use map() to display each expense
          - Remember to add a key prop
          - Show description, amount, category, date
          - Add delete button that calls onDeleteExpense
      */}
    </div>
  );
}
```

## Part 5: React Best Practices

### Component Organization
```
src/
├── components/
│   ├── ExpenseForm/
│   │   ├── ExpenseForm.js
│   │   └── ExpenseForm.css
│   └── ExpenseList/
│       ├── ExpenseList.js
│       └── ExpenseList.css
```

### Conditional Rendering
```javascript
// Show message when no expenses
{expenses.length === 0 ? (
  <p>No expenses yet. Add your first one!</p>
) : (
  <div>
    {/* Show expenses */}
  </div>
)}
```

### Event Handling Pattern
```javascript
// Option 1: Inline arrow function
<button onClick={() => onDeleteExpense(expense.id)}>
  Delete
</button>

// Option 2: Separate handler
const handleDelete = () => {
  onDeleteExpense(expense.id);
};

<button onClick={handleDelete}>Delete</button>
```

## Part 6: Documentation Updates (5 minutes)

### Update Your README
Add to your README.md:
```markdown
## Week 2 Progress
[TODO: Document what you accomplished]
- [ ] Converted to React
- [ ] Created components for...
- [ ] Implemented state management
- [ ] Challenges faced:
- [ ] Solutions found:

## Technical Decisions
[TODO: Link to your new ADR]
- See [ADR-002](./docs/decisions/ADR-002-react-adoption.md) for React decision
```

### Create ADR-002: React Adoption
Create: `docs/decisions/ADR-002-react-adoption.md`

```markdown
# ADR-002: React Adoption

## Status
[TODO: Accepted/Proposed]

## Context
[TODO: Why are you moving from vanilla JS to React?]
Consider:
- What problems did you face with vanilla JS?
- What benefits do you expect from React?
- What alternatives did you consider?

## Decision
[TODO: Explain your decision to use React]

## Consequences
**Positive:**
[TODO: List benefits you're seeing]

**Negative:**
[TODO: List challenges you're facing]

## Lessons Learned
[TODO: What have you learned about React so far?]
```

### Update User Stories
Update: `docs/planning/user-stories.md`
```markdown
## Week 2 Completed Stories
[TODO: Mark which user stories you completed this week]
- [ ] [Your user story from Week 1]
- [ ] [Another user story]

## Technical Implementation Notes
[TODO: Document your implementation decisions]
- Component structure: [How did you organize components?]
- State management: [Where does state live?]
- Props flow: [How do components communicate?]
```

### Update Technical Roadmap
Update: `docs/planning/roadmap.md`
```markdown
### Week 2: [TODO: Update title based on what you built]
[TODO: Mark items complete and add new discoveries]
- [ ] [Update your original Week 2 tasks]
- [ ] [What did you actually complete?]
- [ ] [What took longer than expected?]
- [ ] [What new tasks did you discover?]

### Learnings & Adjustments
[TODO: Document what you learned and how it affects your plan]
```

## Week 2 Checklist
- [ ] React app created and running
- [ ] ExpenseForm component created
- [ ] ExpenseList component created
- [ ] State management with useState
- [ ] Props passing between components
- [ ] Can add expenses
- [ ] Can delete expenses
- [ ] Total calculates correctly
- [ ] Form clears after submit

## Common Issues

### "X is not defined"
- Check your imports
- Make sure you're exporting components

### State not updating?
- Never mutate state directly
- Use setState functions
- Remember state updates are async

### Props undefined?
- Check prop names match
- Verify you're passing props correctly
- Use console.log to debug

## Debugging React
```javascript
// Use React Developer Tools (browser extension)

// Console log in components
console.log('Props:', props);
console.log('State:', expenses);

// Check renders
console.log('Component rendered');
```

## Resources
- [React Docs - Getting Started](https://react.dev/learn)
- [React Hooks](https://react.dev/reference/react)
- [JSX Explained](https://react.dev/learn/writing-markup-with-jsx)
- [Handling Events](https://react.dev/learn/responding-to-events)

## Next Week Preview
Week 3: Add TypeScript for type safety and better development experience!