// app/lp/thought-to-website/page.tsx
'use client';

import { useState } from 'react';

export default function ThoughtToWebsiteLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const openModal = () => {
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const nextStep = (step: number) => setCurrentStep(step);
  const reject = () => setCurrentStep(99);
  const final = () => setCurrentStep(100);

  return (
    <div style={{ 
      background: '#0a0a0a', 
      color: '#e0e0e0', 
      minHeight: '100vh', 
      padding: '2rem 1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>
          思想を書くとWebサイトが完成する
        </h1>
        <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
          テーマと思想を書くと、設計も実装も不要でWebサイトが自動生成される。
        </p>
        
        <h2 style={{ fontSize: '2rem', margin: '2rem 0 1rem', color: '#fff' }}>
          価格：10万円
        </h2>
        <button
          onClick={openModal}
          style={{
            padding: '1.25rem 3rem',
            background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            margin: '2rem 0'
          }}
        >
          もう迷わないと決める
        </button>
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem'
          }}
        >
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '2px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '12px',
            padding: '3rem 2rem',
            maxWidth: '700px',
            width: '90%'
          }}>
            
            {currentStep === 0 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  ここから先は申し込む人を増やすためのフォームではありません。
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => nextStep(1)} style={btnStyle('#22c55e')}>⭕ 進む</button>
                  <button onClick={closeModal} style={btnStyle('#ef4444')}>❌ 閉じる</button>
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  このシステムには、管理画面で記事を書く機能はありません。
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => nextStep(2)} style={btnStyle('#22c55e')}>⭕ Yes</button>
                  <button onClick={reject} style={btnStyle('#ef4444')}>❌ No</button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  構造・機能・運用フローについて、あとから変更や相談はできません。
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => nextStep(3)} style={btnStyle('#22c55e')}>⭕ Yes</button>
                  <button onClick={reject} style={btnStyle('#ef4444')}>❌ No</button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  更新が止まった場合、それは「設計の問題」であり、あなた自身を責めないと約束できますか。
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => nextStep(4)} style={btnStyle('#22c55e')}>⭕ Yes</button>
                  <button onClick={reject} style={btnStyle('#ef4444')}>❌ No</button>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  10万円は「制作費」ではなく、自由を手放すための費用です。
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => nextStep(5)} style={btnStyle('#22c55e')}>⭕ Yes</button>
                  <button onClick={reject} style={btnStyle('#ef4444')}>❌ No</button>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  それでも申し込みますか。
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={final} style={btnStyle('#22c55e')}>⭕ Yes</button>
                  <button onClick={closeModal} style={btnStyle('#ef4444')}>❌ No</button>
                </div>
              </>
            )}

            {currentStep === 100 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  すべての質問に同意されました。
                </h3>
                <p style={{ textAlign: 'center', margin: '2rem 0' }}>
                  <a
                    href="mailto:product@newaddr.com?subject=申込"
                    style={{
                      display: 'inline-block',
                      padding: '1.25rem 3rem',
                      background: '#22c55e',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  >
                    申込手続きに進む
                  </a>
                </p>
              </>
            )}

            {currentStep === 99 && (
              <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                  この商品は向いていません
                </h3>
                <p style={{ textAlign: 'center' }}>ご理解いただきありがとうございました。</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                  <button onClick={closeModal} style={btnStyle('#ef4444')}>閉じる</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = (color: string) => ({
  flex: 1,
  padding: '1.25rem',
  fontSize: '1.125rem',
  fontWeight: 'bold',
  border: `2px solid ${color}`,
  borderRadius: '8px',
  cursor: 'pointer',
  background: `${color}22`,
  color: color,
  fontFamily: 'inherit'
});
