'use client';

import { useEffect, useRef } from 'react';

export default function TokyoNightCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 800, H = 600, T = 0, rafId: number;
    let buildings: any[] = [], roads: any[] = [], rainDrops: any[] = [];
    let tokyoTower: any, skyTree: any, starData: any[] = [];

    const LAYERS = [
      { z: 0, alpha: 0.55, hScale: 0.38, yBase: 0.72, winAlpha: 0.5 },
      { z: 1, alpha: 0.72, hScale: 0.52, yBase: 0.78, winAlpha: 0.65 },
      { z: 2, alpha: 0.88, hScale: 0.68, yBase: 0.84, winAlpha: 0.82 },
      { z: 3, alpha: 1.0, hScale: 0.45, yBase: 0.90, winAlpha: 1.0 },
    ];

    function rnd(a: number, b: number) { return a + Math.random() * (b - a); }
    function rndI(a: number, b: number) { return Math.floor(rnd(a, b)); }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function clamp(v: number, a: number, b: number) { return v < a ? a : v > b ? b : v; }

    function resize() {
      W = canvas.width = window.innerWidth || 800;
      H = canvas.height = window.innerHeight || 600;
      initScene();
    }

    function makeBuilding(layer: number, x: number) {
      const lp = LAYERS[layer];
      const w = rnd(W * 0.025, W * 0.10);
      const h = rnd(H * 0.10, H * lp.hScale);
      const y = H * lp.yBase - h;
      const winW = rnd(2.5, 5);
      const winH = rnd(3, 6);
      const cols = Math.max(1, Math.floor((w - 4) / (winW + 3)));
      const rows = Math.max(1, Math.floor((h - 6) / (winH + 3)));
      const windows: any[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          windows.push({ on: Math.random() < 0.55, timer: rndI(60, 900), hue: Math.random() < 0.7 ? rndI(40, 60) : rndI(0, 360), bright: rnd(70, 100) });
        }
      }
      const roof: any[] = [];
      const nAnt = rndI(0, 3);
      for (let i = 0; i < nAnt; i++) {
        roof.push({ type: 'antenna', rx: rnd(0.1, 0.9), height: rnd(h * 0.05, h * 0.18) });
      }
      if (Math.random() < 0.3) roof.push({ type: 'tank', rx: rnd(0.2, 0.8), r: rnd(w * 0.04, w * 0.10) });
      return { x, y, w, h, layer, winW, winH, cols, rows, windows, roof };
    }

    function initScene() {
      buildings = [];
      for (let l = 0; l < 4; l++) {
        let x = -W * 0.05;
        const density = l === 3 ? 1.1 : 1.0;
        while (x < W * 1.05) {
          const b = makeBuilding(l, x);
          buildings.push(b);
          x += b.w + rnd(0, W * 0.01 * density);
        }
      }
      tokyoTower = { x: W * 0.30, baseY: H * 0.78, w: W * 0.028, h: H * 0.38, light: { on: true, timer: 30 } };
      skyTree = { x: W * 0.72, baseY: H * 0.76, w: W * 0.022, h: H * 0.50, ledColor: 0, ledTimer: 180 };

      roads = [{ type: 'highway', y: H * 0.88, cars: [] }, { type: 'ground', y: H * 0.965, cars: [] }];
      for (const road of roads) {
        for (let i = 0; i < rndI(4, 10); i++) {
          spawnCar(road, rnd(0, W));
        }
      }

      rainDrops = [];
      for (let i = 0; i < 320; i++) {
        rainDrops.push(newRainDrop(true));
      }

      starData = [];
      for (let i = 0; i < 120; i++) {
        starData.push({ x: Math.random(), y: Math.random() * 0.5, r: rnd(0.3, 1.2), ph: rnd(0, 6.28), sp: rnd(0.005, 0.02) });
      }
    }

    function spawnCar(road: any, x: number) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      const speed = rnd(1.5, 4.5) * (road.type === 'highway' ? 1.6 : 1.0);
      const isHead = Math.random() < 0.5;
      road.cars.push({ x, dir, speed: speed * dir, isHead, brightness: rnd(0.7, 1.0), streak: rnd(18, 55), y: road.y + rnd(-2, 2) });
    }

    function newRainDrop(random: boolean) {
      return { x: rnd(0, W), y: random ? rnd(0, H) : -10, len: rnd(8, 22), spd: rnd(8, 18), alpha: rnd(0.08, 0.25) };
    }

    function drawSky() {
      const ash = clamp(0.3 + 0.25 * Math.sin(T * 0.008), 0, 1);
      const g = ctx.createLinearGradient(0, 0, 0, H * 0.75);
      g.addColorStop(0, '#020510');
      g.addColorStop(0.4, '#05091a');
      g.addColorStop(0.8, '#0d1228');
      g.addColorStop(1, '#141830');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H * 0.75);

      const hg = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.82);
      hg.addColorStop(0, 'rgba(0,0,0,0)');
      hg.addColorStop(0.5, 'rgba(255,140,40,0.12)');
      hg.addColorStop(1, 'rgba(255,100,20,0.22)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, H * 0.55, W, H * 0.28);
    }

    function drawStars() {
      for (const s of starData) {
        const tw = 0.3 + 0.7 * Math.sin(T * s.sp + s.ph);
        const horizonFade = clamp(1 - (s.y - 0.3) * 3, 0, 1);
        ctx.globalAlpha = tw * 0.5 * horizonFade;
        ctx.fillStyle = '#c8d8ff';
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawMoon() {
      const mx = W * 0.15, my = H * 0.10, mr = W * 0.018;
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 5);
      mg.addColorStop(0, 'rgba(220,220,180,0.12)');
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(mx, my, mr * 5, 0, Math.PI * 2);
      ctx.fill();
      const mb = ctx.createRadialGradient(mx - mr * 0.2, my - mr * 0.2, mr * 0.05, mx, my, mr);
      mb.addColorStop(0, '#f0e8c8');
      mb.addColorStop(1, '#b8a870');
      ctx.fillStyle = mb;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawFog() {
      const fy = H * 0.65;
      for (let i = 0; i < 5; i++) {
        const fi = i / 4;
        const fx = Math.sin(T * 0.003 + fi * 2.1) * W * 0.12 + fi * W * 0.22;
        const fr = W * (0.12 + 0.08 * fi);
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
        fg.addColorStop(0, 'rgba(180,160,200,0.05)');
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawSkyTree() {
      const st = skyTree;
      const tx = st.x, by = st.baseY, th = st.h, bw = st.w;
      ctx.fillStyle = '#0a0a14';
      ctx.beginPath();
      ctx.moveTo(tx - bw * 0.5, by);
      ctx.lineTo(tx - bw * 0.08, by - th * 0.7);
      ctx.lineTo(tx, by - th);
      ctx.lineTo(tx + bw * 0.08, by - th * 0.7);
      ctx.lineTo(tx + bw * 0.5, by);
      ctx.closePath();
      ctx.fill();

      const ledColors = ['#00aaff', '#4400ff', '#00ffcc', '#ff0066'];
      st.ledTimer--;
      if (st.ledTimer <= 0) { st.ledColor = (st.ledColor + 1) % ledColors.length; st.ledTimer = 180 + rndI(0, 120); }
      const lc = ledColors[st.ledColor];

      [0.35, 0.45].forEach((frac: number) => {
        const dy = by - th * frac;
        const dw = bw * (1.8 - frac);
        ctx.fillStyle = '#181828';
        ctx.fillRect(tx - dw, dy - 4, dw * 2, 8);
        ctx.strokeStyle = lc;
        ctx.globalAlpha = 0.6 + 0.4 * Math.sin(T * 0.04);
        ctx.lineWidth = 1;
        ctx.strokeRect(tx - dw, dy - 4, dw * 2, 8);
        ctx.globalAlpha = 1;
      });

      const blinkOn = Math.floor(T / 25) % 2 === 0;
      if (blinkOn) {
        ctx.fillStyle = '#ff2020';
        ctx.beginPath();
        ctx.arc(tx, by - th, 3, 0, Math.PI * 2);
        ctx.fill();
        const ag = ctx.createRadialGradient(tx, by - th, 0, tx, by - th, 12);
        ag.addColorStop(0, 'rgba(255,30,30,0.6)');
        ag.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ag;
        ctx.beginPath();
        ctx.arc(tx, by - th, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      const lgg = ctx.createRadialGradient(tx, by - th * 0.4, 0, tx, by - th * 0.4, bw * 3);
      lgg.addColorStop(0, lc.replace(')', ',0.08)').replace('rgb', 'rgba'));
      lgg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lgg;
      ctx.beginPath();
      ctx.arc(tx, by - th * 0.4, bw * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawTokyoTower() {
      const tt = tokyoTower;
      const tx = tt.x, by = tt.baseY, th = tt.h, tw = tt.w;
      ctx.strokeStyle = '#2a1a08';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = '#1a0e04';
      ctx.beginPath();
      ctx.moveTo(tx - tw * 0.5, by);
      ctx.lineTo(tx - tw * 0.12, by - th * 0.6);
      ctx.lineTo(tx - tw * 0.06, by - th);
      ctx.lineTo(tx + tw * 0.06, by - th);
      ctx.lineTo(tx + tw * 0.12, by - th * 0.6);
      ctx.lineTo(tx + tw * 0.5, by);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const od1y = by - th * 0.42;
      ctx.fillStyle = '#251508';
      ctx.fillRect(tx - tw * 0.7, od1y - 5, tw * 1.4, 10);
      ctx.fillRect(tx - tw * 0.45, od1y - 5 - tw * 0.4, tw * 0.9, tw * 0.4);

      const orangeAlpha = 0.7 + 0.3 * Math.sin(T * 0.02);
      ctx.globalAlpha = orangeAlpha;
      for (let i = 0; i < 6; i++) {
        const ly = by - th * (0.15 + i * 0.13);
        const lw = tw * (0.5 - i * 0.07);
        ctx.fillStyle = '#ff6010';
        ctx.fillRect(tx - lw * 0.5, ly - 1, lw, 2);
      }
      ctx.globalAlpha = 1;

      tt.light.timer--;
      if (tt.light.timer <= 0) { tt.light.on = !tt.light.on; tt.light.timer = rndI(20, 40); }
      if (tt.light.on) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tx, by - th, 2.5, 0, Math.PI * 2);
        ctx.fill();
        const tlg = ctx.createRadialGradient(tx, by - th, 0, tx, by - th, 14);
        tlg.addColorStop(0, 'rgba(255,200,100,0.5)');
        tlg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = tlg;
        ctx.beginPath();
        ctx.arc(tx, by - th, 14, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawBuildings(layer: number) {
      const lp = LAYERS[layer];
      const layerBuildings = buildings.filter(b => b.layer === layer);

      for (const b of layerBuildings) {
        const dark = Math.floor(lerp(5, 22, layer / 3));
        const bg = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
        bg.addColorStop(0, `rgb(${dark + 4},${dark + 2},${dark + 8})`);
        bg.addColorStop(1, `rgb(${dark},${dark},${dark + 3})`);
        ctx.fillStyle = bg;
        ctx.globalAlpha = lp.alpha;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.globalAlpha = 1;

        const padX = (b.w - b.cols * (b.winW + 3) + 3) / 2;
        const padY = 5;
        for (let r = 0; r < b.rows; r++) {
          for (let c = 0; c < b.cols; c++) {
            const idx = r * b.cols + c;
            const win = b.windows[idx];
            const wx = b.x + padX + c * (b.winW + 3);
            const wy = b.y + padY + r * (b.winH + 3);

            win.timer--;
            if (win.timer <= 0) {
              win.on = Math.random() < 0.5;
              win.timer = rndI(60, 800);
            }

            if (win.on) {
              const wa = lp.winAlpha * (0.6 + 0.4 * Math.sin(T * 0.01 + idx));
              ctx.globalAlpha = wa;
              ctx.fillStyle = `hsl(${win.hue},60%,${win.bright}%)`;
              ctx.fillRect(wx, wy, b.winW, b.winH);
              if (layer >= 2) {
                const wg = ctx.createRadialGradient(wx + b.winW / 2, wy + b.winH / 2, 0, wx + b.winW / 2, wy + b.winH / 2, b.winW * 3);
                wg.addColorStop(0, `hsla(${win.hue},80%,70%,${wa * 0.15})`);
                wg.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = wg;
                ctx.fillRect(wx - b.winW * 2, wy - b.winH * 2, b.winW * 5, b.winH * 5);
              }
              ctx.globalAlpha = 1;
            }
          }
        }

        ctx.globalAlpha = lp.alpha;
        for (let ri = 0; ri < b.roof.length; ri++) {
          const ro = b.roof[ri];
          if (ro.type === 'antenna') {
            const ax = b.x + b.w * ro.rx, ay = b.y;
            ctx.strokeStyle = '#303040';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax, ay - ro.height);
            ctx.stroke();
            if (Math.floor(T / 40 + ri * 7) % 2 === 0) {
              ctx.fillStyle = '#ff3030';
              ctx.beginPath();
              ctx.arc(ax, ay - ro.height, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (ro.type === 'tank') {
            const tkx = b.x + b.w * ro.rx, tky = b.y - ro.r * 0.8;
            ctx.fillStyle = '#282838';
            ctx.beginPath();
            ctx.arc(tkx, tky, ro.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }
    }

    function drawRoads() {
      for (let ri = 0; ri < roads.length; ri++) {
        const road = roads[ri];
        const ry = road.y;
        const isHighway = road.type === 'highway';

        const rg = ctx.createLinearGradient(0, ry - 3, 0, ry + 6);
        rg.addColorStop(0, isHighway ? '#0d0d18' : '#101018');
        rg.addColorStop(1, isHighway ? '#080810' : '#0a0a10');
        ctx.fillStyle = rg;
        ctx.fillRect(0, ry - 4, W, 10);

        if (isHighway) {
          ctx.strokeStyle = 'rgba(80,80,100,0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, ry - 4);
          ctx.lineTo(W, ry - 4);
          ctx.stroke();
        }

        const refAlpha = 0.06 + 0.04 * Math.sin(T * 0.02);
        ctx.fillStyle = `rgba(200,180,255,${refAlpha})`;
        ctx.fillRect(0, ry, W, 2);

        for (let ci = road.cars.length - 1; ci >= 0; ci--) {
          const car = road.cars[ci];
          car.x += car.speed;
          if (car.x > W + 80) road.cars.splice(ci, 1);
          if (car.x < -80) road.cars.splice(ci, 1);

          const sx = car.x, sy = car.y;
          const len = car.streak * Math.abs(car.speed) / 3;
          const col = car.isHead ? '255,250,220' : '220,30,10';
          const alpha = car.brightness * (isHighway ? 0.9 : 0.7);

          const lg = ctx.createLinearGradient(sx, sy, sx - car.dir * len, sy);
          lg.addColorStop(0, `rgba(${col},${alpha})`);
          lg.addColorStop(1, `rgba(${col},0)`);
          ctx.strokeStyle = lg;
          ctx.lineWidth = isHighway ? rnd(1.5, 2.5) : rnd(1, 2);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - car.dir * len, sy);
          ctx.stroke();

          ctx.fillStyle = `rgba(${col},${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, isHighway ? 1.8 : 1.2, 0, Math.PI * 2);
          ctx.fill();

          const refY = ry + 3;
          const rlg = ctx.createLinearGradient(sx, refY, sx - car.dir * len * 0.5, refY);
          rlg.addColorStop(0, `rgba(${col},${alpha * 0.3})`);
          rlg.addColorStop(1, `rgba(${col},0)`);
          ctx.strokeStyle = rlg;
          ctx.lineWidth = isHighway ? 1.5 : 1;
          ctx.beginPath();
          ctx.moveTo(sx, refY);
          ctx.lineTo(sx - car.dir * len * 0.5, refY);
          ctx.stroke();
        }

        if (Math.random() < 0.015) {
          const dir = Math.random() < 0.5 ? 1 : -1;
          spawnCar(road, dir > 0 ? -40 : W + 40);
        }
      }
    }

    function drawRiver() {
      const ry = H * 0.92, rh = H * 0.08;
      const rg = ctx.createLinearGradient(0, ry, 0, ry + rh);
      rg.addColorStop(0, '#03050f');
      rg.addColorStop(1, '#020308');
      ctx.fillStyle = rg;
      ctx.fillRect(0, ry, W, rh);

      for (let i = 0; i < 6; i++) {
        const wy = ry + rh * (0.2 + i * 0.12);
        const wx = Math.sin(T * 0.015 + i * 1.3) * W * 0.03;
        const wg = ctx.createLinearGradient(0, wy, 0, wy + 2);
        wg.addColorStop(0, `rgba(80,100,160,${0.06 + 0.04 * Math.sin(T * 0.02 + i)})`);
        wg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = wg;
        ctx.fillRect(wx, wy, W, 2);
      }

      const refBuildings = buildings.filter(b => b.layer >= 2);
      for (let bi = 0; bi < refBuildings.length; bi += 3) {
        const b = refBuildings[bi];
        const refH = (H - b.y - b.h) * 0.3;
        const refAlpha = 0.04 + 0.02 * Math.sin(T * 0.01 + bi);
        const rflg = ctx.createLinearGradient(b.x + b.w / 2, ry, b.x + b.w / 2, ry + rh);
        rflg.addColorStop(0, `rgba(255,200,100,${refAlpha})`);
        rflg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rflg;
        ctx.fillRect(b.x + b.w * 0.1, ry, b.w * 0.8, Math.min(rh * 0.7, refH));
      }

      const ttx = tokyoTower.x;
      const ttg = ctx.createRadialGradient(ttx, ry + rh * 0.3, 0, ttx, ry + rh * 0.3, W * 0.08);
      ttg.addColorStop(0, 'rgba(255,100,20,0.12)');
      ttg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ttg;
      ctx.fillRect(ttx - W * 0.08, ry, W * 0.16, rh);
    }

    function drawRain() {
      ctx.strokeStyle = 'rgba(180,200,255,0.18)';
      ctx.lineWidth = 0.7;
      for (let i = 0; i < rainDrops.length; i++) {
        const d = rainDrops[i];
        d.y += d.spd;
        d.x += 0.8;
        if (d.y > H + 10) rainDrops[i] = newRainDrop(false);
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 3, d.y + d.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function drawGround() {
      const gy = H * 0.89;
      const gg = ctx.createLinearGradient(0, gy, 0, H * 0.92);
      gg.addColorStop(0, '#0a080e');
      gg.addColorStop(1, '#050508');
      ctx.fillStyle = gg;
      ctx.fillRect(0, gy, W, H * 0.92 - gy);

      for (let i = 0; i < 4; i++) {
        const px = W * (0.1 + i * 0.25), py = gy + 4;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, W * 0.06);
        const pa = 0.08 + 0.05 * Math.sin(T * 0.02 + i);
        pg.addColorStop(0, `rgba(255,180,80,${pa})`);
        pg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pg;
        ctx.fillRect(px - W * 0.06, py - 5, W * 0.12, 10);
      }
    }

    function drawVignette() {
      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.82)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
    }

    function drawHaze() {
      const hg = ctx.createLinearGradient(0, H * 0.55, 0, H * 0.85);
      hg.addColorStop(0, 'rgba(10,8,25,0)');
      hg.addColorStop(0.5, 'rgba(20,15,40,0.15)');
      hg.addColorStop(1, 'rgba(10,8,20,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, H * 0.55, W, H * 0.30);
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      drawSky();
      drawStars();
      drawMoon();
      drawFog();
      drawBuildings(0);
      drawBuildings(1);
      drawSkyTree();
      drawTokyoTower();
      drawBuildings(2);
      drawBuildings(3);
      drawHaze();
      drawGround();
      drawRoads();
      drawRiver();
      drawRain();
      drawVignette();
      T++;
      rafId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    frame();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}
