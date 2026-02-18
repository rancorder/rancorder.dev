'use client';

import { useState } from 'react';
import TokyoNightCanvas from '@/components/TokyoNightCanvas';

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const works = [
    {
      title: '富士山噴火',
      desc: 'Canvas 2D · 600粒子 · 物理演算',
      tech: 'Particle System · Verlet Integration',
      demo: '/demos/fuji-eruption.html',
      type: 'demo',
    },
    {
      title: '東京夜景',
      desc: '4レイヤー · 動的生成 · 光源処理',
      tech: 'Procedural Generation · Real-time',
      demo: '/demos/tokyo-night.html',
      type: 'demo',
    },
    {
      title: '数学アート',
      desc: '反応拡散系 · Mandelbrot · Voronoi',
      tech: '4 Algorithms · Interactive',
      demo: '/demos/math-art.html',
      type: 'demo',
    },
    {
      title: '水面タッチ',
      desc: 'リアルタイム流体 · 波紋伝播',
      tech: 'Fluid Simulation · Wave Equation',
      demo: '/demos/water-ripple.html',
      type: 'demo',
    },
    {
      title: 'Boids - 群れ',
      desc: '3ルール · 自律エージェント',
      tech: 'Alignment · Cohesion · Separation',
      demo: '/demos/boids.html',
      type: 'demo',
    },
    {
      title: 'テトリス',
      desc: '完全実装 · 遊べる',
      tech: 'Game Loop · State Management',
      demo: '/demos/tetris.html',
      type: 'play',
    },
  ];

  return (
    <>
      <TokyoNightCanvas />

      <header className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <a href="/" className="text-xl md:text-2xl font-bold text-white font-mono hover:text-cyan-300 transition-colors">
            rancorder
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/blog" className="text-cyan-100 hover:text-cyan-300 transition-colors font-mono tracking-wide">
              BLOG
            </a>
            <button
              onClick={() => setContactOpen(true)}
              className="text-cyan-100 hover:text-cyan-300 transition-colors font-mono tracking-wide"
            >
              CONTACT
            </button>
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
            
              href="/blog"
              className="block px-4 py-3 text-cyan-100 hover:bg-cyan-500/10 transition-colors font-mono"
            >
              BLOG
            </a>
            <button
              onClick={() => { setContactOpen(true); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-3 text-cyan-100 hover:bg-cyan-500/10 transition-colors font-mono"
            >
              CONTACT
            </button>
          </nav>
        )}
      </header>

      <button
        onClick={() => setContactOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-cyan-500/90 hover:bg-cyan-400 text-black font-mono font-bold tracking-wider transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-cyan-300/50 shadow-lg shadow-cyan-500/50 md:bottom-8 md:right-8 md:px-8 md:py-4 text-sm md:text-base"
      >
        相談する
      </button>

      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-20">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 text-white tracking-tight">
              rancorder
            </h1>
            <p className="text-lg md:text-2xl lg:text-3xl text-cyan-100/80 font-mono tracking-wide leading-relaxed">
              Webシステムを作る。<br className="md:hidden" />
              思想を実装に変える。
            </p>
          </div>
        </section>

        <section className="min-h-screen py-16 md:py-24 px-4 md:px-8 bg-black/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 md:mb-16 text-center font-mono tracking-wider">
              SHOWCASE
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {works.map((work, i) => (
                
                  key={i}
                  href={work.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 overflow-hidden backdrop-blur-sm hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:via-cyan-500/5 group-hover:to-transparent transition-all duration-500" />
                  
                  <div className="relative p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 font-mono group-hover:text-cyan-300 transition-colors">
                      {work.title}
                    </h3>
                    
                    <p className="text-cyan-100/70 text-sm md:text-base mb-3 md:mb-4 leading-relaxed">
                      {work.desc}
                    </p>
                    
                    <p className="text-xs md:text-sm text-cyan-400/60 font-mono mb-4 md:mb-6">
                      {work.tech}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors font-mono text-sm md:text-base font-bold">
                      {work.type === 'play' ? '▶ PLAY' : '▶ DEMO'}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 border-t-2 border-r-2 border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 md:w-20 md:h-20 border-b-2 border-l-2 border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="min-h-screen py-16 md:py-24 px-4 md:px-8 bg-gradient-to-b from-black/40 via-black/60 to-black/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 md:mb-16 text-center font-mono tracking-wider">
              BLOG
            </h2>

            <div className="text-center">
              
                href="/blog"
                className="inline-block px-8 md:px-12 py-3 md:py-4 bg-transparent border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 text-cyan-300 hover:text-white font-mono font-bold tracking-wider transition-all duration-200 text-sm md:text-base"
              >
                すべての記事を見る
              </a>
            </div>
          </div>
        </section>

        <section className="min-h-[50vh] py-16 md:py-24 px-4 md:px-8 bg-black/60 backdrop-blur-md">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 md:mb-12 font-mono tracking-wider">
              CONTACT
            </h2>
            
            <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
              
                href="mailto:hello@rancorder.dev"
                className="block text-lg md:text-2xl text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
              >
                hello@rancorder.dev
              </a>
              
              
                href="https://github.com/rancorder"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-lg md:text-2xl text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
              >
                github.com/rancorder
              </a>
            </div>
            
            <button
              onClick={() => setContactOpen(true)}
              className="px-8 md:px-12 py-3 md:py-4 bg-cyan-500/90 hover:bg-cyan-400 text-black font-mono font-bold tracking-wider transition-all duration-200 hover:scale-105 border border-cyan-300/50 shadow-lg shadow-cyan-500/50 text-sm md:text-base"
            >
              問い合わせフォーム
            </button>
          </div>
        </section>
      </main>

      {contactOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border-2 border-cyan-500/50 p-6 md:p-10 max-w-2xl w-full relative shadow-2xl shadow-cyan-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-4 right-4 text-cyan-400 hover:text-white text-2xl md:text-3xl font-mono transition-colors"
            >
              ×
            </button>
            
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 font-mono">
              問い合わせ
            </h3>
            
            <form className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-cyan-300 mb-2 font-mono text-sm md:text-base">名前</label>
                <input
                  type="text"
                  className="w-full bg-black/50 border border-cyan-500/30 px-4 py-2 md:py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors text-sm md:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyan-300 mb-2 font-mono text-sm md:text-base">メール</label>
                <input
                  type="email"
                  className="w-full bg-black/50 border border-cyan-500/30 px-4 py-2 md:py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors text-sm md:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyan-300 mb-2 font-mono text-sm md:text-base">メッセージ</label>
                <textarea
                  rows={5}
                  className="w-full bg-black/50 border border-cyan-500/30 px-4 py-2 md:py-3 text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors resize-none text-sm md:text-base"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold tracking-wider py-3 md:py-4 transition-colors text-sm md:text-base"
              >
                送信
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
