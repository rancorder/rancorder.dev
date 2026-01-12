'use client';

// app/components/BlogSectionJa.tsx - 日本語版ブログセクション
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './BlogSection.module.css';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
}

export default function BlogSectionJa() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog/latest');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // 記事がない、またはローディング中は非表示
  if (loading || posts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className={styles.blogSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>最新の技術記事</h2>
          <p className={styles.subtitle}>
            エンタープライズPM、意思決定設計、本番運用システムに関する詳細な解説
          </p>
        </div>

        <div className={styles.grid}>
          {posts.map(post => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className={styles.card}
            >
              <div className={styles.cardMeta}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.date}>
                  {new Date(post.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
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

        <div className={styles.viewAll}>
          <Link href="/blog" className={styles.viewAllButton}>
            すべての記事を見る
            <span className={styles.buttonArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
