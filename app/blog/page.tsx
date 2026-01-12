import { getAllPosts } from '@/lib/mdx';
import { fetchAllExternalArticles } from '@/lib/external-articles';
import Link from 'next/link';
import styles from './blog.module.css';

// 1時間ごとにISRで再生成
export const revalidate = 3600;

export const metadata = {
  title: 'Blog | Technical Insights & Project Learnings',
  description: 'In-depth articles on enterprise PM, automation, SRE, and production-grade system design.',
};

export default async function BlogPage() {
  const internalPosts = getAllPosts();
  const externalArticles = fetchAllExternalArticles();

  return (
    <div className={styles.blogPage}>
      {/* ヘッダー */}
      <header className={styles.blogHeader}>
        <div className={styles.container}>
          <Link href="/" className={styles.backLink}>
            ← Back to Portfolio
          </Link>
          <h1 className={styles.blogTitle}>Technical Insights</h1>
          <p className={styles.blogSubtitle}>
            Deep dives into enterprise PM, decision design, automation, and production-grade systems
          </p>
        </div>
      </header>

      <div className={`${styles.container} ${styles.blogContainer}`}>
        {/* 内部記事（MDX） - Featured Articles */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>📝</span>
            Featured Articles
          </h2>
          
          {internalPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Coming soon: comprehensive guides on enterprise PM and production operations</p>
            </div>
          ) : (
            <div className={styles.featuredGrid}>
              {internalPosts.map(post => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className={styles.featuredCard}
                >
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className={styles.cardReadingTime}>{post.readingTime}</span>
                  </div>
                  
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  
                  <div className={styles.cardCategory}>{post.category}</div>
                  
                  <div className={styles.cardCta}>
                    Read full article →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 外部記事（Qiita/Zenn/note） - Latest from External Platforms */}
        {externalArticles.length > 0 && (
          <section className={styles.externalSection}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>🔗</span>
              Latest from Qiita & Zenn
            </h2>
            
            <div className={styles.externalGrid}>
              {externalArticles.map((article, idx) => (
                <a
                  key={idx}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={styles.externalCard}
                >
                  <div className={styles.externalHeader}>
                    <span className={`${styles.platformBadge} ${styles[`platform${article.platform}`]}`}>
                      {article.platform}
                    </span>
                    <span className={styles.externalDate}>
                      {new Date(article.publishedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <h3 className={styles.externalTitle}>{article.title}</h3>
                  <p className={styles.externalSummary}>{article.summary}</p>
                  
                  <div className={styles.externalCta}>
                    Read on {article.platform} →
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
