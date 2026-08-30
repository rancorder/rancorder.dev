import Link from 'next/link';
import MissionFX from '../components/MissionFX';
import MissionSelector from '../components/MissionSelector';
import SectorMissionPanel from '../components/SectorMissionPanel';
import HeroMissionConsole from '../components/HeroMissionConsole';
import AdaptiveHeroCopy from '../components/AdaptiveHeroCopy';
import KnowledgeDeck from '../components/KnowledgeDeck';
import MissionIntake from '../components/MissionIntake';
import OriginSystem from '../components/OriginSystem';

const proof = [
  { value: '54', unit: 'sites', label: '監視基盤', detail: '複数サイトを一つの運用面で監視' },
  { value: '11', unit: 'months', label: '連続稼働', detail: '止めないための監視・復旧設計' },
  { value: '100K+', unit: '/ month', label: '処理規模', detail: '定常運用を前提にした自動処理' },
  { value: '0', unit: 'stops', label: '障害停止', detail: 'システム障害による業務停止' },
];

const cases = [
  {
    slug: '54-site-monitoring',
    id: 'CASE 01',
    status: 'PRODUCTION READY',
    tone: 'green',
    title: '54サイト監視基盤',
    signal: '個別監視では、障害の発見と復旧判断が担当者に依存する。',
    decision: '監視対象・異常判定・復旧導線を一つの運用面へ集約。',
    result: '11か月連続稼働 / 月10万件超処理',
  },
  {
    slug: 'ai-production-delivery',
    id: 'CASE 02',
    status: 'AI / AUTOMATION',
    tone: 'purple',
    title: 'AI機能の本番導入',
    signal: '「動くPoC」と「使い続けられる機能」の間に責任境界がない。',
    decision: '失敗条件・監視・人へのエスカレーションを先に定義。',
    result: 'Whisper / BERT を本番運用へ接続',
  },
  {
    slug: '1400-line-quality-rebuild',
    id: 'CASE 03',
    status: 'RISK CONTAINED',
    tone: 'yellow',
    title: '1,400行の品質再建',
    signal: '未テストの巨大ロジック。全面改修はリスクと工数が大きい。',
    decision: '壊れたときの影響度から保証境界を決め、30テストを追加。',
    result: '変更可能なコードへ段階的に再構築',
  },
  {
    slug: 'sales-support-poc-operations',
    id: 'CASE 04',
    status: 'SALES OPS / POC',
    tone: 'purple',
    title: '営業支援PoCの運用化',
    signal: '架電結果・アポ・音声・KPIが分散し、取得成功と営業判断がつながっていない。',
    decision: '巡回・アポ検知・文字起こし・KPI集計・配布を一つの運用パイプラインへ。',
    result: '38顧客規模の巡回運用 / 1時間単位の監視',
  },
];

export default function HomePage() {
  return (
    <main className="mission">
      <MissionFX />
      <div className="mission-grid" aria-hidden="true" />
      <div className="mission-glow mission-glow-a" aria-hidden="true" />
      <div className="mission-glow mission-glow-b" aria-hidden="true" />

      <nav className="mc-nav">
        <Link href="/" className="mc-brand" aria-label="rancorder home">
          RANCORDER<span>.DEV</span>
        </Link>
        <div className="mc-nav-links">
          <a href="#origin">ORIGIN</a>
          <a href="#cases">CASES</a>
          <a href="#diagnostic">DIAGNOSTIC</a>
          <Link href="/blog">KNOWLEDGE</Link>
          <Link href="/lab">LAB</Link>
          <a href="#sales-poc">SALES PoC</a>
        </div>
        <div className="mc-system-state"><i /> SYSTEM ONLINE</div>
      </nav>

      <section className="mc-hero">
        <div className="mc-hero-layout">
          <div className="mc-hero-copy"><AdaptiveHeroCopy /></div>

          <HeroMissionConsole />
        </div>

        <div className="mc-scroll-hint"><span /> SCROLL TO INSPECT</div>
      </section>

      <MissionSelector />
      <SectorMissionPanel />

      <OriginSystem />

      <section className="mc-proof" aria-label="operational evidence">
        <div className="mc-section-tag">02 / OPERATIONAL EVIDENCE</div>
        <div className="mc-proof-grid">
          {proof.map((item) => (
            <article key={item.label} className="mc-proof-card">
              <div className="mc-proof-number">{item.value}<small>{item.unit}</small></div>
              <h2>{item.label}</h2>
              <p>{item.detail}</p>
              <span className="mc-card-index">STATUS / VERIFIED</span>
            </article>
          ))}
        </div>
      </section>

      <section className="mc-section" id="cases">
        <header className="mc-section-head">
          <div>
            <div className="mc-section-tag">03 / DECISION RECORDS</div>
            <h2>コードではなく、<br /><span>判断の履歴を見せる。</span></h2>
          </div>
          <p>複雑な案件で価値になるのは、実装量ではなく「何を危険と見て、どこに境界を引いたか」です。</p>
        </header>

        <div className="mc-cases">
          {cases.map((item) => (
            <Link href={`/cases/${item.slug}`} className="mc-case" key={item.id}>
              <div className="mc-case-top">
                <span>{item.id}</span>
                <b className={`status-pill ${item.tone}`}>{item.status}</b>
              </div>
              <h3>{item.title}</h3>
              <dl>
                <div>
                  <dt>RISK SIGNAL</dt>
                  <dd>{item.signal}</dd>
                </div>
                <div>
                  <dt>DECISION</dt>
                  <dd>{item.decision}</dd>
                </div>
                <div>
                  <dt>RESULT</dt>
                  <dd>{item.result}</dd>
                </div>
              </dl>
              <div className="mc-case-line" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mc-section mc-sector" id="sales-poc">
        <header className="mc-section-head">
          <div>
            <div className="mc-section-tag purple">04 / SALES SUPPORT POC</div>
            <h2>営業支援PoCを、<br /><span>データ取得で終わらせない。</span></h2>
          </div>
          <p>架電結果・音声・アポ・KPIを、取得→検知→分析→報告まで一続きの運用へ変換します。</p>
        </header>
        <div className="sector-console">
          <div className="sector-flow">
            <span>CALL DATA</span><i>→</i><span>APPOINTMENT SIGNAL</span><i>→</i><span>TRANSCRIPT</span><i>→</i><span>KPI</span><i>→</i><strong>DECISION</strong>
          </div>
          <div className="sector-stats">
            <div><small>MONITORED ACCOUNTS</small><b>38</b></div>
            <div><small>巡回 CADENCE</small><b>1H</b></div>
            <div><small>APPOINTMENT DETECTION</small><b>AUTO</b></div>
            <div><small>REPORT ROUTING</small><b>ACTIVE</b></div>
          </div>
          <Link href="/cases/sales-support-poc-operations" className="mc-primary sector-cta">営業支援PoCのDecision Recordを見る <span>↗</span></Link>
        </div>
      </section>

      <section className="mc-section mc-diagnostic" id="diagnostic">
        <div className="mc-diag-panel">
          <div className="mc-diag-copy">
            <div className="mc-section-tag purple">05 / POC SURVIVAL TEST</div>
            <h2>そのPoC、<br /><span>本番で生き残れるか。</span></h2>
            <p>
              成功条件だけでは、本番移行はできません。
              責任・失敗条件・データ追跡・ロールバック・監視から
              Production Readiness を判定します。
            </p>
            <div className="mc-diag-preview">
              <span>INPUT</span><i>→</i><span>RISK SIGNAL</span><i>→</i><span>DECISION GRAPH</span><i>→</i><strong>NEXT 7 DAYS</strong>
            </div>
            <Link href="/survival-test" className="mc-disabled mc-live-cta">
              START SURVIVAL TEST →
            </Link>
          </div>
          <div className="mc-blockers">
            <div className="mc-blockers-head"><span>CRITICAL BLOCKERS</span><b>03</b></div>
            <ol>
              <li><span>01</span><div><b>Failure criteria undefined</b><small>成功条件はあるが、撤退条件がない</small></div></li>
              <li><span>02</span><div><b>Data owner unresolved</b><small>データ品質の責任者が不明</small></div></li>
              <li><span>03</span><div><b>Recovery depends on operator</b><small>復旧判断が担当者の経験に依存</small></div></li>
            </ol>
            <div className="mc-next-seven">
              <span>NEXT 7 DAYS</span>
              <p>Define exit criteria / Assign data owner / Limit observability to 3 signals</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mc-section mc-knowledge">
        <header className="mc-section-head">
          <div>
            <div className="mc-section-tag">06 / KNOWLEDGE SYSTEM</div>
            <h2>知識を、<br /><span>判断に使える形で残す。</span></h2>
          </div>
          <Link href="/blog" className="mc-text-link">KNOWLEDGE BASE を開く →</Link>
        </header>
        <KnowledgeDeck />
      </section>

      <MissionIntake />

      <footer className="mc-footer">
        <div>
          <span>RANCORDER.DEV</span>
          <p>PROJECT MISSION CONTROL</p>
        </div>
        <div className="mc-footer-state"><i /> AVAILABLE FOR COMPLEX SYSTEMS · <Link href="/about">PROFILE</Link> · <Link href="/expertise">EXPERTISE GRAPH</Link> · <Link href="/lab">LAB / AFTER HOURS</Link></div>
      </footer>
    </main>
  );
}
