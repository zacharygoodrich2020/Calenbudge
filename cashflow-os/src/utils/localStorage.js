export const KEYS = {
  BALANCE: 'cashflow_balance',
  TRANSACTIONS: 'cashflow_transactions',
  INITIALIZED: 'cashflow_initialized',
}

export function loadBalance() {
  const raw = localStorage.getItem(KEYS.BALANCE)
  return raw === null ? 0 : parseFloat(raw)
}

export function saveBalance(balance) {
  localStorage.setItem(KEYS.BALANCE, String(balance))
}

export function loadTransactions() {
  const raw = localStorage.getItem(KEYS.TRANSACTIONS)
  return raw ? JSON.parse(raw) : []
}

export function saveTransactions(transactions) {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions))
}

export function isInitialized() {
  return localStorage.getItem(KEYS.INITIALIZED) === 'true'
}

export function markInitialized() {
  localStorage.setItem(KEYS.INITIALIZED, 'true')
}
