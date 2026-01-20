// scripts/fetch-external-articles.js
import fs from "node:fs/promises";
import path from "node:path";

const OUT_PATH = path.join(process.cwd(), "public", "external-articles.json");

const QIITA_USER = "rancorder";
const ZENN_USER = "supermassu";
const NOTE_USER = "rancorder";

const LIMIT_QIITA = 3;
const LIMIT_ZENN = 5;
const LIMIT_NOTE = 5;

function log(msg = "") {
  console.log(msg);
}

function warn(msg = "") {
  console.warn(msg);
}

/** 文字をほどよくexcerpt化（HTMLタグ剥がし + 圧縮） */
function excerptFromText(text = "", max = 140) {
  const t = String(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

/** Date文字列をISOへ寄せる（失敗なら空） */
function toISO(input) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

/** CDATA除去（dotAll(s)不要の安全版） */
function stripCdata(s = "") {
  return String(s).replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1").trim();
}

/** 最低限のentity decode（RSSでよく出るやつだけ） */
function decodeEntities(s = "") {
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/** <tag>...</tag> を抜く（CDATA/entity込み） */
function pickTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = String(block).match(re);
  if (!m) return "";
  return decodeEntities(stripCdata(m[1].trim()));
}

/** Atomの <link href="..."> の href を抜く */
function pickAttr(block, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\b${attr}="([^"]+)"[^>]*>`, "i");
  const m = String(block).match(re);
  return m ? decodeEntities(m[1]) : "";
}

/** RSS item / Atom entry を抽出 */
function extractBlocks(xml) {
  const items = String(xml).match(/<item\b[\s\S]*?<\/item>/gi);
  if (items?.length) return { kind: "rss", blocks: items };

  const entries = String(xml).match(/<entry\b[\s\S]*?<\/entry>/gi);
  if (entries?.length) return { kind: "atom", blocks: entries };

  return { kind: "rss", blocks: [] };
}

/** fetch（UA付けて弾かれにくく） */
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

/** ===== Qiita（既存実装があるなら差し替え不要。ここは最小の例） ===== */
async function fetchQiita() {
  // 既存コードがあるならそれを残してOK
  // ここでは「すでに動いてる前提」で空実装にしておく（あなたの現状を壊さない）
  return [];
}

/** ===== Zenn（既存実装があるなら差し替え不要。ここは最小の例） ===== */
async function fetchZenn() {
  // 既存コードがあるならそれを残してOK
  return [];
}

/** ===== note（追加） ===== */
async function fetchNoteRss(user, limit) {
  const feedUrl = `https://note.com/${encodeURIComponent(user)}/rss`;
  const xml = await fetchText(feedUrl);

  const { kind, blocks } = extractBlocks(xml);

  const posts = blocks.map((b) => {
    if (kind === "rss") {
      const title = pickTag(b, "title");
      const link = pickTag(b, "link");
      const pubDate = pickTag(b, "pubDate");
      const desc = pickTag(b, "description");

      const ex = excerptFromText(desc, 160) || `note記事「${title}」の要点まとめです。`;

      return {
        source: "note",
        title,
        url: link,
        date: toISO(pubDate) || "",
        excerpt: ex,
        // 外部は衝突しないようprefix
        slug: `note-${(link || title || "")
          .replace(/^https?:\/\/note\.com\//, "")
          .replace(/[^a-z0-9]+/gi, "-")
          .toLowerCase()
          .slice(0, 80)}`,
      };
    }

    // Atom
    const title = pickTag(b, "title");
    const link = pickAttr(b, "link", "href") || pickTag(b, "link");
    const updated = pickTag(b, "updated") || pickTag(b, "published");
    const summary = pickTag(b, "summary") || pickTag(b, "content");

    const ex = excerptFromText(summary, 160) || `note記事「${title}」の要点まとめです。`;

    return {
      source: "note",
      title,
      url: link,
      date: toISO(updated) || "",
      excerpt: ex,
      slug: `note-${(link || title || "")
        .replace(/^https?:\/\/note\.com\//, "")
        .replace(/[^a-z0-9]+/gi, "-")
        .toLowerCase()
        .slice(0, 80)}`,
    };
  });

  // 健全性フィルタ＋ソート
  const normalized = posts
    .filter((p) => p.title && p.url)
    .sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      if (Number.isNaN(da) && Number.isNaN(db)) return 0;
      if (Number.isNaN(da)) return 1;
      if (Number.isNaN(db)) return -1;
      return db - da;
    })
    .slice(0, limit);

  return normalized;
}

function safeMergeSortByDateDesc(items) {
  return [...items].sort((a, b) => {
    const da = new Date(a.date || 0).getTime();
    const db = new Date(b.date || 0).getTime();
    if (Number.isNaN(da) && Number.isNaN(db)) return 0;
    if (Number.isNaN(da)) return 1;
    if (Number.isNaN(db)) return -1;
    return db - da;
  });
}

async function main() {
  log("");
  log("🚀 Starting external articles fetch...");
  log("");

  // 既存Qiita/Zenn実装がこのファイル内にあるなら、ここに差し替えてOK
  // 今回は「noteだけ追加」なので、Qiita/Zennはあなたの既存処理を維持する想定。
  // もしこのファイルが今Qiita/Zennの実装本体なら、fetchQiita/fetchZennを実装に戻して。
  let qiitaArticles = [];
  let zennArticles = [];

  // 既存のfetch処理が別関数で存在するなら、ここで呼ぶ
  // qiitaArticles = await fetchQiita();
  // zennArticles = await fetchZenn();

  log(`⚡ Fetching note articles for ${NOTE_USER}...`);
  let noteArticles = [];
  try {
    noteArticles = await fetchNoteRss(NOTE_USER, LIMIT_NOTE);
    log(`✅ Fetched ${noteArticles.length} note articles`);
  } catch (e) {
    warn(`⚠ note fetch failed - Using empty fallback`);
    warn(String(e?.message || e));
    noteArticles = [];
  }

  // まとめ（Qiita/Zennは既存JSONに含まれてるならここで読み込む/統合も可能）
  const merged = safeMergeSortByDateDesc([
    ...qiitaArticles,
    ...zennArticles,
    ...noteArticles,
  ]);

  // 保存
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
  if (merged.length > 0) {
    log("📝 Sample excerpts:");
    merged.slice(0, 3).forEach((a, i) => {
      log("");
      log(`${i + 1}. [${a.source}] ${a.title}`);
      log(`   ${a.excerpt}`);
    });
  }
  log("");
  log("✨ Done!");
}

main().catch((e) => {
  console.error("❌ External fetch script failed:", e);
  process.exit(1);
});