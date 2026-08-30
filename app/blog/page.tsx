import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | rancorder',
  description: '技術、プロジェクトマネジメント、意思決定設計についての記録。',
  alternates: { canonical: '/blog' },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

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

                {post.excerpt && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {post.excerpt}
                  </p>
                )}

                {post.tags.length > 0 && (
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
