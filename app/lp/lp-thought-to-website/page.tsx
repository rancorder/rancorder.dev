'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'0' | '1' | '2' | '3' | '4' | '5' | 'final' | 'reject'>('0');

  const openModal = () => {
    setStep('0');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const showStep = (next: typeof step) => {
    setStep(next);
  };

  // ESCキー対応（HTML版にはないが挙動を壊さない範囲）
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <div className="wrap">
        <h1>思想を書くとWebサイトが完成する</h1>
        <p>テーマと思想を書くと、設計も実装も不要でWebサイトが自動生成される。</p>

        <h2>価格：10万円</h2>
        <button className="cta-button" onClick={openModal}>
          もう迷わないと決める
        </button>
      </div>

      {isOpen && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            {/* step 0 */}
            {step === '0' && (
              <div className="step-content active">
                <h3 className="question-title">
                  ここから先は申し込む人を増やすためのフォームではありません。
                </h3>
                <div className="answer-buttons">
                  <button className="answer-btn yes" onClick={() => showStep('1')}>⭕ 進む</button>
                  <button className="answer-btn no" onClick={closeModal}>❌ 閉じる</button>
                </div>
              </div>
            )}

            {/* step 1 */}
            {step === '1' && (
              <div className="step-content active">
                <h3 className="question-title">
                  このシステムには、管理画面で記事を書く機能はありません。
                </h3>
                <div className="answer-buttons">
                  <button className="answer-btn yes" onClick={() => showStep('2')}>⭕ Yes</button>
                  <button className="answer-btn no" onClick={() => showStep('reject')}>❌ No</button>
                </div>
              </div>
            )}

            {/* step 2 */}
            {step === '2' && (
              <div className="step-content active">
                <h3 className="question-title">
                  構造・機能・運用フローについて、あとから変更や相談はできません。
                </h3>
                <div className="answer-buttons">
                  <button className="answer-btn yes" onClick={() => showStep('3')}>⭕ Yes</button>
                  <button className="answer-btn no" onClick={() => showStep('reject')}>❌ No</button>
                </div>
              </div>
            )}

            {/* step 3 */}
            {step === '3' && (
              <div className="step-content active">
                <h3 className="question-title">
                  更新が止まった場合、それは「設計の問題」であり、あなた自身を責めないと約束できますか。
                </h3>
                <div className="answer-buttons">
                  <button className="answer-btn yes" onClick={() => showStep('4')}>⭕ Yes</button>
                  <button className="answer-btn no" onClick={() => showStep('reject')}>❌ No</button>
                </div>
              </div>
            )}

            {/* step 4 */}
            {step === '4' && (
              <div className="step-content active">
                <h3 className="question-title">
                  10万円は「制作費」ではなく、自由を手放すための費用です。
                </h3>
                <div className="answer-buttons">
                  <button className="answer-btn yes" onClick={() => showStep('5')}>⭕ Yes</button>
                  <button className="answer-btn no" onClick={() => showStep('reject')}>❌ No</button>
                </div>
              </div>
            )}

            {/* step 5 */}
            {step === '5' && (
              <div className="step-content active">
                <h3 className="question-title">それでも申し込みますか。</h3>
                <div className="answer-buttons">
                  <button className="answer-btn yes" onClick={() => showStep('final')}>⭕ Yes</button>
                  <button className="answer-btn no" onClick={closeModal}>❌ No</button>
                </div>
              </div>
            )}

            {/* final */}
            {step === 'final' && (
              <div className="step-content active">
                <h3 className="question-title">すべての質問に同意されました。</h3>
                <p style={{ textAlign: 'center', margin: '2rem 0' }}>
                  <a
                    href="mailto:product@newaddr.com?subject=申込"
                    className="final-cta-button"
                  >
                    申込手続きに進む
                  </a>
                </p>
              </div>
            )}

            {/* reject */}
            {step === 'reject' && (
              <div className="step-content active">
                <h3 className="question-title">この商品は向いていません</h3>
                <p style={{ textAlign: 'center' }}>ご理解いただきありがとうございました。</p>
                <div className="answer-buttons">
                  <button
                    className="answer-btn no"
                    style={{ maxWidth: '200px', margin: '0 auto' }}
                    onClick={closeModal}
                  >
                    閉じる
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === Global Styles === */}
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
          --bg-dark: #0a0a0a;
          --bg-card: rgba(15, 23, 42, 0.9);
          --text-main: #e0e0e0;
          --text-bright: #ffffff;
          --primary: #7c3aed;
          --success: #22c55e;
          --danger: #ef4444;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          line-height: 1.7;
          color: var(--text-main);
          background: var(--bg-dark);
          padding: 2rem 1rem;
        }
        .wrap { max-width: 900px; margin: 0 auto; }
        h1 { font-size: 2.5rem; margin-bottom: 1.5rem; color: var(--text-bright); }
        h2 { font-size: 2rem; margin: 2rem 0 1rem; color: var(--text-bright); }
        p { font-size: 1.125rem; margin-bottom: 1rem; }

        .cta-button {
          display: inline-block;
          padding: 1.25rem 3rem;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          margin: 2rem 0;
        }
        .cta-button:hover {
          background: linear-gradient(135deg, #22c55e, #16a34a);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: var(--bg-card);
          border: 2px solid rgba(124, 58, 237, 0.3);
          border-radius: 12px;
          padding: 3rem 2rem;
          max-width: 700px;
          width: 90%;
        }

        .question-title {
          font-size: 1.5rem;
          color: var(--text-bright);
          margin-bottom: 2rem;
        }

        .answer-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .answer-btn {
          flex: 1;
          padding: 1.25rem;
          font-size: 1.125rem;
          font-weight: bold;
          border: 2px solid;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
        }

        .answer-btn.yes {
          background: rgba(34, 197, 94, 0.1);
          border-color: var(--success);
          color: var(--success);
        }

        .answer-btn.no {
          background: rgba(239, 68, 68, 0.1);
          border-color: var(--danger);
          color: var(--danger);
        }

        .final-cta-button {
          display: inline-block;
          padding: 1.25rem 3rem;
          background: var(--success);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}
