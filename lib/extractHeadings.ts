export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function extractHeadings(html: string): TocItem[] {
  const regex = /<(h[1-6])\s+id="([^"]+)"[^>]*>(.*?)<\/\1>/gi;
  const result: TocItem[] = [];

  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[1];       // h1, h2, h3...
    const id = match[2];        // id="xxx"
    const text = match[3]       // inner text
      .replace(/<[^>]+>/g, '')  // HTML タグ除去
      .trim();

    result.push({
      id,
      text,
      level: Number(tag.replace('h', '')),
    });
  }

  return result;
}
