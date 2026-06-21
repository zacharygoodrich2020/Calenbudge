import styles from './Taskbar.module.css'

/** Decorative only — does not need to function as a real start menu. */
export default function StartButton() {
  return (
    <button className={styles.startBtn} type="button" tabIndex={-1}>
      <span className={styles.logo}>🪟</span>
      <span>START</span>
    </button>
  )
}
