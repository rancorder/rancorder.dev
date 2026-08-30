import Script from 'next/script';
import { SITE_URL, PERSON_ID, WEBSITE_ID, identity, expertise } from '../lib/career-graph';

const graph={
  '@context':'https://schema.org',
  '@graph':[
    {
      '@type':'WebSite','@id':WEBSITE_ID,url:SITE_URL,name:'rancorder.dev',inLanguage:'ja-JP',
      description:'製造業B2B、営業支援、DX領域で、PoCを本番運用へ移すTechnical PMのポートフォリオ。',
      publisher:{'@id':PERSON_ID},
    },
    {
      '@type':'ProfilePage','@id':SITE_URL+'/about#profile-page',url:SITE_URL+'/about',
      name:'rancorder | Technical PM / AI・DX Delivery',isPartOf:{'@id':WEBSITE_ID},mainEntity:{'@id':PERSON_ID},
    },
    {
      '@type':'Person','@id':PERSON_ID,name:identity.name,url:SITE_URL+'/about',sameAs:identity.sameAs,
      jobTitle:identity.role,description:identity.canonicalStatement.ja,
      knowsAbout:expertise.map(x=>x.name),
      hasOccupation:{'@type':'Occupation',name:identity.role,skills:expertise.map(x=>x.name).join(', ')},
    },
    {
      '@type':'ItemList','@id':SITE_URL+'/#case-studies',name:'Decision Records / Case Studies',
      itemListElement:[
        { '@type':'ListItem', position:1, url:SITE_URL+'/cases/54-site-monitoring', name:'54サイト監視基盤' },
        { '@type':'ListItem', position:2, url:SITE_URL+'/cases/ai-production-delivery', name:'AI機能の本番導入' },
        { '@type':'ListItem', position:3, url:SITE_URL+'/cases/1400-line-quality-rebuild', name:'1,400行の品質再建' },
        { '@type':'ListItem', position:4, url:SITE_URL+'/cases/sales-support-poc-operations', name:'営業支援PoCの運用化' },
      ],
    },
  ],
};

export default function GeoStructuredData(){
  return <Script id="geo-knowledge-graph" type="application/ld+json" strategy="beforeInteractive"
    dangerouslySetInnerHTML={{__html:JSON.stringify(graph)}} />;
}
