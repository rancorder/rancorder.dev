'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Sector='manufacturing'|'sales';
const copy={
 manufacturing:{tag:'TECHNICAL PM / AI DELIVERY / MANUFACTURING B2B',eyebrow:'PROJECT MISSION CONTROL / MFG-AI',line1:'PoCを、',line2:'止まらない運用へ。',body:'曖昧な要件とAIの不確実性。責任・誤判定・監視・復旧を設計し、「動くAI」を「使い続けられるシステム」へ移行します。',primary:'AI本番導入を見る',href:'/cases/ai-production-delivery'},
 sales:{tag:'TECHNICAL PM / SALES OPS / AUTOMATION',eyebrow:'PROJECT MISSION CONTROL / SALES-OPS',line1:'営業PoCを、',line2:'判断が回る運用へ。',body:'架電データ・音声・アポ・KPIの分断。取りこぼし・鮮度・配布境界を設計し、「集めるPoC」を「営業判断が動く運用」へ移行します。',primary:'営業支援PoCを見る',href:'/cases/sales-support-poc-operations'},
} as const;

export default function AdaptiveHeroCopy(){
 const [sector,setSector]=useState<Sector>('manufacturing');
 useEffect(()=>{
  const saved=window.localStorage.getItem('rancorder-mission');if(saved==='manufacturing'||saved==='sales')setSector(saved);
  const onSector=(e:Event)=>{const s=(e as CustomEvent<{sector:Sector}>).detail?.sector;if(s)setSector(s);};
  window.addEventListener('mission-sector-change',onSector);return()=>window.removeEventListener('mission-sector-change',onSector);
 },[]);
 const x=copy[sector];
 return <div className={`adaptive-hero-copy sector-${sector}`} key={sector}>
   <div className="adaptive-sector-tag">{x.tag}</div>
   <div className="mc-eyebrow">{x.eyebrow}</div>
   <h1>{x.line1}<br/><span>{x.line2}</span></h1>
   <p>{x.body}</p>
   <div className="mc-actions"><Link className="mc-primary" href={x.href}>{x.primary} <span>↘</span></Link><Link className="mc-secondary" href={`/survival-test?s=${sector==='sales'?'sales':'mfg'}`}>案件の詰まりを診断する <span>→</span></Link></div>
 </div>;
}
