'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

// ===================================
// グローバル型定義を拡張
// ===================================
declare global {
  interface Window {
    reinitBlogArticle?: () => void;
  }
}

export default function BlogPost(props: any) {
  const params = useParams();
  
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
  }, [params.slug]);
  
  // ====================================
  // 既存のコード（ここから下は既存を維持）
  // ====================================
  
  // 例：既存のreturn文
  return (
    <div>
      {/* 既存のJSX */}
    </div>
  );
}
