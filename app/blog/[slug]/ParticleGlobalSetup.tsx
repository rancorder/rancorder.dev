'use client';

import { useEffect } from 'react';

export default function ParticleGlobalSetup({ slug }: { slug: string }) {
  useEffect(() => {
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

      const particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1,
      }));

      function draw() {
        ctx!.clearRect(0, 0, canvas.width, canvas.height); // ← ★ ctx! で型エラー回避
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx!.fill();
        }

        window.particleAnimationId = requestAnimationFrame(draw);
      }

      draw();
      console.log('✅ Particle animation started');
    };
  }, [slug]);

  return null;
}
