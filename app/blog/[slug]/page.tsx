import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './article.module.css';
import { getAllPosts, getPost } from '@/lib/posts';

// 静的パス生成
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

// メタデータ生成
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${post.title} | Technical Insights`,
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

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.articlePage}>
      <article className={styles.articleContainer}>
        {/* Back Navigation */}
        <Link href="/blog" className={styles.backLink}>
          ← Back to Blog
        </Link>

        {/* Article Header */}
        <header className={styles.articleHeader}>
          <div className={styles.articleMeta}>
            <span className={styles.articleCategory}>{post.category}</span>
            <span className={styles.metaDivider}>•</span>
            <time className={styles.articleDate}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.articleReadingTime}>{post.readingTime}</span>
          </div>

          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p className={styles.articleExcerpt}>{post.excerpt}</p>
        </header>

        {/* Article Content */}
        <div
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Footer CTA */}
        <footer className={styles.articleFooter}>
          <div className={styles.footerCta}>
            <h3>Want to discuss how these insights apply to your project?</h3>
            <Link href="/#contact" className={styles.ctaButton}>
              Get in Touch
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
