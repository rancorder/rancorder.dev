'use client';

import { useEffect } from 'react';

export default function ParticleGlobalSetup({ slug }: { slug: string }) {
  useEffect(() => {
    console.log('🧠 [ParticleInit] GlobalSetup mounted, slug:', slug);

    // 既存アニメーションの停止（SPA遷移対策）
    if (typeof window.particleAnimationId === 'number') {
      cancelAnimationFrame(window.particleAnimationId);
      console.log('🛑 [ParticleInit] previous animation cancelled');
    }

    // ============================================================
    // initParticles（PC / モバイル / Safari 完全対応）
    // ============================================================
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

      // ------------------------------------------------------------
      // ★ モバイル対策：レイアウト確定前は rect が 0 になる
      // ------------------------------------------------------------
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('⏳ rect is 0, retrying...');
        setTimeout(() => window.initParticles?.(), 120); // ← TS安全
        return;
      }

      // ------------------------------------------------------------
      // ★ DPR の上限を 2 に制限（iPhone の DPR=3 は重すぎる）
      // ------------------------------------------------------------
      const rawDpr = window.devicePixelRatio || 1;
      const dpr = Math.min(rawDpr, 2);

      // ------------------------------------------------------------
      // ★ Canvas 実サイズを正規化（最重要）
      // ------------------------------------------------------------
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Safari の transform バグ対策
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      console.log('[Canvas] rect:', rect, 'dpr:', dpr);

      // ------------------------------------------------------------
      // ★ 粒の数（画面サイズに応じて自動調整）
      // ------------------------------------------------------------
      const area = rect.width * rect.height;
      const density = window.innerWidth < 600 ? 0.00015 : 0.00025; // モバイルは密度低め
      const count = Math.floor(area * density);

      const particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: Math.random() * 1.4 + 0.4,
      }));

      // ------------------------------------------------------------
      // ★ 描画ループ（PC / モバイル両対応）
      // ------------------------------------------------------------
      function draw() {
        ctx.clearRect(0, 0, rect.width, rect.height);

        // 粒の移動と描画
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

        // ------------------------------------------------------------
        // ★ 接続線（モバイルは距離短め）
        // ------------------------------------------------------------
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
