import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import ParticleInitializer from './ParticleInitializer';

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

      {/* スタイル */}
      <style jsx global>{`
        /* ===================================
           グローバルリセット
        =================================== */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0a0a0f;
          color: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.7;
        }

        /* ===================================
           ブログページレイアウト
        =================================== */
        .blog-page {
          min-height: 100vh;
          background: #0a0a0f;
        }

        /* ===================================
           ナビゲーション
        =================================== */
        .blog-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(20px);
          background: rgba(10, 10, 15, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px 0;
        }

        .blog-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .blog-brand {
          font-size: 20px;
          font-weight: 900;
          color: #f8fafc;
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .blog-nav-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }

        .blog-nav-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .blog-nav-links a:hover {
          color: #f8fafc;
        }

        /* ===================================
           記事ヘッダー
        =================================== */
        .blog-header {
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 20px 40px;
        }

        .blog-header-inner {
          position: relative;
          z-index: 10;
        }

        .blog-category {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          color: #a78bfa;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          padding: 6px 12px;
          background: rgba(167, 139, 250, 0.1);
          border: 1px solid rgba(167, 139, 250, 0.3);
          border-radius: 6px;
        }

        .blog-title {
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 24px;
          color: #f8fafc;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #94a3b8;
        }

        .blog-date,
        .blog-reading-time {
          font-weight: 500;
        }

        .blog-separator {
          color: #475569;
        }

        .blog-excerpt {
          font-size: 18px;
          line-height: 1.7;
          color: #cbd5e1;
          margin-bottom: 24px;
        }

        .blog-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .blog-tag {
          font-size: 12px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #94a3b8;
          transition: all 0.2s;
        }

        .blog-tag:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #a78bfa;
          color: #a78bfa;
        }

        /* ===================================
           記事コンテンツ
        =================================== */
        .blog-post-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          position: relative;
          z-index: 10;
        }

        .blog-content-wrapper {
          font-size: 16px;
          line-height: 1.8;
          color: #e2e8f0;
        }

        /* 記事内の見出し */
        .blog-content-wrapper h1,
        .blog-content-wrapper h2,
        .blog-content-wrapper h3,
        .blog-content-wrapper h4,
        .blog-content-wrapper h5,
        .blog-content-wrapper h6 {
          margin: 2em 0 1em;
          font-weight: 700;
          line-height: 1.3;
          color: #f8fafc;
        }

        .blog-content-wrapper h1 {
          font-size: 2.5rem;
        }

        .blog-content-wrapper h2 {
          font-size: 2rem;
          border-bottom: 2px solid rgba(167, 139, 250, 0.2);
          padding-bottom: 0.5rem;
        }

        .blog-content-wrapper h3 {
          font-size: 1.5rem;
        }

        /* 記事内の段落 */
        .blog-content-wrapper p {
          margin: 1.5em 0;
        }

        /* 記事内のリンク */
        .blog-content-wrapper a {
          color: #a78bfa;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .blog-content-wrapper a:hover {
          color: #c4b5fd;
        }

        /* 記事内のリスト */
        .blog-content-wrapper ul,
        .blog-content-wrapper ol {
          margin: 1.5em 0;
          padding-left: 2em;
        }

        .blog-content-wrapper li {
          margin: 0.5em 0;
        }

        /* 記事内のコード */
        .blog-content-wrapper code {
          background: rgba(167, 139, 250, 0.1);
          border: 1px solid rgba(167, 139, 250, 0.2);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          color: #e9d5ff;
        }

        .blog-content-wrapper pre {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          margin: 1.5em 0;
        }

        .blog-content-wrapper pre code {
          background: none;
          border: none;
          padding: 0;
          color: #e2e8f0;
        }

        /* 記事内の引用 */
        .blog-content-wrapper blockquote {
          border-left: 4px solid #a78bfa;
          background: rgba(167, 139, 250, 0.05);
          padding: 16px 24px;
          margin: 1.5em 0;
          font-style: italic;
          color: #cbd5e1;
        }

        /* 記事内の画像 */
        .blog-content-wrapper img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 2em 0;
        }

        /* 記事内のテーブル */
        .blog-content-wrapper table {
          width: 100%;
          border-collapse: collapse;
          margin: 2em 0;
          font-size: 14px;
        }

        .blog-content-wrapper th,
        .blog-content-wrapper td {
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          text-align: left;
        }

        .blog-content-wrapper th {
          background: rgba(167, 139, 250, 0.1);
          font-weight: 700;
          color: #f8fafc;
        }

        .blog-content-wrapper td {
          color: #e2e8f0;
        }

        /* 記事内の水平線 */
        .blog-content-wrapper hr {
          border: none;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          margin: 3em 0;
        }

        /* ===================================
           フッター
        =================================== */
        .blog-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 40px 0;
        }

        .blog-footer-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .blog-back-link {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s;
        }

        .blog-back-link:hover {
          color: #c4b5fd;
          transform: translateX(-4px);
        }

        .blog-copyright {
          font-size: 14px;
          color: #64748b;
        }

        /* ===================================
           レスポンシブ対応
        =================================== */
        @media (max-width: 768px) {
          .blog-nav-inner {
            padding: 0 16px;
          }

          .blog-nav-links {
            gap: 16px;
          }

          .blog-nav-links a {
            font-size: 13px;
          }

          .blog-header {
            padding: 60px 16px 32px;
          }

          .blog-post-content {
            padding: 32px 16px 60px;
          }

          .blog-content-wrapper {
            font-size: 15px;
          }

          .blog-content-wrapper h1 {
            font-size: 2rem;
          }

          .blog-content-wrapper h2 {
            font-size: 1.5rem;
          }

          .blog-content-wrapper h3 {
            font-size: 1.25rem;
          }

          .blog-footer-inner {
            padding: 0 16px;
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
