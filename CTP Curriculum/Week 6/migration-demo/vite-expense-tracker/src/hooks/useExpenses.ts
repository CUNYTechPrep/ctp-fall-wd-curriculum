import { useState, useEffect } from 'react'
import { Expense } from '../types'

const STORAGE_KEY = 'vite-expenses'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setExpenses(JSON.parse(stored))
    }
  }, [])

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses))
  }

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() }
    saveExpenses([...expenses, newExpense])
    return newExpense
  }

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(exp =>
      exp.id === id ? { ...exp, ...updates } : exp
    )
    saveExpenses(updated)
  }

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(exp => exp.id !== id))
  }

  const getExpense = (id: string) => {
    return expenses.find(exp => exp.id === id)
  }

  return { expenses, addExpense, updateExpense, deleteExpense, getExpense }
}
