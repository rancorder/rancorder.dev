'use client';

import { useEffect, useRef, useState, Children, isValidElement } from 'react';

interface FadeInProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export function FadeIn({ delay = 0, duration = 700, children }: FadeInProps) {
  const [phase, setPhase] = useState<'hidden' | 'scanning' | 'visible'>('hidden');
  const [scanLine, setScanLine] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const childCount = Children.count(children);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setPhase('scanning');

            let start: number | null = null;
            const scanDuration = Math.round(duration * 0.45);

            const animate = (ts: number) => {
              if (!start) start = ts;
              const elapsed = ts - start;
              const pct = Math.min(elapsed / scanDuration, 1);
              setScanLine(pct * 100);
              if (pct < 1) {
                rafRef.current = requestAnimationFrame(animate);
              } else {
                setPhase('visible');
              }
            };

            rafRef.current = requestAnimationFrame(animate);
          }, delay * 1000);
        }
      },
      { threshold: 0.08 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [delay, duration]);

  const isHidden = phase === 'hidden';
  const isScanning = phase === 'scanning';
  const isVisible = phase === 'visible';

  const staggeredChildren = Children.map(children, (child, i) => {
    const threshold = childCount > 1 ? (i / (childCount - 1)) * 80 : 0;
    const revealed = isVisible || (isScanning && scanLine > threshold);

    return (
      <div
        key={i}
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed
            ? 'translateY(0px) rotateX(0deg) scale(1)'
            : 'translateY(24px) rotateX(14deg) scale(0.98)',
          filter: revealed ? 'blur(0px)' : 'blur(4px)',
          transition: revealed
            ? `opacity ${Math.round(duration * 0.5)}ms ease ${i * 35}ms,
               transform ${Math.round(duration * 0.6)}ms cubic-bezier(0.16,1,0.3,1) ${i * 35}ms,
               filter ${Math.round(duration * 0.4)}ms ease ${i * 35}ms`
            : 'none',
        }}
      >
        {child}
      </div>
    );
  });

  return (
    <div
      ref={ref}
      style={{
        perspective: '900px',
        perspectiveOrigin: '50% 30%',
        position: 'relative',
        opacity: isHidden ? 0 : 1,
        transition: 'opacity 60ms ease',
      }}
    >
      {isScanning && (
        <>
          {/* スキャンライン本体 */}
          <div
            style={{
              position: 'absolute',
              top: `${scanLine}%`,
              left: '-8px',
              right: '-8px',
              height: '2px',
              background:
                'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(167,139,250,1), rgba(99,102,241,0.6), transparent)',
              boxShadow: '0 0 16px 4px rgba(139,92,246,0.5), 0 0 4px 1px rgba(167,139,250,0.9)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
          {/* スキャン済み領域のグロー */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: `${scanLine}%`,
              background: 'linear-gradient(180deg, transparent 60%, rgba(99,102,241,0.03) 100%)',
              pointerEvents: 'none',
              zIndex: 9,
            }}
          />
        </>
      )}

      <div style={{ transformStyle: 'preserve-3d' }}>
        {staggeredChildren}
      </div>
    </div>
  );
}
