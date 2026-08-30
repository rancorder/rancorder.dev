import type { Metadata } from 'next';
import Link from 'next/link';
import { evidence, evidenceSources, evidenceVerificationClass, expertise, decisions, SITE_URL } from '../../lib/career-graph';

export const metadata:Metadata={
  title:'Evidence Provenance | rancorder',
  description:'rancorder.dev上の主要実績について、主張・出典・公開可否・独立検証可否を分離して示すEvidence Provenance Graph。',
  alternates:{canonical:'/evidence'},
};

export default function EvidencePage(){
  return <main className="evidence-page">
    <nav className="entity-nav"><Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link><span>EVIDENCE PROVENANCE / PUBLIC LEDGER</span></nav>
    <section className="evidence-shell">
      <header className="evidence-hero"><span>AUTHORITY ≠ CLAIM</span><h1>証拠の強さまで、<br/><em>公開する。</em></h1>
        <p>ここでは「公開されている主張」と「第三者が独立検証した事実」を分けて扱います。rancorder.devの実績は、出典と検証レベルを明示してMachine-readable Career Graphへ接続しています。</p>
        <div><Link href="/expertise">← EXPERTISE GRAPH</Link><a href="/expertise.json">MACHINE VIEW →</a></div>
      </header>

      <section className="evidence-legend">
        <div><b>PUBLIC FIRST-PARTY</b><p>本人運営サイトや公開Repositoryで確認できる自己記述。公開性はあるが独立検証ではない。</p></div>
        <div><b>INDEPENDENTLY VERIFIED</b><p>第三者・外部一次資料等で独立確認できる証拠。現時点では該当Evidenceなし。</p></div>
      </section>

      <section className="evidence-ledger">
        <header><span>EVIDENCE LEDGER</span><b>{evidence.length} RECORDS</b></header>
        {evidence.map((e,index)=>{
          const source=evidenceSources.find(s=>s.id===e.sourceId);
          const linkedExpertise=expertise.filter(x=>x.evidenceIds.includes(e.id));
          const linkedDecisions=decisions.filter(d=>d.evidenceIds.includes(e.id));
          return <article key={e.id}>
            <div className="evidence-index"><span>{String(index+1).padStart(2,'0')}</span><b>{evidenceVerificationClass(e)}</b></div>
            <div className="evidence-value"><strong>{e.value}</strong><p>{e.claim}</p><small>{e.scope}</small></div>
            <div className="evidence-source"><span>SOURCE</span>{source&&<a href={source.url}>{source.label} ↗</a>}<p>{source?.description}</p></div>
            <div className="evidence-verification"><span>VERIFICATION</span><p>{e.verificationNote}</p><div><b>PUBLIC</b><i>{e.publicAccessible?'YES':'NO'}</i><b>INDEPENDENT</b><i>{e.independentlyVerified?'YES':'NO'}</i></div></div>
            <footer><span>SUPPORTS</span>{linkedExpertise.map(x=><Link key={x.id} href={'/expertise#'+x.slug}>{x.name}</Link>)}{linkedDecisions.map(d=><Link key={d.id} href={'/cases/'+d.caseSlug+'#decision-node'}>{d.title}</Link>)}</footer>
          </article>
        })}
      </section>

      <footer className="evidence-machine-note"><span>MACHINE CONTRACT</span><p>Canonical graph endpoint: <code>{SITE_URL}/expertise.json</code>. Evidence source independence and public accessibility are explicit fields, not inferred rankings.</p></footer>
    </section>
  </main>;
}
