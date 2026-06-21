import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { loadTransactions, saveTransactions } from '../utils/localStorage'

export function useTransactions() {
  const [transactions, setTransactions] = useState(loadTransactions)

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const addTransaction = useCallback((txn) => {
    setTransactions((prev) => [...prev, { ...txn, id: uuidv4() }])
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates, id } : t)))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction }
}
