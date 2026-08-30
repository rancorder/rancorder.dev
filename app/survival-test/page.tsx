'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import SurvivalCombatHUD from '../../components/SurvivalCombatHUD';
import { awardAchievement } from '../../components/MissionXP';

type Answer = 'yes' | 'partial' | 'no';
type Sector = 'manufacturing' | 'sales' | 'dx';
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


const dx: Question[] = [
  ...common,
  { id:'process', domain:'PROCESS OWNERSHIP', question:'DX後の業務フローについて、工程ごとの責任者が決まっていますか？', why:'システム導入後も責任が旧組織のままだと、例外処理だけ人に残ります。', blocker:'新業務フローの責任境界がない', action:'主要工程ごとに実行者・承認者・例外判断者を定義する', weight:16 },
  { id:'truth', domain:'SOURCE OF TRUTH', question:'同じ情報について「どのシステムが正本か」を一意に決めていますか？', why:'Excel・既存システム・新ツールが併存すると、DXは入力先を増やしただけになります。', blocker:'データの正本が分裂している', action:'主要データごとにSystem of Recordを1つ指定する', weight:14 },
  { id:'shadow', domain:'SHADOW WORKFLOW', question:'新システム導入後に残るExcel・紙・口頭連絡を把握していますか？', why:'公式フローではなく、残存する裏フローが実際の運用コストを決めます。', blocker:'Shadow Workflowを把握できていない', action:'旧手順の残存箇所を棚卸しし、廃止条件を設定する', weight:14 },
  { id:'adoption', domain:'ADOPTION SIGNAL', question:'ログイン数ではなく「新業務が実際に完了した割合」を測れますか？', why:'利用率は定着を保証しません。旧手順へ戻らず業務完了できたかが重要です。', blocker:'現場定着を測る指標がない', action:'新フロー完結率と旧フロー逆戻り率を計測する', weight:13 },
  { id:'fallback', domain:'TRANSITION FALLBACK', question:'移行失敗時に、どこまで旧運用へ戻すか決めていますか？', why:'全面切替より、移行期間の境界設計がDX失敗の被害を限定します。', blocker:'移行時の復旧境界がない', action:'切替単位・戻し条件・旧運用保持期限を定義する', weight:11 },
];

const valueMap: Record<Answer, number> = { yes:1, partial:.5, no:0 };

export default function SurvivalTestPage(){
  const [sector,setSector] = useState<Sector>('manufacturing');
  const [answers,setAnswers] = useState<Record<string,Answer>>({});
  const [alert,setAlert] = useState('');
  const [pulse,setPulse] = useState(0);

  useEffect(()=>{
    const saved = window.localStorage.getItem('rancorder-mission');
    const query = new URLSearchParams(window.location.search).get('s');
    if(query === 'dx') setSector('dx');
    else if(query === 'sales') setSector('sales');
    else if(query === 'mfg') setSector('manufacturing');
    else if(saved === 'manufacturing' || saved === 'sales' || saved === 'dx') setSector(saved);
  },[]);

  const questions = sector === 'sales' ? sales : sector === 'dx' ? dx : manufacturing;
  const answered = questions.filter(q=>answers[q.id]).length;
  const riskCount = questions.filter(q=>answers[q.id] === 'no' || answers[q.id] === 'partial').length;
  const score = useMemo(()=>{
    const damage = questions.reduce((sum,q)=>{
      const answer = answers[q.id];
      if(!answer) return sum;
      return sum + q.weight * (1 - valueMap[answer]);
    },0);
    return Math.max(0, Math.round(100 - damage));
  },[answers,questions]);

  const changeSector = (next:Sector) => {
    setSector(next);
    setAnswers({});
    setAlert('');
    setPulse((v)=>v+1);
    window.localStorage.setItem('rancorder-mission',next);
  };

  const answerQuestion = (q:Question, value:Answer) => {
    setAnswers(prev=>({...prev,[q.id]:value}));
    setPulse((v)=>v+1);
    if(value === 'no') setAlert(`CRITICAL RISK DETECTED / ${q.blocker}`);
    else if(value === 'partial') setAlert(`WARNING / ${q.domain} PARTIALLY DEFINED`);
    else setAlert(`SYSTEM STABILIZED / ${q.domain}`);
  };

  return <main className={`survival survival-${sector} ${score < 65 ? 'survival-critical' : score < 85 ? 'survival-warning' : 'survival-stable'}`}>
    <div className="survival-grid" aria-hidden="true" />
    <SurvivalCombatHUD
      sector={sector}
      score={score}
      riskCount={riskCount}
      answered={answered}
      total={questions.length}
      alert={alert}
      pulse={pulse}
    />
    <nav className="survival-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <span>PoC SURVIVAL TEST / SECTOR MODE</span>
    </nav>

    <section className="survival-shell">
      <header className="survival-head">
        <div className="survival-sector-switch">
          <button className={sector==='manufacturing'?'active':''} onClick={()=>changeSector('manufacturing')}>MFG AI</button>
          <button className={sector==='sales'?'active':''} onClick={()=>changeSector('sales')}>SALES OPS</button>
          <button className={sector==='dx'?'active':''} onClick={()=>changeSector('dx')}>DX</button>
        </div>
        <div className="mc-section-tag purple">{sector==='sales'?'SALES SUPPORT POC':sector==='dx'?'DX TRANSFORMATION':'MANUFACTURING AI POC'} / READINESS DIAGNOSTIC</div>
        <h1>そのPoC、<br/><span>本番で生き残れるか。</span></h1>
        <p>{sector==='sales'
          ? '架電データ・アポ・文字起こし・KPIが、営業判断までつながる運用かを診断します。'
          : sector==='dx'
            ? '業務フロー・データ正本・Shadow Workflow・現場定着まで、DXが本当に運用へ根付く設計かを診断します。'
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
              <button key={value} type="button" className={answers[q.id]===value?`active ${value}`:''} onClick={()=>answerQuestion(q,value)}>
                <b>{label}</b><span>{note}</span>
              </button>
            )}
          </div>
        </article>)}
      </div>

      <div className="survival-submit">
        <div>
          <span>{sector==='sales'?'SALES OPS READINESS ENGINE':sector==='dx'?'DX ADOPTION READINESS ENGINE':'AI PRODUCTION READINESS ENGINE'}</span>
          <p>{answered===questions.length?'入力完了。Sector固有のBlockerを解析します。':'すべての質問に回答してください。'}</p>
        </div>
        <button type="button" disabled={answered!==questions.length} onClick={()=>{
          const code = questions.map(q=>answers[q.id]==='yes'?'y':answers[q.id]==='partial'?'p':'n').join('');
          awardAchievement('diagnostic');
          window.location.href = `/survival-test/result?s=${sector==='sales'?'sales':sector==='dx'?'dx':'mfg'}&r=${code}`;
        }}>ANALYZE MISSION →</button>
      </div>
    </section>
  </main>;
}