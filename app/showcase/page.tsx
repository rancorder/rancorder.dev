'use client';

import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   UTILITIES
   ============================================================ */
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#_';
function randomChar() { return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]; }

const NEIGHBORS = { 
  a:'sqwze',
  s:'adwxze',
  d:'sfexc',
  f:'dgrvb',
  g:'fhtbn',
  h:'gjynm',
  j:'hkum',
  k:'jlio',
  l:'kop',
  e:'wrsd',
  r:'etdf',
  t:'rygh',
  y:'tuhj',
  u:'yijk',
  i:'uojk',
  o:'iplk',
  p:'ol',
  w:'qes',
  q:'wa'
} as const;

type NeighborKey = keyof typeof NEIGHBORS;

function mistakeChar(ch: string): string {
  const lower = ch.toLowerCase();
  if (!(lower in NEIGHBORS)) return ch;
  
  const n = NEIGHBORS[lower as NeighborKey];
  return n[Math.floor(Math.random() * n.length)];
}

function playTone(freq: number, type: OscillatorType = 'sine', dur: number = 0.25, vol: number = 0.15): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator(); 
    const gain = ctx.createGain();
    osc.connect(gain); 
    gain.connect(ctx.destination);
    osc.type = type; 
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime); 
    osc.stop(ctx.currentTime + dur);
  } catch(_) {}
}

/* ============================================================
   GODZILLA FIRE BREATH EFFECT
   ============================================================ */
function GodzillaEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let animationId: number;
    let breathActive = false;
    let breathProgress = 0;
    const particles: Particle[] = [];
    
    // Godzilla position (bottom left)
    const godzilla = {
      x: 200,
      y: window.innerHeight - 50,
      headX: 280,
      headY: window.innerHeight - 280,
    };
    
   　// Particle class
   　class Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        life: number;
        size: number;
        color: string;
      
        constructor(x: number, y: number) {
          const angle = -0.2 + (Math.random() - 0.5) * 0.3;
          const speed = 15 + Math.random() * 10;
      
          this.x = x;
          this.y = y;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
      
          this.life = 1;
          this.size = 8 + Math.random() * 15;
          this.color = Math.random() > 0.5 ? '#ff6b00' : '#ffdd00';
        }
      
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= 0.98;
          this.vy *= 0.98;
          this.life -= 0.02;
        }
      
        draw(ctx: CanvasRenderingContext2D) {
           ctx.save();
           ctx.globalAlpha = this.life;
           ctx.shadowBlur = 30;
           ctx.fillStyle = this.color;
           ctx.beginPath();
           ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
           ctx.fill();
           ctx.restore();
         }
      }

    
    function drawGodzilla() {
      const scale = 1.5; // より大きく
      const x = godzilla.x;
      const y = godzilla.y;
      
      ctx.save();
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#00ff88';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)';
      ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
      
      // 簡単なシルエット描画
      ctx.beginPath();
      
      // 尾の先端から開始
      ctx.moveTo(x - 150 * scale, y - 20);
      
      // 尾
      ctx.lineTo(x - 120 * scale, y - 60);
      ctx.lineTo(x - 80 * scale, y - 100);
      ctx.lineTo(x - 40 * scale, y - 120);
      
      // 背中（背びれの下）
      ctx.lineTo(x, y - 130);
      ctx.lineTo(x + 30 * scale, y - 150);
      ctx.lineTo(x + 50 * scale, y - 170);
      ctx.lineTo(x + 60 * scale, y - 180);
      
      // 首
      ctx.lineTo(x + 70 * scale, y - 200);
      ctx.lineTo(x + 80 * scale, y - 220);
      
      // 頭
      ctx.lineTo(x + 100 * scale, y - 230);
      ctx.lineTo(x + 130 * scale, y - 230);
      ctx.lineTo(x + 140 * scale, y - 220);
      
      // 口
      ctx.lineTo(x + 145 * scale, y - 210);
      ctx.lineTo(x + 135 * scale, y - 200);
      ctx.lineTo(x + 120 * scale, y - 205);
      ctx.lineTo(x + 100 * scale, y - 210);
      
      // 首から胸
      ctx.lineTo(x + 90 * scale, y - 190);
      ctx.lineTo(x + 85 * scale, y - 160);
      
      // お腹
      ctx.lineTo(x + 75 * scale, y - 120);
      ctx.lineTo(x + 65 * scale, y - 80);
      
      // 前足
      ctx.lineTo(x + 70 * scale, y - 50);
      ctx.lineTo(x + 60 * scale, y);
      ctx.lineTo(x + 40 * scale, y);
      ctx.lineTo(x + 45 * scale, y - 70);
      
      // お腹下部
      ctx.lineTo(x + 30 * scale, y - 90);
      ctx.lineTo(x + 10 * scale, y - 80);
      
      // 後ろ足
      ctx.lineTo(x, y - 50);
      ctx.lineTo(x - 10 * scale, y);
      ctx.lineTo(x - 30 * scale, y);
      ctx.lineTo(x - 20 * scale, y - 30);
      ctx.lineTo(x - 40 * scale, y - 40);
      
      // 尾の付け根
      ctx.lineTo(x - 60 * scale, y - 30);
      ctx.lineTo(x - 90 * scale, y - 10);
      ctx.lineTo(x - 120 * scale, y);
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // 背びれ（もっと目立つように）
      const spikes = [
        { x: -20, y: -120, w: 25, h: 45 },
        { x: 10, y: -140, w: 30, h: 55 },
        { x: 35, y: -160, w: 35, h: 60 },
        { x: 55, y: -175, w: 30, h: 50 },
        { x: 70, y: -190, w: 25, h: 40 },
      ];
      
      spikes.forEach(spike => {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
        ctx.shadowBlur = 35;
        ctx.shadowColor = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(x + spike.x * scale, y + spike.y);
        ctx.lineTo(x + (spike.x - spike.w * 0.4) * scale, y + spike.y - spike.h);
        ctx.lineTo(x + (spike.x + spike.w * 0.4) * scale, y + spike.y - spike.h * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      
      // 目（大きく）
      ctx.fillStyle = breathActive ? '#ff0000' : '#ffff00';
      ctx.shadowColor = breathActive ? '#ff0000' : '#ffff00';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(x + 110 * scale, y - 220, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // 口が光る
      if (breathActive) {
        ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
        ctx.shadowBlur = 50;
        ctx.shadowColor = '#ff6b00';
        ctx.beginPath();
        ctx.arc(x + 135 * scale, y - 210, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    function drawBreath() {
      if (!breathActive) return;
      
      const scale = 1.5;
      const progress = breathProgress;
      const startX = godzilla.x + 135 * scale;
      const startY = godzilla.y - 210;
      const endX = startX + 900 * progress;
      const endY = startY - 100;
      
      // Main beam
      ctx.save();
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.3, 'rgba(255, 200, 0, 0.8)');
      gradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#ff6b00';
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 30 * progress;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY + (Math.sin(Date.now() * 0.01) * 10));
      ctx.stroke();
      
      // Inner core
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 10 * progress;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      ctx.restore();
      
      // Spawn particles
      if (progress > 0.3 && Math.random() < 0.3) {
        const t = Math.random();
        const px = startX + (endX - startX) * t;
        const py = startY + (endY - startY) * t;
        particles.push(new Particle(px, py));
      }
    }
    
    function animate() {
      ctx.fillStyle = 'rgba(8, 8, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawGodzilla();
      drawBreath();
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        } else {
          particles[i].draw(ctx);
        }
      }
      
      // Breath animation
      if (breathActive) {
        breathProgress += 0.05;
        if (breathProgress >= 1) {
          breathProgress = 1;
          setTimeout(() => {
            breathActive = false;
            breathProgress = 0;
          }, 500);
        }
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Trigger breath every 8-12 seconds
    function scheduleBreath() {
      setTimeout(() => {
        if (!breathActive) {
          breathActive = true;
          breathProgress = 0;
          playTone(150, 'sawtooth', 0.8, 0.1);
          setTimeout(() => playTone(200, 'sawtooth', 0.5, 0.08), 200);
        }
        scheduleBreath();
      }, 8000 + Math.random() * 4000);
    }
    
    animate();
    scheduleBreath();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      godzilla.y = window.innerHeight - 50;
      godzilla.headY = window.innerHeight - 280;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}

/* ============================================================
   TYPES
   ============================================================ */
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: string;
}

interface GlitchTextProps {
  children: React.ReactNode;
  intensity?: number;
}

interface DemoCardProps {
  title: string;
  description: string;
  category: 'effect' | 'game';
  color: string;
  difficulty?: number;
  icon: string;
  tech?: string;
  demoUrl?: string;
}

interface DemoData extends DemoCardProps {
  id: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

/* ============================================================
   TAB BUTTON COMPONENT
   ============================================================ */
function TabButton({ active, onClick, children, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '1rem 1.75rem',
        fontSize: '1rem',
        fontWeight: active ? 800 : 600,
        fontFamily: "'JetBrains Mono', monospace",
        background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
        border: '2px solid',
        borderColor: active ? '#7c3aed' : 'rgba(124,58,237,0.3)',
        color: active ? '#a78bfa' : 'rgba(255,255,255,0.5)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: active ? '0 0 30px rgba(124,58,237,0.4), inset 0 0 20px rgba(124,58,237,0.1)' : 'none',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transform: active ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
        }
      }}
    >
      {icon && <span style={{ fontSize: '1.2rem' }}>{icon}</span>}
      {children}
    </button>
  );
}

/* ============================================================
   GLITCH TEXT
   ============================================================ */
function GlitchText({ children, intensity = 1 }: GlitchTextProps) {
  const text = String(children);
  const [displayed, setDisplayed] = useState(text);
  const [glitching, setGlitching] = useState(false);
  const rafRef = useRef(null);

  const trigger = useCallback(() => {
    if (glitching) return;
    setGlitching(true);
    let frame = 0; const total = Math.round(26*intensity);
    const tick = () => {
      frame++;
      const t = frame/total;
      if (t < 0.55) {
        setDisplayed(text.split('').map(c => c!==' '&&Math.random()<0.45*intensity ? randomChar() : c).join(''));
      } else {
        const idx = Math.floor(((t-0.55)/0.45)*text.length);
        setDisplayed(text.split('').map((c,i) => i<=idx ? c : c!==' '&&Math.random()<0.2 ? randomChar() : c).join(''));
      }
      if (frame < total) rafRef.current = requestAnimationFrame(tick);
      else { setDisplayed(text); setGlitching(false); }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, glitching, intensity]);

  useEffect(() => {
    const id = setInterval(() => { if (Math.random()<0.3) trigger(); }, 3500+Math.random()*4000);
    return () => { clearInterval(id); if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [trigger]);

  return (
    <span onClick={trigger} style={{
      fontFamily:"'Courier New',monospace", fontWeight:800, cursor:'pointer',
      color: glitching ? '#00ff88' : 'inherit',
      textShadow: glitching ? '2px 0 rgba(255,0,60,.6), -2px 0 rgba(0,255,136,.6), 0 0 20px rgba(0,255,136,.4)' : 'none',
      transition: 'color .08s, text-shadow .08s'
    }}>{displayed}</span>
  );
}

/* ============================================================
   ANIMATED DEMO CARD WITH PARTICLES
   ============================================================ */
function DemoCard({ title, description, category, color, difficulty, icon, tech, demoUrl }: DemoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !cardRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    let particles: Particle[] = [];
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.shadowBlur = 15;
          ctx.shadowColor = color;
          ctx.fillStyle = color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.restore();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Spawn particles on hover
    const spawnParticles = () => {
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 3 + Math.random() * 5
        });
      }
    };
    
    let interval: NodeJS.Timeout | undefined;
    if (isHovered) {
      interval = setInterval(spawnParticles, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, color]);

  const handleClick = () => {
    if (demoUrl) {
      window.open(demoUrl, '_blank');
      playTone(600, 'sine', 0.2, 0.1);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
        playTone(440 + Math.random() * 200, 'sine', 0.1, 0.08);
      }}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '2rem',
        background: isHovered ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
        border: `2px solid ${color}`,
        borderRadius: '16px',
        boxShadow: isHovered 
          ? `0 20px 60px ${color}88, 0 0 40px ${color}66, inset 0 0 30px ${color}22`
          : `0 0 30px ${color}33`,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered 
          ? 'translateY(-10px) scale(1.02) rotateX(2deg)' 
          : 'translateY(0) scale(1) rotateX(0deg)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        cursor: demoUrl ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Scan Line Effect */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 20px ${color}`,
            animation: 'scanDown 2s linear infinite',
            zIndex: 2,
          }}
        />
      )}

      {/* Glow Pulse */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          right: '-50%',
          bottom: '-50%',
          background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Category Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: color,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
          fontFamily: "'JetBrains Mono', monospace",
          padding: '0.4rem 0.8rem',
          background: `${color}22`,
          borderRadius: '6px',
          border: `1px solid ${color}66`,
          boxShadow: isHovered ? `0 0 15px ${color}66` : 'none',
          transition: 'all 0.3s',
        }}>
          <span style={{ fontSize: '1.2rem' }}>{icon}</span>
          {category}
        </div>

        {/* Title with Glitch */}
        <h3 style={{
          fontSize: '1.5rem',
          marginBottom: '0.75rem',
          color: '#fff',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          textShadow: isHovered ? `0 0 20px ${color}, 2px 0 ${color}44, -2px 0 ${color}44` : 'none',
          transition: 'all 0.2s',
          animation: isHovered ? 'glitchText 0.3s ease-in-out infinite' : 'none',
        }}>
          {title}
        </h3>

        {/* Description */}
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6,
          marginBottom: '1rem',
          transition: 'color 0.3s',
        }}>
          {description}
        </p>

        {/* Tech Stack */}
        {tech && (
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '1rem',
            padding: '0.5rem 0.75rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '6px',
            borderLeft: `3px solid ${color}`,
          }}>
            {tech}
          </div>
        )}

        {/* Difficulty Bar */}
        {difficulty && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
              fontSize: '0.75rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255,255,255,0.5)',
            }}>
              <span>DIFFICULTY</span>
              <span style={{ color: color, fontWeight: 'bold' }}>
                LV.{difficulty}
              </span>
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div
                style={{
                  height: '100%',
                  width: `${(difficulty / 10) * 100}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}88)`,
                  boxShadow: `0 0 10px ${color}`,
                  borderRadius: '3px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  animation: isHovered ? 'slideIn 0.6s ease-out' : 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {demoUrl && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: `${color}22`,
              border: `2px solid ${color}`,
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 'bold',
              color: color,
              letterSpacing: '0.1em',
              transition: 'all 0.3s',
              boxShadow: isHovered ? `0 0 25px ${color}88, inset 0 0 15px ${color}33` : 'none',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            ▶ {category === 'game' ? 'PLAY NOW' : 'VIEW DEMO'}
          </div>
        )}
        {!demoUrl && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 'bold',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
            }}
          >
            ✨ HTML TAG COMPONENT
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanDown {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes glitchText {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        @keyframes slideIn {
          from { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   MAIN SHOWCASE WITH TABS
   ============================================================ */
export default function Showcase() {
  const [activeTab, setActiveTab] = useState<'all' | 'effects' | 'games'>('all');

  // 実際のデモデータ
  const demos: DemoData[] = [
    // VISUAL EFFECTS (HTMLタグとして使用可能)
    {
      id: 'glitch-text',
      title: 'GlitchText',
      description: 'クリックで即座に崩壊するテキストエフェクト。RGB色収差と文字置換でサイバー感を演出。',
      category: 'effect',
      color: '#00ff88',
      difficulty: 7,
      icon: '✨',
      tech: 'React Hooks · requestAnimationFrame · RGB Split'
    },
    {
      id: 'scan-reveal',
      title: 'ScanReveal',
      description: 'スキャンライン付きフェードイン。要素が画面に入るとスキャン開始。',
      category: 'effect',
      color: '#7c3aed',
      difficulty: 6,
      icon: '📡',
      tech: 'IntersectionObserver · CSS Animation · 3D Transform'
    },
    {
      id: 'typewriter',
      title: 'Typewriter',
      description: 'タイプミスして打ち直すリアルなタイプライター。隣接キーでミス再現。',
      category: 'effect',
      color: '#00d9ff',
      difficulty: 8,
      icon: '⌨️',
      tech: 'Keyboard Layout · Backspace Logic · Timing Control'
    },
    {
      id: 'counter-up',
      title: 'CounterUp',
      description: '目標値を超えてから戻る物理カウンター。Verlet積分による滑らかな動き。',
      category: 'effect',
      color: '#a855f7',
      difficulty: 7,
      icon: '🔢',
      tech: 'Verlet Integration · Spring Physics · Damping'
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'SVGラインが自走して繋がるタイムライン。stroke-dashoffsetアニメーション。',
      category: 'effect',
      color: '#ec4899',
      difficulty: 9,
      icon: '📊',
      tech: 'SVG Path · stroke-dashoffset · Staggered Animation'
    },
    
    // GAMES (スタンドアロンHTMLデモ)
    {
      id: 'neon-tetris',
      title: 'NEON TETRIS',
      description: 'モバイル完全対応のテトリス。タッチコントロール、レベルシステム、ライン消去エフェクト。',
      category: 'game',
      color: '#a855f7',
      difficulty: 8,
      icon: '🎮',
      tech: 'Canvas 2D · Collision Detection · Touch Events',
      demoUrl: '/demos/neon-tetris.html'
    },
    {
      id: 'neon-sudoku',
      title: 'NEON SUDOKU',
      description: '10段階難易度のAI数独。バックトラック法で盤面生成、ヒント機能付き。',
      category: 'game',
      color: '#a855f7',
      difficulty: 10,
      icon: '🧩',
      tech: 'Backtracking Algorithm · Validation · Hint System',
      demoUrl: '/demos/neon-sudoku.html'
    },
    {
      id: 'neon-invaders',
      title: 'NEON INVADERS',
      description: 'スペースインベーダー風シューティング。ウェーブシステム、シールド、パワーアップ。',
      category: 'game',
      color: '#00d9ff',
      difficulty: 9,
      icon: '👾',
      tech: 'Sprite Animation · Collision · Wave System',
      demoUrl: '/demos/space-invaders-ultra.html'
    },
    {
      id: 'neon-breakout',
      title: 'NEON BREAKOUT',
      description: 'ブロック崩し。パワーアップ3種、マルチボール、物理演算ボール。',
      category: 'game',
      color: '#ec4899',
      difficulty: 7,
      icon: '🎯',
      tech: 'Physics Simulation · Powerups · Particle Effects',
      demoUrl: '/demos/neon-breakout.html'
    },
    {
      id: 'neon-baseball',
      title: 'NEON BASEBALL',
      description: 'タイミング勝負の野球盤。CPU対戦、3段階難易度、9イニング制。',
      category: 'game',
      color: '#10b981',
      difficulty: 8,
      icon: '⚾',
      tech: 'Timing System · AI Opponent · Trajectory Calculation',
      demoUrl: '/demos/neon-baseball.html'
    },
    {
      id: 'neon-reversi',
      title: 'NEON REVERSI',
      description: '3段階AI搭載オセロ。位置評価関数、先読みアルゴリズム。',
      category: 'game',
      color: '#a855f7',
      difficulty: 9,
      icon: '⚫',
      tech: 'Minimax Algorithm · Position Evaluation · AI',
      demoUrl: '/demos/neon-reversi.html'
    },
  ];

  // フィルタリング
  const filteredDemos = demos.filter((demo): demo is DemoData => {
    if (activeTab === 'all') return true;
    if (activeTab === 'effects') return demo.category === 'effect';
    if (activeTab === 'games') return demo.category === 'game';
    return true;
  });

  return (
    <div style={{
      minHeight:'100vh',
      background:'#080810',
      color:'#fff',
      fontFamily:"'Georgia','Times New Roman',serif",
      overflowX:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 2px; }
      `}</style>

      {/* GRID BACKGROUND */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{
          position:'absolute',
          inset:'-40px',
          backgroundImage:'linear-gradient(rgba(124,58,237,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.07) 1px,transparent 1px)',
          backgroundSize:'40px 40px',
        }}/>
        <div style={{
          position:'absolute',
          inset:0,
          background:'radial-gradient(ellipse 80% 60% at 20% 20%,rgba(124,58,237,.12),transparent),radial-gradient(ellipse 60% 80% at 80% 80%,rgba(0,255,136,.06),transparent)'
        }}/>
      </div>

      {/* GODZILLA FIRE BREATH */}
      <GodzillaEffect />

      {/* HERO */}
      <section style={{
        position:'relative',
        zIndex:1,
        minHeight:'100vh',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        padding:'0 clamp(1.5rem,5vw,4rem)',
        maxWidth:'1100px',
        margin:'0 auto'
      }}>
        <h1 style={{
          fontSize:'clamp(2.8rem,8vw,6rem)',
          fontWeight:800,
          lineHeight:.95,
          letterSpacing:'-.03em',
          marginBottom:'2rem'
        }}>
          <GlitchText intensity={1.2}>HTML</GlitchText>
          <span style={{
            display:'block',
            color:'rgba(255,255,255,.25)',
            fontStyle:'italic',
            fontWeight:400,
            fontSize:'clamp(1.4rem,4vw,2.8rem)',
            letterSpacing:'-.01em',
            marginTop:'.3rem'
          }}>
            is not the destination.
          </span>
          <span style={{
            display:'block',
            background:'linear-gradient(135deg,#7c3aed,#a78bfa,#00ff88)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',
            backgroundClip:'text'
          }}>
            It's the input.
          </span>
        </h1>

        <p style={{
          fontSize:'clamp(1rem,2.5vw,1.25rem)',
          color:'rgba(255,255,255,.5)',
          lineHeight:1.7,
          maxWidth:'580px',
          marginBottom:'3rem'
        }}>
          コンテンツと体験を完全に分離したブログシステム。HTMLを書くだけで、全記事にゲーミングUIが宿る。
        </p>
      </section>

      {/* SHOWCASE SECTION WITH TABS */}
      <section style={{
        position:'relative',
        zIndex:1,
        padding:'6rem clamp(1.5rem,5vw,4rem)',
        maxWidth:'1100px',
        margin:'0 auto'
      }}>
        {/* Section Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            fontSize:'.65rem',
            letterSpacing:'.2em',
            color:'rgba(124,58,237,.7)',
            textTransform:'uppercase',
            marginBottom:'1rem',
            fontFamily:"'JetBrains Mono',monospace"
          }}>
            // Interactive Showcase
          </div>
          <h2 style={{
            fontSize:'clamp(1.8rem,4vw,3rem)',
            fontWeight:700,
            letterSpacing:'-.03em',
            marginBottom:'2rem',
            lineHeight:1.1
          }}>
            <span style={{color:'#a78bfa'}}>ビジュアルエフェクト</span> と <span style={{color:'#00ff88'}}>ゲーム</span>
          </h2>
          <p style={{
            color:'rgba(255,255,255,.4)',
            fontSize:'.95rem',
            marginBottom:'3rem',
            maxWidth: '700px',
            lineHeight: 1.7
          }}>
            HTMLタグとして記事に埋め込めるエフェクトコンポーネントと、
            Canvas 2Dで作られたスタンドアロンゲームデモ。
            すべてクリック・タップで操作可能。
          </p>
        </div>

        {/* TAB BUTTONS */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          padding: '1rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <TabButton
            active={activeTab === 'all'}
            onClick={() => {
              setActiveTab('all');
              playTone(400, 'sine', 0.1);
            }}
            icon="🎯"
          >
            All
          </TabButton>
          <TabButton
            active={activeTab === 'effects'}
            onClick={() => {
              setActiveTab('effects');
              playTone(500, 'sine', 0.1);
            }}
            icon="✨"
          >
            Effects
          </TabButton>
          <TabButton
            active={activeTab === 'games'}
            onClick={() => {
              setActiveTab('games');
              playTone(600, 'sine', 0.1);
            }}
            icon="🎮"
          >
            Games
          </TabButton>
        </div>

        {/* DEMO GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {filteredDemos.map((demo, index) => (
            <div
              key={demo.id}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
              }}
            >
              <DemoCard {...demo} />
            </div>
          ))}
        </div>

        {/* Count Display */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '12px',
          textAlign: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#a78bfa'
        }}>
          <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', opacity: 0.7 }}>
            {activeTab === 'all' && 'すべてのデモ'}
            {activeTab === 'effects' && 'HTMLタグエフェクト'}
            {activeTab === 'games' && 'ゲームデモ'}
          </div>
          <strong style={{ fontSize: '2rem', color: '#fff', display: 'block' }}>
            {filteredDemos.length}
          </strong>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.5 }}>
            / {demos.length} total
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
