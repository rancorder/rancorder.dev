'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPost } from '@/lib/posts';

// ===================================
// グローバル型定義を拡張
// ===================================
declare global {
  interface Window {
    reinitBlogArticle?: () => void;
  }
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  
  // ===================================
  // ページ遷移時に記事を再初期化
  // ===================================
  useEffect(() => {
    console.log('📄 Blog post mounted, reinitializing...');
    
    const timer = setTimeout(() => {
      // グローバル関数を呼び出し
      if (typeof window.reinitBlogArticle === 'function') {
        window.reinitBlogArticle();
      } else {
        // カスタムイベントを発火
        window.dispatchEvent(new Event('blog-article-mounted'));
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [slug]);
  
  // ===================================
  // 記事データを取得
  // ===================================
  const post = getPost(slug);
  
  if (!post) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>記事が見つかりません</h1>
        <Link href="/blog">ブログ一覧に戻る</Link>
      </div>
    );
  }
  
  // ===================================
  // レンダリング
  // ===================================
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
      
      {/* 記事本文（HTMLをそのまま表示） */}
      <div 
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
