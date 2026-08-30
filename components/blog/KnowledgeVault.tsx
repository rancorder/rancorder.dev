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
  production:{label:'PoC → Production',code:'P2P',color:'green'},
  decision:{label:'Decision Architecture',code:'DEC',color:'purple'},
  reliability:{label:'Automation Reliability',code:'REL',color:'yellow'},
  dx:{label:'DX / Operating Model',code:'DX',color:'cyan'},
} as const;

type Key = keyof typeof categoryMeta;
type Rarity = 'COMMON'|'RARE'|'EPIC'|'LEGENDARY';

const rarityMeta: Record<Rarity,{marks:string;xp:number}> = {
  COMMON:{marks:'◇',xp:120},
  RARE:{marks:'◆◆',xp:140},
  EPIC:{marks:'◆◆◆',xp:160},
  LEGENDARY:{marks:'✦✦✦✦',xp:200},
};

function TypewriterTitle({text,active,delay=0}:{text:string;active:boolean;delay?:number}){
  const [shown,setShown]=useState(active?'':text);
  useEffect(()=>{
    if(!active){setShown(text);return;}
    setShown('');
    let index=0;
    let timer:number|undefined;
    const start=window.setTimeout(()=>{
      timer=window.setInterval(()=>{
        index+=1;
        setShown(text.slice(0,index));
        if(index>=text.length&&timer)window.clearInterval(timer);
      },22);
    },delay);
    return()=>{window.clearTimeout(start);if(timer)window.clearInterval(timer);};
  },[text,active,delay]);
  return <span className="vault-typewriter" aria-label={text}>{shown}<i aria-hidden="true"/></span>;
}

function rarityFor(post:Post,index:number):Rarity{
  const signal=[post.title,...post.tags].join(' ').toLowerCase();
  if(/本番|production|設計思想|意思決定|信頼性|dx|運用/.test(signal)&&index%5===0)return 'LEGENDARY';
  if(index%4===0)return 'EPIC';
  if(index%2===0)return 'RARE';
  return 'COMMON';
}

function minutesOf(value?:string){
  const n=Number((value||'').match(/\d+/)?.[0]||8);
  return Number.isFinite(n)?n:8;
}

export default function KnowledgeVault({posts}:{posts:Post[]}){
  const [filter,setFilter]=useState<'all'|Key>('all');
  const [query,setQuery]=useState('');
  const [view,setView]=useState<'grid'|'terminal'>('grid');
  const [hovered,setHovered]=useState<string|null>(null);
  const [sort,setSort]=useState<'latest'|'xp'>('latest');

  useEffect(()=>{
    const category=new URLSearchParams(window.location.search).get('category');
    if(category==='production'||category==='decision'||category==='reliability'||category==='dx')setFilter(category);
  },[]);

  const counts=useMemo(()=>Object.fromEntries((Object.keys(categoryMeta) as Key[]).map(k=>[k,posts.filter(p=>p.category===k).length])),[posts]);
  const totalMinutes=useMemo(()=>posts.reduce((s,p)=>s+minutesOf(p.readingTime),0),[posts]);

  const filtered=useMemo(()=>{
    const base=posts.filter(p=>{
      const cat=filter==='all'||p.category===filter;
      const q=!query||[p.title,p.excerpt||'',...p.tags].join(' ').toLowerCase().includes(query.toLowerCase());
      return cat&&q;
    });
    if(sort==='xp')return [...base].sort((a,b)=>rarityMeta[rarityFor(b,posts.indexOf(b))].xp-rarityMeta[rarityFor(a,posts.indexOf(a))].xp);
    return base;
  },[posts,filter,query,sort]);

  const featured=posts.slice(0,3);

  return <main className="knowledge-vault vault-v2">
    <div className="vault-grid-bg" aria-hidden="true"/>
    <div className="vault-scan" aria-hidden="true"/>

    <nav className="vault-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <div className="vault-top-tabs">
        <Link href="/">MISSION</Link><Link href="/#cases">CASE</Link><Link href="/survival-test">SURVIVAL TEST</Link><b>BLOG</b>
      </div>
      <div className="vault-nav-state"><i/> VAULT ONLINE <b>{posts.length} RECORDS</b></div>
    </nav>

    <section className="vault-shell vault-shell-v2">
      <header className="vault-dashboard-hero">
        <div className="vault-dashboard-copy">
          <span>⌁ KNOWLEDGE VAULT ///</span>
          <h1><strong>READ.</strong> <em>DECODE.</em> <i>DECIDE.</i></h1>
          <p>現場で得た知見を、再現可能な判断知としてストックする。</p>
          <div className="vault-hero-stats">
            <div><strong>{posts.length}</strong><span>ARTICLES</span></div>
            <div><strong>4</strong><span>CATEGORIES</span></div>
            <div><strong>{posts.length*100+40}</strong><span>TOTAL READS</span></div>
            <div><strong>{Math.round(totalMinutes/60*10)/10}h</strong><span>TOTAL READ TIME</span></div>
          </div>
        </div>

        <aside className="vault-status vault-status-v2">
          <header><span>VAULT STATUS</span><b>{'// LIVE FEED'}</b></header>
          {(Object.keys(categoryMeta) as Key[]).map(k=><div key={k} className={categoryMeta[k].color}>
            <small>{categoryMeta[k].code}</small><span>{categoryMeta[k].label}</span><b>{counts[k]}</b>
          </div>)}
          <footer><span>STATUS</span><b>ONLINE</b></footer>
        </aside>
      </header>

      <div className="vault-main-layout">
        <div className="vault-main-column">
          <section className="vault-featured vault-featured-v2">
            <div className="vault-section-label"><span>01</span><b>PRIORITY INTEL</b><i>LIVE RECOMMENDATION ⚡</i></div>
            <div className="vault-featured-grid">
              {featured.map((p,index)=>{
                const meta=categoryMeta[p.category as Key]||categoryMeta.decision;
                const rarity=(['LEGENDARY','EPIC','RARE'] as Rarity[])[index]||'RARE';
                return <Link key={p.slug} href={'/blog/'+p.slug}
                  className={'vault-feature-card '+meta.color+' v'+index}
                  onClick={()=>awardAchievement('case')}
                  onMouseEnter={()=>setHovered('featured-'+p.slug)}
                  onMouseLeave={()=>setHovered(null)}>
                  <div className="vault-card-visual" aria-hidden="true">
                    <div className="vault-orbit o1"/><div className="vault-orbit o2"/><div className="vault-orbit o3"/>
                    <div className="vault-visual-core">{meta.code}</div>
                    <i className="spark s1"/><i className="spark s2"/><i className="spark s3"/>
                  </div>
                  <div className="vault-card-top"><span>{index===0?'★ TOP PICK':'INTEL '+String(index+1).padStart(2,'0')}</span><b>{meta.code}</b></div>
                  <div className="vault-card-rarity">{rarity} <i>{rarityMeta[rarity].marks}</i></div>
                  <h2><TypewriterTitle text={p.title} active={hovered==='featured-'+p.slug||hovered===null} delay={index*160}/></h2>
                  <p>{p.excerpt}</p>
                  <div className="vault-card-foot"><span>{p.readingTime||'8 min read'}</span><b>+{rarityMeta[rarity].xp} XP</b><strong>OPEN INTEL ↗</strong></div>
                </Link>;
              })}
            </div>
          </section>

          <section className="vault-explorer vault-explorer-v2">
            <div className="vault-controls vault-controls-v2">
              <div className="vault-tabs">
                <button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>ALL</button>
                {(Object.keys(categoryMeta) as Key[]).map(k=><button key={k} className={filter===k?('active '+categoryMeta[k].color):''} onClick={()=>setFilter(k)}>{categoryMeta[k].code}</button>)}
              </div>
              <div className="vault-tools">
                <label><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="記事を検索..."/></label>
                <button onClick={()=>setView(view==='grid'?'terminal':'grid')}>{view==='grid'?'▦ GRID':'≡ TERMINAL'}</button>
                <button onClick={()=>setSort(sort==='latest'?'xp':'latest')}>{sort==='latest'?'最新順':'XP順'}⌄</button>
              </div>
            </div>

            <div className={view==='grid'?'vault-post-grid vault-post-grid-v2':'vault-terminal-list'}>
              {filtered.map((p,index)=>{
                const meta=categoryMeta[p.category as Key]||categoryMeta.decision;
                const rarity=rarityFor(p,index);
                const rarityInfo=rarityMeta[rarity];
                return <Link href={'/blog/'+p.slug} key={p.slug}
                  className={'vault-post vault-post-v2 '+meta.color+' rarity-'+rarity.toLowerCase()}
                  onClick={()=>awardAchievement('case')}
                  onMouseEnter={()=>setHovered(p.slug)}
                  onMouseLeave={()=>setHovered(null)}>
                  <div className="vault-post-scan" aria-hidden="true"/>
                  <div className="vault-post-rarity"><span>{rarity}</span><i>{rarityInfo.marks}</i><b>{meta.code}</b></div>
                  <div className="vault-mini-visual" aria-hidden="true"><span>{meta.code}</span><i/><i/><i/></div>
                  <div className="vault-post-main">
                    <h3><TypewriterTitle text={p.title} active={hovered===p.slug}/></h3>
                    {view==='grid'&&<p>{p.excerpt}</p>}
                    <div className="vault-post-meta"><time>{p.readingTime||'8 min read'}</time><span>{p.date}</span></div>
                  </div>
                  <div className="vault-post-bottom"><b>+{rarityInfo.xp} XP</b><strong>{hovered===p.slug?'READ INTEL →':'OPEN ↗'}</strong></div>
                </Link>;
              })}
            </div>
          </section>
        </div>

        <aside className="vault-protocol">
          <header><span>VAULT</span><b>PROTOCOL</b></header>
          <div className="protocol-cube" aria-hidden="true"><i/><i/><i/></div>
          <section><span>CATEGORY SIGNAL</span>
            {(Object.keys(categoryMeta) as Key[]).map((k,i)=><div className={'signal-line '+categoryMeta[k].color} key={k}><i style={{width:(58+i*9)+'%'}}/></div>)}
          </section>
          <section><span>INTEL FEED</span><b>NEW ARTICLE</b><p>{posts[0]?.date||'--'}</p></section>
          <section><span>TRENDING</span><b>P2P</b><p>PoC運用の責任境界</p></section>
          <section><span>TRENDING</span><b>DX</b><p>業務変革の定着</p></section>
          <footer><span>SYSTEM</span><b>ONLINE</b></footer>
        </aside>
      </div>
    </section>
  </main>;
}
