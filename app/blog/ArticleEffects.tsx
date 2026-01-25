'use client';

import Script from 'next/script';

export default function ArticleEffects({ slug }: { slug: string }) {
  return (
    <Script
      src={`/js/effects/${slug}.js`}
      strategy="afterInteractive"
    />
  );
}
