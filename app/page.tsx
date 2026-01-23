'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';

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
    const steps = duration / 16;
    const increment = end / steps;

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
            Role Definition
          </a>
          <a href="#projects" onClick={onClose}>
            Projects
          </a>
          <a href="#skills" onClick={onClose}>
            Skills
          </a>
          <a href="/blog" onClick={onClose}>
            Blog
          </a>
          <a href="#contact" className="mobile-cta" onClick={onClose}>
            Contact
          </a>
          <a href="/ja" className="mobile-lang" onClick={onClose}>
            JA
          </a>
        </nav>
      </div>
    </motion.div>
  );
}

// ============================================
// Main Page Component
// ============================================
export default function Page() {
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
            <a href="#role">Role Definition</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="/blog">Blog</a>
            <ThemeToggle />
            <a href="#contact" className="pill">
              Contact
            </a>
            <a href="/ja" className="lang-switch">
              JA
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
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

      {/* Role */}
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
                    tooling. Tools (JIRA, Asana, etc.) are introduced only when they reduce cognitive load.
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
              <motion.article className="card" variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <div className="project-head">
                  <h3 className="project-title">Manufacturing B2B System (21 SKUs, Simultaneous Launch)</h3>
                  <span className="badge">enterprise</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">
                    21-product simultaneous launch stalled by conflicting stakeholder requirements across 5 companies.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Designed 3-tier quality baseline (Required/Recommended/Ideal) to localize change impact.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <ul className="list">
                    <li>100% on-time delivery rate maintained</li>
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
              <motion.article className="card" variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <div className="project-head">
                  <h3 className="project-title">Automation Platform (54 Sites, 24/7 Operation for 11 Months)</h3>
                  <span className="badge">product</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">Manual monitoring of 54 e-commerce sites consuming 1,000+ hours annually.</p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Designed for failure isolation from day one. Prioritized operational simplicity over elegance.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <ul className="list">
                    <li>99.8% uptime over 11 months continuous operation</li>
                    <li>1,000+ hours annual labor reduction</li>
                    <li>54 sites integrated</li>
                  </ul>
                </div>

                <div className="project-links">
                  <a href="https://github.com/rancorder/master_controller" target="_blank" rel="noreferrer" className="project-link">
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
              <motion.article className="card" variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <div className="project-head">
                  <h3 className="project-title">Multi-stakeholder Product Specification PM</h3>
                  <span className="badge">enterprise</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Problem</div>
                  <p className="case-text">
                    Product specification deadlocked by competing department priorities. Ambiguous requirements created
                    costly changes.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Action</div>
                  <p className="case-text">
                    Classified requirements into &quot;Decide Now&quot; vs &quot;Defer Later&quot; to eliminate wasteful
                    debate.
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Result</div>
                  <ul className="list">
                    <li>Zero specification-related delays</li>
                    <li>60% reduction in change costs</li>
                    <li>Stakeholder satisfaction maintained</li>
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
              <motion.div className="card" variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                <div className="mini-title">Project & Decision Design</div>
                <ul className="list">
                  <li>Clarifying ambiguous requirements</li>
                  <li>Designing decision authority and ownership</li>
                  <li>Cross-functional stakeholder alignment</li>
                  <li>Trade-off design (Speed × Quality × Cost)</li>
                </ul>
              </motion.div>

              <motion.div className="card" variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                <div className="mini-title">Operational & Technical Context</div>
                <ul className="list">
                  <li>Long-running automation systems</li>
                  <li>Monitoring, failure isolation, circuit breakers</li>
                  <li>Production-focused design reviews</li>
                  <li>Manufacturing precision × Technology speed</li>
                </ul>
              </motion.div>

              <motion.div className="card" variants={fadeUp} whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
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
              I&apos;m happy to have a conversation
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
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
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
          font-size: 24px;
          line-height: 1.2;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--text), rgba(255, 255, 255, 0.7));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (min-width: 480px) {
          .hero-title {
            font-size: 28px;
          }
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 38px;
          }
        }

        @media (min-width: 1024px) {
          .hero-title {
            font-size: 52px;
          }
        }

        .hero-subtitle {
          margin: 16px 0 0;
          font-size: 14px;
          color: var(--muted2);
          line-height: 1.6;
          font-style: italic;
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
        /* PM Clarification - Mobile First */
        /* ============================================ */
        .pm-clarification {
          margin-top: 32px;
          padding: 24px 20px;
          border: 1px solid rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.06);
          border-radius: 16px;
        }

        @media (min-width: 768px) {
          .pm-clarification {
            padding: 32px;
            border-radius: 20px;
            margin-top: 40px;
          }
        }

        .pm-clarification-inner {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .pm-clarification-inner {
            flex-direction: row;
            gap: 20px;
          }
        }

        .pm-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .pm-icon {
            font-size: 32px;
          }
        }

        .pm-clarification-title {
          font-weight: 900;
          font-size: 15px;
          margin-bottom: 12px;
          color: var(--accent2);
        }

        @media (min-width: 768px) {
          .pm-clarification-title {
            font-size: 16px;
          }
        }

        .pm-clarification-text {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
          font-size: 13px;
        }

        @media (min-width: 768px) {
          .pm-clarification-text {
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
        }

        @media (min-width: 768px) {
          .tag {
            font-size: 12px;
          }
        }

        .project-links {
          margin-top: 16px;
        }

        .project-link {
          font-size: 13px;
          color: var(--accent);
          font-weight: 700;
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
}
