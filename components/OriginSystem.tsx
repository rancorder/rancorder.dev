'use client';

import { useEffect, useRef, useState } from 'react';

const levels=[
 {id:'01',era:'2008 — 2026',code:'FACTORY FLOOR',title:'製造現場と経営の間で、工程を直す。',desc:'18年間、製造・業務改善・システム導入・業務設計・データ活用を経験。勘ではなく、工程を分解して詰まりを見る思考の原型。',unlock:'PROCESS DECOMPOSITION',meta:'18 YEARS / OPERATIONAL IMPROVEMENT'},
 {id:'02',era:'PARALLEL',code:'SALES OPERATIONS',title:'営業を「個人技」ではなく工程として見る。',desc:'複数案件を横断し、KPI・架電・商談状況を分析。リスト評価、改善施策、Knowledge化までを管理・改善側から設計。',unlock:'SIGNAL → DECISION',meta:'TARGET / ACTION / ANALYZE / IMPROVE / KNOWLEDGE'},
 {id:'03',era:'2026 — PRESENT',code:'AI / DX DELIVERY',title:'PoCの先にある、責任と運用を設計する。',desc:'顧客課題整理、要件定義、PoC設計、開発推進、ステークホルダー調整。本番で誰が判断し、どう戻すかまでを設計対象へ。',unlock:'PRODUCTION BOUNDARY',meta:'BUSINESS × TECHNOLOGY × OPERATIONS'},
] as const;

export default function OriginSystem(){
 const ref=useRef<HTMLElement>(null);
 const [active,setActive]=useState(0);
 useEffect(()=>{
  const node=ref.current;if(!node)return;
  const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setActive(3)},{threshold:.28});
  obs.observe(node);return()=>obs.disconnect();
 },[]);
 return <section className="origin-system" ref={ref} id="origin">
  <header className="origin-head">
   <div><span>01 / ORIGIN SYSTEM</span><h2>この判断OSは、<br/><em>どこで作られたのか。</em></h2></div>
   <p>対象は製造、営業、DXへ変わった。やっていることは一貫している。<strong>複雑な仕事を工程に分け、詰まりを見つけ、再現可能な仕組みに変える。</strong></p>
  </header>
  <div className="origin-console">
   <div className="origin-rail" aria-hidden="true"><i/><b style={{height:(active/3*100)+'%'}}/></div>
   {levels.map((x,i)=><article key={x.id} className={active>i?'unlocked':''}>
    <div className="origin-level"><span>LEVEL {x.id}</span><small>{x.era}</small></div>
    <div className="origin-body"><small>{x.code}</small><h3>{x.title}</h3><p>{x.desc}</p><b>{x.meta}</b></div>
    <div className="origin-unlock"><span>{active>i?'ABILITY UNLOCKED':'LOCKED'}</span><strong>{x.unlock}</strong><i>{active>i?'✓':'◇'}</i></div>
   </article>)}
  </div>
  <div className={'origin-class '+(active===3?'online':'')}>
   <div><small>CURRENT CLASS</small><strong>MISSION ARCHITECT</strong></div>
   <p><span>PROCESS</span><i>×</i><span>DECISION</span><i>×</i><span>PRODUCTION</span><b>→</b><em>TECHNICAL PM</em></p>
   <div className="origin-class-state"><i/> OS COMPILED / READY</div>
  </div>
 </section>;
}
