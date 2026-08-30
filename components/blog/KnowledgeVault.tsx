'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { awardAchievement } from '../MissionXP';

type Post = {
  slug:string;
  title:string;
  date:string;
  excerpt?:string;
  readingTime?:string;
  tags:string[];
  category:string;
};

const categoryMeta = {
  production:{label:'PoC → Production',code:'P2P',color:'green',desc:'動くデモを、本番で止まらない運用へ。'},
  decision:{label:'Decision Architecture',code:'DEC',color:'purple',desc:'曖昧な案件で、何を誰が決めるか。'},
  reliability:{label:'Automation Reliability',code:'REL',color:'yellow',desc:'自動化を「動く」から「任せられる」へ。'},
  dx:{label:'DX / Operating Model',code:'DX',color:'cyan',desc:'ツール導入を、業務変革と現場定着へ。'},
} as const;

type Key = keyof typeof categoryMeta;

function TypewriterTitle({ text, active, delay = 0 }: { text:string; active:boolean; delay?:number }) {
  const [shown,setShown] = useState(active ? '' : text);

  useEffect(()=>{
    if(!active){ setShown(text); return; }
    setShown('');
    let index = 0;
    let timer: number | undefined;
    const start = window.setTimeout(()=>{
      timer = window.setInterval(()=>{
        index += 1;
        setShown(text.slice(0,index));
        if(index >= text.length && timer) window.clearInterval(timer);
      }, 24);
    }, delay);
    return ()=>{
      window.clearTimeout(start);
      if(timer) window.clearInterval(timer);
    };
  },[text,active,delay]);

  return <span className="vault-typewriter" aria-label={text}>{shown}<i aria-hidden="true" /></span>;
}

export default function KnowledgeVault({ posts }:{ posts:Post[] }){
  const [filter,setFilter] = useState<'all'|Key>('all');
  const [query,setQuery] = useState('');
  const [view,setView] = useState<'grid'|'terminal'>('grid');
  const [hovered,setHovered] = useState<string | null>(null);

  useEffect(()=>{
    const category = new URLSearchParams(window.location.search).get('category');
    if(category === 'production' || category === 'decision' || category === 'reliability' || category === 'dx') {
      setFilter(category);
    }
  },[]);

  const filtered = useMemo(()=>posts.filter(p=>{
    const cat = filter==='all'||p.category===filter;
    const q = !query || [p.title,p.excerpt||'',...p.tags].join(' ').toLowerCase().includes(query.toLowerCase());
    return cat&&q;
  }),[posts,filter,query]);

  const counts = useMemo(()=>Object.fromEntries((Object.keys(categoryMeta) as Key[]).map(k=>[k,posts.filter(p=>p.category===k).length])),[posts]);
  const featured = posts.slice(0,3);

  return <main className="knowledge-vault">
    <div className="vault-grid-bg" aria-hidden="true" />
    <div className="vault-scan" aria-hidden="true" />

    <nav className="vault-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <div className="vault-nav-state"><i/> KNOWLEDGE VAULT ONLINE <b>{posts.length} RECORDS</b></div>
    </nav>

    <section className="vault-shell">
      <header className="vault-hero">
        <div className="vault-hero-copy">
          <span>KNOWLEDGE SYSTEM / ACCESS LEVEL 04</span>
          <h1>READ.<br/><em>DECODE.</em><br/>DECIDE.</h1>
          <p>記事を読む場所ではなく、Technical PMの判断パターンを探索するKnowledge Vault。</p>
        </div>
        <aside className="vault-status">
          <header><span>VAULT STATUS</span><b>LIVE</b></header>
          {(Object.keys(categoryMeta) as Key[]).map(k=><div key={k}>
            <small>{categoryMeta[k].code}</small><span>{categoryMeta[k].label}</span><b>{String(counts[k]).padStart(2,'0')}</b>
          </div>)}
          <footer><span>TOTAL KNOWLEDGE NODES</span><b>{String(posts.length).padStart(2,'0')}</b></footer>
        </aside>
      </header>

      <section className="vault-featured">
        <div className="vault-section-label"><span>01</span><b>PRIORITY INTEL</b><i>START HERE</i></div>
        <div className="vault-featured-grid">
          {featured.map((p,index)=>{
            const meta = categoryMeta[p.category as Key] || categoryMeta.decision;
            return <Link
              key={p.slug}
              href={'/blog/'+p.slug}
              className={'vault-feature-card '+meta.color+' v'+index}
              onClick={()=>awardAchievement('case')}
              onMouseEnter={()=>setHovered('featured-'+p.slug)}
              onMouseLeave={()=>setHovered(null)}
              onFocus={()=>setHovered('featured-'+p.slug)}
              onBlur={()=>setHovered(null)}
            >
              <div className="vault-card-beam" aria-hidden="true" />
              <div className="vault-card-corners" aria-hidden="true"><i/><i/><i/><i/></div>
              <div className="vault-card-top">
                <span>INTEL {String(index+1).padStart(2,'0')}</span>
                <b>{meta.code}</b>
              </div>
              <div className="vault-card-signal"><i/><span>{meta.label}</span><em>SYNCED</em></div>
              <h2><TypewriterTitle text={p.title} active={hovered==='featured-'+p.slug || hovered===null} delay={index*180} /></h2>
              <p>{p.excerpt}</p>
              <div className="vault-card-meter"><i style={{width:(72-index*9)+'%'}} /></div>
              <div className="vault-card-foot"><span>{p.readingTime||'READ'}</span><time>{p.date}</time><b>OPEN INTEL ↗</b></div>
            </Link>;
          })}
        </div>
      </section>

      <section className="vault-explorer">
        <div className="vault-section-label"><span>02</span><b>KNOWLEDGE MAP</b><i>{filtered.length} NODES FOUND</i></div>

        <div className="vault-controls">
          <div className="vault-tabs">
            <button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>ALL <i>{posts.length}</i></button>
            {(Object.keys(categoryMeta) as Key[]).map(k=><button key={k} className={filter===k?('active '+categoryMeta[k].color):''} onClick={()=>setFilter(k)}>{categoryMeta[k].code} <i>{counts[k]}</i></button>)}
          </div>
          <div className="vault-tools">
            <label><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="SEARCH KNOWLEDGE..." /></label>
            <button onClick={()=>setView(view==='grid'?'terminal':'grid')}>{view==='grid'?'≡ TERMINAL':'▦ GRID'}</button>
          </div>
        </div>

        <div className={view==='grid'?'vault-post-grid':'vault-terminal-list'}>
          {filtered.map((p,index)=>{
            const meta=categoryMeta[p.category as Key]||categoryMeta.decision;
            return <Link
              href={'/blog/'+p.slug}
              key={p.slug}
              className={'vault-post '+meta.color}
              onClick={()=>awardAchievement('case')}
              onMouseEnter={()=>setHovered(p.slug)}
              onMouseLeave={()=>setHovered(null)}
              onFocus={()=>setHovered(p.slug)}
              onBlur={()=>setHovered(null)}
            >
              <div className="vault-post-scan" aria-hidden="true" />
              <div className="vault-post-index"><span>{String(index+1).padStart(2,'0')}</span><i/></div>
              <div className="vault-post-main">
                <div className="vault-post-meta"><b>{meta.code}</b><time>{p.date}</time><span>{hovered===p.slug?'DECRYPTING':'READY'}</span></div>
                <h3><TypewriterTitle text={p.title} active={hovered===p.slug} /></h3>
                {view==='grid'&&<p>{p.excerpt}</p>}
                <div className="vault-tags">{p.tags.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>
              </div>
              <strong>{hovered===p.slug?'OPEN':'↗'}</strong>
            </Link>;
          })}
        </div>
      </section>
    </section>
  </main>;
}
