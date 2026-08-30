'use client';

import Link from 'next/link';
import { useState } from 'react';

const nodes = [
  {
    key:'production',
    id:'01',
    code:'P2P',
    title:'PoC → Production',
    subtitle:'動くデモを、本番で死なないシステムへ。',
    desc:'失敗条件・責任境界・監視・Rollback。PoCとProductionの間にある「見えない設計」を攻略する。',
    signal:'PRODUCTION RISK',
    stat:'07',
    color:'green',
    route:'/blog?category=production',
    tags:['FAILURE CRITERIA','OBSERVABILITY','ROLLBACK'],
  },
  {
    key:'decision',
    id:'02',
    code:'DEC',
    title:'Decision Architecture',
    subtitle:'曖昧な案件ほど、判断構造が性能になる。',
    desc:'誰が、何を、いつ決めるか。情報不足・責任分散・保留を、進められる意思決定構造へ変える。',
    signal:'DECISION DEBT',
    stat:'06',
    color:'purple',
    route:'/blog?category=decision',
    tags:['OWNERSHIP','BOUNDARY','ESCALATION'],
  },
  {
    key:'reliability',
    id:'03',
    code:'REL',
    title:'Automation Reliability',
    subtitle:'「動く自動化」から「任せられる運用」へ。',
    desc:'監視・再実行・異常検知・データ鮮度。人が見張らなくても壊れ方が分かる仕組みを設計する。',
    signal:'OPERATION RISK',
    stat:'09',
    color:'yellow',
    route:'/blog?category=reliability',
    tags:['MONITORING','RETRY','INTEGRITY'],
  },
  {
    key:'dx',
    id:'04',
    code:'DX',
    title:'DX / Operating Model',
    subtitle:'ツール導入を、現場が戻らない業務変革へ。',
    desc:'Shadow Workflow・データ正本・新旧業務の併存。導入後に仕事が増えるDXを回避する。',
    signal:'ADOPTION GAP',
    stat:'06',
    color:'cyan',
    route:'/blog?category=dx',
    tags:['SOURCE OF TRUTH','ADOPTION','WORKFLOW'],
  },
] as const;

export default function KnowledgeDeck(){
  const [active,setActive] = useState(0);
  const item = nodes[active];

  return <div className={'knowledge-deck '+item.color}>
    <div className="kd-console">
      <div className="kd-console-head">
        <span>ACTIVE KNOWLEDGE / {item.code}</span>
        <b><i/> SIGNAL LOCKED</b>
      </div>

      <div className="kd-radar">
        <div className="kd-radar-ring r1"/><div className="kd-radar-ring r2"/><div className="kd-radar-ring r3"/>
        <div className="kd-cross x"/><div className="kd-cross y"/>
        <div className="kd-core"><span>{item.id}</span><b>{item.code}</b></div>
        <i className="kd-blip b1"/><i className="kd-blip b2"/><i className="kd-blip b3"/>
      </div>

      <div className="kd-copy" key={item.key}>
        <div className="kd-overline"><span>{item.signal}</span><b>{item.stat} INTEL</b></div>
        <h3>{item.title}</h3>
        <strong>{item.subtitle}</strong>
        <p>{item.desc}</p>
        <div className="kd-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
        <Link href={item.route}>ENTER KNOWLEDGE NODE <span>↗</span></Link>
      </div>
    </div>

    <div className="kd-loadout" role="tablist" aria-label="Knowledge categories">
      {nodes.map((node,index)=><button
        key={node.key}
        type="button"
        className={index===active?'active '+node.color:node.color}
        onClick={()=>setActive(index)}
        aria-selected={index===active}
        role="tab"
      >
        <span>{node.id}</span>
        <div><small>{node.code}</small><b>{node.title}</b></div>
        <em>{index===active?'LOADED':'LOAD'}</em>
        <i>→</i>
      </button>)}
      <Link href="/blog" className="kd-open-all"><span>KNOWLEDGE VAULT</span><b>OPEN ALL INTEL ↗</b></Link>
    </div>
  </div>;
}
