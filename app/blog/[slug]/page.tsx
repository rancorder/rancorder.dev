// app/blog/[slug]/page.tsx
// 完全Server Component（'use client' 完全削除）

import Link from 'next/link';
import { getPost } from '@/lib/posts';

export default async function BlogPost({ 
  params 
}: { 
  params: Promise<{ slug: string }> | { slug: string } 
}) {
  // paramsがPromiseの場合に対応
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;
  
  // Server Componentで記事を取得
  const post = getPost(slug);
  
  if (!post) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>記事が見つかりません</h1>
        <Link href="/blog">ブログ一覧に戻る</Link>
      </div>
    );
  }
  
  return (
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
      
      {/* 記事本文 */}
      <div 
        dangerouslySetInnerHTML={{ __html: post.html }}
        style={{ width: '100%' }}
      />
      
      {/* 再初期化スクリプト（インライン） */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function tryReinit() {
                if (typeof window.reinitBlogArticle === 'function') {
                  console.log('📄 Reinitializing blog article...');
                  window.reinitBlogArticle();
                } else {
                  // まだ関数が定義されていない場合は少し待つ
                  setTimeout(tryReinit, 100);
                }
              }
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', tryReinit);
              } else {
                tryReinit();
              }
            })();
          `
        }}
      />
    </div>
  );
}

// 静的生成用（オプション）
// export async function generateStaticParams() {
//   const posts = getAllPosts();
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
