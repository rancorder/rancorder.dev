import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

/* ─── Audio ─── */
let _ac = null;
function getCtx() {
  try {
    if (!_ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; _ac = new A(); }
    if (_ac.state === "suspended") _ac.resume();
    return _ac;
  } catch(_){ return null; }
}
function beep(freq, type, dur, vol) {
  try {
    const ctx = getCtx(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type||"square"; o.frequency.setValueAtTime(freq||440, ctx.currentTime);
    g.gain.setValueAtTime(vol||0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+(dur||0.08));
    o.start(); o.stop(ctx.currentTime+(dur||0.08));
  } catch(_){}
}
const sfxClick  = () => beep(900,"square",0.04,0.04);
const sfxSelect = () => { beep(660,"sine",0.08,0.08); setTimeout(()=>beep(880,"sine",0.12,0.06),80); };
const sfxWhoosh = () => [200,300,500].forEach((f,i)=>setTimeout(()=>beep(f,"sine",0.12,0.06),i*50));
const sfxImpact = () => { beep(80,"sawtooth",0.2,0.12); setTimeout(()=>beep(120,"square",0.1,0.06),60); };
const sfxChime  = () => [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,"sine",0.3,0.1),i*90));
const sfxBoot   = () => [220,330,440,330,550].forEach((f,i)=>setTimeout(()=>beep(f,"square",0.1,0.05),i*120));

/* ─── useWindowSize ─── */
function useIsMobile() {
  const [mob, setMob] = useState(window.innerWidth < 640);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

/* ─── Swipe hook ─── */
function useSwipe(onLeft, onRight) {
  const startX = useRef(null);
  const startY = useRef(null);
  return {
    onTouchStart: (e) => { startX.current = e.touches[0].clientX; startY.current = e.touches[0].clientY; },
    onTouchEnd: (e) => {
      if (startX.current === null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = e.changedTouches[0].clientY - startY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) onLeft();
        else onRight();
      }
      startX.current = null; startY.current = null;
    },
  };
}

/* ─── MatrixBg ─── */
function MatrixBg() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const CHARS = "アイウエカキ0123456789ABCDEF><{}|_";
    let drops = Array(Math.floor(W/18)).fill(1);
    let running = !document.hidden, raf;
    const resize = () => { W=window.innerWidth; H=window.innerHeight; canvas.width=W; canvas.height=H; drops=Array(Math.floor(W/18)).fill(1); };
    const onVis = () => { running = !document.hidden; };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0,0,W,H);
      ctx.font = "13px monospace";
      for (let i=0; i<drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random()*CHARS.length)];
        ctx.fillStyle = drops[i]*18>H*0.6 ? "rgba(0,230,80,0.9)" : "rgba(0,"+(160+Math.floor(Math.random()*60))+",60,"+(0.3+Math.random()*0.3)+")";
        ctx.fillText(ch, i*18, drops[i]*18);
        if (drops[i]*18>H && Math.random()>0.975) drops[i]=0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); document.removeEventListener("visibilitychange",onVis); };
  }, []);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,opacity:0.08,pointerEvents:"none"}}/>;
}

/* ─── Glitch ─── */
const GC = "!@#$%^&*_<>[]{}|/?01";
function Glitch({ children, trigger }) {
  const [txt, setTxt] = useState(children);
  const prev = useRef(0);
  useEffect(() => {
    if (!trigger || trigger === prev.current) return;
    prev.current = trigger;
    let f = 0;
    const tick = () => {
      f++;
      const t = f/20;
      if (t<0.5) setTxt(children.split("").map(c=>c!==" "&&c!=="\n"&&Math.random()<0.6?GC[Math.floor(Math.random()*GC.length)]:c).join(""));
      else { const lim=Math.floor(((t-0.5)/0.5)*children.length); setTxt(children.split("").map((c,i)=>i<=lim?c:c!==" "&&c!=="\n"&&Math.random()<0.3?GC[Math.floor(Math.random()*GC.length)]:c).join("")); }
      if (f<20) requestAnimationFrame(tick); else setTxt(children);
    };
    requestAnimationFrame(tick);
  }, [trigger, children]);
  return <span>{txt}</span>;
}

/* ─── Corners ─── */
function Corners({ color, size, t }) {
  const c = color||"#00e050"; const sz = size||24; const th = t||2;
  const s = {position:"absolute",width:sz,height:sz};
  const b = th+"px solid "+c;
  return <>
    <div style={{...s,top:0,left:0,borderTop:b,borderLeft:b}}/>
    <div style={{...s,top:0,right:0,borderTop:b,borderRight:b}}/>
    <div style={{...s,bottom:0,left:0,borderBottom:b,borderLeft:b}}/>
    <div style={{...s,bottom:0,right:0,borderBottom:b,borderRight:b}}/>
  </>;
}

/* ─── MiniDots (mobile-friendly) ─── */
function MiniDots({ cur, total }) {
  return (
    <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{width:i<cur?18:6,height:3,background:i<cur?"#00e050":"rgba(0,230,80,.2)",boxShadow:i<cur?"0 0 4px rgba(0,230,80,.6)":"none",transition:"all .3s ease",borderRadius:2}}/>
      ))}
    </div>
  );
}

/* ─── ChoiceBtn ─── */
function ChoiceBtn({ label, sub, color, onClick, chosen }) {
  const c = color||"#00e050";
  return (
    <button onClick={onClick} style={{
      background: chosen ? c+"18" : "transparent",
      border: "1px solid "+(chosen?c:c+"33"),
      color: chosen ? c : c+"77",
      fontFamily:"'VT323',monospace",
      fontSize:"clamp(1.05rem,3.5vw,1.3rem)",
      padding:"clamp(.75rem,3vw,1rem) clamp(.75rem,3vw,1.25rem)",
      cursor:"pointer",
      textAlign:"left",
      transition:"all .2s",
      display:"flex",alignItems:"flex-start",gap:"clamp(.6rem,2vw,1rem)",
      position:"relative",overflow:"hidden",
      boxShadow: chosen ? "0 0 16px "+c+"22" : "none",
      WebkitTapHighlightColor:"transparent",
      width:"100%",
    }}>
      {chosen && <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:c}}/>}
      <span style={{color:c,opacity:chosen?1:0.5,minWidth:22,flexShrink:0}}>{label}</span>
      <span style={{lineHeight:1.5}}>{sub}</span>
    </button>
  );
}

/* ─── SlideShell: scrollable content area for mobile ─── */
function Shell({ children }) {
  return (
    <div style={{
      height:"100%",
      overflowY:"auto",
      overflowX:"hidden",
      WebkitOverflowScrolling:"touch",
      padding:"clamp(1.2rem,5vw,0) clamp(1.2rem,6vw,5vw)",
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      boxSizing:"border-box",
    }}>
      {children}
    </div>
  );
}

const V = "'VT323',monospace";


/* ═══ SLIDES ═══ */

function S0_Boot() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    sfxBoot();
    const t1 = setTimeout(()=>setPhase(1),800);
    const t2 = setTimeout(()=>setPhase(2),2000);
    const t3 = setTimeout(()=>setPhase(3),3200);
    return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  },[]);
  return (
    <Shell>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"clamp(1.5rem,5vw,2.5rem)"}}>
        <div style={{fontFamily:V,fontSize:"clamp(.9rem,3.5vw,1.2rem)",color:"#00e050",letterSpacing:".3em",opacity:phase>=1?1:0,transition:"opacity .6s"}}>
          SYSTEM BOOTING...
        </div>
        <div style={{fontFamily:V,fontSize:"clamp(2rem,8vw,5rem)",color:"#fff",letterSpacing:".05em",textShadow:"0 0 40px rgba(0,230,80,.6)",lineHeight:1.1,opacity:phase>=2?1:0,transition:"opacity .8s",transform:phase>=2?"translateY(0)":"translateY(16px)"}}>
          AST DECISION<br/><span style={{color:"#00e050"}}>SUPPORT MODULE</span>
        </div>
        <div style={{fontFamily:V,fontSize:"clamp(1.1rem,4.5vw,1.7rem)",color:"#aaa",lineHeight:1.8,opacity:phase>=3?1:0,transition:"opacity .8s"}}>
          今日は説明じゃなく、<br/>ちょっとした<span style={{color:"#ffaa00"}}>"思考ゲーム"</span>です。
        </div>
        {phase>=3 && (
          <div style={{fontFamily:V,color:"rgba(0,230,80,.3)",fontSize:"clamp(.75rem,3vw,.85rem)",letterSpacing:".15em",display:"flex",alignItems:"center",gap:".75rem",animation:"fadeIn .8s ease"}}>
            <span style={{animation:"blink 1.5s step-end infinite"}}>▶</span> スワイプ または NEXT をタップ
          </div>
        )}
      </div>
    </Shell>
  );
}

function S1_Q1() {
  return (
    <Shell>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{fontFamily:V,color:"#444",fontSize:"clamp(.8rem,3vw,1rem)",letterSpacing:".15em",marginBottom:"clamp(.5rem,2vw,1rem)"}}>Q.</div>
        <div style={{fontFamily:V,fontSize:"clamp(2rem,8vw,5rem)",color:"#fff",lineHeight:1.2,textShadow:"0 0 30px rgba(255,170,0,.3)"}}>
          今日、このアポを<br/>受けてもらった<br/><span style={{color:"#ffaa00"}}>一番近い理由は？</span>
        </div>
      </div>
    </Shell>
  );
}

function S2_Select({ onSelect, scenario }) {
  const choices = [
    {id:1,label:"[1]",sub:"たまたま時間が空いてた",        color:"#fff"},
    {id:2,label:"[2]",sub:"断る理由がなかった",             color:"#fff"},
    {id:3,label:"[3]",sub:"ちょっと引っかかる言葉があった",color:"#fff"},
    {id:4,label:"[4]",sub:"正直、よく覚えてない",          color:"#fff"},
    {id:5,label:"[5]",sub:"実は密かに、依頼先を探していた",color:"#fff"},
  ];
  return (
    <Shell>
      <div style={{fontFamily:V,fontSize:"clamp(1.3rem,5vw,2rem)",color:"#fff",marginBottom:"clamp(1rem,4vw,2rem)"}}>直感で一つだけ。</div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.5rem,2vw,.75rem)"}}>
        {choices.map(ch=>(
          <ChoiceBtn key={ch.id} label={ch.label} sub={ch.sub} color={ch.color}
            onClick={()=>{ sfxSelect(); onSelect(ch.id); }}
            chosen={scenario===ch.id}
          />
        ))}
      </div>
    </Shell>
  );
}

function S3_Shift() {
  return (
    <Shell>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{fontFamily:V,fontSize:"clamp(1.8rem,7vw,4.2rem)",color:"#fff",lineHeight:1.3}}>
          その選び方、<br/><span style={{color:"#00aaff"}}>"判断を任せる相手"</span>を<br/>探す時と<br/>ほぼ同じです。
        </div>
      </div>
    </Shell>
  );
}

function S5_CoreQ({ glitch }) {
  return (
    <Shell>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{fontFamily:V,color:"#333",fontSize:"clamp(.75rem,3vw,1rem)",letterSpacing:".15em",marginBottom:"clamp(1rem,4vw,1.5rem)"}}>&gt;&gt; 出力中...</div>
        <div style={{fontFamily:V,fontSize:"clamp(2rem,8vw,5rem)",lineHeight:1.2,color:"#fff",textShadow:"0 0 40px rgba(0,230,80,.3)",marginBottom:"clamp(1.5rem,5vw,3rem)"}}>
          <Glitch trigger={glitch}>{"探している時点で、"}</Glitch><br/>
          <Glitch trigger={glitch}>{"もう一つ"}</Glitch><br/>
          <span style={{color:"#00e050",textShadow:"0 0 50px rgba(0,230,80,.9)"}}>
            <Glitch trigger={glitch}>{'"期待していること"'}</Glitch>
          </span><br/>
          <Glitch trigger={glitch}>{"決まってません？"}</Glitch>
        </div>
      </div>
    </Shell>
  );
}

function S6_Attack({ glitch }) {
  return (
    <Shell>
      <div style={{fontFamily:V,fontSize:"clamp(1.8rem,7vw,4.2rem)",lineHeight:1.35,color:"#fff"}}>
        <Glitch trigger={glitch}>{"それ、"}</Glitch><br/>
        <Glitch trigger={glitch}>{"新しいものへの期待より──"}</Glitch>
        <br/><br/>
        <span style={{color:"#ffaa00",textShadow:"0 0 30px rgba(255,170,0,.5)",display:"block"}}>
          <Glitch trigger={glitch}>{'"前回と同じにしたくない"'}</Glitch>
        </span>
        <span style={{color:"#fff"}}>という気持ちに近くないですか？</span>
      </div>
    </Shell>
  );
}


/* ─── CAE 3D Viewer ─── */
function CAE3D() {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a08);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(3.5, 2.2, 3.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    el.appendChild(renderer.domElement);

    // Grid
    const grid = new THREE.GridHelper(6, 12, 0x00e050, 0x0a2010);
    grid.position.y = -0.8;
    scene.add(grid);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(4, 6, 4);
    scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0x0044ff, 0.3);
    dl2.position.set(-4, 2, -4);
    scene.add(dl2);

    // Build FEM bracket mesh (subdivided box)
    const SEG = 12;
    const geo = new THREE.BoxGeometry(2.4, 0.4, 0.8, SEG * 3, SEG, SEG);
    const posArr = geo.attributes.position;
    const count = posArr.count;

    // Stress color function: blue→cyan→green→yellow→red
    const stressColor = (t) => {
      const c = new THREE.Color();
      if (t < 0.25)      c.setRGB(0, t * 4, 1);
      else if (t < 0.5)  c.setRGB(0, 1, 1 - (t - 0.25) * 4);
      else if (t < 0.75) c.setRGB((t - 0.5) * 4, 1, 0);
      else               c.setRGB(1, 1 - (t - 0.75) * 4, 0);
      return c;
    };

    // Base stress: left end = 0 (blue), right end = 1 (red)
    const baseColors = new Float32Array(count * 3);
    const baseX = [];
    for (let i = 0; i < count; i++) {
      const x = posArr.getX(i);
      const t = (x + 1.2) / 2.4; // normalize 0-1
      baseX.push(t);
      const c = stressColor(t);
      baseColors[i * 3]     = c.r;
      baseColors[i * 3 + 1] = c.g;
      baseColors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(baseColors.slice(), 3));

    const mat = new THREE.MeshPhongMaterial({
      vertexColors: true, shininess: 60,
      transparent: true, opacity: 0.92,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Wireframe overlay
    const wfMat = new THREE.MeshBasicMaterial({ color: 0x00e050, wireframe: true, transparent: true, opacity: 0.08 });
    const wf = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.8, SEG * 3, SEG, SEG), wfMat);
    scene.add(wf);

    // Fixed end marker (left)
    const fixGeo = new THREE.BoxGeometry(0.08, 0.7, 1.0);
    const fixMat = new THREE.MeshPhongMaterial({ color: 0x0055ff });
    const fix = new THREE.Mesh(fixGeo, fixMat);
    fix.position.set(-1.24, 0, 0);
    scene.add(fix);

    // Load arrow (right end, pointing down)
    const arrowDir = new THREE.Vector3(0, -1, 0);
    const arrowOrigin = new THREE.Vector3(1.2, 0.6, 0);
    const arrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, 0.7, 0xff0000, 0.2, 0.12);
    scene.add(arrow);

    // Load label sprite
    const canvas2 = document.createElement("canvas");
    canvas2.width = 128; canvas2.height = 64;
    const ctx2 = canvas2.getContext("2d");
    ctx2.fillStyle = "#ff0000"; ctx2.font = "bold 28px monospace";
    ctx2.fillText("LOAD", 10, 44);
    const tex = new THREE.CanvasTexture(canvas2);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sprite.position.set(1.5, 1.0, 0);
    sprite.scale.set(0.8, 0.4, 1);
    scene.add(sprite);

    // Auto-rotate + deformation animation
    let raf;
    const clock = new THREE.Clock();

    // Store base y positions
    const baseY = [];
    for (let i = 0; i < count; i++) baseY.push(posArr.getY(i));

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Deform: cantilever bend (more deflection toward right end)
      const deformAmp = 0.08 * Math.abs(Math.sin(t * 0.6));
      const colors = geo.attributes.color;
      for (let i = 0; i < count; i++) {
        const xn = baseX[i];
        const deflection = -deformAmp * xn * xn;
        posArr.setY(i, baseY[i] + deflection);

        // Dynamic stress: amplify color at peak deformation
        const stress = xn + deformAmp * 3 * (1 - xn);
        const clampedStress = Math.min(1, Math.max(0, stress));
        const c = stressColor(clampedStress);
        colors.setXYZ(i, c.r, c.g, c.b);
      }
      posArr.needsUpdate = true;
      colors.needsUpdate = true;

      mesh.rotation.y = t * 0.18;
      wf.rotation.y = t * 0.18;
      fix.rotation.y = t * 0.18;
      arrow.rotation.y = t * 0.18;

      renderer.render(scene, camera);
    };
    animate();

    // Touch orbit
    let lastX = null;
    const onTouchMove = (e) => {
      if (!lastX) { lastX = e.touches[0].clientX; return; }
      const dx = e.touches[0].clientX - lastX;
      camera.position.applyEuler(new THREE.Euler(0, dx * 0.01, 0));
      camera.lookAt(0, 0, 0);
      lastX = e.touches[0].clientX;
    };
    const onTouchEnd = () => { lastX = null; };
    renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    renderer.domElement.addEventListener("touchend", onTouchEnd);

    // Mouse orbit
    let dragging = false, lastMX = 0;
    renderer.domElement.addEventListener("mousedown", e => { dragging = true; lastMX = e.clientX; });
    window.addEventListener("mouseup", () => { dragging = false; });
    window.addEventListener("mousemove", e => {
      if (!dragging) return;
      const dx = e.clientX - lastMX;
      camera.position.applyEuler(new THREE.Euler(0, dx * 0.008, 0));
      camera.lookAt(0, 0, 0);
      lastMX = e.clientX;
    });

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", marginTop: "1rem" }}>
      <div ref={mountRef} style={{ width: "100%", height: "clamp(180px,40vw,260px)", background: "#050a08" }} />
      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 8, left: 8,
        display: "flex", flexDirection: "column", gap: 3,
      }}>
        {[["高応力","#ff2200"],["中応力","#ffaa00"],["低応力","#00aaff"]].map(([lbl,clr]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, background: clr, flexShrink: 0 }} />
            <span style={{ fontFamily: V, fontSize: "clamp(.6rem,2vw,.7rem)", color: "#aaa" }}>{lbl}</span>
          </div>
        ))}
      </div>
      {/* Labels */}
      <div style={{
        position: "absolute", bottom: 8, right: 8,
        fontFamily: V, fontSize: "clamp(.6rem,2vw,.7rem)", color: "rgba(0,230,80,.4)",
        textAlign: "right", lineHeight: 1.8,
      }}>
        <div>ドラッグで回転</div>
        <div style={{ color: "#0055ff88" }}>■ 固定端</div>
        <div style={{ color: "#ff000088" }}>▼ 荷重点</div>
      </div>
    </div>
  );
}

/* ─── Jig Images ─── */
const JIG_TOP = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wAARCAE2AYYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5UooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHYJNIRg8ipthbhHQ57Zx/Oo3Qqef05qtOg+VoZRRRUiCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoor3n4b/AAp0DWPA9pda5p3m3V4zTrIJGR0Q8KAVPTAzg5+9QB4NRXu+sfs66fJltI1i4gP9y6QSDP1XBA/A1xWrfA3xhpuWgt7XUEB620wzj6PtP4DNAHntFX9T0PVdGfZqWnXdmx6CeFkz9MjmqFAFiexuraGCee2liiuFLQu6ELIAcEqT1GeOKr16l4Q8R+G9Y8MN4R1DRrti0LMs0OZpBP1Dxjqp9umM+pzy1z4dsIJ3hl+028inlJflZfqCKAOakikjCmRGTeNy7hjI9R7VHXsUJ8JeIPCUPhuYS/breFRZ3chDS+dknyww48sk4APTr1rjvEfw8udD083MchnaNj5qgj5U/vAdT2/wwM0AcdRRU9taT3knlwRNI3XAFAEFFT3NpPZyeXcQvE+M4cY49agoAKKKKACiiigAooooAKKK0NC0ybWtYtLCBVZ5pAuGOBjqSfbAJ45oA7fwz4T02fQYWvbZJ5J/3u45VlBxgAjmkvfhxYS5NpczW55+VsOvt7/qa7YaNe2kKILYFUG3ET7goHTGcE/lVG9mNrC5ZWSTb8qOpVieg4PPWgDhLb4dyXEUjf2ggZXKqfLOGx360+D4ZXDvibUoYx6iMt/UV21uhtooYQFxgc579TxVigDgp/hfcxtlNTtnTPJKEHH0rmdU0O90qV1mhYxgkCQDKsPXjp9K9jqvcWFtdAiWINn8P5UAeJ0V6m/g3TIJ5LyNMN5bjY4BTJBGcYrzS9tZLO5eGUKGHPy9KAK9FFFAG34N0FvE/ifTtJCkrcTASY7IOWP/AHyDX0drPwS8FavuZdOewkb+OzlKfkpyo/KvPv2b9AM2p6nr0ifJBELWInu7EMxHuAoH/Aq98r2MFh4uneSvc8vF15KdovY8K1f9mudctpGuxuMcR3URU5/3lz/KuH1j4NeNdH3M2jveRj+OzYS5+ij5v0r6torSeApvbQzhjai31PiO7sLuwmMN3az28oJBSWMowP0N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";
const JIG_BOT = "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";
function JigImages() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:"1rem"}}>
      <div style={{fontFamily:"'VT323',monospace",fontSize:"clamp(.65rem,2.5vw,.75rem)",color:"rgba(0,230,80,.4)",letterSpacing:".15em",marginBottom:2}}>
        WORKS ── 機械設計実績
      </div>
      <img src={"data:image/jpeg;base64,"+JIG_TOP}
        style={{width:"100%",border:"1px solid rgba(0,230,80,.2)",display:"block"}} alt="治具設計例1"/>
      <img src={"data:image/jpeg;base64,"+JIG_BOT}
        style={{width:"100%",border:"1px solid rgba(0,230,80,.2)",display:"block"}} alt="治具設計例2"/>
    </div>
  );
}

/* ─── Layout Image ─── */
const LAYOUT_IMG = "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";
function LayoutImage() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:"1rem"}}>
      <div style={{fontFamily:"'VT323',monospace",fontSize:"clamp(.65rem,2.5vw,.75rem)",color:"rgba(255,170,0,.4)",letterSpacing:".15em",marginBottom:2}}>
        WORKS ── レイアウト設計実績
      </div>
      <img src={"data:image/jpeg;base64,"+LAYOUT_IMG}
        style={{width:"100%",border:"1px solid rgba(255,170,0,.2)",display:"block"}} alt="レイアウト設計例"/>
    </div>
  );
}
function S_Interest() {
  const [openBiz, setOpenBiz] = useState(null);
  const [openAdv, setOpenAdv] = useState(null);

  const biz = [
    {
      id:"mech",
      icon:"⚙",
      title:"治具設計",
      sub:"3D CAD設計・装置・治具",
      color:"#00e050",
      detail:"IRONCAD / SOLIDWORKS / CREOによる完全3D設計。動作チャック上のすべての設備状態を再現。",
      benefit:"干渉・強度不足による手直しゼロ。図面品質と納期を同時に担保します。",
    },
    {
      id:"cae",
      icon:"📐",
      title:"CAE解析",
      sub:"FEM構造解析・強度検証",
      color:"#00aaff",
      detail:"有限要素法による製作前シミュレーション。安全率・応力・変位量を可視化。",
      benefit:"作る前に壊れる箇所がわかる。コストと時間の無駄を設計段階で潰します。",
    },
    {
      id:"layout",
      icon:"🏭",
      title:"レイアウト設計",
      sub:"工場・生産設備レイアウト",
      color:"#ffaa00",
      detail:"ロボット到達性・作業性・メンテ性を3Dシミュレーションで検証したレイアウト提案。",
      benefit:"「入れてみたら動かない」がなくなる。設備導入前に最適解を確定します。",
    },
  ];

  const adv = [
    {icon:"🎯", title:"技術力",             txt:"用途に応じた的確な判断。シンプルかつメンテナンス性に優れた設計。",                       color:"#00e050"},
    {icon:"💬", title:"コミュニケーション", txt:"対面・Web会議を駆使し、「求められていること」を言語化してから設計に入る。",                color:"#00aaff"},
    {icon:"⚡", title:"スピード",           txt:"3D設計による修正極小化。短納期と品質を両立し、トータルコストを下げる。",                  color:"#ffaa00"},
  ];

  const toggle = (id, open, setOpen) => {
    sfxSelect();
    setOpen(open === id ? null : id);
  };

  return (
    <Shell>
      <div style={{fontFamily:V,color:"#00e050",fontSize:"clamp(.7rem,2.5vw,.8rem)",letterSpacing:".2em",marginBottom:"clamp(.75rem,3vw,1.25rem)"}}>
        SCOPE ── アストができること
      </div>

      {/* 事業パネル */}
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.4rem,1.5vw,.6rem)",marginBottom:"clamp(1rem,4vw,1.5rem)"}}>
        {biz.map(b=>(
          <div key={b.id}>
            <button
              onClick={()=>toggle(b.id,openBiz,setOpenBiz)}
              style={{
                width:"100%",textAlign:"left",background:openBiz===b.id?b.color+"14":"transparent",
                border:"1px solid "+(openBiz===b.id?b.color:b.color+"33"),
                padding:"clamp(.75rem,3vw,1rem) clamp(.75rem,3vw,1.25rem)",
                display:"flex",alignItems:"center",gap:"clamp(.6rem,2vw,1rem)",
                cursor:"pointer",transition:"all .2s",WebkitTapHighlightColor:"transparent",
                position:"relative",
              }}
            >
              <span style={{fontSize:"clamp(1.2rem,4vw,1.5rem)",flexShrink:0}}>{b.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:V,fontSize:"clamp(1.1rem,4vw,1.4rem)",color:openBiz===b.id?b.color:"#fff",lineHeight:1}}>{b.title}</div>
                <div style={{fontFamily:V,fontSize:"clamp(.75rem,2.5vw,.85rem)",color:"#555",marginTop:".2rem"}}>{b.sub}</div>
              </div>
              <span style={{fontFamily:V,color:b.color,fontSize:"clamp(.9rem,3vw,1.1rem)",flexShrink:0,transition:"transform .2s",display:"inline-block",transform:openBiz===b.id?"rotate(90deg)":"rotate(0deg)"}}>▶</span>
            </button>
            {openBiz===b.id && (
              <div style={{
                padding:"clamp(.75rem,3vw,1.25rem) clamp(1rem,4vw,1.5rem)",
                borderLeft:"3px solid "+b.color,
                borderRight:"1px solid "+b.color+"33",
                borderBottom:"1px solid "+b.color+"33",
                background:b.color+"08",
                animation:"fadeIn .2s ease",
              }}>
                {b.id === "cae" && <CAE3D />}
                {b.id === "mech" && <JigImages />}
                {b.id === "layout" && <LayoutImage />}
                <div style={{fontFamily:V,fontSize:"clamp(.9rem,3.5vw,1.1rem)",color:"#aaa",lineHeight:1.7,marginBottom:".75rem",marginTop:b.id==="cae"?"1rem":0}}>{b.detail}</div>
                <div style={{display:"flex",alignItems:"flex-start",gap:".6rem",padding:".6rem .9rem",background:b.color+"18",border:"1px solid "+b.color+"44"}}>
                  <span style={{color:b.color,fontFamily:V,flexShrink:0}}>✓</span>
                  <div style={{fontFamily:V,fontSize:"clamp(.9rem,3.5vw,1.1rem)",color:b.color,lineHeight:1.6}}>{b.benefit}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 強みバー */}
      <div style={{fontFamily:V,color:"rgba(0,230,80,.4)",fontSize:"clamp(.65rem,2.5vw,.75rem)",letterSpacing:".2em",marginBottom:"clamp(.5rem,2vw,.75rem)"}}>
        ADVANTAGE ──
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"clamp(.35rem,1.5vw,.5rem)"}}>
        {adv.map(a=>(
          <button
            key={a.title}
            onClick={()=>toggle(a.title,openAdv,setOpenAdv)}
            style={{
              width:"100%",textAlign:"left",cursor:"pointer",WebkitTapHighlightColor:"transparent",
              background:openAdv===a.title?a.color+"10":"transparent",
              border:"1px solid "+(openAdv===a.title?a.color+"66":a.color+"22"),
              padding:"clamp(.6rem,2.5vw,.9rem) clamp(.75rem,3vw,1.1rem)",
              transition:"all .2s",
            }}
          >
            <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
              <span style={{fontSize:"clamp(1rem,3.5vw,1.2rem)",flexShrink:0}}>{a.icon}</span>
              <span style={{fontFamily:V,fontSize:"clamp(1rem,4vw,1.25rem)",color:openAdv===a.title?a.color:"#888",flex:1}}>{a.title}</span>
              <span style={{fontFamily:V,color:a.color+"66",fontSize:".8rem",transition:"transform .2s",display:"inline-block",transform:openAdv===a.title?"rotate(90deg)":"rotate(0deg)"}}>▶</span>
            </div>
            {openAdv===a.title && (
              <div style={{fontFamily:V,fontSize:"clamp(.85rem,3.5vw,1rem)",color:"#aaa",lineHeight:1.7,marginTop:".6rem",paddingTop:".6rem",borderTop:"1px solid "+a.color+"22",animation:"fadeIn .2s ease"}}>
                {a.txt}
              </div>
            )}
          </button>
        ))}
      </div>
    </Shell>
  );
}

function S10_Value() {
  return (
    <Shell>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{fontFamily:V,fontSize:"clamp(1.2rem,5vw,2rem)",color:"#888",marginBottom:"clamp(1.2rem,4vw,2rem)"}}>
          さっき話してくれた<br/>あの<span style={{color:"#ffaa00"}}>"ズレた瞬間"</span>。
        </div>
        <div style={{padding:"clamp(1.5rem,6vw,3rem) clamp(1.5rem,6vw,4rem)",border:"2px solid rgba(0,230,80,.5)",background:"rgba(0,230,80,.04)",position:"relative",width:"100%",maxWidth:600}}>
          <Corners color="#00e050" size={24} t={2}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent,rgba(0,230,80,.05),transparent)",animation:"scanV 3s linear infinite",pointerEvents:"none"}}/>
          <div style={{fontFamily:V,fontSize:"clamp(1.5rem,6vw,3rem)",color:"#fff",lineHeight:1.6,textShadow:"0 0 20px rgba(0,230,80,.3)"}}>
            うちは、<br/>その<span style={{color:"#ffaa00",textShadow:"0 0 16px rgba(255,170,0,.5)"}}>"ズレ"</span>を<br/>最初に設計に組み込む役割で<br/><span style={{color:"#00e050",textShadow:"0 0 30px rgba(0,230,80,.8)"}}>呼ばれます。</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}


function S12_End() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    sfxChime();
    const t = setTimeout(()=>setPhase(1),1200);
    return ()=>clearTimeout(t);
  },[]);
  return (
    <Shell>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"clamp(1.5rem,5vw,2.5rem)"}}>
        <div style={{fontFamily:V,fontSize:"clamp(.9rem,3.5vw,1.2rem)",color:"rgba(0,230,80,.5)",letterSpacing:".3em",animation:"blink 2s step-end infinite"}}>
          SYSTEM END.
        </div>
        <div style={{width:120,height:1,background:"linear-gradient(90deg,transparent,rgba(0,230,80,.5),transparent)"}}/>
        <div style={{fontFamily:V,fontSize:"clamp(1.8rem,7vw,4rem)",color:"#fff",lineHeight:1.3,opacity:phase?1:0,transition:"opacity 1s",textShadow:"0 0 24px rgba(0,230,80,.3)"}}>
          今日は、<br/><span style={{color:"#00e050"}}>ここまでで十分です。</span>
        </div>
        <div style={{marginTop:"1rem",fontFamily:V,color:"#333",fontSize:"clamp(.75rem,3vw,.85rem)",letterSpacing:".12em"}}>
          株式会社アスト / AST Co., Ltd.
        </div>
      </div>
    </Shell>
  );
}

/* ═══ APP ═══ */
const TOTAL = 9;
const LABELS = ["BOOT","Q1","SELECT","SHIFT","CORE_Q","ATTACK","VALUE","SCOPE","END"];

export default function App() {
  const [idx,      setIdx]      = useState(0);
  const [glitch,   setGlitch]   = useState(0);
  const [dir,      setDir]      = useState(1);
  const [scenario, setScenario] = useState(null);
  const isMobile = useIsMobile();

  const go = useCallback((next) => {
    if (next < 0 || next >= TOTAL) return;
    sfxClick(); sfxWhoosh();
    setTimeout(sfxImpact, 180);
    setDir(next > idx ? 1 : -1);
    setGlitch(g => g+1);
    setTimeout(() => setIdx(next), 160);
  }, [idx]);

  // keyboard
  useEffect(() => {
    const h = (e) => {
      if (["ArrowRight","ArrowDown"," "].includes(e.key)) { e.preventDefault(); go(idx+1); }
      if (["ArrowLeft","ArrowUp"].includes(e.key))        { e.preventDefault(); go(idx-1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go, idx]);

  useEffect(() => { if (idx===8) setTimeout(sfxChime,300); }, [idx]);

  // swipe
  const swipe = useSwipe(()=>go(idx+1), ()=>go(idx-1));

  const anim = dir===1 ? "slideInF .22s cubic-bezier(.16,1,.3,1)" : "slideInB .22s cubic-bezier(.16,1,.3,1)";
  const p = { glitch, scenario };

  const renderSlide = () => {
    switch(idx) {
      case 0:  return <S0_Boot/>;
      case 1:  return <S1_Q1/>;
      case 2:  return <S2_Select onSelect={setScenario} scenario={scenario}/>;
      case 3:  return <S3_Shift/>;
      case 4:  return <S5_CoreQ {...p}/>;
      case 5:  return <S6_Attack {...p}/>;
      case 6:  return <S10_Value/>;
      case 7:  return <S_Interest/>;
      case 8:  return <S12_End/>;






      default: return null;
    }
  };

  const handleAreaClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    // on mobile, tap advances
    if (isMobile) go(idx+1);
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body,#root{width:100%;height:100%;overflow:hidden;cursor:crosshair;background:#000;-webkit-text-size-adjust:100%}
    body{color:#c8ffc8;font-family:'Share Tech Mono',monospace;touch-action:pan-y}
    ::selection{background:#00e050;color:#000}
    button{-webkit-tap-highlight-color:transparent;touch-action:manipulation}
    @keyframes blink   {0%,100%{opacity:1}50%{opacity:0}}
    @keyframes scanV   {from{top:-100%}to{top:100%}}
    @keyframes fadeIn  {from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideInF{from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)}}
    @keyframes slideInB{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
    ::-webkit-scrollbar{display:none}
    *{scrollbar-width:none}
  `;

  return (
    <div style={{width:"100vw",height:"100vh",background:"#000",overflow:"hidden",position:"relative"}}>
      <style dangerouslySetInnerHTML={{__html:css}}/>
      <MatrixBg/>
      {/* scanlines */}
      <div style={{position:"fixed",inset:0,zIndex:1,background:"repeating-linear-gradient(0deg,rgba(0,0,0,.12) 0,rgba(0,0,0,.12) 1px,transparent 1px,transparent 3px)",pointerEvents:"none"}}/>
      <div style={{position:"fixed",left:0,right:0,height:"2px",zIndex:2,background:"linear-gradient(90deg,transparent,rgba(0,230,80,.8),rgba(0,230,80,1),rgba(0,230,80,.8),transparent)",boxShadow:"0 0 16px 3px rgba(0,230,80,.4)",animation:"scanV 5s linear infinite",pointerEvents:"none"}}/>

      <div
        onClick={handleAreaClick}
        {...swipe}
        style={{position:"fixed",inset:0,zIndex:10,display:"flex",flexDirection:"column"}}
      >
        {/* ── TOP BAR ── */}
        <div style={{
          display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"clamp(.4rem,2vw,.65rem) clamp(.75rem,3vw,2rem)",
          borderBottom:"1px solid rgba(0,230,80,.1)",
          background:"rgba(0,0,0,.92)",
          fontFamily:V,
          fontSize:"clamp(.65rem,2.5vw,.75rem)",
          color:"rgba(0,230,80,.5)",
          letterSpacing:".12em",
          flexShrink:0,zIndex:20,
          gap:"clamp(.5rem,2vw,1rem)",
        }}>
          <div style={{display:"flex",gap:"clamp(.5rem,2vw,1.5rem)",alignItems:"center",minWidth:0}}>
            <span style={{color:"#00e050",fontSize:"clamp(.8rem,3vw,.95rem)",flexShrink:0}}>AST</span>
            {!isMobile && <span>DECISION_SUPPORT</span>}
            {scenario && <span style={{color:"#ffaa00",flexShrink:0}}>SC_{scenario}</span>}
            <span style={{color:"#ffaa00",animation:"blink 2s step-end infinite",flexShrink:0}}>● LIVE</span>
          </div>
          <MiniDots cur={idx+1} total={TOTAL}/>
          <div style={{fontFamily:V,fontSize:"clamp(.65rem,2.5vw,.75rem)",color:"rgba(0,230,80,.4)",flexShrink:0}}>
            {String(idx+1).padStart(2,"0")}/{String(TOTAL).padStart(2,"0")}
            {!isMobile && <span style={{color:"#333",marginLeft:"1rem"}}>▸ {LABELS[idx]}</span>}
          </div>
        </div>

        {/* ── SLIDE ── */}
        <div
          key={idx}
          style={{flex:1,overflow:"hidden",animation:anim,minHeight:0}}
        >
          {renderSlide()}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div style={{
          display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"clamp(.4rem,2vw,.55rem) clamp(.75rem,3vw,2rem)",
          borderTop:"1px solid rgba(0,230,80,.08)",
          background:"rgba(0,0,0,.92)",
          fontFamily:V,
          fontSize:"clamp(.6rem,2.5vw,.72rem)",
          color:"rgba(0,230,80,.3)",
          letterSpacing:".08em",
          flexShrink:0,zIndex:20,
          gap:"1rem",
        }}>
          {!isMobile
            ? <span>株式会社アスト / 082-509-3060 / ast-design.com</span>
            : <span style={{color:"rgba(0,230,80,.2)"}}>← スワイプ →</span>
          }
          <div style={{display:"flex",gap:"clamp(.75rem,3vw,1.5rem)"}}>
            <button
              onClick={e=>{e.stopPropagation();go(idx-1);}}
              disabled={idx===0}
              style={{background:"none",border:"none",color:idx===0?"#222":"rgba(0,230,80,.45)",cursor:idx===0?"default":"pointer",fontFamily:V,fontSize:"clamp(.8rem,3.5vw,.9rem)",letterSpacing:".08em",padding:"clamp(.4rem,2vw,.5rem) clamp(.5rem,2vw,.75rem)",minWidth:"clamp(44px,12vw,60px)",WebkitTapHighlightColor:"transparent"}}
            >
              ◀ PREV
            </button>
            <button
              onClick={e=>{e.stopPropagation();go(idx+1);}}
              disabled={idx===TOTAL-1}
              style={{background:"none",border:"1px solid rgba(0,230,80,.2)",color:idx===TOTAL-1?"#222":"rgba(0,230,80,.8)",cursor:idx===TOTAL-1?"default":"pointer",fontFamily:V,fontSize:"clamp(.8rem,3.5vw,.9rem)",letterSpacing:".08em",padding:"clamp(.4rem,2vw,.5rem) clamp(.5rem,2vw,.75rem)",minWidth:"clamp(44px,12vw,60px)",WebkitTapHighlightColor:"transparent"}}
            >
              NEXT ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
