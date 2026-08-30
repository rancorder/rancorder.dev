import type { Metadata } from 'next';
import Link from 'next/link';
import MissionBriefActions from './actions';

export const metadata: Metadata = {
  title: 'Mission Brief | rancorder',
  description: 'PoC Survival Testの診断結果から生成された相談用Mission Brief。',
  robots: { index: false, follow: false },
};

type Sector = 'mfg' | 'sales';
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
} as const;

function sectorOf(raw?:string):Sector{return raw==='sales'?'sales':'mfg';}
function decode(raw?:string){return (raw||'').toLowerCase().replace(/[^ypn]/g,'').slice(0,7).padEnd(7,'n').split('');}
function scoreOf(code:string[]){return code.reduce((score,a,i)=>Math.max(0,Math.round(score-(a==='n'?weights[i]:a==='p'?weights[i]*.5:0))),100);}

export default async function MissionBriefPage({ searchParams }:{ searchParams:Promise<{s?:string;r?:string;f?:string}> }){
  const params = await searchParams;
  const sector = sectorOf(params.s);
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

  const brief = [
    'MISSION BRIEF',
    `Sector: ${config[sector].label}`,
    `Current Readiness: ${initial}%`,
    `Projected Readiness: ${projected}%`,
    '',
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
        <div className="mission-brief-score">
          <div><small>SECTOR</small><b>{config[sector].label}</b></div>
          <div><small>CURRENT</small><strong>{initial}<em>%</em></strong></div>
          <div><small>PROJECTED</small><strong>{projected}<em>%</em></strong></div>
        </div>

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
