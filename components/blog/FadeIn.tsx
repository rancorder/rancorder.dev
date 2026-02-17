// components/blog/FadeIn.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

/**
 * スクロールに応じてフェードインするコンポーネント
 * IntersectionObserverで画面内に入ったら発火
 */
export function FadeIn({ delay = 0, duration = 600, children }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // delayミリ秒後に表示
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000); // delayは秒単位で指定される想定
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // クリーンアップ
    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all ${duration}ms ease`,
      }}
    >
      {children}
    </div>
  );
}
