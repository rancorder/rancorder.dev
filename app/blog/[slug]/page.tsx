import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPost, getAllPosts, getRelatedPosts } from '@/lib/posts';
import { BlogRenderer } from '@/components/blog/blog-renderer';
import ParticleInitializer from './ParticleInitializer';
import ParticleGlobalSetup from './ParticleGlobalSetup';
import './blog-post.css';

// ===================================
// メタデータ生成（SEO対応 + canonical追加）
// ===================================
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `https://rancorder.dev/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      url: `https://rancorder.dev/blog/${params.slug}`,
    },
  };
}

// ===================================
// 静的パス生成（ビルド時に全記事ページを生成）
// ===================================
export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// ===================================
// サーバーコンポーネント（デフォルト）
// ===================================
export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    notFound();
  }

  // ★ 関連記事を取得（最大3件）
  const relatedPosts = getRelatedPosts(post, 3);

  return (
    <div className="blog-page">
      {/* グローバル関数 initParticles を定義 */}
      <ParticleGlobalSetup slug={params.slug} />

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

      {/* 記事コンテンツ - BlogRendererを使用 */}
      <article className="blog-post-content">
        <BlogRenderer html={post.html} />
      </article>

      {/* ★ 関連記事セクション */}
      {relatedPosts.length > 0 && (
        <section className="related-posts-section">
          <div className="related-posts-container">
            <h2 className="related-posts-title">関連記事</h2>
            <div className="related-posts-grid">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="related-post-card"
                >
                  <div className="related-post-meta">
                    <span className="related-post-category">{relatedPost.category}</span>
                    <span className="related-post-date">
                      {new Date(relatedPost.date).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="related-post-title">{relatedPost.title}</h3>
                  <p className="related-post-excerpt">{relatedPost.excerpt}</p>
                  <div className="related-post-footer">
                    <span className="related-post-read-time">{relatedPost.readingTime}</span>
                    <span className="related-post-arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* パーティクル描画用 canvas（記事下部に配置） */}
      <canvas id="particle-canvas" width={400} height={300} />

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
