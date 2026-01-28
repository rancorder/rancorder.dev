'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from 'framer-motion';

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
// Particle Background Component
// ============================================
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach((particle2) => {
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.15 * (1 - distance / 120)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

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
          <a href="/portfolio/ja" className="mobile-lang" onClick={onClose}>
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
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main>
      {/* Particle Background */}
      <ParticleBackground />

      {/* Dynamic Background */}
      <motion.div className="bg-gradient" style={{ y: bgY }} />
      
      {/* Mouse Follow Spotlight */}
      <motion.div
        className="mouse-spotlight"
        style={{
          x: useTransform(mouseX, (x) => x - 200),
          y: useTransform(mouseY, (y) => y - 200),
        }}
      />

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
            <a href="/portfolio/ja" className="lang-switch">
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

            <motion.h1 className="hero-title glitch" variants={fadeUp} data-text="I turn ambiguous enterprise projects into production systems — by designing decisions before designing software.">
              I turn ambiguous enterprise projects into production systems — by designing decisions before designing software.
            </motion.h1>

            <motion.p className="hero-subtitle neon-text" variants={fadeUp}>
              When you clarify <strong>who decides what</strong> upfront, projects stop stalling.
            </motion.p>

            <motion.p className="hero-subtitle neon-text" variants={fadeUp}>
              No blame. No heroics. Structure over individuals.
            </motion.p>

            <motion.p className="lang-note" variants={fadeUp}>
              *This is the primary role definition. For Japanese-language roles, see the{' '}
              <a href="/portfolio/ja">Japanese version</a>.
            </motion.p>

            <motion.div className="cta" variants={fadeUp}>
              <a className="btn primary pulse glow-btn" href="mailto:xzengbu@gmail.com">
                Request Interview
              </a>
              <a className="btn ghost glow-btn-ghost" href="#projects">
                View Key Projects →
              </a>
              <a className="btn ghost glow-btn-ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </motion.div>

            {/* Operational Highlights */}
            <motion.div className="operational-highlights" variants={fadeUp}>
              <div className="op-header neon-text">Production Track Record</div>
              <div className="stats-operational">
                <motion.div 
                  className="stat-op glow-card" 
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="stat-v neon-number">11 Months</div>
                  <div className="stat-l">24/7 Uptime — Continuous operation without manual babysitting</div>
                </motion.div>
                <motion.div 
                  className="stat-op glow-card" 
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="stat-v neon-number">50+ Modules</div>
                  <div className="stat-l">Automated — Zero manual intervention</div>
                </motion.div>
                <motion.div 
                  className="stat-op glow-card" 
                  whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="stat-v neon-number">Production-Grade</div>
                  <div className="stat-l">Failure isolation, circuit breakers, predictable degradation</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Traditional Stats */}
            <motion.div className="stats" variants={fadeUp}>
              <motion.div 
                className="stat glow-card" 
                whileHover={{ y: -8, scale: 1.05, rotateY: 5, transition: { duration: 0.2 } }}
              >
                <CountUp end={17} suffix=" Years" />
                <div className="stat-l">Enterprise PM Experience</div>
              </motion.div>
              <motion.div 
                className="stat glow-card" 
                whileHover={{ y: -8, scale: 1.05, rotateY: 5, transition: { duration: 0.2 } }}
              >
                <CountUp end={21} suffix=" SKUs" />
                <div className="stat-l">Launched in Parallel</div>
              </motion.div>
              <motion.div 
                className="stat glow-card" 
                whileHover={{ y: -8, scale: 1.05, rotateY: 5, transition: { duration: 0.2 } }}
              >
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
            <motion.h2 className="section-title glitch-title" variants={fadeUp} data-text="Why Decision Design Matters">
              Why Decision Design Matters
            </motion.h2>
            <motion.p className="section-sub neon-text" variants={fadeUp}>
              Technology doesn't fail. Decisions do. That's why I design decision structures before writing requirements.
            </motion.p>

            <motion.div className="not-optimize-grid" variants={stagger}>
              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="mini-title neon-accent">Micromanagement via tools</div>
                <p className="muted">
                  Tools don't run projects. Decisions do. I use Jira, Confluence, Notion, Slack — but I never let tools drive the process.
                </p>
              </motion.div>

              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="mini-title neon-accent">Speed-obsessed delivery with no operational accountability</div>
                <p className="muted">
                  Delivery speed means nothing if it doesn't run in production. I own everything from requirement ambiguity to operational readiness.
                </p>
              </motion.div>

              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="mini-title neon-accent">PoCs with no intention to go live</div>
                <p className="muted">
                  Every technical decision assumes production deployment. PoCs without operational design waste resources.
                </p>
              </motion.div>
            </motion.div>

            <motion.div className="pm-clarification" variants={fadeUp}>
              <h3 className="clarification-title neon-text">What I Actually Do as a PM</h3>

              <div className="clarification-grid">
                <motion.div 
                  className="clarification-item"
                  whileHover={{ x: 10 }}
                >
                  <div className="clarification-icon">🚫</div>
                  <div className="clarification-content">
                    <div className="clarification-heading neon-accent">I'm not a tool optimizer</div>
                    <p className="clarification-text">I don't "manage Jira". I manage decisions.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="clarification-item"
                  whileHover={{ x: 10 }}
                >
                  <div className="clarification-icon">🔄</div>
                  <div className="clarification-content">
                    <div className="clarification-heading neon-accent">I translate ambiguity into system design</div>
                    <p className="clarification-text">
                      I break down unclear business demands into: system architecture, responsibility boundaries, escalation rules, operational constraints.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="clarification-item"
                  whileHover={{ x: 10 }}
                >
                  <div className="clarification-icon">📐</div>
                  <div className="clarification-content">
                    <div className="clarification-heading neon-accent">I don't sell frameworks</div>
                    <p className="clarification-text">
                      Decision design isn't a consultant framework. It's context-specific judgment architecture.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={stagger}>
            <motion.h2 className="section-title glitch-title" variants={fadeUp} data-text="Key Projects">
              Key Projects
            </motion.h2>
            <motion.p className="section-sub neon-text" variants={fadeUp}>
              Production-first implementation
            </motion.p>

            <motion.div className="grid projects" variants={stagger}>
              {/* Project 1 */}
              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -12, scale: 1.03, rotateX: 2 }}
              >
                <div className="project-head">
                  <h3 className="project-title">Unified Scraping & Monitoring Platform</h3>
                  <span className="badge neon-badge">Production</span>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Challenge</div>
                  <p className="case-text">
                    54 sites, inconsistent HTML, frequent layout changes
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Actions Taken</div>
                  <ul className="list">
                    <li>Designed long-term operational structure</li>
                    <li>Isolated failure domains</li>
                    <li>Built diff-detection and notification pipeline</li>
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Outcome</div>
                  <ul className="list">
                    <li>11 months continuous operation</li>
                    <li>100k+ monthly processed items</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag glow-tag">Python</span>
                  <span className="tag glow-tag">FastAPI</span>
                  <span className="tag glow-tag">PostgreSQL</span>
                  <span className="tag glow-tag">Redis</span>
                  <span className="tag glow-tag">Linux</span>
                </div>
              </motion.div>

              {/* Project 2 */}
              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -12, scale: 1.03, rotateX: 2 }}
              >
                <div className="project-head">
                  <h3 className="project-title">SRE Demonstration System</h3>
                  <span className="badge neon-badge">Performance</span>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Challenge</div>
                  <p className="case-text">
                    Validate reliability before production
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Actions Taken</div>
                  <ul className="list">
                    <li>Built 6-service architecture</li>
                    <li>Load testing, failure injection</li>
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Outcome</div>
                  <ul className="list">
                    <li>Avg latency 1.69ms (P95: 2.37ms)</li>
                    <li>0% error rate</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag glow-tag">FastAPI</span>
                  <span className="tag glow-tag">Redis</span>
                  <span className="tag glow-tag">PostgreSQL</span>
                  <span className="tag glow-tag">Docker</span>
                </div>
              </motion.div>

              {/* Project 3 */}
              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -12, scale: 1.03, rotateX: 2 }}
              >
                <div className="project-head">
                  <h3 className="project-title">Quality Improvement Project</h3>
                  <span className="badge neon-badge">Refactor</span>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Challenge</div>
                  <p className="case-text">
                    1,400-line legacy code with no tests
                  </p>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Actions Taken</div>
                  <ul className="list">
                    <li>Added pytest suite</li>
                    <li>Introduced mypy strict</li>
                  </ul>
                </div>

                <div className="case-block">
                  <div className="case-label neon-accent">Outcome</div>
                  <ul className="list">
                    <li>30 tests</li>
                    <li>26% coverage</li>
                    <li>System moved from "works but untouchable" to "safe to modify"</li>
                  </ul>
                </div>

                <div className="tags">
                  <span className="tag glow-tag">Python</span>
                  <span className="tag glow-tag">pytest</span>
                  <span className="tag glow-tag">mypy</span>
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
            <motion.h2 className="section-title glitch-title" variants={fadeUp} data-text="Skill Set">
              Skill Set
            </motion.h2>

            <motion.div className="grid skills" variants={stagger}>
              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <div className="mini-title neon-accent">Decision Design</div>
                <p className="muted">
                  Clarify <strong>who decides what</strong> before development starts. Define responsibility boundaries, escalation rules, and fallback paths.
                </p>
              </motion.div>

              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <div className="mini-title neon-accent">Product Management</div>
                <p className="muted">
                  Requirements definition, roadmap planning, stakeholder alignment, cross-team communication.
                </p>
              </motion.div>

              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <div className="mini-title neon-accent">System Architecture (Enterprise Context)</div>
                <p className="muted">
                  System-wide design, API design, data consistency, failure isolation, operational constraints.
                </p>
              </motion.div>

              <motion.div 
                className="card glow-card-hover" 
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.05 }}
              >
                <div className="mini-title neon-accent">Production Operations Design</div>
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
            <motion.h2 className="section-title glitch-title" variants={fadeUp} data-text="Get in Touch">
              Get in Touch
            </motion.h2>

            <motion.div className="contact-card glow-card-hover" variants={fadeUp}>
              <div className="contact-left">
                <p className="contact-text neon-text">
                  If you need a Technical PM who can turn complex enterprise initiatives into production-ready systems, feel free to reach out.
                </p>
              </div>
              <div className="contact-right">
                <a className="btn primary glow-btn" href="mailto:xzengbu@gmail.com">
                  Email Me
                </a>
                <a className="btn ghost glow-btn-ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
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
          perspective: 1000px;
        }

        /* ============================================ */
        /* Particle Canvas */
        /* ============================================ */
        .particle-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        /* ============================================ */
        /* Mouse Spotlight */
        /* ============================================ */
        .mouse-spotlight {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.15), transparent 70%);
          pointer-events: none;
          z-index: 1;
          filter: blur(40px);
        }

        /* ============================================ */
        /* Scroll Progress Bar */
        /* ============================================ */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transform-origin: 0%;
          z-index: 9999;
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.8);
        }

        /* ============================================ */
        /* Background Gradient - Animated */
        /* ============================================ */
        .bg-gradient {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(167, 139, 250, 0.25), transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 90%, rgba(34, 197, 94, 0.2), transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 50%, rgba(34, 197, 94, 0.15), transparent 70%);
          pointer-events: none;
          z-index: 0;
          animation: pulse-bg 10s ease-in-out infinite;
        }

        @keyframes pulse-bg {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* ============================================ */
        /* Glitch Effect */
        /* ============================================ */
        .glitch {
          position: relative;
          animation: glitch 8s infinite;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          -webkit-background-clip: text;
          background-clip: text;
        }

        .glitch::before {
          animation: glitch-1 3s infinite;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          transform: translateX(-3px);
          text-shadow: 2px 0 #ff00de;
        }

        .glitch::after {
          animation: glitch-2 2.5s infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
          transform: translateX(3px);
          text-shadow: -2px 0 #00fff9;
        }

        @keyframes glitch {
          0%, 100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-3px, 3px);
          }
          40% {
            transform: translate(-3px, -3px);
          }
          60% {
            transform: translate(3px, 3px);
          }
          80% {
            transform: translate(3px, -3px);
          }
        }

        @keyframes glitch-1 {
          0%, 100% {
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
            transform: translateX(0);
          }
          20% {
            clip-path: polygon(0 15%, 100% 15%, 100% 65%, 0 65%);
            transform: translateX(-8px);
          }
          40% {
            clip-path: polygon(0 30%, 100% 30%, 100% 80%, 0 80%);
            transform: translateX(8px);
          }
        }

        @keyframes glitch-2 {
          0%, 100% {
            clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
            transform: translateX(0);
          }
          25% {
            clip-path: polygon(0 20%, 100% 20%, 100% 60%, 0 60%);
            transform: translateX(8px);
          }
          50% {
            clip-path: polygon(0 40%, 100% 40%, 100% 85%, 0 85%);
            transform: translateX(-8px);
          }
        }

        /* ============================================ */
        /* Neon Effects */
        /* ============================================ */
        .neon-text {
          text-shadow: 
            0 0 10px rgba(167, 139, 250, 0.8),
            0 0 20px rgba(167, 139, 250, 0.6),
            0 0 30px rgba(167, 139, 250, 0.4);
        }

        .neon-accent {
          color: var(--accent);
          text-shadow: 
            0 0 10px rgba(167, 139, 250, 1),
            0 0 20px rgba(167, 139, 250, 0.8),
            0 0 30px rgba(167, 139, 250, 0.6);
        }

        .neon-number {
          text-shadow: 
            0 0 15px rgba(34, 197, 94, 1),
            0 0 30px rgba(34, 197, 94, 0.8),
            0 0 45px rgba(34, 197, 94, 0.6);
        }

        .neon-badge {
          box-shadow: 
            0 0 15px rgba(167, 139, 250, 0.8),
            inset 0 0 15px rgba(167, 139, 250, 0.4);
        }

        /* ============================================ */
        /* Glow Card Effects */
        /* ============================================ */
        .glow-card {
          box-shadow: 
            0 0 20px rgba(167, 139, 250, 0.2),
            0 0 40px rgba(167, 139, 250, 0.1);
          transition: all 0.3s ease;
        }

        .glow-card:hover {
          box-shadow: 
            0 0 30px rgba(167, 139, 250, 0.5),
            0 0 60px rgba(167, 139, 250, 0.3),
            0 0 90px rgba(167, 139, 250, 0.1);
        }

        .glow-card-hover {
          transition: all 0.3s ease;
        }

        .glow-card-hover:hover {
          box-shadow: 
            0 0 30px rgba(167, 139, 250, 0.5),
            0 0 60px rgba(167, 139, 250, 0.3),
            0 20px 40px rgba(0, 0, 0, 0.5);
          transform: translateY(-8px);
        }

        .glow-tag {
          transition: all 0.2s;
        }

        .glow-tag:hover {
          box-shadow: 
            0 0 15px rgba(167, 139, 250, 0.6),
            inset 0 0 15px rgba(167, 139, 250, 0.3);
          transform: scale(1.1);
        }

        /* ============================================ */
        /* Glow Button Effects */
        /* ============================================ */
        .glow-btn {
          box-shadow: 
            0 0 20px rgba(167, 139, 250, 0.5),
            0 0 40px rgba(167, 139, 250, 0.3);
          transition: all 0.3s;
        }

        .glow-btn:hover {
          box-shadow: 
            0 0 30px rgba(167, 139, 250, 0.8),
            0 0 60px rgba(167, 139, 250, 0.6),
            0 0 90px rgba(167, 139, 250, 0.4);
          transform: translateY(-4px) scale(1.05);
        }

        .glow-btn-ghost {
          transition: all 0.3s;
        }

        .glow-btn-ghost:hover {
          box-shadow: 
            0 0 20px rgba(167, 139, 250, 0.5),
            0 0 40px rgba(167, 139, 250, 0.3);
          background: rgba(167, 139, 250, 0.15);
        }

        /* ============================================ */
        /* Container */
        /* ============================================ */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          position: relative;
          z-index: 10;
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
          backdrop-filter: blur(20px);
          background: rgba(10, 10, 15, 0.9);
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
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
          text-shadow: 
            0 0 10px rgba(167, 139, 250, 0.8),
            0 0 20px rgba(167, 139, 250, 0.6);
          transition: all 0.3s;
        }

        .brand:hover {
          text-shadow: 
            0 0 15px rgba(167, 139, 250, 1),
            0 0 30px rgba(167, 139, 250, 0.8);
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
          transition: all 0.3s;
          position: relative;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--accent);
          transition: width 0.3s;
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.8);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .nav-links a:hover {
          color: var(--text);
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.8);
        }

        .pill {
          padding: 8px 16px;
          border-radius: 999px;
          background: var(--accent);
          color: #fff !important;
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
        }

        .pill:hover {
          box-shadow: 0 0 30px rgba(167, 139, 250, 0.8);
          transform: translateY(-2px);
        }

        .lang-switch {
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 12px !important;
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
        }

        .lang-switch:hover {
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.6);
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
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
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
          background: rgba(0, 0, 0, 0.98);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(20px);
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
          transition: all 0.3s;
          min-height: var(--touch-target);
          display: flex;
          align-items: center;
          text-shadow: 0 0 15px rgba(167, 139, 250, 0.5);
        }

        .mobile-nav-links a:hover {
          text-shadow: 0 0 25px rgba(167, 139, 250, 1);
          transform: scale(1.1);
        }

        .mobile-cta {
          padding: 12px 32px;
          background: var(--accent);
          border-radius: 999px;
          box-shadow: 0 0 30px rgba(167, 139, 250, 0.8);
        }

        .mobile-lang {
          padding: 8px 24px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 18px !important;
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.5);
        }

        /* ============================================ */
        /* Hero Section */
        /* ============================================ */
        .hero {
          padding: 120px 0 80px;
          min-height: 90vh;
          display: flex;
          align-items: center;
          position: relative;
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
          text-shadow: 0 0 15px rgba(167, 139, 250, 0.8);
          animation: pulse-text 2s ease-in-out infinite;
        }

        @keyframes pulse-text {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
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

        .glitch-title {
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
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
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.6);
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
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
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
        }

        .btn.ghost {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border);
        }

        .btn.ghost:hover {
          border-color: var(--accent);
        }

        .pulse {
          animation: pulse-btn 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse-btn {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.7);
          }
          50% {
            box-shadow: 0 0 0 30px rgba(167, 139, 250, 0);
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
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
        }

        .stat-op:hover {
          border-color: var(--accent2);
          background: rgba(34, 197, 94, 0.08);
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
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 16px;
          transition: all 0.3s;
          transform-style: preserve-3d;
        }

        .stat:hover {
          border-color: var(--accent);
          background: rgba(167, 139, 250, 0.08);
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
          position: relative;
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
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s;
          transform-style: preserve-3d;
        }

        .card:hover {
          border-color: var(--accent);
          background: rgba(167, 139, 250, 0.05);
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
          transition: all 0.3s;
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
          background: rgba(255, 255, 255, 0.1);
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
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(34, 197, 94, 0.1));
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 48px;
          flex-direction: column;
          backdrop-filter: blur(20px);
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
