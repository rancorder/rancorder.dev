'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './BlogSection.module.css';

type LatestPost = {
  /** 内部詳細ページ用（無ければlink直） */
  slug?: string;
  /** 表示に必須 */
  title: string;
  /** 外部/内部のリンク（最優先） */
  link: string;

  excerpt?: string;
  date?: string;
  category?: string;
  readingTime?: string;

  /** 任意：Qiita/Zenn/note/Localなど */
  platform?: string;
};

type Status = 'idle' | 'loading' | 'ok' | 'error';

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function safeStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function safeNum(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
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
  if (data.ok === true && Array.isArray(data.posts)) return data.posts;

  return null;
}

function guessPlatformFromLink(link: string): string {
  const l = link.toLowerCase();
  if (l.includes('qiita.com')) return 'Qiita';
  if (l.includes('zenn.dev')) return 'Zenn';
  if (l.includes('note.com')) return 'note';
  return 'Blog';
}

function normalizeDate(v: string): string {
  // そのままでも良いけど、ISOっぽい場合だけ軽く整形
  const s = v.trim();
  if (!s) return '';
  const t = Date.parse(s);
  if (Number.isNaN(t)) return s;
  // YYYY-MM-DD
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
    // セグメントが取れない場合の保険
    return seg || u.pathname.replace(/\//g, '-').replace(/^-+|-+$/g, '') || 'post';
  } catch {
    return link
      .replace(/^https?:\/\//, '')
      .replace(/[^\w\-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'post';
  }
}

function normalizePost(p: unknown): LatestPost | null {
  if (!isRecord(p)) return null;

  // ★最優先：link/url/canonical（外部記事はこれが真実）
  const link =
    safeStr(p.link) ||
    safeStr(p.url) ||
    safeStr(p.canonical) ||
    safeStr(p.href) ||
    '';

  // title候補
  const title =
    safeStr(p.title) ||
    safeStr(p.name) ||
    safeStr(p.headline) ||
    '';

  // ここを「slug/title必須」にしない（落としすぎが0件の原因）
  // titleが無い場合も最低限表示できるようにする
  const finalTitle = title || (link ? link : 'Untitled');

  // slug候補（内部記事向け）
  let slug =
    safeStr(p.slug) ||
    safeStr(p.id) ||
    safeStr(p.path) ||
    '';

  // たまに "/blog/xxx" が入ってくるケース
  slug = slug.replace(/^\/?blog\//, '');

  // slugが無いがlinkがあるなら生成しておく（内部URLに使うかは後段で判断）
  if (!slug && link) slug = slugFromLink(link);

  // excerpt
  const excerpt =
    safeStr(p.excerpt) ||
    safeStr(p.description) ||
    safeStr(p.summary) ||
    '';

  const date =
    normalizeDate(
      safeStr(p.date) ||
      safeStr(p.publishedAt) ||
      safeStr(p.published_at) ||
      safeStr(p.pubDate) ||
      safeStr(p.updatedAt) ||
      ''
    );

  const category = safeStr(p.category) || safeStr(p.topic) || '';

  const readingTime =
    safeStr(p.readingTime) ||
    safeStr(p.readTime) ||
    (() => {
      const minutes = safeNum(p.readingMinutes);
      return minutes !== null ? `${minutes} min` : '';
    })();

  const platform =
    safeStr(p.platform) ||
    safeStr(p.source) ||
    (link ? guessPlatformFromLink(link) : '');

  // linkが無い記事は遷移できないので除外（最低条件）
  if (!link) {
    // ただし内部記事が slug だけで来るAPIもありうるので救う
    if (slug) {
      return {
        slug,
        title: finalTitle,
        link: `/blog/${slug}`,
        excerpt,
        date,
        category,
        readingTime,
        platform: platform || 'Blog',
      };
    }
    return null;
  }

  return {
    slug,
    title: finalTitle,
    link,
    excerpt,
    date,
    category,
    readingTime,
    platform,
  };
}

function uniqueByLink(posts: LatestPost[]): LatestPost[] {
  const seen = new Set<string>();
  const out: LatestPost[] = [];
  for (const p of posts) {
    const key = p.link;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

/**
 * ★将来の「GitHub取り込み（静的）」に備えたローカルfallback
 * - いまは空配列でもOK（後で data/articles.ts などに差し替え）
 */
function localFallback(limit: number): LatestPost[] {
  // TODO: data/articles.ts に置き換える（GitHub Actions生成物）
  // 例:
  // import { articles } from '@/data/articles';
  // return articles.slice(0, limit);
  return [];
}

export default function BlogSection() {
  const [posts, setPosts] = useState<LatestPost[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [debugKeys, setDebugKeys] = useState<string>('');

  // 本番で余計な情報を出さない（Nextはこの環境変数がクライアントに渡る）
  const isDev = process.env.NEXT_PUBLIC_ENV === 'dev' || process.env.NODE_ENV !== 'production';

  const limit = 3;
  const endpoint = useMemo(() => `/api/blog/latest?limit=${limit}`, [limit]);

  // 二重fetchを避けたい時の保険（StrictModeでdevは2回走ることがある）
  const fetchedOnce = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      // devのStrictModeによる二重実行を抑制（必要なければ消してOK）
      if (fetchedOnce.current && !isDev) return;
      fetchedOnce.current = true;

      setStatus('loading');
      setError('');
      setDebugKeys('');

      // まずローカルfallbackを入れて「0件表示」を避ける（UX）
      const fallback = localFallback(limit);
      if (fallback.length > 0) setPosts(fallback);

      try {
        const res = await fetch(endpoint, {
          signal: controller.signal,
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const arr = pickArray(data);

        if (!arr) {
          if (isDev && isRecord(data)) setDebugKeys(Object.keys(data).join(', '));
          throw new Error('API returned unexpected JSON shape');
        }

        const normalized = uniqueByLink(
          arr.map(normalizePost).filter(Boolean) as LatestPost[]
        ).slice(0, limit);

        setPosts(normalized);
        setStatus('ok');
      } catch (e: any) {
        if (controller.signal.aborted) return;

        // APIが死んだときは、fallbackがあるならerror扱いにしない（検索装置の思想）
        const msg = e?.message ?? 'Unknown error';
        setError(msg);

        if (posts.length > 0) {
          setStatus('ok'); // 既にfallbackが表示できている
        } else {
          setStatus('error');
        }
      }
    }

    run();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const hasPosts = status === 'ok' && posts.length > 0;

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
            {isDev && debugKeys && (
              <div className={styles.errorHint}>
                受け取ったJSONのキー: <code>{debugKeys}</code>
              </div>
            )}
            {isDev && (
              <div className={styles.errorHint}>
                まず <code>/api/blog/latest</code> が 200 と JSON を返してるか確認（Vercelでも同じ）。
              </div>
            )}
          </div>
        </div>
      )}

      {status === 'ok' && posts.length === 0 && (
        <div className={styles.empty} role="status">
          記事が0件です（APIの返却形式 or link/title の欠損の可能性）。
        </div>
      )}

      {hasPosts && (
        <div className={styles.grid}>
          {posts.map((p) => {
            // 内部詳細が存在するなら内部へ、そうでなければ外部へ
            const isInternal = p.link.startsWith('/blog/');
            const href = isInternal ? p.link : p.link;

            // 外部リンクは新規タブ、内部は通常遷移
            const isExternal = !isInternal && /^https?:\/\//.test(href);

            return (
              <a
                key={p.link}
                className={styles.card}
                href={href}
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