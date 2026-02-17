'use client';

import { useEffect, useRef, useState } from 'react';

interface GlitchTextProps {
  children: React.ReactNode;
  intensity?: number;
}

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function randomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export function GlitchText({ children, intensity = 1 }: GlitchTextProps) {
  const sourceText = typeof children === 'string' ? children : String(children);
  const [displayed, setDisplayed] = useState(sourceText);
  const [isGlitching, setIsGlitching] = useState(false);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef(0);

  const triggerGlitch = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    frameRef.current = 0;

    const totalFrames = Math.round(28 * intensity);

    const tick = () => {
      frameRef.current++;
      const progress = frameRef.current / totalFrames;

      if (progress < 0.6) {
        // 乱れフェーズ: ランダム文字に置換
        const glitched = sourceText
          .split('')
          .map((ch) =>
            ch !== ' ' && Math.random() < 0.4 * intensity ? randomChar() : ch
          )
          .join('');
        setDisplayed(glitched);
      } else {
        // 修復フェーズ: 左から順に正しい文字に戻る
        const restoreIdx = Math.floor(
          ((progress - 0.6) / 0.4) * sourceText.length
        );
        const restored = sourceText
          .split('')
          .map((ch, i) =>
            i <= restoreIdx
              ? ch
              : ch !== ' ' && Math.random() < 0.2
              ? randomChar()
              : ch
          )
          .join('');
        setDisplayed(restored);
      }

      if (frameRef.current < totalFrames) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(sourceText);
        setIsGlitching(false);

        // RGB分離Canvas演出
        flashRGB();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const flashRGB = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const W = rect.width + 40;
    const H = rect.height + 20;
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let f = 0;
    const frames = 18;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const t = f / frames;
      const offset = (1 - t) * 8 * intensity;

      ctx.font = `bold 1em monospace`;
      ctx.globalAlpha = (1 - t) * 0.55;

      // R channel
      ctx.fillStyle = 'rgba(255,0,60,0.8)';
      ctx.fillText(sourceText, 20 - offset, H * 0.72);

      // G channel
      ctx.fillStyle = 'rgba(0,255,120,0.8)';
      ctx.fillText(sourceText, 20, H * 0.72 + offset * 0.5);

      // B channel
      ctx.fillStyle = 'rgba(0,120,255,0.8)';
      ctx.fillText(sourceText, 20 + offset * 0.7, H * 0.72);

      f++;
      if (f < frames) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, W, H);
    };

    requestAnimationFrame(draw);
  };

  // 定期的に自動グリッチ
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (Math.random() < 0.35) triggerGlitch();
      },
      3000 + Math.random() * 4000
    );
    return () => {
      clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onClick={triggerGlitch}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '-10px',
          left: '-20px',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <span
        ref={containerRef}
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          color: isGlitching ? '#a78bfa' : 'inherit',
          textShadow: isGlitching
            ? `0 0 8px rgba(139,92,246,0.8), 2px 0 rgba(255,0,60,0.5), -2px 0 rgba(0,255,120,0.5)`
            : 'none',
          transition: 'color 0.1s, text-shadow 0.1s',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {displayed}
      </span>
    </span>
  );
}
