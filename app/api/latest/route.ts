// app/api/blog/latest/route.ts
import { getAllPosts } from '@/lib/mdx';
import { NextResponse } from 'next/server';

type UnifiedPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO推奨
  category?: string;
  readingTime?: string;
  source: 'internal' | 'zenn';
  url?: string; // 外部記事はこっち優先
};

const ZENN_FEED_URL = 'https://zenn.dev/supermassu/feed';
const LIMIT = 3;

function toISODateLoose(input: string): string {
  // RSSの pubDate / Atomの updated を雑にISOへ寄せる（失敗したら元の文字列）
  const d = new Date(input);
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  return input;
}

function stripCdata(s: string): string {
  return s.replace(/^<!\[CDATA\[(.*)\]\]>$/s, '$1').trim();
}

function decodeBasicEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function pickTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  return decodeBasicEntities(stripCdata(m[1].trim()));
}

function pickAttr(block: string, tag: string, attr: string): string {
  // 例: <link href="..."/>
  const re = new RegExp(`<${tag}[^>]*\\b${attr}="([^"]+)"[^>]*>`, 'i');
  const m = block.match(re);
  return m ? decodeBasicEntities(m[1]) : '';
}

function extractBlocks(xml: string): { kind: 'rss' | 'atom'; blocks: string[] } {
  // RSS: <item>...</item>
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi);
  if (items?.length) return { kind: 'rss', blocks: items };

  // Atom: <entry>...</entry>
  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi);
  if (entries?.length) return { kind: 'atom', blocks: entries };

  return { kind: 'rss', blocks: [] };
}

function slugFromZennUrl(url: string): string {
  // https://zenn.dev/supermassu/articles/932bf8ec9eef6b -> zenn-932bf8ec9eef6b
  const m = url.match(/\/articles\/([^/?#]+)/);
  return m ? `zenn-${m[1]}` : `zenn-${url.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
}

function excerptFromText(text: string, max = 140): string {
  const t = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

async function fetchZennLatest(): Promise<UnifiedPost[]> {
  const res = await fetch(ZENN_FEED_URL, {
    // ISR前提：revalidateでキャッシュ制御
    next: { revalidate },
    headers: {
      'Accept': 'application/xml, text/xml;q=0.9, */*;q=0.8',
      // 一部サイトはUA無しで弾くことがあるので付ける（無害）
      'User-Agent': 'rancorder-blog-bot/1.0 (+https://rancorder.vercel.app)',
    },
  });

  if (!res.ok) {
    throw new Error(`Zenn feed fetch failed: HTTP ${res.status}`);
  }

  const xml = await res.text();
  const { kind, blocks } = extractBlocks(xml);

  const posts: UnifiedPost[] = blocks.map((b) => {
    if (kind === 'rss') {
      const title = pickTag(b, 'title');
      const link = pickTag(b, 'link');
      const pubDate = pickTag(b, 'pubDate');
      const desc = pickTag(b, 'description');

      return {
        source: 'zenn',
        slug: slugFromZennUrl(link || ''),
        title,
        excerpt: excerptFromText(desc || ''),
        date: toISODateLoose(pubDate || ''),
        category: 'Zenn',
        readingTime: '',
        url: link,
      };
    }

    // atom
    const title = pickTag(b, 'title');
    const link = pickAttr(b, 'link', 'href') || pickTag(b, 'link');
    const updated = pickTag(b, 'updated') || pickTag(b, 'published');
    const summary = pickTag(b, 'summary') || pickTag(b, 'content');

    return {
      source: 'zenn',
      slug: slugFromZennUrl(link || ''),
      title,
      excerpt: excerptFromText(summary || ''),
      date: toISODateLoose(updated || ''),
      category: 'Zenn',
      readingTime: '',
      url: link,
    };
  });

  // 最低限の健全性フィルタ
  return posts.filter((p) => p.title && (p.url || p.slug));
}

function safeDateSortDesc(a: UnifiedPost, b: UnifiedPost): number {
  const da = new Date(a.date).getTime();
  const db = new Date(b.date).getTime();
  // invalid dateは後ろへ
  if (Number.isNaN(da) && Number.isNaN(db)) return 0;
  if (Number.isNaN(da)) return 1;
  if (Number.isNaN(db)) return -1;
  return db - da;
}

export async function GET() {
  try {
    // internal
    const internal = getAllPosts().map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      category: post.category,
      readingTime: post.readingTime,
      source: 'internal' as const,
      url: '', // internalは不要
    }));

    // external (zenn)
    let zenn: UnifiedPost[] = [];
    try {
      zenn = await fetchZennLatest();
    } catch (e) {
      // 外部が落ちても内部は返す（壊れにくさ優先）
      console.error('[latest] zenn fetch error:', e);
    }

    const merged = [...internal, ...zenn]
      .sort(safeDateSortDesc)
      .slice(0, LIMIT);

    // ★レスポンス形を統一（フロントが扱いやすい）
    return NextResponse.json({ ok: true, posts: merged });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ ok: false, error: 'Failed to build latest posts', posts: [] }, { status: 500 });
  }
}

// ISR: 1時間ごとに再生成
export const revalidate = 3600;
