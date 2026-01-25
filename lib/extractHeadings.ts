export type TocItem = {
  id: string;
  text: string;
  level: number;
};

// ★ slugify は必ず先頭で定義（ビルドエラー防止）
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "") // HTMLタグ除去
    .replace(/[^\wぁ-んァ-ン一-龥]+/g, "-") // 記号→ハイフン
    .replace(/^-+|-+$/g, ""); // 先頭末尾の - を除去
}

export function extractHeadings(html: string): {
  toc: TocItem[];
  htmlWithIds: string;
} {
  const toc: TocItem[] = [];
  let htmlWithIds = html;

  // ★ fade-in や div に包まれていても確実に拾う
  //   改行をまたぐために [\s\S]*? を使用
  const regex = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]);
    const attrs = match[2];
    const inner = match[3];

    // 見出しテキスト（タグ除去）
    const text = inner.replace(/<[^>]+>/g, "").trim();

    // id があるか？
    const idMatch = attrs.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : slugify(text);

    toc.push({ id, text, level });

    // id が無い場合は付与
    if (!idMatch) {
      const original = match[0];
      const replaced = original.replace(
        `<h${level}${attrs}>`,
        `<h${level}${attrs} id="${id}">`
      );
      htmlWithIds = htmlWithIds.replace(original, replaced);
    }
  }

  return { toc, htmlWithIds };
}
