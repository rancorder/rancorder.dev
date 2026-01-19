// app/blog/page.tsx
import { getAllPosts } from '@/lib/posts';
import { fetchAllExternalArticles } from '@/lib/external-articles';
import Link from 'next/link';
import styles from './blog.module.css';

// 1時間ごとにISRで再生成
export const revalidate = 3600;

export default function BlogPage() {
  // 内部記事（MDXファイル）
  const posts = getAllPosts();
  
  // 外部記事（キャッシュから読み込み）
  const externalArticles = fetchAllExternalArticles();

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
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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

        {/* External Articles（Qiita/Zenn） */}
        {externalArticles.length > 0 && (
          <section className={styles.section}>
            <div className={styles.externalHeader}>
              <h2 className={styles.sectionTitle}>Latest from Qiita & Zenn</h2>
              <p className={styles.externalSubtitle}>
                Recent articles published on external platforms
              </p>
            </div>
            <div className={styles.externalGrid}>
              {externalArticles.slice(0, 6).map((article, idx) => (
                <a
                  key={idx}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={styles.externalCard}
                >
                  <div className={styles.externalCardHeader}>
                    <span className={`${styles.platformBadge} ${styles[`platform${article.source}`]}`}>
                      {article.source}
                    </span>
                    <span className={styles.externalDate}>
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className={styles.externalTitle}>{article.title}</h3>
                  {article.excerpt && (
                    <p className={styles.externalExcerpt}>{article.excerpt}</p>
                  )}
                  <div className={styles.externalFooter}>
                    <span className={styles.externalLink}>
                      Read on {article.source} →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
