// global.d.ts
export {};

declare global {
  interface Window {
    initParticles?: () => void;
    particleAnimationId?: number;

    // ★ これを追加（Observer の型）
    __fadeObserver?: IntersectionObserver;
  }
}
