'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const boot = [
  'BOOT / PROJECT MISSION CONTROL',
  'LOADING / DECISION ENGINE',
  'CHECKING / RESPONSIBILITY BOUNDARY',
  'CHECKING / OBSERVABILITY',
  'RISK SIGNALS / 02 DETECTED',
  'SYSTEM / READY',
];

export default function HeroMissionConsole(){
  const [line,setLine] = useState(0);
  const [ready,setReady] = useState(false);
  const [pulse,setPulse] = useState(0);

  useEffect(()=>{
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){ setLine(boot.length-1); setReady(true); return; }
    const timer = window.setInterval(()=>setLine(v=>{
      if(v >= boot.length-1){ window.clearInterval(timer); setReady(true); return v; }
      return v+1;
    }),330);
    return ()=>window.clearInterval(timer);
  },[]);

  const trigger = ()=>{
    setPulse(v=>v+1);
    setReady(false);
    window.setTimeout(()=>setReady(true),420);
  };

  return <aside className={`mc-console mc-hero-terminal ${ready?'is-ready':'is-booting'}`} aria-label="interactive production readiness console">
    <div className="mc-console-head">
      <span>MISSION CONTROL / LIVE SYSTEM</span>
      <span className="mc-live"><i /> {ready?'ONLINE':'BOOTING'}</span>
    </div>

    <div className="hero-terminal-log" key={pulse}>
      {boot.map((item,index)=><div key={item} className={index<=line?'visible':''}>
        <span>{String(index+1).padStart(2,'0')}</span><b>{item}</b><em>{index<line?'OK':index===line?'RUN':'--'}</em>
      </div>)}
    </div>

    <div className="mc-score">
      <strong>{ready?'84':'--'}</strong><span>%</span>
      <div><b>MISSION STATUS</b><em>{ready?'CONDITIONAL READY':'INITIALIZING'}</em></div>
    </div>
    <div className="mc-meter"><i style={{width:ready?'84%':'8%'}} /></div>

    <div className="hero-console-command">
      <button type="button" onClick={trigger}>↻ RUN SYSTEM CHECK</button>
      <Link href="/survival-test">ENTER MISSION →</Link>
    </div>
  </aside>;
}
