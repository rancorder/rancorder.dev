'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { awardAchievement } from './MissionXP';

type RelatedNode={slug:string;title:string;category:string;readTime?:string;xp:number};
interface BlogLayoutProps{
  children:React.ReactNode;title:string;date:string;readTime?:string;tags?:string[];
  category?:string;related?:RelatedNode[];
}

export default function BlogLayout({children,title,date,readTime,tags,category='DEC',related=[]}:BlogLayoutProps){
  const [progress,setProgress]=useState(0);
  const [complete,setComplete]=useState(false);

  useEffect(()=>{
    awardAchievement('case');
    const onScroll=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      const next=max>0?Math.min(100,Math.round(window.scrollY/max*100)):100;
      setProgress(next);
      if(next>=88)setComplete(true);
    };
    onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);

  return <main className="intel-file intel-graph-file">
    <div className="vault-grid-bg" aria-hidden="true"/><div className="vault-scan" aria-hidden="true"/>
    <div className="intel-progress"><i style={{width:progress+'%'}}/><span>{progress}% DECODED</span></div>
    <nav className="intel-nav"><Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <div><Link href="/blog">KNOWLEDGE VAULT</Link><span>/</span><b>{category} INTEL</b></div></nav>

    <section className="intel-shell">
      <header className="intel-header">
        <div className="intel-header-meta"><span>CLASSIFIED KNOWLEDGE RECORD / {category}</span><b>ACCESS / GRANTED</b></div>
        <h1>{title}</h1>
        <div className="intel-data-row">
          <div><small>PUBLISHED</small><b>{date}</b></div><div><small>READ TIME</small><b>{readTime||'UNKNOWN'}</b></div>
          <div><small>KNOWLEDGE PATH</small><b>{category} → DECISION</b></div><div><small>DECODE</small><b className="intel-live">{progress}%</b></div>
        </div>
        {tags&&tags.length>0&&<div className="intel-tags">{tags.map(tag=><span key={tag}>{tag}</span>)}</div>}
      </header>

      <div className="intel-layout">
        <aside className="intel-sidebar"><div className="intel-sidebar-box"><span>READING PROTOCOL</span>
          <p>情報ではなく「何を判断材料にするか」を回収する。</p><ul><li><i/> RISK SIGNAL</li><li><i/> DECISION</li><li><i/> OPERATING PRINCIPLE</li></ul>
          <div className="intel-mini-progress"><span>DECODE</span><b>{progress}%</b><i><em style={{width:progress+'%'}}/></i></div>
        </div><Link href="/blog" className="intel-back">← RETURN TO VAULT</Link></aside>
        <article className="intel-article"><div className="blog-content-wrapper">{children}</div></article>
      </div>

      <section className={'next-intel '+(complete?'unlocked':'')}>
        <header><div><span>KNOWLEDGE GRAPH / NEXT INTEL NODE</span><h2>{complete?'ROUTE UNLOCKED':'ROUTE DETECTED'}</h2></div><b>{complete?'✓ ARTICLE DECODED':'⌁ READ TO UNLOCK'}</b></header>
        <div className="knowledge-route" aria-hidden="true"><i/><span className="current-node">{category}</span><em>→</em>{related.map((n,i)=><span key={n.slug} className={'route-node n'+i}>{n.category}</span>)}</div>
        <div className="next-intel-grid">
          {related.map((node,index)=><Link href={'/blog/'+node.slug} key={node.slug} className={'next-intel-card n'+index}>
            <div><span>NODE {String(index+1).padStart(2,'0')}</span><b>{node.category}</b></div><h3>{node.title}</h3>
            <footer><span>{node.readTime||'INTEL'}</span><strong>+{node.xp} XP</strong><b>DECODE ↗</b></footer>
          </Link>)}
        </div>
        <div className="next-intel-actions"><Link href="/survival-test">RUN SURVIVAL TEST <b>→</b></Link><Link href="/blog">EXPLORE FULL GRAPH <b>↗</b></Link></div>
      </section>
    </section>
  </main>;
}
