// global.d.ts
export {};

declare global {
  interface Window {
    initParticles?: () => void;
    particleAnimationId?: number;
  }
}
