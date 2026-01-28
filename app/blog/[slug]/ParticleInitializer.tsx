'use client';

import { useEffect } from 'react';

interface ParticleInitializerProps {
  slug: string;
}

export default function ParticleInitializer({ slug }: ParticleInitializerProps) {
  useEffect(() => {
    console.log('🧠 [ParticleInit] mounted, slug:', slug);

    let retries = 0;
    const maxRetries = 25;
    const interval = 160;

    // 既存アニメーションの停止（安全）
    if (typeof window.particleAnimationId === 'number') {
      cancelAnimationFrame(window.particleAnimationId);
      console.log('🛑 [ParticleInit] previous animation cancelled');
    }

    const tryInit = () => {
      const canvas = document.getElementById('particle-canvas');
      const fn = window.initParticles;

      console.log(
        `🔍 [ParticleInit] Retry ${retries}/${maxRetries}`,
        'canvas:', !!canvas,
        'initParticles:', typeof fn
      );

      // DOM + 関数が揃ったら初期化
      if (canvas && typeof fn === 'function') {
        console.log('🎯 [ParticleInit] Dispatching particleInit event');
        document.dispatchEvent(new CustomEvent('particleInit'));

        try {
          fn();
          console.log('✨ [ParticleInit] initParticles() executed');
        } catch (err) {
          console.error('💥 [ParticleInit] initParticles error:', err);
        }
        return;
      }

      // リトライ
      if (retries < maxRetries) {
        retries++;
        setTimeout(tryInit, interval);
      } else {
        console.warn('⏱ [ParticleInit] init failed after max retries');
      }
    };

    // 初回実行
    setTimeout(tryInit, 0);

    return () => {
      console.log('💨 [ParticleInit] unmounted, slug:', slug);

      if (typeof window.particleAnimationId === 'number') {
        cancelAnimationFrame(window.particleAnimationId);
        console.log('🛑 [ParticleInit] animation cancelled on unmount');
      }
    };
  }, [slug]);

  return null;
}
