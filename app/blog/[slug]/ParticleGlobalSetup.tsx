'use client';

import { useEffect } from 'react';

export default function ParticleGlobalSetup({ slug }: { slug: string }) {
  useEffect(() => {
    console.log('🧠 [ParticleInit] GlobalSetup mounted, slug:', slug);

    if (typeof window.particleAnimationId === 'number') {
      cancelAnimationFrame(window.particleAnimationId);
    }

    window.initParticles = () => {
      const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // ============================
      // ★ モバイル対応：レイアウト確定待ち
      // ============================
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('⏳ rect is 0, retrying...');
        setTimeout(window.initParticles, 120);
        return;
      }

      // ============================
      // ★ DPR の上限を 2 に制限（iPhone対策）
      // ============================
      const rawDpr = window.devicePixelRatio || 1;
      const dpr = Math.min(rawDpr, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.resetTransform?.(); // Safari対策
      ctx.scale(dpr, dpr);

      console.log('[Canvas] rect:', rect, 'dpr:', dpr);

      // ============================
      // 粒の数（モバイルは密度を下げる）
      // ============================
      const area = rect.width * rect.height;
      const density = window.innerWidth < 600 ? 0.00015 : 0.00025;
      const count = Math.floor(area * density);

      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: Math.random() * 1.4 + 0.4,
      }));

      function draw() {
        ctx.clearRect(0, 0, rect.width, rect.height);

        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > rect.width) p.vx *= -1;
          if (p.y < 0 || p.y > rect.height) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }

        // 接続線（モバイルは距離短め）
        const linkDist = window.innerWidth < 600 ? 55 : 80;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < linkDist) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
              ctx.stroke();
            }
          }
        }

        window.particleAnimationId = requestAnimationFrame(draw);
      }

      draw();
      console.log('✨ [ParticleInit] Particle animation started (mobile-ready)');
    };
  }, [slug]);

  return null;
}
