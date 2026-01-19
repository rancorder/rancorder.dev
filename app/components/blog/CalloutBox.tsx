'use client';

import styles from './CalloutBox.module.css';

interface CalloutBoxProps {
  type?: 'info' | 'warning' | 'success' | 'critical';
  title?: string;
  children: React.ReactNode;
}

export default function CalloutBox({ type = 'info', title, children }: CalloutBoxProps) {
  return (
    <div className={`${styles.callout} ${styles[type]}`}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
