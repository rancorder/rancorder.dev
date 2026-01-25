export type TocItem = {
  id: string;
  text: string;
  level: number;
};

// スラッグ生成（日本語もOK）
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '') // HTMLタグ除去
    .replace(/[^\wぁ-んァ-ン一-龥]+/g, '-') // 記号→ハイフン
    .replace(/^-+|-+$/g, ''); // 先頭末尾の - を除去
}

export function extractHeadings(html: string): {
  toc: TocItem[];
  htmlWithIds: string;
} {
  const regex = /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi;
  const toc: TocItem[] = [];
  let htmlWithIds = html;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[1];      // h2, h3...
    const attrs = match[2];    // 属性
    const inner = match[3];    // 見出しテキスト

    const text = inner.replace(/<[^>]+>/g, '').trim();
    const level = Number(tag.replace('h', ''));

    // 既に id があるか？
    const idMatch = attrs.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : slugify(text);

    toc.push({ id, text, level });

    // id が無い見出しには id を付与した HTML に置換
    if (!idMatch) {
      const original = match[0];
      const replaced = original.replace(
        `<${tag}${attrs}>`,
        `<${tag}${attrs} id="${id}">`
      );
      htmlWithIds = htmlWithIds.replace(original, replaced);
    }
  }

  return { toc, htmlWithIds };
}
