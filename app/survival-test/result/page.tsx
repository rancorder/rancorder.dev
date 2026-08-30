import type { Metadata } from 'next';
import Link from 'next/link';
import ShareButton from './share-button';

type SectorCode = 'mfg' | 'sales';

const weights = [16,16,16,14,14,13,11];

const blockerSets: Record<SectorCode, { label:string; blockers:[string,string][]; interpretation:[string,string,string] }> = {
  mfg: {
    label: 'MANUFACTURING AI POC',
    blockers: [
      ['意思決定者が未定義','停止・継続・復旧を決める責任者を1名定義する'],
      ['失敗・撤退条件が未定義','失敗とみなす3条件と停止閾値を定義する'],
      ['AI誤判定の遮断条件がない','信頼度・ルール違反・例外種別で採用停止条件を定義する'],
      ['データ来歴を追跡できない','入力元・取得時刻・処理バージョンをログへ残す'],
      ['AI変更のロールバックが未検証','モデル・プロンプト・設定を同一リリース単位で戻せるようにする'],
      ['技術成功と業務成功の監視が未分離','システムKPIと業務KPIを1つずつ監視に追加する'],
      ['人へのフォールバック条件がない','信頼度・処理時間・例外種別で人へ戻す条件を決める'],
    ],
    interpretation: [
      'AI本番運用の土台は強い状態です。次は障害注入・誤判定・復旧時間を実測します。',
      '本番移行は可能ですが、AI失敗時の責任・復旧・監視境界を残すと運用負債になります。',
      'モデル精度の追加改善より先に、AIが間違えたときの遮断・責任・復旧境界を定義すべき状態です。',
    ],
  },
  sales: {
    label: 'SALES SUPPORT POC',
    blockers: [
      ['意思決定者が未定義','停止・継続・復旧を決める責任者を1名定義する'],
      ['失敗・撤退条件が未定義','失敗とみなす3条件と停止閾値を定義する'],
      ['アポ取りこぼしを検知できない','成果発生件数と検知件数を突合する監視を追加する'],
      ['顧客別ルーティングの境界が弱い','顧客設定を台帳化し、処理コードから分離する'],
      ['レポート鮮度のSLAがない','更新期限を定義し、遅延を異常として監視する'],
      ['文字起こし品質の異常を識別できない','音声長・信頼度・空出力で品質ゲートを設ける'],
      ['分析と営業アクションが分断','レポートに次アクションと担当を最低1つ持たせる'],
    ],
    interpretation: [
      '営業支援PoCの運用基盤は強い状態です。次は取りこぼし・遅延・誤配布を意図的に発生させて耐性を確認します。',
      '営業判断には使えますが、成果検知・顧客別ルーティング・鮮度の未確定項目を残すと規模拡大で破綻します。',
      '分析精度より先に、アポ取りこぼし・データ配布・レポート鮮度を保証する運用境界を作るべき状態です。',
    ],
  },
};

function sectorOf(raw?: string): SectorCode { return raw === 'sales' ? 'sales' : 'mfg'; }
function decode(raw?: string) {
  return (raw || '').toLowerCase().replace(/[^ypn]/g,'').slice(0,7).padEnd(7,'n').split('');
}
function scoreOf(code:string[]) {
  const total = weights.reduce((a,b)=>a+b,0);
  const earned = code.reduce((sum,v,i)=>sum + weights[i]*(v==='y'?1:v==='p'?.5:0),0);
  return Math.round(earned/total*100);
}
function statusOf(score:number) {
  return score >= 85 ? ['PRODUCTION READY','green'] : score >= 65 ? ['CONDITIONAL READY','yellow'] : ['CRITICAL RISK','red'];
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ r?:string; s?:string }> }): Promise<Metadata> {
  const params = await searchParams;
  const sector = sectorOf(params.s);
  const config = blockerSets[sector];
  const code = decode(params.r);
  const score = scoreOf(code);
  const [status] = statusOf(score);
  const canonical = `https://rancorder.dev/survival-test/result?s=${sector}&r=${code.join('')}`;
  const og = `https://rancorder.dev/api/og/survival?score=${score}&status=${encodeURIComponent(status)}&sector=${encodeURIComponent(config.label)}`;
  return {
    title: `${config.label} / Readiness ${score}% | PoC Survival Test`,
    description: `${status} — ${config.label} の本番移行危険度を診断。`,
    alternates: { canonical },
    openGraph: { title:`${config.label} / Readiness ${score}%`, description:`${status} — PoC Survival Test`, url:canonical, images:[{url:og,width:1200,height:630}], type:'website' },
    twitter: { card:'summary_large_image', title:`${config.label} / Readiness ${score}%`, description:`${status} — PoC Survival Test`, images:[og] },
  };
}

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ r?:string; s?:string }> }) {
  const params = await searchParams;
  const sector = sectorOf(params.s);
  const config = blockerSets[sector];
  const code = decode(params.r);
  const score = scoreOf(code);
  const [status,tone] = statusOf(score);
  const weak = code.map((v,i)=>({v,i})).filter(x=>x.v!=='y').sort((a,b)=>weights[b.i]-weights[a.i]).slice(0,3);
  const shareUrl = `https://rancorder.dev/survival-test/result?s=${sector}&r=${code.join('')}`;
  const interpretation = score >= 85 ? config.interpretation[0] : score >= 65 ? config.interpretation[1] : config.interpretation[2];

  return <main className={`survival survival-${sector==='sales'?'sales':'manufacturing'}`}>
    <div className="survival-grid" aria-hidden="true" />
    <nav className="survival-nav">
      <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
      <span>{config.label} / SHAREABLE RESULT</span>
    </nav>

    <section className="survival-shell survival-result">
      <div className="result-top">
        <div>
          <div className="mc-section-tag purple">{config.label} / ANALYSIS COMPLETE</div>
          <h1>PRODUCTION<br/>READINESS</h1>
        </div>
        <div className="result-score"><strong>{score}</strong><span>%</span><b className={tone}>{status}</b></div>
      </div>
      <div className="result-meter"><i style={{width:`${score}%`}} /></div>

      <div className="result-grid">
        <section className="result-blockers">
          <header><span>SECTOR BLOCKERS</span><b>{String(weak.length).padStart(2,'0')}</b></header>
          {weak.length===0 ? <div className="result-clear">重大な阻害要因は検出されませんでした。</div> :
            weak.map((x,idx)=><article key={x.i}><span>{String(idx+1).padStart(2,'0')}</span><div><h3>{config.blockers[x.i][0]}</h3><p>IMPACT WEIGHT {weights[x.i]}</p></div></article>)}
        </section>

        <section className="result-next">
          <header><span>NEXT 7 DAYS</span><b>EXECUTION ORDER</b></header>
          <ol>
            {weak.length===0
              ? <li><span>01</span><p>{sector==='sales'?'取りこぼし・遅延・誤配布の障害注入テストを行う。':'AI誤判定・復旧・フォールバックの障害注入テストを行う。'}</p></li>
              : weak.map((x,idx)=><li key={x.i}><span>{String(idx+1).padStart(2,'0')}</span><p>{config.blockers[x.i][1]}</p></li>)}
          </ol>
        </section>
      </div>

      <div className="result-footer">
        <div><span>SECTOR INTERPRETATION</span><p>{interpretation}</p></div>
        <div className="result-actions">
          <ShareButton url={shareUrl} score={score} status={status} />
          <Link href="/survival-test" className="result-link">RETAKE MISSION ↻</Link>
        </div>
      </div>
    </section>
  </main>;
}
