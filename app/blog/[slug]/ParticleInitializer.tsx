'use client';

import { useEffect } from 'react';

interface ParticleInitializerProps {
  slug: string;
}

export default function ParticleInitializer({ slug }: ParticleInitializerProps) {
  useEffect(() => {
    console.log('🧠 Particle initializer mounted, slug:', slug);

    let retries = 0;
    const maxRetries = 20;
    const interval = 200;

    const tryInit = () => {
      const canvas = document.getElementById('particle-canvas');
      const fn = window.initParticles;

      console.log(`🔁 Retry ${retries}, canvas:`, canvas, 'initParticles:', typeof fn);

      if (canvas && typeof fn === 'function') {
        console.log('🎯 Triggering particleInit event');
        document.dispatchEvent(new CustomEvent('particleInit'));

        fn();
        console.log('✅ Called window.initParticles()');
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(tryInit, interval);
      } else {
        console.warn('⏱ Particle init failed after retries');
      }
    };

    tryInit();

    return () => {
      console.log('💨 Particle initializer unmounted, slug:', slug);
      if (typeof window.particleAnimationId === 'number') {
        cancelAnimationFrame(window.particleAnimationId);
        console.log('🛑 Particle animation cancelled');
      }
    };
  }, [slug]);

  return null;
}
