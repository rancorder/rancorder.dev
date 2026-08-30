'use client';

import { useEffect, useMemo, useState } from 'react';

type Sector = 'mfg' | 'sales';

const labels = {
  mfg: ['RESPONSIBILITY','FAILURE CRITERIA','AI ERROR BOUNDARY','DATA TRACEABILITY','ROLLBACK','OBSERVABILITY','HUMAN FALLBACK'],
  sales: ['RESPONSIBILITY','FAILURE CRITERIA','SIGNAL INTEGRITY','DATA ROUTING','REPORT FRESHNESS','TRANSCRIPT QUALITY','DECISION OUTPUT'],
} as const;

const weights = [16,16,16,14,14,13,11];

export default function MissionReplay({ sector, code }: { sector: Sector; code: string }) {
  const answers = code.split('').slice(0,7);
  const [step,setStep] = useState(-1);
  const [playing,setPlaying] = useState(false);

  const timeline = useMemo(()=>{
    let integrity = 100;
    return answers.map((answer,index)=>{
      const damage = answer === 'n' ? weights[index] : answer === 'p' ? weights[index] * .5 : 0;
      integrity = Math.max(0,Math.round(integrity-damage));
      return {
        answer,
        label: labels[sector][index],
        damage: Math.round(damage),
        integrity,
      };
    });
  },[answers,sector]);

  useEffect(()=>{
    if(!playing) return;
    if(step >= timeline.length-1){ setPlaying(false); return; }
    const timer = window.setTimeout(()=>setStep(v=>v+1),650);
    return ()=>window.clearTimeout(timer);
  },[playing,step,timeline.length]);

  const currentIntegrity = step < 0 ? 100 : timeline[step]?.integrity ?? 100;

  const play = ()=>{
    setStep(-1);
    setPlaying(true);
  };

  return <section className="mission-replay">
    <header className="mission-replay-head">
      <div><span>MISSION REPLAY</span><h2>どこで案件が壊れかけたか。</h2></div>
      <button type="button" onClick={play} disabled={playing}>{playing?'REPLAYING...':'▶ REPLAY DAMAGE'}</button>
    </header>

    <div className="replay-console">
      <div className="replay-integrity">
        <small>MISSION INTEGRITY</small>
        <strong>{currentIntegrity}<em>%</em></strong>
        <div><i style={{width:`${currentIntegrity}%`}} /></div>
      </div>

      <div className="replay-track">
        {timeline.map((item,index)=>{
          const active = index <= step;
          const critical = item.answer === 'n';
          const partial = item.answer === 'p';
          return <div key={item.label} className={`replay-node ${active?'active':''} ${critical?'critical':partial?'partial':'safe'}`}>
            <div className="replay-node-line"><i /></div>
            <button type="button" onClick={()=>{setPlaying(false);setStep(index);}}>
              <span>{String(index+1).padStart(2,'0')}</span>
              <b>{item.label}</b>
              <em>{item.answer==='y'?'STABLE':item.answer==='p'?`-${item.damage} DMG`:`-${item.damage} DMG`}</em>
            </button>
          </div>;
        })}
      </div>

      <div className="replay-event" key={step}>
        {step < 0
          ? <><span>READY</span><b>MISSION LOG LOADED / 7 DECISIONS</b></>
          : <><span className={timeline[step].answer==='n'?'red':timeline[step].answer==='p'?'yellow':'green'}>
              {timeline[step].answer==='n'?'CRITICAL':timeline[step].answer==='p'?'WARNING':'STABLE'}
            </span><b>{timeline[step].label} / {timeline[step].damage ? `INTEGRITY -${timeline[step].damage}` : 'NO DAMAGE'}</b></>}
      </div>
    </div>
  </section>;
}
