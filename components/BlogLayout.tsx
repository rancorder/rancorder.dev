'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  date: string;
  readTime?: string;
  tags?: string[];
}

export default function BlogLayout({ children, title, date, readTime, tags }: BlogLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-cyan-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold text-white font-mono hover:text-cyan-300 transition-colors">
            rancorder
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-cyan-100 hover:text-cyan-300 transition-colors font-mono tracking-wide">
              HOME
            </Link>
            <Link href="/blog" className="text-cyan-100 hover:text-cyan-300 transition-colors font-mono tracking-wide">
              BLOG
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-cyan-400 text-2xl"
            aria-label="メニューを開閉"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-black/95 border-t border-cyan-500/20">
            <Link href="/" className="block px-4 py-3 text-cyan-100 hover:bg-cyan-500/10 transition-colors font-mono">
              HOME
            </Link>
            <Link href="/blog" className="block px-4 py-3 text-cyan-100 hover:bg-cyan-500/10 transition-colors font-mono">
              BLOG
            </Link>
          </nav>
        )}
      </header>

      {/* Article Header */}
      <section className="py-12 md:py-20 px-4 md:px-8 border-b border-cyan-500/10">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm md:text-base mb-8 md:mb-12"
          >
            <span className="hover:-translate-x-1 transition-transform">←</span>
            すべての記事
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 md:mb-8 text-sm md:text-base">
            <time className="text-cyan-400/70 font-mono">
              {date}
            </time>
            {readTime && (
              <>
                <span className="text-cyan-500/30">•</span>
                <span className="text-cyan-100/50 font-mono">
                  {readTime}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">
            {title}
          </h1>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs md:text-sm px-3 py-1.5 bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/20 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Blog Renderer Content */}
          <div className="blog-content-wrapper">
            {children}
          </div>
        </div>
      </article>

      {/* Footer Navigation */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-t border-cyan-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/blog"
            className="inline-block px-8 md:px-12 py-3 md:py-4 bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 text-cyan-300 hover:text-white font-mono font-bold tracking-wider transition-all duration-200 text-sm md:text-base"
          >
            すべての記事を見る
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-12 md:py-16 px-4 md:px-8 bg-black/40">
        <div className="max-w-7xl mx-auto text-center">
          <Link href="/" className="inline-block text-2xl md:text-3xl font-bold text-white font-mono hover:text-cyan-300 transition-colors mb-6">
            rancorder
          </Link>
          <div className="flex items-center justify-center gap-6 md:gap-8 mb-8">
            <a href="mailto:hello@rancorder.dev" className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm md:text-base">
              EMAIL
            </a>
            <a href="https://github.com/rancorder" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm md:text-base">
              GITHUB
            </a>
          </div>
          <p className="text-cyan-100/40 text-xs md:text-sm font-mono">
            © 2026 rancorder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
