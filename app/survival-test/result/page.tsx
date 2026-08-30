import type { Metadata } from 'next';
import Link from 'next/link';
import ShareButton from './share-button';

const weights = [18,18,15,15,14,10,10];
const blockers = [
  ['障害時の意思決定者が未定義','RACIではなく「停止・継続・復旧」を決める1名を定義する'],
  ['失敗条件・撤退条件が未定義','失敗とみなす3条件と、停止判断の閾値を定義する'],
  ['データの来歴を追跡できない','入力元・取得時刻・処理バージョンを最低限ログへ残す'],
  ['ロールバックが未検証','本番相当環境で1回、復旧時間を計測しながら戻す'],
  ['技術成功と業務成功の監視が未分離','システムKPIと業務KPIを1つずつ監視対象に追加する'],
  ['人へのフォールバック条件がない','信頼度・エラー種別・処理時間のどれで人へ戻すか決める'],
  ['非コード変更の履歴が残らない','モデル・プロンプト・主要設定を同じリリース単位で記録する'],
];

function decode(raw?: string) {
  const code = (raw || '').toLowerCase().replace(/[^ypn]/g,'').slice(0,7).padEnd(7,'n');
  return code.split('');
}
function scoreOf(code: string[]) {
  const total = weights.reduce((a,b)=>a+b,0);
  const earned = code.reduce((sum,v,i)=>sum + weights[i] * (v==='y'?1:v==='p'?.5:0),0);
  return Math.round((earned/total)*100);
}
function statusOf(score:number){
  return score >= 85 ? ['PRODUCTION READY','green'] : score >= 65 ? ['CONDITIONAL READY','yellow'] : ['CRITICAL RISK','red'];
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ r?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const code = decode(params.r);
  const score = scoreOf(code);
  const [status] = statusOf(score);
  const canonical = `https://rancorder.dev/survival-test/result?r=${code.join('')}`;
  const og = `https://rancorder.dev/api/og/survival?score=${score}&status=${encodeURIComponent(status)}`;
  return {
    title: `Production Readiness ${score}% | PoC Survival Test`,
    description: `${status} — PoCの本番移行危険度を7項目で診断。`,
    alternates: { canonical },
    openGraph: {
      title: `Production Readiness ${score}%`,
      description: `${status} — PoC Survival Test`,
      url: canonical,
      images: [{ url: og, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Production Readiness ${score}%`,
      description: `${status} — PoC Survival Test`,
      images: [og],
    },
  };
}

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const params = await searchParams;
  const code = decode(params.r);
  const score = scoreOf(code);
  const [status, tone] = statusOf(score);
  const weak = code.map((v,i)=>({v,i})).filter(x=>x.v!=='y').sort((a,b)=>weights[b.i]-weights[a.i]).slice(0,3);
  const shareUrl = `https://rancorder.dev/survival-test/result?r=${code.join('')}`;

  return <main className="survival">
    <div className="survival-grid" aria-hidden="true" />
    <nav className="survival-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <span>SHAREABLE DIAGNOSTIC RESULT</span>
    </nav>
    <section className="survival-shell survival-result">
      <div className="result-top">
        <div>
          <div className="mc-section-tag purple">ANALYSIS COMPLETE</div>
          <h1>PRODUCTION<br/>READINESS</h1>
        </div>
        <div className="result-score">
          <strong>{score}</strong><span>%</span>
          <b className={tone}>{status}</b>
        </div>
      </div>
      <div className="result-meter"><i style={{width:`${score}%`}} /></div>

      <div className="result-grid">
        <section className="result-blockers">
          <header><span>CRITICAL BLOCKERS</span><b>{String(weak.length).padStart(2,'0')}</b></header>
          {weak.length === 0 ? <div className="result-clear">重大な阻害要因は検出されませんでした。</div> :
            weak.map((x,idx)=><article key={x.i}>
              <span>{String(idx+1).padStart(2,'0')}</span>
              <div><h3>{blockers[x.i][0]}</h3><p>優先度 {weights[x.i]} / 100</p></div>
            </article>)
          }
        </section>

        <section className="result-next">
          <header><span>NEXT 7 DAYS</span><b>EXECUTION ORDER</b></header>
          <ol>
            {weak.length === 0
              ? <li><span>01</span><p>本番相当環境で障害注入テストを行い、復旧時間を実測する。</p></li>
              : weak.map((x,idx)=><li key={x.i}><span>{String(idx+1).padStart(2,'0')}</span><p>{blockers[x.i][1]}</p></li>)
            }
          </ol>
        </section>
      </div>

      <div className="result-footer">
        <div>
          <span>INTERPRETATION</span>
          <p>{score >= 85
            ? '本番移行の土台は強い状態です。次は障害注入・復旧時間・運用負荷の実測へ。'
            : score >= 65
              ? '移行可能ですが、責任・復旧・監視の未確定項目を残すと運用負債になります。'
              : '追加開発より先に、失敗時の責任・復旧・監視境界を定義した方が総コストを下げられる状態です。'
          }</p>
        </div>
        <div className="result-actions">
          <ShareButton url={shareUrl} score={score} status={status} />
          <Link href="/survival-test" className="result-link">RETAKE TEST ↻</Link>
        </div>
      </div>
    </section>
  </main>;
}
