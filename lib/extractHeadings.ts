export type TocItem = {
  id: string;
  text: string;
  level: number;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\wぁ-んァ-ン一-龥]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractHeadings(html: string): {
  toc: TocItem[];
  htmlWithIds: string;
} {
  const toc: TocItem[] = [];
  let htmlWithIds = html;

  // h1〜h6 を拾う（従来通り）
  const headingRegex = /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi;
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    const inner = match[3];
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const level = Number(tag.replace('h', ''));
    const idMatch = attrs.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : slugify(text);

    toc.push({ id, text, level });

    if (!idMatch) {
      const original = match[0];
      const replaced = original.replace(
        `<${tag}${attrs}>`,
        `<${tag}${attrs} id="${id}">`
      );
      htmlWithIds = htmlWithIds.replace(original, replaced);
    }
  }

  // <p>タグで始まる “見出しっぽい段落” を拾う（あなた専用）
  const paragraphRegex = /<p>([📌🔍⚡🧠＊💡🗣].+?)<\/p>/g;
  let pMatch;
  while ((pMatch = paragraphRegex.exec(html)) !== null) {
    const text = pMatch[1].trim();
    const id = slugify(text);

    toc.push({ id, text, level: 2 }); // 仮に h2 相当とする

    const original = pMatch[0];
    const replaced = `<p id="${id}">${text}</p>`;
    htmlWithIds = htmlWithIds.replace(original, replaced);
  }

  return { toc, htmlWithIds };
}
