'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './BlogSection.module.css';

type Status = 'idle' | 'loading' | 'ok' | 'error';

type LatestPost = {
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  category?: string;
  readingTime?: string;
  platform?: string; // 'external' | 'internal' | 'Qiita' | 'Zenn' | 'note' などでもOK
  link?: string;     // 外部記事ならここにURLが入る想定（無くても動く）
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function pickArray(data: unknown): unknown[] | null {
  // APIの返し方が変わっても拾えるようにする（堅牢）
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return null;

  const candidates = ['posts', 'articles', 'items', 'data', 'latest', 'results'];
  for (const key of candidates) {
    const v = data[key];
    if (Array.isArray(v)) return v;
  }

  // ok:true の包み
  if (data.ok === true && Array.isArray(data.posts)) return data.posts;

  return null;
}

function normalizeDate(v: string): string {
  // "2026-01-01" / ISO / RFC をなるべく YYYY-MM-DD に寄せる（失敗したらそのまま）
  if (!v) return '';
  const t = Date.parse(v);
  if (Number.isNaN(t)) return v;
  const d = new Date(t);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function normalizePost(p: unknown): LatestPost | null {
  if (!isRecord(p)) return null;

  const title = safeStr(p.title) || safeStr(p.name);
  const slug = safeStr(p.slug) || safeStr(p.id) || safeStr(p.path);
  const link = safeStr(p.link) || safeStr(p.url);

  // 最低限：title は必須。slug/link のどちらかが無いと遷移できないので落とす
  if (!title) return null;
  if (!slug && !link) return null;

  return {
    slug: slug || link, // linkしか無い場合の救済（slug扱いにする）
    title,
    excerpt: safeStr(p.excerpt) || safeStr(p.description) || '',
    date: normalizeDate(safeStr(p.date) || safeStr(p.publishedAt) || safeStr(p.updatedAt)),
    category: safeStr(p.category) || '',
    readingTime: safeStr(p.readingTime) || safeStr(p.readTime) || '',
    platform: safeStr(p.platform) || '',
    link: link || undefined,
  };
}

function isExternalPost(post: LatestPost): boolean {
  // platform が external の時、または link が http(s) の時は外部扱い
  if ((post.platform || '').toLowerCase() === 'external') return true;
  if (post.link && /^https?:\/\//i.test(post.link)) return true;
  // slug が http(s) の時も外部扱い
  if (/^https?:\/\//i.test(post.slug)) return true;
  return false;
}

function resolveHref(post: LatestPost): { href: string; external: boolean } {
  const external = isExternalPost(post);

  if (external) {
    // link があれば最優先。無ければ slug をURL扱い
    const href = post.link && /^https?:\/\//i.test(post.link) ? post.link : post.slug;
    return { href, external: true };
  }

  // 内部記事
  // slug が "xxxx/articles/xxxx" のようにスラッシュを含んでも Next 側で受けられるならOK。
  // 受けられない場合は slug を encodeURIComponent する設計に寄せる（ここでは安全側）
  const safeSlug = encodeURIComponent(post.slug);
  return { href: `/blog/${safeSlug}`, external: false };
}

export default function BlogSection() {
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [debug, setDebug] = useState<string>('');

  const endpoint = useMemo(() => '/api/blog/latest?limit=3', []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus('loading');
      setError('');
      setDebug('');

      try {
        const res = await fetch(endpoint, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });

        const ct = res.headers.get('content-type') || '';
        const http = res.status;

        if (!res.ok) throw new Error(`HTTP ${http}`);

        const data = await res.json();
        const arr = pickArray(data) ?? [];

        const normalized = arr.map(normalizePost).filter(Boolean) as LatestPost[];

        // デバッグ（必要なら出せるように）
        if (!cancelled) {
          const sample = normalized[0];
          const sampleKeys = sample ? Object.keys(sample).join(', ') : '(none)';
          const rawHead = JSON.stringify(arr.slice(0, 1));
          setDebug(
            [
              `endpoint: ${endpoint}`,
              `HTTP: ${http}`,
              `content-type: ${ct || '(none)'}`,
              `arrayLen: ${arr.length}`,
              `normalizedLen: ${normalized.length}`,
              `sample item keys: ${sampleKeys}`,
              `raw head: ${rawHead}`,
            ].join('\n')
          );
        }

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
          <h2 id="latest-articles" className={styles.title}>
            Latest Articles
          </h2>
          <p className={styles.sub}>最近の更新（自動インデックス）</p>
        </div>
        <a className={styles.all} href="/blog">
          View all →
        </a>
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className={styles.grid} aria-busy="true">
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className={styles.error} role="status">
          <div className={styles.errorTitle}>Latest記事の取得に失敗</div>
          <div className={styles.errorBody}>
            <code>{error}</code>
            <div className={styles.errorHint}>
              まず <code>/api/blog/latest</code> が 200 と JSON を返してるか確認（Vercelでも同じ）。
            </div>
          </div>
        </div>
      )}

      {/* OK but empty */}
      {status === 'ok' && posts.length === 0 && (
        <div className={styles.empty} role="status">
          記事が0件です（title/slug/link の欠損 or normalize で落ちている可能性）。
          <details className={styles.debugBox}>
            <summary>Debug</summary>
            <pre className={styles.debugPre}>{debug}</pre>
          </details>
        </div>
      )}

      {/* OK */}
      {status === 'ok' && posts.length > 0 && (
        <>
          <div className={styles.grid}>
            {posts.map((p) => {
              const { href, external } = resolveHref(p);
              return (
                <a
                  key={`${p.slug}-${p.title}`}
                  className={styles.card}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                >
                  <div className={styles.meta}>
                    {p.category ? <span className={styles.badge}>{p.category}</span> : <span />}
                    <span className={styles.metaText}>
                      {p.date}
                      {p.readingTime ? ` • ${p.readingTime}` : ''}
                      {p.platform ? ` • ${p.platform}` : ''}
                    </span>
                  </div>

                  <div className={styles.cardTitle}>{p.title}</div>
                  {p.excerpt ? <p className={styles.cardExcerpt}>{p.excerpt}</p> : null}

                  <div className={styles.cardArrow} aria-hidden="true">
                    →
                  </div>
                </a>
              );
            })}
          </div>

          {/* Debug（必要なときだけ開ける） */}
          <details className={styles.debugBox}>
            <summary>Debug</summary>
            <pre className={styles.debugPre}>{debug}</pre>
          </details>
        </>
      )}
    </section>
  );
}