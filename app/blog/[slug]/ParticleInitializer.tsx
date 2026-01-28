'use client';

import { useEffect } from 'react';

interface ParticleInitializerProps {
  slug: string;
}

export default function ParticleInitializer({ slug }: ParticleInitializerProps) {
  useEffect(() => {
    console.log('🌟 Particle initializer mounted, slug:', slug);

    // HTMLコンテンツが描画された後にパーティクルを初期化
    const timer = setTimeout(() => {
      console.log('⏱ init timer fired (300ms)');

      // 🔍 追加：canvas の存在確認ログ
      const canvas = document.getElementById('particle-canvas');
      console.log('🔍 canvas at init timing:', canvas);

      // 方法1: カスタムイベントをトリガー
      const event = new CustomEvent('particleInit');
      document.dispatchEvent(event);
      console.log('🎉 Triggered particleInit event');

      // 方法2: グローバル関数が存在する場合は直接呼び出し
      if (typeof window !== 'undefined' && typeof (window as any).initParticles === 'function') {
        (window as any).initParticles();
        console.log('✅ Called window.initParticles() directly');
      } else {
        console.warn('⚠️ window.initParticles() not found');
      }

      // 方法3: DOM要素の存在を確認（既存）
      if (canvas) {
        console.log('✅ Canvas element found in DOM');
      } else {
        console.warn('⚠️ Canvas element not found in DOM');
      }
    }, 300); // 300ms待機してDOMの描画を確実にする

    // クリーンアップ
    return () => {
      clearTimeout(timer);
      console.log('💨 Particle initializer unmounted, slug:', slug);

      // パーティクルアニメーションをキャンセル
      if (typeof window !== 'undefined' && (window as any).particleAnimationId) {
        cancelAnimationFrame((window as any).particleAnimationId);
        console.log('🛑 Particle animation cancelled');
      }
    };
  }, [slug]); // slugが変わるたびに実行

  // このコンポーネントは何もレンダリングしない
  return null;
}
