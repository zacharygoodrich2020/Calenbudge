import { useClock } from '../../hooks/useClock';
import styles from './Taskbar.module.css';

export default function Taskbar() {
  const time = useClock();
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.taskbar}>
      <button className={styles.startBtn}>🪟 START</button>
      <div className={styles.windowTab}>CASHFLOW OS</div>
      <div className={styles.spacer} />
      <div className={styles.clock}>{timeStr}</div>
    </div>
  );
}
