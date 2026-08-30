'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { awardAchievement } from './MissionXP';

type Sector = 'mfg' | 'sales';

const weights = [16,16,16,14,14,13,11];

const labels = {
  mfg: [
    ['RESPONSIBILITY','責任者を定義','48H'],
    ['FAILURE CRITERIA','失敗・撤退条件を定義','48H'],
    ['AI ERROR BOUNDARY','AI誤判定の遮断条件を設定','7 DAYS'],
    ['DATA TRACEABILITY','データ来歴を追跡可能にする','7 DAYS'],
    ['ROLLBACK','AI変更のロールバックを検証','7 DAYS'],
    ['OBSERVABILITY','業務成功と技術成功を分離監視','30 DAYS'],
    ['HUMAN FALLBACK','人への切替条件を定義','30 DAYS'],
  ],
  sales: [
    ['RESPONSIBILITY','停止・復旧判断の責任者を定義','48H'],
    ['FAILURE CRITERIA','失敗・撤退条件を定義','48H'],
    ['SIGNAL INTEGRITY','アポ発生と検知件数を突合','7 DAYS'],
    ['DATA ROUTING','顧客別設定と保存先を分離','7 DAYS'],
    ['REPORT FRESHNESS','更新期限と遅延監視を設定','7 DAYS'],
    ['TRANSCRIPT QUALITY','文字起こし品質ゲートを設定','30 DAYS'],
    ['DECISION OUTPUT','分析結果を営業アクションへ接続','30 DAYS'],
  ],
} as const;

export default function RecoveryPlan({ sector, code }: { sector: Sector; code: string }) {
  const answers = code.split('').slice(0,7);
  const initial = useMemo(()=>answers.reduce((score,a,i)=>{
    const damage = a === 'n' ? weights[i] : a === 'p' ? weights[i] * .5 : 0;
    return Math.max(0, Math.round(score-damage));
  },100),[answers]);

  const candidates = useMemo(()=>answers.map((a,i)=>({
    index:i,
    answer:a,
    recover: a === 'n' ? weights[i] : a === 'p' ? Math.round(weights[i]*.5) : 0,
    label: labels[sector][i][0],
    action: labels[sector][i][1],
    phase: labels[sector][i][2],
  })).filter(x=>x.recover>0),[answers,sector]);

  const [fixed,setFixed] = useState<number[]>([]);
  const recovered = candidates.filter(c=>fixed.includes(c.index)).reduce((s,c)=>s+c.recover,0);
  const projected = Math.min(100,initial+recovered);
  const selectedFixes = fixed.slice().sort((a,b)=>a-b).join(',');
  const briefUrl = `/mission-brief?s=${sector}&r=${code}&f=${selectedFixes}`;

  const toggle = (index:number) => { setFixed(prev=>prev.includes(index)?prev.filter(x=>x!==index):[...prev,index]); awardAchievement('recovery'); };

  return <section className="recovery-plan">
    <header className="recovery-head">
      <div>
        <span>RECOVERY PLAN GENERATOR</span>
        <h2>この案件、どこから直せば戻るか。</h2>
      </div>
      <div className="recovery-score">
        <small>PROJECTED READINESS</small>
        <strong>{initial}<em>→</em>{projected}<i>%</i></strong>
      </div>
    </header>

    <div className="recovery-map">
      {['48H','7 DAYS','30 DAYS'].map((phase)=><div className="recovery-phase" key={phase}>
        <div className="recovery-phase-title"><span>{phase}</span><b>{phase==='48H'?'STOP THE BLEEDING':phase==='7 DAYS'?'STABILIZE SYSTEM':'HARDEN OPERATION'}</b></div>
        <div className="recovery-actions">
          {candidates.filter(c=>c.phase===phase).length===0 ? <p className="recovery-clear">NO CRITICAL ACTION</p> :
            candidates.filter(c=>c.phase===phase).map(c=>{
              const active=fixed.includes(c.index);
              return <button type="button" key={c.index} className={active?'fixed':''} onClick={()=>toggle(c.index)}>
                <span>{active?'✓':'+'}</span>
                <div><b>{c.label}</b><p>{c.action}</p></div>
                <em>+{c.recover}%</em>
              </button>;
            })}
        </div>
      </div>)}
    </div>

    <div className="recovery-meter">
      <div><i style={{width:`${projected}%`}} /></div>
      <p>{projected>=85
        ? 'PRODUCTION READY RANGE — 次は障害注入と実運用負荷の検証へ。'
        : projected>=65
          ? 'CONDITIONAL READY — 主要Blockerは減少。残りの境界を閉じる。'
          : 'CRITICAL RANGE — 追加開発より先に、止血と責任境界の確定が必要。'}
      </p>
    </div>

    <div className="recovery-handoff">
      <div>
        <span>MISSION HANDOFF</span>
        <p>診断結果と選択したRecovery項目を、相談用のMission Briefへ引き継ぎます。</p>
      </div>
      <Link href={briefUrl}>BRING THIS MISSION TO ME →</Link>
    </div>
  </section>;
}
