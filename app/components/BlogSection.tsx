'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './BlogSection.module.css';

type LatestPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;        // "2026-01-20"
  category?: string;
  readingTime?: string;
};

type ApiResponse =
  | { ok: true; posts: LatestPost[] }
  | { ok: false; error: string };

function safeText(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

export default function BlogSection() {
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const endpoint = useMemo(() => '/api/blog/latest?limit=3', []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus('loading');
      setError('');

      try {
        const res = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as ApiResponse;

        if (!data || data.ok !== true || !Array.isArray((data as any).posts)) {
          throw new Error('Invalid JSON shape');
        }

        if (cancelled) return;

        const normalized = data.posts.map((p) => ({
          slug: safeText(p.slug),
          title: safeText(p.title),
          excerpt: safeText(p.excerpt),
          date: safeText(p.date),
          category: safeText(p.category),
          readingTime: safeText(p.readingTime),
        })).filter(p => p.slug && p.title);

        setPosts(normalized);
        setStatus('ok');
      } catch (e: any) {
        if (cancelled) return;
        setStatus('error');
        setError(e?.message ?? 'Unknown error');
      }
    }

    run();
    return () => { cancelled = true; };
  }, [endpoint]);

  return (
    <section aria-labelledby="latest-articles" className={styles.wrap}>
      <div className={styles.head}>
        <div>
          <h2 id="latest-articles" className={styles.title}>Latest Articles</h2>
          <p className={styles.sub}>最近の更新（自動インデックス）</p>
        </div>
        <a className={styles.all} href="/blog">View all →</a>
      </div>

      {status === 'loading' && (
        <div className={styles.grid} aria-busy="true">
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error} role="status">
          <div className={styles.errorTitle}>Latest記事の取得に失敗</div>
          <div className={styles.errorBody}>
            <code>{error}</code>
            <div className={styles.errorHint}>
              まず <code>/api/blog/latest</code> が 200 を返してるか確認（Vercelでも同じ）。
            </div>
          </div>
        </div>
      )}

      {status === 'ok' && posts.length === 0 && (
        <div className={styles.empty} role="status">
          まだ記事がありません（または slug/title が取得できていません）。
        </div>
      )}

      {status === 'ok' && posts.length > 0 && (
        <div className={styles.grid}>
          {posts.map((p) => (
            <a key={p.slug} className={styles.card} href={`/blog/${p.slug}`}>
              <div className={styles.meta}>
                {p.category ? <span className={styles.badge}>{p.category}</span> : <span />}
                <span className={styles.metaText}>
                  {p.date}{p.readingTime ? ` • ${p.readingTime}` : ''}
                </span>
              </div>
              <div className={styles.cardTitle}>{p.title}</div>
              <p className={styles.cardExcerpt}>{p.excerpt}</p>
              <div className={styles.cardArrow}>→</div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
