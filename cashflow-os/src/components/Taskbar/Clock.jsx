import { format } from 'date-fns'
import { useClock } from '../../hooks/useClock'
import styles from './Taskbar.module.css'

export default function Clock() {
  const time = useClock()
  return <div className={styles.clock}>{format(time, 'h:mm:ss a')}</div>
}
