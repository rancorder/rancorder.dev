'use client';

import { useState } from 'react';
import React from 'react';

interface InteractiveChecklistProps {
  children: React.ReactNode;
}

export function InteractiveChecklist({ children }: InteractiveChecklistProps) {
  const items = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === 'li'
  );
  const total = items.length;
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const [rippling, setRippling] = useState<number | null>(null);

  const toggle = (i: number) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
    setRippling(i);
    setTimeout(() => setRippling(null), 600);
  };

  const count = checkedSet.size;
  const allDone = count === total && total > 0;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div
      style={{
        margin: '2.5rem 0',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Progress header */}
      <div
        style={{
          padding: '1.25rem 1.5rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: '2px',
              background: allDone
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.4s ease',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: allDone ? '#34d399' : 'rgba(255,255,255,0.45)',
            transition: 'color 0.3s ease',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {count} / {total}
        </span>
      </div>

      {/* Items */}
      <ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem 0' }}>
        {items.map((item, i) => {
          const isChecked = checkedSet.has(i);
          const isRippling = rippling === i;
          const text = React.isValidElement(item)
            ? (item as React.ReactElement<{ children?: React.ReactNode }>).props.children
            : null;

          return (
            <li
              key={i}
              onClick={() => toggle(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.9rem 1.5rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background 0.25s ease',
                background: isChecked
                  ? 'rgba(16,185,129,0.07)'
                  : 'transparent',
              }}
            >
              {/* Ripple */}
              {isRippling && (
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isChecked
                      ? 'rgba(16,185,129,0.12)'
                      : 'rgba(99,102,241,0.1)',
                    animation: 'ck-ripple 0.6s ease-out forwards',
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Checkbox */}
              <span
                style={{
                  flexShrink: 0,
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  border: isChecked
                    ? '2px solid #10b981'
                    : '2px solid rgba(255,255,255,0.2)',
                  background: isChecked
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  transform: isChecked ? 'scale(1)' : 'scale(0.95)',
                }}
              >
                {isChecked && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    style={{
                      animation: 'ck-check 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
                    }}
                  >
                    <polyline
                      points="2,7 5,10 11,3"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              {/* Text */}
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: isChecked
                    ? 'rgba(255,255,255,0.4)'
                    : 'rgba(255,255,255,0.85)',
                  textDecoration: isChecked ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(255,255,255,0.25)',
                  transition: 'all 0.35s ease',
                  lineHeight: 1.5,
                }}
              >
                {text}
              </span>
            </li>
          );
        })}
      </ul>

      {/* All done banner */}
      {allDone && (
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(16,185,129,0.2)',
            background: 'rgba(16,185,129,0.08)',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#34d399',
            textAlign: 'center',
            animation: 'ck-slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
            letterSpacing: '0.02em',
          }}
        >
          ✓ すべて完了
        </div>
      )}

      <style>{`
        @keyframes ck-ripple {
          from { opacity: 1; transform: scale(0.95); }
          to   { opacity: 0; transform: scale(1.02); }
        }
        @keyframes ck-check {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ck-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

interface ChecklistItemProps {
  children: React.ReactNode;
}

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
