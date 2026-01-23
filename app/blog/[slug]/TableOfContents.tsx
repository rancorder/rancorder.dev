'use client';

import { useEffect, useState } from 'react';
import styles from './TableOfContents.module.css';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  html: string;
}

export default function TableOfContents({ html }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // HTMLから見出しを抽出
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = doc.querySelectorAll('h2[id], h3[id]');

    const items: TocItem[] = Array.from(headings).map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
    }));

    setToc(items);

    // スクロール位置で現在の見出しをハイライト
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    // 実際のDOM要素を監視
    const actualHeadings = document.querySelectorAll('h2[id], h3[id]');
    actualHeadings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, [html]);

  if (toc.length === 0) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className={styles.toc} aria-label="Table of Contents">
      <h2 className={styles.tocTitle}>目次</h2>
      <ul className={styles.tocList}>
        {toc.map(item => (
          <li
            key={item.id}
            className={`${styles.tocItem} ${styles[`level${item.level}`]} ${
              activeId === item.id ? styles.active : ''
            }`}
          >
            <button
              onClick={() => scrollToHeading(item.id)}
              className={styles.tocLink}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
