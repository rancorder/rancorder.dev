// components/blog/CalloutBox.tsx
import React from 'react';

interface CalloutBoxProps {
  type?: 'info' | 'warning' | 'success' | 'critical';
  title?: string;
  children: React.ReactNode;
}

/**
 * 情報ボックスコンポーネント
 * タイプに応じてアイコンと色が変わる
 */
export function CalloutBox({ type = 'info', title, children }: CalloutBoxProps) {
  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    critical: '🧨',
  };

  return (
    <div className={`callout callout--${type}`}>
      <div className="callout__icon" aria-hidden="true">
        {icons[type]}
      </div>
      <div className="callout__body">
        {title && <div className="callout__title">{title}</div>}
        <div className="callout__content">{children}</div>
      </div>
    </div>
  );
}
