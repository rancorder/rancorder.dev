'use client';

import { useEffect, useRef, useState } from 'react';

const stages = ['BOOT','DISCOVER RISK','MAKE DECISION','BUILD BOUNDARY','OBSERVE','RECOVER','PRODUCTION READY'];

export default function MissionFX(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boot,setBoot] = useState(true);
  const [bootLine,setBootLine] = useState(0);
  const [stage,setStage] = useState(0);
  const [progress,setProgress] = useState(0);
  const [operator,setOperator] = useState(false);

  useEffect(()=>{
    const timers = [
      window.setTimeout(()=>setBootLine(1),280),
      window.setTimeout(()=>setBootLine(2),620),
      window.setTimeout(()=>setBootLine(3),980),
      window.setTimeout(()=>setBoot(false),1500),
    ];
    return ()=>timers.forEach(clearTimeout);
  },[]);

  useEffect(()=>{
    let taps = 0;
    const unlock = () => {
      taps += 1;
      if (taps >= 5) setOperator(true);
    };
    window.addEventListener('pointerdown', unlock);
    return () => window.removeEventListener('pointerdown', unlock);
  },[]);

  useEffect(()=>{
    const onScroll=()=>{
      const max = Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      const p = Math.min(1,window.scrollY/max);
      setProgress(p);
      setStage(Math.min(stages.length-1,Math.floor(p*stages.length)));
    };
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
    return ()=>window.removeEventListener('scroll',onScroll);
  },[]);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    if(!ctx) return;

    let raf=0;
    let mouse={x:-9999,y:-9999};
    const nodes=Array.from({length:34},(_,i)=>({
      x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00016,vy:(Math.random()-.5)*.00016,
      r:i%9===0?2.6:1.4,critical:i%11===0
    }));

    const resize=()=>{
      const dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.floor(window.innerWidth*dpr);
      canvas.height=Math.floor(window.innerHeight*dpr);
      canvas.style.width=window.innerWidth+'px';
      canvas.style.height=window.innerHeight+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    const move=(e:PointerEvent)=>{mouse={x:e.clientX,y:e.clientY};};
    resize();
    window.addEventListener('resize',resize);
    window.addEventListener('pointermove',move,{passive:true});

    const draw=()=>{
      const w=window.innerWidth,h=window.innerHeight;
      ctx.clearRect(0,0,w,h);
      for(const n of nodes){
        n.x+=n.vx;n.y+=n.vy;
        if(n.x<0||n.x>1)n.vx*=-1;
        if(n.y<0||n.y>1)n.vy*=-1;
      }
      for(let i=0;i<nodes.length;i++){
        const a=nodes[i],ax=a.x*w,ay=a.y*h;
        for(let j=i+1;j<nodes.length;j++){
          const b=nodes[j],bx=b.x*w,by=b.y*h;
          const d=Math.hypot(ax-bx,ay-by);
          if(d<150){
            ctx.strokeStyle=`rgba(93,242,165,${(1-d/150)*.11})`;
            ctx.lineWidth=.7;
            ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
          }
        }
        const md=Math.hypot(ax-mouse.x,ay-mouse.y);
        if(md<180){
          ctx.strokeStyle=`rgba(167,139,250,${(1-md/180)*.4})`;
          ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();
        }
        ctx.beginPath();
        ctx.fillStyle=a.critical?'rgba(255,95,109,.85)':'rgba(93,242,165,.7)';
        ctx.shadowBlur=a.critical?14:8;
        ctx.shadowColor=a.critical?'#ff5f6d':'#5df2a5';
        ctx.arc(ax,ay,a.r,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);};
  },[]);

  return <>
    <canvas ref={canvasRef} className="mission-network" aria-hidden="true" />
    {boot && <div className="mission-boot" aria-hidden="true">
      <div className="mission-boot-box">
        <span>RANCORDER MISSION CONTROL</span>
        <p className={bootLine>=1?'on':''}>[OK] CORE SYSTEM</p>
        <p className={bootLine>=2?'on':''}>[OK] RISK ENGINE</p>
        <p className={bootLine>=3?'on':''}>[OK] OPERATOR LINK</p>
        <b className={bootLine>=3?'on':''}>SYSTEM ONLINE</b>
      </div>
    </div>}
    {operator && <a href="/lab" className="operator-unlocked">OPERATOR MODE UNLOCKED ↗</a>}
    <div className="mission-hud" aria-hidden="true">
      <div className="mission-hud-stage">
        <small>MISSION PHASE</small>
        <b>{String(stage).padStart(2,'0')} / {stages[stage]}</b>
      </div>
      <div className="mission-hud-bar"><i style={{width:`${progress*100}%`}} /></div>
    </div>
  </>;
}
