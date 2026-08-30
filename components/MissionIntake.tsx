'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Sector='manufacturing'|'sales'|'dx';
const data={
 manufacturing:{code:'MFG-AI',title:'AI / PoCを本番運用へ',risk:'AI ERROR BOUNDARY',href:'/survival-test?s=mfg'},
 sales:{code:'SALES-OPS',title:'営業支援PoCを判断運用へ',risk:'SIGNAL INTEGRITY',href:'/survival-test?s=sales'},
 dx:{code:'DX-OPS',title:'DXを現場定着へ',risk:'ADOPTION GAP',href:'/survival-test?s=dx'},
} as const;

export default function MissionIntake(){
 const [sector,setSector]=useState<Sector>('manufacturing');
 const [problem,setProblem]=useState('');
 useEffect(()=>{
  const saved=localStorage.getItem('rancorder-mission');
  if(saved==='manufacturing'||saved==='sales'||saved==='dx')setSector(saved);
  const fn=(e:Event)=>{const s=(e as CustomEvent<{sector:Sector}>).detail?.sector;if(s)setSector(s);};
  addEventListener('mission-sector-change',fn);return()=>removeEventListener('mission-sector-change',fn);
 },[]);
 const x=data[sector];
 const href=x.href+(problem.trim()?'&q='+encodeURIComponent(problem.trim().slice(0,180)):'');
 return <section className={'mission-intake sector-'+sector} id="mission-intake">
  <header><span>05 / BRING YOUR MISSION</span><b>INTAKE CHANNEL / OPEN</b></header>
  <div className="mission-intake-grid">
   <div className="intake-copy"><small>UNKNOWN MISSION DETECTED</small><h2>あなたの案件を、<br/><em>ここに投入してください。</em></h2>
    <p>完成した要件書は不要です。「何か詰まっている」だけで十分。まず構造を分解します。</p>
    <div className="intake-example"><span>EXAMPLE INPUT</span><p>「AIのPoCは動いた。でも本番で誰が責任を持つか決まっていない」</p></div>
   </div>
   <div className="intake-console">
    <div className="intake-state"><i/><span>ACTIVE ROUTE</span><b>{x.code}</b></div>
    <label><span>MISSION SIGNAL / 任意</span><textarea value={problem} onChange={e=>setProblem(e.target.value)} maxLength={180} placeholder="いま案件で一番詰まっていることを1〜2行で..." /></label>
    <div className="intake-analysis"><div><small>TARGET</small><b>{x.title}</b></div><div><small>FIRST SCAN</small><b>{x.risk}</b></div></div>
    <Link href={href}>ANALYZE MY MISSION <b>→</b></Link>
    <small className="intake-note">NO LOGIN / 案件名・個人情報は入力不要</small>
   </div>
  </div>
 </section>;
}
