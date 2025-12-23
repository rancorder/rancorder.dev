'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';
import type { ProjectCategory } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// カウントアップコンポーネント
function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
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
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref} className="stat-v">
      {count}
      {suffix}
    </div>
  );
}

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const { scrollYProgress } = useScroll();
  
  const yPosAnim = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgY = useTransform(yPosAnim, [0, 1], ['15%', '25%']);

  const categories: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'enterprise', label: 'Enterprise PM' },
    { key: 'product', label: 'Product' },
    { key: 'infrastructure', label: 'Infra/SRE' },
    { key: 'technical', label: 'Technical' },
  ];

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

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
            rancorder
          </a>
          <nav className="nav-links">
            <a href="#why">Why PM</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact" className="pill">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="hero">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p className="kicker" variants={fadeUp}>
              H・M
            </motion.p>

            <motion.h1 className="hero-title" variants={fadeUp}>
              エンタープライズB2Bで、要件を"壊さず前に進める"Technical PM
            </motion.h1>

            <motion.p className="hero-sub" variants={fadeUp}>
              要件定義・品質設計・運用判断を17年。実装と本番運用まで見通して意思決定します。
            </motion.p>

            <motion.p className="hero-desc" variants={fadeUp}>
              曖昧な要件、複雑なステークホルダー、失敗コストの高い制約下でも、
              優先順位とトレードオフを設計し、プロジェクトを前に進めてきました。
              <br />
              製造業の精度（0.01mm、失敗コスト制約）× テクノロジーの速度（24/7運用）を両立できる希少人材です。
            </motion.p>

            <motion.div className="cta" variants={fadeUp}>
              <a className="btn primary pulse" href="mailto:xzengbu@gmail.com">
                面談・相談する
              </a>
              <a className="btn ghost" href="#projects">
                代表実績を見る →
              </a>
              <a className="btn ghost" href="https://github.com/rancorder" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </motion.div>

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

      {/* Why PM */}
      <section id="why" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              Why Product Manager
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              技術だけでは前に進まない領域を、意思決定で通す
            </motion.p>

            <motion.div className="card why" variants={fadeUp}>
              <p>
                技術だけでは、プロダクトは前に進みません。要件・品質・運用の「間」で、
                何を採り、何を捨てるかを決める役割が必要です。
              </p>
              <p>
                私は17年間、失敗コストの高いエンタープライズ案件で、
                要件定義・合意形成・品質設計を担い、進め切る意思決定をしてきました。
                その経験をテクノロジー領域のPMとして提供します。
              </p>
              <p>
                製造業で培った「0.01mmの精度」と「失敗が許されない制約」の中での判断力を、
                テクノロジーの「24/7運用」と「高速な変更」に適用できる希少性が私の武器です。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              代表実績（意思決定と運用）
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              要件・品質・運用のトレードオフをどう捌いたか
            </motion.p>

            <motion.div className="filters" variants={fadeUp}>
              {categories.map((c) => (
                <motion.button
                  key={c.key}
                  className={`chip ${activeCategory === c.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(c.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {c.label}
                </motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="grid"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={stagger}
              >
                {filtered.map((p) => (
                  <motion.article
                    key={p.id}
                    className="card project"
                    variants={fadeUp}
                    whileHover={{
                      y: -8,
                      boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
                      borderColor: 'rgba(255, 255, 255, 0.22)',
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="project-head">
                      <h3 className="project-title">{p.title}</h3>
                      <span className="badge">{p.category}</span>
                    </div>

                    <p className="project-desc">{p.description}</p>

                    {p.pmDecisions?.length ? (
                      <div className="pm-box">
                        <div className="pm-title">PMとしての判断</div>
                        <ul className="pm-list">
                          {p.pmDecisions.map((d, idx) => (
                            <li key={idx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="two-col">
                      <div>
                        <div className="mini-title">成果</div>
                        <ul className="list">
                          {p.highlights.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="mini-title">Tech</div>
                        <div className="tags">
                          {p.technologies.map((t) => (
                            <span className="tag" key={t}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              Skills
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              「できること」より「どう判断するか」を中心に
            </motion.p>

            <motion.div className="grid skills" variants={stagger}>
              {skills.map((g) => (
                <motion.div
                  key={g.category}
                  className="card"
                  variants={fadeUp}
                  whileHover={{
                    y: -6,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mini-title">{g.category}</div>
                  <ul className="list">
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.h2 className="section-title" variants={fadeUp}>
              詰まりやすい案件を、前に進めます
            </motion.h2>
            <motion.p className="section-sub" variants={fadeUp}>
              要件が曖昧 / 品質で揉める / 運用が怖い —— その詰まりを整理して意思決定します
            </motion.p>

            <motion.div className="contact-card" variants={fadeUp}>
              <div className="contact-left">
                <div className="mini-title">Contact</div>
                <p className="muted">
                  案件の状況（ざっくりでOK）を添えてもらえると、話が早いです。
                  <br />
                  製造業PM × Tech PMの両面から、最適な進め方を提案します。
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
          <span className="muted">© {new Date().getFullYear()} rancorder</span>
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
        }

        .hero-sub {
          margin: 20px 0 0;
          font-size: 17px;
          color: var(--muted);
          line-height: 1.7;
        }

        .hero-desc {
          margin: 12px 0 0;
          font-size: 15px;
          color: var(--muted2);
          line-height: 1.8;
          max-width: 900px;
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
        }

        .filters {
          margin-top: 24px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .chip {
          border: 1px solid var(--border);
          background: var(--panel-2);
          color: var(--muted);
          border-radius: 999px;
          padding: 10px 16px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .chip:hover {
          border-color: rgba(255, 255, 255, 0.28);
          background: var(--panel);
        }

        .chip.active {
          color: var(--text);
          background: rgba(124, 58, 237, 0.32);
          border-color: rgba(124, 58, 237, 0.5);
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.25);
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

        .why p {
          margin: 0 0 16px;
          color: var(--muted);
          line-height: 1.85;
        }

        .why p:last-child {
          margin-bottom: 0;
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
          .grid {
            grid-template-columns: 1fr;
          }
          .grid.skills {
            grid-template-columns: 1fr;
          }
          .two-col {
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
