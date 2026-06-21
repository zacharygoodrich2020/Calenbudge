import { useEffect, useRef, useState } from 'react'
import styles from './Header.module.css'

export default function CurrentBalanceDisplay({ balance }) {
  const [flash, setFlash] = useState(false)
  const prevBalance = useRef(balance)

  useEffect(() => {
    if (prevBalance.current !== balance) {
      setFlash(true)
      prevBalance.current = balance
      const timeout = setTimeout(() => setFlash(false), 400)
      return () => clearTimeout(timeout)
    }
  }, [balance])

  return (
    <div className={styles.balanceBlock}>
      <span className={styles.balanceLabel}>BALANCE</span>
      <span className={`${styles.balanceValue} ${flash ? styles.flash : ''}`}>
        ${balance.toFixed(2)}
      </span>
    </div>
  )
}
