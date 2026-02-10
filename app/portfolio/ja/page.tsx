'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';

// ============================================
// Animation Variants
// ============================================
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// Mobile Navigation Component
// ============================================
function MobileNav({ isOpen, onClose, showEnglish, toggleEnglish }: { 
  isOpen: boolean; 
  onClose: () => void;
  showEnglish: boolean;
  toggleEnglish: () => void;
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="mobile-menu"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
          <a href="/services/ja" onClick={onClose}>
            サービス
          </a>
          <a href="/blog" onClick={onClose}>
            ブログ
          </a>
          <a href="#contact" className="mobile-cta" onClick={onClose}>
            Contact
          </a>
          <button
            onClick={() => {
              toggleEnglish();
              onClose();
            }}
            className="mobile-lang"
          >
            {showEnglish ? '日本語のみ表示 🇯🇵' : '英語も表示 🌐'}
          </button>
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
  const [showEnglish, setShowEnglish] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const yPosAnim = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgY = useTransform(yPosAnim, [0, 1], ['15%', '25%']);

  return (
    <main>
      {/* Dynamic Background */}
      <motion.div className="bg-gradient" style={{ y: bgY }} />

      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />

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
            <a href="/services/ja">サービス</a>
            <a href="/blog">ブログ</a>
            <a href="#contact" className="pill">
              Contact
            </a>
            <button 
              onClick={() => setShowEnglish(!showEnglish)}
              className="lang-switch"
              style={{ 
                cursor: 'pointer', 
                border: 'none', 
                background: 'transparent',
                padding: '8px 12px',
                fontSize: '14px',
                color: showEnglish ? 'var(--accent)' : 'var(--muted)',
                transition: 'color 0.2s ease',
              }}
            >
              {showEnglish ? '日本語のみ 🇯🇵' : 'EN 🌐'}
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
            <span className={mobileMenuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        showEnglish={showEnglish}
        toggleEnglish={() => setShowEnglish(!showEnglish)}
      />

      {/* Hero */}
      <section id="top" className="hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="kicker" variants={fadeUp}>
              Technical PM for Enterprise Systems
            </motion.p>

            <motion.h1 className="hero-title" variants={fadeUp}>
              意思決定を設計し、
              <br />
              エンタープライズシステムを本番に進める
              
              {showEnglish && (
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.5em', 
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginTop: '20px',
                  fontWeight: 400,
                  lineHeight: 1.4
                }}>
                  I design decisions and move enterprise systems to production
                </span>
              )}
            </motion.h1>

            <motion.p className="hero-desc" variants={fadeUp}>
              技術的には完成しているのに、本番に進められない。
              <br />
              この停滞を解消するのが、私の役割です。
              
              {showEnglish && (
                <span style={{ 
                  display: 'block', 
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginTop: '16px',
                  fontSize: '0.9em'
                }}>
                  Technically complete, but can't move to production.
                  <br />
                  Resolving this stagnation is my role.
                </span>
              )}
            </motion.p>

            <motion.div className="hero-cta" variants={fadeUp}>
              <a href="#contact" className="btn primary pulse">
                プロジェクトについて相談する
                {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.8 }}>Discuss Your Project</span>}
              </a>
              <a href="#projects" className="btn ghost">
                実績を見る
                {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.8 }}>View Projects</span>}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Role Definition */}
      <section id="role" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              私の役割
              {showEnglish && <span style={{ fontSize: '0.6em', color: 'var(--muted)', marginLeft: '16px', fontWeight: 400 }}>My Role</span>}
            </motion.h2>

            <motion.p className="section-sub" variants={fadeUp}>
              エンタープライズPM × 本番運用設計
              {showEnglish && <span style={{ display: 'block', fontSize: '0.9em', color: 'var(--muted2)', marginTop: '8px' }}>Enterprise PM × Production Operations Design</span>}
            </motion.p>

            <motion.div className="grid" variants={stagger}>
              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">
                  意思決定の構造設計
                  {showEnglish && <div style={{ fontSize: '0.85em', color: 'var(--muted2)', marginTop: '4px', textTransform: 'none' }}>Decision Architecture Design</div>}
                </div>
                <p className="muted">
                  判断できない状態を、判断できる状態に変える設計。
                  技術選定、優先順位、Go/No-Goの基準を、ステークホルダー全員が納得できる形で整理します。
                  {showEnglish && (
                    <span style={{ display: 'block', marginTop: '12px', fontSize: '0.95em', opacity: 0.7 }}>
                      Transform indecision into clear decisions. Organize tech selection, priorities, and Go/No-Go criteria in a way all stakeholders can agree on.
                    </span>
                  )}
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">
                  本番を前提にした実装
                  {showEnglish && <div style={{ fontSize: '0.85em', color: 'var(--muted2)', marginTop: '4px', textTransform: 'none' }}>Production-First Implementation</div>}
                </div>
                <p className="muted">
                  PoCで終わらせず、本番に耐える設計を最初から組み込む。
                  監視、ログ、障害対応、デグレ防止など、運用フェーズで起きる問題を事前に設計段階で潰します。
                  {showEnglish && (
                    <span style={{ display: 'block', marginTop: '12px', fontSize: '0.95em', opacity: 0.7 }}>
                      Don't stop at PoC—build production-ready from the start. Design monitoring, logging, incident response, and regression prevention upfront.
                    </span>
                  )}
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">
                  責任境界の明確化
                  {showEnglish && <div style={{ fontSize: '0.85em', color: 'var(--muted2)', marginTop: '4px', textTransform: 'none' }}>Clear Responsibility Boundaries</div>}
                </div>
                <p className="muted">
                  誰が、どこまで、どう対応するか。
                  曖昧な責任設計は、本番リリース時の最大のボトルネックです。
                  これを明確にすることで、チーム全体が安心して前に進めるようにします。
                  {showEnglish && (
                    <span style={{ display: 'block', marginTop: '12px', fontSize: '0.95em', opacity: 0.7 }}>
                      Who, what scope, how to respond. Ambiguous responsibilities are the biggest bottleneck at production release. Clarify this so the whole team can move forward confidently.
                    </span>
                  )}
                </p>
              </motion.div>
            </motion.div>

            {/* Clarification Box */}
            <motion.div className="clarification-box" variants={fadeUp}>
              <div className="clarification-inner">
                <div className="clarification-icon">💡</div>
                <div>
                  <div className="clarification-title">
                    補足：「判断の設計」とは
                    {showEnglish && <span style={{ fontSize: '0.8em', color: 'var(--muted2)', marginLeft: '12px', fontWeight: 400 }}>What is "Decision Design"?</span>}
                  </div>
                  <p className="clarification-text">
                    多くのプロジェクトは、技術的には可能でも、
                    「誰がGOを出すのか」「どの基準で判断するのか」が曖昧なまま進み、最後に止まります。
                    私がやるのは、この判断構造そのものを設計すること。
                    技術的な実装よりも先に、意思決定のフローを整えます。
                    {showEnglish && (
                      <span style={{ display: 'block', marginTop: '12px', fontSize: '0.95em', opacity: 0.7 }}>
                        Many projects are technically feasible but stall because "who gives the GO" and "what criteria to use" remain unclear. What I do is design this decision structure itself. Before technical implementation, I organize the decision-making flow.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              主な実績
              {showEnglish && <span style={{ fontSize: '0.6em', color: 'var(--muted)', marginLeft: '16px', fontWeight: 400 }}>Key Projects</span>}
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              本番前提の実装
              {showEnglish && <span style={{ display: 'block', fontSize: '0.9em', color: 'var(--muted2)', marginTop: '8px' }}>Production-First Implementation</span>}
            </motion.p>

            <motion.div className="grid projects" variants={stagger}>
              {/* Project 1 */}
              <motion.div className="card project-card" variants={fadeUp}>
                <div className="project-head">
                  <h3 className="project-title">
                    統合スクレイピング・監視基盤
                    {showEnglish && <div style={{ fontSize: '0.75em', color: 'var(--muted2)', marginTop: '8px', fontWeight: 400 }}>Unified Scraping & Monitoring Platform</div>}
                  </h3>
                  <span className="badge">Production</span>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    課題
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Challenge</span>}
                  </div>
                  <p className="case-text">
                    54サイト、不統一なHTML、頻繁なレイアウト変更
                    {showEnglish && (
                      <span style={{ display: 'block', marginTop: '8px', opacity: 0.7 }}>
                        54 sites, inconsistent HTML, frequent layout changes
                      </span>
                    )}
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    実施内容
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Actions Taken</span>}
                  </div>
                  <ul className="list">
                    <li>長期運用を前提とした構造設計（壊れ方を先に決める）</li>
                    <li>障害検知・自動復旧・異常判定の3層監視設計</li>
                    <li>段階的スケーリング戦略（1サイト→5→43の段階実装）</li>
                    {showEnglish && (
                      <>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Designed long-term operational structure (decide how it breaks first)</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>3-tier monitoring: fault detection, auto-recovery, anomaly determination</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Phased scaling strategy (1 site → 5 → 43)</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    成果
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Results</span>}
                  </div>
                  <ul className="list">
                    <li>6ヶ月連続で障害ゼロ（自動復旧率99.8%）</li>
                    <li>レイアウト変更対応時間を3日→30分に短縮</li>
                    {showEnglish && (
                      <>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>6 consecutive months of zero incidents (99.8% auto-recovery rate)</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Layout change response time reduced from 3 days → 30 minutes</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">Playwright</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">Docker</span>
                  <span className="tag">Redis</span>
                </div>
              </motion.div>

              {/* Project 2 */}
              <motion.div className="card project-card" variants={fadeUp}>
                <div className="project-head">
                  <h3 className="project-title">
                    製造業DX：新卒採用システム刷新PM
                    {showEnglish && <div style={{ fontSize: '0.75em', color: 'var(--muted2)', marginTop: '8px', fontWeight: 400 }}>Manufacturing DX: Graduate Recruitment System Renewal PM</div>}
                  </h3>
                  <span className="badge">Enterprise</span>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    課題
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Challenge</span>}
                  </div>
                  <p className="case-text">
                    10年前のASP依存、選考プロセスが複雑化、データ連携が手作業
                    {showEnglish && (
                      <span style={{ display: 'block', marginTop: '8px', opacity: 0.7 }}>
                        10-year-old ASP dependency, complex selection process, manual data integration
                      </span>
                    )}
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    実施内容
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Actions Taken</span>}
                  </div>
                  <ul className="list">
                    <li>業務フローの可視化（As-Is → To-Be マッピング）</li>
                    <li>SaaS選定・カスタマイズ不要の要件整理</li>
                    <li>段階的移行計画（旧システム並行稼働3ヶ月）</li>
                    {showEnglish && (
                      <>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Visualized business flow (As-Is → To-Be mapping)</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>SaaS selection, no-customization requirement clarification</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Phased migration plan (3-month parallel operation with old system)</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    成果
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Results</span>}
                  </div>
                  <ul className="list">
                    <li>選考プロセスの工数を40%削減</li>
                    <li>データ連携自動化により、手作業をゼロ化</li>
                    {showEnglish && (
                      <>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Reduced selection process workload by 40%</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Eliminated manual work through data integration automation</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">SaaS選定</span>
                  <span className="tag">業務フロー設計</span>
                  <span className="tag">段階的移行</span>
                  {showEnglish && (
                    <>
                      <span className="tag" style={{ opacity: 0.7 }}>SaaS Selection</span>
                      <span className="tag" style={{ opacity: 0.7 }}>Workflow Design</span>
                      <span className="tag" style={{ opacity: 0.7 }}>Phased Migration</span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Project 3 */}
              <motion.div className="card project-card" variants={fadeUp}>
                <div className="project-head">
                  <h3 className="project-title">
                    品質改善：pytest後付け導入
                    {showEnglish && <div style={{ fontSize: '0.75em', color: 'var(--muted2)', marginTop: '8px', fontWeight: 400 }}>Quality Improvement: Retrofitting pytest</div>}
                  </h3>
                  <span className="badge">Technical</span>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    課題
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Challenge</span>}
                  </div>
                  <p className="case-text">
                    テストがない約1,400行のコード、変更が怖い、リグレッションリスク
                    {showEnglish && (
                      <span style={{ display: 'block', marginTop: '8px', opacity: 0.7 }}>
                        ~1,400 lines of code without tests, afraid to change, regression risk
                      </span>
                    )}
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    実施内容
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Actions Taken</span>}
                  </div>
                  <ul className="list">
                    <li>最小コスト・最大効果のテスト設計</li>
                    <li>段階的に品質定義を「動く」から「安全に変更できる」に引き上げ</li>
                    {showEnglish && (
                      <>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Minimum-cost, maximum-impact test design</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Incrementally elevated quality definition from "works" to "safely changeable"</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label">
                    成果
                    {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em', opacity: 0.7 }}>Results</span>}
                  </div>
                  <ul className="list">
                    <li>30件のテスト実装 / カバレッジ26%</li>
                    <li>型安全性の向上（mypy strict mode適用）</li>
                    <li>リグレッションバグ検出時間を数日→数分に短縮</li>
                    {showEnglish && (
                      <>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>30 tests implemented / 26% coverage</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Improved type safety (mypy strict mode applied)</li>
                        <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Regression bug detection time reduced from days → minutes</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">pytest</span>
                  <span className="tag">mypy</span>
                  <span className="tag">coverage</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              スキルセット
              {showEnglish && <span style={{ fontSize: '0.6em', color: 'var(--muted)', marginLeft: '16px', fontWeight: 400 }}>Skills</span>}
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              技術×PM×本番運用の交差点
              {showEnglish && <span style={{ display: 'block', fontSize: '0.9em', color: 'var(--muted2)', marginTop: '8px' }}>At the intersection of Tech × PM × Production Operations</span>}
            </motion.p>

            <motion.div className="grid" variants={stagger}>
              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">
                  プロジェクトマネジメント（実務ベース）
                  {showEnglish && <div style={{ fontSize: '0.85em', color: 'var(--muted2)', marginTop: '4px', textTransform: 'none' }}>Project Management (Practice-Based)</div>}
                </div>
                <ul className="list">
                  <li>意思決定構造の設計（Go/No-Go判断基準の明確化）</li>
                  <li>責任設計・エスカレーションパスの整理</li>
                  <li>リスク管理（発生確率×影響度の定量化）</li>
                  <li>ステークホルダー調整（技術者・ビジネス・経営の通訳）</li>
                  {showEnglish && (
                    <>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Decision architecture design (clarifying Go/No-Go criteria)</li>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Responsibility design, escalation path organization</li>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Risk management (quantifying probability × impact)</li>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Stakeholder coordination (translator for engineers, business, management)</li>
                    </>
                  )}
                </ul>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">
                  システムアーキテクチャ（エンタープライズ文脈）
                  {showEnglish && <div style={{ fontSize: '0.85em', color: 'var(--muted2)', marginTop: '4px', textTransform: 'none' }}>System Architecture (Enterprise Context)</div>}
                </div>
                <ul className="list">
                  <li>システム全体設計、API設計、データ整合性</li>
                  <li>障害分離、運用制約を前提にした設計判断</li>
                  <li>技術選定（既存資産との兼ね合い、学習コスト、保守性）</li>
                  {showEnglish && (
                    <>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>System-wide design, API design, data consistency</li>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Failure isolation, design decisions based on operational constraints</li>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Technology selection (existing assets, learning cost, maintainability)</li>
                    </>
                  )}
                </ul>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">
                  本番運用設計
                  {showEnglish && <div style={{ fontSize: '0.85em', color: 'var(--muted2)', marginTop: '4px', textTransform: 'none' }}>Production Operations Design</div>}
                </div>
                <ul className="list">
                  <li>監視・ロギング・リトライ制御・サーキットブレーカー</li>
                  <li>予測可能な縮退設計（壊れ方のコントロール）</li>
                  <li>インシデント対応フロー・手順書作成</li>
                  {showEnglish && (
                    <>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Monitoring, logging, retry control, circuit breakers</li>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Predictable degradation design (controlling how it breaks)</li>
                      <li style={{ opacity: 0.7, fontSize: '0.95em' }}>Incident response flow, procedure documentation</li>
                    </>
                  )}
                </ul>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">
                  ツール
                  {showEnglish && <div style={{ fontSize: '0.85em', color: 'var(--muted2)', marginTop: '4px', textTransform: 'none' }}>Tools</div>}
                </div>
                <ul className="list">
                  <li>Python, FastAPI, React, TypeScript, Next.js</li>
                  <li>Docker, Linux, PostgreSQL, Redis, SQLite</li>
                  <li>pytest, k6, Prometheus, Grafana</li>
                  <li>Azure, Git, Azure DevOps</li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              技術的には完成しているが、本番に移せないプロジェクトがあれば
              {showEnglish && (
                <span style={{ display: 'block', fontSize: '0.5em', color: 'var(--muted)', marginTop: '16px', fontWeight: 400 }}>
                  If you have a project that's technically complete but can't move to production
                </span>
              )}
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              まずは状況の整理からでも、お話しできます
              {showEnglish && <span style={{ display: 'block', fontSize: '0.9em', color: 'var(--muted2)', marginTop: '8px' }}>We can start with just organizing the situation</span>}
            </motion.p>

            <motion.div className="contact-card" variants={fadeUp}>
              <div className="contact-left">
                <div className="mini-title">Contact</div>
                <p className="muted">
                  プロジェクトの状況（ざっくりでOK）を添えてもらえると、話が早いです。
                  <br />
                  製造業PM × 技術PMの両面から、最適な進め方を提案します。
                  {showEnglish && (
                    <span style={{ display: 'block', marginTop: '12px', opacity: 0.7 }}>
                      Tell me about your project situation (rough overview is fine) and we can discuss faster.
                      <br />
                      I'll propose the best approach from both Manufacturing PM × Technical PM perspectives.
                    </span>
                  )}
                </p>
              </div>
              <div className="contact-right">
                <a className="btn primary pulse" href="mailto:xzengbu@gmail.com">
                  xzengbu@gmail.com
                </a>
                <a className="btn ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                  GitHubを見る
                  {showEnglish && <span style={{ marginLeft: '8px', fontSize: '0.9em' }}>View GitHub</span>}
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
      {/* Global Styles - 既存スタイルを全て維持 */}
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

        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform-origin: 0%;
          z-index: 999;
        }

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

          .nav-links a,
          .nav-links button {
            transition: color 0.2s ease;
            white-space: nowrap;
            padding: 8px 12px;
            min-height: var(--touch-target);
            display: flex;
            align-items: center;
          }

          .nav-links a:hover,
          .nav-links button:hover {
            color: var(--text);
          }
        }

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

        .mobile-nav-links a,
        .mobile-nav-links button {
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
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .mobile-nav-links a:active,
        .mobile-nav-links button:active {
          transform: scale(0.98);
        }

        .mobile-nav-links a.mobile-cta {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.95), rgba(34, 197, 94, 0.6));
          border-color: transparent;
          font-weight: 700;
          margin-top: 8px;
        }

        .mobile-nav-links button.mobile-lang {
          background: rgba(124, 58, 237, 0.1);
          border-color: var(--accent);
          color: var(--accent);
          font-weight: 700;
        }

        .pill,
        .lang-switch {
          padding: 8px 14px;
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .pill {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(34, 197, 94, 0.15));
          color: var(--text);
          border-color: var(--accent);
        }

        .pill:hover {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(34, 197, 94, 0.25));
          transform: translateY(-2px);
        }

        .lang-switch {
          color: var(--muted);
        }

        .lang-switch:hover {
          color: var(--text);
          border-color: var(--text);
        }

        .hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 80px 0 60px;
          position: relative;
        }

        @media (min-width: 768px) {
          .hero {
            min-height: 100vh;
            padding: 100px 0 80px;
          }
        }

        .kicker {
          color: var(--accent);
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .kicker {
            font-size: 14px;
          }
        }

        .hero-title {
          font-size: clamp(32px, 7vw, 72px);
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 32px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.68));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 16px;
          line-height: 1.8;
          color: var(--muted);
          margin: 0 0 48px;
          max-width: 700px;
        }

        @media (min-width: 768px) {
          .hero-desc {
            font-size: 18px;
          }
        }

        .hero-cta {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .hero-cta {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 20px;
          }
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          min-height: var(--touch-target);
          text-align: center;
        }

        @media (min-width: 768px) {
          .btn {
            font-size: 16px;
          }
        }

        .btn.primary {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: white;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
        }

        .btn.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(124, 58, 237, 0.5);
        }

        .btn.primary:active {
          transform: translateY(-1px);
        }

        .btn.ghost {
          border: 2px solid var(--border);
          color: var(--text);
          background: rgba(255, 255, 255, 0.03);
        }

        .btn.ghost:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }

        .section {
          padding: 80px 0;
        }

        @media (min-width: 768px) {
          .section {
            padding: 120px 0;
          }
        }

        .section-title {
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 800;
          text-align: center;
          margin: 0 0 16px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.68));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-sub {
          text-align: center;
          font-size: 15px;
          color: var(--muted);
          margin: 0 0 64px;
        }

        @media (min-width: 768px) {
          .section-sub {
            font-size: 16px;
          }
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .card {
            padding: 32px;
          }

          .card:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow);
            border-color: rgba(255, 255, 255, 0.18);
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

        .clarification-box {
          margin-top: 64px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(34, 197, 94, 0.05));
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 16px;
          padding: 28px;
        }

        @media (min-width: 768px) {
          .clarification-box {
            padding: 40px;
          }
        }

        .clarification-inner {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .clarification-inner {
            flex-direction: row;
            gap: 24px;
          }
        }

        .clarification-icon {
          font-size: 48px;
          flex-shrink: 0;
        }

        .clarification-title {
          font-weight: 900;
          font-size: 16px;
          color: var(--accent);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (min-width: 768px) {
          .clarification-title {
            font-size: 18px;
          }
        }

        .clarification-text {
          color: var(--muted);
          line-height: 1.7;
          font-size: 14px;
        }

        @media (min-width: 768px) {
          .clarification-text {
            font-size: 15px;
          }
        }

        .grid.projects {
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .grid.projects {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .grid.projects {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .project-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .project-title {
          font-size: 18px;
          font-weight: 900;
          color: var(--text);
          flex: 1;
          min-width: 200px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 768px) {
          .project-title {
            font-size: 20px;
          }
        }

        .badge {
          font-size: 10px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(167, 139, 250, 0.2);
          color: var(--accent);
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

        .contact-card {
          max-width: 900px;
          margin: 0 auto;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .contact-card {
            flex-direction: row;
            align-items: center;
            padding: 48px;
          }
        }

        .contact-left {
          flex: 1;
        }

        .contact-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .contact-right {
            flex-direction: row;
            gap: 20px;
          }
        }

        .footer {
          padding: 40px 0;
          border-top: 1px solid var(--border);
        }

        .footer-inner {
          text-align: center;
          font-size: 14px;
          color: var(--muted2);
        }
      `}</style>
    </main>
  );
}
