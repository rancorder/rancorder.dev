// components/blog/AccordionItem.tsx
'use client';

import { useState } from 'react';
import React from 'react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

/**
 * アコーディオンコンポーネント
 * クリックで開閉
 */
export function AccordionItem({ title, children }: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
      <button
        className="accordion-header"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="accordion-title">{title}</span>
        <span
          className="accordion-icon"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▼
        </span>
      </button>
      {isExpanded && (
        <div className="accordion-content">
          <div className="accordion-body">{children}</div>
        </div>
      )}
    </div>
  );
}
