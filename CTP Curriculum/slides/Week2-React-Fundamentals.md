# Week 2: React Fundamentals & Project Kickoff

---

## Welcome Back!

### Today's Mission

- 🎨 Build production-quality React components
- 🔄 Master props and state management
- 🚀 Present project ideas and form teams
- 👥 Establish team workflows

> "Today you become React developers!"

---

## React Mental Model

### Let's Decompose Twitter/X

```
**Component Tree:**
- Feed Container
  - Tweet Card
	- User Avatar
	- Tweet Content
	- Action Buttons
	  - Like Button
	  - Reply Button
	  - Share Button
```

---

## Think-Pair-Share

### Your Turn! (5 min)

**Think:** How would you break down Instagram's interface into components?

**Share:** Let's draw the component tree together!

---

# React Core Concepts

---

## Component-Based Architecture

### The React(ive) Philosophy

```javascript
for (await event in events) {
	UI = fn(state)
}
```

**Your UI is a function of your application state**
---
### What This Means:
- Predictable updates
- Easy to reason about
- Time-travel debugging
- No manual DOM manipulation

---

## Virtual DOM Explained

### React's Secret Sauce

1. **You write:** Declarative components
2. **React maintains:** Virtual representation
3. **React calculates:** Minimal changes needed  
4. **React updates:** Only what changed

### Result: ⚡ Fast, efficient rendering

---

## Declarative vs Imperative

### The Old Way (Imperative)

```javascript
// jQuery style - HOW to do it
const btn = document.getElementById('counter');
btn.addEventListener('click', () => {
  const count = parseInt(btn.textContent) + 1;
  btn.textContent = count;
});
```

### The React Way (Declarative)

```jsx
// React - WHAT it should be
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => {
	  setCount(count + 1)
  }}>{count}</button>;
}
```

---

## Modern React: Functional Components

### Industry Standard

```jsx
// This is what you'll write
function ExpenseCard({ amount, category, date }) {
  return (
    <div className="expense-card">
      <h3>{category}</h3>
      <p>${amount}</p>
      <time>{date}</time>
    </div>
  );
}
```

---
### Why Functional?
- React Components were originally `class` components
- Simpler to understand
- Hooks provide all functionality
- Better performance
- Industry preference

---

## JSX: JavaScript + XML

### It's Just JavaScript!

```jsx
// JSX (what you write)
<div className="card">
  <h1>{title}</h1>
  <button onClick={handleClick}>Click me</button>
</div>

// Transpiled (what browser sees)
React.createElement('div', { className: 'card' },
  React.createElement('h1', null, title),
  React.createElement('button', { onClick: handleClick }, 'Click me')
);
```

---

## JSX Rules to Remember

### Key Differences from HTML

| HTML | JSX |
|------|-----|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `style="color: red"` | `style={{ color: 'red' }}` |
---
### JavaScript in JSX
```jsx
<div>
  {/* Any JS expression in {} */}
  <p>Total: ${amount * quantity}</p>
  {isLoggedIn && <WelcomeMessage />}
  {items.map(item => <Item key={item.id} {...item} />)}
</div>
```

---

# Props: Component Communication

---

## Props as Function Arguments

### Mental Model

```jsx
// Props are just function parameters!
function Button({ text, onClick, variant = "primary" }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

```

---

## Using the component


```jsx
// Using the component
<Button 
  text="Save Expense" 
  onClick={handleSave} 
  variant="success" 
/>
```

---

## Props Rules

### The Contract

1. **Props are read-only** (immutable)
2. **Flow down** from parent to child
3. **Can be any JavaScript value**
4. **Destructuring makes code cleaner**

```jsx
// ❌ Never modify props
props.amount = 100; // ERROR!

// ✅ Use props as read-only
const doubled = props.amount * 2; // Good!
```

---

## Component Composition

### Building Complex UIs

```jsx
function ExpenseList() {
  const expenses = [
    { id: 1, amount: 50, category: "Food" },
    { id: 2, amount: 100, category: "Transport" }
  ];
  return (
    <div>
      <h2>Your Expenses</h2>
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} amount={expense.amount} category={expense.category}
        />
      ))}
    </div>
  );
}
```

---

# State: Making Components Interactive

---

## The useState Hook

### Component Memory

```jsx
function ExpenseList() {
  const expenses = useState([]);
  return (
    <div>
      <h2>Your Expenses</h2>
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} amount={expense.amount} category={expense.category}
        />
      ))}
    </div>
  );
}
```

---
### Key Points:
- State is private to component
- Changing state triggers re-render
- Never mutate state directly

---

## State Rules

### The Golden Rules

```jsx
// ❌ NEVER mutate state directly
state.items.push(newItem); // WRONG!
setState(state); // Won't trigger re-render

// ✅ Always create new objects/arrays
setState([...state.items, newItem]); // RIGHT!
setState({ ...state, name: 'New Name' }); // RIGHT!
```

---
### When to Use State:
- User input (forms, interactions)
- API responses
- UI state (open/closed, selected)
- Any data that changes over time

---

## Multiple State Variables

### Keep State Focused

```jsx
function ExpenseForm() {
  // Separate state for different concerns
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Or group related state
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: ''
  });
}
```

---

# Live Coding Demo

---

## Building ExpenseCard Component

### Professional Structure

```bash
src/
  components/
    ExpenseCard/
      ExpenseCard.jsx
      ExpenseCard.css
      index.js
```

---
### Live Implementation
- Props interface with JSDoc
- Currency formatting
- Conditional styling
- Semantic HTML

---

## Adding Derived State using `useMemo`

```jsx
function ExpenseList() {
	const [expenses, setExpenses] = useState([...]);
	const [filter, setFilter] = useState('All');
	  
		  // Derived state - calculated on render
	const filteredExpenses = useMemo(() => {
		if (filter === 'All') {
			return expenses 
		}
		else {
			return expenses.filter(e => e.category === filter);
		}
	}, [expenses, filter])
	// continued, use filtered expenses
}
```

---

## Event Handling & State Updates

### The Data Flow

```jsx
// Parent component
function ExpenseList() {
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };
  
  return expenses.map(expense => (
    <li key={expense.id}>
        {...expense}
        <button onClick={() => deleteExpense(expense.id)} >Delete</button>
	</li>
  ));
}
```

---

# Forms in React

---

## Controlled Components

### React Controls Form State

```jsx
function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="amount"
        value={formData.amount}
        onChange={handleChange}
      />
    </form>
  );
}
```

---

## Form Validation

### User-Friendly Errors

```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  
  if (!formData.amount || formData.amount <= 0) {
    newErrors.amount = 'Amount must be greater than 0';
  }
  
  if (!formData.description.trim()) {
    newErrors.description = 'Description is required';
  }
  
  return newErrors;
};

// In render
{errors.amount && (
  <span className="error">{errors.amount}</span>
)}
```

---

# Your Turn: Component Building

---
### Build These Components:

1. **Header Component**
   - App title and navigation
   - User greeting with props
   - Professional styling
---
## Build These Components:

1. **ExpenseSummary Component**
   - Total expenses display
   - Count and average
   - Visual indicators
---
## Build These Components:
### Requirements:
- Proper file structure
- Props with defaults
- Responsive design
- Clean styling

---

### Choose One Feature:

1. **Toggle Visibility**
   - Show/hide expense details
   - Smooth transitions

1. **Category Filter**
   - Dynamic filtering
   - Multiple selection

3. **Sort Options**
   - By date/amount/category
   - Ascending/descending

---
### Focus On:
- State management
- Event handling
- User experience

---
## Make issues and PR's!
---

# Team Project Time

---

## Project Pitches

### Lightning Round Format

**1 minute per pitch:**
- Problem you're solving
- Your unique solution
- Key technical challenges
- Why it matters

---
### README as Your Pitch Deck
```markdown
# Project Name
## 🎯 Problem Statement
## 💡 Solution
## 🎨 Key Features
## 🔧 Technical Approach
```

---

## Team Formation

### Finding Your Squad

**Interest Declaration:**
- Post top 3 choices in chat
- Natural clusters will emerge
- 3-4 members per team

---

**Quick Team Sync:**
- Introductions
- Strengths & interests
- Shared enthusiasm check
- Initial role thoughts

---

## Team Working Agreement

### Set Expectations Early

```markdown
## Communication Plan
- Daily standup: 9am via Discord
- Response time: Within 24 hours

## Git Workflow  
- Branch protection on main
- PR requires 1 approval
- Conventional commits

## Definition of Done
- [ ] Tests pass
- [ ] Code reviewed
- [ ] Documentation updated
```

---
## Team Charter

### Set Expectations Now

```markdown
## Team: [Creative Name]

### Members & Strengths
- Alice: React, UI/UX design
- Bob: Backend, databases
- Carol: Testing, documentation

### Communication
- Daily standup: 9am Discord
- Weekly sync: Tuesday 7pm
- Response time: 24 hours

### Git Workflow
- Feature branches
- PR reviews required
- Conventional commits
```

---

## GitHub Setup

### Professional Team Infrastructure

1. **Create Organization/Repo**
2. **Add all members as collaborators**
3. **Initialize Project Board**
   - Backlog
   - In Progress  
   - Review
   - Done

4. **Create Initial Issues**
   - Setup tasks
   - Week 3 goals
   - Research spikes

---

# Wrap Up

---

## Today's Achievements

### You Built Real Components! 🎉

**Technical Skills:**
- ✅ React component architecture
- ✅ Props and state mastery
- ✅ Event handling patterns
- ✅ Form management

**Team Formation:**
- ✅ Found passionate teammates
- ✅ Established working agreement
- ✅ Set up collaboration tools
- ✅ Defined initial scope

---

## Before Next Week

### Individual Work:
1. Complete expense tracker components
2. Add at least one interactive feature
3. Push all changes to GitHub
4. Read TypeScript + React docs

### Team Work:
1. Hold first standup meeting
2. Create 5+ GitHub issues
3. Assign Week 3 tasks
4. Research your tech stack

---

## Week 3 Preview

### TypeScript Integration

- Add type safety to React
- Catch bugs before runtime
- Better IDE support
- Professional code quality

### Get Ready To:
- Convert components to TypeScript
- Create type definitions
- Use generics
- Build type-safe architecture

---

## Exit Ticket

### Share With Us:

1. 📊 Rate your React understanding (1-5)
2. 🤔 One React concept you want more practice with
3. 👥 Your team name and project
4. 🎯 One thing you're excited to build

### See you next week for TypeScript! 🚀