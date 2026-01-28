'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

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
export default function PageEn() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <a href="#role">Role Definition</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="/blog">Blog</a>
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
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero */}
      <section id="top" className="hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="kicker" variants={fadeUp}>
              Technical PM for Enterprise Systems
            </motion.p>

            <motion.h1 className="hero-title" variants={fadeUp}>
              I turn ambiguous enterprise projects into production systems — by designing decisions before designing software.
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              When you clarify <strong>who decides what</strong> upfront, projects stop stalling.
            </motion.p>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              No blame. No heroics. Structure over individuals.
            </motion.p>

            <motion.p className="lang-note" variants={fadeUp}>
              *This is the primary role definition. For Japanese-language roles, see the{' '}
              <a href="/ja">Japanese version</a>.
            </motion.p>

            <motion.div className="cta" variants={fadeUp}>
              <a className="btn primary pulse" href="mailto:xzengbu@gmail.com">
                Request Interview
              </a>
              <a className="btn ghost" href="#projects">
                View Key Projects →
              </a>
              <a className="btn ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </motion.div>

            {/* Operational Highlights */}
            <motion.div className="operational-highlights" variants={fadeUp}>
              <div className="op-header">Production Track Record</div>
              <div className="stats-operational">
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">11 Months</div>
                  <div className="stat-l">24/7 Uptime — Continuous operation without manual babysitting</div>
                </motion.div>
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">50+ Modules</div>
                  <div className="stat-l">Automated — Zero manual intervention</div>
                </motion.div>
                <motion.div className="stat-op" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="stat-v">Production-Grade</div>
                  <div className="stat-l">Failure isolation, circuit breakers, predictable degradation</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Traditional Stats */}
            <motion.div className="stats" variants={fadeUp}>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={17} suffix=" Years" />
                <div className="stat-l">Enterprise PM Experience</div>
              </motion.div>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={21} suffix=" SKUs" />
                <div className="stat-l">Launched in Parallel</div>
              </motion.div>
              <motion.div className="stat" whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                <CountUp end={11} suffix=" Months" />
                <div className="stat-l">Continuous Production Operation</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Decision Design Matters */}
      <section id="role" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              Why Decision Design Matters
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              Technology doesn't fail. Decisions do. That's why I design decision structures before writing requirements.
            </motion.p>

            <motion.div className="not-optimize-grid" variants={stagger}>
              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">Micromanagement via tools</div>
                <p className="muted">
                  Tools don't run projects. Decisions do. I use Jira, Confluence, Notion, Slack — but I never let tools drive the process.
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">Speed-obsessed delivery with no operational accountability</div>
                <p className="muted">
                  Delivery speed means nothing if it doesn't run in production. I own everything from requirement ambiguity to operational readiness.
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">PoCs with no intention to go live</div>
                <p className="muted">
                  Every technical decision assumes production deployment. PoCs without operational design waste resources.
                </p>
              </motion.div>
            </motion.div>

            <motion.div className="pm-clarification" variants={fadeUp}>
              <h3 className="clarification-title">What I Actually Do as a PM</h3>

              <div className="clarification-grid">
                <div className="clarification-item">
                  <div className="clarification-icon">🚫</div>
                  <div className="clarification-content">
                    <div className="clarification-heading">I'm not a tool optimizer</div>
                    <p className="clarification-text">I don't "manage Jira". I manage decisions.</p>
                  </div>
                </div>

                <div className="clarification-item">
                  <div className="clarification-icon">🔄</div>
                  <div className="clarification-content">
                    <div className="clarification-heading">I translate ambiguity into system design</div>
                    <p className="clarification-text">
                      I break down unclear business demands into: system architecture, responsibility boundaries, escalation rules, operational constraints.
                    </p>
                  </div>
                </div>

                <div className="clarification-item">
                  <div className="clarification-icon">📐</div>
                  <div className="clarification-content">
                    <div className="clarification-heading">I don't sell frameworks</div>
                    <p className="clarification-text">
                      Decision design isn't a consultant framework. It's context-specific judgment architecture.
                    </p>
                  </div>
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
              Key Projects
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              Production-first implementation
            </motion.p>

            <motion.div className="grid projects" variants={stagger}>
              {/* Project 1 */}
              <motion.div className="card" variants={fadeUp}>
                <div className="project-head">
                  <h3 className="project-title">Unified Scraping & Monitoring Platform</h3>
                  <span className="badge">Production</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Challenge</div>
                  <p className="case-text">
                    54 sites, inconsistent HTML, frequent layout changes
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Actions Taken</div>
                  <ul className="list">
                    <li>Designed long-term operational structure</li>
                    <li>Isolated failure domains</li>
                    <li>Built diff-detection and notification pipeline</li>
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label">Outcome</div>
                  <ul className="list">
                    <li>11 months continuous operation</li>
                    <li>100k+ monthly processed items</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">FastAPI</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">Redis</span>
                  <span className="tag">Linux</span>
                </div>
              </motion.div>

              {/* Project 2 */}
              <motion.div className="card" variants={fadeUp}>
                <div className="project-head">
                  <h3 className="project-title">SRE Demonstration System</h3>
                  <span className="badge">Performance</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Challenge</div>
                  <p className="case-text">
                    Validate reliability before production
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Actions Taken</div>
                  <ul className="list">
                    <li>Built 6-service architecture</li>
                    <li>Load testing, failure injection</li>
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label">Outcome</div>
                  <ul className="list">
                    <li>Avg latency 1.69ms (P95: 2.37ms)</li>
                    <li>0% error rate</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">FastAPI</span>
                  <span className="tag">Redis</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">Docker</span>
                </div>
              </motion.div>

              {/* Project 3 */}
              <motion.div className="card" variants={fadeUp}>
                <div className="project-head">
                  <h3 className="project-title">Quality Improvement Project</h3>
                  <span className="badge">Refactor</span>
                </div>

                <div className="case-block">
                  <div className="case-label">Challenge</div>
                  <p className="case-text">
                    1,400-line legacy code with no tests
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label">Actions Taken</div>
                  <ul className="list">
                    <li>Added pytest suite</li>
                    <li>Introduced mypy strict</li>
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label">Outcome</div>
                  <ul className="list">
                    <li>30 tests</li>
                    <li>26% coverage</li>
                    <li>System moved from "works but untouchable" to "safe to modify"</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag">Python</span>
                  <span className="tag">pytest</span>
                  <span className="tag">mypy</span>
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
              Skill Set
            </motion.h2>

            <motion.div className="grid skills" variants={stagger}>
              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">Decision Design</div>
                <p className="muted">
                  Clarify <strong>who decides what</strong> before development starts. Define responsibility boundaries, escalation rules, and fallback paths.
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">Product Management</div>
                <p className="muted">
                  Requirements definition, roadmap planning, stakeholder alignment, cross-team communication.
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">System Architecture (Enterprise Context)</div>
                <p className="muted">
                  System-wide design, API design, data consistency, failure isolation, operational constraints.
                </p>
              </motion.div>

              <motion.div className="card" variants={fadeUp}>
                <div className="mini-title">Production Operations Design</div>
                <p className="muted">
                  Monitoring, logging, retry control, circuit breakers, predictable degradation.
                </p>
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
              Get in Touch
            </motion.h2>

            <motion.div className="contact-card" variants={fadeUp}>
              <div className="contact-left">
                <p className="contact-text">
                  If you need a Technical PM who can turn complex enterprise initiatives into production-ready systems, feel free to reach out.
                </p>
              </div>
              <div className="contact-right">
                <a className="btn primary" href="mailto:xzengbu@gmail.com">
                  Email Me
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
            <span>© 2025 H・M. All rights reserved.</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* ============================================ */
        /* CSS Variables */
        /* ============================================ */
        :root {
          --bg: #0a0a0f;
          --text: #f8fafc;
          --muted: #94a3b8;
          --border: rgba(255, 255, 255, 0.08);
          --accent: #a78bfa;
          --accent2: #22c55e;
          --card-bg: rgba(15, 23, 42, 0.5);
          --touch-target: 44px;
        }

        /* ============================================ */
        /* Global Reset */
        /* ============================================ */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        main {
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        /* ============================================ */
        /* Scroll Progress Bar */
        /* ============================================ */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform-origin: 0%;
          z-index: 9999;
        }

        /* ============================================ */
        /* Background Gradient - Animated */
        /* ============================================ */
        .bg-gradient {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(167, 139, 250, 0.15), transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 90%, rgba(34, 197, 94, 0.1), transparent 60%);
          pointer-events: none;
          z-index: -1;
        }

        /* ============================================ */
        /* Container */
        /* ============================================ */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        @media (min-width: 768px) {
          .container {
            padding: 0 40px;
          }
        }

        /* ============================================ */
        /* Navigation - Sticky Header */
        /* ============================================ */
        .nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(12px);
          background: rgba(10, 10, 15, 0.8);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
        }

        .nav-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          font-size: 20px;
          font-weight: 900;
          color: var(--text);
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .nav-links {
          display: none;
          gap: 32px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }

        .nav-links a {
          color: var(--muted);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s;
        }

        .nav-links a:hover {
          color: var(--text);
        }

        .pill {
          padding: 8px 16px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff !important;
        }

        .lang-switch {
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 12px !important;
        }

        /* Hamburger Menu */
        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 1001;
        }

        @media (min-width: 768px) {
          .hamburger {
            display: none;
          }
        }

        .hamburger span {
          width: 24px;
          height: 2px;
          background: var(--text);
          transition: all 0.3s;
          border-radius: 2px;
        }

        .hamburger span.open:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        .hamburger span.open:nth-child(2) {
          opacity: 0;
        }

        .hamburger span.open:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-inner {
          width: 100%;
          padding: 40px;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
        }

        .mobile-nav-links a {
          color: var(--text);
          text-decoration: none;
          font-size: 24px;
          font-weight: 700;
          transition: color 0.2s;
          min-height: var(--touch-target);
          display: flex;
          align-items: center;
        }

        .mobile-cta {
          padding: 12px 32px;
          background: var(--accent);
          border-radius: 999px;
        }

        .mobile-lang {
          padding: 8px 24px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 18px !important;
        }

        /* ============================================ */
        /* Hero Section */
        /* ============================================ */
        .hero {
          padding: 120px 0 80px;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        @media (min-width: 768px) {
          .hero {
            padding: 160px 0 120px;
          }
        }

        .kicker {
          font-size: 14px;
          font-weight: 700;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .kicker {
            font-size: 16px;
          }
        }

        .hero-title {
          font-size: clamp(28px, 7vw, 56px);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 32px;
          background: linear-gradient(135deg, #f8fafc, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: clamp(16px, 3vw, 20px);
          line-height: 1.7;
          color: var(--muted);
          margin-bottom: 16px;
        }

        .hero-subtitle strong {
          color: var(--accent);
          font-weight: 700;
        }

        .lang-note {
          font-size: 14px;
          color: var(--muted);
          margin-top: 32px;
          margin-bottom: 48px;
          font-style: italic;
        }

        .lang-note a {
          color: var(--accent);
          text-decoration: underline;
        }

        /* CTA Buttons */
        .cta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 80px;
        }

        .btn {
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: var(--touch-target);
        }

        .btn.primary {
          background: var(--accent);
          color: #fff;
          border: none;
        }

        .btn.primary:hover {
          background: #9370db;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(167, 139, 250, 0.3);
        }

        .btn.ghost {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn.ghost:hover {
          border-color: var(--accent);
          background: rgba(167, 139, 250, 0.1);
          transform: translateY(-2px);
        }

        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.4);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(167, 139, 250, 0);
          }
        }

        /* Operational Highlights */
        .operational-highlights {
          margin-bottom: 60px;
        }

        .op-header {
          font-size: 14px;
          font-weight: 900;
          color: var(--accent2);
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 24px;
        }

        .stats-operational {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .stats-operational {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat-op {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
        }

        .stat-op:hover {
          border-color: var(--accent2);
          background: rgba(34, 197, 94, 0.05);
        }

        /* Traditional Stats */
        .stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 768px) {
          .stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat {
          text-align: center;
          padding: 32px 24px;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: all 0.3s;
        }

        .stat:hover {
          border-color: var(--accent);
          background: rgba(167, 139, 250, 0.05);
        }

        .stat-v {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 900;
          color: var(--text);
          margin-bottom: 12px;
        }

        .stat-l {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
        }

        /* ============================================ */
        /* Section Common */
        /* ============================================ */
        .section {
          padding: 80px 0;
        }

        @media (min-width: 768px) {
          .section {
            padding: 120px 0;
          }
        }

        .section-title {
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 900;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-sub {
          font-size: clamp(16px, 3vw, 20px);
          color: var(--muted);
          margin-bottom: 64px;
          line-height: 1.7;
        }

        /* ============================================ */
        /* Cards & Grids */
        /* ============================================ */
        .card {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s;
        }

        .card:hover {
          border-color: var(--accent);
          background: rgba(167, 139, 250, 0.03);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .grid {
          display: grid;
          gap: 24px;
        }

        .not-optimize-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 64px;
        }

        @media (min-width: 768px) {
          .not-optimize-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .mini-title {
          font-size: 16px;
          font-weight: 900;
          color: var(--text);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .muted {
          color: var(--muted);
          line-height: 1.7;
          font-size: 15px;
        }

        /* PM Clarification */
        .pm-clarification {
          margin-top: 80px;
        }

        .clarification-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 900;
          margin-bottom: 48px;
          color: var(--text);
        }

        .clarification-grid {
          display: grid;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .clarification-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .clarification-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .clarification-icon {
          font-size: 40px;
          flex-shrink: 0;
        }

        .clarification-content {
          flex: 1;
        }

        .clarification-heading {
          font-size: 16px;
          font-weight: 900;
          color: var(--accent);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .clarification-text {
          color: var(--muted);
          line-height: 1.7;
          font-size: 15px;
        }

        /* ============================================ */
        /* Projects Section */
        /* ============================================ */
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
          font-size: 20px;
          font-weight: 900;
          color: var(--text);
          flex: 1;
          min-width: 200px;
        }

        .badge {
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(167, 139, 250, 0.2);
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .case-block {
          margin-bottom: 24px;
        }

        .case-label {
          font-size: 12px;
          font-weight: 900;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .case-text {
          color: var(--muted);
          line-height: 1.7;
          font-size: 15px;
        }

        .list {
          padding-left: 20px;
          color: var(--muted);
          line-height: 1.8;
          font-size: 15px;
        }

        .list li {
          margin-bottom: 8px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .tag {
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          color: var(--muted);
          transition: all 0.2s;
        }

        .tag:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--accent);
          color: var(--accent);
        }

        /* ============================================ */
        /* Skills Section */
        /* ============================================ */
        .grid.skills {
          grid-template-columns: 1fr;
        }

        @media (min-width: 768px) {
          .grid.skills {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .grid.skills {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* ============================================ */
        /* Contact Section */
        /* ============================================ */
        .contact-card {
          display: flex;
          gap: 32px;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(34, 197, 94, 0.1));
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 48px;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .contact-card {
            flex-direction: row;
          }
        }

        .contact-left {
          flex: 1;
        }

        .contact-text {
          font-size: 18px;
          line-height: 1.7;
          color: var(--muted);
        }

        .contact-right {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .contact-right {
            flex-direction: row;
          }
        }

        /* ============================================ */
        /* Footer */
        /* ============================================ */
        .footer {
          border-top: 1px solid var(--border);
          padding: 40px 0;
          color: var(--muted);
        }

        .footer-inner {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}
