// app/blog/[slug]/blog-article-wrapper.tsx
'use client';

import { useEffect } from 'react';

// グローバル型定義を拡張
declare global {
  interface Window {
    reinitBlogArticle?: () => void;
  }
}

export function BlogArticleWrapper({ 
  slug, 
  children 
}: { 
  slug: string; 
  children: React.ReactNode;
}) {
  // ページ遷移時に記事を再初期化
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
  }, [slug]); // slugが変わるたびに再実行
  
  return <>{children}</>;
}
