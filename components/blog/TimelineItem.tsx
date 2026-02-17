'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';

interface TimelineItemProps {
  date?: string;
  title?: string;
  children: React.ReactNode;
  color?: string;   // ドット色。デフォルト: '#a78bfa'
  last?: string;    // "true" で末尾ライン非表示
}

const LINE_H = 120;

export function TimelineItem({
  date,
  title,
  children,
  color = '#a78bfa',
  last = 'false',
}: TimelineItemProps) {
  const [dotScale, setDotScale] = useState(0);
  const [lineProgress, setLineProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        /* Phase 1: ドットが弾けて出現 */
        let dotFrame = 0;
        const dotFrames = 20;

        const animateDot = () => {
          dotFrame++;
          const t = dotFrame / dotFrames;
          /* バネ感: overshoot してから落ち着く */
          const scale = 1 + Math.sin(t * Math.PI) * 0.5 * (1 - t);
          setDotScale(Math.min(t * 1.8, 1) + (t > 0.5 ? Math.sin((t - 0.5) * Math.PI * 3) * 0.15 * (1 - t) : 0));

          if (dotFrame < dotFrames) {
            rafRef.current = requestAnimationFrame(animateDot);
          } else {
            setDotScale(1);
            /* Phase 2: ラインが下に伸びる */
            if (last !== 'true') {
              setTimeout(() => animateLine(), 80);
            } else {
              setContentVisible(true);
            }
          }
        };

        /* Phase 2: SVGラインが自走 */
        let lineFrame = 0;
        const lineFrames = 35;

        const animateLine = () => {
          lineFrame++;
          const t = lineFrame / lineFrames;
          const eased = t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
          setLineProgress(eased);

          if (lineFrame < lineFrames) {
            rafRef.current = requestAnimationFrame(animateLine);
          } else {
            setLineProgress(1);
            setContentVisible(true);
          }
        };

        requestAnimationFrame(animateDot);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [last]);

  const lineDashArray = LINE_H;
  const lineDashOffset = lineDashArray * (1 - lineProgress);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        gap: '0',
        position: 'relative',
        marginBottom: '0',
      }}
    >
      {/* 左カラム: ドット + ライン */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: '40px',
          paddingTop: '2px',
        }}
      >
        {/* ドット */}
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: color,
            boxShadow: dotScale > 0
              ? `0 0 ${12 * dotScale}px ${color}, 0 0 ${24 * dotScale}px ${color}44`
              : 'none',
            transform: `scale(${dotScale})`,
            transition: 'box-shadow 0.2s ease',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* 内側のコア */}
          <div
            style={{
              position: 'absolute',
              inset: '3px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.6)',
            }}
          />
        </div>

        {/* SVGライン */}
        {last !== 'true' && (
          <svg
            width="2"
            height={LINE_H}
            style={{ flexShrink: 0 }}
          >
            {/* ベースライン（薄い） */}
            <line
              x1="1" y1="0" x2="1" y2={LINE_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
            />
            {/* アニメーションライン */}
            <line
              x1="1" y1="0" x2="1" y2={LINE_H}
              stroke={color}
              strokeWidth="2"
              strokeDasharray={lineDashArray}
              strokeDashoffset={lineDashOffset}
              style={{
                filter: `drop-shadow(0 0 4px ${color})`,
              }}
            />
          </svg>
        )}
      </div>

      {/* 右カラム: コンテンツ */}
      <div
        style={{
          flex: 1,
          paddingLeft: '1rem',
          paddingBottom: last !== 'true' ? '2rem' : '0.5rem',
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {date && (
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: color,
              textTransform: 'uppercase',
              marginBottom: '0.2rem',
              opacity: 0.8,
            }}
          >
            {date}
          </div>
        )}
        {title && (
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '0.35rem',
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.65,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
