// app/api/blog/latest/route.ts
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? '3');

  try {
    // lib/posts.tsから全記事を取得（既にHTMLファイルから読み込まれている）
    const allPosts = getAllPosts();
    
    // 日付でソート（新しい順）
    const sorted = allPosts.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA; // 降順
    });

    // 指定件数だけ取得
    const latest = sorted.slice(0, Math.max(1, Math.min(50, limit)));

    return NextResponse.json(latest, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
