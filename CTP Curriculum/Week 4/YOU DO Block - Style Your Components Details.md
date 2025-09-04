# YOU DO Block: Style Your Components with Tailwind

## Duration: 15 minutes

## Objective
Students apply Tailwind CSS to style their expense tracker components, creating a polished, responsive UI.

## Tasks Overview

### Task 1: Style Your ExpenseForm (Required)
Transform your form into a professional-looking component with proper spacing, borders, and interactive states.

### Task 2: Create a Responsive Layout (Required)
Build a layout that works on mobile and desktop using Tailwind's responsive modifiers.

### Task 3: Implement Loading & Empty States (Bonus)
Add visual feedback for different application states.

## Detailed Instructions

### Task 1: ExpenseForm Styling

#### Starting Code Structure
```tsx
// Students should transform their existing form
const ExpenseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Apply Tailwind classes here */}
    </form>
  );
};
```

#### Required Styling Elements
1. **Container**: White background, rounded corners, shadow
2. **Form Groups**: Proper spacing between fields
3. **Labels**: Consistent typography and color
4. **Inputs**: Border, padding, focus states
5. **Submit Button**: Primary color, hover state, full width on mobile

#### Target Result Example
```tsx
<form className="bg-white rounded-lg shadow-sm p-6 space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Description
    </label>
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      type="text"
      required
    />
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Amount and Category fields */}
  </div>
  
  <button className="w-full sm:w-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
    Add Expense
  </button>
</form>
```

### Task 2: Responsive Layout

#### Create an App Layout Component
```tsx
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Expense Tracker</h1>
            {/* Add navigation or user menu */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
```

#### Responsive Grid for ExpenseList
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {expenses.map(expense => (
    <ExpenseCard key={expense.id} expense={expense} />
  ))}
</div>
```

### Task 3: Loading & Empty States (Bonus)

#### Loading State
```tsx
const LoadingState = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);
```

#### Empty State
```tsx
const EmptyState = () => (
  <div className="text-center py-12">
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor">
      {/* Icon SVG */}
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by adding a new expense.</p>
  </div>
);
```

## Styling Checklist

### Required Elements
- [ ] Form has white background with shadow
- [ ] All inputs have focus states (ring)
- [ ] Buttons have hover states
- [ ] Layout is responsive (mobile & desktop)
- [ ] Consistent spacing throughout
- [ ] Typography hierarchy is clear

### Bonus Elements
- [ ] Dark mode support started
- [ ] Loading animations
- [ ] Smooth transitions
- [ ] Custom color theme
- [ ] Icon integration

## Common Tailwind Utilities Reference

### Layout
- `flex`, `grid`, `block`, `inline-block`
- `justify-center`, `items-center`, `gap-4`
- `w-full`, `max-w-xl`, `min-h-screen`

### Spacing
- Padding: `p-4`, `px-6`, `py-2`
- Margin: `m-4`, `mx-auto`, `mt-4`
- Space between: `space-y-4`, `space-x-2`

### Typography
- Size: `text-sm`, `text-base`, `text-xl`
- Weight: `font-normal`, `font-medium`, `font-bold`
- Color: `text-gray-700`, `text-blue-600`

### Borders & Shadows
- `border`, `border-gray-300`, `border-2`
- `rounded`, `rounded-md`, `rounded-lg`, `rounded-full`
- `shadow-sm`, `shadow`, `shadow-lg`

### States
- `hover:bg-blue-600`, `focus:ring-2`, `active:scale-95`
- `disabled:opacity-50`, `disabled:cursor-not-allowed`

### Responsive Prefixes
- `sm:` (640px+), `md:` (768px+), `lg:` (1024px+)
- Example: `w-full sm:w-auto md:w-1/2`

## Tips for Success

1. **Start Simple:** Get basic styles working before adding complexity
2. **Use IntelliSense:** Let VS Code autocomplete help you
3. **Check Documentation:** Keep tailwindcss.com/docs open
4. **Test Responsiveness:** Resize browser to check breakpoints
5. **Group Related Classes:** Keep modifiers together

## Assessment Criteria

### Meets Expectations
- Form is styled with proper spacing and borders
- Inputs have focus states
- At least one responsive breakpoint used
- Consistent color scheme

### Exceeds Expectations
- Multiple responsive breakpoints
- Smooth transitions and animations
- Loading/empty states implemented
- Custom theme colors configured
- Extracted reusable component patterns

## Time Management
- 5 minutes: Style the form
- 5 minutes: Create responsive layout
- 3 minutes: Add interactive states
- 2 minutes: Test and refine

## Getting Help
- Check Tailwind docs for utility classes
- Use browser DevTools to test classes
- Ask TA for specific utility names
- Reference the demo code for patterns