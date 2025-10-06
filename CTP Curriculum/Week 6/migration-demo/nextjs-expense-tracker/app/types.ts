export type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Other'
