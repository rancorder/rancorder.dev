import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function toSlugFromLink(link: string) {
  try {
    const url = new URL(link);
    return url.pathname.replace(/^\/|\/$/g, '');
  } catch {
    return '';
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 3);

  // ここは「すでに取得できている最新記事配列」を想定
  const items = [
    {
      title: 'スクレイピングはPython一択？',
      link: 'https://zenn.dev/xxxx/articles/xxxx',
      category: 'Scraping',
      date: '2026-01-01',
      readingTime: '6 min',
      excerpt: '常駐×並列×ブラウザ制御を前提にすると…',
    },
  ];

  const normalized = items
    .map((p) => {
      const slug = toSlugFromLink(p.link);
      if (!slug) return null;

      return {
        slug,
        title: p.title,
        date: p.date,
        category: p.category,
        excerpt: p.excerpt,
        readingTime: p.readingTime,
        platform: 'external',
      };
    })
    .filter(Boolean)
    .slice(0, limit);

  return NextResponse.json(normalized, {
    headers: { 'Cache-Control': 'no-store' },
  });
}