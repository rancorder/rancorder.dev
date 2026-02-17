'use client';

import { useEffect, useRef, useState } from 'react';

interface CounterUpProps {
  value: number;          // 目標値
  suffix?: string;        // 単位（例: "%", "ms", "件"）
  prefix?: string;        // 前置（例: "¥"）
  decimals?: number;      // 小数点桁数。デフォルト: 0
  label?: string;         // ラベルテキスト
  stiffness?: number;     // バネ剛性。デフォルト: 0.07（大きいほど速い）
  damping?: number;       // 減衰。デフォルト: 0.72（小さいほどバウンス強い）
}

export function CounterUp({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  label,
  stiffness = 0.07,
  damping = 0.72,
}: CounterUpProps) {
  const [display, setDisplay] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    /* Verlet バネ積分
     * position: 現在値
     * velocity: 速度
     * target:   目標値
     *
     * acceleration = stiffness * (target - position)
     * velocity = velocity * damping + acceleration
     * position += velocity
     */
    let position = 0;
    let velocity = 0;
    const target = value;

    const tick = () => {
      const acceleration = stiffness * (target - position);
      velocity = velocity * damping + acceleration;
      position += velocity;

      setDisplay(position);

      /* 収束判定: 目標値との差とvelocityが十分小さければ停止 */
      if (Math.abs(target - position) < 0.01 && Math.abs(velocity) < 0.01) {
        setDisplay(target);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, value, stiffness, damping]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString();

  const pct = Math.max(0, Math.min(1, display / value));

  return (
    <div
      ref={ref}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '1.5rem 2rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        minWidth: '120px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景グロー */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 100%, rgba(99,102,241,${pct * 0.15}), transparent 70%)`,
          transition: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* 数値 */}
      <span
        style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'rgba(255,255,255,0.95)',
          fontFamily: "'Courier New', monospace",
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '1.4rem', opacity: 0.6 }}>{prefix}</span>
        {formatted}
        <span style={{ fontSize: '1.4rem', opacity: 0.6 }}>{suffix}</span>
      </span>

      {/* 底辺バー */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct * 100}%`,
            background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
            boxShadow: '0 0 8px rgba(139,92,246,0.6)',
            transition: 'none',
          }}
        />
      </div>

      {/* ラベル */}
      {label && (
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            position: 'relative',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
