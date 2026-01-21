import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const runtime = 'nodejs'; // ← 超重要（fs を使うため）

type Post = {
  slug: string;
  title: string;
  date: string;
  category?: string;
  excerpt?: string;
};

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

  const posts: Post[] = [];

  for (const file of files) {
    const fullPath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');

    const { data, content } = matter(raw);

    if (!data?.title || !data?.date) continue;
    if (data.published === false) continue;

    posts.push({
      slug: file.replace(/\.md$/, ''),
      title: String(data.title),
      date: String(data.date),
      category: data.category ? String(data.category) : undefined,
      excerpt:
        data.excerpt
          ? String(data.excerpt)
          : content.slice(0, 120).replace(/\n/g, ' ') + '…',
    });
  }

  return posts;
}

export async function GET() {
  try {
    const posts = getAllPosts();

    // 新しい順に並べる
    posts.sort((a, b) => b.date.localeCompare(a.date));

    // 最新3件だけ返す
    const latest = posts.slice(0, 3);

    return NextResponse.json(latest, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message ?? 'Unknown error',
      },
      { status: 500 }
    );
  }
}