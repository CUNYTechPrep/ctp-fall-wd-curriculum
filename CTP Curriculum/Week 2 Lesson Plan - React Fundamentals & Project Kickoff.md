## LEARNING OBJECTIVES

### Content Objectives (What students will know):
- Identify React component patterns and explain the relationship between components, props, and state
- Compare functional and class components and justify why functional components with hooks are industry standard
- Analyze JSX syntax and evaluate how it differs from HTML and enables dynamic UI rendering
- Describe component lifecycle and explain how React's virtual DOM enables efficient updates

### Language Objectives (How students will communicate learning):
- **Reading:** Interpret React documentation, component examples, and error messages to debug effectively
- **Writing:** Create clear component documentation, write descriptive prop definitions, and compose compelling project READMEs
- **Speaking:** Present project ideas persuasively, articulate component architecture decisions, and collaborate on team formation
- **Listening:** Engage with project pitches, provide constructive feedback, and participate in team negotiations

### Learning Objectives (What students will be able to do):
By the end of this session, students will be able to:
- Build React functional components with proper JSX syntax and component composition patterns
- Implement props and state using modern React hooks (useState, useEffect)
- Present project ideas through README documentation and form collaborative teams
- Set up team project repository with GitHub Projects board and establish working agreements

## MATERIALS & PREPARATION

### Instructor Prep:
- Presentation prepared: React fundamentals slides with component diagrams (25 slides)
- Code examples: Pre-built React components showing progression from simple to complex
- Project pitch system: Method to display and present README files efficiently
- Team formation materials: Team charter templates, GitHub Projects setup guide
- Demo project: Working React app with multiple component examples
- Remote setup: Zoom breakout rooms for team formation

### TA Prep:
- React proficiency: Strong understanding of hooks, props, state, and component patterns
- Debugging skills: Ability to help with common React errors
- Project guidance: Understanding of project scope and feasibility
- Team facilitation: Ready to help with team formation conflicts
- GitHub Projects: Familiar with board setup and issue tracking

### Student Requirements:
- **Completed from Week 1:** CodeSpaces environment, GitHub Copilot configured
- **Individual work:** Expense tracker repository initialized
- **Project ideas:** Thought about potential team project concepts
- **React preparation:** Reviewed basic React concepts from prerequisites

### Technology Setup:
- **Development:** GitHub CodeSpaces with React environment
- **Collaboration:** Shared screen for README presentations
- **Team tools:** GitHub Organizations for team projects
- **Communication:** Zoom breakout rooms, Slack/Discord
- **Resources:** React documentation, component library examples

## SESSION TIMELINE

| Time | Duration | Activity | Format | Assessment |
|------|----------|----------|---------|------------|
| 0-10 min | 10 min | Launch & React Mental Model | Interactive Discussion | Understanding check |
| 10-30 min | 20 min | Lecture: React Core Concepts | Instructor presentation | Concept comprehension |
| 30-50 min | 20 min | I DO Block 1: Component Building Demo | Live coding | Pattern recognition |
| 50-65 min | 15 min | YOU DO Block 1: First Components | Individual practice | Component functionality |
| 65-75 min | 10 min | BREAK | Informal | None |
| 75-90 min | 15 min | I DO Block 2: Props and State Demo | Live coding | State understanding |
| 90-105 min | 15 min | YOU DO Block 2: Interactive Components | Individual practice | Props/state usage |
| 105-115 min | 10 min | BREAK | Informal | None |
| 115-145 min | 30 min | GROUP PROJECT: Pitches & Team Formation | Team collaboration | Team creation |
| 145-150 min | 5 min | Wrap-up & Week 3 Preview | Reflection | Exit ticket |

## LAUNCH (10 minutes)

### Hook:
"Today you become React developers! By the end of this session, you'll build interactive components and form teams around projects you're passionate about. React powers Facebook, Netflix, Airbnb, and countless other applications - and now it will power yours."

### React Mental Model Activity:

**Interactive Demonstration (5 min):**
- Show a complex UI (like Twitter/X feed)
- "Let's decompose this into components:"
  - Feed Container
  - Tweet Card
  - User Avatar
  - Like Button
  - Reply Thread
- "Each piece is independent but works together"

**Think-Pair-Share (5 min):**
- **Think:** "How would you break down Instagram's interface into components?"
- **Pair:** Quick discussion with neighbor
- **Share:** Instructor draws component tree from suggestions

### Connection to Prior Learning:
"Last week you set up professional development practices. Today we apply them by building real React components with proper documentation, using Copilot responsibly, and forming teams using the agile principles we learned."

## LECTURE: React Core Concepts (20 minutes)

### Learning Target:
Students will understand React's component-based architecture and modern development patterns

### Instructional Strategy: Progressive Concept Building with Visual Models

### Presentation Content Structure:

**React Philosophy & Architecture (5 minutes)**
- **Component-Based Thinking:**
  ```
  UI = f(state)
  "Your UI is a function of your application state"
  ```
- **Virtual DOM Concept:**
  - React maintains virtual representation
  - Calculates minimal changes needed
  - Updates only what changed
  - Result: Fast, efficient rendering
- **Declarative vs Imperative:**
  - Imperative: "Find the button, add a click handler, update the text"
  - Declarative: "When clicked, the count should be X"
- **Industry context:** "This mental model is why React developers are so productive"

**Component Fundamentals (7 minutes)**
- **Functional Components:**
  ```jsx
  // Modern React - This is what you'll write
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
- **JSX Explained:**
  - Looks like HTML but it's JavaScript
  - `className` instead of `class`
  - `onClick` instead of `onclick`
  - JavaScript expressions in `{}`
  - Must return single parent element
- **Component Composition:**
  ```jsx
  function ExpenseList() {
    return (
      <div>
        <ExpenseCard amount={50} category="Food" />
        <ExpenseCard amount={100} category="Transport" />
      </div>
    );
  }
  ```

**Props: Component Communication (4 minutes)**
- **Props as Function Arguments:**
  ```jsx
  // Props are just function parameters
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
- **Props Rules:**
  - Props are read-only (immutable)
  - Flow down from parent to child
  - Can be any JavaScript value
  - Destructuring makes code cleaner

**State: Making Components Interactive (4 minutes)**
- **The useState Hook:**
  ```jsx
  function Counter() {
    const [count, setCount] = useState(0);
    
    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </div>
    );
  }
  ```
- **State Rules:**
  - State is private to component
  - Changing state triggers re-render
  - Never mutate state directly
  - Use setter function always
- **When to Use State:**
  - User input (forms, interactions)
  - API responses
  - UI state (open/closed, selected)

### Visual Elements:
- Component tree diagrams
- Props flow visualization (parent → child)
- State update cycle animation
- Before/after render comparisons

### Engagement Techniques:
- "What happens if we try to modify props directly?"
- "When would a component need state vs just props?"
- "How is this different from vanilla JavaScript DOM manipulation?"

## I DO BLOCK 1: Component Building Demo (20 minutes)

### Learning Target:
Demonstrate building production-quality React components with professional patterns

### Demonstration Sequence:

**Setup & File Structure (3 min)**
```bash
# In CodeSpaces expense tracker
src/
  components/
    ExpenseCard/
      ExpenseCard.jsx
      ExpenseCard.css
    ExpenseList/
      ExpenseList.jsx
      ExpenseList.css
```
- Think-aloud: "I organize components in folders - this scales better than flat structure"

**Build ExpenseCard Component (8 min)**
```jsx
// ExpenseCard.jsx
import './ExpenseCard.css';

/**
 * Displays a single expense item
 * @param {Object} props
 * @param {number} props.amount - Expense amount in dollars
 * @param {string} props.category - Expense category
 * @param {string} props.description - Expense description
 * @param {string} props.date - Expense date
 */
function ExpenseCard({ amount, category, description, date }) {
  // Format currency for display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString();

  // Determine color based on amount
  const amountClass = amount > 100 ? 'expense-high' : 'expense-normal';

  return (
    <article className="expense-card">
      <div className="expense-header">
        <span className="expense-category">{category}</span>
        <time className="expense-date">{formattedDate}</time>
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

export default ExpenseCard;
```
- Think-aloud during coding:
  - "Notice the JSDoc comments - Copilot can use these"
  - "I'm using semantic HTML - article for a self-contained item"
  - "Formatting logic stays in the component"
  - "Conditional styling based on business logic"

**Add Professional Styling (5 min)**
```css
/* ExpenseCard.css */
.expense-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.expense-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.expense-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.expense-category {
  background: #4F46E5;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.expense-amount {
  font-size: 24px;
  font-weight: bold;
}

.expense-amount.expense-high {
  color: #DC2626;
}

.expense-amount.expense-normal {
  color: #059669;
}
```

**Create Container Component (4 min)**
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

  return (
    <div className="expense-list">
      <h2>Recent Expenses</h2>
      {expenses.map(expense => (
        <ExpenseCard
          key={expense.id}
          amount={expense.amount}
          category={expense.category}
          description={expense.description}
          date={expense.date}
        />
      ))}
    </div>
  );
}

export default ExpenseList;
```
- Think-aloud: "Always use key prop in lists - React needs it for efficient updates"

### Professional Insights:
- "This component structure is how we build at scale"
- "Props make components reusable across your app"
- "Separation of concerns - each component has one job"

## YOU DO BLOCK 1: First Components (15 minutes)

### Learning Target:
Students create their first React components for the expense tracker

### Activity Structure:

**Component Creation (10 minutes)**
- Create two components for expense tracker:
  1. `Header` component with app title and navigation
  2. `ExpenseSummary` component showing total and count
- Requirements:
  - Proper file structure (component folders)
  - Use props for customization
  - Include basic CSS styling
  - Add JSDoc comments

**Testing & Iteration (5 minutes)**
- Import and use components in App.jsx
- Verify rendering in browser
- Use Copilot to improve styling
- Take screenshot for submission

### Success Criteria:
- Two functional components created
- Props properly defined and used
- Components render without errors
- Basic styling applied
- Clean file organization

### Support Strategies:
- Starter code snippets available
- TA support in breakout rooms
- Pair programming encouraged
- Reference implementation provided

## BREAK (10 minutes)

## I DO BLOCK 2: Props and State Demo (15 minutes)

### Learning Target:
Demonstrate state management and prop passing to create interactive components

### Demonstration Sequence:

**Adding State to ExpenseList (7 min)**
```jsx
// Enhanced ExpenseList.jsx
import { useState } from 'react';
import ExpenseCard from '../ExpenseCard/ExpenseCard';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import './ExpenseList.css';

function ExpenseList() {
  // State for managing expenses
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      amount: 45.99,
      category: 'Food',
      description: 'Lunch at cafe',
      date: '2024-01-15'
    }
  ]);

  // State for filter
  const [filterCategory, setFilterCategory] = useState('All');

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Filter expenses
  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory);

  // Add new expense
  const addExpense = (newExpense) => {
    setExpenses([...expenses, { 
      ...newExpense, 
      id: Date.now() 
    }]);
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div className="expense-list">
      <div className="expense-summary">
        <h2>Total: ${total.toFixed(2)}</h2>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option>All</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Entertainment</option>
        </select>
      </div>

      <ExpenseForm onAddExpense={addExpense} />

      {filteredExpenses.map(expense => (
        <ExpenseCard
          key={expense.id}
          {...expense}
          onDelete={() => deleteExpense(expense.id)}
        />
      ))}
    </div>
  );
}
```
- Think-aloud: 
  - "State holds our data, props pass it down"
  - "Never mutate state directly - always create new arrays/objects"
  - "Callbacks (like onDelete) let children communicate up"

**Creating Interactive Form (8 min)**
```jsx
// ExpenseForm.jsx
import { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ onAddExpense }) {
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.amount || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    // Convert amount to number
    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({
      amount: '',
      category: 'Food',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
        step="0.01"
        required
      />
      
      <select 
        name="category" 
        value={formData.category}
        onChange={handleChange}
      >
        <option>Food</option>
        <option>Transport</option>
        <option>Entertainment</option>
        <option>Other</option>
      </select>

      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
```
- Think-aloud:
  - "Controlled components - React controls form values"
  - "Single source of truth in state"
  - "Form validation before submission"
  - "Clear form after successful add"

### Key Concepts Emphasized:
- State management patterns
- Prop drilling and callbacks
- Controlled vs uncontrolled components
- Event handling in React

## YOU DO BLOCK 2: Interactive Components (15 minutes)

### Learning Target:
Students add interactivity to their expense tracker components

### Activity Structure:

**Add State Management (8 minutes)**
- Choose one interactive feature:
  1. Toggle expense visibility
  2. Add expense counter
  3. Category filter
  4. Sort by amount/date
- Implement using useState
- Handle user interactions

**Connect Components (7 minutes)**
- Pass props between components
- Implement at least one callback
- Update parent state from child
- Test full interaction flow

### Success Criteria:
- useState implemented correctly
- User interactions work properly
- Props passed effectively
- State updates trigger re-renders
- No console errors

### Common Issues to Address:
- Forgetting to import useState
- Direct state mutation
- Missing key props in lists
- Event handler syntax errors

## BREAK (10 minutes)

## GROUP PROJECT: Pitches & Team Formation (30 minutes)

### Learning Target:
Present compelling project ideas via README and form balanced, collaborative teams

### Activity Structure:

**Project Pitch Preparation (5 minutes)**
- **Individual README Finalization:**
  ```markdown
  # Project Name
  
  ## 🎯 Problem Statement
  [1-2 sentences describing the problem]
  
  ## 💡 Solution
  [1-2 sentences describing your solution]
  
  ## 🎨 Key Features
  - Feature 1
  - Feature 2
  - Feature 3
  
  ## 🔧 Technical Approach
  - Frontend: React + TypeScript
  - Backend: [Your choice]
  - Database: [Your choice]
  
  ## 🚀 Why This Matters
  [Personal connection or impact statement]
  ```

**README Pitch Presentations (15 minutes)**
- **Format:** Instructor shares screen, displays READMEs
- **Process:**
  - 5-6 pitches per round (3 rounds total)
  - 1 minute per pitch (fellow can present or instructor reads)
  - Quick clarifying questions allowed
  - Students note interests in chat

**Team Formation Process (8 minutes)**
- **Interest Declaration:**
  - Students post top 3 project choices in chat
  - Instructor identifies natural clusters
  - Aim for 3-4 members per team
  
- **Team Assembly in Breakout Rooms:**
  - Teams sent to breakout rooms
  - Quick introductions and role discussion
  - Confirm shared enthusiasm
  - Begin team charter

**Team Setup & Charter (7 minutes)**
- **Create Team Resources:**
  ```markdown
  ## Team Charter
  
  ### Team Name: [Creative project-related name]
  
  ### Project: [Final project name and one-line description]
  
  ### Team Members
  - Member 1: [Name] - Strengths: [2-3 technical/soft skills]
  - Member 2: [Name] - Strengths: [2-3 technical/soft skills]  
  - Member 3: [Name] - Strengths: [2-3 technical/soft skills]
  - Member 4: [Name] - Strengths: [2-3 technical/soft skills]
  
  ### Communication Plan
  - Daily standup: [Time via Discord/Slack]
  - Weekly sync: [Day/time via Zoom]
  - Async updates: GitHub issues
  - Response time: Within 24 hours
  
  ### Git Workflow
  - Branch naming: feature/[description]
  - PR reviews: 1 approval required
  - Commit style: Conventional commits
  - Main branch: Protected
  
  ### Definition of Done
  - [ ] Code reviewed by teammate
  - [ ] Tests written and passing
  - [ ] Documentation updated
  - [ ] No console errors
  - [ ] Responsive design checked
  
  ### Conflict Resolution
  1. Discuss in team standup
  2. Vote if needed (majority wins)
  3. Escalate to instructor if blocked
  
  ### Goals
  - Week 3-5: Foundation and setup
  - Week 6-8: Core features
  - Week 9-11: Advanced features
  - Week 12-13: Polish and deploy
  ```

- **GitHub Setup:**
  - Create organization or shared repo
  - Add all team members as collaborators
  - Initialize GitHub Projects board
  - Create initial issues

### Sample Project Ideas (from past cohorts):
- **StudyBuddy:** Match students for study sessions based on courses and availability
- **PetPal:** Connect pet owners for playdates and pet-sitting exchanges
- **MealMate:** Coordinate group cooking and meal sharing in dorms/apartments
- **SkillSwap:** Trade skills (coding for design, language for music, etc.)
- **EventHub:** Discover and organize local community events
- **GreenThumb:** Plant care reminders and community garden coordination

### Team Presentation Lightning Round (5 minutes):
- Each team (30 seconds):
  - Team name
  - Project name and problem it solves
  - One exciting technical challenge
  - Team's superpower (what makes them unique)

## WRAP-UP & REFLECTION (5 minutes)

### Today's Achievements:
"You've built your first React components and formed teams around exciting projects! You now understand component architecture, props, state, and have a clear path forward for both your individual expense tracker and team project."

### Technical Growth:
- Created reusable React components
- Implemented interactive features with state
- Passed data via props
- Handled user events

### Team Formation Success:
- Found passionate teammates
- Established clear working agreements
- Set up collaborative infrastructure
- Defined project scope and goals

### Next Week Preview:
"Week 3: TypeScript Integration. You'll add type safety to your React components, making your code more robust and professional. Teams will also create their technical architecture plans."

### Exit Ticket (Google Form):
1. Rate your understanding of React props and state (1-5)
2. One React concept you want more practice with
3. Your team name and project
4. One thing you're excited about for your team project

### Homework:
- Complete expense tracker components if needed
- Read TypeScript + React documentation
- Team: Schedule first standup meeting
- Team: Create 5 initial GitHub issues

## ADDENDUM: UDL & DIFFERENTIATION

### Multiple Means of Representation:
- **Visual:** Component diagrams, data flow arrows, UI mockups
- **Auditory:** Live coding with narration
- **Reading:** Comprehensive code comments and documentation
- **Kinesthetic:** Immediate component building practice

### Multiple Means of Engagement:
- **Choice:** Multiple component options to build
- **Relevance:** Real expense tracker application
- **Collaboration:** Team formation around interests
- **Autonomy:** Technical decisions within requirements

### Multiple Means of Action/Expression:
- **Coding:** Direct component implementation
- **Writing:** README pitches and documentation
- **Speaking:** Verbal project presentations (optional)
- **Visual:** Component styling and UI design

### Specific Support Strategies:

**For Advanced Students:**
- Add complex state management (useReducer)
- Implement custom hooks
- Create reusable component library
- Add animations and transitions
- Explore React Context API

**For Struggling Students:**
- Provide component starter templates
- Pair programming with stronger students
- Simplified state examples
- Step-by-step debugging guide
- Office hours before next class

**For English Language Learners:**
- React terminology glossary
- Code comments in native language okay
- Visual component diagrams
- Pair with bilingual student if available

**For Different Learning Styles:**
- **Visual:** Component tree diagrams, UI sketches
- **Auditory:** Record coding sessions for review
- **Read/Write:** Detailed documentation and notes
- **Kinesthetic:** Build multiple component variations

### Common Challenges & Solutions:

**Technical Issues:**
- **"useState is not defined":** Forgot to import
- **"Objects are not valid as React child":** Trying to render object directly
- **"Each child should have unique key":** Missing key in map
- **Solution:** Debugging checklist and common errors guide

**Team Formation Issues:**
- **Oversubscribed projects:** Negotiate or create second team
- **Isolated students:** Instructor facilitates placement
- **Skill imbalances:** Emphasize learning over perfection
- **Solution:** Clear team size limits and instructor intervention

**Conceptual Difficulties:**
- **Props vs State confusion:** Use water flow analogy
- **When to use state:** Decision flowchart provided
- **Component composition:** Building blocks analogy
- **Solution:** Multiple explanations and examples