'use client';

import { useEffect } from 'react';

interface ParticleInitializerProps {
  slug: string;
}

export default function ParticleInitializer({ slug }: ParticleInitializerProps) {
  useEffect(() => {
    console.log('🌟 Particle initializer mounted, slug:', slug);

    const raf = requestAnimationFrame(() => {
      console.log('⏱ init via requestAnimationFrame');

      // canvas の存在確認
      const canvas = document.getElementById('particle-canvas');
      console.log('🔍 canvas at init timing (RAF):', canvas);

      // カスタムイベントをトリガー
      const event = new CustomEvent('particleInit');
      document.dispatchEvent(event);
      console.log('🎉 Triggered particleInit event');

      // グローバル関数が存在する場合は直接呼び出し
      if (typeof window !== 'undefined' && typeof (window as any).initParticles === 'function') {
        (window as any).initParticles();
        console.log('✅ Called window.initParticles() directly');
      } else {
        console.warn('⚠️ window.initParticles() not found');
      }

      // canvas の存在ログ（重複だが明示）
      if (canvas) {
        console.log('✅ Canvas element found in DOM');
      } else {
        console.warn('⚠️ Canvas element not found in DOM');
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      console.log('💨 Particle initializer unmounted, slug:', slug);

      // パーティクルアニメーションをキャンセル
      if (typeof window !== 'undefined' && (window as any).particleAnimationId) {
        cancelAnimationFrame((window as any).particleAnimationId);
        console.log('🛑 Particle animation cancelled');
      }
    };
  }, [slug]);

  return null;
}
