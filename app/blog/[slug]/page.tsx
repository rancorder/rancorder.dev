// app/blog/[slug]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function BlogPost() {
  const params = useParams();
  
  useEffect(() => {
    // ページ遷移時に記事を再初期化
    console.log('📄 Blog post mounted, reinitializing...');
    
    // 少し待ってから実行（DOMが確実に準備されるまで）
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
  }, [params.slug]); // slugが変わるたびに再実行
  
  // 既存のコード（dangerouslySetInnerHTMLなど）
  return (
    <div>
      {/* 記事HTML */}
    </div>
  );
}
