import { createPortal } from 'react-dom'
import Window from '../Window/Window'
import styles from './Modal.module.css'

/** Generic modal shell: portal + overlay + Win98 window chrome. */
export default function Modal({ title, children, onClose, small = false }) {
  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <Window title={title} className={`${styles.window} ${small ? styles.small : ''}`}>
        {children}
      </Window>
    </div>,
    document.body
  )
}
