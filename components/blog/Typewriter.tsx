'use client';

import { useEffect, useRef, useState } from 'react';

interface TypewriterProps {
  children: React.ReactNode;
  speed?: number;       // 基本タイプ速度 ms/文字。デフォルト: 55
  mistakeRate?: number; // タイプミス発生率 0-1。デフォルト: 0.06
  startDelay?: number;  // 開始遅延 ms。デフォルト: 300
}

function playTypeSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (_) {}
}

/* ランダムに隣接キーを返す（タイプミス演出） */
const NEIGHBORS: Record<string, string> = {
  a: 'sqwze', s: 'adwxze', d: 'sfexc', f: 'dgrvb', g: 'fhtbn',
  h: 'gjynm', j: 'hkum', k: 'jlio', l: 'kop', e: 'wrsd',
  r: 'etdf', t: 'rygh', y: 'tuhj', u: 'yijk', i: 'uojk',
  o: 'iplk', p: 'ol', w: 'qes', q: 'wa',
};

function mistakeChar(ch: string): string {
  const lower = ch.toLowerCase();
  const neighbors = NEIGHBORS[lower];
  if (!neighbors) return ch;
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

export function Typewriter({
  children,
  speed = 55,
  mistakeRate = 0.06,
  startDelay = 300,
}: TypewriterProps) {
  const text = typeof children === 'string' ? children : String(children);
  const [displayed, setDisplayed] = useState('');
  const [cursorOn, setCursorOn] = useState(true);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* カーソル点滅 */
    const blink = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let i = 0;
        let current = '';
        /* タイプミス状態管理 */
        let mistakeBuffer = '';   // ミスタイプ中の余分文字
        let recovering = false;

        const typeNext = () => {
          if (recovering) {
            /* バックスペース（1文字削除） */
            current = current.slice(0, -1);
            mistakeBuffer = mistakeBuffer.slice(0, -1);
            setDisplayed(current);
            playTypeSound();

            if (mistakeBuffer.length === 0) {
              recovering = false;
              timeoutRef.current = setTimeout(typeNext, speed * (0.8 + Math.random() * 0.6));
            } else {
              timeoutRef.current = setTimeout(typeNext, speed * 1.4);
            }
            return;
          }

          if (i >= text.length) {
            setDone(true);
            return;
          }

          const ch = text[i];
          const doMistake = ch !== ' ' && Math.random() < mistakeRate;

          if (doMistake) {
            const wrong = mistakeChar(ch);
            current += wrong;
            mistakeBuffer += wrong;
            setDisplayed(current);
            playTypeSound();
            /* 少し後にバックスペース開始 */
            timeoutRef.current = setTimeout(() => {
              recovering = true;
              typeNext();
            }, speed * (1.5 + Math.random()));
          } else {
            current += ch;
            setDisplayed(current);
            playTypeSound();
            i++;
            /* 速度ゆらぎ: 句読点後は長め */
            const pause =
              ch === '。' || ch === '.' || ch === '！' || ch === '!'
                ? speed * (4 + Math.random() * 3)
                : ch === '、' || ch === ','
                ? speed * (2 + Math.random())
                : ch === ' '
                ? speed * (1.2 + Math.random() * 0.6)
                : speed * (0.6 + Math.random() * 0.9);

            timeoutRef.current = setTimeout(typeNext, pause);
          }
        };

        timeoutRef.current = setTimeout(typeNext, startDelay);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, mistakeRate, startDelay]);

  return (
    <span ref={ref} style={{ display: 'inline' }}>
      <span
        style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 600,
          letterSpacing: '0.01em',
        }}
      >
        {displayed}
      </span>
      {!done && (
        <span
          style={{
            display: 'inline-block',
            width: '2px',
            height: '1em',
            background: '#a78bfa',
            marginLeft: '2px',
            verticalAlign: 'text-bottom',
            opacity: cursorOn ? 1 : 0,
            transition: 'opacity 0.1s',
            boxShadow: '0 0 6px rgba(167,139,250,0.8)',
          }}
        />
      )}
    </span>
  );
}
