import type { Metadata } from 'next';
import Link from 'next/link';
import MissionBriefActions from './actions';

export const metadata: Metadata = {
  title: 'Mission Brief | rancorder',
  description: 'PoC Survival Testの診断結果から生成された相談用Mission Brief。',
  robots: { index: false, follow: false },
};

type Sector = 'mfg' | 'sales' | 'dx';
const weights = [16,16,16,14,14,13,11];

const config = {
  mfg: {
    label:'MANUFACTURING AI POC',
    items:[
      ['RESPONSIBILITY','責任者を定義'],
      ['FAILURE CRITERIA','失敗・撤退条件を定義'],
      ['AI ERROR BOUNDARY','AI誤判定の遮断条件を設定'],
      ['DATA TRACEABILITY','データ来歴を追跡可能にする'],
      ['ROLLBACK','AI変更のロールバックを検証'],
      ['OBSERVABILITY','業務成功と技術成功を分離監視'],
      ['HUMAN FALLBACK','人への切替条件を定義'],
    ],
  },
  sales: {
    label:'SALES SUPPORT POC',
    items:[
      ['RESPONSIBILITY','停止・復旧判断の責任者を定義'],
      ['FAILURE CRITERIA','失敗・撤退条件を定義'],
      ['SIGNAL INTEGRITY','アポ発生と検知件数を突合'],
      ['DATA ROUTING','顧客別設定と保存先を分離'],
      ['REPORT FRESHNESS','更新期限と遅延監視を設定'],
      ['TRANSCRIPT QUALITY','文字起こし品質ゲートを設定'],
      ['DECISION OUTPUT','分析結果を営業アクションへ接続'],
    ],
  },
  dx: {
    label:'DX TRANSFORMATION',
    items:[
      ['RESPONSIBILITY','停止・継続・復旧を決める責任者を定義'],
      ['FAILURE CRITERIA','失敗・撤退条件を定義'],
      ['PROCESS OWNERSHIP','新業務フローの責任境界を定義'],
      ['SOURCE OF TRUTH','主要データの正本を一意にする'],
      ['SHADOW WORKFLOW','旧手順・Excel・紙の残存箇所を棚卸し'],
      ['ADOPTION SIGNAL','新フロー完結率を計測'],
      ['TRANSITION FALLBACK','旧運用へ戻す境界を定義'],
    ],
  },
} as const;

function sectorOf(raw?:string):Sector{return raw==='sales'?'sales':raw==='dx'?'dx':'mfg';}
function decode(raw?:string){return (raw||'').toLowerCase().replace(/[^ypn]/g,'').slice(0,7).padEnd(7,'n').split('');}
function scoreOf(code:string[]){return code.reduce((score,a,i)=>Math.max(0,Math.round(score-(a==='n'?weights[i]:a==='p'?weights[i]*.5:0))),100);}

export default async function MissionBriefPage({ searchParams }:{ searchParams:Promise<{s?:string;r?:string;f?:string;q?:string}> }){
  const params = await searchParams;
  const sector = sectorOf(params.s);
  const signal = (params.q||'').slice(0,180);
  const code = decode(params.r);
  const initial = scoreOf(code);
  const fixed = (params.f||'').split(',').map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<7);
  const selected = fixed.map(i=>({
    index:i,
    label:config[sector].items[i][0],
    action:config[sector].items[i][1],
    recover:code[i]==='n'?weights[i]:code[i]==='p'?Math.round(weights[i]*.5):0,
  })).filter(x=>x.recover>0);
  const projected = Math.min(100, initial + selected.reduce((s,x)=>s+x.recover,0));
  const risks = code.map((a,i)=>({a,i})).filter(x=>x.a!=='y').sort((a,b)=>weights[b.i]-weights[a.i]).slice(0,3);
  const unresolved = code.filter(a=>a!=='y').length;
  const hardNo = code.filter(a=>a==='n').length;
  const ambiguity = Math.min(100, 34 + hardNo*9 + (code[0]!=='y'?18:0) + (code[1]!=='y'?12:0));
  const techBusiness = sector==='mfg'?Math.min(100,68+(code[2]!=='y'?14:0)+(code[3]!=='y'?12:0)):sector==='sales'?Math.min(100,66+(code[2]!=='y'?14:0)+(code[6]!=='y'?12:0)):Math.min(100,62+(code[2]!=='y'?16:0)+(code[3]!=='y'?10:0));
  const productionRisk = Math.min(100, 28 + (100-initial)*0.62 + (code[4]!=='y'?14:0) + (code[5]!=='y'?10:0));
  const decisionDensity = Math.min(100, 30 + unresolved*9 + selected.length*3);
  const fit = Math.round(ambiguity*.28 + techBusiness*.24 + productionRisk*.28 + decisionDensity*.20);
  const fitClass = fit>=85?'S':fit>=70?'A':fit>=52?'B':'C';
  const fitLabel = fitClass==='S'?'HIGH-LEVERAGE MISSION':fitClass==='A'?'STRONG FIT':fitClass==='B'?'SELECTIVE FIT':'SPECIALIST ROUTE MAY BE FASTER';
  const fitAxes = [
    ['AMBIGUITY',Math.round(ambiguity),'要件・責任境界の曖昧さ'],
    ['TECH × BUSINESS',Math.round(techBusiness),'技術と業務をまたぐ必要性'],
    ['PRODUCTION RISK',Math.round(productionRisk),'本番移行・運用の難易度'],
    ['DECISION DENSITY',Math.round(decisionDensity),'意思決定が詰まっている度合い'],
  ] as const;

  const brief = [
    'MISSION BRIEF',
    `Sector: ${config[sector].label}`,
    `Current Readiness: ${initial}%`,
    `Projected Readiness: ${projected}%`,
    `Mission Fit: ${fit}% / Class ${fitClass} / ${fitLabel}`,
    '',
    ...(signal?['Original Mission Signal:',signal,'']:[]),
    'Critical Risks:',
    ...risks.map((x,i)=>`${i+1}. ${config[sector].items[x.i][0]}`),
    '',
    'Selected Recovery Actions:',
    ...(selected.length?selected.map((x,i)=>`${i+1}. ${x.action} (+${x.recover}%)`):['未選択']),
    '',
    '相談したいこと:',
    'このMissionの本番移行・運用設計について相談したいです。',
  ].join('\n');

  const subject = encodeURIComponent(`[Mission Brief] ${config[sector].label} / Readiness ${initial}%`);
  const mailto = `mailto:hello@rancorder.dev?subject=${subject}&body=${encodeURIComponent(brief)}`;

  return <main className="mission-brief-page">
    <div className="mission-grid" aria-hidden="true" />
    <nav className="case-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <span>MISSION HANDOFF / SECURE BRIEF</span>
    </nav>

    <section className="mission-brief-shell">
      <header className="mission-brief-hero">
        <div className="mc-section-tag purple">BRING THIS MISSION TO ME</div>
        <h1>相談前に、<br/><span>案件の詰まりを共有する。</span></h1>
        <p>診断結果とRecovery Planだけを引き継いだMission Briefです。案件名や個人情報は含まれていません。</p>
      </header>

      <div className="mission-brief-console">
        {signal&&<div className="mission-brief-origin"><span>ORIGINAL MISSION SIGNAL</span><p>“{signal}”</p><b>→ DIAGNOSTIC → RECOVERY → HANDOFF</b></div>}
        <div className="mission-brief-score">
          <div><small>SECTOR</small><b>{config[sector].label}</b></div>
          <div><small>CURRENT</small><strong>{initial}<em>%</em></strong></div>
          <div><small>PROJECTED</small><strong>{projected}<em>%</em></strong></div>
        </div>

        <section className={'mission-fit-panel fit-'+fitClass.toLowerCase()}>
          <header><div><span>MISSION FIT / HEURISTIC</span><h2>この案件に、Technical PM介入余地があるか。</h2></div><div className="mission-fit-score"><small>FIT SCORE</small><strong>{fit}<em>%</em></strong><b>CLASS {fitClass}</b></div></header>
          <div className="mission-fit-verdict"><span>{fitLabel}</span><p>{fitClass==='C'?'実装範囲が明確なら、専門ベンダーへ直接依頼する方が速い可能性があります。':fitClass==='B'?'論点を絞れば介入価値があります。まず責任境界と本番条件を確認します。':'曖昧さ・技術×業務・本番リスクが重なっています。実装前の判断設計に介入価値が高いMissionです。'}</p></div>
          <div className="mission-fit-axes">{fitAxes.map(axis=><div key={axis[0]}><div><span>{axis[0]}</span><b>{axis[1]}</b></div><i><em style={{width:axis[1]+'%'}}/></i><p>{axis[2]}</p></div>)}</div>
          <footer><span>HOW THIS IS CALCULATED</span><p>Survival Testの回答から算出するルールベースの適合度です。能力評価や成功確率ではなく、「判断設計が価値を出しやすい案件か」を見るためのヒューリスティックです。</p></footer>
        </section>

        <div className="mission-brief-grid">
          <section>
            <header><span>CRITICAL RISKS</span><b>{String(risks.length).padStart(2,'0')}</b></header>
            {risks.map((x,i)=><article key={x.i}><span>{String(i+1).padStart(2,'0')}</span><div><b>{config[sector].items[x.i][0]}</b><p>Impact weight {weights[x.i]}</p></div></article>)}
          </section>

          <section>
            <header><span>SELECTED RECOVERY</span><b>{String(selected.length).padStart(2,'0')}</b></header>
            {selected.length===0?<p className="mission-brief-empty">Recovery項目はまだ選択されていません。</p>:
              selected.map((x,i)=><article key={x.index}><span>{String(i+1).padStart(2,'0')}</span><div><b>{x.action}</b><p>Projected +{x.recover}%</p></div></article>)}
          </section>
        </div>

        <div className="mission-brief-text">
          <span>HANDOFF PACKET</span>
          <pre>{brief}</pre>
        </div>

        <MissionBriefActions mailto={mailto} brief={brief} />
      </div>
    </section>
  </main>;
}
