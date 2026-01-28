'use client';

import { useEffect } from 'react';

export default function ParticleGlobalSetup({ slug }: { slug: string }) {
  useEffect(() => {
    window.initParticles = () => {
      const canvas = document.getElementById('particle-canvas');
      if (!canvas) {
        console.warn('❌ canvas not found');
        return;
      }

      console.log('🚀 initParticles called');
      // ここにパーティクル描画処理を書く
    };
  }, [slug]);

  return null;
}
