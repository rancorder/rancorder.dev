// scripts/fetch-external-articles.js
// ESM想定（import）。もし require 環境なら言って。CJS版も即出す。

import fs from "node:fs/promises";
import path from "node:path";

const OUT_PATH = path.join(process.cwd(), "public", "external-articles.json");

// ====== 設定 ======
const QIITA_USER = "rancorder";
const ZENN_USER = "supermassu";
const NOTE_USER = "rancorder";

const LIMIT_QIITA = 3;
const LIMIT_ZENN = 5;
const LIMIT_NOTE = 5;

// ====== util（ログ） ======
function log(msg = "") {
  console.log(msg);
}
function warn(msg = "") {
  console.warn(msg);
}

// ====== util（文字処理） ======
function stripCdata(s = "") {
  // dotAll(s) を使わずに改行含める
  return String(s).replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim();
}

function decodeEntities(s = "") {
  // RSSでよく出る最小セット
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function textFromHtml(html = "") {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromText(text = "", max = 160) {
  const t = String(text).replace(/\s+/g, " ").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function toISO(input) {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

function slugFromUrl(url = "", prefix = "ext") {
  const u = String(url);
  if (!u) return `${prefix}-unknown`;
  return (
    `${prefix}-` +
    u
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .slice(0, 120)
  );
}

// ====== util（fetch） ======
async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "rancorder-external-fetcher/1.0",
      Accept: "application/xml, text/xml;q=0.9, */*;q=0.8",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url} :: ${body.slice(0, 200)}`);
  }
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "rancorder-external-fetcher/1.0",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} for ${url} :: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// ====== RSS/Atom 最小パーサ ======
function pickTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = String(block).match(re);
  if (!m) return "";
  return decodeEntities(stripCdata(m[1].trim()));
}

function pickAttr(block, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\b${attr}="([^"]+)"[^>]*>`, "i");
  const m = String(block).match(re);
  return m ? decodeEntities(m[1]) : "";
}

function extractBlocks(xml) {
  const items = String(xml).match(/<item\b[\s\S]*?<\/item>/gi);
  if (items?.length) return { kind: "rss", blocks: items };

  const entries = String(xml).match(/<entry\b[\s\S]*?<\/entry>/gi);
  if (entries?.length) return { kind: "atom", blocks: entries };

  return { kind: "rss", blocks: [] };
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => {
    const da = new Date(a.date || 0).getTime();
    const db = new Date(b.date || 0).getTime();
    if (Number.isNaN(da) && Number.isNaN(db)) return 0;
    if (Number.isNaN(da)) return 1;
    if (Number.isNaN(db)) return -1;
    return db - da;
  });
}

// ====== Qiita（公式API） ======
async function fetchQiita(user, limit) {
  // Qiita API v2: query=user:<id>
  const url = `https://qiita.com/api/v2/items?query=user:${encodeURIComponent(
    user
  )}&per_page=${limit}`;
  const items = await fetchJson(url);

  const posts = items.map((it) => {
    const title = it.title || "";
    const link = it.url || "";
    const date = toISO(it.created_at || it.updated_at || "") || "";
    const bodyText = it.rendered_body
      ? excerptFromText(textFromHtml(it.rendered_body), 180)
      : excerptFromText(it.body || "", 180);

    const ex =
      bodyText ||
      `Qiita記事「${title}」の要点まとめです。`; // フォールバック（合法）

    return {
      source: "qiita",
      title,
      url: link,
      date,
      excerpt: ex,
      slug: slugFromUrl(link, "qiita"),
    };
  });

  return sortByDateDesc(posts).filter((p) => p.title && p.url).slice(0, limit);
}

// ====== Zenn / note（RSS/Atom） ======
async function fetchRssLike({ source, feedUrl, limit }) {
  const xml = await fetchText(feedUrl);
  const { kind, blocks } = extractBlocks(xml);

  const posts = blocks.map((b) => {
    if (kind === "rss") {
      const title = pickTag(b, "title");
      const link = pickTag(b, "link");
      const pubDate = pickTag(b, "pubDate");
      const desc = pickTag(b, "description");

      const ex =
        excerptFromText(textFromHtml(desc), 180) ||
        `【${source.toUpperCase()}】「${title}」の要点まとめです。`;

      return {
        source,
        title,
        url: link,
        date: toISO(pubDate) || "",
        excerpt: ex,
        slug: slugFromUrl(link, source),
      };
    }

    // Atom
    const title = pickTag(b, "title");
    const link = pickAttr(b, "link", "href") || pickTag(b, "link");
    const updated = pickTag(b, "updated") || pickTag(b, "published");
    const summary = pickTag(b, "summary") || pickTag(b, "content");

    const ex =
      excerptFromText(textFromHtml(summary), 180) ||
      `【${source.toUpperCase()}】「${title}」の要点まとめです。`;

    return {
      source,
      title,
      url: link,
      date: toISO(updated) || "",
      excerpt: ex,
      slug: slugFromUrl(link, source),
    };
  });

  return sortByDateDesc(posts).filter((p) => p.title && p.url).slice(0, limit);
}

async function fetchZenn(user, limit) {
  const feedUrl = `https://zenn.dev/${encodeURIComponent(user)}/feed`;
  return fetchRssLike({ source: "zenn", feedUrl, limit });
}

async function fetchNote(user, limit) {
  const feedUrl = `https://note.com/${encodeURIComponent(user)}/rss`;
  return fetchRssLike({ source: "note", feedUrl, limit });
}

// ====== main ======
async function main() {
  log("");
  log("🚀 Starting external articles fetch...");
  log("");

  // Qiita
  let qiitaArticles = [];
  try {
    log(`📗 Fetching Qiita articles for ${QIITA_USER}...`);
    qiitaArticles = await fetchQiita(QIITA_USER, LIMIT_QIITA);
    log(`✅ Fetched ${qiitaArticles.length} Qiita articles`);
  } catch (e) {
    warn(`⚠ Qiita fetch failed - Using empty fallback`);
    warn(String(e?.message || e));
    qiitaArticles = [];
  }

  // Zenn
  let zennArticles = [];
  try {
    log(`⚡ Fetching Zenn articles for ${ZENN_USER}...`);
    zennArticles = await fetchZenn(ZENN_USER, LIMIT_ZENN);
    log(`✅ Fetched ${zennArticles.length} Zenn articles`);
  } catch (e) {
    warn(`⚠ Zenn fetch failed - Using empty fallback`);
    warn(String(e?.message || e));
    zennArticles = [];
  }

  // note
  let noteArticles = [];
  try {
    log(`📝 Fetching note articles for ${NOTE_USER}...`);
    noteArticles = await fetchNote(NOTE_USER, LIMIT_NOTE);
    log(`✅ Fetched ${noteArticles.length} note articles`);
  } catch (e) {
    warn(`⚠ note fetch failed - Using empty fallback`);
    warn(String(e?.message || e));
    noteArticles = [];
  }

  const merged = sortByDateDesc([
    ...qiitaArticles,
    ...zennArticles,
    ...noteArticles,
  ]);

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(merged, null, 2), "utf8");

  log("");
  log("📊 Summary:");
  log(`   Qiita: ${qiitaArticles.length} articles`);
  log(`   Zenn:  ${zennArticles.length} articles`);
  log(`   note:  ${noteArticles.length} articles`);
  log(`   Total: ${merged.length} articles`);
  log("");
  log(`💾 Saved to: ${OUT_PATH}`);
  log("");

  if (merged.length) {
    log("📝 Sample:");
    merged.slice(0, 3).forEach((a, i) => {
      log(`${i + 1}. [${a.source}] ${a.title}`);
      log(`   ${a.excerpt}`);
    });
    log("");
  }

  log("✨ Done!");
}

main().catch((e) => {
  console.error("❌ External fetch script failed:", e);
  process.exit(1);
});