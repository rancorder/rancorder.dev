// app/blog/[slug]/page.tsx
// Server Component（'use client' なし）

import Link from 'next/link';
import { getPost } from '@/lib/posts';
import { BlogArticleWrapper } from './blog-article-wrapper';

export default function BlogPost({ params }: { params: { slug: string } }) {
  // Server Componentで記事を取得（fsが使える）
  const post = getPost(params.slug);
  
  if (!post) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>記事が見つかりません</h1>
        <Link href="/blog">ブログ一覧に戻る</Link>
      </div>
    );
  }
  
  return (
    <BlogArticleWrapper slug={params.slug}>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        {/* Back to Blog リンク */}
        <div style={{ padding: '2rem' }}>
          <Link 
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.2s',
            }}
          >
            ← Back to Blog
          </Link>
        </div>
        
        {/* 記事本文（HTMLをそのまま表示） */}
        <div 
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ width: '100%' }}
        />
      </div>
    </BlogArticleWrapper>
  );
}
