import styles from './Window.module.css'

/** Reusable Win98-style window chrome: title bar + bevel + scanlines. Not draggable by design. */
export default function Window({ title, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`${styles.window} ${className}`}>
      <div className={styles.titlebar}>
        <span className={styles.titleText}>{title}</span>
        <div className={styles.controls} aria-hidden="true">
          <span className={styles.controlBtn}>─</span>
          <span className={styles.controlBtn}>□</span>
          <span className={styles.controlBtn}>✕</span>
        </div>
      </div>
      <div className={`${styles.body} ${bodyClassName}`}>{children}</div>
    </div>
  )
}
