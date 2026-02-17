// components/blog/InteractiveChecklist.tsx
'use client';

import { useState } from 'react';
import React from 'react';

interface InteractiveChecklistProps {
  children: React.ReactNode;
}

/**
 * インタラクティブチェックリスト
 * 子要素のliをチェックボックス付きに変換
 */
export function InteractiveChecklist({ children }: InteractiveChecklistProps) {
  return <ul className="interactive-checklist">{children}</ul>;
}

interface ChecklistItemProps {
  children: React.ReactNode;
}

/**
 * チェックリストの各アイテム
 */
export function ChecklistItem({ children }: ChecklistItemProps) {
  const [checked, setChecked] = useState(false);

  return (
    <li className={checked ? 'checked' : ''}>
      <label className="checklist-item">
        <input
          type="checkbox"
          className="checklist-checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          aria-label="Toggle checklist item"
        />
        <span
          style={{
            opacity: checked ? 0.5 : 1,
            textDecoration: checked ? 'line-through' : 'none',
          }}
        >
          {children}
        </span>
      </label>
    </li>
  );
}
