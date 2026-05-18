import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../types';
import { loadTransactions, saveTransactions } from '../utils/localStorage';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

  const addTransaction = useCallback((data: Omit<Transaction, 'id'>) => {
    const tx: Transaction = { id: uuidv4(), ...data };
    setTransactions(prev => {
      const next = [...prev, tx];
      saveTransactions(next);
      return next;
    });
  }, []);

  const updateTransaction = useCallback((id: string, data: Omit<Transaction, 'id'>) => {
    setTransactions(prev => {
      const next = prev.map(t => t.id === id ? { id, ...data } : t);
      saveTransactions(next);
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const next = prev.filter(t => t.id !== id);
      saveTransactions(next);
      return next;
    });
  }, []);

  return { transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction };
}
