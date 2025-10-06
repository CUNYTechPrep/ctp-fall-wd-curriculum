'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useExpenses } from '../../hooks/useExpenses'

export default function AddExpensePage() {
  const router = useRouter()
  const { addExpense } = useExpenses()
  
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date,
    })
    
    router.push('/expenses')
  }

  return (
    <div className="container">
      <h1>Add New Expense</h1>
      
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="button">
          Add Expense
        </button>
      </form>
    </div>
  )
}
