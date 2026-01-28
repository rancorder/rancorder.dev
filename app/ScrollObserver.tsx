'use client';

import { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    if (window.__fadeObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    window.__fadeObserver = observer;

    const scan = () => {
      document
        .querySelectorAll('.fade, .fade-up')
        .forEach((el) => observer.observe(el));
    };

    scan();

    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
  }, []);

  return null;
}
