'use client';

import { useEffect, useMemo, useState } from 'react';

type Achievement={id:string;label:string;xp:number};
const achievements:Achievement[]=[
 {id:'sector',label:'MISSION LOADED',xp:40},
 {id:'case',label:'DECISION RECORD READ',xp:80},
 {id:'diagnostic',label:'SURVIVAL TEST CLEARED',xp:160},
 {id:'recovery',label:'RECOVERY PLANNED',xp:120},
 {id:'brief',label:'MISSION BRIEF BUILT',xp:100},
 {id:'incident',label:'BLACK BOX SURVIVED',xp:200},
];
const key='rancorder-achievements';

export function awardAchievement(id:string){
 if(typeof window==='undefined')return;
 const current=JSON.parse(window.localStorage.getItem(key)||'[]') as string[];
 if(current.includes(id))return;
 const next=[...current,id];
 window.localStorage.setItem(key,JSON.stringify(next));
 window.dispatchEvent(new CustomEvent('mission-xp-change',{detail:{id}}));
}

export default function MissionXP(){
 const [earned,setEarned]=useState<string[]>([]);
 const [open,setOpen]=useState(false);
 const [flash,setFlash]=useState('');
 const xp=useMemo(()=>achievements.filter(a=>earned.includes(a.id)).reduce((s,a)=>s+a.xp,0),[earned]);

 useEffect(()=>{
   const read=()=>setEarned(JSON.parse(window.localStorage.getItem(key)||'[]'));
   read();
   const onChange=(e:Event)=>{read();const id=(e as CustomEvent<{id:string}>).detail?.id;if(id){setFlash(id);window.setTimeout(()=>setFlash(''),1400);}};
   const onSector=()=>awardAchievement('sector');
   window.addEventListener('mission-xp-change',onChange);
   window.addEventListener('mission-sector-change',onSector);
   return()=>{window.removeEventListener('mission-xp-change',onChange);window.removeEventListener('mission-sector-change',onSector);};
 },[]);

 const level=xp>=500?'MISSION ARCHITECT':xp>=250?'SYSTEM OPERATOR':xp>=80?'RISK SCOUT':'OBSERVER';
 const unlocked=xp>=500;
 return <div className="mission-xp">
   <button type="button" className={flash?'xp-flash':''} onClick={()=>setOpen(v=>!v)} aria-expanded={open}>
     <span>MISSION XP</span><strong>{xp}<i>/700</i></strong><em>{level}</em>
   </button>
   {open&&<div className="mission-xp-panel">
     <header><span>ACHIEVEMENTS</span><b>{earned.length}/{achievements.length}</b></header>
     {achievements.map(a=><div key={a.id} className={earned.includes(a.id)?'earned':''}>
       <i>{earned.includes(a.id)?'✓':'◇'}</i><span>{a.label}</span><b>+{a.xp}</b>
     </div>)}
     <p>読む・診断する・復旧を設計するほど、Mission Rankが上がります。</p>
     <a className={unlocked?'xp-secret unlocked':'xp-secret'} href={unlocked?'/black-box-incident':'#'} onClick={e=>{if(!unlocked)e.preventDefault();}}>{unlocked?'⚠ SECRET MISSION UNLOCKED →':'▣ SECRET MISSION / 500 XP REQUIRED'}</a>
   </div>}
 </div>;
}
