// app/api/blog/latest/route.ts
import { NextResponse } from 'next/server';
import { articles, type Article } from '@/data/articles';

function toNumber(v: string | null, fallback: number) {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeDateKey(s?: string) {
  // dateが無いものは最後尾へ
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

export const runtime = 'nodejs'; // Vercel/Nextで安定させる（Edgeでも動くが念のため）
export const dynamic = 'force-dynamic'; // 常に最新を返す（インデックス更新に追従）

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Math.max(toNumber(searchParams.get('limit'), 3), 1), 30);

  // 1) 重複除去
  const base = dedupeByLink(articles);

  // 2) 新しい順（dateが無いものは後ろ）
  const sorted = base
    .slice()
    .sort((a, b) => normalizeDateKey(b.date) - normalizeDateKey(a.date));

  // 3) 必要件数だけ
  const out = sorted.slice(0, limit);

  return NextResponse.json(out, {
    headers: {
      // インデックスはGitHub更新時に変わる想定 → 基本はキャッシュしない
      'Cache-Control': 'no-store',
    },
  });
}