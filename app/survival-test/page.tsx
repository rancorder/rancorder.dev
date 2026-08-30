'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Answer = 'yes' | 'partial' | 'no';

type Question = {
  id: string;
  domain: string;
  question: string;
  why: string;
  blocker: string;
  action: string;
  weight: number;
};

const questions: Question[] = [
  {
    id: 'owner',
    domain: 'RESPONSIBILITY',
    question: '障害時に、最終判断を下す責任者が明確ですか？',
    why: '復旧判断の責任者が曖昧だと、障害より意思決定待ちで止まります。',
    blocker: '障害時の意思決定者が未定義',
    action: 'RACIではなく「停止・継続・復旧」を決める1名を定義する',
    weight: 18,
  },
  {
    id: 'failure',
    domain: 'FAILURE CRITERIA',
    question: '「成功条件」だけでなく「失敗・撤退条件」も定義されていますか？',
    why: 'PoCは成功条件だけでも進められますが、本番では失敗条件がないと止め時を判断できません。',
    blocker: '失敗条件・撤退条件が未定義',
    action: '失敗とみなす3条件と、停止判断の閾値を定義する',
    weight: 18,
  },
  {
    id: 'trace',
    domain: 'DATA TRACEABILITY',
    question: '異常値が出たとき、元データ・取得時刻・変換経路まで追跡できますか？',
    why: 'AIや自動化では「結果が変」だけでは原因特定できません。',
    blocker: 'データの来歴を追跡できない',
    action: '入力元・取得時刻・処理バージョンを最低限ログへ残す',
    weight: 15,
  },
  {
    id: 'rollback',
    domain: 'ROLLBACK',
    question: '不具合時に、前の状態へ戻す手順が実際に試されていますか？',
    why: 'ロールバック手順が文書にあるだけでは、本番障害時に機能しないことがあります。',
    blocker: 'ロールバックが未検証',
    action: '本番相当環境で1回、復旧時間を計測しながら戻す',
    weight: 15,
  },
  {
    id: 'observable',
    domain: 'OBSERVABILITY',
    question: '「処理が終わった」と「正しい結果が出た」を別々に監視していますか？',
    why: 'ジョブ成功と業務成功は別物です。正常終了した誤結果は最も見逃されやすい障害です。',
    blocker: '技術成功と業務成功の監視が未分離',
    action: 'システムKPIと業務KPIを1つずつ監視対象に追加する',
    weight: 14,
  },
  {
    id: 'human',
    domain: 'HUMAN FALLBACK',
    question: 'AIや自動処理が失敗したとき、人へ切り替える条件がありますか？',
    why: '完全自動化より「どこで人へ戻すか」の方が本番品質を左右します。',
    blocker: '人へのフォールバック条件がない',
    action: '信頼度・エラー種別・処理時間のどれで人へ戻すか決める',
    weight: 10,
  },
  {
    id: 'change',
    domain: 'CHANGE CONTROL',
    question: 'モデル・プロンプト・データ・業務ルールの変更履歴を追えますか？',
    why: 'AI系はコード以外の変更でも結果が変わるため、変更元を追えないと再現性が失われます。',
    blocker: '非コード変更の履歴が残らない',
    action: 'モデル・プロンプト・主要設定を同じリリース単位で記録する',
    weight: 10,
  },
];

const valueMap: Record<Answer, number> = { yes: 1, partial: 0.5, no: 0 };

export default function SurvivalTestPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);

  const answered = Object.keys(answers).length;
  const score = useMemo(() => {
    const total = questions.reduce((sum, q) => sum + q.weight, 0);
    const earned = questions.reduce((sum, q) => sum + q.weight * valueMap[answers[q.id] ?? 'no'], 0);
    return Math.round((earned / total) * 100);
  }, [answers]);

  const blockers = useMemo(
    () => questions
      .filter((q) => answers[q.id] === 'no' || answers[q.id] === 'partial')
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3),
    [answers],
  );

  const status = score >= 85
    ? ['PRODUCTION READY', 'green']
    : score >= 65
      ? ['CONDITIONAL READY', 'yellow']
      : ['CRITICAL RISK', 'red'];

  const restart = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="survival">
      <div className="survival-grid" aria-hidden="true" />
      <nav className="survival-nav">
        <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
        <span>PoC SURVIVAL TEST / v0.1</span>
      </nav>

      <section className="survival-shell">
        {!submitted ? (
          <>
            <header className="survival-head">
              <div className="mc-section-tag purple">PRODUCTION READINESS DIAGNOSTIC</div>
              <h1>そのPoC、<br /><span>本番で生き残れるか。</span></h1>
              <p>7つの質問で、技術力ではなく「本番運用に耐える設計」があるかを診断します。</p>
              <div className="survival-progress">
                <div><i style={{ width: `${(answered / questions.length) * 100}%` }} /></div>
                <span>{String(answered).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
              </div>
            </header>

            <div className="survival-questions">
              {questions.map((q, index) => (
                <article className="survival-question" key={q.id}>
                  <div className="survival-qmeta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <b>{q.domain}</b>
                  </div>
                  <h2>{q.question}</h2>
                  <p>{q.why}</p>
                  <div className="survival-options">
                    {([
                      ['yes', 'YES', '定義済み'],
                      ['partial', 'PARTIAL', '一部のみ'],
                      ['no', 'NO', '未定義'],
                    ] as const).map(([value, label, note]) => (
                      <button
                        key={value}
                        type="button"
                        className={answers[q.id] === value ? `active ${value}` : ''}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
                      >
                        <b>{label}</b><span>{note}</span>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="survival-submit">
              <div>
                <span>READINESS ENGINE</span>
                <p>{answered === questions.length ? '入力完了。リスク構造を解析できます。' : 'すべての質問に回答してください。'}</p>
              </div>
              <button
                type="button"
                disabled={answered !== questions.length}
                onClick={() => {
                  const code = questions.map((q) => {
                    const value = answers[q.id];
                    return value === 'yes' ? 'y' : value === 'partial' ? 'p' : 'n';
                  }).join('');
                  window.location.href = `/survival-test/result?r=${code}`;
                }}
              >
                ANALYZE PROJECT →
              </button>
            </div>
          </>
        ) : (
          <section className="survival-result">
            <div className="result-top">
              <div>
                <div className="mc-section-tag purple">ANALYSIS COMPLETE</div>
                <h1>PRODUCTION<br />READINESS</h1>
              </div>
              <div className="result-score">
                <strong>{score}</strong><span>%</span>
                <b className={status[1]}>{status[0]}</b>
              </div>
            </div>

            <div className="result-meter"><i style={{ width: `${score}%` }} /></div>

            <div className="result-grid">
              <section className="result-blockers">
                <header><span>CRITICAL BLOCKERS</span><b>{String(blockers.length).padStart(2, '0')}</b></header>
                {blockers.length === 0 ? (
                  <div className="result-clear">重大な阻害要因は検出されませんでした。</div>
                ) : blockers.map((q, index) => (
                  <article key={q.id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{q.blocker}</h3>
                      <p>{q.why}</p>
                    </div>
                  </article>
                ))}
              </section>

              <section className="result-next">
                <header><span>NEXT 7 DAYS</span><b>EXECUTION ORDER</b></header>
                <ol>
                  {blockers.length === 0 ? (
                    <li><span>01</span><p>現在の設計を本番相当環境で障害注入テストする。</p></li>
                  ) : blockers.map((q, index) => (
                    <li key={q.id}><span>{String(index + 1).padStart(2, '0')}</span><p>{q.action}</p></li>
                  ))}
                </ol>
              </section>
            </div>

            <div className="result-footer">
              <div>
                <span>INTERPRETATION</span>
                <p>
                  {score >= 85
                    ? '本番移行の土台は強い状態です。次は障害注入・復旧時間・運用負荷の実測へ進めます。'
                    : score >= 65
                      ? '本番移行は可能ですが、責任・復旧・監視の未確定項目を残したまま進めると運用負債になります。'
                      : 'PoCの追加開発より先に、失敗時の責任・復旧・監視境界を定義した方が総コストを下げられる状態です。'}
                </p>
              </div>
              <button type="button" onClick={restart}>RESTART TEST ↻</button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
