export function extractHeadings(html: string) {
  const dom = new JSDOM(html);
  const headings = [...dom.window.document.querySelectorAll('h1, h2, h3')];
  return headings.map(h => ({
    id: h.id,
    text: h.textContent || '',
    level: Number(h.tagName.replace('H', '')),
  }));
}
