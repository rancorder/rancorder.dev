'use client';

import { useEffect, useState } from 'react';
import { awardAchievement } from '../../components/MissionXP';

const phases=[
  ['PACKET ENCRYPTED','Mission Briefを安全な引継ぎパケットへ変換'],
  ['CONTEXT ATTACHED','診断・Recovery・Original Signalを結合'],
  ['READY FOR HUMAN REVIEW','Human Reviewへ渡せる状態になりました'],
] as const;

export default function MissionBriefActions({mailto,brief}:{mailto:string;brief:string}){
  const [copied,setCopied]=useState(false);
  const [phase,setPhase]=useState(-1);
  const [running,setRunning]=useState(false);
  const unlocked=phase===phases.length-1;

  useEffect(()=>{awardAchievement('brief');},[]);

  async function copy(){
    await navigator.clipboard.writeText(brief);
    setCopied(true);
    window.setTimeout(()=>setCopied(false),1600);
  }

  function handoff(){
    if(running||unlocked)return;
    setRunning(true);
    setPhase(0);
    window.setTimeout(()=>setPhase(1),520);
    window.setTimeout(()=>setPhase(2),1040);
    window.setTimeout(()=>setRunning(false),1380);
  }

  return <section className="mission-handoff-event">
    <header>
      <div><span>FINAL EVENT / HUMAN HANDOFF</span><h2>このMissionを、人間の判断へ渡す。</h2></div>
      <b>{unlocked?'HANDOFF READY':running?'TRANSMITTING':'AWAITING COMMAND'}</b>
    </header>

    <div className="handoff-pipeline">
      {phases.map((item,index)=><div key={item[0]} className={phase>=index?'active':''}>
        <span>{String(index+1).padStart(2,'0')}</span>
        <i>{phase>index?'✓':phase===index?'●':'◇'}</i>
        <div><b>{item[0]}</b><p>{item[1]}</p></div>
      </div>)}
    </div>

    {!unlocked?<button type="button" className="handoff-trigger" onClick={handoff} disabled={running}>
      {running?'TRANSMITTING MISSION...':'HANDOFF THIS MISSION →'}
    </button>:
    <div className="mission-brief-actions unlocked">
      <a href={mailto}>SEND TO HUMAN REVIEW →</a>
      <button type="button" onClick={copy}>{copied?'MISSION PACKET COPIED ✓':'COPY HANDOFF PACKET'}</button>
    </div>}
  </section>;
}
