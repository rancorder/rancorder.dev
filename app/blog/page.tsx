// app/blog/page.tsx
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
};

function extractMetadata(html: string) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/);
  const tagsMatch = html.match(/<meta name="keywords" content="([^"]+)"/);

  return {
    title: titleMatch ? titleMatch[1] : 'Untitled',
    date: dateMatch ? dateMatch[1] : '1970-01-01',
    tags: tagsMatch
      ? tagsMatch[1].split(',').map(t => t.trim())
      : undefined,
  };
}

function getAllPosts(): BlogPost[] {
  const contentDir = path.join(process.cwd(), 'content', 'blog');

  if (!fs.existsSync(contentDir)) return [];

  return fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter(
      entry =>
        entry.isFile() &&
        entry.name.endsWith('.html') &&
        !entry.name.startsWith('_')
    )
    .map(entry => {
      const slug = entry.name.replace(/\.html$/, '');
      const filePath = path.join(contentDir, entry.name);
      const html = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMetadata(html);

      return {
        slug,              // ← ファイル名由来（唯一の真実）
        title: meta.title,
        date: meta.date,
        tags: meta.tags,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="blog-page">
      <nav className="blog-nav">
        <div className="blog-nav-inner">
          <Link href="/" className="blog-brand">
            rancorder
          </Link>
          <div className="blog-nav-links">
            <Link href="/">HOME</Link>
            <Link href="/blog">BLOG</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>

        <ul className="space-y-8">
          {posts.map(post => (
            <li key={post.slug} className="border-b border-white/10 pb-6">
              <Link
                href={`/blog/${post.slug}`}
                className="block group"
              >
                <time className="block text-sm text-slate-400 mb-1">
                  {post.date}
                </time>

                <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                  {post.title}
                </h2>

                {post.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 border border-white/10 rounded text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
