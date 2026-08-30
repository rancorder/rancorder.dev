'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Demo = {
  id:string; title:string; desc:string; tech:string; level:number; color:string; type:string; filename:string; demoUrl:string;
};

export default function LabPage(){
  const [demos,setDemos]=useState<Demo[]>([]);
  const [mode,setMode]=useState<'all'|'systems'|'after'>('all');

  useEffect(()=>{fetch('/api/demos').then(r=>r.json()).then(d=>setDemos(d.demos||[])).catch(()=>setDemos([]));},[]);

  const tagged = useMemo(()=>demos.map(d=>{
    const game = /neon-|space-|doom|study-rpg|timeline-tycoon/i.test(d.filename) || d.type==='game';
    const featured = /scraping-visualizer|algorithm-visualizer|evolution-simulator-pro/i.test(d.filename);
    return {...d,game,featured};
  }),[demos]);

  const visible = tagged.filter(d=>mode==='all'||(mode==='systems'&&!d.game)||(mode==='after'&&d.game));
  const featured = tagged.filter(d=>d.featured);

  return <main className="lab-page">
    <div className="lab-grid-bg" />
    <nav className="lab-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <div><Link href="/">MISSION CONTROL</Link><span>/</span><b>LAB</b></div>
    </nav>

    <section className="lab-shell">
      <header className="lab-hero">
        <div className="mc-section-tag purple">EXPERIMENTAL SYSTEMS / AFTER HOURS</div>
        <h1>LAB<span>.</span></h1>
        <p>本業の信号を濁らせず、実装・可視化・遊びの実験だけを残す場所。</p>
      </header>

      <section className="lab-featured">
        <div className="lab-section-head">
          <div><span>01</span><h2>SELECTED SYSTEMS</h2></div>
          <p>専門性と接続できる3作品。</p>
        </div>
        <div className="lab-featured-grid">
          {featured.map((d)=><a href={d.demoUrl} target="_blank" rel="noreferrer" key={d.id} className="lab-featured-card">
            <span>FEATURED</span><h3>{d.title}</h3><p>{d.desc}</p><small>{d.tech}</small><b>OPEN SYSTEM ↗</b>
          </a>)}
        </div>
      </section>

      <section className="lab-archive">
        <div className="lab-section-head">
          <div><span>02</span><h2>ARCHIVE</h2></div>
          <div className="lab-tabs">
            <button className={mode==='all'?'active':''} onClick={()=>setMode('all')}>ALL</button>
            <button className={mode==='systems'?'active':''} onClick={()=>setMode('systems')}>SYSTEMS</button>
            <button className={mode==='after'?'active':''} onClick={()=>setMode('after')}>AFTER HOURS</button>
          </div>
        </div>

        <div className="lab-list">
          {visible.map((d,i)=><a href={d.demoUrl} target="_blank" rel="noreferrer" key={d.id} className="lab-row">
            <span>{String(i+1).padStart(2,'0')}</span>
            <div><h3>{d.title}</h3><p>{d.desc}</p></div>
            <small>{d.game?'AFTER HOURS':'SYSTEM'}</small>
            <b>↗</b>
          </a>)}
        </div>
      </section>
    </section>
  </main>;
}
