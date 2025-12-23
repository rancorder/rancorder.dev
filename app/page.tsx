// app/page.tsx - モバイル修正版
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { projects } from '../data/projects';
import { skills } from '../data/skills';

// アニメーション設定（高速化）
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Intersection Observer フック（threshold調整）
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // プロジェクトフィルタリング
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --secondary: #64748b;
          --accent: #10b981;
          --bg-dark: #0f172a;
          --bg-darker: #020617;
          --text-light: #f8fafc;
          --text-gray: #cbd5e1;
          --border: rgba(255, 255, 255, 0.1);
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          background: var(--bg-darker);
          color: var(--text-light);
          line-height: 1.7;
          overflow-x: hidden;
        }

        /* グラデーション背景 */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        /* ヘッダー - モバイル最適化 */
        header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          z-index: 1000;
          padding: 1rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        nav {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          z-index: 1001;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          color: var(--text-gray);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: var(--text-light);
        }

        /* ハンバーガーメニューボタン */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 1001;
        }

        .mobile-menu-btn span {
          width: 24px;
          height: 2px;
          background: var(--text-light);
          transition: all 0.3s;
        }

        .mobile-menu-btn.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn.open span:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        /* コンテンツ */
        main {
          position: relative;
          z-index: 1;
          padding-top: 80px; /* ヘッダー分の余白確保 */
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        section {
          padding: 6rem 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* ヒーローセクション */
        .hero {
          text-align: center;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          color: var(--text-gray);
          margin-bottom: 2rem;
          font-weight: 300;
        }

        .hero-description {
          max-width: 800px;
          margin: 0 auto 3rem;
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-gray);
        }

        .hero-links {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          display: inline-block;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          border: 2px solid transparent;
        }

        .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: var(--text-light);
          border: 2px solid var(--border);
        }

        .btn-outline:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }

        /* 実績カード */
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .achievement-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s;
        }

        .achievement-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.2);
        }

        .achievement-value {
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }

        .achievement-label {
          font-size: 1rem;
          color: var(--text-gray);
          font-weight: 600;
        }

        /* セクションタイトル */
        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin-bottom: 1rem;
          text-align: center;
        }

        .section-subtitle {
          text-align: center;
          color: var(--text-gray);
          font-size: 1.1rem;
          margin-bottom: 4rem;
        }

        /* プロジェクトフィルター */
        .filter-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .filter-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          color: var(--text-gray);
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
        }

        .filter-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        /* プロジェクトグリッド */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr));
          gap: 2rem;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2.5rem;
          transition: all 0.4s;
          overflow: hidden;
          position: relative;
        }

        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          transform: scaleX(0);
          transition: transform 0.4s;
        }

        .project-card:hover::before {
          transform: scaleX(1);
        }

        .project-card:hover {
          transform: translateY(-8px);
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 20px 60px rgba(37, 99, 235, 0.2);
        }

        .project-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-light);
        }

        .project-description {
          color: var(--text-gray);
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }

        .project-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric {
          text-align: center;
          padding: 1rem;
          background: rgba(37, 99, 235, 0.1);
          border-radius: 8px;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .metric-label {
          font-size: 0.8rem;
          color: var(--text-gray);
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .tech-tag {
          padding: 0.4rem 0.8rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--accent);
        }

        .project-highlights {
          list-style: none;
          padding: 0;
        }

        .project-highlights li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: var(--text-gray);
          font-size: 0.95rem;
        }

        .project-highlights li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: bold;
        }

        /* スキルセクション */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: 2rem;
        }

        .skill-category {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s;
        }

        .skill-category:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }

        .skill-category-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .skill-list {
          list-style: none;
          padding: 0;
        }

        .skill-list li {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
          color: var(--text-gray);
        }

        .skill-list li:last-child {
          border-bottom: none;
        }

        /* フッター */
        footer {
          padding: 4rem 0;
          text-align: center;
          border-top: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.5);
        }

        footer p {
          color: var(--text-gray);
          margin-bottom: 0.5rem;
        }

        /* レスポンシブ - モバイル最適化 */
        @media (max-width: 768px) {
          /* ヘッダー修正 */
          header {
            padding: 0.75rem 0;
          }

          nav {
            padding: 0 1rem;
          }

          /* ハンバーガーメニュー表示 */
          .mobile-menu-btn {
            display: flex;
          }

          /* ナビゲーションリンク - モバイル */
          .nav-links {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            flex-direction: column;
            gap: 0;
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(20px);
            padding: 1rem 0;
            border-bottom: 1px solid var(--border);
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease-in-out;
            pointer-events: none;
          }

          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .nav-links li {
            padding: 0;
            border-bottom: 1px solid var(--border);
          }

          .nav-links li:last-child {
            border-bottom: none;
          }

          .nav-links a {
            display: block;
            padding: 1rem 2rem;
            text-align: center;
          }

          /* メインコンテンツ調整 */
          main {
            padding-top: 60px;
          }

          section {
            padding: 3rem 0;
            min-height: auto;
          }

          .container {
            padding: 0 1rem;
          }

          /* ヒーローセクション */
          .hero-description {
            font-size: 1rem;
          }

          .hero-links {
            flex-direction: column;
            align-items: stretch;
          }

          .btn {
            width: 100%;
            max-width: none;
          }

          /* 実績カード */
          .achievements-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-top: 2rem;
          }

          .achievement-card {
            padding: 1.5rem;
          }

          .achievement-value {
            font-size: 2.5rem;
          }

          /* プロジェクトグリッド */
          .projects-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .project-card {
            padding: 1.5rem;
          }

          /* フィルターボタン */
          .filter-buttons {
            gap: 0.5rem;
          }

          .filter-btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          /* スキルグリッド */
          .skills-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        /* 超小型デバイス */
        @media (max-width: 480px) {
          .hero-title {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.8rem;
          }

          .project-metrics {
            grid-template-columns: 1fr;
          }
        }

        /* スムーズスクロール */
        html {
          scroll-behavior: smooth;
        }

        /* スクロール時のパフォーマンス最適化 */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      <header>
        <nav>
          <div className="logo">H・M</div>
          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="メニュー"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a></li>
            <li><a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a></li>
            <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        {/* ヒーローセクション */}
        <motion.section 
          id="home" 
          className="hero"
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <div className="container">
            <h1 className="hero-title">H・M</h1>
            <p className="hero-subtitle">
              製造業PM 17年 × フルスタックエンジニア
            </p>
            <p className="hero-description">
              エンタープライズ経験と技術実装を融合するProduct Manager。
              17年間の製造業PM経験と、本番運用レベルの技術実装力で、
              企業の課題を正確に理解し、技術で解決します。
            </p>
            
            <div className="hero-links">
              <a href="mailto:contact@example.com" className="btn btn-primary">
                お問い合わせ
              </a>
              <a href="https://github.com/rancorder" target="_blank" className="btn btn-outline">
                GitHub
              </a>
              <a href="https://portfolio-crystal-dreamscape.vercel.app/" target="_blank" className="btn btn-outline">
                Portfolio Site
              </a>
            </div>

            {/* 実績数値 */}
            <motion.div 
              className="achievements-grid"
              variants={staggerContainer}
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
            >
              {[
                { value: '17年', label: 'エンタープライズ営業' },
                { value: '21品番', label: 'プロダクト立上げ' },
                { value: '11ヶ月', label: '24/7システム稼働' },
              ].map((achievement, i) => (
                <motion.div 
                  key={i} 
                  className="achievement-card"
                  variants={fadeInUp}
                >
                  <div className="achievement-value">{achievement.value}</div>
                  <div className="achievement-label">{achievement.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* プロジェクトセクション */}
        <motion.section 
          id="projects"
          ref={projectsRef}
          initial="hidden"
          animate={projectsInView ? "visible" : "hidden"}
        >
          <div className="container">
            <motion.h2 className="section-title" variants={fadeInUp}>
              技術実装の代表事例
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp}>
              本番運用レベルのシステム構築実績
            </motion.p>

            {/* フィルターボタン */}
            <motion.div className="filter-buttons" variants={fadeInUp}>
              {[
                { key: 'all', label: 'すべて' },
                { key: 'backend', label: 'Backend' },
                { key: 'frontend', label: 'Frontend' },
                { key: 'infrastructure', label: 'Infrastructure' },
                { key: 'ml', label: 'ML/AI' },
              ].map(filter => (
                <button
                  key={filter.key}
                  className={`filter-btn ${activeCategory === filter.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </motion.div>

            {/* プロジェクトグリッド */}
            <motion.div 
              className="projects-grid"
              variants={staggerContainer}
            >
              {filteredProjects.map((project, i) => (
                <motion.div 
                  key={project.id} 
                  className="project-card"
                  variants={fadeInUp}
                  initial="hidden"
                  animate={projectsInView ? "visible" : "hidden"}
                  transition={{ delay: i * 0.08 }}
                >
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  {/* メトリクス */}
                  {project.metrics && (
                    <div className="project-metrics">
                      {project.metrics.map((metric, j) => (
                        <div key={j} className="metric">
                          <div className="metric-value">{metric.value}</div>
                          <div className="metric-label">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 技術タグ */}
                  <div className="project-tech">
                    {project.technologies.map((tech, j) => (
                      <span key={j} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  {/* ハイライト */}
                  <ul className="project-highlights">
                    {project.highlights.map((highlight, j) => (
                      <li key={j}>{highlight}</li>
                    ))}
                  </ul>

                  {/* URL */}
                  {project.url && (
                    <a href={project.url} target="_blank" className="btn btn-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>
                      View Project →
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* スキルセクション */}
        <motion.section 
          id="skills"
          ref={skillsRef}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
        >
          <div className="container">
            <motion.h2 className="section-title" variants={fadeInUp}>
              スキルセット
            </motion.h2>
            <motion.p className="section-subtitle" variants={fadeInUp}>
              エンタープライズPMと技術実装の両軸
            </motion.p>

            <motion.div 
              className="skills-grid"
              variants={staggerContainer}
            >
              {skills.map((skillCategory, i) => (
                <motion.div 
                  key={i} 
                  className="skill-category"
                  variants={fadeInUp}
                >
                  <h3 className="skill-category-title">{skillCategory.category}</h3>
                  <ul className="skill-list">
                    {skillCategory.items.map((skill, j) => (
                      <li key={j}>{skill}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTAセクション */}
        <section id="contact" style={{ minHeight: 'auto', padding: '6rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              一緒にプロダクトを作りませんか?
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              製造業17年の経験と本番運用レベルの技術力で、<br />
              貴社のプロダクト成功に貢献します。
            </motion.p>
            <motion.a 
              href="mailto:xzengbu@gmail.com" 
              className="btn btn-primary"
              style={{ marginTop: '2rem' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              お問い合わせ
            </motion.a>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 H・M - Product Manager & Full Stack Engineer</p>
        <p>Powered by Next.js + React + Framer Motion</p>
      </footer>
    </>
  );
}
