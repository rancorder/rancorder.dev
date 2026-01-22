// app/components/BlogSection.tsx
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
  platform?: string;
  link?: string;
  fileType?: 'html' | 'mdx' | 'md';
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function pickArray(data: unknown): unknown[] | null {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return null;

  const candidates = ['posts', 'articles', 'items', 'data', 'latest', 'results'];
  for (const key of candidates) {
    const v = data[key];
    if (Array.isArray(v)) return v;
  }

  if (data['ok'] === true && Array.isArray(data['posts'])) return data['posts'] as unknown[];
  return null;
}

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function normalizePost(p: unknown): LatestPost | null {
  if (!isRecord(p)) return null;

  const slug =
    safeStr(p.slug) ||
    safeStr(p.id) ||
    safeStr(p.path) ||
    safeStr(p.url).replace(/^\/blog\//, '');

  const title = safeStr(p.title) || safeStr(p.name);
  if (!title) return null;

  const platform = safeStr(p.platform) || '';
  const link = safeStr(p.link) || safeStr(p.url) || '';

  // externalはlink必須
  if (platform.toLowerCase() === 'external') {
    if (!/^https?:\/\//i.test(link)) return null;
    return {
      slug: slug || link,
      title,
      excerpt: safeStr(p.excerpt) || safeStr(p.description) || '',
      date: safeStr(p.date) || safeStr(p.publishedAt) || '',
      category: safeStr(p.category) || '',
      readingTime: safeStr(p.readingTime) || safeStr(p.readTime) || '',
      platform: 'external',
      link,
    };
  }

  // internal（HTML/MDX/MD記事）
  if (!slug) return null;
  return {
    slug,
    title,
    excerpt: safeStr(p.excerpt) || safeStr(p.description) || '',
    date: safeStr(p.date) || safeStr(p.publishedAt) || '',
    category: safeStr(p.category) || '',
    readingTime: safeStr(p.readingTime) || safeStr(p.readTime) || '',
    platform: platform || 'internal',
    fileType: safeStr(p.fileType) as 'html' | 'mdx' | 'md' | undefined,
  };
}

function resolveHref(p: LatestPost): { href: string; external: boolean } {
  const platform = (p.platform || '').toLowerCase();

  // externalは外部リンク
  if (platform === 'external') {
    if (p.link && /^https?:\/\//i.test(p.link)) {
      return { href: p.link, external: true };
    }
    return { href: '/blog', external: false };
  }

  // internalは /blog/[slug]
  const safe = encodeURIComponent(p.slug);
  return { href: `/blog/${safe}`, external: false };
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
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const arr = pickArray(data) ?? (Array.isArray(data) ? data : null);
        if (!arr) throw new Error('API returned unexpected JSON shape');

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
    return () => {
      cancelled = true;
    };
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
          </div>
        </div>
      )}

      {status === 'ok' && posts.length === 0 && (
        <div className={styles.empty} role="status">
          記事が0件です。
        </div>
      )}

      {status === 'ok' && posts.length > 0 && (
        <div className={styles.grid}>
          {posts.map((p) => {
            const { href, external } = resolveHref(p);

            return (
              <a
                key={`${p.platform ?? 'unknown'}:${p.slug}:${p.title}`}
                className={styles.card}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                <div className={styles.meta}>
                  {p.category && <span className={styles.cat}>{p.category}</span>}
                  {p.date && (
                    <time dateTime={p.date} className={styles.date}>
                      {new Date(p.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                </div>

                <h3 className={styles.cardTitle}>{p.title}</h3>

                {p.excerpt && <p className={styles.ex}>{p.excerpt}</p>}

                <div className={styles.foot}>
                  {p.readingTime && <span className={styles.time}>{p.readingTime}</span>}
                  <span className={styles.arrow}>{external ? '↗' : '→'}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
