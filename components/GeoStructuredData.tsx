import Script from 'next/script';

const base='https://rancorder.dev';

const graph={
  '@context':'https://schema.org',
  '@graph':[
    {
      '@type':'WebSite',
      '@id':base+'/#website',
      url:base,
      name:'rancorder.dev',
      inLanguage:'ja-JP',
      description:'製造業B2B、営業支援、DX領域で、PoCを本番運用へ移行するTechnical PMのポートフォリオ。',
      publisher:{'@id':base+'/#profile'},
    },
    {
      '@type':'ProfilePage',
      '@id':base+'/#profile-page',
      url:base+'/about',
      name:'rancorder | Technical PM / AI・DX Delivery',
      isPartOf:{'@id':base+'/#website'},
      mainEntity:{'@id':base+'/#profile'},
    },
    {
      '@type':'Person',
      '@id':base+'/#profile',
      name:'rancorder',
      url:base+'/about',
      sameAs:['https://github.com/rancorder'],
      jobTitle:'Technical PM',
      description:'製造現場・営業支援・AI/DXの経験を横断し、曖昧な要件、責任境界、監視、復旧、現場定着を設計してPoCを本番運用へ移行するTechnical PM。',
      knowsAbout:[
        'Technical Project Management',
        'AI PoC',
        'AI Production Readiness',
        'Manufacturing DX',
        'Sales Operations',
        'Sales Support PoC',
        'Business Process Improvement',
        'Automation Reliability',
        'Observability',
        'Incident Recovery',
        'Decision Architecture',
        'DX Operating Model',
      ],
      hasOccupation:{
        '@type':'Occupation',
        name:'Technical Project Manager',
        skills:'要件定義、PoC設計、本番移行、運用設計、責任分界、監視、復旧、営業KPI分析、業務改善、AI/DX推進',
      },
    },
    {
      '@type':'ItemList',
      '@id':base+'/#case-studies',
      name:'Decision Records / Case Studies',
      itemListElement:[
        { '@type':'ListItem', position:1, url:base+'/cases/54-site-monitoring', name:'54サイト監視基盤' },
        { '@type':'ListItem', position:2, url:base+'/cases/ai-production-delivery', name:'AI機能の本番導入' },
        { '@type':'ListItem', position:3, url:base+'/cases/1400-line-quality-rebuild', name:'1,400行の品質再建' },
        { '@type':'ListItem', position:4, url:base+'/cases/sales-support-poc-operations', name:'営業支援PoCの運用化' },
      ],
    },
  ],
};

export default function GeoStructuredData(){
  return <Script id="geo-knowledge-graph" type="application/ld+json" strategy="beforeInteractive"
    dangerouslySetInnerHTML={{__html:JSON.stringify(graph)}} />;
}
