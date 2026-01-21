'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion';

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
    const stepMs = 16;
    const increment = end / (duration / stepMs);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(decimals > 0 ? parseFloat(start.toFixed(decimals)) : Math.floor(start));
      }
    }, stepMs);

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
      <motion.div className="bg-gradient" style={{ y: bgY }} />

      {/* Top Nav */}
      <header className="nav">
        <div className="container nav-inner">
          <a href="#top" className="brand" aria-label="Back to top">
            H・M
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#role">Role Definition</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact" className="pill">
            <a href="/blog">Blog</a>
            <a href="#contact" classNam
            </a>
            <a href="/ja" className="lang-switch">
              JA
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
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

            {/* Operational Highlights */}
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

      {/* Role Clarification */}
      <section id="role" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
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

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              Representative Projects
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              Problem → Action → Result
            </motion.p>

            <motion.div className="grid" variants={stagger}>
              {/* Case 1 */}
              <motion.article
                className="card"
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)' }}
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
                  <ul className="list">
                    <li>100% on-time delivery rate maintained for 17 months (zero delays)</li>
                    <li>30% reduction in specification change requests</li>
                    <li>Largest-scale project in 17-year career</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">Requirement Definition</span>
                  <span className="tag">Stakeholder Coordination</span>
                  <span className="tag">Risk Management</span>
                </div>
              </motion.article>

              {/* Case 2 */}
              <motion.article
                className="card"
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-head">
                  <h3 className="project-title">Automation Platform (54 Sites, 24/7 Operation for 11 Months)</h3>
                  <span className="badge">product</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">
                    Manual monitoring of 54 e-commerce sites consuming 1,000+ hours annually. PoC implementations
                    historically failed to reach production due to operational complexity.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Designed for failure isolation from day one using SQLite WAL for recovery speed. Prioritized
                    operational simplicity over architectural elegance. Defined quality baseline as "tolerate false
                    negatives, minimize false positives."
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <ul className="list">
                    <li>99.8% uptime over 11 months continuous operation</li>
                    <li>1,000+ hours annual labor reduction (¥720K monthly equivalent)</li>
                    <li>54 sites integrated / 100K+ monthly processing</li>
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
                  <span className="tag">24/7 Operations</span>
                </div>
              </motion.article>

              {/* Case 3 */}
              <motion.article
                className="card"
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="project-head">
                  <h3 className="project-title">Multi-stakeholder Product Specification PM</h3>
                  <span className="badge">enterprise</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">
                    Home appliance product specification deadlocked by competing department priorities. Ambiguous
                    requirements generating costly design changes and timeline slippage.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Classified requirements into "Decide Now" vs "Defer Later" to eliminate wasteful debate. Established
                    3-tier change impact evaluation (Minor/Moderate/Critical) with clear acceptance criteria.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <ul className="list">
                    <li>Zero specification-related delays for 14 months</li>
                    <li>60% reduction in design change costs</li>
                    <li>85%+ stakeholder satisfaction maintained quarterly</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">Specification Definition</span>
                  <span className="tag">Consensus Building</span>
                  <span className="tag">Change Management</span>
                </div>
              </motion.article>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              Skills
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              Role-based capabilities, not tool lists
            </motion.p>

            <motion.div className="grid skills" variants={stagger}>
              <motion.div
                className="card"
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="mini-title">Project & Decision Design</div>
                <ul className="list">
                  <li>Clarifying ambiguous requirements</li>
                  <li>Designing decision authority and ownership</li>
                  <li>Cross-functional stakeholder alignment</li>
                  <li>Trade-off design (Speed × Quality × Cost)</li>
                </ul>
              </motion.div>

              <motion.div
                className="card"
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="mini-title">Operational & Technical Context</div>
                <ul className="list">
                  <li>Long-running automation systems (11+ months continuous operation)</li>
                  <li>Monitoring, failure isolation, circuit breakers</li>
                  <li>Production-focused design reviews</li>
                  <li>Manufacturing precision (0.01mm) × Technology speed (24/7)</li>
                </ul>
              </motion.div>

              <motion.div
                className="card"
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="mini-title">Tools</div>
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              If your project is technically complete but cannot move to production
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              I'm happy to have a conversation
            </motion.p>

            <motion.div className="contact-card" variants={fadeUp}>
              <div className="contact-left">
                <div className="mini-title">Contact</div>
                <p className="muted">
                  Brief context about your project helps — I can propose the best approach from both manufacturing PM
                  and technical PM perspectives.
                </p>
              </div>
              <div className="contact-right">
                <a className="btn primary pulse" href="mailto:xzengbu@gmail.com">
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
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
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
          flex-wrap: wrap;
          justify-content: flex-end;
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
          flex-shrink: 0;
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
          font-size: clamp(32px, 3.5vw, 52px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text), rgba(255, 255, 255, 0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }

        .hero-subtitle {
          margin: 20px 0 0;
          font-size: 14px;
          color: var(--muted2);
          line-height: 1.6;
          font-style: italic;
          word-wrap: break-word;
          overflow-wrap: break-word;
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
          word-wrap: break-word;
          overflow-wrap: break-word;
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
          word-wrap: break-word;
          overflow-wrap: break-word;
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
          .container {
            padding: 0 20px;
          }

          .nav-links {
            gap: 12px;
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
          }

          .kicker {
            font-size: 12px;
          }

          .hero-title {
            font-size: clamp(24px, 7vw, 36px);
            margin-bottom: 24px;
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

        @media (max-width: 480px) {
          .container {
            padding: 0 16px;
          }

          .nav-links {
            gap: 8px;
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
          .list {
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}