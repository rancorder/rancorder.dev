'use client';

import { useState, useRef, useCallback } from 'react';
import React from 'react';

/* ── Web Audio ── */
function playCorrect() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  } catch (_) {}
}

function playWrong() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [300, 240].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.15;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch (_) {}
}

/* ── Canvas Confetti ── */
function burst(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const colors = ['#6366f1', '#a78bfa', '#34d399', '#f59e0b', '#ec4899', '#60a5fa'];
  const particles = Array.from({ length: 80 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    return {
      x: W / 2, y: H / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      rotation: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.25,
    };
  });
  let rafId: number;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of particles) {
      p.vy += 0.2;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.life -= 0.018;
      p.rotation += p.rv;
      if (p.life > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
    }
    if (alive) rafId = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, W, H);
  };
  rafId = requestAnimationFrame(draw);
  setTimeout(() => { cancelAnimationFrame(rafId); ctx.clearRect(0, 0, W, H); }, 3000);
}

/* ── QuizBlock ── */
interface QuizBlockProps {
  question: string;
  answer: string;       // 正解テキスト（完全一致）
  hint?: string;
  children: React.ReactNode;  // <li> = 選択肢
}

type Phase = 'idle' | 'correct' | 'wrong';

export function QuizBlock({ question, answer, hint, children }: QuizBlockProps) {
  const options = React.Children.toArray(children)
    .filter((c) => React.isValidElement(c) && (c as React.ReactElement).type === 'li')
    .map((c) => {
      const el = c as React.ReactElement<{ children?: React.ReactNode }>;
      return typeof el.props.children === 'string'
        ? el.props.children
        : String(el.props.children ?? '');
    });

  const [phase, setPhase] = useState<Phase>('idle');
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const choose = useCallback((opt: string) => {
    if (phase !== 'idle') return;
    setSelected(opt);

    if (opt === answer) {
      setPhase('correct');
      playCorrect();
      setTimeout(() => {
        if (canvasRef.current) burst(canvasRef.current);
      }, 100);
    } else {
      setPhase('wrong');
      playWrong();
    }
  }, [phase, answer]);

  const retry = () => {
    setPhase('idle');
    setSelected(null);
    setShowHint(false);
  };

  const bgColor = phase === 'correct'
    ? 'rgba(16,185,129,0.07)'
    : phase === 'wrong'
    ? 'rgba(239,68,68,0.07)'
    : 'rgba(255,255,255,0.03)';

  const borderColor = phase === 'correct'
    ? 'rgba(52,211,153,0.3)'
    : phase === 'wrong'
    ? 'rgba(239,68,68,0.25)'
    : 'rgba(255,255,255,0.08)';

  return (
    <div style={{ position: 'relative', margin: '2.5rem 0' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: '16px',
        }}
      />
      <div
        style={{
          borderRadius: '16px',
          border: `1px solid ${borderColor}`,
          background: bgColor,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          transition: 'border 0.4s ease, background 0.4s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'rgba(167,139,250,0.7)',
            textTransform: 'uppercase',
          }}>Quiz</span>
          <span style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
          }}>{question}</span>
        </div>

        {/* Options */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === answer;
            const revealed = phase !== 'idle';

            let bg = 'rgba(255,255,255,0.04)';
            let border = 'rgba(255,255,255,0.1)';
            let color = 'rgba(255,255,255,0.8)';

            if (revealed && isCorrect) {
              bg = 'rgba(16,185,129,0.18)';
              border = 'rgba(52,211,153,0.5)';
              color = '#34d399';
            } else if (revealed && isSelected && !isCorrect) {
              bg = 'rgba(239,68,68,0.15)';
              border = 'rgba(239,68,68,0.4)';
              color = '#f87171';
            }

            return (
              <button
                key={i}
                onClick={() => choose(opt)}
                disabled={revealed}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '10px',
                  border: `1px solid ${border}`,
                  background: bg,
                  color,
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  cursor: revealed ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s ease',
                  transform: revealed && isCorrect ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span style={{
                  flexShrink: 0,
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: `1px solid ${border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {revealed && isCorrect && (
                  <span style={{ marginLeft: 'auto', fontSize: '1rem' }}>✓</span>
                )}
                {revealed && isSelected && !isCorrect && (
                  <span style={{ marginLeft: 'auto', fontSize: '1rem' }}>✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem 1.5rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          {phase === 'idle' && hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                fontSize: '0.78rem',
                color: 'rgba(167,139,250,0.6)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {showHint ? '▲ ヒントを隠す' : '▼ ヒントを見る'}
            </button>
          )}

          {phase === 'correct' && (
            <span style={{ fontSize: '0.88rem', color: '#34d399', fontWeight: 600 }}>
              ✦ CORRECT
            </span>
          )}

          {phase === 'wrong' && (
            <>
              <span style={{ fontSize: '0.88rem', color: '#f87171', fontWeight: 600 }}>
                ✗ WRONG
              </span>
              <button
                onClick={retry}
                style={{
                  marginLeft: 'auto',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.85rem',
                  cursor: 'pointer',
                }}
              >
                もう一度
              </button>
            </>
          )}
        </div>

        {showHint && hint && phase === 'idle' && (
          <div style={{
            margin: '0 1.25rem 1.25rem',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '0.88rem',
            color: 'rgba(167,139,250,0.8)',
          }}>
            💡 {hint}
          </div>
        )}
      </div>
    </div>
  );
}
