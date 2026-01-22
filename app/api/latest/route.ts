// app/api/blog/latest/route.ts
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog-loader';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? '3');

  try {
    // 全記事を取得（既に日付降順でソート済み）
    const allPosts = getAllPosts();
    
    // 指定件数だけ取得
    const latest = allPosts.slice(0, Math.max(1, Math.min(50, limit)));

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
