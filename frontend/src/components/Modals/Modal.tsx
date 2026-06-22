import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modals.module.css';

interface ModalProps {
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div className={styles.modal}>
        <div className={styles.titlebar}>
          <span className={styles.title}>{title}</span>
          <div className={styles.controls}>
            <button className={styles.controlBtn}>─</button>
            <button className={styles.controlBtn}>□</button>
            {onClose && <button className={styles.controlBtn} onClick={onClose}>✕</button>}
          </div>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
