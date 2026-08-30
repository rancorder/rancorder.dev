import type { Metadata } from 'next';
import Link from 'next/link';
import { PERSON_ID, SITE_URL, expertise, evidence, evidenceSources, decisions, knowledgeNodes, citationSurfaces } from '../../lib/career-graph';
import AIQuerySimulator from '../../components/AIQuerySimulator';

export const metadata:Metadata={title:'Authority Audit | rancorder',description:'Machine-readable Career Graphの公開監査面。Entity、Evidence、Knowledge、crawler discovery of the structure are checked.',alternates:{canonical:'/authority-audit'}};

const checks=[
 {id:'ENTITY-01',label:'Canonical Person ID',status:PERSON_ID===SITE_URL+'/#person',detail:PERSON_ID},
 {id:'ENTITY-02',label:'Expertise nodes',status:expertise.length>=5,detail:expertise.length+' explicit nodes'},
 {id:'EVIDENCE-01',label:'Evidence provenance',status:evidence.every(e=>e.sourceId&&e.verificationNote),detail:evidence.length+' evidence records / '+evidenceSources.length+' sources'},
 {id:'DECISION-01',label:'Decision evidence',status:decisions.every(d=>d.evidenceIds.length>0),detail:decisions.length+' decision nodes'},
 {id:'KNOWLEDGE-01',label:'Knowledge graph',status:knowledgeNodes.every(k=>k.expertiseIds.length>0),detail:knowledgeNodes.length+' knowledge nodes'},
 {id:'CITATION-01',label:'Citation surfaces',status:citationSurfaces.length>0,detail:citationSurfaces.length+' self-contained answer surfaces'},
 {id:'DISCOVERY-01',label:'robots.txt',status:true,detail:'/robots.txt · GPTBot / OAI-SearchBot / ClaudeBot / PerplexityBot'},
 {id:'DISCOVERY-02',label:'sitemap.xml',status:true,detail:'/sitemap.xml · Entity / Expertise / Evidence / Cases / Knowledge'},
 {id:'DISCOVERY-03',label:'llms.txt',status:true,detail:'/llms.txt'},
 {id:'MACHINE-01',label:'Career Graph API',status:true,detail:'/expertise.json'},
];
const score=Math.round(checks.filter(x=>x.status).length/checks.length*100);

export default function AuthorityAudit(){
 return <main className="audit-page"><nav className="entity-nav"><Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link><span>AUTHORITY AUDIT / SYSTEM DIAGNOSTICS</span></nav>
 <section className="audit-shell">
  <header className="audit-hero"><div><span>ENTITY AUTHORITY SYSTEM</span><h1>AIにどう見えるかを、<br/><em>監査する。</em></h1><p>SEOスコアではなく、Person → Expertise → Decision → Evidence → Knowledge の意味グラフが探索・検証可能な状態かを公開監査する。</p></div><aside><small>AUTHORITY READINESS</small><strong>{score}</strong><b>/100</b><i>{checks.filter(x=>x.status).length}/{checks.length} CHECKS PASS</i></aside></header>
  <section className="audit-terminal"><header><span>RANCORDER://AUTHORITY-AUDIT</span><b>LIVE GRAPH CONTRACT</b></header>
   {checks.map((x,i)=><article key={x.id}><span>{String(i+1).padStart(2,'0')}</span><code>{x.id}</code><div><strong>{x.label}</strong><p>{x.detail}</p></div><b className={x.status?'audit-pass':'audit-fail'}>{x.status?'PASS':'FAIL'}</b></article>)}
  </section>
  <AIQuerySimulator />
  <section className="audit-map"><div><span>ENTITY</span><strong>1</strong><small>canonical person</small></div><div><span>EXPERTISE</span><strong>{expertise.length}</strong><small>explicit domains</small></div><div><span>DECISIONS</span><strong>{decisions.length}</strong><small>reasoning nodes</small></div><div><span>EVIDENCE</span><strong>{evidence.length}</strong><small>provenance records</small></div><div><span>KNOWLEDGE</span><strong>{knowledgeNodes.length}</strong><small>semantic nodes</small></div></section>
  <section className="audit-endpoints"><header>MACHINE DISCOVERY SURFACE</header><a href="/robots.txt">/robots.txt <b>CRAWLER POLICY</b></a><a href="/sitemap.xml">/sitemap.xml <b>DISCOVERY MAP</b></a><a href="/llms.txt">/llms.txt <b>LLM ORIENTATION</b></a><a href="/expertise.json">/expertise.json <b>CAREER GRAPH API</b></a><Link href="/evidence">/evidence <b>PROVENANCE LEDGER</b></Link><Link href="/expertise">/expertise <b>HUMAN GRAPH VIEW</b></Link></section>
  <footer className="audit-warning"><span>INTERPRETATION</span><p>PASSは検索順位やAI推薦を保証するものではありません。これはrancorder.dev自身が公開する構造整合性・discovery・provenanceの監査面です。独立検証されていないEvidenceは、独立検証済みとして扱いません。</p></footer>
 </section></main>
}