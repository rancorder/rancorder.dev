import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getAllPosts() {
  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter(f => f.endsWith('.html'))
    .map(file => {
      const slug = file.replace('.html', '');
      const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
      return { slug, html };
    });
}

export function getPost(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.html`);
  const html = fs.readFileSync(filePath, 'utf8');
  return { slug, html };
}
