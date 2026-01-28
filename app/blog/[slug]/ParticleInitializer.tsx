'use client';

import { useEffect } from 'react';

interface ParticleInitializerProps {
  slug: string;
}

export default function ParticleInitializer({ slug }: ParticleInitializerProps) {
  useEffect(() => {
    console.log('🧠 Particle initializer mounted, slug:', slug);

    const handleLoad = () => {
      console.log('🧭 window.load fired, initParticles:', typeof window.initParticles);

      const canvas = document.getElementById('particle-canvas');
      console.log('🔵 canvas at init timing (load):', canvas);

      const event = new CustomEvent('particleInit');
      document.dispatchEvent(event);
      console.log('🎯 Triggered particleInit event');

      if (typeof window.initParticles === 'function') {
        window.initParticles();
        console.log('✅ Called window.initParticles() directly');
      } else {
        console.warn('⚠️ window.initParticles() not found');
      }

      if (canvas) {
        console.log('✅ Canvas element found in DOM');
      } else {
        console.warn('⚠️ Canvas element not found in DOM');
      }
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
      console.log('💨 Particle initializer unmounted, slug:', slug);

      if (typeof window.particleAnimationId === 'number') {
        cancelAnimationFrame(window.particleAnimationId);
        console.log('🛑 Particle animation cancelled');
      }
    };
  }, [slug]);

  return null;
}
