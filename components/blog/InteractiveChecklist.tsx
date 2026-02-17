'use client';

import { useState, useRef, useCallback } from 'react';
import React from 'react';

/* ─────────────────────────────────────────
   Canvas Confetti Burst
───────────────────────────────────────── */
function burstConfetti(canvas: HTMLCanvasElement, x: number, y: number, color: string) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const particles: Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; color: string; life: number; maxLife: number; rotation: number; rv: number;
  }> = [];

  const colors = [color, '#f59e0b', '#ec4899', '#34d399', '#60a5fa', '#a78bfa'];

  for (let i = 0; i < 28; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 2.5 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      maxLife: 0.6 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.3,
    });
  }

  let rafId: number;
  const gravity = 0.18;

  const draw = () => {
    let alive = false;
    for (const p of particles) {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.life -= 0.022;
      p.rotation += p.rv;

      if (p.life > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
    }
    if (alive) rafId = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  rafId = requestAnimationFrame(draw);
  setTimeout(() => {
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 2200);
}

/* ─────────────────────────────────────────
   Full-screen Explosion (全完了時)
───────────────────────────────────────── */
function explodeFull(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  const colors = ['#6366f1','#a78bfa','#34d399','#f59e0b','#ec4899','#60a5fa','#fff'];
  const particles: Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; color: string; life: number; rotation: number; rv: number;
  }> = [];

  for (let i = 0; i < 120; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 3 + Math.random() * 10;
    particles.push({
      x: W / 2 + (Math.random() - 0.5) * W * 0.5,
      y: H / 2 + (Math.random() - 0.5) * H * 0.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      rotation: Math.random() * Math.PI * 2,
      rv: (Math.random() - 0.5) * 0.25,
    });
  }

  let rafId: number;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of particles) {
      p.vy += 0.15;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.life -= 0.015;
      p.rotation += p.rv;

      if (p.life > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
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
  setTimeout(() => {
    cancelAnimationFrame(rafId);
    ctx.clearRect(0, 0, W, H);
  }, 3500);
}

/* ─────────────────────────────────────────
   Web Audio Micro-Sound
───────────────────────────────────────── */
function playCheckSound(checked: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    const now = ctx.currentTime;

    if (checked) {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch (_) { /* AudioContext not available */ }
}

function playCompleteSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.1;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch (_) { /* AudioContext not available */ }
}

/* ─────────────────────────────────────────
   InteractiveChecklist
───────────────────────────────────────── */
interface InteractiveChecklistProps {
  children: React.ReactNode;
}

export function InteractiveChecklist({ children }: InteractiveChecklistProps) {
  const items = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (child as React.ReactElement).type === 'li'
  );
  const total = items.length;
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const [fallingSet, setFallingSet] = useState<Set<number>>(new Set());
  const [justCompleted, setJustCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const toggle = useCallback((i: number, e: React.MouseEvent) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      const willCheck = !next.has(i);

      if (willCheck) {
        next.add(i);

        // 落下アニメーション
        setFallingSet((f) => { const nf = new Set(f); nf.add(i); return nf; });
        setTimeout(() => {
          setFallingSet((f) => { const nf = new Set(f); nf.delete(i); return nf; });
        }, 500);

        // confetti
        const canvas = canvasRef.current;
        const el = itemRefs.current[i];
        if (canvas && el) {
          const rect = el.getBoundingClientRect();
          const cRect = canvas.getBoundingClientRect();
          burstConfetti(canvas,
            rect.left + rect.width * 0.15 - cRect.left,
            rect.top + rect.height / 2 - cRect.top,
            '#a78bfa'
          );
        }

        // sound
        playCheckSound(true);

        // 全完了チェック
        if (next.size === total) {
          setJustCompleted(true);
          setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) explodeFull(canvas);
            playCompleteSound();
          }, 150);
        }
      } else {
        next.delete(i);
        if (justCompleted) setJustCompleted(false);
        playCheckSound(false);
      }

      return next;
    });
  }, [total, justCompleted]);

  const count = checkedSet.size;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const allDone = count === total && total > 0;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', margin: '2.5rem 0' }}
    >
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 20,
          borderRadius: '16px',
        }}
        width={800}
        height={600}
      />

      {/* Card */}
      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: allDone
            ? '1px solid rgba(167,139,250,0.4)'
            : '1px solid rgba(255,255,255,0.08)',
          background: allDone
            ? 'rgba(99,102,241,0.07)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          transition: 'border 0.5s ease, background 0.5s ease',
        }}
      >
        {/* Header: progress */}
        <div
          style={{
            padding: '1.25rem 1.5rem 1rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          {/* XP bar style */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div
              style={{
                height: '6px',
                borderRadius: '3px',
                background: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: '3px',
                  background: allDone
                    ? 'linear-gradient(90deg, #34d399, #6ee7b7)'
                    : 'linear-gradient(90deg, #6366f1, #a78bfa, #c084fc)',
                  boxShadow: allDone
                    ? '0 0 10px rgba(52,211,153,0.6)'
                    : '0 0 10px rgba(139,92,246,0.5)',
                  transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1), background 0.5s ease, box-shadow 0.5s ease',
                }}
              />
            </div>
            {/* level notches */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {Array.from({ length: total }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: '2px',
                    height: '4px',
                    borderRadius: '1px',
                    background: checkedSet.has(i) ? 'rgba(167,139,250,0.8)' : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>

          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: allDone ? '#a78bfa' : 'rgba(255,255,255,0.4)',
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              transition: 'color 0.4s ease',
              letterSpacing: '0.05em',
            }}
          >
            {pct}%
          </span>
        </div>

        {/* Items */}
        <ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem 0' }}>
          {items.map((item, i) => {
            const isChecked = checkedSet.has(i);
            const isFalling = fallingSet.has(i);
            const text = React.isValidElement(item)
              ? (item as React.ReactElement<{ children?: React.ReactNode }>).props.children
              : null;

            return (
              <li
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                onClick={(e) => toggle(i, e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: isChecked ? 'rgba(99,102,241,0.08)' : 'transparent',
                  transform: isFalling
                    ? 'translateX(6px) scale(0.98)'
                    : 'translateX(0) scale(1)',
                  transition: [
                    'background 0.3s ease',
                    'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  ].join(', '),
                }}
              >
                {/* Hover shimmer */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.06), transparent)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* Checkbox */}
                <span
                  style={{
                    flexShrink: 0,
                    width: '24px',
                    height: '24px',
                    borderRadius: '7px',
                    border: isChecked
                      ? '2px solid #7c3aed'
                      : '2px solid rgba(255,255,255,0.18)',
                    background: isChecked
                      ? 'linear-gradient(135deg, #6366f1, #7c3aed, #a78bfa)'
                      : 'transparent',
                    boxShadow: isChecked ? '0 0 12px rgba(139,92,246,0.5)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                    transform: isChecked ? 'scale(1.1) rotate(-2deg)' : 'scale(1)',
                  }}
                >
                  {isChecked && (
                    <svg
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      style={{ animation: 'gck-pop 0.3s cubic-bezier(0.16,1,0.3,1) forwards' }}
                    >
                      <polyline
                        points="2.5,7.5 5.5,10.5 11.5,3.5"
                        stroke="white"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>

                {/* index badge */}
                <span
                  style={{
                    flexShrink: 0,
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: isChecked
                      ? 'rgba(99,102,241,0.3)'
                      : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: isChecked ? '#a78bfa' : 'rgba(255,255,255,0.25)',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0',
                  }}
                >
                  {i + 1}
                </span>

                {/* Text */}
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: isChecked ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.85)',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    textDecorationColor: 'rgba(167,139,250,0.35)',
                    transition: 'all 0.4s ease',
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Complete banner */}
        {allDone && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid rgba(167,139,250,0.2)',
              background: 'linear-gradient(90deg, rgba(99,102,241,0.15), rgba(167,139,250,0.1), rgba(99,102,241,0.15))',
              backgroundSize: '200% 100%',
              fontWeight: 700,
              color: '#c4b5fd',
              textAlign: 'center',
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              animation: 'gck-complete 0.5s cubic-bezier(0.16,1,0.3,1) forwards, gck-shimmer 2s linear 0.5s infinite',
            }}
          >
            ✦ STAGE CLEAR ✦
          </div>
        )}
      </div>

      <style>{`
        @keyframes gck-pop {
          from { opacity: 0; transform: scale(0.4) rotate(-15deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes gck-complete {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gck-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

/* ChecklistItem は仕様書に存在するため保持 */
interface ChecklistItemProps {
  children: React.ReactNode;
}

export function ChecklistItem({ children }: ChecklistItemProps) {
  const [checked, setChecked] = useState(false);
  return (
    <li className={checked ? 'checked' : ''}>
      <label className="checklist-item">
        <input
          type="checkbox"
          className="checklist-checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span style={{ opacity: checked ? 0.5 : 1, textDecoration: checked ? 'line-through' : 'none' }}>
          {children}
        </span>
      </label>
    </li>
  );
}
