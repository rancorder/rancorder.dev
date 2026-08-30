export const SITE_URL='https://rancorder.dev';
export const PERSON_ID=`${SITE_URL}/#person`;
export const WEBSITE_ID=`${SITE_URL}/#website`;

export const canonicalExpertiseStatement={
  en:'Technical Project Manager specializing in moving AI and automation initiatives from PoC to reliable production systems, with expertise in decision architecture, operational reliability, responsibility boundaries, and manufacturing B2B DX.',
  ja:'AI・自動化の取り組みをPoCから信頼できる本番システムへ移行し、判断設計、運用信頼性、責任境界、製造業B2B DXを専門とするTechnical Project Manager。',
} as const;

export type Evidence={
 id:string; claim:string; value:string; sourceType:'first_party_case_record'|'public_repository';
 publiclyVerifiable:boolean; sourceUrl:string; scope:string;
};
export type Expertise={
 id:string; slug:string; name:string; statement:string; claim:string; decisionPattern:string;
 caseSlugs:string[]; evidenceIds:string[]; knowledgeQueries:string[];
};
export type Experience={
 id:string; period:string; domain:string; capability:string; decisionPattern:string; expertiseIds:string[];
};

export const evidence:Evidence[]=[
 {id:'evidence:54-sites',claim:'54 external sites operated on one monitoring surface',value:'54 sites',sourceType:'first_party_case_record',publiclyVerifiable:false,sourceUrl:'/cases/54-site-monitoring',scope:'monitoring architecture'},
 {id:'evidence:11-months',claim:'Continuous operation period',value:'11 months',sourceType:'first_party_case_record',publiclyVerifiable:false,sourceUrl:'/cases/54-site-monitoring',scope:'operational reliability'},
 {id:'evidence:100k-month',claim:'Recurring processing scale',value:'100K+ / month',sourceType:'first_party_case_record',publiclyVerifiable:false,sourceUrl:'/cases/54-site-monitoring',scope:'automation operations'},
 {id:'evidence:zero-stops',claim:'Business stops caused by system failure',value:'0 system stops',sourceType:'first_party_case_record',publiclyVerifiable:false,sourceUrl:'/cases/54-site-monitoring',scope:'observed operating period'},
 {id:'evidence:ai-production',claim:'Whisper/BERT-family functions connected from PoC to production delivery',value:'2 model families',sourceType:'first_party_case_record',publiclyVerifiable:false,sourceUrl:'/cases/ai-production-delivery',scope:'AI production delivery'},
 {id:'evidence:quality-tests',claim:'Tests added to previously under-tested legacy logic',value:'30 tests / 1,400 lines',sourceType:'first_party_case_record',publiclyVerifiable:false,sourceUrl:'/cases/1400-line-quality-rebuild',scope:'quality boundary rebuild'},
 {id:'evidence:sales-ops',claim:'Accounts handled by recurring sales-support data operations',value:'38 accounts / 1H cadence',sourceType:'first_party_case_record',publiclyVerifiable:false,sourceUrl:'/cases/sales-support-poc-operations',scope:'sales operations PoC'},
];

export const expertise:Expertise[]=[
 {id:'expertise:ai-production',slug:'ai-production-delivery',name:'AI Production Delivery',statement:'AIの精度だけでなく、失敗条件・責任境界・Fallback・変更再現性を設計してPoCを本番運用へ移す。',claim:'PoCを「動くデモ」から、失敗時にも運用可能なProductionへ移行できる。',decisionPattern:'Failure condition → Responsibility boundary → Gate → Human fallback → Trace',caseSlugs:['ai-production-delivery'],evidenceIds:['evidence:ai-production'],knowledgeQueries:['PoC','Production','AI']},
 {id:'expertise:automation-reliability',slug:'automation-reliability',name:'Automation Reliability',statement:'正常終了ではなく結果完全性まで観測し、異常時だけ人へ判断を返す自動化を設計する。',claim:'複数ソースの自動化を、監視・異常検知・復旧まで含む運用へ変えられる。',decisionPattern:'Failure mode → Observe → Detect → Recover → Human decision',caseSlugs:['54-site-monitoring','sales-support-poc-operations'],evidenceIds:['evidence:54-sites','evidence:11-months','evidence:100k-month','evidence:zero-stops','evidence:sales-ops'],knowledgeQueries:['監視','自動化','Reliability']},
 {id:'expertise:decision-architecture',slug:'decision-architecture',name:'Decision Architecture',statement:'誰が・何を・いつ決めるかを明確にし、曖昧な案件を進められる判断構造へ変える。',claim:'実装前に失敗条件と判断境界を置き、変更・停止・復旧を意思決定可能にする。',decisionPattern:'Situation → Constraint → Hidden risk → Decision → Reason → Result',caseSlugs:['54-site-monitoring','ai-production-delivery','1400-line-quality-rebuild','sales-support-poc-operations'],evidenceIds:['evidence:zero-stops','evidence:quality-tests'],knowledgeQueries:['Decision','判断','要件']},
 {id:'expertise:technical-pm',slug:'technical-project-management',name:'Technical Project Management',statement:'業務・技術・運用の境界を横断し、曖昧な要件を本番で使える構造へ変換する。',claim:'Business × Technology × Operationsを同じ意思決定面で扱う。',decisionPattern:'Business problem → Technical boundary → Operating model → Evidence',caseSlugs:['54-site-monitoring','ai-production-delivery','1400-line-quality-rebuild','sales-support-poc-operations'],evidenceIds:['evidence:54-sites','evidence:ai-production','evidence:quality-tests','evidence:sales-ops'],knowledgeQueries:['PM','Technical PM','要件定義']},
 {id:'expertise:manufacturing-dx',slug:'manufacturing-dx',name:'Manufacturing DX',statement:'製造現場で培った工程分解と業務改善を、DX・AI導入の業務設計へ接続する。',claim:'ツール導入ではなく、工程・データ・責任・現場定着を一体で捉える。',decisionPattern:'Process decomposition → Bottleneck → Ownership → System → Adoption',caseSlugs:['ai-production-delivery'],evidenceIds:['evidence:ai-production'],knowledgeQueries:['製造','DX','業務改善']},
 {id:'expertise:sales-operations',slug:'sales-operations',name:'Sales Operations',statement:'架電・アポ・音声・KPIを分断せず、取得から営業判断までを一つの運用へ接続する。',claim:'営業支援PoCを「取得できる」から「営業判断に使い続けられる」へ移行する。',decisionPattern:'Collect → Detect → Analyze → Deliver → Improve',caseSlugs:['sales-support-poc-operations'],evidenceIds:['evidence:sales-ops'],knowledgeQueries:['営業','KPI','Sales']},
];

export const experiences:Experience[]=[
 {id:'experience:manufacturing',period:'2008–2026',domain:'Manufacturing / Operational Improvement',capability:'Process Decomposition',decisionPattern:'工程を分解し、ボトルネックを特定して再現可能な仕組みに変える。',expertiseIds:['expertise:manufacturing-dx','expertise:technical-pm']},
 {id:'experience:sales',period:'Parallel',domain:'Sales Operations / Management',capability:'Signal → Decision',decisionPattern:'活動データをKPI・判断・改善へ接続する。',expertiseIds:['expertise:sales-operations','expertise:decision-architecture']},
 {id:'experience:ai-dx',period:'2026–Present',domain:'AI / DX Project Management',capability:'Production Boundary',decisionPattern:'PoCの成功条件だけでなく、失敗・責任・監視・復旧境界を設計する。',expertiseIds:['expertise:ai-production','expertise:automation-reliability','expertise:decision-architecture','expertise:technical-pm']},
];

export const identity={
 id:PERSON_ID,name:'rancorder',role:'Technical Project Manager',
 canonicalStatement:canonicalExpertiseStatement,
 sameAs:['https://github.com/rancorder'],
};

export function evidenceForExpertise(id:string){const x=expertise.find(e=>e.id===id);return evidence.filter(e=>x?.evidenceIds.includes(e.id));}
