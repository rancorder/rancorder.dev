'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import BlogSectionJa from '../components/BlogSectionJa';

// ============================================
// Animation Variants
// ============================================
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ============================================
// CountUp Component
// ============================================
interface CountUpProps {
  end: number;
  suffix?: string;
  decimals?: number;
}

function CountUp({ end, suffix = '', decimals = 0 }: CountUpProps) {
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

// ============================================
// Mobile Navigation Component
// ============================================
function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mobile-menu-inner">
        <nav className="mobile-nav-links">
          <a href="#role" onClick={onClose}>
            役割定義
          </a>
          <a href="#projects" onClick={onClose}>
            実績
          </a>
          <a href="#skills" onClick={onClose}>
            スキル
          </a>
          <a href="/blog" onClick={onClose}>
            ブログ
          </a>
          <a href="#contact" className="mobile-cta" onClick={onClose}>
            Contact
          </a>
          <a href="/" className="mobile-lang" onClick={onClose}>
            EN
          </a>
        </nav>
      </div>
    </motion.div>
  );
}

// ============================================
// Main Page Component
// ============================================
export default function PageJa() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const yPosAnim = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgY = useTransform(yPosAnim, [0, 1], ['15%', '25%']);

  return (
    <main>
      {/* 動的背景 */}
      <motion.div className="bg-gradient" style={{ y: bgY }} />

      {/* Top Nav */}
      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand" aria-label="Home">
            H・M
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-links" aria-label="Primary">
            <a href="#role">役割定義</a>
            <a href="#projects">実績</a>
            <a href="#skills">スキル</a>
            <a href="/blog">ブログ</a>
            <a href="#contact" className="pill">
              Contact
            </a>
            <a href="/" className="lang-switch">
              EN
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="メニューを開く"
            aria-expanded={mobileMenuOpen}
          >
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
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
                whileHover={{ y: -8 }}
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
                whileHover={{ y: -8 }}
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
                whileHover={{ y: -8 }}
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
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
                whileHover={{ y: -6 }}
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
                whileHover={{ y: -6 }}
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
                whileHover={{ y: -6 }}
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.div className="japan-note-card" variants={fadeUp}>
              <p className="japan-note-text">
                ※ 日本企業・日本拠点のプロジェクトにおいても、意思決定構造・責任設計の考え方は同様に適用しています。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blog Section - 最新の技術記事 */}
      <BlogSectionJa />

      {/* Contact - 日本語CTA */}
      <section id="contact" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
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

      {/* ============================================ */}
      {/* Global Styles - Mobile First Approach */}
      {/* ============================================ */}
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
          
          /* Touch target minimum */
          --touch-target: 44px;
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

        a {
          color: inherit;
          text-decoration: none;
        }

        /* ============================================ */
        /* Background Gradient */
        /* ============================================ */
        .bg-gradient {
          position: fixed;
          inset: 0;
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

        /* ============================================ */
        /* Container - Mobile First */
        /* ============================================ */
        .container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }

        @media (min-width: 768px) {
          .container {
            padding: 0 32px;
          }
        }

        @media (min-width: 1140px) {
          .container {
            padding: 0 40px;
          }
        }

        .muted {
          color: var(--muted);
        }

        /* ============================================ */
        /* Navigation - Mobile First */
        /* ============================================ */
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
          min-height: var(--touch-target);
        }

        .brand {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.3px;
          transition: color 0.2s ease;
          padding: 8px;
          margin: -8px;
          min-width: var(--touch-target);
          min-height: var(--touch-target);
          display: flex;
          align-items: center;
        }

        .brand:hover {
          color: var(--accent);
        }

        /* Desktop Navigation - Hidden on Mobile */
        .nav-links {
          display: none;
        }

        @media (min-width: 768px) {
          .nav-links {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;
            gap: 12px;
            color: var(--muted);
            font-size: 14px;
          }

          .nav-links a {
            transition: color 0.2s ease;
            white-space: nowrap;
            padding: 8px 12px;
            min-height: var(--touch-target);
            display: flex;
            align-items: center;
          }

          .nav-links a:hover {
            color: var(--text);
          }
        }

        /* ============================================ */
        /* Hamburger Menu - Mobile Only */
        /* ============================================ */
        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: var(--touch-target);
          height: var(--touch-target);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 21;
        }

        .hamburger span {
          width: 24px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.3s ease;
          display: block;
        }

        .hamburger span:not(:last-child) {
          margin-bottom: 5px;
        }

        .hamburger span.open:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger span.open:nth-child(2) {
          opacity: 0;
        }

        .hamburger span.open:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }
        }

        /* ============================================ */
        /* Mobile Menu Overlay */
        /* ============================================ */
        .mobile-menu {
          position: fixed;
          top: 61px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(5, 7, 15, 0.98);
          backdrop-filter: blur(20px);
          z-index: 19;
          overflow-y: auto;
        }

        .mobile-menu-inner {
          padding: 24px 20px;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-nav-links a {
          padding: 16px 20px;
          border-radius: 12px;
          background: var(--panel-2);
          border: 1px solid var(--border);
          transition: all 0.2s ease;
          min-height: var(--touch-target);
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
        }

        .mobile-nav-links a:active {
          transform: scale(0.98);
        }

        .mobile-nav-links a.mobile-cta {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(34, 197, 94, 0.6));
          border-color: transparent;
          font-weight: 700;
          margin-top: 8px;
        }

        .mobile-nav-links a.mobile-lang {
          background: rgba(124, 58, 237, 0.1);
          border-color: var(--accent);
          color: var(--accent);
          font-weight: 700;
        }

        /* ============================================ */
        /* Pills & Buttons - Desktop Only */
        /* ============================================ */
        .pill {
          padding: 8px 14px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--panel-2);
          transition: all 0.2s ease;
          white-space: nowrap;
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
          white-space: nowrap;
        }

        .lang-switch:hover {
          background: rgba(124, 58, 237, 0.2);
        }

        /* ============================================ */
        /* Hero Section - Mobile First */
        /* ============================================ */
        .hero {
          padding: 60px 0 40px;
        }

        @media (min-width: 768px) {
          .hero {
            padding: 100px 0 60px;
          }
        }

        .kicker {
          margin: 0 0 12px;
          font-weight: 700;
          color: var(--muted2);
          font-size: 13px;
        }

        @media (min-width: 768px) {
          .kicker {
            font-size: 15px;
          }
        }

        .hero-title {
          margin: 0;
          font-size: 22px;
          line-height: 1.3;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text), rgba(255, 255, 255, 0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 480px) {
          .hero-title {
            font-size: 26px;
          }
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 34px;
          }
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size: 48px;
          }
        }

        .hero-subtitle {
          margin: 16px 0 0;
          font-size: 14px;
          color: var(--muted2);
          line-height: 1.6;
          font-style: italic;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .lang-note {
          margin: 16px 0 0;
          font-size: 12px;
          color: var(--muted2);
          line-height: 1.6;
          padding: 12px;
          background: rgba(124, 58, 237, 0.08);
          border-left: 3px solid var(--accent);
          border-radius: 4px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .lang-note {
            font-size: 13px;
          }
        }

        .lang-note a {
          color: var(--accent);
          text-decoration: underline;
        }

        /* ============================================ */
        /* CTA Buttons - Mobile First */
        /* ============================================ */
        .cta {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        @media (min-width: 640px) {
          .cta {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: var(--touch-target);
          padding: 0 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--panel-2);
          color: var(--text);
          font-weight: 700;
          font-size: 14px;
          transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          white-space: nowrap;
          width: 100%;
        }

        @media (min-width: 640px) {
          .btn {
            width: auto;
          }
        }

        .btn:active {
          transform: scale(0.98);
        }

        @media (min-width: 768px) {
          .btn:hover {
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.28);
          }

          .btn:active {
            transform: translateY(-1px);
          }
        }

        .btn.primary {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(34, 197, 94, 0.6));
          border-color: transparent;
          box-shadow: 0 12px 40px rgba(124, 58, 237, 0.4);
        }

        @media (min-width: 768px) {
          .btn.primary:hover {
            box-shadow: 0 18px 60px rgba(124, 58, 237, 0.5);
          }
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

        /* ============================================ */
        /* Operational Highlights - Mobile First */
        /* ============================================ */
        .operational-highlights {
          margin-top: 32px;
          padding: 24px 20px;
          border: 2px solid rgba(124, 58, 237, 0.4);
          background: rgba(124, 58, 237, 0.08);
          border-radius: 16px;
        }

        @media (min-width: 768px) {
          .operational-highlights {
            padding: 32px;
            border-radius: 20px;
          }
        }

        .op-header {
          font-weight: 900;
          font-size: 12px;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .op-header {
            font-size: 14px;
            margin-bottom: 20px;
          }
        }

        .stats-operational {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 640px) {
          .stats-operational {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats-operational {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        .stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-top: 24px;
        }

        @media (min-width: 640px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-top: 32px;
          }
        }

        .stat,
        .stat-op {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          text-align: left;
        }

        @media (min-width: 768px) {
          .stat,
          .stat-op {
            border-radius: 18px;
            padding: 24px;
          }
        }

        .stat-op {
          text-align: center;
        }

        .stat:active,
        .stat-op:active {
          transform: scale(0.98);
        }

        @media (min-width: 768px) {
          .stat:hover,
          .stat-op:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.22);
          }

          .stat:active,
          .stat-op:active {
            transform: scale(1);
          }
        }

        .stat-v {
          font-weight: 900;
          font-size: 28px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (min-width: 768px) {
          .stat-v {
            font-size: 32px;
          }
        }

        .stat-l {
          margin-top: 8px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .stat-l {
            font-size: 13px;
          }
        }

        /* ============================================ */
        /* Section - Mobile First */
        /* ============================================ */
        .section {
          padding: 60px 0;
        }

        @media (min-width: 768px) {
          .section {
            padding: 80px 0;
          }
        }

        @media (min-width: 1024px) {
          .section {
            padding: 120px 0;
          }
        }

        .section-title {
          margin: 0;
          font-size: 24px;
          letter-spacing: -0.01em;
          font-weight: 800;
          line-height: 1.2;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 28px;
          }
        }

        @media (min-width: 1024px) {
          .section-title {
            font-size: 32px;
          }
        }

        .section-sub {
          margin: 12px 0 0;
          color: var(--muted);
          line-height: 1.7;
          font-size: 14px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .section-sub {
            font-size: 16px;
          }
        }

        /* ============================================ */
        /* Grid Layout - Mobile First */
        /* ============================================ */
        .grid {
          margin-top: 24px;
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .grid {
            margin-top: 32px;
            gap: 24px;
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 32px;
          }
        }

        .card {
          border: 1px solid var(--border);
          background: var(--panel);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .card {
            border-radius: 20px;
            padding: 32px;
          }
        }

        /* ============================================ */
        /* Not Optimize Grid - Mobile First */
        /* ============================================ */
        .not-optimize-grid {
          margin-top: 24px;
          display: grid;
          gap: 16px;
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .not-optimize-grid {
            gap: 20px;
          }
        }

        @media (min-width: 1024px) {
          .not-optimize-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
            margin-top: 32px;
          }
        }

        /* ============================================ */
        /* PM Clarification & Context Cards */
        /* ============================================ */
        .pm-clarification,
        .japan-context,
        .tool-approach {
          margin-top: 32px;
          padding: 24px 20px;
          border-radius: 16px;
        }

        @media (min-width: 768px) {
          .pm-clarification,
          .japan-context,
          .tool-approach {
            padding: 32px;
            border-radius: 20px;
            margin-top: 40px;
          }
        }

        .pm-clarification {
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.06);
        }

        .japan-context {
          border: 1px solid rgba(255, 190, 11, 0.3);
          background: rgba(255, 190, 11, 0.06);
        }

        .tool-approach {
          border: 1px solid rgba(124, 58, 237, 0.3);
          background: rgba(124, 58, 237, 0.06);
        }

        .pm-clarification-inner,
        .japan-context-inner,
        .tool-approach-inner {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .pm-clarification-inner,
          .tool-approach-inner {
            flex-direction: row;
            gap: 20px;
          }
        }

        .japan-context-inner {
          flex-direction: column;
        }

        .pm-icon,
        .tool-approach-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .pm-icon,
          .tool-approach-icon {
            font-size: 32px;
          }
        }

        .pm-clarification-title {
          font-weight: 900;
          font-size: 15px;
          margin-bottom: 12px;
          color: var(--accent2);
        }

        .japan-context-title {
          font-weight: 900;
          font-size: 15px;
          color: #ffbe0b;
        }

        .tool-approach-title {
          font-weight: 900;
          font-size: 15px;
          margin-bottom: 12px;
          color: var(--accent);
        }

        @media (min-width: 768px) {
          .pm-clarification-title,
          .japan-context-title,
          .tool-approach-title {
            font-size: 16px;
          }
        }

        .pm-clarification-text,
        .japan-context-text,
        .tool-approach-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 13px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .pm-clarification-text,
          .japan-context-text,
          .tool-approach-text {
            font-size: 14px;
          }
        }

        /* ============================================ */
        /* Japan Note Section */
        /* ============================================ */
        .japan-note-section {
          padding: 40px 0;
        }

        @media (min-width: 768px) {
          .japan-note-section {
            padding: 60px 0;
          }
        }

        .japan-note-card {
          padding: 20px 24px;
          border: 1px solid rgba(255, 190, 11, 0.3);
          background: rgba(255, 190, 11, 0.06);
          border-radius: 16px;
          text-align: center;
        }

        @media (min-width: 768px) {
          .japan-note-card {
            padding: 24px 32px;
          }
        }

        .japan-note-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 12px;
          font-style: italic;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .japan-note-text {
            font-size: 14px;
          }
        }

        /* ============================================ */
        /* Project Cards - Mobile First */
        /* ============================================ */
        .project-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .project-title {
          margin: 0;
          font-size: 16px;
          line-height: 1.4;
          font-weight: 700;
          flex: 1;
          min-width: 200px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .project-title {
            font-size: 18px;
          }
        }

        .badge {
          font-size: 10px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--muted);
          background: rgba(255, 255, 255, 0.04);
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .badge {
            font-size: 11px;
          }
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
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .case-text {
            font-size: 14px;
          }
        }

        .mini-title {
          font-weight: 900;
          font-size: 12px;
          color: var(--text);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .mini-title {
            font-size: 13px;
          }
        }

        .list {
          margin: 0;
          padding-left: 20px;
          color: var(--muted);
          line-height: 1.75;
          font-size: 13px;
        }

        @media (min-width: 768px) {
          .list {
            font-size: 14px;
          }
        }

        .list li {
          margin-bottom: 8px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }

        .tag {
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid var(--border);
          color: var(--muted);
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }

        @media (min-width: 768px) {
          .tag {
            font-size: 12px;
          }

          .tag:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.18);
          }
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
          min-height: var(--touch-target);
        }

        @media (min-width: 768px) {
          .project-link:hover {
            color: var(--accent2);
            transform: translateX(4px);
          }
        }

        /* ============================================ */
        /* Skills Grid - Mobile First */
        /* ============================================ */
        .grid.skills {
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .grid.skills {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1024px) {
          .grid.skills {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /* ============================================ */
        /* Contact Card - Mobile First */
        /* ============================================ */
        .contact-card {
          margin-top: 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          justify-content: space-between;
          flex-direction: column;
          border: 1px solid var(--border);
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(34, 197, 94, 0.1));
          border-radius: 16px;
          padding: 24px 20px;
        }

        @media (min-width: 768px) {
          .contact-card {
            flex-direction: row;
            align-items: center;
            border-radius: 20px;
            padding: 32px;
            gap: 24px;
            margin-top: 32px;
          }
        }

        .contact-left {
          flex: 1;
          min-width: 0;
        }

        .contact-right {
          display: flex;
          gap: 12px;
          flex-direction: column;
          width: 100%;
        }

        @media (min-width: 640px) {
          .contact-right {
            flex-direction: row;
            width: auto;
          }
        }

        /* ============================================ */
        /* Footer - Mobile First */
        /* ============================================ */
        .footer {
          border-top: 1px solid var(--border);
          padding: 24px 0;
          color: var(--muted);
        }

        @media (min-width: 768px) {
          .footer {
            padding: 32px 0;
          }
        }

        .footer-inner {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 13px;
        }

        @media (min-width: 768px) {
          .footer-inner {
            justify-content: space-between;
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}=