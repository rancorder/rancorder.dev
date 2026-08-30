import { NextResponse } from 'next/server';
import { identity, expertise, evidence, experiences, decisions, PERSON_ID, SITE_URL } from '../../lib/career-graph';
import { caseStudies } from '../../lib/case-studies';
import { getAllBlogPosts } from '../../lib/blog';

export const dynamic='force-static';

export function GET(){
 const posts=getAllBlogPosts();
 const payload={
  schemaVersion:'1.0',
  generatedFrom:'rancorder.dev Career Graph',
  canonical:SITE_URL+'/expertise.json',
  person:identity,
  graph:{
   expertise:expertise.map(x=>({...x,
    cases:x.caseSlugs.map(slug=>SITE_URL+'/cases/'+slug),
    evidence:x.evidenceIds,
    knowledge:posts.filter(p=>x.knowledgeQueries.some(q=>(p.title+' '+p.tags.join(' ')+' '+(p.excerpt||'')).toLowerCase().includes(q.toLowerCase()))).slice(0,12).map(p=>SITE_URL+'/blog/'+p.slug),
   })),
   experience:experiences,
   decisions:decisions.map(d=>({...d,caseUrl:SITE_URL+'/cases/'+d.caseSlug,evidence:d.evidenceIds})),
   cases:caseStudies.map(c=>({id:'case:'+c.slug,url:SITE_URL+'/cases/'+c.slug,title:c.title,decision:c.decision,result:c.result,principle:c.principle})),
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
