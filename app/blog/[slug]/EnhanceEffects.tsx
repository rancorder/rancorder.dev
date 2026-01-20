'use client';

import { useEffect } from 'react';

export default function EnhanceEffects() {
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // fade-in：JSが動いた時だけ有効化
    const fades = document.querySelectorAll<HTMLElement>('fade-in');
    if (!prefersReducedMotion) {
      fades.forEach((el) => {
        // delayは読書の敵になりやすいので上限をかける（任意）
        const raw = Number(el.getAttribute('delay') || '0');
        const delay = Number.isFinite(raw) ? Math.max(0, Math.min(raw, 250)) : 0;
        el.style.transitionDelay = delay ? `${delay}ms` : '0ms';
        el.setAttribute('data-fx', 'fade');
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              (e.target as HTMLElement).classList.add('is-visible');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );

      fades.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }

    // reduced-motion：即表示（隠さない）
    fades.forEach((el) => {
      el.removeAttribute('data-fx');
      el.classList.add('is-visible');
    });
  }, []);

  return null;
}
