// app/blog/page.tsx
import { getAllPosts } from '@/lib/posts';
import { fetchAllExternalArticles } from '@/lib/external-articles';
import Link from 'next/link';
import styles from './blog.module.css';

// 1時間ごとにISRで再生成
export const revalidate = 3600;

type ExternalArticleLike = {
  source?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  link?: string; // legacy
  url?: string;  // normalized
  slug?: string;
};

function formatDateSafe(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getExternalHref(a: ExternalArticleLike) {
  return a.url || a.link || '';
}

function getExternalKey(a: ExternalArticleLike, fallbackIndex: number) {
  return a.slug || a.url || a.link || `${a.source || 'ext'}-${fallbackIndex}`;
}

function normalizeSourceLabel(source?: string) {
  if (!source) return 'External';
  const s = source.toLowerCase();
  if (s === 'qiita') return 'Qiita';
  if (s === 'zenn') return 'Zenn';
  if (s === 'note') return 'note';
  if (s === 'github') return 'GitHub';
  return source;
}

function toPlatformClass(source?: string) {
  // CSS側が platformQiita / platformZenn / platformnote のような命名でも
  // platformqiita のような命名でも対応できるよう、なるべく既存に寄せる
  const s = (source || '').trim();
  return s ? `platform${s}` : 'platformExternal';
}

export default function BlogPage() {
  // 内部記事（MDXファイル）
  const posts = getAllPosts();

  // 外部記事（キャッシュから読み込み）
  const externalArticles = (fetchAllExternalArticles() || []) as ExternalArticleLike[];

  return (
    <div className={styles.blogPage}>
      <div className={styles.container}>
        {/* ヘッダー */}
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
          <h1 className={styles.title}>Technical Blog</h1>
          <p className={styles.subtitle}>
            Deep dives into enterprise PM, decision design, and production-grade systems
          </p>
        </header>

        {/* Featured Articles（内部記事） */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Articles</h2>
          <div className={styles.grid}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={styles.featuredCard}
              >
                <div className={styles.cardMeta}>
                  <span className={styles.category}>{post.category}</span>
                  <span className={styles.date}>
                    {formatDateSafe(post.date) || ''}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.readTime}>{post.readingTime}</span>
                  <span className={styles.arrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* External Articles（Qiita/Zenn/note/...） */}
        {externalArticles.length > 0 && (
          <section className={styles.section}>
            <div className={styles.externalHeader}>
              <h2 className={styles.sectionTitle}>External Articles</h2>
              <p className={styles.externalSubtitle}>
                Recent articles published on external platforms
              </p>
            </div>

            <div className={styles.externalGrid}>
              {externalArticles.map((article, idx) => {
                const href = getExternalHref(article);
                if (!href) return null; // URLがないデータは表示しない（壊れ防止）

                const sourceLabel = normalizeSourceLabel(article.source);
                const dateLabel = formatDateSafe(article.date);

                return (
                  <a
                    key={getExternalKey(article, idx)}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={styles.externalCard}
                  >
                    <div className={styles.externalCardHeader}>
                      <span
                        className={`${styles.platformBadge} ${
                          styles[toPlatformClass(article.source)] || ''
                        }`}
                      >
                        {sourceLabel}
                      </span>

                      {dateLabel && (
                        <span className={styles.externalDate}>
                          {dateLabel}
                        </span>
                      )}
                    </div>

                    <h3 className={styles.externalTitle}>{article.title || '(Untitled)'}</h3>

                    {article.excerpt && (
                      <p className={styles.externalExcerpt}>{article.excerpt}</p>
                    )}

                    <div className={styles.externalFooter}>
                      <span className={styles.externalLink}>
                        Read on {sourceLabel} →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}