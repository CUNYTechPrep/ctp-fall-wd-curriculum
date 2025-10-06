'use client'

import Link from 'next/link'
import { useExpenses } from './hooks/useExpenses'

export default function HomePage() {
  const { expenses } = useExpenses()

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="container">
      <h1>Welcome to Expense Tracker</h1>
      <p>Track your expenses easily</p>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value">{expenses.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p className="stat-value">${total.toFixed(2)}</p>
        </div>
      </div>

      <Link href="/expenses" className="button">
        View All Expenses
      </Link>
    </div>
  )
}
