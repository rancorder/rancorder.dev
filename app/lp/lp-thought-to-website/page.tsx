'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/* ============================================================
   WEB AUDIO
   ============================================================ */
function beep(freq: number = 440, type: OscillatorType = 'square', dur: number = 0.08, vol: number = 0.06) {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch (_) {}
}

function playAlarm() {
  [880, 660, 880, 440].forEach((f, i) =>
    setTimeout(() => beep(f, 'sawtooth', 0.15, 0.1), i * 120)
  );
}

function playSuccess() {
  [523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => beep(f, 'sine', 0.25, 0.12), i * 80)
  );
}

function playClick() { beep(800, 'square', 0.04, 0.05); }
function playDeny()  { beep(200, 'sawtooth', 0.3, 0.1); }

/* ============================================================
   CANVAS: MATRIX RAIN
   ============================================================ */
function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    let W = window.innerWidth, H = window.innerHeight;
    const COLS = Math.floor(W / 20);
    const drops: number[] = Array(COLS).fill(1);

    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };

    window.addEventListener('resize', resize);
    canvas.width = W; canvas.height = H;

    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF><{}[]|_';

    let raf: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00ff41';
      ctx.font = '14px monospace';

      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = drops[i] * 20 > H * 0.7
          ? 'rgba(0,255,65,0.9)'
          : `rgba(0,${Math.floor(180 + Math.random() * 75)},65,${0.4 + Math.random() * 0.4})`;
        ctx.fillText(ch, i * 20, drops[i] * 20);
        if (drops[i] * 20 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: 'fixed', inset: 0, zIndex: 0,
      opacity: 0.18, pointerEvents: 'none',
    }} />
  );
}

/* ============================================================
   CANVAS: CONFETTI BURST (on approval)
   ============================================================ */
function burstConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const W = canvas.width, H = canvas.height;
  const colors = ['#00ff41', '#00cc33', '#ffffff', '#ffaa00', '#00ffff'];
  const particles = Array.from({ length: 120 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 5 + Math.random() * 12;
    return {
      x: W / 2, y: H / 2,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 4,
      size: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1, r: Math.random() * Math.PI * 2, rv: (Math.random() - .5) * .3,
    };
  });
  let raf: number;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of particles) {
      p.vy += 0.25; p.x += p.vx; p.y += p.vy;
      p.vx *= .97; p.life -= .018; p.r += p.rv;
      if (p.life > 0) {
        alive = true;
        ctx.save(); ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
    }
    if (alive) raf = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, W, H);
  };
  raf = requestAnimationFrame(draw);
  setTimeout(() => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); }, 3500);
}

/* ============================================================
   GLITCH TEXT (CSS + JS hybrid)
   ============================================================ */
const GLITCH_CHARS = '!@#$%^&*_<>[]{}|\\/?01';
function TerminalGlitch({ children, active = false }: { children: string; active?: boolean }) {
  const [txt, setTxt] = useState(children);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setTxt(children); return; }
    let frame = 0;
    const total = 24;
    const tick = () => {
      frame++;
      const t = frame / total;
      if (t < 0.6) {
        setTxt(children.split('').map(c =>
          c !== ' ' && Math.random() < 0.5 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
        ).join(''));
      } else {
        const idx = Math.floor(((t - 0.6) / 0.4) * children.length);
        setTxt(children.split('').map((c, i) =>
          i <= idx ? c : c !== ' ' && Math.random() < 0.3 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
        ).join(''));
      }
      if (frame < total) rafRef.current = requestAnimationFrame(tick);
      else setTxt(children);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, children]);

  return <>{txt}</>;
}

/* ============================================================
   TERMINAL TYPEWRITER SECTION
   ============================================================ */
function TerminalSection({ prompt, lines, delay = 0 }: {
  prompt: string; lines: string[]; delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const text = prompt;
    const timer = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setTyped(text.slice(0, i));
        beep(600 + Math.random() * 200, 'square', 0.03, 0.03);
        if (i >= text.length) {
          clearInterval(id);
          setTimeout(() => setLineIdx(lines.length), 300);
        }
      }, 28);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s',
      fontFamily: "'VT323', monospace",
    }}>
      <div style={{ color: '#00ff41', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
        <span style={{ color: '#00aa28' }}>root@system</span>
        <span style={{ color: '#666' }}>:</span>
        <span style={{ color: '#00aaff' }}>~</span>
        <span style={{ color: '#666' }}>$ </span>
        <span>{typed}</span>
        <span style={{
          display: 'inline-block', width: '10px', height: '1.1em',
          background: '#00ff41', marginLeft: '2px', verticalAlign: 'middle',
          animation: 'blink 1s step-end infinite',
        }} />
      </div>
      {lineIdx > 0 && lines.map((line, i) => (
        <div key={i} style={{
          color: line.startsWith('!!') ? '#ff0040' :
            line.startsWith('>>') ? '#ffaa00' :
              line.startsWith('OK') ? '#00ff41' : '#88cc88',
          fontSize: '1.05rem',
          paddingLeft: '1rem',
          animation: `fadeInLine 0.2s ease ${i * 0.08}s both`,
        }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   SECTION BLOCK
   ============================================================ */
function CmdBlock({ label, children, accent = '#00ff41' }: {
  label: string; children: React.ReactNode; accent?: string;
}) {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(32px)',
      transition: 'all 0.6s cubic-bezier(.16,1,.3,1)',
      margin: '0 0 0.5rem',
    }}>
      <div style={{
        borderLeft: `3px solid ${accent}`,
        borderTop: `1px solid ${accent}33`,
        borderRight: `1px solid ${accent}11`,
        borderBottom: `1px solid ${accent}11`,
        background: `linear-gradient(135deg, ${accent}08 0%, transparent 60%)`,
        padding: '2rem 2rem 2rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* corner decoration */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '60px', height: '60px',
          borderBottom: `1px solid ${accent}22`,
          borderLeft: `1px solid ${accent}22`,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '40px', height: '40px',
          borderTop: `1px solid ${accent}22`,
          borderRight: `1px solid ${accent}22`,
        }} />
        {/* scan line */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, transparent 49%, ${accent}06 50%, transparent 51%)`,
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
          animation: 'scrollLines 12s linear infinite',
        }} />
        <div style={{
          fontFamily: "'VT323', monospace",
          fontSize: '0.75rem',
          color: `${accent}99`,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: accent }} />
          {label}
          <span style={{ display: 'inline-block', width: '20px', height: '1px', background: accent }} />
        </div>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [modalFlash, setModalFlash] = useState<'none' | 'green' | 'red'>('none');
  const [glitchActive, setGlitchActive] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);

  const openModal = () => {
    playClick();
    setStep(0); setModalOpen(true); setModalFlash('none');
  };

  const closeModal = () => { playClick(); setModalOpen(false); };

  const next = (s: number) => {
    playClick();
    setGlitchActive(true);
    setTimeout(() => { setGlitchActive(false); setStep(s); }, 350);
  };

  const deny = () => {
    playDeny(); playAlarm();
    setModalFlash('red');
    setTimeout(() => { setStep(99); setModalFlash('none'); }, 600);
  };

  const approve = () => {
    playSuccess();
    setModalFlash('green');
    setTimeout(() => {
      setStep(100); setModalFlash('none');
      if (confettiRef.current) burstConfetti(confettiRef.current);
    }, 400);
  };

  const QUESTIONS = [
    {
      id: 1, label: 'QUERY_01 / 05',
      text: 'このシステムには、管理画面で記事を書く機能はありません。',
      yes: '⭕ CONFIRM', no: '❌ ABORT',
    },
    {
      id: 2, label: 'QUERY_02 / 05',
      text: '構造・機能・運用フローについて、あとから変更や相談はできません。',
      yes: '⭕ ACCEPTED', no: '❌ REJECTED',
    },
    {
      id: 3, label: 'QUERY_03 / 05',
      text: '更新が止まった場合、それは「設計の問題」であり、あなた自身を責めないと約束できますか。',
      yes: '⭕ DELEGATED', no: '❌ OVERRIDE',
    },
    {
      id: 4, label: 'QUERY_04 / 05',
      text: '10万円は「制作費」ではなく、自由を手放すための費用です。',
      yes: '⭕ UNDERSTOOD', no: '❌ DECLINE',
    },
    {
      id: 5, label: 'FINAL_AUTH',
      text: 'それでも申し込みますか。',
      yes: '⭕ EXECUTE', no: '❌ STAND DOWN',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; cursor: crosshair; }

        body {
          background: #000;
          color: #c8ffc8;
          font-family: 'Share Tech Mono', monospace;
          overflow-x: hidden;
          line-height: 1.75;
        }

        ::selection { background: #00ff41; color: #000; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        @keyframes fadeInLine {
          from { opacity:0; transform:translateX(-8px); }
          to   { opacity:1; transform:translateX(0); }
        }

        @keyframes scrollLines {
          from { background-position: 0 0; }
          to   { background-position: 0 100px; }
        }

        @keyframes glitchH {
          0%,100%  { clip-path: inset(0 0 95% 0); transform: translate(-4px,0); }
          20%      { clip-path: inset(30% 0 50% 0); transform: translate(4px,0); }
          40%      { clip-path: inset(60% 0 20% 0); transform: translate(-2px,0); }
          60%      { clip-path: inset(10% 0 80% 0); transform: translate(3px,0); }
          80%      { clip-path: inset(80% 0 5% 0);  transform: translate(-3px,0); }
        }

        @keyframes scanV {
          0%   { top: -100%; }
          100% { top: 100%; }
        }

        @keyframes borderPulse {
          0%,100% { border-color: rgba(0,255,65,.3); box-shadow: 0 0 20px rgba(0,255,65,.1); }
          50%     { border-color: rgba(0,255,65,.7); box-shadow: 0 0 40px rgba(0,255,65,.3); }
        }

        @keyframes flashRed {
          0%,100% { background: rgba(255,0,64,.0); }
          50%     { background: rgba(255,0,64,.35); }
        }

        @keyframes flashGreen {
          0%,100% { background: rgba(0,255,65,.0); }
          50%     { background: rgba(0,255,65,.25); }
        }

        @keyframes chargeBtn {
          from { width: 0%; }
          to   { width: 100%; }
        }

        @keyframes glitchSkew {
          0%,100% { transform: skew(0deg); }
          20%     { transform: skew(-1deg); }
          40%     { transform: skew(0.5deg); }
          60%     { transform: skew(-0.5deg); }
          80%     { transform: skew(1deg); }
        }

        .cta-btn {
          position: relative;
          padding: 1.1rem 3rem;
          background: transparent;
          border: 2px solid #00ff41;
          color: #00ff41;
          font-family: 'VT323', monospace;
          font-size: 1.6rem;
          letter-spacing: .15em;
          cursor: crosshair;
          overflow: hidden;
          transition: color .2s;
          animation: borderPulse 2s ease-in-out infinite;
        }

        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #00ff41;
          transform: translateX(-100%);
          transition: transform .25s ease;
          z-index: 0;
        }

        .cta-btn:hover::before { transform: translateX(0); }
        .cta-btn:hover { color: #000; }
        .cta-btn span { position: relative; z-index: 1; }

        .yes-btn, .no-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          font-family: 'VT323', monospace;
          font-size: 1.4rem;
          letter-spacing: .1em;
          border: 2px solid;
          cursor: crosshair;
          transition: all .2s;
          position: relative;
          overflow: hidden;
        }

        .yes-btn {
          background: transparent;
          border-color: #00ff41;
          color: #00ff41;
        }

        .yes-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #00ff41;
          transform: translateX(-100%);
          transition: transform .2s;
          z-index: 0;
        }

        .yes-btn:hover::before { transform: translateX(0); }
        .yes-btn:hover { color: #000; }
        .yes-btn span { position: relative; z-index: 1; }

        .no-btn {
          background: transparent;
          border-color: #ff0040;
          color: #ff0040;
        }

        .no-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #ff0040;
          transform: translateX(100%);
          transition: transform .2s;
          z-index: 0;
        }

        .no-btn:hover::before { transform: translateX(0); }
        .no-btn:hover { color: #fff; }
        .no-btn span { position: relative; z-index: 1; }

        .section-block {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 1.5rem 4rem;
        }

        h2 {
          font-family: 'VT323', monospace;
          font-size: clamp(2rem, 5vw, 3rem);
          color: #fff;
          letter-spacing: .05em;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 20px rgba(0,255,65,.4);
        }

        h2::before {
          content: '> ';
          color: #00ff41;
        }

        p { margin-bottom: 1rem; color: #99cc99; }
        strong { color: #fff; }
        li { margin-bottom: .5rem; color: #99cc99; list-style: none; padding-left: 1.5rem; position: relative; }
        li::before { content: '▹'; position: absolute; left: 0; color: #00ff41; }

        .danger  { color: #ff0040 !important; }
        .success { color: #00ff41 !important; }
        .warn    { color: #ffaa00 !important; }

        hr {
          border: none;
          border-top: 1px solid rgba(0,255,65,.15);
          margin: 2rem 0;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #00ff41; }

        /* ── MOBILE UTILITIES ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .answer-buttons { display: flex; gap: 1rem; }
        .modal-inner { padding: 3rem 2.5rem; }
        .modal-title { font-size: .8rem; }

        @media (max-width: 640px) {
          .two-col { grid-template-columns: 1fr; }
          .answer-buttons { flex-direction: column; }
          .modal-inner {
            padding: 1.5rem 1rem;
            max-height: 90vh;
            overflow-y: auto;
          }
          .modal-title { display: none; }
          .section-block {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          .cta-btn {
            width: 100%;
            text-align: center;
            padding: 1rem 1.5rem !important;
            font-size: 1.3rem !important;
          }
          .yes-btn, .no-btn {
            width: 100%;
            padding: .9rem 1rem !important;
            font-size: 1.2rem !important;
          }
          h2 { font-size: 1.8rem !important; }
        }
      `}</style>

      {/* ── MATRIX BACKGROUND ── */}
      <MatrixRain />

      {/* ── GLOBAL SCANLINE ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.15) 0px, rgba(0,0,0,.15) 1px, transparent 1px, transparent 4px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', left: 0, right: 0, height: '3px', zIndex: 2,
        background: 'linear-gradient(90deg, transparent, rgba(0,255,65,.6), rgba(0,255,65,1), rgba(0,255,65,.6), transparent)',
        boxShadow: '0 0 20px 4px rgba(0,255,65,.4)',
        animation: 'scanV 6s linear infinite',
        pointerEvents: 'none',
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 3 }}>

        {/* ── HERO ── */}
        <section style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 clamp(1.5rem, 5vw, 4rem)',
          maxWidth: '960px', margin: '0 auto',
        }}>
          {/* system status bar */}
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: '0.8rem',
            color: '#00aa28',
            letterSpacing: '.15em',
            marginBottom: '3rem',
            display: 'flex', gap: '2rem', flexWrap: 'wrap',
          }}>
            <span>SYS:ONLINE</span>
            <span>MEM:ALLOCATED</span>
            <span>FREEDOM:DISABLED</span>
            <span style={{ color: '#ffaa00', animation: 'blink 1.5s step-end infinite' }}>
              ⚡ AWAITING_INPUT
            </span>
          </div>

          {/* main headline with glitch layers */}
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            <h1 style={{
              fontFamily: "'VT323', monospace",
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              lineHeight: 1,
              letterSpacing: '-.01em',
              color: '#fff',
              textShadow: '0 0 30px rgba(0,255,65,.5)',
              position: 'relative',
            }}>
              テーマと思想を書くと、<br />
              <span style={{
                color: '#00ff41',
                display: 'block',
                textShadow: '0 0 40px rgba(0,255,65,.8), 2px 2px 0 rgba(0,255,65,.3)',
              }}>
                Webサイトが完成する。
              </span>
            </h1>
            {/* glitch overlay */}
            <h1 aria-hidden style={{
              fontFamily: "'VT323', monospace",
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              lineHeight: 1,
              letterSpacing: '-.01em',
              color: '#ff0040',
              position: 'absolute', inset: 0,
              opacity: 0.4,
              animation: 'glitchH 4s steps(1) infinite',
              pointerEvents: 'none',
            }}>
              テーマと思想を書くと、<br />
              <span style={{ color: '#ff0040', display: 'block' }}>Webサイトが完成する。</span>
            </h1>
          </div>

          <TerminalSection
            prompt="load --module=freedom_removal --target=user"
            lines={[
              '>> 設計: LOCKED',
              '>> 実装: AUTOMATED',
              '>> CMS操作: DISABLED',
              'OK Module loaded. Iterating...',
              '!! WARNING: 選択肢はありません',
            ]}
            delay={300}
          />

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="cta-btn" onClick={openModal}>
              <span>もう迷わないと決める</span>
            </button>
            <span style={{
              fontFamily: "'VT323', monospace",
              color: '#ff0040',
              fontSize: '1rem',
              letterSpacing: '.1em',
              animation: 'blink 2s step-end infinite',
            }}>
              ※ 過去にブログを止めたことがある人専用
            </span>
          </div>

          <div style={{
            marginTop: '5rem',
            fontFamily: "'VT323', monospace",
            color: '#00ff4155',
            fontSize: '.85rem',
            letterSpacing: '.2em',
            display: 'flex', alignItems: 'center', gap: '.75rem',
          }}>
            <span style={{ animation: 'blink 1.5s step-end infinite' }}>▼</span>
            SCROLL_TO_INITIALIZE
          </div>
        </section>

        {/* ── DEFINITION ── */}
        <div className="section-block">
          <CmdBlock label="SYSTEM_DEFINITION">
            <h2>これは何か</h2>
            <TerminalSection
              prompt="describe --system --verbose"
              lines={[
                '>> TYPE: NOT a web production service',
                '>> TYPE: NOT a CMS or blog tool',
                'OK IDENTIFIED: 思想だけを書かせ、実装と判断をすべて奪うWebサイト生成システム',
              ]}
              delay={100}
            />
            <div style={{
              margin: '2rem 0',
              padding: '1.5rem',
              border: '1px solid rgba(0,255,65,.2)',
              background: 'rgba(0,255,65,.04)',
              fontFamily: "'VT323', monospace",
              fontSize: '1.3rem',
              color: '#00ff41',
              lineHeight: 2,
              textAlign: 'center',
            }}>
              テーマを書く。<br />
              思想を書く。<br />
              <span style={{ color: '#ffaa00' }}>以上。</span>
            </div>
          </CmdBlock>
        </div>

        {/* ── PROBLEM ── */}
        <div className="section-block">
          <CmdBlock label="ROOT_CAUSE_ANALYSIS" accent="#ffaa00">
            <h2>なぜ、あなたは止まったのか</h2>
            <p>続かなかった理由は、才能でも根性でもありません。</p>
            <div style={{
              padding: '1.5rem',
              border: '2px solid #ffaa00',
              background: 'rgba(255,170,0,.06)',
              margin: '1.5rem 0',
              fontFamily: "'VT323', monospace",
              fontSize: '1.8rem',
              color: '#ffaa00',
              textAlign: 'center',
              textShadow: '0 0 20px rgba(255,170,0,.6)',
            }}>
              !! CRITICAL: 自由が多すぎた
            </div>
            <ul>
              <li>技術を選べた</li>
              <li>構成を考えられた</li>
              <li>改善点を思いつけた</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              そのすべてが、<strong>「今日はやめておく」</strong>を合理化しました。
            </p>
          </CmdBlock>
        </div>

        {/* ── SOLUTION ── */}
        <div className="section-block">
          <CmdBlock label="SOLUTION_PROTOCOL" accent="#ff0040">
            <h2>解決策は単純で、残酷</h2>
            <TerminalSection
              prompt="init --protocol=no_freedom --force"
              lines={[
                '>> 迷わせない: ENFORCED',
                '>> 選ばせない: ENFORCED',
                '>> 逃がさない: ENFORCED',
                '!! CMS: REMOVED',
                '!! 管理画面での記事作成: DISABLED',
                'OK 一本道のみ。他のルートは存在しません。',
              ]}
              delay={100}
            />
          </CmdBlock>
        </div>

        {/* ── PIPELINE ── */}
        <div className="section-block">
          <CmdBlock label="EXECUTION_PIPELINE" accent="#00aaff">
            <h2>究極形：思想 → 実装</h2>
            <p>このシステムには、<strong>Claude用の専用プロンプト</strong>が付属します。</p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              margin: '2rem 0',
            }}>
              {[
                { cmd: 'INPUT',   label: '思想を書く',          color: '#00aaff' },
                { cmd: 'PROC',    label: 'AIがコーディング',     color: '#00ff41' },
                { cmd: 'GEN',     label: 'リポジトリ生成',       color: '#00ff41' },
                { cmd: 'DEPLOY',  label: 'git push → 即公開',   color: '#ffaa00' },
              ].map(({ cmd, label, color }, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '.85rem 1.25rem',
                  borderLeft: `3px solid ${color}`,
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,.05)' : 'none',
                  background: `${color}08`,
                  fontFamily: "'VT323', monospace",
                }}>
                  <span style={{ color: `${color}99`, fontSize: '.8rem', minWidth: '60px', letterSpacing: '.1em' }}>{cmd}</span>
                  <span style={{ color: '#666', fontSize: '1.2rem' }}>▶</span>
                  <span style={{ color, fontSize: '1.2rem' }}>{label}</span>
                </div>
              ))}
            </div>
            <p className="warn" style={{ fontFamily: "'VT323', monospace", letterSpacing: '.05em' }}>
              !! AIは「最適化」「設計提案」「選択肢提示」を行いません。
            </p>
          </CmdBlock>
        </div>

        {/* ── DASHBOARD ── */}
        <div className="section-block">
          <CmdBlock label="DASHBOARD_SPEC" accent="#555">
            <h2>管理画面でできること</h2>
            <p>ほとんど何もできません。</p>
            <ul>
              <li>状態を見る</li>
              <li>最終更新日を見る</li>
              <li>ビルド結果を見る</li>
              <li>思想の履歴を見る</li>
            </ul>
            <hr />
            <p style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#888' }}>
              ここは操作する場所ではありません。<strong style={{ color: '#fff' }}>現実を見る場所です。</strong>
            </p>
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem 1.5rem',
              border: '1px solid rgba(255,0,64,.3)',
              background: 'rgba(255,0,64,.05)',
              fontFamily: "'VT323', monospace",
              fontSize: '1.1rem',
              color: '#ff0040',
              animation: 'blink 3s step-end infinite',
            }}>
              !! ここで操作できるようになった瞬間、このシステムは失敗です。
            </div>
          </CmdBlock>
        </div>

        {/* ── PRICE ── */}
        <div className="section-block">
          <CmdBlock label="TRANSACTION_INIT" accent="#ffaa00">
            <h2>価格</h2>
            <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
              <div style={{
                fontFamily: "'VT323', monospace",
                fontSize: 'clamp(4rem, 12vw, 8rem)',
                lineHeight: 1,
                color: '#fff',
                textShadow: '0 0 40px rgba(0,255,65,.6), 0 0 80px rgba(0,255,65,.3)',
                letterSpacing: '-.02em',
                animation: 'glitchSkew 8s steps(1) infinite',
              }}>
                ¥100,000
              </div>
              <div style={{
                fontFamily: "'VT323', monospace",
                color: '#00aa28',
                letterSpacing: '.2em',
                marginTop: '.5rem',
                fontSize: '1rem',
              }}>
                FREEDOM_REMOVAL_FEE
              </div>
            </div>
            <div className="two-col">
              <div style={{ padding: '1rem', border: '1px solid rgba(0,255,65,.2)', background: 'rgba(0,255,65,.04)' }}>
                <div className="success" style={{ fontFamily: "'VT323', monospace", letterSpacing: '.1em', marginBottom: '.5rem' }}>INCLUDED</div>
                <ul style={{ paddingLeft: 0 }}>
                  <li>デザインカスタマイズ（見た目のみ）</li>
                  <li>思想 → 実装パイプライン</li>
                  <li>自分で作らなくていい確定</li>
                </ul>
              </div>
              <div style={{ padding: '1rem', border: '1px solid rgba(255,0,64,.2)', background: 'rgba(255,0,64,.04)' }}>
                <div className="danger" style={{ fontFamily: "'VT323', monospace", letterSpacing: '.1em', marginBottom: '.5rem' }}>NOT INCLUDED</div>
                <ul style={{ paddingLeft: 0 }}>
                  <li>構造変更</li>
                  <li>機能追加</li>
                  <li>相談・改善提案</li>
                  <li className="danger">自由</li>
                </ul>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button className="cta-btn" onClick={openModal}>
                <span>もう迷わないと決める</span>
              </button>
            </div>
          </CmdBlock>
        </div>

        {/* ── SELECTION ── */}
        <div className="section-block">
          <CmdBlock label="ACCESS_CONTROL" accent="#ff0040">
            <h2>これは誰のためのものか</h2>
            <div className="two-col">
              <div style={{ padding: '1.25rem', border: '1px solid rgba(255,0,64,.25)', background: 'rgba(255,0,64,.04)' }}>
                <div className="danger" style={{ fontFamily: "'VT323', monospace", marginBottom: '.75rem', letterSpacing: '.1em' }}>
                  !! ACCESS_DENIED
                </div>
                <ul style={{ paddingLeft: 0 }}>
                  {['自由にカスタマイズしたい', '技術で遊びたい', '最適解を探したい'].map(t => (
                    <li key={t} style={{ color: '#ff004099' }}>{t}</li>
                  ))}
                </ul>
              </div>
              <div style={{ padding: '1.25rem', border: '1px solid rgba(0,255,65,.25)', background: 'rgba(0,255,65,.04)' }}>
                <div className="success" style={{ fontFamily: "'VT323', monospace", marginBottom: '.75rem', letterSpacing: '.1em' }}>
                  OK ACCESS_GRANTED
                </div>
                <ul style={{ paddingLeft: 0 }}>
                  {['書くと決めている', 'もう迷いたくない', '自分の意志を信用していない'].map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CmdBlock>
        </div>

        {/* ── FINAL ── */}
        <div className="section-block" style={{ paddingBottom: '8rem' }}>
          <CmdBlock label="FINAL_TRANSMISSION">
            <h2>最後に</h2>
            <p>これは優しいサービスではありません。背中も押しません。励ましもしません。</p>
            <div style={{
              margin: '2.5rem 0',
              padding: '2rem',
              border: '2px solid rgba(0,255,65,.4)',
              background: 'rgba(0,255,65,.06)',
              fontFamily: "'VT323', monospace",
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              color: '#00ff41',
              lineHeight: 1.8,
              textAlign: 'center',
              textShadow: '0 0 20px rgba(0,255,65,.4)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent, rgba(0,255,65,.08), transparent)',
                animation: 'scanV 3s linear infinite',
                pointerEvents: 'none',
              }} />
              買わない自由を残すと、人は一生準備する。<br />
              <span style={{ color: '#fff' }}>買うことを束縛すると、人はようやく書き始める。</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="cta-btn" onClick={openModal}>
                <span>次は止まらない側に行く</span>
              </button>
            </div>
          </CmdBlock>
        </div>
      </div>

      {/* ── MODAL ── */}
      {modalOpen && (
        <div
          onClick={e => e.target === e.currentTarget && closeModal()}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,.96)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '1.5rem 1rem',
            overflowY: 'auto',
            backdropFilter: 'blur(4px)',
            animation: modalFlash === 'red' ? 'flashRed .6s ease' :
              modalFlash === 'green' ? 'flashGreen .6s ease' : 'none',
          }}
        >
          {/* confetti canvas */}
          <canvas ref={confettiRef} width={800} height={600} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 10,
          }} />

          <div className="modal-inner" style={{
            background: '#000',
            border: `2px solid ${modalFlash === 'red' ? '#ff0040' : modalFlash === 'green' ? '#00ff41' : 'rgba(0,255,65,.4)'}`,
            boxShadow: `0 0 60px ${modalFlash === 'red' ? 'rgba(255,0,64,.4)' : 'rgba(0,255,65,.25)'}`,
            borderRadius: '4px',
            maxWidth: '680px', width: '100%',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color .3s, box-shadow .3s',
          }}>
            {/* scan line in modal */}
            <div style={{
              position: 'absolute', left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(0,255,65,.5), transparent)',
              animation: 'scanV 2.5s linear infinite',
              pointerEvents: 'none', zIndex: 0,
            }} />

            {/* header bar */}
            <div className="modal-title" style={{
              fontFamily: "'VT323', monospace",
              color: '#00aa28',
              letterSpacing: '.2em',
              marginBottom: '2rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>SECURITY_CLEARANCE_TERMINAL v2.1</span>
            </div>

            {/* ESC button - always visible */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button
                onClick={closeModal}
                style={{
                  background: 'none', border: '1px solid rgba(255,0,64,.4)',
                  color: '#ff0040', cursor: 'crosshair',
                  fontFamily: "'VT323', monospace", fontSize: '1rem',
                  padding: '.2rem .6rem', letterSpacing: '.1em',
                }}
              >
                [ESC]
              </button>
            </div>

              {/* STEP 0: intro */}
              {step === 0 && (
                <div>
                  <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                    color: '#fff',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem',
                  }}>
                    ここから先は<br />
                    <span style={{ color: '#ffaa00' }}>「申し込む人を増やすためのフォーム」</span><br />
                    ではありません。
                  </div>
                  <p style={{ marginBottom: '2rem' }}>合わない人は、ここで閉じることを推奨します。</p>
                  <div className="answer-buttons">
                    <button className="yes-btn" onClick={() => next(1)}>
                      <span>⭕ 進む</span>
                    </button>
                    <button className="no-btn" onClick={closeModal}>
                      <span>❌ 閉じる</span>
                    </button>
                  </div>
                </div>
              )}

              {/* QUESTIONS 1-5 */}
              {QUESTIONS.map(q => step === q.id && (
                <div key={q.id}>
                  <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '.75rem',
                    color: '#00aa28',
                    letterSpacing: '.2em',
                    marginBottom: '1.5rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                  }}>
                    {/* progress bar */}
                    <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${(q.id / 5) * 100}%`,
                        background: 'linear-gradient(90deg, #00ff41, #00aaff)',
                        boxShadow: '0 0 8px rgba(0,255,65,.6)',
                        transition: 'width .5s ease',
                      }} />
                    </div>
                    <span>{q.label}</span>
                  </div>
                  <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                    color: '#fff',
                    lineHeight: 1.5,
                    marginBottom: '2rem',
                    animation: glitchActive ? 'glitchSkew .35s steps(4)' : 'none',
                  }}>
                    <TerminalGlitch active={glitchActive}>{q.text}</TerminalGlitch>
                  </div>
                  <div className="answer-buttons">
                    <button className="yes-btn" onClick={() => q.id < 5 ? next(q.id + 1) : approve()}>
                      <span>{q.yes}</span>
                    </button>
                    <button className="no-btn" onClick={deny}>
                      <span>{q.no}</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* APPROVED */}
              {step === 100 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    color: '#00ff41',
                    textShadow: '0 0 40px rgba(0,255,65,.8)',
                    marginBottom: '1rem',
                    animation: 'blink .5s step-end 4',
                  }}>
                    ✓ ACCESS GRANTED
                  </div>
                  <p style={{ marginBottom: '2rem', color: '#00ff41' }}>
                    すべての認証が完了しました。<br />申込手続きにお進みください。
                  </p>
                  <a
                    href="mailto:product@newaddr.com?subject=Webサイト生成システム申込"
                    style={{
                      display: 'inline-block',
                      padding: '1.1rem 3rem',
                      border: '2px solid #00ff41',
                      background: '#00ff41',
                      color: '#000',
                      fontFamily: "'VT323', monospace",
                      fontSize: '1.5rem',
                      letterSpacing: '.1em',
                      textDecoration: 'none',
                      transition: 'all .2s',
                    }}
                  >
                    申込手続きに進む ▶
                  </a>
                </div>
              )}

              {/* DENIED */}
              {step === 99 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                    color: '#ff0040',
                    textShadow: '0 0 40px rgba(255,0,64,.8)',
                    marginBottom: '1rem',
                  }}>
                    ✗ SYSTEM LOCKOUT
                  </div>
                  <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '1rem',
                    color: '#ff004099',
                    letterSpacing: '.15em',
                    marginBottom: '1.5rem',
                  }}>
                    THIS PRODUCT IS NOT FOR YOU
                  </div>
                  <p style={{ color: '#666', marginBottom: '2rem' }}>
                    ご理解いただきありがとうございました。
                  </p>
                  <button className="no-btn" onClick={closeModal} style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }}>
                    <span>[閉じる]</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}