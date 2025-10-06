import { Link } from 'react-router-dom'
import { useExpenses } from '../hooks/useExpenses'
import { useState } from 'react'

export default function ExpensesPage() {
  const { expenses } = useExpenses()
  const [filter, setFilter] = useState('')

  const filtered = filter
    ? expenses.filter(exp => exp.category === filter)
    : expenses

  return (
    <div className="container">
      <div className="page-header">
        <h1>Expenses</h1>
        <Link to="/expenses/new" className="button">
          Add Expense
        </Link>
      </div>

      <div className="filter">
        <label>Filter by category: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="expense-list">
        {filtered.length === 0 ? (
          <p>No expenses yet. Add one to get started!</p>
        ) : (
          filtered.map(expense => (
            <Link
              key={expense.id}
              to={`/expenses/${expense.id}`}
              className="expense-card"
            >
              <div className="expense-info">
                <h3>{expense.description}</h3>
                <p className="expense-category">{expense.category}</p>
                <p className="expense-date">{expense.date}</p>
              </div>
              <div className="expense-amount">
                ${expense.amount.toFixed(2)}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
