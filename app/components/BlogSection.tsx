'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './BlogSection.module.css';

type LatestPost = {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  category?: string;
  readingTime?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function pickArray(data: unknown): unknown[] | null {
  // APIの返し方が変わっても拾えるようにする
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return null;

  const candidates = ['posts', 'articles', 'items', 'data', 'latest', 'results'];
  for (const key of candidates) {
    const v = data[key];
    if (Array.isArray(v)) return v;
  }

  // ok:true の包み
  const ok = data['ok'];
  const posts = data['posts'];
  if (ok === true && Array.isArray(posts)) return posts;

  return null;
}

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function normalizePost(p: unknown): LatestPost | null {
  if (!isRecord(p)) return null;

  // slug候補（APIにより名前が違う）
  const slug =
    safeStr(p.slug) ||
    safeStr(p.id) ||
    safeStr(p.path) ||
    safeStr(p.url).replace(/^\/blog\//, '');

  const title = safeStr(p.title) || safeStr(p.name);
  if (!slug || !title) return null;

  return {
    slug,
    title,
    excerpt: safeStr(p.excerpt) || safeStr(p.description) || '',
    date: safeStr(p.date) || safeStr(p.publishedAt) || '',
    category: safeStr(p.category) || '',
    readingTime: safeStr(p.readingTime) || safeStr(p.readTime) || '',
  };
}

export default function BlogSection() {
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');
  const [error, setError] = useState<string>('');
  const [debugKeys, setDebugKeys] = useState<string>('');

  const endpoint = useMemo(() => '/api/blog/latest?limit=3', []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus('loading');
      setError('');
      setDebugKeys('');

      try {
        const res = await fetch(endpoint, { cache: 'no-store', headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const arr = pickArray(data);
        if (!arr) {
          if (isRecord(data)) setDebugKeys(Object.keys(data).join(', '));
          throw new Error('API returned unexpected JSON shape');
        }

        const normalized = arr.map(normalizePost).filter(Boolean) as LatestPost[];
        if (cancelled) return;

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
            {debugKeys && (
              <div className={styles.errorHint}>
                受け取ったJSONのキー: <code>{debugKeys}</code>
              </div>
            )}
            <div className={styles.errorHint}>
              まず <code>/api/blog/latest</code> が 200 と JSON を返してるか確認（Vercelでも同じ）。
            </div>
          </div>
        </div>
      )}

      {status === 'ok' && posts.length === 0 && (
        <div className={styles.empty} role="status">
          記事が0件です（slug/title が取れていない可能性）。
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
              {p.excerpt ? <p className={styles.cardExcerpt}>{p.excerpt}</p> : null}
              <div className={styles.cardArrow}>→</div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
