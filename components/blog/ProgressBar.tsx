// components/blog/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

/**
 * プログレスバーコンポーネント
 */
export function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="progress-bar-wrapper">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}>
          <span className="progress-text">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
}
