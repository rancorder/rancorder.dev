'use client';

import { useState } from 'react';
import styles from './InteractiveChecklist.module.css';

interface ChecklistItem {
  id: string;
  text: string;
}

const items: ChecklistItem[] = [
  { id: '1', text: '何の価値を確認したいのか' },
  { id: '2', text: 'それはどう測るのか' },
  { id: '3', text: 'どの結果なら「続けない」と言えるのか' },
];

export default function InteractiveChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checked);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setChecked(newChecked);
  };

  const allChecked = items.every((item) => checked.has(item.id));

  return (
    <div className={styles.checklist}>
      <div className={styles.title}>PoC開始前のチェックリスト</div>
      
      <div className={styles.items}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.item} ${checked.has(item.id) ? styles.checked : ''}`}
            onClick={() => toggleCheck(item.id)}
          >
            <div className={styles.checkbox}>
              {checked.has(item.id) && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div className={styles.text}>{item.text}</div>
          </div>
        ))}
      </div>
      
      {allChecked && (
        <div className={styles.message}>
          ✅ これらが定義されていれば、PoCは必ず意味を持つ
        </div>
      )}
    </div>
  );
}
