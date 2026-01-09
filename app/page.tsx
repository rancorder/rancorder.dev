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

export default function Page() {
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
            <a href="#role">Role Definition</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact" className="pill">
              Contact
            </a>
            <a href="/ja" className="lang-switch">
              JA
            </a>
          </nav>
        </div>
      </header>

      {/* Hero - EY想定版：判断設計に寄せ切る */}
      <section id="top" className="hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="kicker" variants={fadeUp}>
              Enterprise Technical Project Manager
            </motion.p>

            <motion.h1 className="hero-title" variants={fadeUp}>
              I help enterprise teams operationalize technology by clarifying decision points and removing blockers
              between PoC and stable production
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              From ambiguous requirements to stable production ownership.
            </motion.p>

            <motion.div className="cta" variants={fadeUp}>
              <a className="btn primary pulse" href="mailto:xzengbu@gmail.com">
                Schedule Conversation
              </a>
              <a className="btn ghost" href="#projects">
                View Representative Projects →
              </a>
              <a className="btn ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </motion.div>

            {/* Operational Highlights - 前面独立表示 */}
            <motion.div className="operational-highlights" variants={fadeUp}>
              <div className="op-header">Operational Highlights</div>
              <div className="stats-operational">
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">19+ days</div>
                  <div className="stat-l">Integrated automation controller running continuously</div>
                </motion.div>
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">50+ modules</div>
                  <div className="stat-l">Orchestrated with zero manual intervention</div>
                </motion.div>
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">Production</div>
                  <div className="stat-l">Failure isolation and circuit breaker design</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Traditional Stats */}
            <motion.div className="stats" variants={fadeUp}>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={17} suffix=" years" />
                <div className="stat-l">Enterprise PM Experience</div>
              </motion.div>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={21} suffix=" SKUs" />
                <div className="stat-l">Simultaneous Launch (max scale)</div>
              </motion.div>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={11} suffix=" months" />
                <div className="stat-l">24/7 Production Operation</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Role Clarification - やらないこと明示 + PM誤解防止 */}
      <section id="role" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              What I intentionally do NOT optimize for
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              Clarity on boundaries = Trust in execution
            </motion.p>

            <motion.div className="not-optimize-grid" variants={stagger}>
              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">Micromanaging task boards</div>
                <p className="muted">
                  I manage projects primarily through decision clarity and ownership design, not through excessive
                  tooling. Tools are introduced only when they reduce cognitive load.
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">Velocity-only delivery without operational ownership</div>
                <p className="muted">
                  I take responsibility from requirement ambiguity through production operation. Delivery speed means
                  nothing if systems cannot run in production.
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">PoCs with no clear production intent</div>
                <p className="muted">
                  Every technical decision is made with production operation in mind. PoCs without operational
                  feasibility design waste resources.
                </p>
              </motion.div>
            </motion.div>

            <motion.div className="pm-clarification" variants={fadeUp}>
              <div className="pm-clarification-inner">
                <div className="pm-icon">💡</div>
                <div>
                  <div className="pm-clarification-title">My PM Approach</div>
                  <p className="pm-clarification-text">
                    I manage projects primarily through decision clarity and ownership design, not through excessive
                    tooling. Tools (JIRA, Asana, etc.) are introduced only when they reduce cognitive load. My value is
                    in designing decisions that prevent projects from stalling after development is technically
                    complete.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects - 代表3件のみ（Problem/Action/Result型） */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              Representative Projects
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              Problem → Action → Result
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
                  <h3 className="project-title">Manufacturing B2B System (21 SKUs, Simultaneous Launch)</h3>
                  <span className="badge">enterprise</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">
                    21-product simultaneous launch stalled by conflicting stakeholder requirements across 5 companies.
                    Specification changes threatened delivery deadlines and escalating costs.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Designed 3-tier quality baseline (Required/Recommended/Ideal) to localize change impact. Unified
                    stakeholder coordination through single decision window, accelerating approvals by 3x.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <p className="case-text">
                    Delivered all 21 SKUs within budget and schedule with minimal post-launch defects. Achieved first
                    year sales of ¥9M+ (~$60k USD).
                  </p>
                </div>

                <div className="pm-box">
                  <div className="pm-title">PM Contributions</div>
                  <ul className="pm-list">
                    <li>Cross-company specification arbitration and approval design</li>
                    <li>Change control framework enabling rapid pivots</li>
                    <li>Quality baseline tier definition (Required/Recommended/Ideal)</li>
                  </ul>
                </div>

                <div className="two-col">
                  <div>
                    <div className="mini-title">Technical Components</div>
                    <div className="tags">
                      <span className="tag">B2B Portal</span>
                      <span className="tag">Order Management</span>
                      <span className="tag">Approval Workflow</span>
                      <span className="tag">Notification System</span>
                    </div>
                  </div>
                  <div>
                    <div className="mini-title">Stakeholders Managed</div>
                    <div className="tags">
                      <span className="tag">5 Partner Companies</span>
                      <span className="tag">Dev/QA/Design</span>
                      <span className="tag">Marketing/Sales</span>
                    </div>
                  </div>
                </div>
              </motion.article>

              {/* Case 2: Master Controller */}
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
                  <h3 className="project-title">Master Controller (43-Site Industrial Monitoring)</h3>
                  <span className="badge">infrastructure</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">
                    43-site industrial monitoring required 24/7 manual supervision. Critical failures (power outages,
                    floods) escalated without proactive detection. Annual network costs exceeded ¥20M (~$135k USD).
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Built unified controller orchestrating 50+ monitoring modules with zero-downtime failover design.
                    Implemented preemptive alert system with circuit breaker pattern to prevent alert storms.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <p className="case-text">
                    Sustained 99.9% uptime with zero manual interventions. Reduced network costs from ¥20M to ¥4.4M
                    (-78%) while eliminating 24/7 staffing requirements.
                  </p>
                </div>

                <div className="pm-box">
                  <div className="pm-title">PM Contributions</div>
                  <ul className="pm-list">
                    <li>Unified orchestration controller design ensuring <0.01% operational failure rate</li>
                    <li>Budget optimization: negotiated -78% network cost reduction (¥20M→¥4.4M)</li>
                    <li>Runbook automation: transitioned from 24/7 manual monitoring to lights-out operation</li>
                  </ul>
                </div>

                <div className="two-col">
                  <div>
                    <div className="mini-title">Technologies Used</div>
                    <div className="tags">
                      <span className="tag">Python/FastAPI</span>
                      <span className="tag">PostgreSQL</span>
                      <span className="tag">Docker</span>
                      <span className="tag">Grafana</span>
                      <span className="tag">LINE Notify</span>
                    </div>
                  </div>
                  <div>
                    <div className="mini-title">Operational Metrics</div>
                    <div className="tags">
                      <span className="tag">99.9% Uptime</span>
                      <span className="tag">43 Sites</span>
                      <span className="tag">50+ Modules</span>
                    </div>
                  </div>
                </div>

                <div className="project-links">
                  <a href="https://github.com/rancorder/master-controller" target="_blank" rel="noreferrer" className="project-link">
                    View on GitHub →
                  </a>
                  <a href="https://qiita.com/rancorder" target="_blank" rel="noreferrer" className="project-link">
                    Technical Write-up (Qiita) →
                  </a>
                </div>
              </motion.article>

              {/* Case 3: QA Automation Framework */}
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
                  <h3 className="project-title">QA Automation Framework (AI-Integrated SCM Platform)</h3>
                  <span className="badge">qa/automation</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">
                    Manual E2E testing required 8 hours per cycle. Critical regressions reached production. Test
                    maintainability collapsed as system evolved.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Built Playwright-based automation suite with CI/CD integration, coverage tracking, and automatic
                    failure analysis. Architected for maintainability with Page Object Model and fixture-based design.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <p className="case-text">
                    Automated 52 critical test scenarios with 90% coverage. Reduced E2E test cycle from 8 hours to 12
                    minutes (~40x faster), cutting QA costs by 80% while improving defect detection.
                  </p>
                </div>

                <div className="pm-box">
                  <div className="pm-title">PM Contributions</div>
                  <ul className="pm-list">
                    <li>Test strategy design: prioritized critical paths yielding 90% coverage with 52 scenarios</li>
                    <li>CI/CD pipeline integration with failure isolation and automatic regression tracking</li>
                    <li>Maintainability architecture: Page Object Model + fixture-based design for evolving systems</li>
                  </ul>
                </div>

                <div className="two-col">
                  <div>
                    <div className="mini-title">Stack</div>
                    <div className="tags">
                      <span className="tag">Playwright</span>
                      <span className="tag">TypeScript</span>
                      <span className="tag">GitHub Actions</span>
                      <span className="tag">Codecov</span>
                    </div>
                  </div>
                  <div>
                    <div className="mini-title">Metrics</div>
                    <div className="tags">
                      <span className="tag">52 Test Cases</span>
                      <span className="tag">90% Coverage</span>
                      <span className="tag">40x Faster</span>
                    </div>
                  </div>
                </div>

                <div className="project-links">
                  <a href="https://github.com/rancorder/qa-automation-framework" target="_blank" rel="noreferrer" className="project-link">
                    View on GitHub →
                  </a>
                  <a href="https://zenn.dev/supermassu" target="_blank" rel="noreferrer" className="project-link">
                    Technical Deep Dive (Zenn) →
                  </a>
                </div>
              </motion.article>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              Technical Capabilities
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              SRE + QA Automation + Enterprise PM
            </motion.p>

            <motion.div className="grid skills" variants={stagger}>
              <motion.div className="card" variants={fadeUp}>
                <h3 className="mini-title">Backend & Infrastructure</h3>
                <div className="tags">
                  <span className="tag">Python/FastAPI</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">Docker</span>
                  <span className="tag">AWS/GCP</span>
                  <span className="tag">Linux</span>
                  <span className="tag">Grafana</span>
                </div>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <h3 className="mini-title">Frontend & Automation</h3>
                <div className="tags">
                  <span className="tag">TypeScript</span>
                  <span className="tag">React/Next.js</span>
                  <span className="tag">Playwright</span>
                  <span className="tag">Three.js</span>
                  <span className="tag">Framer Motion</span>
                </div>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <h3 className="mini-title">Enterprise PM</h3>
                <div className="tags">
                  <span className="tag">Decision Design</span>
                  <span className="tag">Stakeholder Mgmt</span>
                  <span className="tag">Production Ownership</span>
                  <span className="tag">Change Control</span>
                  <span className="tag">Budget Optimization</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="card" variants={fadeUp} style={{ marginTop: '32px' }}>
              <h3 className="mini-title">Content & Documentation</h3>
              <ul className="list">
                <li>
                  <a href="https://zenn.dev/supermassu" target="_blank" rel="noreferrer" className="project-link">
                    Zenn (@supermassu)
                  </a>{' '}
                  - Technical deep dives on QA automation and system design
                </li>
                <li>
                  <a href="https://qiita.com/rancorder" target="_blank" rel="noreferrer" className="project-link">
                    Qiita (@rancorder)
                  </a>{' '}
                  - Infrastructure automation and monitoring best practices
                </li>
                <li>
                  <a href="https://github.com/rancorder" target="_blank" rel="noreferrer" className="project-link">
                    GitHub (@rancorder)
                  </a>{' '}
                  - Open-source contributions and production-grade reference implementations
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              CONTACT
            </motion.h2>

            <motion.div className="contact-card" variants={fadeUp}>
              <div className="contact-left">
                <p className="muted">
                  Brief context about your project helps — I can propose the best approach from both manufacturing PM
                  and technical PM perspectives.
                </p>
              </div>
              <div className="contact-right">
                <a className="btn primary" href="mailto:xzengbu@gmail.com">
                  xzengbu@gmail.com
                </a>
                <a className="btn ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <p>© 2025 H・M. All rights reserved.</p>
            <p className="muted">Built with Next.js + React + TypeScript</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :root {
          --primary: #7c3aed;
          --accent: #22c55e;
          --accent2: #10b981;
          --text: #e2e8f0;
          --muted: #94a3b8;
          --border: rgba(148, 163, 184, 0.2);
          --bg-darker: #020617;
          --bg-dark: #0f172a;
          --card-bg: rgba(15, 23, 42, 0.6);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: var(--bg-darker);
          color: var(--text);
          line-height: 1.6;
          overflow-x: hidden;
        }

        main {
          position: relative;
          min-height: 100vh;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 140vh;
          background: radial-gradient(ellipse at top, rgba(124, 58, 237, 0.25), transparent 50%),
            radial-gradient(ellipse at bottom, rgba(34, 197, 94, 0.15), transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
        }

        /* ============================================
           ナビゲーション - モバイル完全対応
           ============================================ */
        .nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
        }

        .nav-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .brand {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: var(--text);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .nav-links a {
          font-size: 14px;
          font-weight: 600;
          color: var(--muted);
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nav-links a:hover {
          color: var(--text);
        }

        .nav-links .pill {
          padding: 8px 20px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.2);
          border: 1px solid rgba(124, 58, 237, 0.4);
          color: var(--text);
        }

        .nav-links .pill:hover {
          background: rgba(124, 58, 237, 0.3);
        }

        .lang-switch {
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: var(--accent);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .lang-switch:hover {
          background: rgba(34, 197, 94, 0.25);
          border-color: rgba(34, 197, 94, 0.5);
        }

        /* ============================================
           ヒーローセクション - モバイル完全対応
           ============================================ */
        .hero {
          position: relative;
          padding: 120px 0 100px;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        .kicker {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--accent);
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: clamp(28px, 6vw, 56px);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 32px;
          letter-spacing: -1.5px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .hero-subtitle {
          font-size: clamp(16px, 3vw, 20px);
          color: var(--muted);
          margin-bottom: 16px;
          line-height: 1.6;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .cta {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          cursor: pointer;
          text-align: center;
          min-width: 160px;
        }

        .btn.primary {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
        }

        .btn.primary:hover {
          box-shadow: 0 6px 28px rgba(124, 58, 237, 0.6);
          transform: translateY(-2px);
        }

        .btn.primary.pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
          }
          50% {
            box-shadow: 0 4px 32px rgba(124, 58, 237, 0.8);
          }
        }

        .btn.ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
        }

        .btn.ghost:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* ============================================
           Operational Highlights
           ============================================ */
        .operational-highlights {
          margin-top: 64px;
          padding: 32px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(34, 197, 94, 0.1));
          border: 1px solid var(--border);
        }

        .op-header {
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--accent);
          margin-bottom: 24px;
          text-align: center;
        }

        .stats-operational {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .stat-op {
          text-align: center;
          padding: 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }

        .stat-op .stat-v {
          font-size: 28px;
          font-weight: 900;
          color: var(--accent);
          margin-bottom: 8px;
        }

        .stat-op .stat-l {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }

        /* ============================================
           Traditional Stats
           ============================================ */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
          margin-top: 64px;
        }

        .stat {
          text-align: center;
          padding: 24px;
          border-radius: 16px;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }

        .stat-v {
          font-size: 42px;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 8px;
          line-height: 1;
        }

        .stat-l {
          font-size: 13px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ============================================
           セクション共通
           ============================================ */
        .section {
          position: relative;
          padding: 100px 0;
        }

        .section-title {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 900;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .section-sub {
          font-size: clamp(16px, 2.5vw, 18px);
          color: var(--muted);
          margin-bottom: 48px;
        }

        /* ============================================
           グリッド・カード
           ============================================ */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .not-optimize-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .card {
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          transition: all 0.3s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .card:hover {
          border-color: rgba(124, 58, 237, 0.4);
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
          font-size: 20px;
          font-weight: 900;
          line-height: 1.3;
          letter-spacing: -0.5px;
          flex: 1;
          min-width: 200px;
          word-wrap: break-word;
          overflow-wrap: break-word;
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
          flex-shrink: 0;
        }

        .project-desc {
          margin: 16px 0 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 14px;
        }

        .pm-box {
          margin-top: 20px;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(124, 58, 237, 0.4);
          background: rgba(124, 58, 237, 0.14);
          position: relative;
        }

        .pm-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(34, 197, 94, 0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          animation: pmGlow 3s ease-in-out infinite;
        }

        @keyframes pmGlow {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .pm-title {
          font-weight: 900;
          margin-bottom: 12px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pm-list {
          margin: 0;
          padding-left: 20px;
          color: var(--muted);
          line-height: 1.8;
          font-size: 13px;
        }

        .pm-list li {
          margin-bottom: 8px;
        }

        .pm-list li:last-child {
          margin-bottom: 0;
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

        .two-col {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          border-top: 1px solid var(--border);
          padding-top: 24px;
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        /* ============================================
           PM Clarification Box
           ============================================ */
        .pm-clarification {
          margin-top: 48px;
          padding: 32px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(34, 197, 94, 0.08));
          border: 1px solid rgba(124, 58, 237, 0.3);
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
          color: var(--text);
        }

        .pm-clarification-text {
          color: var(--muted);
          line-height: 1.75;
          font-size: 14px;
          margin: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* ============================================
           CONTACTセクション - モバイル完全対応
           ============================================ */
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
          min-width: 240px;
          flex: 1;
        }

        .contact-left .muted {
          word-wrap: break-word;
          overflow-wrap: break-word;
          line-height: 1.7;
        }

        .contact-right {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* ============================================
           Footer
           ============================================ */
        .footer {
          border-top: 1px solid var(--border);
          padding: 32px 0;
          color: var(--muted);
        }

        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .muted {
          color: var(--muted);
        }

        /* ============================================
           レスポンシブ対応（モバイル）
           ============================================ */
        @media (max-width: 860px) {
          .container {
            padding: 0 20px;
          }

          .nav {
            padding: 12px 0;
          }

          .nav-links {
            gap: 12px;
            font-size: 13px;
          }

          .nav-links a {
            font-size: 13px;
          }

          .lang-switch {
            padding: 6px 12px;
            font-size: 11px;
          }

          .hero {
            padding: 100px 0 80px;
            min-height: auto;
          }

          .kicker {
            font-size: 12px;
          }

          .hero-title {
            font-size: clamp(24px, 7vw, 36px);
            margin-bottom: 24px;
            letter-spacing: -1px;
          }

          .hero-subtitle {
            font-size: clamp(14px, 4vw, 18px);
          }

          .cta {
            gap: 12px;
            margin-top: 32px;
          }

          .btn {
            padding: 12px 24px;
            font-size: 14px;
            min-width: 140px;
            width: 100%;
          }

          .operational-highlights {
            padding: 24px 20px;
            margin-top: 48px;
          }

          .stats-operational {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stat-op {
            padding: 16px;
          }

          .stat-op .stat-v {
            font-size: 24px;
          }

          .stat-op .stat-l {
            font-size: 12px;
          }

          .stats {
            grid-template-columns: 1fr;
            gap: 20px;
            margin-top: 48px;
          }

          .stat {
            padding: 20px;
          }

          .stat-v {
            font-size: 36px;
          }

          .section {
            padding: 80px 0;
          }

          .section-title {
            font-size: clamp(28px, 6vw, 40px);
            margin-bottom: 12px;
          }

          .section-sub {
            font-size: clamp(14px, 3.5vw, 16px);
            margin-bottom: 32px;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .grid.skills {
            grid-template-columns: 1fr;
          }

          .not-optimize-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .card {
            padding: 24px;
          }

          .project-head {
            flex-direction: column;
            gap: 12px;
          }

          .project-title {
            font-size: 18px;
            min-width: 100%;
          }

          .two-col {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .pm-clarification {
            padding: 24px;
            margin-top: 32px;
          }

          .pm-clarification-inner {
            flex-direction: column;
            gap: 16px;
          }

          .pm-icon {
            font-size: 28px;
          }

          .pm-clarification-title {
            font-size: 15px;
          }

          .pm-clarification-text {
            font-size: 13px;
          }

          .contact-card {
            padding: 24px;
            gap: 20px;
          }

          .contact-left {
            min-width: 100%;
          }

          .contact-right {
            width: 100%;
            flex-direction: column;
          }

          .contact-right .btn {
            width: 100%;
          }

          .footer-inner {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
        }

        /* ============================================
           超小型デバイス対応（375px以下）
           ============================================ */
        @media (max-width: 480px) {
          .container {
            padding: 0 16px;
          }

          .nav-links {
            gap: 8px;
            font-size: 12px;
          }

          .nav-links .pill {
            padding: 6px 14px;
            font-size: 12px;
          }

          .hero-title {
            font-size: 22px;
            letter-spacing: -0.5px;
          }

          .btn {
            padding: 10px 20px;
            font-size: 13px;
            min-width: 120px;
          }

          .card {
            padding: 20px;
          }

          .project-title {
            font-size: 16px;
          }

          .case-text,
          .pm-list,
          .list {
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}
