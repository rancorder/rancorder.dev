'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Sector = 'manufacturing' | 'sales';

const systems = {
  manufacturing: {
    code:'MFG-AI',
    readiness:84,
    boot:['BOOT / MFG AI MISSION','LOADING / DECISION ENGINE','CHECKING / AI ERROR BOUNDARY','CHECKING / OBSERVABILITY','RISK SIGNALS / 02 DETECTED','SYSTEM / READY'],
  },
  sales: {
    code:'SALES-OPS',
    readiness:76,
    boot:['BOOT / SALES OPS MISSION','LOADING / SIGNAL ENGINE','CHECKING / APPOINTMENT INTEGRITY','CHECKING / REPORT FRESHNESS','RISK SIGNALS / 03 DETECTED','SYSTEM / READY'],
  },
} as const;

export default function HeroMissionConsole(){
  const [sector,setSector] = useState<Sector>('manufacturing');
  const [line,setLine] = useState(0);
  const [ready,setReady] = useState(false);
  const [pulse,setPulse] = useState(0);
  const system = systems[sector];
  const reduced = useMemo(()=>typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);

  const run = (nextSector:Sector=sector)=>{
    setSector(nextSector);
    setLine(reduced?system.boot.length-1:0);
    setReady(reduced);
    setPulse(v=>v+1);
  };

  useEffect(()=>{
    const saved=window.localStorage.getItem('rancorder-mission');
    if(saved==='manufacturing'||saved==='sales') setSector(saved);
    const onSector=(event:Event)=>{
      const next=(event as CustomEvent<{sector:Sector}>).detail?.sector;
      if(next){setSector(next);setLine(0);setReady(false);setPulse(v=>v+1);}
    };
    window.addEventListener('mission-sector-change',onSector);
    return()=>window.removeEventListener('mission-sector-change',onSector);
  },[]);

  useEffect(()=>{
    if(reduced){setLine(system.boot.length-1);setReady(true);return;}
    setLine(0);setReady(false);
    const timer=window.setInterval(()=>setLine(v=>{
      if(v>=system.boot.length-1){window.clearInterval(timer);setReady(true);return v;}
      return v+1;
    }),280);
    return()=>window.clearInterval(timer);
  },[sector,pulse,reduced,system.boot.length]);

  return <aside className={`mc-console mc-hero-terminal sector-${sector} ${ready?'is-ready':'is-booting'}`} aria-label="interactive production readiness console">
    <div className="mc-console-head"><span>{system.code} / LIVE SYSTEM</span><span className="mc-live"><i /> {ready?'ONLINE':'BOOTING'}</span></div>
    <div className="hero-terminal-log" key={sector+'-'+pulse}>
      {system.boot.map((item,index)=><div key={item} className={index<=line?'visible':''}><span>{String(index+1).padStart(2,'0')}</span><b>{item}</b><em>{index<line?'OK':index===line?'RUN':'--'}</em></div>)}
    </div>
    <div className="mc-score"><strong>{ready?system.readiness:'--'}</strong><span>%</span><div><b>MISSION STATUS</b><em>{ready?'CONDITIONAL READY':'INITIALIZING'}</em></div></div>
    <div className="mc-meter"><i style={{width:ready?`${system.readiness}%`:'8%'}} /></div>
    <div className="hero-console-command"><button type="button" onClick={()=>run()}>↻ RUN SYSTEM CHECK</button><Link href={`/survival-test?s=${sector==='sales'?'sales':'mfg'}`}>ENTER MISSION →</Link></div>
  </aside>;
}
