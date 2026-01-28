import Link from 'next/link';
import styles from './page.module.css';

// ブログ記事の型定義
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
}

// ブログデータを取得する関数（実際のデータソースに合わせて調整）
async function getRecentPosts(): Promise<BlogPost[]> {
  // TODO: 実際のブログデータ取得処理に置き換える
  // 例：ファイルシステムから取得、APIから取得、等
  
  // 仮のデータ（実装時に置き換え）
  const allPosts: BlogPost[] = [
    {
      slug: 'example-post-1',
      title: 'Deep dives into enterprise PM',
      excerpt: 'Exploring decision design frameworks and production-grade systems...',
      date: '2026-01-15',
      category: 'Product Management',
      readingTime: '8 min read',
    },
    {
      slug: 'example-post-2',
      title: 'Decision design frameworks',
      excerpt: 'Building frameworks that scale for complex business decisions...',
      date: '2026-01-10',
      category: 'Decision Design',
      readingTime: '6 min read',
    },
  ];

  // 日付順にソートして最新2件を返す
  return allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            {/* Main Title */}
            <div className={styles.titleGroup}>
              <h1 className={styles.titleEn}>Enterprise Product Manager</h1>
              <p className={styles.titleJa}>エンタープライズPM</p>
            </div>

            <div className={styles.titleGroup}>
              <h2 className={styles.titleEn}>Decision Designer</h2>
              <p className={styles.titleJa}>意思決定設計</p>
            </div>

            {/* Subtitle */}
            <div className={styles.subtitleGroup}>
              <p className={styles.subtitleEn}>
                Building production-grade systems and frameworks for complex business decisions.
              </p>
              <p className={styles.subtitleJa}>
                複雑なビジネス判断のための本番運用システムとフレームワークを構築
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              <Link href="/portfolio/ja" className={styles.primaryButton}>
                ポートフォリオを見る
              </Link>
              <Link href="/blog" className={styles.secondaryButton}>
                ブログを読む
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Articles Section */}
        {recentPosts.length > 0 && (
          <section className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitleEn}>Recent Articles</h3>
              <p className={styles.sectionTitleJa}>最新記事</p>
            </div>

            <div className={styles.articlesGrid}>
              {recentPosts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className={styles.articleCard}
                >
                  <div className={styles.articleMeta}>
                    <span className={styles.category}>{post.category}</span>
                    <span className={styles.date}>{formatDate(post.date)}</span>
                  </div>
                  <h4 className={styles.articleTitle}>{post.title}</h4>
                  <p className={styles.articleExcerpt}>{post.excerpt}</p>
                  <div className={styles.articleFooter}>
                    <span className={styles.readTime}>{post.readingTime}</span>
                    <span className={styles.arrow}>→</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className={styles.viewAllLink}>
              <Link href="/blog" className={styles.viewAllButton}>
                View All Articles
                <span className={styles.viewAllArrow}>→</span>
              </Link>
            </div>
          </section>
        )}

        {/* Footer / Contact */}
        <footer className={styles.footer}>
          <div className={styles.contactLinks}>
            <a 
              href="https://linkedin.com/in/yourprofile" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/yourprofile" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              GitHub
            </a>
            <a 
              href="mailto:your.email@example.com"
              className={styles.socialLink}
            >
              Contact
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
