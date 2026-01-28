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
      // ★ Canvas サイズの正規化（最重要）
      // ============================
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      console.log('[Canvas] width:', canvas.width, 'height:', canvas.height);
      console.log('[Canvas] rect:', rect);

      // ============================
      // ★ パーティクル生成
      // ============================
      const particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 1.8 + 0.6,
      }));

      function draw() {
        ctx!.clearRect(0, 0, rect.width, rect.height);

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

        window.particleAnimationId = requestAnimationFrame(draw);
      }

      draw();
      console.log('✨ [ParticleInit] Particle animation started');
    };
  }, [slug]);

  return null;
}
