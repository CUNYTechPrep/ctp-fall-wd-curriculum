'use client'

import { useParams, useRouter } from 'next/navigation'
import { useExpenses } from '../../hooks/useExpenses'
import { useState } from 'react'

export default function ExpenseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getExpense, updateExpense, deleteExpense } = useExpenses()
  
  const id = params.id as string
  const expense = getExpense(id)
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(expense?.description || '')
  const [amount, setAmount] = useState(expense?.amount.toString() || '')

  if (!expense) {
    return <div className="container"><p>Expense not found</p></div>
  }

  const handleSave = () => {
    updateExpense(id, {
      description,
      amount: parseFloat(amount),
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('Delete this expense?')) {
      deleteExpense(id)
      router.push('/expenses')
    }
  }

  return (
    <div className="container">
      <h1>Expense Details</h1>

      {isEditing ? (
        <div className="expense-form">
          <div className="form-group">
            <label>Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button onClick={handleSave} className="button">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="button">
            Cancel
          </button>
        </div>
      ) : (
        <div className="expense-detail">
          <p><strong>Description:</strong> {expense.description}</p>
          <p><strong>Amount:</strong> ${expense.amount.toFixed(2)}</p>
          <p><strong>Category:</strong> {expense.category}</p>
          <p><strong>Date:</strong> {expense.date}</p>
          
          <div className="button-group">
            <button onClick={() => setIsEditing(true)} className="button">
              Edit
            </button>
            <button onClick={handleDelete} className="button button-danger">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
