// app/blog/[slug]/layout.tsx
// ブログ記事専用レイアウト：CSS/JSを読み込む

import Script from 'next/script';

export default function BlogArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* ブログ記事用のCSS */}
      <link rel="stylesheet" href="/blog-base.css" />
      
      {/* ブログ記事用のJS（Web Components） */}
      <Script 
        src="/blog-components.js" 
        strategy="afterInteractive"
      />
      
      {children}
    </>
  );
}
