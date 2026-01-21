// app/api/latest/route.ts
import { NextResponse } from 'next/server';
import { articles, type Article } from '@/data/articles';

/**
 * utility
 */
function toNumber(v: string | null, fallback: number) {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeDateKey(s?: string) {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}

function dedupeByLink(list: Article[]) {
  const seen = new Set<string>();
  const out: Article[] = [];
  for (const a of list) {
    if (!a?.link) continue;
    if (seen.has(a.link)) continue;
    seen.add(a.link);
    out.push(a);
  }
  return out;
}

/**
 * Next.js settings
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/latest?limit=3
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Math.max(toNumber(searchParams.get('limit'), 3), 1),
    30
  );

  // 1) 重複除去
  const base = dedupeByLink(articles);

  // 2) 日付降順（dateが無いものは後ろ）
  const sorted = base
    .slice()
    .sort((a, b) => normalizeDateKey(b.date) - normalizeDateKey(a.date));

  // 3) limit 適用
  const out = sorted.slice(0, limit);

  return NextResponse.json(
    {
      ok: true,
      count: out.length,
      items: out,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}