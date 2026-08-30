'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type MissionKey = 'manufacturing' | 'sales';

const missions = {
  manufacturing: {
    code: 'MFG-AI-01',
    label: 'MANUFACTURING B2B',
    title: '製造業AI PoC',
    subtitle: '曖昧な要件とAI不確実性を、本番運用の責任境界へ変換する。',
    readiness: 84,
    risk: 'MEDIUM',
    xp: '+240',
    objective: 'PoC → Production',
    signals: ['責任境界', 'AI失敗条件', '監視・復旧'],
    href: '/cases/ai-production-delivery',
    color: 'green',
  },
  sales: {
    code: 'SALES-OPS-04',
    label: 'SALES SUPPORT',
    title: '営業支援PoC',
    subtitle: '架電データ・音声・アポ・KPIを、営業判断へ直結する運用にする。',
    readiness: 76,
    risk: 'ACTIVE',
    xp: '+180',
    objective: 'Data → Decision',
    signals: ['アポ検知', '文字起こし', 'KPIレポート'],
    href: '/cases/sales-support-poc-operations',
    color: 'purple',
  },
} as const;

export default function MissionSelector(){
  const [selected,setSelected] = useState<MissionKey>('manufacturing');
  const mission = missions[selected];

  useEffect(()=>{
    const saved = window.localStorage.getItem('rancorder-mission');
    if(saved === 'manufacturing' || saved === 'sales') setSelected(saved);
  },[]);

  const choose = (key:MissionKey) => {
    setSelected(key);
    window.localStorage.setItem('rancorder-mission', key);
    window.dispatchEvent(new CustomEvent('mission-sector-change',{detail:{sector:key}}));
  };

  return <section className="mission-select" aria-label="mission selector">
    <div className="mission-select-head">
      <div>
        <span>MISSION SELECT</span>
        <h2>どの案件を攻略する？</h2>
      </div>
      <small>SELECT A SECTOR / LOAD LIVE PARAMETERS</small>
    </div>

    <div className="mission-select-grid">
      {(Object.keys(missions) as MissionKey[]).map((key)=>{
        const m = missions[key];
        const active = selected === key;
        return <button
          type="button"
          key={key}
          onClick={()=>choose(key)}
          className={`mission-card ${active?'active':''} ${m.color}`}
          aria-pressed={active}
        >
          <div className="mission-card-top">
            <span>{m.code}</span>
            <i>{active?'SELECTED':'STANDBY'}</i>
          </div>
          <strong>{m.title}</strong>
          <p>{m.subtitle}</p>
          <div className="mission-card-signals">
            {m.signals.map(s=><span key={s}>{s}</span>)}
          </div>
        </button>;
      })}
    </div>

    <div className={`mission-loadout ${mission.color}`}>
      <div className="loadout-main">
        <small>ACTIVE MISSION</small>
        <b>{mission.label} / {mission.code}</b>
        <p>{mission.objective}</p>
      </div>
      <div className="loadout-stat">
        <small>READINESS</small><b>{mission.readiness}%</b>
      </div>
      <div className="loadout-stat">
        <small>RISK</small><b>{mission.risk}</b>
      </div>
      <div className="loadout-stat">
        <small>MISSION XP</small><b>{mission.xp}</b>
      </div>
      <Link href={mission.href} className="mission-launch">LOAD MISSION ↗</Link>
    </div>
  </section>;
}
