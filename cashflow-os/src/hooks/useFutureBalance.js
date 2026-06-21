import { addMonths } from 'date-fns'
import { useEffect, useState } from 'react'
import { getFutureBalances } from '../utils/balanceEngine'

/** Recomputes the full 12-month balance map (and 30-day low) whenever balance or transactions change. */
export function useFutureBalance(currentBalance, transactions) {
  const [futureBalances, setFutureBalances] = useState({})
  const [lowestBalance, setLowestBalance] = useState(null)

  useEffect(() => {
    const today = new Date()
    const endDate = addMonths(today, 12)
    const balances = getFutureBalances(currentBalance, transactions, today, endDate)
    setFutureBalances(balances)

    const dateKeys = Object.keys(balances).sort().slice(0, 30)
    let lowest = null
    for (const dateKey of dateKeys) {
      const { balance } = balances[dateKey]
      if (lowest === null || balance < lowest.amount) {
        lowest = { amount: balance, date: dateKey }
      }
    }
    setLowestBalance(lowest)
  }, [currentBalance, transactions])

  return { futureBalances, lowestBalance }
}
