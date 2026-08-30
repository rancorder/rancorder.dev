'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const achievementXP: Record<string,number> = {
  sector:40, case:80, diagnostic:160, recovery:120, brief:100, incident:200,
};

const missionLabel: Record<string,string> = {
  manufacturing:'MFG AI',
  sales:'SALES OPS',
  dx:'DX',
};

export default function WelcomeBack(){
  const [show,setShow]=useState(false);
  const [earned,setEarned]=useState<string[]>([]);
  const [mission,setMission]=useState('manufacturing');

  useEffect(()=>{
    const seen=window.localStorage.getItem('rancorder-visited');
    const achievements=JSON.parse(window.localStorage.getItem('rancorder-achievements')||'[]') as string[];
    const savedMission=window.localStorage.getItem('rancorder-mission')||'manufacturing';

    window.localStorage.setItem('rancorder-visited','1');
    setEarned(achievements);
    setMission(savedMission);

    if(seen){
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const timer=window.setTimeout(()=>setShow(true),reduced?150:700);
      return()=>window.clearTimeout(timer);
    }
  },[]);

  const xp=useMemo(()=>earned.reduce((sum,id)=>sum+(achievementXP[id]||0),0),[earned]);
  const rank=xp>=500?'MISSION ARCHITECT':xp>=250?'SYSTEM OPERATOR':xp>=80?'RISK SCOUT':'OBSERVER';
  const href=mission==='sales'?'/survival-test?s=sales':mission==='dx'?'/survival-test?s=dx':'/survival-test?s=mfg';

  if(!show)return null;

  return <aside className="welcome-back" role="status" aria-live="polite">
    <div className="welcome-back-glow" aria-hidden="true"/>
    <header>
      <span>RETURNING OPERATOR DETECTED</span>
      <button type="button" onClick={()=>setShow(false)} aria-label="閉じる">×</button>
    </header>
    <div className="welcome-back-main">
      <small>WELCOME BACK</small>
      <h2>おかえりなさい、OPERATOR。</h2>
      <p>前回のMission状態を復元しました。続きから再開できます。</p>
      <div className="welcome-back-stats">
        <div><span>LAST MISSION</span><b>{missionLabel[mission]||'MFG AI'}</b></div>
        <div><span>MISSION XP</span><b>{xp}<i>/700</i></b></div>
        <div><span>RANK</span><b>{rank}</b></div>
      </div>
    </div>
    <footer>
      <Link href={href} onClick={()=>setShow(false)}>RESUME MISSION →</Link>
      <Link href="/blog" onClick={()=>setShow(false)}>OPEN KNOWLEDGE VAULT ↗</Link>
    </footer>
  </aside>;
}
