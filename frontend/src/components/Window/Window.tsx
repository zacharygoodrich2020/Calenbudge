import styles from './Window.module.css';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function Window({ title, children, className = '', bodyClassName = '' }: WindowProps) {
  return (
    <div className={`${styles.window} ${className}`}>
      <div className={styles.titlebar}>
        <span className={styles.title}>{title}</span>
        <div className={styles.controls}>
          <button className={styles.controlBtn}>─</button>
          <button className={styles.controlBtn}>□</button>
          <button className={styles.controlBtn}>✕</button>
        </div>
      </div>
      <div className={`${styles.body} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}
