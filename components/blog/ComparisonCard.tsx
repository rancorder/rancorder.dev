// components/blog/ComparisonCard.tsx
import React from 'react';

interface ComparisonCardProps {
  title?: string;
  good: string;
  bad: string;
}

/**
 * 比較カードコンポーネント
 * Good/Bad を並べて表示
 */
export function ComparisonCard({ title, good, bad }: ComparisonCardProps) {
  return (
    <div className="comparison-card">
      {title && <div className="comparison-card__title">{title}</div>}
      <div className="comparison-grid">
        <div className="comparison-item comparison-item--good">
          <div className="comparison-icon">✅</div>
          <div className="comparison-label">Good</div>
          <div className="comparison-text">{good}</div>
        </div>
        <div className="comparison-item comparison-item--bad">
          <div className="comparison-icon">❌</div>
          <div className="comparison-label">Bad</div>
          <div className="comparison-text">{bad}</div>
        </div>
      </div>
    </div>
  );
}
