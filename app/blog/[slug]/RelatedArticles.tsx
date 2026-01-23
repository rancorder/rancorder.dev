'use client';

import Link from 'next/link';
import styles from './RelatedArticles.module.css';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  tags: string[];
}

interface RelatedArticlesProps {
  posts: BlogPost[];
}

export default function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.title}>
        <span className={styles.icon}>📚</span>
        関連記事
      </h2>
      <div className={styles.grid}>
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <span className={styles.category}>{post.category}</span>
              <time className={styles.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>

            <h3 className={styles.cardTitle}>{post.title}</h3>
            <p className={styles.cardExcerpt}>{post.excerpt}</p>

            {post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.footer}>
              <span className={styles.readTime}>{post.readingTime}</span>
              <span className={styles.arrow}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
