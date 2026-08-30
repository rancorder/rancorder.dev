'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { awardAchievement } from '../../components/MissionXP';

type Choice={label:string;impact:number;intel:number;note:string};
type Round={time:string,title:string,signal:string,choices:Choice[]};

const rounds:Round[]=[
 {time:'02:13',title:'AI OUTPUT DRIFT',signal:'本番AIの出力精度が急落。監視はHTTP 200を返し続けている。顧客影響範囲は不明。',choices:[
  {label:'AI機能を即時停止し、人手Fallbackへ切替',impact:22,intel:1,note:'被害半径を先に固定。原因調査より可逆性を優先。'},
  {label:'ログを30分集めて原因を特定してから判断',impact:-18,intel:3,note:'情報は増えるが、その間も誤出力が継続する。'},
  {label:'モデルを前バージョンへ即時Rollback',impact:12,intel:0,note:'速いが、データ側起因なら症状は残る。'},
 ]},
 {time:'02:17',title:'OWNER NOT FOUND',signal:'顧客担当は「AI側の問題」と主張。開発担当はデータ仕様変更の可能性を示唆。停止判断者が台帳にない。',choices:[
  {label:'暫定Incident Commanderを宣言し判断を一本化',impact:24,intel:1,note:'責任空白を先に閉じ、調査を並列化する。'},
  {label:'関係者全員の合意が取れるまで待つ',impact:-20,intel:1,note:'合意コストが復旧時間へ直結する。'},
  {label:'開発チームだけで復旧作業を開始',impact:2,intel:1,note:'技術復旧は進むが業務判断が孤立する。'},
 ]},
 {time:'02:24',title:'DATA SOURCE MUTATED',signal:'上流CSVの列定義が前日から変更。変更通知なし。過去データにも一部欠損が発見された。',choices:[
  {label:'入力を隔離し、最後の既知正常データへ固定',impact:24,intel:2,note:'未知データを本番判断系から切り離す。'},
  {label:'変換ロジックをその場で修正して再開',impact:-12,intel:1,note:'速く見えるが、欠損範囲が不明なまま再開する。'},
  {label:'全データを再取得して完全性を確認',impact:8,intel:3,note:'確実だが復旧時間とのトレードオフ。'},
 ]},
 {time:'02:39',title:'BUSINESS PRESSURE',signal:'営業責任者から「朝8時までに必ず再開してほしい」。原因はまだ完全には特定できていない。',choices:[
  {label:'限定再開＋監視強化＋撤退条件を明示',impact:26,intel:2,note:'二値の再開判断ではなく、被害半径を制御する。'},
  {label:'要求どおり全面再開する',impact:-28,intel:0,note:'業務圧力を技術的安全性より優先。'},
  {label:'完全原因特定まで全面停止を維持',impact:8,intel:2,note:'安全だが、業務継続性の設計余地を捨てる。'},
 ]},
];

export default function BlackBoxIncident(){
 const [step,setStep]=useState(0);
 const [integrity,setIntegrity]=useState(50);
 const [intel,setIntel]=useState(0);
 const [history,setHistory]=useState<{title:string;choice:Choice}[]>([]);
 const [done,setDone]=useState(false);
 const round=rounds[step];
 const rank=useMemo(()=>integrity>=90?'INCIDENT ARCHITECT':integrity>=70?'CONTROLLED RECOVERY':integrity>=45?'SURVIVED':'MISSION LOST',[integrity]);

 function choose(choice:Choice){
  const next=Math.max(0,Math.min(100,integrity+choice.impact));
  setIntegrity(next);setIntel(v=>v+choice.intel);setHistory(v=>[...v,{title:round.title,choice}]);
  if(step===rounds.length-1){setDone(true);awardAchievement('incident');}
  else setStep(v=>v+1);
 }
 function reset(){setStep(0);setIntegrity(50);setIntel(0);setHistory([]);setDone(false);}

 return <main className={`blackbox ${integrity<35?'blackbox-critical':''}`}>
  <div className="blackbox-noise" aria-hidden="true"/>
  <nav><Link href="/">RANCORDER.DEV</Link><span>CLASSIFIED / INCIDENT SIMULATION</span></nav>
  <section className="blackbox-shell">
   <header className="blackbox-hero"><span>SECRET MISSION / BLACK BOX INCIDENT</span><h1>情報不足のまま、<br/><em>本番を救え。</em></h1><p>正解を当てるゲームではありません。限られた情報で「何を先に固定するか」を選ぶTechnical PMシミュレーションです。</p></header>
   <div className="blackbox-hud"><div><small>SYSTEM INTEGRITY</small><strong>{integrity}<i>%</i></strong></div><div><small>INTEL ACQUIRED</small><strong>{intel}<i>/8</i></strong></div><div><small>INCIDENT</small><strong>SEV<i>-1</i></strong></div><div><small>ELAPSED</small><strong>{done?'00:41':round.time}</strong></div></div>
   {!done?<section className="incident-console">
    <header><span>ROUND {String(step+1).padStart(2,'0')} / 04</span><b>{round.time} JST</b></header>
    <div className="incident-signal"><small>INCOMING SIGNAL</small><h2>{round.title}</h2><p>{round.signal}</p></div>
    <div className="incident-choices">{round.choices.map((c,i)=><button key={c.label} onClick={()=>choose(c)}><span>{String.fromCharCode(65+i)}</span><b>{c.label}</b><em>EXECUTE →</em></button>)}</div>
   </section>:<section className="incident-result">
    <span>MISSION COMPLETE</span><h2>{rank}</h2><strong>{integrity}<i>%</i></strong>
    <p>{integrity>=70?'あなたは「原因を当てる」より先に、被害半径・責任・可逆性を制御しました。':'技術的な原因調査より前に、責任境界と被害半径を固定すると生存率が上がります。'}</p>
    <div className="incident-log">{history.map((h,i)=><article key={i}><span>{String(i+1).padStart(2,'0')}</span><div><b>{h.title}</b><p>{h.choice.label}</p><em>{h.choice.note}</em></div><strong className={h.choice.impact>=0?'plus':'minus'}>{h.choice.impact>=0?'+':''}{h.choice.impact}</strong></article>)}</div>
    <div className="incident-result-actions"><button onClick={reset}>↻ REPLAY INCIDENT</button><Link href="/survival-test">RUN READINESS TEST →</Link></div>
   </section>}
  </section>
 </main>;
}
