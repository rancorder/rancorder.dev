import { useState, useEffect, useRef, useCallback, Children, isValidElement } from "react";

/* ============================================================
   UTILITIES
   ============================================================ */
const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#_';
function randomChar() { return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]; }

const NEIGHBORS = { a:'sqwze',s:'adwxze',d:'sfexc',f:'dgrvb',g:'fhtbn',h:'gjynm',j:'hkum',k:'jlio',l:'kop',e:'wrsd',r:'etdf',t:'rygh',y:'tuhj',u:'yijk',i:'uojk',o:'iplk',p:'ol',w:'qes',q:'wa' };
function mistakeChar(ch) { const n = NEIGHBORS[ch.toLowerCase()]; return n ? n[Math.floor(Math.random()*n.length)] : ch; }

function playTone(freq, type='sine', dur=0.25, vol=0.15) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
  } catch(_) {}
}

function burstCanvas(canvas, x, y, count=40) {
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  const colors = ['#7c3aed','#a78bfa','#00ff88','#f59e0b','#ec4899','#60a5fa','#fff'];
  const particles = Array.from({length: count}, () => {
    const angle = Math.random()*Math.PI*2, speed = 3+Math.random()*7;
    return { x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed-2,
      size: 4+Math.random()*7, color: colors[Math.floor(Math.random()*colors.length)],
      life: 1, r: Math.random()*Math.PI*2, rv: (Math.random()-.5)*.3 };
  });
  let raf;
  const draw = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive = false;
    for (const p of particles) {
      p.vy += 0.18; p.x += p.vx; p.y += p.vy; p.vx *= .97; p.life -= .022; p.r += p.rv;
      if (p.life > 0) { alive = true; ctx.save(); ctx.globalAlpha = p.life;
        ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2); ctx.restore(); }
    }
    if (alive) raf = requestAnimationFrame(draw); else ctx.clearRect(0,0,canvas.width,canvas.height);
  };
  raf = requestAnimationFrame(draw);
  setTimeout(() => { cancelAnimationFrame(raf); ctx.clearRect(0,0,canvas.width,canvas.height); }, 2500);
}

/* ============================================================
   HOOKS
   ============================================================ */
function useInView(threshold=0.15) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) { setVisible(true); obs.disconnect(); }}, {threshold});
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ============================================================
   GLITCH TEXT
   ============================================================ */
function GlitchText({ children, intensity=1, className='', style={} }) {
  const text = String(children);
  const [displayed, setDisplayed] = useState(text);
  const [glitching, setGlitching] = useState(false);
  const rafRef = useRef(null);

  const trigger = useCallback(() => {
    if (glitching) return;
    setGlitching(true);
    let frame = 0; const total = Math.round(26*intensity);
    const tick = () => {
      frame++;
      const t = frame/total;
      if (t < 0.55) {
        setDisplayed(text.split('').map(c => c!==' '&&Math.random()<0.45*intensity ? randomChar() : c).join(''));
      } else {
        const idx = Math.floor(((t-0.55)/0.45)*text.length);
        setDisplayed(text.split('').map((c,i) => i<=idx ? c : c!==' '&&Math.random()<0.2 ? randomChar() : c).join(''));
      }
      if (frame < total) rafRef.current = requestAnimationFrame(tick);
      else { setDisplayed(text); setGlitching(false); }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, glitching, intensity]);

  useEffect(() => {
    const id = setInterval(() => { if (Math.random()<0.3) trigger(); }, 3500+Math.random()*4000);
    return () => { clearInterval(id); if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [trigger]);

  return (
    <span onClick={trigger} className={className} style={{
      fontFamily:"'Courier New',monospace", fontWeight:800, cursor:'pointer',
      color: glitching ? '#00ff88' : 'inherit',
      textShadow: glitching ? '2px 0 rgba(255,0,60,.6), -2px 0 rgba(0,255,136,.6), 0 0 20px rgba(0,255,136,.4)' : 'none',
      transition: 'color .08s, text-shadow .08s', ...style
    }}>{displayed}</span>
  );
}

/* ============================================================
   TYPEWRITER
   ============================================================ */
function Typewriter({ children, speed=50, mistakeRate=0.06, startDelay=200 }) {
  const text = String(children);
  const [displayed, setDisplayed] = useState('');
  const [cursor, setCursor] = useState(true);
  const [done, setDone] = useState(false);
  const [ref, visible] = useInView(0.3);
  const timerRef = useRef(null);

  useEffect(() => { const id = setInterval(() => setCursor(v=>!v), 530); return () => clearInterval(id); }, []);

  useEffect(() => {
    if (!visible) return;
    let i=0, current='', mistakeBuf='', recovering=false;
    const next = () => {
      if (recovering) {
        current = current.slice(0,-1); mistakeBuf = mistakeBuf.slice(0,-1);
        setDisplayed(current);
        if (mistakeBuf.length===0) { recovering=false; timerRef.current=setTimeout(next, speed*(.8+Math.random()*.6)); }
        else timerRef.current = setTimeout(next, speed*1.4);
        return;
      }
      if (i>=text.length) { setDone(true); return; }
      const ch = text[i];
      if (ch!==' ' && Math.random()<mistakeRate) {
        const w = mistakeChar(ch); current+=w; mistakeBuf+=w; setDisplayed(current);
        timerRef.current = setTimeout(() => { recovering=true; next(); }, speed*(1.6+Math.random()));
      } else {
        current+=ch; setDisplayed(current); i++;
        const pause = '。.！!'.includes(ch) ? speed*(4+Math.random()*3) : '、,'.includes(ch) ? speed*(2+Math.random()) : speed*(.6+Math.random()*.9);
        timerRef.current = setTimeout(next, pause);
      }
    };
    timerRef.current = setTimeout(next, startDelay);
    return () => { if(timerRef.current) clearTimeout(timerRef.current); };
  }, [visible]);

  return (
    <span ref={ref} style={{display:'inline'}}>
      <span style={{fontFamily:"'Courier New',monospace"}}>{displayed}</span>
      {!done && <span style={{display:'inline-block',width:'2px',height:'1em',background:'#00ff88',marginLeft:'2px',verticalAlign:'text-bottom',opacity:cursor?1:0,boxShadow:'0 0 8px rgba(0,255,136,.8)',transition:'opacity .08s'}}/>}
    </span>
  );
}

/* ============================================================
   COUNTER UP (Verlet spring)
   ============================================================ */
function CounterUp({ value, suffix='', prefix='', decimals=0, label, stiffness=0.07, damping=0.72 }) {
  const [display, setDisplay] = useState(0);
  const [ref, visible] = useInView(0.3);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    let pos=0, vel=0;
    const tick = () => {
      const acc = stiffness*(value-pos); vel=vel*damping+acc; pos+=vel;
      setDisplay(pos);
      if (Math.abs(value-pos)<0.01 && Math.abs(vel)<0.01) { setDisplay(value); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible, value, stiffness, damping]);

  const fmt = decimals>0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();
  const pct = Math.max(0, Math.min(1, display/value));

  return (
    <div ref={ref} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'.3rem',
      padding:'1.4rem 1.8rem',borderRadius:'14px',
      border:'1px solid rgba(124,58,237,.3)',
      background:'rgba(124,58,237,.06)',
      position:'relative',overflow:'hidden',minWidth:'110px'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'3px',background:'rgba(255,255,255,.05)'}}>
        <div style={{height:'100%',width:`${pct*100}%`,background:'linear-gradient(90deg,#7c3aed,#00ff88)',boxShadow:'0 0 10px rgba(0,255,136,.5)',transition:'none'}}/>
      </div>
      <span style={{fontSize:'2.4rem',fontWeight:800,fontVariantNumeric:'tabular-nums',letterSpacing:'-.04em',lineHeight:1,color:'#fff',fontFamily:"'Courier New',monospace"}}>
        <span style={{fontSize:'1.2rem',opacity:.5}}>{prefix}</span>{fmt}<span style={{fontSize:'1.2rem',opacity:.5}}>{suffix}</span>
      </span>
      {label && <span style={{fontSize:'.68rem',fontWeight:700,letterSpacing:'.1em',color:'rgba(255,255,255,.35)',textTransform:'uppercase'}}>{label}</span>}
    </div>
  );
}

/* ============================================================
   INTERACTIVE CHECKLIST
   ============================================================ */
function InteractiveChecklist({ items }) {
  const [checked, setChecked] = useState(new Set());
  const [ripple, setRipple] = useState(null);
  const [done, setDone] = useState(false);
  const canvasRef = useRef(null);
  const itemRefs = useRef([]);

  const toggle = (i) => {
    setChecked(prev => {
      const next = new Set(prev);
      const adding = !next.has(i);
      adding ? next.add(i) : next.delete(i);
      setRipple(i); setTimeout(()=>setRipple(null),500);
      if (adding) {
        playTone(adding ? 440 : 300, 'sine', adding ? .25 : .18, adding ? .12 : .08);
        if (adding) setTimeout(()=>playTone(660,'sine',.2,.1),130);
        if (next.size===items.length) {
          setTimeout(()=>{
            const c=canvasRef.current;
            if(c) burstCanvas(c, c.width/2, c.height/2, 100);
            [523.25,659.25,783.99,1046.5].forEach((f,i)=>{
              setTimeout(()=>playTone(f,'sine',.35,.15),i*90);
            });
            setDone(true);
          },200);
        }
      } else { if(done) setDone(false); }
      return next;
    });
  };

  const pct = items.length ? Math.round(checked.size/items.length*100) : 0;

  return (
    <div style={{position:'relative',borderRadius:'14px',border:`1px solid ${done?'rgba(0,255,136,.3)':'rgba(255,255,255,.08)'}`,background:done?'rgba(0,255,136,.05)':'rgba(255,255,255,.02)',transition:'all .5s ease',overflow:'hidden'}}>
      <canvas ref={canvasRef} width={500} height={350} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:10}}/>
      <div style={{padding:'1rem 1.25rem .75rem',borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',alignItems:'center',gap:'.75rem'}}>
        <div style={{flex:1,height:'5px',borderRadius:'3px',background:'rgba(255,255,255,.07)',overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,borderRadius:'3px',background:done?'linear-gradient(90deg,#00ff88,#34d399)':'linear-gradient(90deg,#7c3aed,#a78bfa)',boxShadow:done?'0 0 10px rgba(0,255,136,.6)':'0 0 8px rgba(124,58,237,.5)',transition:'width .5s cubic-bezier(.16,1,.3,1),background .5s'}}/>
        </div>
        <span style={{fontSize:'.72rem',fontWeight:700,color:done?'#00ff88':'rgba(255,255,255,.35)',fontVariantNumeric:'tabular-nums'}}>{pct}%</span>
      </div>
      {items.map((item, i) => {
        const isChecked = checked.has(i);
        return (
          <div key={i} ref={el=>itemRefs.current[i]=el} onClick={()=>toggle(i)} style={{
            display:'flex',alignItems:'center',gap:'.85rem',padding:'.85rem 1.25rem',
            cursor:'pointer',background:isChecked?'rgba(0,255,136,.05)':'transparent',
            borderBottom:i<items.length-1?'1px solid rgba(255,255,255,.04)':'none',
            transform:ripple===i?'translateX(4px)':'translateX(0)',transition:'all .3s ease',position:'relative',overflow:'hidden'}}>
            <span style={{flexShrink:0,width:'22px',height:'22px',borderRadius:'6px',
              border:isChecked?'2px solid #00ff88':'2px solid rgba(255,255,255,.18)',
              background:isChecked?'linear-gradient(135deg,#00cc66,#00ff88)':'transparent',
              boxShadow:isChecked?'0 0 12px rgba(0,255,136,.5)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              transition:'all .3s cubic-bezier(.16,1,.3,1)',transform:isChecked?'scale(1.1)':'scale(1)'}}>
              {isChecked && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><polyline points="2.5,7 5.5,10 10.5,3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </span>
            <span style={{fontSize:'.9rem',fontWeight:500,color:isChecked?'rgba(0,255,136,.5)':'rgba(255,255,255,.8)',textDecoration:isChecked?'line-through':'none',textDecorationColor:'rgba(0,255,136,.3)',transition:'all .35s ease'}}>{item}</span>
            <span style={{marginLeft:'auto',fontSize:'.65rem',fontWeight:700,color:'rgba(255,255,255,.18)',fontVariantNumeric:'tabular-nums'}}>0{i+1}</span>
          </div>
        );
      })}
      {done && <div style={{padding:'.85rem 1.25rem',borderTop:'1px solid rgba(0,255,136,.2)',background:'rgba(0,255,136,.08)',color:'#00ff88',fontWeight:700,fontSize:'.82rem',letterSpacing:'.1em',textAlign:'center',textTransform:'uppercase',animation:'slideUp .4s cubic-bezier(.16,1,.3,1) forwards'}}>✦ STAGE CLEAR ✦</div>}
    </div>
  );
}

/* ============================================================
   QUIZ BLOCK
   ============================================================ */
function QuizBlock({ question, options, answer, hint }) {
  const [phase, setPhase] = useState('idle');
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const canvasRef = useRef(null);

  const choose = (opt) => {
    if (phase!=='idle') return;
    setSelected(opt);
    if (opt===answer) {
      setPhase('correct');
      [523.25,659.25,783.99,1046.5].forEach((f,i)=>setTimeout(()=>playTone(f,'sine',.35,.15),i*90));
      setTimeout(()=>{ const c=canvasRef.current; if(c) burstCanvas(c,c.width/2,c.height/2,70); },100);
    } else {
      setPhase('wrong');
      [300,240].forEach((f,i)=>setTimeout(()=>playTone(f,'sawtooth',.25,.1),i*150));
    }
  };

  return (
    <div style={{position:'relative',borderRadius:'14px',border:`1px solid ${phase==='correct'?'rgba(0,255,136,.3)':phase==='wrong'?'rgba(239,68,68,.25)':'rgba(255,255,255,.08)'}`,background:phase==='correct'?'rgba(0,255,136,.05)':phase==='wrong'?'rgba(239,68,68,.05)':'rgba(255,255,255,.02)',transition:'all .4s ease',overflow:'hidden'}}>
      <canvas ref={canvasRef} width={500} height={300} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:10}}/>
      <div style={{padding:'1rem 1.25rem .75rem',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
        <span style={{fontSize:'.65rem',fontWeight:700,letterSpacing:'.12em',color:'rgba(124,58,237,.8)',textTransform:'uppercase',marginRight:'.75rem'}}>QUIZ</span>
        <span style={{fontSize:'.95rem',fontWeight:600,color:'rgba(255,255,255,.9)'}}>{question}</span>
      </div>
      <div style={{padding:'.75rem 1rem',display:'flex',flexDirection:'column',gap:'.5rem'}}>
        {options.map((opt,i) => {
          const isSel = selected===opt, isAns = opt===answer, rev = phase!=='idle';
          let bg='rgba(255,255,255,.04)',border='rgba(255,255,255,.1)',color='rgba(255,255,255,.8)';
          if(rev&&isAns){bg='rgba(0,255,136,.12)';border='rgba(0,255,136,.4)';color='#00ff88';}
          else if(rev&&isSel&&!isAns){bg='rgba(239,68,68,.12)';border='rgba(239,68,68,.35)';color='#f87171';}
          return (
            <button key={i} onClick={()=>choose(opt)} disabled={rev} style={{display:'flex',alignItems:'center',gap:'.7rem',padding:'.75rem 1rem',borderRadius:'9px',border:`1px solid ${border}`,background:bg,color,fontSize:'.88rem',fontWeight:500,cursor:rev?'default':'pointer',textAlign:'left',transition:'all .25s ease',transform:rev&&isAns?'scale(1.02)':'scale(1)'}}>
              <span style={{flexShrink:0,width:'22px',height:'22px',borderRadius:'5px',border:`1px solid ${border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.7rem',fontWeight:700,color:'rgba(255,255,255,.35)'}}>{String.fromCharCode(65+i)}</span>
              {opt}
              {rev&&isAns&&<span style={{marginLeft:'auto'}}>✓</span>}
              {rev&&isSel&&!isAns&&<span style={{marginLeft:'auto'}}>✗</span>}
            </button>
          );
        })}
      </div>
      <div style={{padding:'.6rem 1.25rem 1rem',display:'flex',alignItems:'center',gap:'.75rem',minHeight:'40px'}}>
        {phase==='idle'&&hint&&<button onClick={()=>setShowHint(!showHint)} style={{fontSize:'.72rem',color:'rgba(124,58,237,.6)',background:'none',border:'none',cursor:'pointer',padding:0}}>{showHint?'▲ hide hint':'▼ show hint'}</button>}
        {phase==='correct'&&<span style={{fontSize:'.82rem',color:'#00ff88',fontWeight:700}}>✦ CORRECT</span>}
        {phase==='wrong'&&<><span style={{fontSize:'.82rem',color:'#f87171',fontWeight:700}}>✗ WRONG</span><button onClick={()=>{setPhase('idle');setSelected(null);setShowHint(false);}} style={{marginLeft:'auto',fontSize:'.72rem',fontWeight:600,color:'rgba(255,255,255,.5)',background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',borderRadius:'6px',padding:'.3rem .8rem',cursor:'pointer'}}>retry</button></>}
      </div>
      {showHint&&phase==='idle'&&<div style={{margin:'0 1rem 1rem',padding:'.75rem',borderRadius:'8px',background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.2)',fontSize:'.82rem',color:'rgba(167,139,250,.8)'}}>💡 {hint}</div>}
    </div>
  );
}

/* ============================================================
   TIMELINE
   ============================================================ */
function TimelineStep({ date, title, body, color='#a78bfa', isLast=false, delay=0 }) {
  const [dotScale, setDotScale] = useState(0);
  const [lineP, setLineP] = useState(0);
  const [contentV, setContentV] = useState(false);
  const [ref, visible] = useInView(0.2);
  const rafRef = useRef(null);
  const LINE_H = 90;

  useEffect(() => {
    if (!visible) return;
    setTimeout(() => {
      let df=0;
      const animDot = () => {
        df++;
        const t=df/20;
        setDotScale(Math.min(t*1.8,1)+(t>.5?Math.sin((t-.5)*Math.PI*3)*.12*(1-t):0));
        if(df<20) rafRef.current=requestAnimationFrame(animDot);
        else { setDotScale(1); if(!isLast) setTimeout(animLine,60); else setContentV(true); }
      };
      let lf=0;
      const animLine = () => {
        lf++;
        const t=lf/35;
        const e = t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
        setLineP(e);
        if(lf<35) rafRef.current=requestAnimationFrame(animLine);
        else { setLineP(1); setContentV(true); }
      };
      requestAnimationFrame(animDot);
    }, delay);
    return () => { if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  return (
    <div ref={ref} style={{display:'flex',gap:0}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0,width:'36px',paddingTop:'2px'}}>
        <div style={{width:'13px',height:'13px',borderRadius:'50%',background:color,boxShadow:`0 0 ${14*dotScale}px ${color}`,transform:`scale(${dotScale})`,transition:'box-shadow .2s',flexShrink:0,position:'relative',zIndex:2}}>
          <div style={{position:'absolute',inset:'3px',borderRadius:'50%',background:'rgba(255,255,255,.6)'}}/>
        </div>
        {!isLast && <svg width="2" height={LINE_H} style={{flexShrink:0}}>
          <line x1="1" y1="0" x2="1" y2={LINE_H} stroke="rgba(255,255,255,.06)" strokeWidth="2"/>
          <line x1="1" y1="0" x2="1" y2={LINE_H} stroke={color} strokeWidth="2" strokeDasharray={LINE_H} strokeDashoffset={LINE_H*(1-lineP)} style={{filter:`drop-shadow(0 0 4px ${color})`}}/>
        </svg>}
      </div>
      <div style={{flex:1,paddingLeft:'.85rem',paddingBottom:isLast?'.5rem':'2rem',opacity:contentV?1:0,transform:contentV?'translateX(0)':'translateX(-8px)',transition:'opacity .4s ease, transform .45s cubic-bezier(.16,1,.3,1)'}}>
        <div style={{fontSize:'.65rem',fontWeight:700,letterSpacing:'.1em',color,textTransform:'uppercase',marginBottom:'.15rem',opacity:.8}}>{date}</div>
        <div style={{fontSize:'.95rem',fontWeight:700,color:'rgba(255,255,255,.9)',marginBottom:'.3rem'}}>{title}</div>
        <div style={{fontSize:'.85rem',color:'rgba(255,255,255,.5)',lineHeight:1.6}}>{body}</div>
      </div>
    </div>
  );
}

/* ============================================================
   SCAN FADE (simplified FadeIn demo)
   ============================================================ */
function ScanReveal({ children, delay=0 }) {
  const [phase, setPhase] = useState('hidden');
  const [scanPct, setScanPct] = useState(0);
  const [ref, visible] = useInView(0.1);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    setTimeout(() => {
      setPhase('scanning');
      let start=null;
      const dur = 500;
      const tick = (ts) => {
        if(!start) start=ts;
        const p = Math.min((ts-start)/dur,1);
        setScanPct(p*100);
        if(p<1) rafRef.current=requestAnimationFrame(tick);
        else setPhase('visible');
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);
    return () => { if(rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  return (
    <div ref={ref} style={{position:'relative',opacity:phase==='hidden'?0:1,transition:'opacity 60ms'}}>
      {phase==='scanning'&&<div style={{position:'absolute',top:`${scanPct}%`,left:'-4px',right:'-4px',height:'2px',background:'linear-gradient(90deg,transparent,rgba(124,58,237,.7),rgba(0,255,136,1),rgba(124,58,237,.7),transparent)',boxShadow:'0 0 16px 4px rgba(0,255,136,.4)',zIndex:10,pointerEvents:'none'}}/>}
      <div style={{opacity:phase==='visible'?1:phase==='scanning'?.7:0,transform:phase==='visible'?'translateY(0) rotateX(0)':'translateY(20px) rotateX(8deg)',filter:phase==='visible'?'blur(0)':'blur(3px)',transition:`all 600ms cubic-bezier(.16,1,.3,1)`,perspective:'800px'}}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN SHOWCASE
   ============================================================ */
export default function Showcase() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div style={{
      minHeight:'100vh',background:'#080810',color:'#fff',
      fontFamily:"'Georgia','Times New Roman',serif",
      overflowX:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080810; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 2px; }
        @keyframes slideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes scanH { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes gridMove { from{transform:translateY(0)} to{transform:translateY(40px)} }
        .mono { font-family: 'JetBrains Mono', 'Courier New', monospace !important; }
        button { font-family: inherit; }
      `}</style>

      {/* ── GRID BACKGROUND ── */}
      <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,overflow:'hidden'}}>
        <div style={{position:'absolute',inset:'-40px',backgroundImage:'linear-gradient(rgba(124,58,237,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.07) 1px,transparent 1px)',backgroundSize:'40px 40px',animation:'gridMove 8s linear infinite'}}/>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 20% 20%,rgba(124,58,237,.12),transparent),radial-gradient(ellipse 60% 80% at 80% 80%,rgba(0,255,136,.06),transparent)'}}/>
      </div>

      {/* ── HERO ── */}
      <section style={{position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 clamp(1.5rem,5vw,4rem)',maxWidth:'1100px',margin:'0 auto'}}>

        {/* eyebrow */}
        <ScanReveal delay={200}>
          <div className="mono" style={{fontSize:'.72rem',letterSpacing:'.2em',color:'rgba(0,255,136,.7)',textTransform:'uppercase',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'.75rem'}}>
            <span style={{display:'inline-block',width:'24px',height:'1px',background:'rgba(0,255,136,.5)'}}/>
            HTMLをReact ASTに変換するブログエンジン
            <span style={{display:'inline-block',width:'24px',height:'1px',background:'rgba(0,255,136,.5)'}}/>
          </div>
        </ScanReveal>

        {/* headline */}
        <ScanReveal delay={400}>
          <h1 style={{fontSize:'clamp(2.8rem,8vw,6rem)',fontWeight:800,lineHeight:.95,letterSpacing:'-.03em',marginBottom:'2rem'}}>
            <GlitchText intensity={1.2}>HTML</GlitchText>
            <span style={{display:'block',color:'rgba(255,255,255,.25)',fontStyle:'italic',fontWeight:400,fontSize:'clamp(1.4rem,4vw,2.8rem)',letterSpacing:'-.01em',marginTop:'.3rem'}}>is not the destination.</span>
            <span style={{display:'block',background:'linear-gradient(135deg,#7c3aed,#a78bfa,#00ff88)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>It's the input.</span>
          </h1>
        </ScanReveal>

        {/* sub */}
        <ScanReveal delay={700}>
          <p style={{fontSize:'clamp(1rem,2.5vw,1.25rem)',color:'rgba(255,255,255,.5)',lineHeight:1.7,maxWidth:'580px',marginBottom:'3rem'}}>
            <Typewriter speed={35} mistakeRate={0.05} startDelay={1200}>
              コンテンツと体験を完全に分離したブログシステム。HTMLを書くだけで、全記事にゲームUIが宿る。
            </Typewriter>
          </p>
        </ScanReveal>

        {/* stats */}
        <ScanReveal delay={1000}>
          <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',marginBottom:'4rem'}}>
            <CounterUp value={13} suffix=" tags" label="Custom" stiffness={0.05} damping={0.68}/>
            <CounterUp value={0} suffix=" JS" label="HTML内" stiffness={0.09} damping={0.75}/>
            <CounterUp value={100} suffix="%" label="SSR対応" stiffness={0.06} damping={0.7}/>
            <CounterUp value={120} suffix="粒" label="confetti" stiffness={0.04} damping={0.65}/>
          </div>
        </ScanReveal>

        {/* scroll cue */}
        <div style={{display:'flex',alignItems:'center',gap:'.75rem',color:'rgba(255,255,255,.25)',fontSize:'.78rem',letterSpacing:'.1em',fontFamily:"'JetBrains Mono',monospace"}}>
          <span style={{animation:'pulse 2s infinite'}}>↓</span> SCROLL TO EXPLORE
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section style={{position:'relative',zIndex:1,padding:'6rem clamp(1.5rem,5vw,4rem)',maxWidth:'1100px',margin:'0 auto'}}>
        <ScanReveal>
          <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.2em',color:'rgba(124,58,237,.7)',textTransform:'uppercase',marginBottom:'1rem'}}>// Architecture</div>
          <h2 style={{fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:700,letterSpacing:'-.03em',marginBottom:'3rem',lineHeight:1.1}}>
            3層の<span style={{color:'#a78bfa'}}>完全分離</span>
          </h2>
        </ScanReveal>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1px',borderRadius:'16px',overflow:'hidden',border:'1px solid rgba(255,255,255,.06)'}}>
          {[
            {layer:'01', label:'CONTENT', file:'content/blog/*.html', desc:'構造の宣言。Reactを知らなくていい。HTMLを書くだけ。', color:'#6366f1'},
            {layer:'02', label:'TRANSFORM', file:'blog-renderer.tsx', desc:'cheerioでパース。カスタムタグをReact Componentに変換。クライアントには存在しない。', color:'#a78bfa'},
            {layer:'03', label:'EXPERIENCE', file:'FadeIn / Checklist / ...', desc:'スキャンライン、confetti、Web Audio、物理バネ。コンテンツ作者が知らない演出が全記事に展開される。', color:'#00ff88'},
          ].map(({layer,label,file,desc,color},i) => (
            <ScanReveal key={i} delay={i*150}>
              <div style={{padding:'2rem',background:'rgba(255,255,255,.02)',height:'100%',borderRight:i<2?'1px solid rgba(255,255,255,.06)':'none'}}>
                <div className="mono" style={{fontSize:'.6rem',letterSpacing:'.15em',color:'rgba(255,255,255,.2)',marginBottom:'.5rem'}}>{layer}</div>
                <div style={{fontSize:'.75rem',fontWeight:700,letterSpacing:'.12em',color,textTransform:'uppercase',marginBottom:'.75rem'}}>{label}</div>
                <div className="mono" style={{fontSize:'.78rem',color:'rgba(255,255,255,.35)',padding:'.4rem .6rem',background:'rgba(0,0,0,.3)',borderRadius:'6px',marginBottom:'1rem',border:'1px solid rgba(255,255,255,.06)'}}>{file}</div>
                <p style={{fontSize:'.88rem',color:'rgba(255,255,255,.55)',lineHeight:1.65}}>{desc}</p>
              </div>
            </ScanReveal>
          ))}
        </div>
      </section>

      {/* ── DEMOS ── */}
      <section style={{position:'relative',zIndex:1,padding:'4rem clamp(1.5rem,5vw,4rem)',maxWidth:'1100px',margin:'0 auto'}}>
        <ScanReveal>
          <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.2em',color:'rgba(0,255,136,.7)',textTransform:'uppercase',marginBottom:'1rem'}}>// Live Demos</div>
          <h2 style={{fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:700,letterSpacing:'-.03em',marginBottom:.5,lineHeight:1.1}}>
            全部、<GlitchText intensity={.8} style={{color:'#00ff88'}}>動いている</GlitchText>
          </h2>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:'.95rem',marginBottom:'3.5rem'}}>HTMLに1タグ書くだけで、これが全記事に展開される。</p>
        </ScanReveal>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'1.5rem'}}>

          {/* Checklist */}
          <ScanReveal delay={100}>
            <div style={{borderRadius:'16px',border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.02)',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.15em',color:'rgba(0,255,136,.6)',textTransform:'uppercase',marginBottom:'.3rem'}}>&lt;interactive-checklist&gt;</div>
                <div style={{fontSize:'1rem',fontWeight:600,color:'rgba(255,255,255,.8)'}}>チェックするたびに爆発する</div>
              </div>
              <InteractiveChecklist items={['BlogRenderer はサーバー専用','FadeIn のdelayは秒単位','全完了でSTAGE CLEARが出る','confettiは120粒爆散する']}/>
              <div className="mono" style={{fontSize:'.68rem',color:'rgba(255,255,255,.2)',lineHeight:1.6}}>Canvas confetti 28粒 + Web Audio<br/>全完了: 120粒 + アルペジオ</div>
            </div>
          </ScanReveal>

          {/* Quiz */}
          <ScanReveal delay={200}>
            <div style={{borderRadius:'16px',border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.02)',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.15em',color:'rgba(124,58,237,.7)',textTransform:'uppercase',marginBottom:'.3rem'}}>&lt;quiz-block&gt;</div>
                <div style={{fontSize:'1rem',fontWeight:600,color:'rgba(255,255,255,.8)'}}>ブログ記事がアプリになる</div>
              </div>
              <QuizBlock
                question="BlogRendererの実行場所は？"
                options={['ブラウザ', 'サーバー', 'Cloudflare Edge', 'どこでも']}
                answer="サーバー"
                hint="クライアントにcheerioは存在しない"
              />
              <div className="mono" style={{fontSize:'.68rem',color:'rgba(255,255,255,.2)',lineHeight:1.6}}>正解: 上昇アルペジオ + confetti<br/>不正解: sawtooth降下音</div>
            </div>
          </ScanReveal>

          {/* GlitchText demo */}
          <ScanReveal delay={300}>
            <div style={{borderRadius:'16px',border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.02)',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.15em',color:'rgba(0,255,136,.6)',textTransform:'uppercase',marginBottom:'.3rem'}}>&lt;glitch-text&gt;</div>
                <div style={{fontSize:'1rem',fontWeight:600,color:'rgba(255,255,255,.8)'}}>クリックで即座に崩壊する</div>
              </div>
              <div style={{padding:'2.5rem 1.5rem',background:'rgba(0,0,0,.4)',borderRadius:'10px',textAlign:'center',border:'1px solid rgba(255,255,255,.06)'}}>
                <div style={{fontSize:'clamp(1.8rem,5vw,2.8rem)',lineHeight:1.1}}>
                  <GlitchText intensity={1.5}>SYSTEM BREACH</GlitchText>
                </div>
                <div style={{marginTop:'1.5rem',fontSize:'1.1rem',opacity:.6}}>
                  <GlitchText intensity={.8}>ERROR_404</GlitchText>
                </div>
              </div>
              <div className="mono" style={{fontSize:'.68rem',color:'rgba(255,255,255,.2)',lineHeight:1.6}}>RGBチャンネル分離 + ランダム文字置換<br/>3〜7秒で自動発動。クリックでも発動。</div>
            </div>
          </ScanReveal>

          {/* Timeline */}
          <ScanReveal delay={400}>
            <div style={{borderRadius:'16px',border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.02)',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.15em',color:'rgba(167,139,250,.7)',textTransform:'uppercase',marginBottom:'.3rem'}}>&lt;timeline-item&gt;</div>
                <div style={{fontSize:'1rem',fontWeight:600,color:'rgba(255,255,255,.8)'}}>SVGラインが自走して繋がる</div>
              </div>
              <div style={{padding:'.5rem 0'}}>
                <TimelineStep date="Before" title="Web Components時代" body="ブラウザのDOMに依存。クライアント遷移で壊れる。" color="#6366f1" delay={200}/>
                <TimelineStep date="React化" title="BlogRenderer実装" body="HTMLをcheerioでパース。全コンポーネントをReact管理下に。" color="#a78bfa" delay={400}/>
                <TimelineStep date="Now" title="ゲームUIへの進化" body="confetti、Web Audio、物理バネ。HTMLタグ1行で展開。" color="#00ff88" isLast delay={600}/>
              </div>
              <div className="mono" style={{fontSize:'.68rem',color:'rgba(255,255,255,.2)',lineHeight:1.6}}>stroke-dashoffset アニメーション<br/>ドット→ライン→コンテンツの順に出現</div>
            </div>
          </ScanReveal>

          {/* Typewriter demo */}
          <ScanReveal delay={500}>
            <div style={{borderRadius:'16px',border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.02)',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.15em',color:'rgba(0,255,136,.6)',textTransform:'uppercase',marginBottom:'.3rem'}}>&lt;typewriter&gt;</div>
                <div style={{fontSize:'1rem',fontWeight:600,color:'rgba(255,255,255,.8)'}}>タイプミスして打ち直す</div>
              </div>
              <div style={{padding:'1.5rem',background:'rgba(0,0,0,.4)',borderRadius:'10px',border:'1px solid rgba(255,255,255,.06)',minHeight:'100px'}}>
                <p style={{fontSize:'1rem',lineHeight:1.7,color:'rgba(255,255,255,.75)'}}>
                  <Typewriter speed={60} mistakeRate={0.09} startDelay={500}>このシステムでは、HTMLに書かれた1行のタグが、知らないうちに複雑な体験へと変換される。</Typewriter>
                </p>
              </div>
              <div className="mono" style={{fontSize:'.68rem',color:'rgba(255,255,255,.2)',lineHeight:1.6}}>隣接キーテーブルでリアルなミス<br/>バックスペースで消して打ち直す</div>
            </div>
          </ScanReveal>

          {/* CounterUp demo */}
          <ScanReveal delay={600}>
            <div style={{borderRadius:'16px',border:'1px solid rgba(255,255,255,.08)',background:'rgba(255,255,255,.02)',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div>
                <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.15em',color:'rgba(124,58,237,.7)',textTransform:'uppercase',marginBottom:'.3rem'}}>&lt;counter-up&gt;</div>
                <div style={{fontSize:'1rem',fontWeight:600,color:'rgba(255,255,255,.8)'}}>目標値を超えてから戻る</div>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'.75rem',justifyContent:'center',padding:'1rem 0'}}>
                <CounterUp value={98} suffix="%" label="Lighthouse" stiffness={0.04} damping={0.65}/>
                <CounterUp value={2.71} decimals={2} label="Euler's e" stiffness={0.035} damping={0.6}/>
                <CounterUp value={1337} suffix=" ms" label="build time" stiffness={0.05} damping={0.68}/>
              </div>
              <div className="mono" style={{fontSize:'.68rem',color:'rgba(255,255,255,.2)',lineHeight:1.6}}>Verlet バネ積分<br/>stiffness / damping で物理を制御</div>
            </div>
          </ScanReveal>
        </div>
      </section>

      {/* ── THE HTML ── */}
      <section style={{position:'relative',zIndex:1,padding:'6rem clamp(1.5rem,5vw,4rem)',maxWidth:'1100px',margin:'0 auto'}}>
        <ScanReveal>
          <div className="mono" style={{fontSize:'.65rem',letterSpacing:'.2em',color:'rgba(124,58,237,.7)',textTransform:'uppercase',marginBottom:'1rem'}}>// The punchline</div>
          <h2 style={{fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:700,letterSpacing:'-.03em',marginBottom:'1rem',lineHeight:1.1}}>
            これを作ったHTMLは<br/><span style={{color:'#a78bfa'}}>こう書いた。</span>
          </h2>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:'.95rem',marginBottom:'2.5rem'}}>このデモ全体が、1枚のHTMLファイルから生成されている。</p>
        </ScanReveal>
        <ScanReveal delay={200}>
          <div style={{borderRadius:'14px',background:'rgba(0,0,0,.6)',border:'1px solid rgba(255,255,255,.08)',overflow:'hidden'}}>
            <div style={{padding:'.6rem 1rem',borderBottom:'1px solid rgba(255,255,255,.06)',display:'flex',gap:'.4rem',alignItems:'center'}}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(c=><div key={c} style={{width:'10px',height:'10px',borderRadius:'50%',background:c}}/>)}
              <span className="mono" style={{fontSize:'.72rem',color:'rgba(255,255,255,.25)',marginLeft:'.5rem'}}>2026-02-17-blog-system.html</span>
            </div>
            <pre className="mono" style={{padding:'1.5rem',fontSize:'.8rem',lineHeight:1.8,color:'rgba(255,255,255,.6)',overflow:'auto',margin:0}}>{`<fade-in delay="0">
  <h1><glitch-text>HTML is not the destination.</glitch-text></h1>
  <p><typewriter speed="35">コンテンツと体験を完全に分離したシステム。</typewriter></p>
</fade-in>

<interactive-checklist>
  <li>BlogRenderer はサーバー専用</li>
  <li>confettiは120粒爆散する</li>
</interactive-checklist>

<quiz-block
  question="BlogRendererの実行場所は？"
  answer="サーバー"
  hint="クライアントにcheerioは存在しない"
>
  <li>ブラウザ</li>
  <li>サーバー</li>
</quiz-block>

<counter-up value="98" suffix="%" label="Lighthouse" stiffness="0.04" />

<timeline-item date="Now" title="ゲームUIへの進化" color="#00ff88" last="true">
  HTMLタグ1行で全記事に展開される。
</timeline-item>`}</pre>
          </div>
        </ScanReveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{position:'relative',zIndex:1,padding:'4rem clamp(1.5rem,5vw,4rem)',borderTop:'1px solid rgba(255,255,255,.06)',maxWidth:'1100px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1.5rem'}}>
        <div>
          <div style={{fontSize:'1.1rem',fontWeight:700,letterSpacing:'-.02em',marginBottom:'.25rem'}}>
            <GlitchText intensity={.6}>rancorder.dev</GlitchText>
          </div>
          <div className="mono" style={{fontSize:'.72rem',color:'rgba(255,255,255,.3)'}}>HTML → React AST Generator</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'.35rem',alignItems:'flex-end'}}>
          {['Next.js 14','React 18','cheerio','Canvas 2D','Web Audio API'].map(t=>(
            <span key={t} className="mono" style={{fontSize:'.68rem',color:'rgba(255,255,255,.25)',letterSpacing:'.05em'}}>{t}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
