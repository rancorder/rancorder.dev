'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Sector = 'manufacturing' | 'sales';

const data = {
  manufacturing: {
    label: 'MANUFACTURING B2B / AI DELIVERY',
    event: 'AI OUTPUT DRIFT DETECTED',
    xp: '+24 RISK XP',
    chain: 'PRODUCTION CHAIN x5',
    objective: 'PoC → Production',
    readiness: 84,
    caseHref: '/cases/ai-production-delivery',
    caseLabel: 'AI本番導入 Decision Record',
    risks: [
      ['01', 'FAILURE CRITERIA', 'AIが誤ったとき、どこで止めるか未定義'],
      ['02', 'RESPONSIBILITY', 'AI出力の最終責任者が曖昧'],
      ['03', 'ROLLBACK', 'モデル・プロンプト変更後の復旧経路'],
    ],
    kpis: [
      ['RESPONSIBILITY', 'DEFINED'],
      ['OBSERVABILITY', 'ACTIVE'],
      ['ROLLBACK', 'PENDING'],
      ['AI FALLBACK', 'HITL'],
    ],
  },
  sales: {
    label: 'SALES SUPPORT / SALES OPS',
    event: 'APPOINTMENT SIGNAL DETECTED',
    xp: '+12 OPERATOR XP',
    chain: 'DATA CHAIN x4',
    objective: 'Data → Decision → Action',
    readiness: 76,
    caseHref: '/cases/sales-support-poc-operations',
    caseLabel: '営業支援PoC Decision Record',
    risks: [
      ['01', 'SIGNAL LOSS', 'アポ取得成功と検知成功を混同している'],
      ['02', 'DATA ROUTING', '顧客別データの保存先・設定衝突リスク'],
      ['03', 'REPORT LATENCY', '集計が遅いと営業判断の価値が落ちる'],
    ],
    kpis: [
      ['MONITORED ACCOUNTS', '38'],
      ['巡回 CADENCE', '1H'],
      ['APPOINTMENT DETECTION', 'AUTO'],
      ['REPORT ROUTING', 'ACTIVE'],
    ],
  },
} as const;

export default function SectorMissionPanel(){
  const [sector,setSector] = useState<Sector>('manufacturing');
  const mission = data[sector];

  useEffect(()=>{
    const saved = window.localStorage.getItem('rancorder-mission');
    if(saved === 'manufacturing' || saved === 'sales') setSector(saved);

    const onSector = (event: Event) => {
      const detail = (event as CustomEvent<{sector: Sector}>).detail;
      if(detail?.sector) setSector(detail.sector);
    };
    window.addEventListener('mission-sector-change', onSector);
    return ()=>window.removeEventListener('mission-sector-change', onSector);
  },[]);

  return <section className={`sector-engine ${sector}`} aria-live="polite">
    <div className="sector-engine-top">
      <div className="sector-event">
        <span>LIVE EVENT</span>
        <b>{mission.event}</b>
        <i>{mission.xp}</i>
      </div>
      <div className="sector-event secondary">
        <span>ACTIVE OBJECTIVE</span>
        <b>{mission.objective}</b>
        <i>{mission.chain}</i>
      </div>
    </div>

    <div className="sector-engine-body">
      <div className="sector-radar">
        <div className="sector-radar-head">
          <div>
            <small>SECTOR ENGINE</small>
            <b>{mission.label}</b>
          </div>
          <strong>{mission.readiness}<em>%</em></strong>
        </div>
        <div className="sector-readiness"><i style={{width:`${mission.readiness}%`}} /></div>

        <div className="sector-kpi-grid">
          {mission.kpis.map(([label,value])=><div key={label}>
            <small>{label}</small><b>{value}</b>
          </div>)}
        </div>
      </div>

      <div className="sector-threats">
        <header><span>CRITICAL RISK FEED</span><b>03 SIGNALS</b></header>
        <ol>
          {mission.risks.map(([id,title,desc])=><li key={id}>
            <span>{id}</span>
            <div><b>{title}</b><p>{desc}</p></div>
          </li>)}
        </ol>
      </div>
    </div>

    <div className="sector-engine-actions">
      <Link href={mission.caseHref}>{mission.caseLabel} ↗</Link>
      <Link href="/survival-test">RUN PRODUCTION READINESS TEST →</Link>
    </div>
  </section>;
}
