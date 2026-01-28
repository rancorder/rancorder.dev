import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import ParticleInitializer from './ParticleInitializer';
import './blog-post.css';

// ===================================
// メタデータ生成（SEO対応）
// ===================================
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

// ===================================
// 静的パス生成（ビルド時に全記事ページを生成）
// ===================================
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ===================================
// サーバーコンポーネント（デフォルト）
// ===================================
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="blog-page">
      {/* パーティクル初期化（クライアントコンポーネント） */}
      <ParticleInitializer slug={params.slug} />

      {/* ナビゲーション */}
      <nav className="blog-nav">
        <div className="blog-nav-inner">
          <Link href="/" className="blog-brand">
            H・M
          </Link>
          <div className="blog-nav-links">
            <Link href="/blog">← All Posts</Link>
            <Link href="/">Portfolio</Link>
          </div>
        </div>
      </nav>

      {/* 記事ヘッダー */}
      <header className="blog-header">
        <div className="blog-header-inner">
          {post.category && (
            <span className="blog-category">{post.category}</span>
          )}
          <h1 className="blog-title">{post.title}</h1>
          <div className="blog-meta">
            <time className="blog-date">{post.date}</time>
            {post.readingTime && (
              <>
                <span className="blog-separator">•</span>
                <span className="blog-reading-time">{post.readingTime}</span>
              </>
            )}
          </div>
          {post.excerpt && (
            <p className="blog-excerpt">{post.excerpt}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 記事コンテンツ */}
      <article className="blog-post-content">
        <div 
          className="blog-content-wrapper"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* フッター */}
      <footer className="blog-footer">
        <div className="blog-footer-inner">
          <Link href="/blog" className="blog-back-link">
            ← Back to All Posts
          </Link>
          <p className="blog-copyright">
            © 2025 H・M. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
