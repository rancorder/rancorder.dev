// components/blog/ToolTip.tsx
import React from 'react';

interface ToolTipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

/**
 * ツールチップコンポーネント
 * ホバー時にツールチップを表示
 */
export function ToolTip({ text, position = 'top', children }: ToolTipProps) {
  return (
    <span className="tooltip-wrapper">
      <span className="tooltip-trigger">{children}</span>
      <span className={`tooltip-text tooltip-${position}`} role="tooltip">
        {text}
      </span>
    </span>
  );
}
