// app/api/blog/latest/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type LatestItem = {
  slug: string;
  title: string;
  date?: string;
  category?: string;
  excerpt?: string;
  readingTime?: string;
  platform?: string;
  link?: string; // ★これを返す
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? '3');

  // TODO: ここはあなたの「集約済みデータの取得」に置き換え
  // 例: const items = await loadLatestFromYourIndex();
  const items: LatestItem[] = [
    {
      slug: 'xxxx/articles/xxxx',
      title: 'スクレイピングはPython一択？',
      date: '2026-01-01',
      category: 'Scraping',
      excerpt: '常駐×並列×ブラウザ制御を前提にすると…',
      readingTime: '6 min',
      platform: 'external',
      link: 'https://qiita.com/xxxxx/items/xxxxxx', // ★これが必要
    },
  ];

  // 最新順 & limit
  const sorted = items
    .filter((x) => x.title && (x.slug || x.link))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, Math.max(1, Math.min(50, limit)));

  return NextResponse.json(sorted, {
    headers: {
      'cache-control': 'no-store',
    },
  });
}