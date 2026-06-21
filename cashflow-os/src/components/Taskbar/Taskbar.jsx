import StartButton from './StartButton'
import WindowTab from './WindowTab'
import Clock from './Clock'
import styles from './Taskbar.module.css'

export default function Taskbar() {
  return (
    <div className={styles.taskbar}>
      <StartButton />
      <div className={styles.tabs}>
        <WindowTab />
      </div>
      <Clock />
    </div>
  )
}
