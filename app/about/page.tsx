import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title:'About rancorder | Technical PM / AI・DX Delivery',
  description:'製造業・営業支援・AI/DXの経験を横断し、曖昧なPoCやDX案件を本番運用へ移行するTechnical PM、rancorderの専門領域と実績。',
  alternates:{canonical:'/about'},
};

const capabilities=[
  ['PoC → Production','責任境界、失敗条件、監視、Rollback、人へのFallbackまで含めて本番移行を設計する。'],
  ['Decision Architecture','誰が、何を、いつ決めるかを明確にし、曖昧な案件を進められる判断構造へ変える。'],
  ['Automation Reliability','自動化を「動く」から「任せられる」へ。監視、異常検知、再実行、データ鮮度を設計する。'],
  ['DX / Operating Model','ツール導入を目的化せず、業務フロー、データ正本、責任、現場定着まで再設計する。'],
  ['Sales Operations','架電、アポ、音声、KPI、Knowledgeを一続きの営業判断へ接続する。'],
];

const facts=[
  ['18 years','製造・業務改善・システム導入・データ活用'],
  ['54 sites','監視基盤の運用設計'],
  ['11 months','連続稼働'],
  ['100K+ / month','定常処理規模'],
];

export default function AboutPage(){
  return <main className="entity-page">
    <nav className="entity-nav"><Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link><span>ENTITY PROFILE / CANONICAL</span></nav>
    <section className="entity-shell">
      <header className="entity-hero"><span>ABOUT / PRIMARY SOURCE</span><h1>複雑な案件を、<br/><em>進められる構造へ。</em></h1>
        <p>rancorderは、製造業・営業支援・AI/DXの経験を横断し、曖昧なPoCやDX案件を本番で使い続けられる運用へ移行するTechnical PMです。</p></header>

      <section className="entity-facts"><header><span>QUICK FACTS</span><b>VERIFIABLE SIGNALS</b></header><div>{facts.map(x=><article key={x[0]}><strong>{x[0]}</strong><p>{x[1]}</p></article>)}</div></section>

      <section className="entity-section"><div className="entity-section-head"><span>01</span><h2>何を解くのか</h2></div>
        <p className="entity-lead">対象はAI、営業、DXでも、共通して扱うのは「工程の詰まり」「責任の曖昧さ」「判断の遅延」「本番運用の不確実性」です。</p>
        <div className="entity-capabilities">{capabilities.map((x,i)=><article key={x[0]}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{x[0]}</h3><p>{x[1]}</p></div></article>)}</div>
      </section>

      <section className="entity-section"><div className="entity-section-head"><span>02</span><h2>なぜこの判断ができるのか</h2></div>
        <div className="entity-origin">
          <article><small>2008 — 2026</small><h3>Manufacturing / Operational Improvement</h3><p>製造現場と経営の双方に関わり、工程分解、ボトルネック特定、業務改善、システム導入、業務設計、データ活用を経験。</p></article>
          <article><small>PARALLEL</small><h3>Sales Operations / Management</h3><p>複数案件を横断してKPI、架電、商談状況を分析。リスト評価、改善施策、営業Knowledgeの構築まで担当。</p></article>
          <article><small>2026 — PRESENT</small><h3>AI / DX Project Management</h3><p>顧客課題整理、要件定義、PoC設計、開発推進、本番移行、ステークホルダー調整を担当。</p></article>
        </div>
      </section>

      <section className="entity-section"><div className="entity-section-head"><span>03</span><h2>代表Decision Records</h2></div>
        <div className="entity-links">
          <Link href="/cases/54-site-monitoring"><b>54サイト監視基盤</b><span>11か月連続稼働 / 月10万件超処理 →</span></Link>
          <Link href="/cases/ai-production-delivery"><b>AI機能の本番導入</b><span>PoCからProductionへの境界設計 →</span></Link>
          <Link href="/cases/1400-line-quality-rebuild"><b>1,400行の品質再建</b><span>30テスト追加による保証境界の再構築 →</span></Link>
          <Link href="/cases/sales-support-poc-operations"><b>営業支援PoCの運用化</b><span>取得から営業判断までを一つの運用へ →</span></Link>
        </div>
      </section>

      <section className="entity-footer"><div><span>EXPLORE THE EVIDENCE GRAPH</span><p>専門性 → Claim → Case → Evidenceを辿れます。</p></div><Link href="/expertise">OPEN EXPERTISE GRAPH →</Link></section>

      <footer className="entity-footer"><div><span>NEED A STRUCTURED DIAGNOSIS?</span><p>案件の詰まりを7問で構造化します。</p></div><Link href="/survival-test">RUN SURVIVAL TEST →</Link></footer>
    </section>
  </main>;
}
