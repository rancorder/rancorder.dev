// app/lp/lp-thought-to-website/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

export default function ThoughtToWebsiteLandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // パーティクルシステム
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];
    let animationId: number;

    const PARTICLE_COUNT = Math.min(60, Math.floor((width * height) / 20000));

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx!.fillStyle = 'rgba(124, 58, 237, 0.6)';
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
      });

      // 線で結ぶ
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx!.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - distance / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const openModal = () => {
    setCurrentStep(0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextStep = (step: number) => {
    setCurrentStep(step);
  };

  const showRejection = () => {
    setCurrentStep(99);
  };

  const showFinalCTA = () => {
    setCurrentStep(100);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(124, 58, 237, 0.8);
          }
        }
      `}</style>

      <div className="lp-container">
        {/* パーティクル背景 */}
        <canvas ref={canvasRef} className="particle-canvas" />

        {/* スキャンライン */}
        <div className="scanline-overlay" />

        {/* ファーストビュー */}
        <section className="section hero-section">
          <div className="wrap">
            <h1 className="main-title">
              テーマと思想を書くと、<br />
              Webサイトが自動で完成する。
            </h1>

            <p className="lead fade-in">
              設計も、実装も、CMS操作も不要。<br />
              書いた内容がそのままHTMLになり、公開まで終わります。<br />
              <strong className="pulse-text">※ 過去にブログを止めたことがある人専用</strong>
            </p>

            <div className="box scan-box">
              <strong>ただし条件があります。</strong><br />
              この仕組みは、あなたに<strong>選択肢を与えません</strong>。
            </div>

            <p className="note fade-in">
              ※ 管理画面で記事は書けません<br />
              ※ 構造は変更できません<br />
              ※ 自由は、最初からありません
            </p>
          </div>
        </section>

        {/* 定義 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>これは何か</h2>

            <p>
              これはWeb制作サービスではありません。<br />
              CMSでも、ブログツールでもありません。
            </p>

            <p>
              <strong>「思想だけを書かせ、実装と判断をすべて奪うWebサイト生成システム」</strong>です。
            </p>

            <p>
              あなたがやることは一つだけ。
            </p>

            <div className="box">
              テーマを書く。<br />
              思想を書く。<br />
              以上。
            </div>
          </div>
        </section>

        {/* 問題提起 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>なぜ、あなたは止まったのか</h2>

            <p>
              続かなかった理由は、才能でも根性でもありません。
            </p>

            <p className="emphasis-text">
              <strong>自由が多すぎた。</strong><br />
              それだけです。
            </p>

            <ul>
              <li>技術を選べた</li>
              <li>構成を考えられた</li>
              <li>改善点を思いつけた</li>
            </ul>

            <p>
              そのすべてが、<br />
              「今日はやめておく」を合理化しました。
            </p>
          </div>
        </section>

        {/* 解決策 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>解決策は単純で、残酷</h2>

            <p>
              このシステムは、最初にこう決めています。
            </p>

            <div className="box emphasis-box">
              迷わせない。<br />
              選ばせない。<br />
              逃がさない。
            </div>

            <p>
              CMSはありません。<br />
              管理画面で記事も書けません。<br />
              データベースに本文は入りません。
            </p>

            <p>
              <strong>一本道しか、用意していません。</strong>
            </p>
          </div>
        </section>

        {/* 究極形 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>究極形：思想 → 実装</h2>

            <p>
              このシステムには、<strong>Claude用の専用プロンプト</strong>が付属します。
            </p>

            <div className="box flow-box">
              思想を書く<br />
              ↓<br />
              AIがコーディング<br />
              ↓<br />
              リポジトリ生成<br />
              ↓<br />
              git push → 即公開
            </div>

            <p>
              技術選定も、設計判断も、<br />
              あなたの仕事ではありません。
            </p>

            <p className="note">
              ※ AIは「最適化」「設計提案」「選択肢提示」を行いません。
            </p>
          </div>
        </section>

        {/* 管理画面 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>管理画面でできること</h2>

            <p>
              ほとんど何もできません。
            </p>

            <ul>
              <li>状態を見る</li>
              <li>最終更新日を見る</li>
              <li>ビルド結果を見る</li>
              <li>思想の履歴を見る</li>
            </ul>

            <p>
              ここは操作する場所ではありません。<br />
              <strong>現実を見る場所です。</strong>
            </p>

            <p className="danger pulse-text">
              ここで操作できるようになった瞬間、<br />
              このシステムは失敗です。
            </p>
          </div>
        </section>

        {/* 価格 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>価格</h2>

            <div className="price-container">
              <div className="price">10万円</div>
              <button className="cta-button glow-button" onClick={openModal}>
                <span>もう迷わないと決める</span>
              </button>
            </div>

            <hr />

            <p>
              <span className="success">含まれるもの：</span>
            </p>

            <ul>
              <li>デザインカスタマイズ（見た目のみ）</li>
              <li>思想 → 実装パイプライン</li>
              <li>自分で作らなくていい確定</li>
            </ul>

            <p>
              <span className="danger">含まれないもの：</span>
            </p>

            <ul>
              <li>構造変更</li>
              <li>機能追加</li>
              <li>相談・改善提案</li>
              <li>自由</li>
            </ul>
          </div>
        </section>

        {/* 選別 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>これは誰のためのものか</h2>

            <p className="danger">
              来てはいけない人：
            </p>

            <ul>
              <li>自由にカスタマイズしたい</li>
              <li>技術で遊びたい</li>
              <li>最適解を探したい</li>
            </ul>

            <hr />

            <p className="success">
              来るべき人：
            </p>

            <ul>
              <li>書くと決めている</li>
              <li>もう迷いたくない</li>
              <li>自分の意志を信用していない</li>
            </ul>
          </div>
        </section>

        {/* 最終通告 */}
        <section className="section fade-section">
          <div className="wrap">
            <h2>最後に</h2>

            <p>
              これは優しいサービスではありません。<br />
              背中も押しません。<br />
              励ましもしません。
            </p>

            <div className="final-message">
              <strong>
                買わない自由を残すと、人は一生準備する。<br />
                買うことを束縛すると、人はようやく書き始める。
              </strong>
            </div>

            <div className="price-container" style={{ marginTop: '3rem' }}>
              <button className="cta-button glow-button" onClick={openModal}>
                <span>次は止まらない側に行く</span>
              </button>
            </div>
          </div>
        </section>

        {/* モーダル */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="modal-content">
              <button className="modal-close" onClick={closeModal}>&times;</button>

              {currentStep === 0 && (
                <div className="step-content fade-in">
                  <h3 className="question-title">
                    ここから先は<br />
                    「申し込む人を増やすためのフォーム」ではありません。
                  </h3>
                  <p>
                    合わない人は、ここで閉じることを推奨します。
                  </p>
                  <div className="answer-buttons">
                    <button className="answer-btn yes" onClick={() => nextStep(1)}>
                      ⭕ 進む
                    </button>
                    <button className="answer-btn no" onClick={closeModal}>
                      ❌ 閉じる
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="step-content fade-in">
                  <div className="step-indicator">質問 1/5</div>
                  <h3 className="question-title">
                    このシステムには、管理画面で記事を書く機能はありません。
                  </h3>
                  <div className="answer-buttons">
                    <button className="answer-btn yes" onClick={() => nextStep(2)}>
                      ⭕ Yes（理解した）
                    </button>
                    <button className="answer-btn no" onClick={showRejection}>
                      ❌ No（理解できない）
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="step-content fade-in">
                  <div className="step-indicator">質問 2/5</div>
                  <h3 className="question-title">
                    構造・機能・運用フローについて、<br />
                    あとから変更や相談はできません。
                  </h3>
                  <div className="answer-buttons">
                    <button className="answer-btn yes" onClick={() => nextStep(3)}>
                      ⭕ Yes（それでいい）
                    </button>
                    <button className="answer-btn no" onClick={showRejection}>
                      ❌ No（自由が欲しい）
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="step-content fade-in">
                  <div className="step-indicator">質問 3/5</div>
                  <h3 className="question-title">
                    更新が止まった場合、<br />
                    それは「設計の問題」であり、<br />
                    あなた自身を責めないと約束できますか。
                  </h3>
                  <div className="answer-buttons">
                    <button className="answer-btn yes" onClick={() => nextStep(4)}>
                      ⭕ Yes（設計に責任を預ける）
                    </button>
                    <button className="answer-btn no" onClick={showRejection}>
                      ❌ No（自分でコントロールしたい）
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="step-content fade-in">
                  <div className="step-indicator">質問 4/5</div>
                  <h3 className="question-title">
                    10万円は「制作費」ではなく、<br />
                    自由を手放すための費用です。
                  </h3>
                  <div className="answer-buttons">
                    <button className="answer-btn yes" onClick={() => nextStep(5)}>
                      ⭕ Yes（理解した）
                    </button>
                    <button className="answer-btn no" onClick={showRejection}>
                      ❌ No（納得できない）
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="step-content fade-in">
                  <div className="step-indicator">最終確認 5/5</div>
                  <h3 className="question-title">
                    それでも申し込みますか。
                  </h3>
                  <div className="answer-buttons">
                    <button className="answer-btn yes" onClick={showFinalCTA}>
                      ⭕ Yes（戻らない）
                    </button>
                    <button className="answer-btn no" onClick={closeModal}>
                      ❌ No（今回はやめる）
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 100 && (
                <div className="step-content fade-in">
                  <h3 className="question-title">
                    すべての質問に同意されました。
                  </h3>
                  <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    下記より申込手続きにお進みください。
                  </p>
                  <div className="final-cta">
                    <a
                      href="mailto:product@newaddr.com?subject=Webサイト生成システム申込"
                      className="final-cta-button"
                    >
                      申込手続きに進む
                    </a>
                  </div>
                </div>
              )}

              {currentStep === 99 && (
                <div className="step-content fade-in">
                  <div className="rejection-message">
                    <h3>この商品は向いていません</h3>
                    <p>
                      ご理解いただきありがとうございました。<br />
                      またの機会がありましたら、お待ちしております。
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                      <button className="answer-btn no" onClick={closeModal} style={{ maxWidth: '200px', margin: '0 auto' }}>
                        閉じる
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .lp-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          line-height: 1.7;
          color: #e0e0e0;
          background: #0a0a0a;
          overflow-x: hidden;
          position: relative;
          min-height: 100vh;
        }

        /* パーティクル背景 */
        .particle-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        /* スキャンライン */
        .scanline-overlay {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(
            to bottom,
            rgba(124, 58, 237, 0.03) 1px,
            transparent 1px
          );
          background-size: 100% 4px;
          opacity: 0.5;
          pointer-events: none;
          z-index: 1;
          animation: scanline 8s linear infinite;
        }

        .section {
          padding: 5rem 1.5rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          position: relative;
        }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .fade-section {
          opacity: 0;
          animation: fadeInUp 0.8s ease forwards;
        }

        .fade-section:nth-of-type(2) { animation-delay: 0.1s; }
        .fade-section:nth-of-type(3) { animation-delay: 0.2s; }
        .fade-section:nth-of-type(4) { animation-delay: 0.3s; }

        .wrap {
          max-width: 900px;
          margin: 0 auto;
        }

        .main-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          line-height: 1.2;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #7c3aed, #22c55e, #3b82f6);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }

        h2 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          margin-bottom: 1.5rem;
          color: #ffffff;
          position: relative;
        }

        h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, transparent);
        }

        p {
          font-size: 1.125rem;
          margin-bottom: 1.25rem;
        }

        .lead {
          font-size: 1.25rem;
          color: #94a3b8;
          line-height: 1.6;
          animation: fadeInUp 0.8s ease 0.3s forwards;
          opacity: 0;
        }

        .fade-in {
          animation: fadeInUp 0.8s ease 0.5s forwards;
          opacity: 0;
        }

        .pulse-text {
          animation: pulse 2s ease-in-out infinite;
          display: inline-block;
        }

        .emphasis-text {
          font-size: 1.3rem;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
        }

        .note {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        .box {
          padding: 1.5rem;
          background: rgba(124, 58, 237, 0.1);
          border-left: 4px solid #7c3aed;
          border-radius: 8px;
          margin: 2rem 0;
          position: relative;
          overflow: hidden;
        }

        /* 全てのボックスに光を走らせる */
        .box::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.15), transparent);
          animation: scanline 4s linear infinite;
          pointer-events: none;
        }

        .scan-box {
          border: 1px solid rgba(124, 58, 237, 0.3);
        }

        /* scan-boxはより強い光 */
        .scan-box::after {
          background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.3), transparent);
          animation: scanline 3s linear infinite;
        }

        .emphasis-box {
          background: rgba(239, 68, 68, 0.1);
          border-left-color: #ef4444;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
        }

        /* emphasis-boxは赤い光 */
        .emphasis-box::after {
          background: linear-gradient(180deg, transparent, rgba(239, 68, 68, 0.2), transparent);
          animation: scanline 3.5s linear infinite;
        }

        .flow-box {
          background: rgba(34, 197, 94, 0.1);
          border-left-color: #22c55e;
          text-align: center;
          font-size: 1.1rem;
          line-height: 2;
        }

        /* flow-boxは緑の光 */
        .flow-box::after {
          background: linear-gradient(180deg, transparent, rgba(34, 197, 94, 0.2), transparent);
          animation: scanline 4.5s linear infinite;
        }

        .box strong {
          color: #ffffff;
        }

        ul {
          padding-left: 1.5rem;
          margin: 1.5rem 0;
        }

        li {
          margin-bottom: 0.75rem;
          font-size: 1.0625rem;
          position: relative;
        }

        li::before {
          content: '▹';
          position: absolute;
          left: -1.5rem;
          color: #7c3aed;
          font-weight: bold;
        }

        .price-container {
          text-align: center;
          margin: 3rem 0;
        }

        .price {
          font-size: 4rem;
          font-weight: bold;
          background: linear-gradient(135deg, #7c3aed, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          animation: pulse 3s ease-in-out infinite;
        }

        .cta-button {
          display: inline-block;
          padding: 1.25rem 3rem;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
          position: relative;
          overflow: hidden;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .glow-button {
          animation: glowPulse 2s ease-in-out infinite;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-button:hover::before {
          opacity: 1;
        }

        .cta-button span {
          position: relative;
          z-index: 1;
        }

        .cta-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124, 58, 237, 0.6);
        }

        .danger {
          font-weight: bold;
          color: #ef4444;
        }

        .success {
          font-weight: bold;
          color: #22c55e;
        }

        strong {
          color: #ffffff;
        }

        hr {
          border: none;
          border-top: 1px solid rgba(148, 163, 184, 0.2);
          margin: 3rem 0;
        }

        .final-message {
          background: rgba(124, 58, 237, 0.15);
          padding: 2rem;
          border-radius: 12px;
          border: 2px solid rgba(124, 58, 237, 0.3);
          text-align: center;
          margin-top: 3rem;
          box-shadow: 0 0 40px rgba(124, 58, 237, 0.2);
          position: relative;
          overflow: hidden;
        }

        /* final-messageにも光を走らせる */
        .final-message::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.25), transparent);
          animation: scanline 3s linear infinite;
          pointer-events: none;
        }

        /* モーダル */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          overflow-y: auto;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: rgba(15, 23, 42, 0.95);
          border: 2px solid rgba(124, 58, 237, 0.3);
          border-radius: 12px;
          padding: 3rem 2rem;
          max-width: 700px;
          width: 100%;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        /* モーダルにも光を走らせる */
        .modal-content::before {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.2), transparent);
          animation: scanline 3s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
          padding: 0.5rem;
          transition: color 0.2s;
          z-index: 10;
        }

        .modal-close:hover {
          color: #ffffff;
        }

        .step-content {
          display: block;
          position: relative;
          z-index: 1;
        }

        .question-title {
          font-size: 1.5rem;
          color: #ffffff;
          margin-bottom: 2rem;
          line-height: 1.4;
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
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .answer-btn.yes {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
          color: #22c55e;
        }

        .answer-btn.yes:hover {
          background: rgba(34, 197, 94, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
        }

        .answer-btn.no {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #ef4444;
        }

        .answer-btn.no:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
        }

        .final-cta {
          text-align: center;
        }

        .final-cta-button {
          display: inline-block;
          padding: 1.5rem 3rem;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
          text-decoration: none;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
        }

        .final-cta-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(124, 58, 237, 0.6);
        }

        .rejection-message {
          text-align: center;
          padding: 2rem;
        }

        .rejection-message h3 {
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .rejection-message p {
          color: #94a3b8;
        }

        .step-indicator {
          text-align: center;
          color: #94a3b8;
          font-size: 0.875rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .section {
            padding: 3rem 1rem;
          }

          .price {
            font-size: 3rem;
          }

          .cta-button {
            padding: 1rem 2rem;
            font-size: 1.125rem;
          }

          .answer-buttons {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
