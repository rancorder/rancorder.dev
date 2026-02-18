'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogIndex() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 実際は API Route から取得 or Server Component で取得
    // 例: fetch('/api/blog/posts').then(res => res.json()).then(setPosts)
    
    // 仮のダミーデータ
    setPosts([
      {
        slug: '2026-02-17-freedom-removal',
        title: '買わない自由を奪う仕組みを作った',
        date: '2026-02-17',
        tags: ['Web開発', 'UI/UX', 'マーケティング'],
        excerpt: 'Webサイトを作る仕事を長くやっていると、だいたい同じ光景に行き着く。最初はやる気がある。構成を考える。技術を選ぶ。でも、途中から変わる。誰もメンテナンスしなくなる。',
        readTime: '8分',
      },
      {
        slug: '2026-02-16-reservation-system',
        title: '予約システムは「壊れ方」を先に決めたほうがうまくいく',
        date: '2026-02-16',
        tags: ['システム設計', 'バックエンド'],
        excerpt: '予約システムは、最初だいたいこう始まる。空いている・予約できる・完了する。PoCとしては十分。デモも通る。問題は、その先にある。ダブルブッキング、キャンセル、変更。',
        readTime: '6分',
      },
      {
        slug: '2026-02-15-decision-not-to-proceed',
        title: '進めない判断が、いちばん難しい',
        date: '2026-02-15',
        tags: ['プロジェクト管理', '意思決定'],
        excerpt: 'このnoteは、何かを前に進めるためのものではありません。「進めない方がいいかもしれない」という判断を、安全に考えるためのメモです。',
        readTime: '5分',
      },
      {
        slug: '2026-02-14-react-state-management',
        title: 'Reactの状態管理で迷ったら、まず useState だけで作れ',
        date: '2026-02-14',
        tags: ['React', 'フロントエンド'],
        excerpt: 'Redux、MobX、Zustand、Jotai、Recoil... 選択肢が多すぎて最初から悩む。でも、最初から複雑なツールを入れると、だいたい後悔する。',
        readTime: '7分',
      },
      {
        slug: '2026-02-13-canvas-performance',
        title: 'Canvas で 1000 個の粒子を 60fps で動かす方法',
        date: '2026-02-13',
        tags: ['Canvas', 'パフォーマンス', 'JavaScript'],
        excerpt: 'Canvas 2D API は遅い、と言われる。確かに、何も考えずに描画すると30fpsも出ない。でも、ちょっとした工夫で60fpsは余裕で出る。',
        readTime: '10分',
      },
      {
        slug: '2026-02-12-api-design-principles',
        title: 'APIを設計するとき、最初に決めるべき3つのこと',
        date: '2026-02-12',
        tags: ['API設計', 'バックエンド'],
        excerpt: 'REST、GraphQL、gRPC... 技術選定の前に決めることがある。「誰が使うか」「何を保証するか」「どう壊すか」。',
        readTime: '6分',
      },
    ]);
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <Link href="/blog" className="text-cyan-300 font-mono tracking-wide">
              BLOG
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-cyan-400 text-2xl"
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden bg-black/95 border-t border-cyan-500/20">
            <Link href="/" className="block px-4 py-3 text-cyan-100 hover:bg-cyan-500/10 transition-colors font-mono">
              HOME
            </Link>
            <Link href="/blog" className="block px-4 py-3 text-cyan-300 bg-cyan-500/10 font-mono">
              BLOG
            </Link>
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-cyan-500/10">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 font-mono tracking-tight">
            BLOG
          </h1>
          <p className="text-lg md:text-xl text-cyan-100/70 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto">
            Web開発、システム設計、技術選定について。<br className="hidden md:block" />
            現場で得た知見をまとめています。
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="記事を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-cyan-500/30 px-4 md:px-6 py-3 md:py-4 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-cyan-100/40 text-sm md:text-base"
            />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-cyan-100/50 text-lg font-mono">記事が見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post, i) => (
                <Link
                  key={i}
                  href={`/blog/${post.slug}`}
                  className="group block bg-gradient-to-br from-black/60 to-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
                >
                  <div className="p-6 md:p-8">
                    {/* Meta */}
                    <div className="flex items-center justify-between mb-4">
                      <time className="text-xs md:text-sm text-cyan-400/60 font-mono">
                        {post.date}
                      </time>
                      <span className="text-xs md:text-sm text-cyan-100/50 font-mono">
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 group-hover:text-cyan-300 transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm md:text-base text-cyan-100/60 mb-4 md:mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag: string, j: number) => (
                        <span
                          key={j}
                          className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400/80 border border-cyan-500/20 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="inline-flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors font-mono text-sm font-bold">
                      READ MORE
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 border-t border-r border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors" />
                </Link>
              ))}
            </div>
          )}
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
