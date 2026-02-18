'use client';

import { useState, useEffect } from 'react';
import TokyoNightCanvas from '@/components/TokyoNightCanvas';

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Webシステムを作る。思想を実装に変える。';

  useEffect(() => {
    setMounted(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const works = [
    {
      title: '富士山噴火',
      desc: 'Canvas 2D · 600粒子 · 物理演算',
      tech: 'Particle System · Verlet Integration',
      demo: '/demos/fuji-eruption.html',
      type: 'demo',
      level: 95,
      color: '#ff6b35',
    },
    {
      title: '東京夜景',
      desc: '4レイヤー · 動的生成 · 光源処理',
      tech: 'Procedural Generation · Real-time',
      demo: '/demos/tokyo-night.html',
      type: 'demo',
      level: 92,
      color: '#00d9ff',
    },
    {
      title: '数学アート',
      desc: '反応拡散系 · Mandelbrot · Voronoi',
      tech: '4 Algorithms · Interactive',
      demo: '/demos/math-art.html',
      type: 'demo',
      level: 88,
      color: '#a855f7',
    },
    {
      title: '水面タッチ',
      desc: 'リアルタイム流体 · 波紋伝播',
      tech: 'Fluid Simulation · Wave Equation',
      demo: '/demos/water-ripple.html',
      type: 'demo',
      level: 90,
      color: '#06b6d4',
    },
    {
      title: 'Boids - 群れ',
      desc: '3ルール · 自律エージェント',
      tech: 'Alignment · Cohesion · Separation',
      demo: '/demos/boids.html',
      type: 'demo',
      level: 87,
      color: '#10b981',
    },
    {
      title: 'テトリス',
      desc: '完全実装 · 遊べる',
      tech: 'Game Loop · State Management',
      demo: '/demos/tetris.html',
      type: 'play',
      level: 94,
      color: '#f59e0b',
    },
  ];

  return (
    <>
      <TokyoNightCanvas />
      
      {/* CRT スキャンライン */}
      <div className="fixed inset-0 z-[5] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.15), rgba(0,0,0,.15) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 2px',
        }} />
      </div>

      {/* パーティクル */}
      <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 border-b-2 border-cyan-400/50" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(6,182,212,0.1) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 20px rgba(6,182,212,0.3), inset 0 -2px 10px rgba(6,182,212,0.2)',
      }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between relative">
          {/* ピクセルコーナー */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          
          <a href="/" className="text-2xl md:text-3xl font-bold text-cyan-400 font-mono tracking-widest relative group">
            <span className="absolute -inset-1 bg-cyan-400/20 blur group-hover:bg-cyan-400/40 transition-all" />
            <span className="relative animate-glitch">rancorder</span>
          </a>
          <button onClick={() => setContactOpen(true)} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-mono font-bold tracking-wider relative group overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
              CONTACT
            </span>
          </button>
        </div>
      </header>

      <button onClick={() => setContactOpen(true)} className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-slow" />
          <div className="relative px-8 py-4 bg-black border-2 border-cyan-400 font-mono font-bold tracking-wider text-cyan-400 hover:text-black hover:bg-cyan-400 transition-all">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 group-hover:bg-black rounded-full animate-ping" />
              相談する
            </span>
          </div>
        </div>
      </button>

      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-32">
          <div className="text-center max-w-4xl">
            <div className="mb-8 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse-slow" />
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-tight relative animate-glitch-title" style={{
                textShadow: '0 0 30px rgba(6,182,212,0.8), 0 0 60px rgba(168,85,247,0.6)',
              }}>
                rancorder
              </h1>
            </div>
            <div className="h-20 md:h-24">
              <p className="text-xl md:text-3xl text-cyan-300 font-mono leading-relaxed" style={{
                textShadow: '0 0 10px rgba(6,182,212,0.8)',
              }}>
                {typedText}
                <span className="inline-block w-3 h-8 md:h-10 bg-cyan-400 ml-1 animate-blink" />
              </p>
            </div>
          </div>
        </section>

        <section className="min-h-screen py-24 px-4 md:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16 relative">
              <div className="inline-block relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 blur-xl opacity-50" />
                <h2 className="text-5xl md:text-7xl font-bold text-cyan-400 font-mono tracking-widest relative" style={{
                  textShadow: '0 0 20px rgba(6,182,212,1), 0 0 40px rgba(168,85,247,0.8)',
                }}>
                  &gt; SHOWCASE_
                </h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {works.map((work, i) => (
                <a key={i} href={work.demo} target="_blank" rel="noopener noreferrer" 
                  className="group relative"
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity blur" style={{
                    background: `linear-gradient(45deg, ${work.color}, ${work.color}80)`,
                  }} />
                  
                  <div className="relative bg-black/90 border-2 overflow-hidden" style={{
                    borderColor: work.color,
                    boxShadow: `0 0 20px ${work.color}40, inset 0 0 20px ${work.color}20`,
                  }}>
                    {/* ピクセルコーナー装飾 */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: work.color }} />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: work.color }} />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: work.color }} />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: work.color }} />
                    
                    {/* レベルバー */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-black/50">
                      <div className="h-full transition-all duration-1000 group-hover:w-full" style={{
                        width: `${work.level}%`,
                        background: `linear-gradient(90deg, ${work.color}, ${work.color}80)`,
                        boxShadow: `0 0 10px ${work.color}`,
                      }} />
                    </div>

                    <div className="p-8">
                      {/* タイトル */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold font-mono group-hover:animate-glitch-fast" style={{
                          color: work.color,
                          textShadow: `0 0 10px ${work.color}`,
                        }}>
                          {work.title}
                        </h3>
                        <span className="text-xs font-mono px-2 py-1 border" style={{
                          color: work.color,
                          borderColor: work.color,
                          boxShadow: `0 0 5px ${work.color}40`,
                        }}>
                          LV.{work.level}
                        </span>
                      </div>
                      
                      {/* 説明 */}
                      <p className="text-cyan-100/80 text-sm mb-3 leading-relaxed font-mono">
                        {work.desc}
                      </p>
                      
                      {/* 技術スタック */}
                      <p className="text-xs text-cyan-400/60 font-mono mb-6 border-l-2 pl-2" style={{
                        borderColor: work.color,
                      }}>
                        {work.tech}
                      </p>
                      
                      {/* CTA */}
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                          background: `linear-gradient(90deg, transparent, ${work.color}40, transparent)`,
                          animation: 'slide 1.5s infinite',
                        }} />
                        <div className="relative flex items-center gap-2 text-sm font-bold font-mono group-hover:translate-x-2 transition-transform" style={{
                          color: work.color,
                        }}>
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: work.color }} />
                          {work.type === 'play' ? '▶ PLAY' : '▶ DEMO'}
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </div>

                    {/* ホログラム風レイヤー */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" style={{
                      background: `repeating-linear-gradient(0deg, ${work.color}20, ${work.color}20 2px, transparent 2px, transparent 4px)`,
                    }} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="min-h-[60vh] py-24 px-4 md:px-8 relative">
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
          }} />
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="mb-12 relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl opacity-50" />
              <h2 className="text-5xl md:text-7xl font-bold text-cyan-400 font-mono tracking-widest relative" style={{
                textShadow: '0 0 20px rgba(6,182,212,1)',
              }}>
                &gt; CONTACT_
              </h2>
            </div>
            
            <div className="space-y-6 mb-12">
              {[
                { icon: '📧', text: 'hello@rancorder.dev', href: 'mailto:hello@rancorder.dev' },
                { icon: '💻', text: 'github.com/rancorder', href: 'https://github.com/rancorder' },
                { icon: '📝', text: 'note.com/rancorder', href: 'https://note.com/rancorder' },
              ].map((link, i) => (
                <a key={i} href={link.href} target="_blank" rel="noopener noreferrer"
                  className="group block relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-50 blur transition-opacity" />
                  <div className="relative bg-black/80 border-2 border-cyan-500/50 group-hover:border-cyan-400 px-6 py-4 font-mono text-xl text-cyan-300 group-hover:text-cyan-400 transition-all" style={{
                    boxShadow: '0 0 10px rgba(6,182,212,0.3)',
                  }}>
                    <span className="mr-3">{link.icon}</span>
                    {link.text}
                  </div>
                </a>
              ))}
            </div>
            
            <button onClick={() => setContactOpen(true)} className="group relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-75 group-hover:opacity-100 blur transition-opacity animate-pulse-slow" />
              <div className="relative px-12 py-4 bg-black border-2 border-cyan-400 font-mono font-bold text-lg tracking-widest text-cyan-400 group-hover:text-black group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 transition-all">
                問い合わせフォーム
              </div>
            </button>
          </div>
        </section>
      </main>

      {contactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setContactOpen(false)}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 blur-xl opacity-75 animate-pulse-slow" />
            <div className="relative bg-black border-4 border-cyan-400 p-8" style={{
              boxShadow: '0 0 40px rgba(6,182,212,0.8), inset 0 0 40px rgba(6,182,212,0.2)',
            }}>
              {/* ピクセルコーナー */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-cyan-400" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-cyan-400" />
              
              <button onClick={() => setContactOpen(false)} className="absolute top-4 right-4 text-cyan-400 hover:text-white text-3xl font-mono transition-colors hover:rotate-90 transform">
                ×
              </button>
              
              <h3 className="text-3xl font-bold text-cyan-400 mb-8 font-mono tracking-widest" style={{
                textShadow: '0 0 20px rgba(6,182,212,1)',
              }}>
                &gt; CONTACT_FORM
              </h3>
              
              <form className="space-y-6">
                {['名前', 'メール', 'メッセージ'].map((label, i) => (
                  <div key={i}>
                    <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wide">
                      &gt; {label}
                    </label>
                    {label === 'メッセージ' ? (
                      <textarea rows={5} className="w-full bg-black/50 border-2 border-cyan-500/50 focus:border-cyan-400 px-4 py-3 text-cyan-100 font-mono focus:outline-none transition-all resize-none" style={{
                        boxShadow: 'inset 0 0 10px rgba(6,182,212,0.2)',
                      }} required />
                    ) : (
                      <input type={label === 'メール' ? 'email' : 'text'} className="w-full bg-black/50 border-2 border-cyan-500/50 focus:border-cyan-400 px-4 py-3 text-cyan-100 font-mono focus:outline-none transition-all" style={{
                        boxShadow: 'inset 0 0 10px rgba(6,182,212,0.2)',
                      }} required />
                    )}
                  </div>
                ))}
                
                <button type="submit" className="w-full group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-75 group-hover:opacity-100 blur transition-opacity" />
                  <div className="relative bg-black border-2 border-cyan-400 py-4 font-mono font-bold text-lg tracking-widest text-cyan-400 group-hover:text-black group-hover:bg-cyan-400 transition-all">
                    送信
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(-100vh) translateX(50px); opacity: 0.8; }
          90% { opacity: 0.6; }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(2px, 2px); }
        }
        @keyframes glitch-title {
          0%, 90%, 100% { transform: translate(0); }
          91% { transform: translate(-3px, 3px); }
          92% { transform: translate(3px, -3px); }
          93% { transform: translate(-3px, -3px); }
        }
        @keyframes glitch-fast {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-1px, 1px); }
          75% { transform: translate(1px, -1px); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        .animate-glitch {
          animation: glitch 3s infinite;
        }
        .animate-glitch-title {
          animation: glitch-title 5s infinite;
        }
        .animate-glitch-fast:hover {
          animation: glitch-fast 0.3s infinite;
        }
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
