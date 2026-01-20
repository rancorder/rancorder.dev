import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './article.module.css';
import { getAllPosts, getPost } from '@/lib/posts';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Technical Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <div className={styles.articlePage}>
      <article className={styles.articleContainer}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>

        {/* Hero Header */}
        <header className={styles.articleHero} aria-label="記事の概要">
          <div className={styles.metaRow}>
            <span className={styles.badge}>
              <strong>{post.category}</strong>
            </span>
            <span className={styles.metaText}>
              <time dateTime={post.date}>{post.date}</time>
              <span className={styles.dot}>•</span>
              <span>{post.readingTime}</span>
            </span>
          </div>

          <h1 className={styles.heroTitle}>{post.title}</h1>
          <p className={styles.heroDek}>{post.excerpt}</p>

          <div className={styles.heroActions}>
            <a className={`${styles.actionLink} ${styles.actionLinkPrimary}`} href="#content">
              本文へ
            </a>
            <a className={styles.actionLink} href="#resources">
              参考リンクへ
            </a>
          </div>
        </header>

        {/* Content */}
        <div id="content" className={styles.articleContent} dangerouslySetInnerHTML={{ __html: post.html }} />

        {/* Footer */}
        <footer id="resources" className={styles.articleFooter} aria-label="記事のフッター">
          <h2 className={styles.footerTitle}>Resources</h2>

          <div className={styles.footerGrid}>
            <a className={styles.linkCard} href="https://github.com/rancorder/portfolio-react-enterprise">
              <small>GitHub</small>
              <strong>rancorder/portfolio-react-enterprise</strong>
              <span className={styles.cardHint}>実装・構成を見る</span>
            </a>

            <a className={styles.linkCard} href="https://rancorder.vercel.app">
              <small>Live</small>
              <strong>https://rancorder.vercel.app</strong>
              <span className={styles.cardHint}>動作デモを見る</span>
            </a>
          </div>

          <div className={styles.footerCta}>
            <p className={styles.footerCtaText}>
              「この設計、うちの案件だとどうなる？」みたいな壁打ちは歓迎。
            </p>
            <Link href="/#contact" className={styles.ctaButton}>
              お問い合わせ
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
