'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// カウントアップコンポーネント
function CountUp({ end, suffix = '', decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(decimals > 0 ? parseFloat(start.toFixed(decimals)) : Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, decimals]);

  return (
    <div ref={ref} className="stat-v">
      {decimals > 0 ? count.toFixed(decimals) : count}
      {suffix}
    </div>
  );
}

export default function PageJa() {
  const { scrollYProgress } = useScroll();
  
  const yPosAnim = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgY = useTransform(yPosAnim, [0, 1], ['15%', '25%']);

  return (
    <main>
      {/* 動的背景 */}
      <motion.div
        className="bg-gradient"
        style={{
          y: bgY,
        }}
      />

      {/* Top Nav */}
      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand">
            H・M
          </a>
          <nav className="nav-links">
            <a href="#role">役割定義</a>
            <a href="#projects">実績</a>
            <a href="#skills">スキル</a>
            <a href="#contact" className="pill">
              Contact
            </a>
            <a href="/" className="lang-switch">
              EN
            </a>
          </nav>
        </div>
      </header>

      {/* Hero - 判断設計に寄せ切る */}
      <section id="top" className="hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="kicker" variants={fadeUp}>
              エンタープライズ領域の技術PM
            </motion.p>

            <motion.h1 className="hero-title" variants={fadeUp}>
              エンタープライズB2Bで、PoCで止まるプロジェクトを「意思決定の設計」から本番・運用まで前に進める技術PMです
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              「誰が何を決めるか」を先に整えると、プロジェクトは止まりにくくなる。
            </motion.p>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              現場を責めない。個人を評価しない。構造だけを見る。
            </motion.p>

            <motion.p className="lang-note" variants={fadeUp}>
              ※ 本ページは日本拠点・日本語でのコミュニケーションを想定した補足ページです。
              <a href="/">英語ページ</a>がメインの職務定義となります。
            </motion.p>

            <motion.div className="cta" variants={fadeUp}>
              <a className="btn primary pulse" href="mailto:xzengbu@gmail.com">
                面談を依頼する
              </a>
              <a className="btn ghost" href="#projects">
                代表実績を見る →
              </a>
              <a className="btn ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </motion.div>

            {/* Operational Highlights - 前面独立表示 */}
            <motion.div className="operational-highlights" variants={fadeUp}>
              <div className="op-header">運用実績（本番稼働）</div>
              <div className="stats-operational">
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">19日以上</div>
                  <div className="stat-l">統合コントローラを継続運用（停止・張り付き運用を削減）</div>
                </motion.div>
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">50+モジュール</div>
                  <div className="stat-l">50+モジュールを自動制御（手動介入ゼロ）</div>
                </motion.div>
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">本番運用</div>
                  <div className="stat-l">障害の波及を防ぐ設計（隔離 / Circuit Breaker）</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Traditional Stats */}
            <motion.div className="stats" variants={fadeUp}>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={17} suffix="年" />
                <div className="stat-l">エンタープライズPM経験</div>
              </motion.div>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={21} suffix="品番" />
                <div className="stat-l">同時立上げ（最大規模）</div>
              </motion.div>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={11} suffix="ヶ月" />
                <div className="stat-l">24/7本番運用（連続稼働）</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Role Clarification - なぜ判断設計が必要か */}
      <section id="role" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              なぜ「判断設計」が必要なのか
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              技術だけでは、プロダクトは前に進まない
            </motion.p>

            <motion.div className="not-optimize-grid" variants={stagger}>
              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">進捗管理ツールのマイクロマネジメント</div>
                <p className="muted">
                  私がプロジェクトを管理する手段は、意思決定の明確化と責任設計です。ツールは認知負荷を下げる場合にのみ導入します。
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">速度だけを追う、運用責任のないデリバリー</div>
                <p className="muted">
                  私は要件の曖昧さから本番運用まで責任を持ちます。デリバリー速度は、本番で動かなければ意味がありません。
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">本番移行意図のないPoC</div>
                <p className="muted">
                  すべての技術判断は本番運用を前提に行います。運用可能性設計のないPoCはリソースの無駄です。
                </p>
              </motion.div>
            </motion.div>

            <motion.div className="pm-clarification" variants={fadeUp}>
              <div className="pm-clarification-inner">
                <div className="pm-icon">💡</div>
                <div>
                  <div className="pm-clarification-title">私のPMアプローチ</div>
                  <p className="pm-clarification-text">
                    私の軸は「進捗の管理」ではなく「判断が前に進む構造の設計」です。何を決めるべきか／誰が決めるか／決めない場合の既定値を先に定義し、技術的に完成した後に止まるプロジェクトを止めにくくします。
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div className="japan-context" variants={fadeUp}>
              <div className="japan-context-inner">
                <div className="japan-context-title">🇯🇵 日本企業との仕事で大切にしていること</div>
                <p className="japan-context-text">
                  製造業17年の経験から、「失敗が許されない制約」「0.01mmの精度要求」「複数部門の調整」といった、日本のエンタープライズ特有の難しさを理解しています。
                  <br /><br />
                  技術だけでなく、現場の空気・組織の力学・暗黙の合意形成プロセスまで見通して意思決定できることが、私の強みです。
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects - 代表3件（Problem/Action/Result型） */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              代表実績
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              課題 → 判断 → 結果
            </motion.p>

            <motion.div className="grid" variants={stagger}>
              {/* Case 1: Manufacturing B2B */}
              <motion.article
                className="card"
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-head">
                  <h3 className="project-title">医療機器メーカー向け新製品立上げPM（21品番同時管理）</h3>
                  <span className="badge">enterprise</span>
                </div>

                <div className="case-block">
                  <div className="case-label">課題</div>
                  <p className="case-text">
                    21品番の同時立上げが、5社のステークホルダー間の要件対立により停滞。仕様変更が納期とコストを圧迫。
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">判断</div>
                  <p className="case-text">
                    品質基準を3段階（必須/推奨/理想）に分け、変更影響を局所化。ステークホルダー調整を単一窓口化し、承認速度を3倍化。
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">結果</div>
                  <ul className="list">
                    <li>納期遵守率100%を17ヶ月維持（遅延ゼロ）</li>
                    <li>仕様変更件数を30%削減</li>
                    <li>17年キャリアで最大規模のプロジェクト</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">要件定義</span>
                  <span className="tag">ステークホルダー調整</span>
                  <span className="tag">リスク管理</span>
                </div>
              </motion.article>

              {/* Case 2: Automation Platform */}
              <motion.article
                className="card"
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-head">
                  <h3 className="project-title">54サイト統合スクレイピング基盤（24/7運用11ヶ月）</h3>
                  <span className="badge">product</span>
                </div>

                <div className="case-block">
                  <div className="case-label">課題</div>
                  <p className="case-text">
                    54のECサイト手動監視が年間1,000時間以上を消費。過去のPoC実装は運用複雑性により本番化に失敗。
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">判断</div>
                  <p className="case-text">
                    初日から障害隔離を前提に設計。SQLite WALで復旧速度を優先。品質基準を「見逃し許容・誤検知最小」と定義。
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">結果</div>
                  <ul className="list">
                    <li>稼働率99.8%で11ヶ月連続運用</li>
                    <li>年間1,000時間以上の工数削減（月72万円相当）</li>
                    <li>54サイト統合 / 月10万件+処理</li>
                  </ul>
                </div>

                <div className="project-links">
                  <a
                    href="https://github.com/rancorder/master_controller"
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    GitHub →
                  </a>
                </div>

                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">SQLite(WAL)</span>
                  <span className="tag">24/7運用</span>
                </div>
              </motion.article>

              {/* Case 3: Multi-stakeholder */}
              <motion.article
                className="card"
                variants={fadeUp}
                whileHover={{
                  y: -8,
                  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-head">
                  <h3 className="project-title">家電メーカー向けプロダクト仕様策定PM</h3>
                  <span className="badge">enterprise</span>
                </div>

                <div className="case-block">
                  <div className="case-label">課題</div>
                  <p className="case-text">
                    家電製品の仕様が部門間の優先順位対立でデッドロック。曖昧な要件が高コストな設計変更とスケジュール遅延を発生。
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">判断</div>
                  <p className="case-text">
                    要件を「今決めるべき」と「後回しでよい」に分類し、無駄な議論を削減。変更影響を3段階評価（軽微/中程度/重大）し、受け入れ基準を明確化。
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">結果</div>
                  <ul className="list">
                    <li>仕様変更による遅延0件を14ヶ月維持</li>
                    <li>設計変更コスト60%削減</li>
                    <li>ステークホルダー満足度85%以上を継続達成</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">仕様策定</span>
                  <span className="tag">合意形成</span>
                  <span className="tag">変更管理</span>
                </div>
              </motion.article>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills - 役割ベース */}
      <section id="skills" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              スキル
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              ツールリストではなく、役割ベースの能力
            </motion.p>

            <motion.div className="grid skills" variants={stagger}>
              {/* Project & Decision Design */}
              <motion.div
                className="card"
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="mini-title">プロジェクト・意思決定設計</div>
                <ul className="list">
                  <li>曖昧な要件の明確化</li>
                  <li>意思決定権限・責任の設計</li>
                  <li>部門横断のステークホルダー調整</li>
                  <li>トレードオフ設計（速度×品質×コスト）</li>
                </ul>
              </motion.div>

              {/* Operational & Technical Context */}
              <motion.div
                className="card"
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="mini-title">運用・技術文脈の理解</div>
                <ul className="list">
                  <li>長期稼働する自動化システム（11ヶ月+連続運用）</li>
                  <li>監視・障害隔離・サーキットブレーカー</li>
                  <li>本番前提の設計レビュー</li>
                  <li>製造業精度（0.01mm）× Tech速度（24/7）の両立</li>
                </ul>
              </motion.div>

              {/* Tools */}
              <motion.div
                className="card"
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="mini-title">ツール</div>
                <ul className="list">
                  <li>Python, FastAPI, React, TypeScript, Next.js</li>
                  <li>Docker, Linux, PostgreSQL, Redis, SQLite</li>
                  <li>pytest, k6, Prometheus, Grafana</li>
                  <li>Azure, Git, Azure DevOps</li>
                </ul>
              </motion.div>
            </motion.div>

            {/* ツール問題の先回り */}
            <motion.div className="tool-approach" variants={fadeUp}>
              <div className="tool-approach-inner">
                <div className="tool-approach-icon">🛠️</div>
                <div>
                  <div className="tool-approach-title">プロジェクト管理ツールについて</div>
                  <p className="tool-approach-text">
                    なお、進捗管理や課題管理については、ツール運用そのものよりも「判断と合意が前に進む構造」を優先して設計してきました。
                    結果として、Excel / チケット管理 / 独自運用など、プロジェクト特性に応じた手法を選択しています。
                    必要に応じて、Jira / Azure DevOps などの運用にも短期間で適応できます。
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 日本向け注釈 */}
      <section className="section japan-note-section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div className="japan-note-card" variants={fadeUp}>
              <p className="japan-note-text">
                ※ 日本企業・日本拠点のプロジェクトにおいても、意思決定構造・責任設計の考え方は同様に適用しています。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact - 日本語CTA */}
      <section id="contact" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              技術的には完成しているが、本番に移せないプロジェクトがあれば
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              まずは状況の整理からでも、お話しできます
            </motion.p>

            <motion.div className="contact-card" variants={fadeUp}>
              <div className="contact-left">
                <div className="mini-title">Contact</div>
                <p className="muted">
                  プロジェクトの状況（ざっくりでOK）を添えてもらえると、話が早いです。
                  <br />
                  製造業PM × 技術PMの両面から、最適な進め方を提案します。
                </p>
              </div>
              <div className="contact-right">
                <a className="btn primary pulse" href="mailto:xzengbu@gmail.com">
                  xzengbu@gmail.com
                </a>
                <a className="btn ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                  GitHubを見る
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="muted">© {new Date().getFullYear()} H・M</span>
        </div>
      </footer>

      {/* Styles */}
      <style jsx global>{`
        :root {
          --bg: #05070f;
          --panel: rgba(255, 255, 255, 0.06);
          --panel-2: rgba(255, 255, 255, 0.04);
          --border: rgba(255, 255, 255, 0.12);
          --text: rgba(255, 255, 255, 0.92);
          --muted: rgba(255, 255, 255, 0.68);
          --muted2: rgba(255, 255, 255, 0.55);
          --accent: #7c3aed;
          --accent2: #22c55e;
          --shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        html,
        body {
          height: 100%;
        }

        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          background: radial-gradient(1200px 800px at 15% 10%, rgba(124, 58, 237, 0.22), transparent 60%),
            radial-gradient(900px 700px at 80% 25%, rgba(34, 197, 94, 0.16), transparent 55%);
          animation: gradientShift 15s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .container {
          width: min(1100px, calc(100% - 40px));
          margin: 0 auto;
        }

        .muted {
          color: var(--muted);
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(12px) saturate(180%);
          background: rgba(5, 7, 15, 0.7);
          border-bottom: 1px solid var(--border);
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
        }

        .brand {
          font-weight: 800;
          letter-spacing: 0.3px;
          transition: color 0.2s ease;
        }

        .brand:hover {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          gap: 16px;
          align-items: center;
          color: var(--muted);
          font-size: 14px;
        }

        .nav-links a {
          transition: color 0.2s ease;
        }

        .nav-links a:hover {
          color: var(--text);
        }

        .pill {
          padding: 8px 14px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--panel-2);
          transition: all 0.2s ease;
        }

        .pill:hover {
          background: var(--panel);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .lang-switch {
          padding: 8px 14px;
          border: 1px solid var(--accent);
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.1);
          color: var(--accent);
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .lang-switch:hover {
          background: rgba(124, 58, 237, 0.2);
          border-color: var(--accent);
        }

        .hero {
          padding: 100px 0 60px;
        }

        .kicker {
          margin: 0 0 12px;
          font-weight: 700;
          color: var(--muted2);
          font-size: 15px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(28px, 3.2vw, 48px);
          line-height: 1.2;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text), rgba(255, 255, 255, 0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          margin: 20px 0 0;
          font-size: 14px;
          color: var(--muted2);
          line-height: 1.6;
          font-style: italic;
        }

        .lang-note {
          margin: 20px 0 0;
          font-size: 13px;
          color: var(--muted2);
          line-height: 1.6;
          padding: 12px;
          background: rgba(124, 58, 237, 0.08);
          border-left: 3px solid var(--accent);
          border-radius: 4px;
        }

        .lang-note a {
          color: var(--accent);
          text-decoration: underline;
        }

        .cta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 46px;
          padding: 0 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--panel-2);
          color: var(--text);
          font-weight: 700;
          font-size: 14px;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
        }

        .btn:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.28);
        }

        .btn.primary {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(34, 197, 94, 0.6));
          border-color: transparent;
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.4);
        }

        .btn.primary:hover {
          box-shadow: 0 18px 60px rgba(124, 58, 237, 0.5);
        }

        .btn.pulse {
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 12px 40px rgba(124, 58, 237, 0.4);
          }
          50% {
            box-shadow: 0 18px 60px rgba(124, 58, 237, 0.6);
          }
        }

        .btn.ghost {
          background: var(--panel-2);
        }

        .operational-highlights {
          margin-top: 40px;
          padding: 32px;
          border: 2px solid rgba(124, 58, 237, 0.4);
          background: rgba(124, 58, 237, 0.08);
          border-radius: 20px;
        }

        .op-header {
          font-weight: 900;
          font-size: 14px;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 20px;
          text-align: center;
        }

        .stats-operational {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .stat-op {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 18px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          text-align: center;
        }

        .stat-op:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 32px;
        }

        .stat {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 18px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
        }

        .stat:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .stat-v {
          font-weight: 900;
          font-size: 32px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-l {
          margin-top: 8px;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .section {
          padding: 120px 0;
        }

        .section-title {
          margin: 0;
          font-size: 32px;
          letter-spacing: -0.01em;
          font-weight: 800;
        }

        .section-sub {
          margin: 12px 0 0;
          color: var(--muted);
          line-height: 1.7;
          font-size: 16px;
        }

        .grid {
          margin-top: 32px;
          display: grid;
          gap: 32px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .card {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .not-optimize-grid {
          margin-top: 32px;
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .pm-clarification {
          margin-top: 40px;
          padding: 32px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.06);
          border-radius: 20px;
        }

        .pm-clarification-inner {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .pm-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .pm-clarification-title {
          font-weight: 900;
          font-size: 16px;
          margin-bottom: 12px;
          color: var(--accent2);
        }

        .pm-clarification-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 14px;
        }

        .japan-context {
          margin-top: 40px;
          padding: 32px;
          border: 1px solid rgba(255, 190, 11, 0.3);
          background: rgba(255, 190, 11, 0.06);
          border-radius: 20px;
        }

        .japan-context-inner {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .japan-context-title {
          font-weight: 900;
          font-size: 16px;
          color: #ffbe0b;
        }

        .japan-context-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 14px;
        }

        .tool-approach {
          margin-top: 40px;
          padding: 32px;
          border: 1px solid rgba(124, 58, 237, 0.3);
          background: rgba(124, 58, 237, 0.06);
          border-radius: 20px;
        }

        .tool-approach-inner {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .tool-approach-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .tool-approach-title {
          font-weight: 900;
          font-size: 16px;
          margin-bottom: 12px;
          color: var(--accent);
        }

        .tool-approach-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 14px;
        }

        .japan-note-section {
          padding: 60px 0;
        }

        .japan-note-card {
          padding: 24px 32px;
          border: 1px solid rgba(255, 190, 11, 0.3);
          background: rgba(255, 190, 11, 0.06);
          border-radius: 16px;
          text-align: center;
        }

        .japan-note-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 14px;
          font-style: italic;
        }

        .project-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .project-title {
          margin: 0;
          font-size: 18px;
          line-height: 1.4;
          font-weight: 700;
        }

        .badge {
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--muted);
          background: rgba(255, 255, 255, 0.04);
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .case-block {
          margin-top: 20px;
        }

        .case-label {
          font-weight: 900;
          font-size: 11px;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
        }

        .case-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 13px;
        }

        .mini-title {
          font-weight: 900;
          font-size: 13px;
          color: var(--text);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .list {
          margin: 0;
          padding-left: 20px;
          color: var(--muted);
          line-height: 1.75;
          font-size: 13px;
        }

        .list li {
          margin-bottom: 8px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 20px;
        }

        .tag {
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--muted);
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }

        .tag:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .project-links {
          margin-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-link {
          font-size: 13px;
          color: var(--accent);
          font-weight: 700;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }

        .project-link:hover {
          color: var(--accent2);
          transform: translateX(4px);
        }

        .grid.skills {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .contact-card {
          margin-top: 32px;
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(34, 197, 94, 0.1));
          border-radius: 20px;
          padding: 32px;
        }

        .contact-left {
          min-width: 280px;
          flex: 1;
        }

        .contact-right {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer {
          border-top: 1px solid var(--border);
          padding: 32px 0;
          color: var(--muted);
        }

        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: 860px) {
          .stats {
            grid-template-columns: 1fr;
          }
          .stats-operational {
            grid-template-columns: 1fr;
          }
          .grid {
            grid-template-columns: 1fr;
          }
          .grid.skills {
            grid-template-columns: 1fr;
          }
          .not-optimize-grid {
            grid-template-columns: 1fr;
          }
          .nav-links {
            gap: 12px;
          }
          .section {
            padding: 80px 0;
          }
        }
      `}</style>
    </main>
  );
}
