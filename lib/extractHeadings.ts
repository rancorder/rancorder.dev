export function extractHeadings(html: string) {
  const toc = [];
  let htmlWithIds = html;

  // fade-in や div に包まれていても確実に拾う
  const regex = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]);
    const attrs = match[2];
    const inner = match[3];

    const text = inner.replace(/<[^>]+>/g, '').trim();
    const idMatch = attrs.match(/id="([^"]+)"/);
    const id = idMatch ? idMatch[1] : slugify(text);

    toc.push({ id, text, level });

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
