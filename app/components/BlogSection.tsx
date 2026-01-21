'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './BlogSection.module.css';

type LatestPost = {
  title: string;
  link: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  category?: string;
  readingTime?: string;
  platform?: string;
};

type Status = 'idle' | 'loading' | 'ok' | 'error';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function pickArray(data: unknown): unknown[] | null {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return null;

  const candidates = [
    'posts',
    'articles',
    'items',
    'data',
    'latest',
    'results',
    'latestPosts',
    'latest_posts',
    'entries',
  ];

  for (const key of candidates) {
    const v = data[key];
    if (Array.isArray(v)) return v;
  }

  if (data.ok === true) {
    const v = data.posts;
    if (Array.isArray(v)) return v;
  }

  return null;
}

function guessPlatformFromLink(link: string) {
  const l = link.toLowerCase();
  if (l.includes('qiita.com')) return 'Qiita';
  if (l.includes('zenn.dev')) return 'Zenn';
  if (l.includes('note.com')) return 'note';
  return 'Blog';
}

function normalizeDate(v: string): string {
  const s = v.trim();
  if (!s) return '';
  const t = Date.parse(s);
  if (Number.isNaN(t)) return s;
  const d = new Date(t);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function slugFromLink(link: string): string {
  try {
    const u = new URL(link);
    const seg = u.pathname.split('/').filter(Boolean).pop() ?? '';
    return seg || u.pathname.replace(/\//g, '-').replace(/^-+|-+$/g, '') || 'post';
  } catch {
    return link
      .replace(/^https?:\/\//, '')
      .replace(/[^\w\-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'post';
  }
}

function normalizePost(raw: unknown): LatestPost | null {
  if (!isRecord(raw)) return null;

  // link候補（外部RSSはだいたいこれが本体）
  const link =
    safeStr(raw.link) ||
    safeStr(raw.url) ||
    safeStr(raw.canonical) ||
    safeStr(raw.href) ||
    '';

  // slug候補（内部記事）
  let slug =
    safeStr(raw.slug) ||
    safeStr(raw.id) ||
    safeStr(raw.path) ||
    '';
  slug = slug.replace(/^\/?blog\//, '');

  // title候補
  const title =
    safeStr(raw.title) ||
    safeStr(raw.name) ||
    safeStr(raw.headline) ||
    '';

  // ★救済：linkが無いがslugがある → 内部リンクにする
  const finalLink = link || (slug ? `/blog/${slug}` : '');

  // ★救済：slugが無いがlinkがある → 生成しておく（内部化はしないがkey等に使える）
  if (!slug && link) slug = slugFromLink(link);

  // ★最低条件：遷移できるlinkがあること。titleは無くても表示可能にする
  if (!finalLink) return null;

  const finalTitle = title || finalLink;

  const excerpt =
    safeStr(raw.excerpt) ||
    safeStr(raw.description) ||
    safeStr(raw.summary) ||
    '';

  const date = normalizeDate(
    safeStr(raw.date) ||
      safeStr(raw.publishedAt) ||
      safeStr(raw.published_at) ||
      safeStr(raw.pubDate) ||
      safeStr(raw.updatedAt) ||
      ''
  );

  const category = safeStr(raw.category) || safeStr(raw.topic) || '';

  const readingTime =
    safeStr(raw.readingTime) ||
    safeStr(raw.readTime) ||
    '';

  const platform =
    safeStr(raw.platform) ||
    safeStr(raw.source) ||
    (finalLink ? guessPlatformFromLink(finalLink) : '');

  return {
    title: finalTitle,
    link: finalLink,
    slug,
    excerpt,
    date,
    category,
    readingTime,
    platform,
  };
}

function uniqueByLink(posts: LatestPost[]) {
  const seen = new Set<string>();
  const out: LatestPost[] = [];
  for (const p of posts) {
    if (seen.has(p.link)) continue;
    seen.add(p.link);
    out.push(p);
  }
  return out;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState<{
    endpoint: string;
    httpStatus?: number;
    contentType?: string;
    rawHead?: string;
    jsonKeys?: string;
    arrayLen?: number;
    normalizedLen?: number;
    sampleItemKeys?: string;
  } | null>(null);

  const limit = 3;
  const endpoint = useMemo(() => `/api/blog/latest?limit=${limit}`, [limit]);

  // 診断表示ON/OFF（本番は消してOK）
  const DEBUG = true;

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setStatus('loading');
      setError('');

      try {
        const res = await fetch(endpoint, {
          signal: controller.signal,
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });

        const contentType = res.headers.get('content-type') ?? '';
        const text = await res.text(); // ← これが超重要（HTML/404でも見える）

        let data: unknown = null;
        try {
          data = JSON.parse(text);
        } catch {
          // JSONじゃない（= 404 HTMLなど）
          if (DEBUG) {
            setDebug({
              endpoint,
              httpStatus: res.status,
              contentType,
              rawHead: text.slice(0, 400),
            });
          }
          throw new Error(`Response is not JSON (HTTP ${res.status})`);
        }

        const arr = pickArray(data);
        const jsonKeys = isRecord(data) ? Object.keys(data).join(', ') : '';

        const arrayLen = arr?.length ?? 0;
        const sampleItemKeys =
          arr && arr[0] && isRecord(arr[0]) ? Object.keys(arr[0]).join(', ') : '';

        const normalized = uniqueByLink(
          (arr ?? []).map(normalizePost).filter(Boolean) as LatestPost[]
        ).slice(0, limit);

        if (DEBUG) {
          setDebug({
            endpoint,
            httpStatus: res.status,
            contentType,
            rawHead: text.slice(0, 400),
            jsonKeys,
            arrayLen,
            normalizedLen: normalized.length,
            sampleItemKeys,
          });
        }

        setPosts(normalized);
        setStatus('ok');
      } catch (e: any) {
        if (controller.signal.aborted) return;
        setStatus('error');
        setError(e?.message ?? 'Unknown error');
      }
    }

    run();
    return () => controller.abort();
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

      {DEBUG && debug && (
        <div className={styles.error} role="status">
          <div className={styles.errorTitle}>Debug</div>
          <div className={styles.errorBody}>
            <div>endpoint: <code>{debug.endpoint}</code></div>
            {debug.httpStatus !== undefined && <div>HTTP: <code>{debug.httpStatus}</code></div>}
            {debug.contentType && <div>content-type: <code>{debug.contentType}</code></div>}
            {debug.jsonKeys && <div>json keys: <code>{debug.jsonKeys}</code></div>}
            {debug.arrayLen !== undefined && <div>arrayLen: <code>{debug.arrayLen}</code></div>}
            {debug.normalizedLen !== undefined && <div>normalizedLen: <code>{debug.normalizedLen}</code></div>}
            {debug.sampleItemKeys && <div>sample item keys: <code>{debug.sampleItemKeys}</code></div>}
            {debug.rawHead && (
              <div style={{ marginTop: 8 }}>
                raw head:
                <pre style={{ whiteSpace: 'pre-wrap' }}>{debug.rawHead}</pre>
              </div>
            )}
          </div>
        </div>
      )}

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
          記事が0件です（APIの返却形式 / link欠損 / normalizeで落としている可能性）。
        </div>
      )}

      {status === 'ok' && posts.length > 0 && (
        <div className={styles.grid}>
          {posts.map((p) => {
            const isExternal = /^https?:\/\//.test(p.link);
            return (
              <a
                key={p.link}
                className={styles.card}
                href={p.link}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
              >
                <div className={styles.meta}>
                  <span className={styles.badge}>
                    {p.category || p.platform || 'Update'}
                  </span>
                  <span className={styles.metaText}>
                    {p.date}{p.readingTime ? ` • ${p.readingTime}` : ''}
                  </span>
                </div>
                <div className={styles.cardTitle}>{p.title}</div>
                {p.excerpt ? <p className={styles.cardExcerpt}>{p.excerpt}</p> : null}
                <div className={styles.cardArrow}>→</div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}