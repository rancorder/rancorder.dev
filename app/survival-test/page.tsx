'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Answer = 'yes' | 'partial' | 'no';
type Sector = 'manufacturing' | 'sales';
type Question = { id:string; domain:string; question:string; why:string; blocker:string; action:string; weight:number };

const common: Question[] = [
  { id:'owner', domain:'RESPONSIBILITY', question:'障害時に、最終判断を下す責任者が明確ですか？', why:'障害そのものより、誰が止める・続けるを決めるか曖昧な方が長く止まります。', blocker:'意思決定者が未定義', action:'停止・継続・復旧を決める責任者を1名定義する', weight:16 },
  { id:'failure', domain:'FAILURE CRITERIA', question:'成功条件だけでなく、失敗・撤退条件も定義されていますか？', why:'PoCは成功条件だけでも進みますが、本番では止め時が必要です。', blocker:'失敗・撤退条件が未定義', action:'失敗とみなす3条件と停止閾値を定義する', weight:16 },
];

const manufacturing: Question[] = [
  ...common,
  { id:'ai-error', domain:'AI ERROR BOUNDARY', question:'AIが誤った結果を返したとき、自動採用を止める条件がありますか？', why:'精度が高くても、誤りが業務へ流れる境界が曖昧なら本番品質にはなりません。', blocker:'AI誤判定の遮断条件がない', action:'信頼度・ルール違反・例外種別で採用停止条件を定義する', weight:16 },
  { id:'trace', domain:'DATA TRACEABILITY', question:'異常値から、元データ・取得時刻・処理バージョンまで追跡できますか？', why:'結果だけ保存しても、AIや変換処理の原因は追えません。', blocker:'データ来歴を追跡できない', action:'入力元・取得時刻・処理バージョンをログへ残す', weight:14 },
  { id:'rollback', domain:'ROLLBACK', question:'モデル・プロンプト・設定変更後に、前状態へ戻す手順を試していますか？', why:'コード以外の変更でも結果が変わるため、復旧経路が必要です。', blocker:'AI変更のロールバックが未検証', action:'モデル・プロンプト・設定を同一リリース単位で戻せるようにする', weight:14 },
  { id:'observe', domain:'OBSERVABILITY', question:'処理成功と、業務上正しい結果を別々に監視していますか？', why:'正常終了した誤結果は、最も検知しにくい障害です。', blocker:'技術成功と業務成功の監視が未分離', action:'システムKPIと業務KPIを1つずつ監視に追加する', weight:13 },
  { id:'fallback', domain:'HUMAN FALLBACK', question:'AIを使わず人へ戻す条件と経路がありますか？', why:'完全自動化より、どこで人へ戻すかが本番の安全性を左右します。', blocker:'人へのフォールバック条件がない', action:'信頼度・処理時間・例外種別で人へ戻す条件を決める', weight:11 },
];

const sales: Question[] = [
  ...common,
  { id:'signal', domain:'SIGNAL INTEGRITY', question:'アポ取得と「アポ検知成功」を別々に確認できますか？', why:'営業成果が発生しても検知・転記に失敗すれば、システム上は存在しない成果になります。', blocker:'アポ取りこぼしを検知できない', action:'成果発生件数と検知件数を突合する監視を追加する', weight:16 },
  { id:'routing', domain:'DATA ROUTING', question:'顧客ごとの設定・保存先・認証を、処理ロジックと分離していますか？', why:'顧客数が増えるほど、設定衝突や誤配布が運用事故になります。', blocker:'顧客別ルーティングの境界が弱い', action:'顧客設定を台帳化し、処理コードから分離する', weight:14 },
  { id:'freshness', domain:'REPORT FRESHNESS', question:'営業判断に必要な時間内に、KPIとアポ情報が更新されますか？', why:'正しいレポートでも遅ければ、営業判断には使えません。', blocker:'レポート鮮度のSLAがない', action:'更新期限を定義し、遅延を異常として監視する', weight:14 },
  { id:'transcript', domain:'TRANSCRIPT QUALITY', question:'文字起こし失敗や低品質音声を、正常データと区別できますか？', why:'音声処理の成功と、分析に使える文字起こしは別物です。', blocker:'文字起こし品質の異常を識別できない', action:'音声長・信頼度・空出力で品質ゲートを設ける', weight:13 },
  { id:'decision', domain:'DECISION OUTPUT', question:'集計結果が「次に誰へ何をするか」まで接続されていますか？', why:'営業支援PoCは分析結果を出すだけでは、現場の摩擦を減らしません。', blocker:'分析と営業アクションが分断', action:'レポートに次アクションと担当を最低1つ持たせる', weight:11 },
];

const valueMap: Record<Answer, number> = { yes:1, partial:.5, no:0 };

export default function SurvivalTestPage(){
  const [sector,setSector] = useState<Sector>('manufacturing');
  const [answers,setAnswers] = useState<Record<string,Answer>>({});

  useEffect(()=>{
    const saved = window.localStorage.getItem('rancorder-mission');
    if(saved === 'manufacturing' || saved === 'sales') setSector(saved);
  },[]);

  const questions = sector === 'sales' ? sales : manufacturing;
  const answered = questions.filter(q=>answers[q.id]).length;
  const score = useMemo(()=>{
    const total = questions.reduce((s,q)=>s+q.weight,0);
    const earned = questions.reduce((s,q)=>s+q.weight*valueMap[answers[q.id] ?? 'no'],0);
    return Math.round(earned/total*100);
  },[answers,questions]);

  const changeSector = (next:Sector) => {
    setSector(next);
    setAnswers({});
    window.localStorage.setItem('rancorder-mission',next);
  };

  return <main className={`survival survival-${sector}`}>
    <div className="survival-grid" aria-hidden="true" />
    <nav className="survival-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <span>PoC SURVIVAL TEST / SECTOR MODE</span>
    </nav>

    <section className="survival-shell">
      <header className="survival-head">
        <div className="survival-sector-switch">
          <button className={sector==='manufacturing'?'active':''} onClick={()=>changeSector('manufacturing')}>MFG AI</button>
          <button className={sector==='sales'?'active':''} onClick={()=>changeSector('sales')}>SALES OPS</button>
        </div>
        <div className="mc-section-tag purple">{sector==='sales'?'SALES SUPPORT POC':'MANUFACTURING AI POC'} / READINESS DIAGNOSTIC</div>
        <h1>そのPoC、<br/><span>本番で生き残れるか。</span></h1>
        <p>{sector==='sales'
          ? '架電データ・アポ・文字起こし・KPIが、営業判断までつながる運用かを診断します。'
          : 'AIの誤判定・責任境界・監視・復旧まで、本番運用に耐える設計かを診断します。'}
        </p>
        <div className="survival-progress">
          <div><i style={{width:`${answered/questions.length*100}%`}} /></div>
          <span>{String(answered).padStart(2,'0')} / {String(questions.length).padStart(2,'0')} · SCORE {score}%</span>
        </div>
      </header>

      <div className="survival-questions">
        {questions.map((q,index)=><article className="survival-question" key={q.id}>
          <div className="survival-qmeta"><span>{String(index+1).padStart(2,'0')}</span><b>{q.domain}</b></div>
          <h2>{q.question}</h2>
          <p>{q.why}</p>
          <div className="survival-options">
            {([['yes','YES','定義済み'],['partial','PARTIAL','一部のみ'],['no','NO','未定義']] as const).map(([value,label,note])=>
              <button key={value} type="button" className={answers[q.id]===value?`active ${value}`:''} onClick={()=>setAnswers(prev=>({...prev,[q.id]:value}))}>
                <b>{label}</b><span>{note}</span>
              </button>
            )}
          </div>
        </article>)}
      </div>

      <div className="survival-submit">
        <div>
          <span>{sector==='sales'?'SALES OPS READINESS ENGINE':'AI PRODUCTION READINESS ENGINE'}</span>
          <p>{answered===questions.length?'入力完了。Sector固有のBlockerを解析します。':'すべての質問に回答してください。'}</p>
        </div>
        <button type="button" disabled={answered!==questions.length} onClick={()=>{
          const code = questions.map(q=>answers[q.id]==='yes'?'y':answers[q.id]==='partial'?'p':'n').join('');
          window.location.href = `/survival-test/result?s=${sector==='sales'?'sales':'mfg'}&r=${code}`;
        }}>ANALYZE MISSION →</button>
      </div>
    </section>
  </main>;
}