// app/api/blog/latest/route.ts
import { getAllPosts } from '@/lib/mdx';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = getAllPosts().slice(0, 3); // 最新3件
    
    // 必要なデータのみ返す
    const simplifiedPosts = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      category: post.category,
      readingTime: post.readingTime,
    }));
    
    return NextResponse.json(simplifiedPosts);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// ISR: 1時間ごとに再生成
export const revalidate = 3600;
