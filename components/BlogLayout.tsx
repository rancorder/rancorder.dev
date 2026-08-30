'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { awardAchievement } from './MissionXP';

interface BlogLayoutProps {
  children: React.ReactNode;
  title: string;
  date: string;
  readTime?: string;
  tags?: string[];
}

export default function BlogLayout({ children, title, date, readTime, tags }: BlogLayoutProps) {
  useEffect(()=>{ awardAchievement('case'); },[]);

  return (
    <main className="intel-file">
      <div className="vault-grid-bg" aria-hidden="true" />
      <div className="vault-scan" aria-hidden="true" />

      <nav className="intel-nav">
        <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
        <div><Link href="/blog">KNOWLEDGE VAULT</Link><span>/</span><b>INTEL FILE</b></div>
      </nav>

      <section className="intel-shell">
        <header className="intel-header">
          <div className="intel-header-meta">
            <span>CLASSIFIED KNOWLEDGE RECORD</span>
            <b>ACCESS / GRANTED</b>
          </div>
          <h1>{title}</h1>
          <div className="intel-data-row">
            <div><small>PUBLISHED</small><b>{date}</b></div>
            <div><small>READ TIME</small><b>{readTime || 'UNKNOWN'}</b></div>
            <div><small>SIGNAL TYPE</small><b>DECISION INTEL</b></div>
            <div><small>STATUS</small><b className="intel-live">VERIFIED</b></div>
          </div>
          {tags && tags.length > 0 && <div className="intel-tags">{tags.map(tag=><span key={tag}>{tag}</span>)}</div>}
        </header>

        <div className="intel-layout">
          <aside className="intel-sidebar">
            <div className="intel-sidebar-box">
              <span>READING PROTOCOL</span>
              <p>情報ではなく「何を判断材料にするか」を回収する。</p>
              <ul>
                <li><i/> RISK SIGNAL</li>
                <li><i/> DECISION</li>
                <li><i/> OPERATING PRINCIPLE</li>
              </ul>
            </div>
            <Link href="/blog" className="intel-back">← RETURN TO VAULT</Link>
          </aside>

          <article className="intel-article">
            <div className="blog-content-wrapper">{children}</div>
          </article>
        </div>

        <footer className="intel-footer">
          <div><span>INTEL FILE COMPLETE</span><p>この知識を案件判断へ接続する。</p></div>
          <div className="intel-footer-actions">
            <Link href="/survival-test">RUN READINESS TEST →</Link>
            <Link href="/blog">OPEN NEXT INTEL ↗</Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
