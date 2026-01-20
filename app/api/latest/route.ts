import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/mdx';

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

// ISR: 1時間ごとに再生成（この値は fetch でも使う）
export const revalidate = 3600;

/** Date string -> ISO（変換できなければ元文字列） */
function toISODateLoose(input: string): string {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? input : d.toISOString();
}

/** CDATA を外す（ES2018未満でもOK：dotAll(s)禁止なので [\s\S] を使う） */
function stripCdata(s: string): string {
  return s.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').trim();
}

/** 最低限のHTML entityデコード */
function decodeBasicEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** <tag>...</tag> の中身を取る（CDATA/Entityも最低限処理） */
function pickTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  const inner = m[1].trim();
  return decodeBasicEntities(stripCdata(inner));
}

/** <tag ... attr="..."> の attr を取る（Atom link href など） */
function pickAttr(block: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\b${attr}="([^"]+)"[^>]*>`, 'i');
  const m = block.match(re);
  return m ? decodeBasicEntities(m[1]) : '';
}

/** RSS item / Atom entry を抽出 */
function extractBlocks(xml: string): { kind: 'rss' | 'atom'; blocks: string[] } {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi);
  if (items?.length) return { kind: 'rss', blocks: items };

  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi);
  if (entries?.length) return { kind: 'atom', blocks: entries };

  return { kind: 'rss', blocks: [] };
}

/** Zenn URL -> slug（外部なので internal と衝突しないよう prefix） */
function slugFromZennUrl(url: string): string {
  const m = url.match(/\/articles\/([^/?#]+)/);
  return m ? `zenn-${m[1]}` : `zenn-${url.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
}

/** 文章っぽいexcerptにする（HTMLタグを剥いで詰める） */
function excerptFromText(text: string, max = 140): string {
  const t = text
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
}

async function fetchZennLatest(): Promise<UnifiedPost[]> {
  const res = await fetch(ZENN_FEED_URL, {
    // ISR（外部が更新されても定期で反映）
    next: { revalidate },
    headers: {
      Accept: 'application/xml, text/xml;q=0.9, */*;q=0.8',
      // UA無しで弾かれるケースの保険
      'User-Agent': 'rancorder-blog-bot/1.0',
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

    // Atom
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

  // 健全性フィルタ
  return posts.filter((p) => p.title && (p.url || p.slug));
}

/** dateで降順（invalidは後ろ） */
function safeDateSortDesc(a: UnifiedPost, b: UnifiedPost): number {
  const da = new Date(a.date).getTime();
  const db = new Date(b.date).getTime();
  if (Number.isNaN(da) && Number.isNaN(db)) return 0;
  if (Number.isNaN(da)) return 1;
  if (Number.isNaN(db)) return -1;
  return db - da;
}

export async function GET() {
  try {
    // internal posts（ローカル）
    const internal: UnifiedPost[] = getAllPosts().map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      category: post.category,
      readingTime: post.readingTime,
      source: 'internal',
      url: '',
    }));

    // zenn（外部）—落ちてもinternalだけ返す
    let zenn: UnifiedPost[] = [];
    try {
      zenn = await fetchZennLatest();
    } catch (e) {
      console.error('[latest] zenn fetch error:', e);
    }

    const merged = [...internal, ...zenn]
      .sort(safeDateSortDesc)
      .slice(0, LIMIT);

    // 返却形は統一（フロントのバグを減らす）
    return NextResponse.json({ ok: true, posts: merged });
  } catch (error) {
    console.error('[latest] Failed to build latest posts:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to build latest posts', posts: [] },
      { status: 500 }
    );
  }
}
