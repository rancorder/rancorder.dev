import type { Metadata } from 'next';
import Link from 'next/link';
import { expertise, evidenceForExpertise, decisionsForExpertise, knowledgeForExpertise, citationForExpertise, sourceForEvidence, evidenceVerificationClass, canonicalExpertiseStatement } from '../../lib/career-graph';
import { getCaseStudy } from '../../lib/case-studies';
import { getAllBlogPosts } from '../../lib/blog';

export const metadata:Metadata={
 title:'Expertise & Evidence | rancorder Technical PM',
 description:canonicalExpertiseStatement.ja,
 alternates:{canonical:'/expertise'},
};

export default function ExpertisePage(){
 const posts=getAllBlogPosts();
 return <main className="expertise-page">
  <nav className="entity-nav"><Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link><span>CAREER GRAPH / HUMAN VIEW</span></nav>
  <section className="expertise-shell">
   <header className="expertise-hero"><span>MACHINE-READABLE CAREER GRAPH</span><h1>専門性を、<br/><em>根拠まで辿れる形に。</em></h1><p>{canonicalExpertiseStatement.ja}</p>
    <div><Link href="/about">PERSON ENTITY →</Link><a href="/expertise.json">EXPERTISE.JSON →</a><Link href="/evidence">EVIDENCE LEDGER →</Link></div></header>
   <section className="expertise-map-head"><span>PERSON</span><i>→</i><span>EXPERTISE</span><i>→</i><span>CLAIM</span><i>→</i><span>CASE</span><i>→</i><span>EVIDENCE</span></section>
   <div className="expertise-nodes">
    {expertise.map((x,index)=>{
      const ev=evidenceForExpertise(x.id);
      const decisions=decisionsForExpertise(x.id);
      const cases=x.caseSlugs.map(getCaseStudy).filter(Boolean);
      const citation=citationForExpertise(x.id);
      const explicitKnowledge=knowledgeForExpertise(x.id);
      const knowledge=explicitKnowledge.map(node=>posts.find(p=>p.slug===node.slug)).filter(Boolean).slice(0,4);
      return <article id={x.slug} key={x.id} className="expertise-node">
       <header><span>NODE {String(index+1).padStart(2,'0')}</span><div><small>EXPERTISE</small><h2>{x.name}</h2></div><b>{ev.length} EVIDENCE</b></header>
       <div className="expertise-claim"><small>CLAIM</small><p>{x.claim}</p></div>
       <div className="expertise-pattern"><small>DECISION PATTERN</small><code>{x.decisionPattern}</code></div>
       {citation&&<section className="citation-surface">
         <header><span>AI CITATION SURFACE</span><b>SELF-CONTAINED ANSWER</b></header>
         <div><small>PRINCIPLE</small><p>{citation.principle}</p></div>
         <div><small>WHY</small><p>{citation.why}</p></div>
         <div><small>EVIDENCE</small><p>{citation.evidenceIds.map(id=>ev.find(e=>e.id===id)?.value).filter(Boolean).join(' / ')}</p></div>
         <div><small>EXCEPTION</small><p>{citation.exception}</p></div>
       </section>}
       <div className="expertise-decisions"><span>DECISION NODES</span>{decisions.map(d=><Link href={'/cases/'+d.caseSlug+'#decision-node'} key={d.id}><small>{d.id.replace('decision:','DECISION / ')}</small><b>{d.title}</b><p>{d.reason}</p></Link>)}</div>
       <div className="expertise-proof-grid">
        <section><span>CASES / PROOF</span>{cases.map(c=>c&&<Link href={'/cases/'+c.slug} key={c.slug}><b>{c.title}</b><small>{c.principle} →</small></Link>)}</section>
        <section><span>EVIDENCE / PROVENANCE</span>{ev.map(e=>{const source=sourceForEvidence(e.id);return <div key={e.id} className="evidence-provenance-item"><strong>{e.value}</strong><p>{e.claim}</p><small>{evidenceVerificationClass(e)}</small>{source&&<a href={source.url} target={source.url.startsWith('http')?'_blank':undefined} rel={source.url.startsWith('http')?'noreferrer':undefined}>{source.label} ↗</a>}<em>{e.verificationNote}</em></div>})}</section>
        <section><span>KNOWLEDGE</span>{knowledge.length?knowledge.map(p=><Link href={'/blog/'+p.slug} key={p.slug}><b>{p.title}</b><small>{p.date} →</small></Link>):<p className="expertise-empty">Knowledge node is being indexed.</p>}</section>
       </div>
      </article>;
    })}
   </div>
  </section>
 </main>;
}
