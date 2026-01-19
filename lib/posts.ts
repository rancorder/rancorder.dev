import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// HTMLコメントの Frontmatter を解析
function parseFrontMatter(html: string) {
  const match = html.match(/<!--([\s\S]*?)-->/);
  if (!match) return {};

  const lines = match[1].trim().split('\n');
  const meta: Record<string, string> = {};

  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    meta[key.trim()] = rest.join(':').trim();
  }

  return meta;
}

// 全記事取得（ビルド時に実行される）
export function getAllPosts() {
  try {
    const files = fs.readdirSync(BLOG_DIR);

    return files
      .filter(f => f.toLowerCase().endsWith('.html'))
      .map(file => {
        const slug = file.replace(/\.html$/i, '');
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
  } catch (err) {
    console.error('getAllPosts failed:', err);
    return [];
  }
}

// 個別記事取得
export function getPost(slug: string) {
  try {
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
  } catch (err) {
    console.error(`getPost failed for slug: ${slug}`, err);
    return null;
  }
}
