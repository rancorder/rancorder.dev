'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

export function FadeIn({ delay = 0, duration = 700, children }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translateY(0px) scale(1)'
          : 'translateY(36px) scale(0.97)',
        filter: isVisible ? 'blur(0px)' : 'blur(6px)',
        transition: [
          `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          `filter ${Math.round(duration * 0.8)}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        ].join(', '),
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}
