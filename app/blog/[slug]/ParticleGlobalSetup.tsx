'use client';

import { useEffect } from 'react';

export default function ParticleGlobalSetup({ slug }: { slug: string }) {
  useEffect(() => {
    console.log('🧠 [ParticleInit] GlobalSetup mounted, slug:', slug);

    // 既存アニメーションの停止（安全）
    if (typeof window.particleAnimationId === 'number') {
      cancelAnimationFrame(window.particleAnimationId);
      console.log('🛑 [ParticleInit] previous animation cancelled');
    }

    window.initParticles = () => {
      const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement | null;
      if (!canvas) {
        console.warn('❌ canvas not found');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('❌ canvas context not available');
        return;
      }

      // ============================
      // Canvasサイズの正規化
      // ============================
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      console.log('[Canvas] width:', canvas.width, 'height:', canvas.height);
      console.log('[Canvas] rect:', rect);

      // ============================
      // 粒の生成（画面サイズに応じて調整）
      // ============================
      const area = rect.width * rect.height;
      const density = 0.00025; // 粒密度（調整可能）
      const count = Math.floor(area * density);

      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 1.6 + 0.4,
      }));

      // ============================
      // 描画ループ
      // ============================
      function draw() {
        ctx!.clearRect(0, 0, rect.width, rect.height);

        // 粒の移動と描画
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > rect.width) p.vx *= -1;
          if (p.y < 0 || p.y > rect.height) p.vy *= -1;

          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx!.fill();
        }

        // 接続線の描画
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 80) {
              ctx!.beginPath();
              ctx!.moveTo(particles[i].x, particles[i].y);
              ctx!.lineTo(particles[j].x, particles[j].y);
              ctx!.strokeStyle = 'rgba(255, 255, 255, 0.2)';
              ctx!.stroke();
            }
          }
        }

        window.particleAnimationId = requestAnimationFrame(draw);
      }

      draw();
      console.log('✨ [ParticleInit] Particle animation started');
    };
  }, [slug]);

  return null;
}
