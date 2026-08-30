import { NextResponse } from 'next/server';
import { identity, expertise, evidence, evidenceSources, experiences, decisions, knowledgeNodes, citationSurfaces, PERSON_ID, SITE_URL } from '../../lib/career-graph';
import { caseStudies } from '../../lib/case-studies';

export const dynamic='force-static';

export function GET(){
 const payload={
  schemaVersion:'1.0',
  generatedFrom:'rancorder.dev Career Graph',
  canonical:SITE_URL+'/expertise.json',
  person:identity,
  graph:{
   expertise:expertise.map(x=>({...x,
    cases:x.caseSlugs.map(slug=>SITE_URL+'/cases/'+slug),
    evidence:x.evidenceIds,
    knowledge:knowledgeNodes.filter(k=>k.expertiseIds.includes(x.id)).map(k=>SITE_URL+'/blog/'+k.slug),
   })),
   experience:experiences,
   decisions:decisions.map(d=>({...d,caseUrl:SITE_URL+'/cases/'+d.caseSlug,evidence:d.evidenceIds})),
   knowledge:knowledgeNodes.map(k=>({...k,url:SITE_URL+'/blog/'+k.slug})),
   citations:citationSurfaces,
   cases:caseStudies.map(c=>({id:'case:'+c.slug,url:SITE_URL+'/cases/'+c.slug,title:c.title,decision:c.decision,result:c.result,principle:c.principle})),
   evidenceSources,
   evidence,
  },
  semantics:{
   person:PERSON_ID,
   relationModel:'Person → Experience → Expertise → Claim → Decision → Case → Evidence → Knowledge',
   note:'Custom Career Graph representation. Not a Schema.org ranking signal.',
  },
 };
 return NextResponse.json(payload,{headers:{'Cache-Control':'public, max-age=3600, s-maxage=86400'}});
}
