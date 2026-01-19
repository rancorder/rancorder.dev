import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// HTMLファイルの先頭に埋め込むメタデータ形式
// 例：
// <!--
// title: 〇〇
// excerpt: 〇〇
// date: 2026-01-20
// category: 技術
// readingTime: 8 min read
// -->

function parseFrontMatter(html: string) {
  const match = html.match(/<!--([\s\S]*?)-->/);
  if (!match) {
    return {};
  }

  const lines = match[1].trim().split('\n');
  const meta: Record<string, string> = {};

  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    meta[key.trim()] = rest.join(':').trim();
  }

  return meta;
}

export function getAllPosts() {
  const files = fs.readdirSync(BLOG_DIR);

  return files
    .filter(f => f.endsWith('.html'))
    .map(file => {
      const slug = file.replace('.html', '');
      const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');

      const meta = parseFrontMatter(html);

      return {
        slug,
        html,
        title: meta.title || 'Untitled',
        excerpt: meta.excerpt || '',
        date: meta.date || '',
        category: meta.category || '',
        readingTime: meta.readingTime || '',
      };
    });
}

export function getPost(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.html`);
  const html = fs.readFileSync(filePath, 'utf8');

  const meta = parseFrontMatter(html);

  return {
    slug,
    html,
    title: meta.title || 'Untitled',
    excerpt: meta.excerpt || '',
    date: meta.date || '',
    category: meta.category || '',
    readingTime: meta.readingTime || '',
  };
}
