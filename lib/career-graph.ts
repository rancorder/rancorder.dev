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
export type DecisionNode={
 id:string; caseSlug:string; title:string; situation:string; constraint:string; risk:string;
 decision:string; reason:string; result:string; principle:string; expertiseIds:string[]; evidenceIds:string[];
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

export const decisions:DecisionNode[]=[
 {id:'decision:failure-mode-monitoring',caseSlug:'54-site-monitoring',title:'監視対象をサイトではなく失敗モードで定義する',situation:'複数サイトの状態確認が人の巡回と経験に依存していた。',constraint:'監視対象が増えるほど、人が見る画面と切り分け作業も増える。',risk:'正常終了でも期待データが取れていない状態を見逃し、復旧が担当者の記憶に依存する。',decision:'処理成功・データ取得・更新鮮度を別シグナルにし、復旧を自動・手動・要判断へ分離した。',reason:'人が常時監視するのではなく、異常時だけ判断を返す構造にするため。',result:'54サイトを単一運用面へ集約し、11か月連続稼働・月10万件超処理・システム障害による業務停止0件。',principle:'監視とは画面を見ることではなく、異常時だけ人間へ判断を返す設計である。',expertiseIds:['expertise:automation-reliability','expertise:decision-architecture','expertise:technical-pm'],evidenceIds:['evidence:54-sites','evidence:11-months','evidence:100k-month','evidence:zero-stops']},
 {id:'decision:ai-failure-boundary',caseSlug:'ai-production-delivery',title:'AI精度より先に失敗条件と責任境界を定義する',situation:'PoCでは「動く・精度が出る」が主な評価軸だった。',constraint:'本番では誤判定・入力欠損・モデル変更・外部API不調を運用として扱う必要がある。',risk:'AIが失敗した際の人への切替条件が曖昧だと、判断と責任が担当者ごとに変わる。',decision:'失敗条件・責任境界・Fallback条件を定義し、AI結果を採用する条件と人へ戻す条件を分離した。',reason:'AIの誤りをゼロにするのではなく、誤ったときにも壊れないProduction Boundaryを作るため。',result:'Whisper系・BERT系機能をPoC外へ持ち出し、本番導入へ接続した。',principle:'AI本番化の本質は精度改善ではない。間違えたときに壊れない境界設計である。',expertiseIds:['expertise:ai-production','expertise:decision-architecture','expertise:technical-pm','expertise:manufacturing-dx'],evidenceIds:['evidence:ai-production']},
 {id:'decision:risk-based-test-boundary',caseSlug:'1400-line-quality-rebuild',title:'コード量ではなく障害影響度から保証境界を決める',situation:'約1,400行のロジックに変更を守るテストが不足していた。',constraint:'全面リファクタリングは既存挙動を変えるリスクが大きく、暗黙仕様も存在した。',risk:'低リスク領域からテストすると件数だけ増え、重要な失敗を防げない。',decision:'変更頻度・分岐・外部境界・障害影響度を基準に30テストを追加し、既存挙動を固定してから変更境界を広げた。',reason:'テスト数ではなく、壊れてはいけない領域を先に保証するため。',result:'未テスト1,400行に30テストを追加し、保証対象を明示しながら変更可能領域を段階的に拡張した。',principle:'品質改善はテストを書くことではない。壊れてはいけない境界を先に決めることである。',expertiseIds:['expertise:decision-architecture','expertise:technical-pm'],evidenceIds:['evidence:quality-tests']},
 {id:'decision:sales-completion-condition',caseSlug:'sales-support-poc-operations',title:'処理成功ではなく営業判断可能を完了条件にする',situation:'架電結果・アポ・音声・KPIが分散し、取得後も人の確認作業が連鎖していた。',constraint:'複数顧客では設定衝突・認証切替・保存先誤りが運用事故になり得る。',risk:'取得処理の成功だけでは、アポ取りこぼしや集計欠損を検知できない。',decision:'顧客設定を台帳化し、巡回・アポ検知・文字起こし・KPI集計・配布を一つの運用パイプラインとして扱った。',reason:'PoCの価値をデータ取得ではなく、営業判断までの摩擦削減で評価するため。',result:'複数顧客の定期巡回、新規アポ検知、文字起こし、顧客別KPIレポート、保存先振り分けを運用へ統合した。',principle:'営業支援PoCは、データ取得から意思決定までの摩擦を消して初めて運用になる。',expertiseIds:['expertise:sales-operations','expertise:automation-reliability','expertise:decision-architecture','expertise:technical-pm'],evidenceIds:['evidence:sales-ops']},
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

export function decisionsForExpertise(id:string){return decisions.filter(d=>d.expertiseIds.includes(id));}
export function decisionsForCase(slug:string){return decisions.filter(d=>d.caseSlug===slug);}

export type KnowledgeNode={
 id:string; slug:string; expertiseIds:string[]; caseSlugs:string[]; decisionIds:string[];
 principle:string; relation:'framework'|'principle'|'field-note';
};

export const knowledgeNodes:KnowledgeNode[]=[
 {id:'knowledge:poc-production-framework',slug:'2026-02-03-poc-to-production-framework',expertiseIds:['expertise:ai-production','expertise:technical-pm'],caseSlugs:['ai-production-delivery'],decisionIds:['decision:ai-failure-boundary'],principle:'PoCの成功とProduction Readinessは別の判定軸として設計する。',relation:'framework'},
 {id:'knowledge:responsibility-boundary',slug:'2026-02-12-poc-to-production-responsibility',expertiseIds:['expertise:ai-production','expertise:decision-architecture','expertise:technical-pm'],caseSlugs:['ai-production-delivery'],decisionIds:['decision:ai-failure-boundary'],principle:'本番移行では精度だけでなく、失敗時の責任主体と人への切替条件を先に決める。',relation:'principle'},
 {id:'knowledge:failure-definition',slug:'2026-02-13-failure-definition-production-design',expertiseIds:['expertise:ai-production','expertise:automation-reliability','expertise:decision-architecture'],caseSlugs:['ai-production-delivery','54-site-monitoring'],decisionIds:['decision:ai-failure-boundary','decision:failure-mode-monitoring'],principle:'成功条件だけでは運用できない。何を失敗と判定するかが監視と復旧を決める。',relation:'principle'},
 {id:'knowledge:poc-judgement',slug:'2026-02-13-poc-failure-pm-judgement-design',expertiseIds:['expertise:decision-architecture','expertise:technical-pm','expertise:ai-production'],caseSlugs:['ai-production-delivery'],decisionIds:['decision:ai-failure-boundary'],principle:'PMの価値は進捗管理ではなく、曖昧な状況に判断可能な境界を置くことにある。',relation:'principle'},
 {id:'knowledge:reliability-judgment',slug:'2026-02-02-reliability-judgment',expertiseIds:['expertise:automation-reliability','expertise:decision-architecture'],caseSlugs:['54-site-monitoring'],decisionIds:['decision:failure-mode-monitoring'],principle:'Reliabilityは止まらないことではなく、異常を識別し復旧判断へ接続できることで成立する。',relation:'principle'},
 {id:'knowledge:lock-decision',slug:'2026-02-06-lock-cannot-protect-decision',expertiseIds:['expertise:automation-reliability','expertise:decision-architecture'],caseSlugs:['54-site-monitoring','sales-support-poc-operations'],decisionIds:['decision:failure-mode-monitoring','decision:sales-completion-condition'],principle:'排他制御だけでは業務上の正しさを保証できない。処理結果の完全性を別に観測する。',relation:'field-note'},
 {id:'knowledge:web-automation',slug:'2024-01-20-web-automation',expertiseIds:['expertise:automation-reliability','expertise:technical-pm'],caseSlugs:['54-site-monitoring'],decisionIds:['decision:failure-mode-monitoring'],principle:'自動化は実行コードだけでなく、監視・再実行・運用境界まで含めて設計する。',relation:'field-note'},
 {id:'knowledge:automation-bestpractice',slug:'2026-01-20-blogautomation-bestpractice',expertiseIds:['expertise:automation-reliability'],caseSlugs:['54-site-monitoring'],decisionIds:['decision:failure-mode-monitoring'],principle:'定常自動化は成功時より失敗時の振る舞いを先に設計する。',relation:'framework'},
 {id:'knowledge:technical-pm-architecture',slug:'2026-01-30-technical-pm-architecture-review',expertiseIds:['expertise:technical-pm','expertise:decision-architecture'],caseSlugs:['1400-line-quality-rebuild','ai-production-delivery'],decisionIds:['decision:risk-based-test-boundary','decision:ai-failure-boundary'],principle:'Technical PMは実装詳細を知るだけでなく、変更がどの境界へ影響するかを判断する。',relation:'framework'},
 {id:'knowledge:trusted-pm-communication',slug:'2026-01-31-trusted-technical-pm-communication',expertiseIds:['expertise:technical-pm','expertise:decision-architecture'],caseSlugs:['ai-production-delivery'],decisionIds:['decision:ai-failure-boundary'],principle:'信頼されるPMコミュニケーションは、未確定事項と決定事項の境界を明示する。',relation:'principle'},
 {id:'knowledge:poc-expectation',slug:'2026-02-10-poc-expectation-verbalization',expertiseIds:['expertise:ai-production','expertise:decision-architecture','expertise:technical-pm'],caseSlugs:['ai-production-delivery'],decisionIds:['decision:ai-failure-boundary'],principle:'PoC開始前に期待を観測可能な言葉へ変換すると、本番移行判断が可能になる。',relation:'framework'},
];

export function knowledgeForExpertise(id:string){return knowledgeNodes.filter(k=>k.expertiseIds.includes(id));}
export function knowledgeForCase(slug:string){return knowledgeNodes.filter(k=>k.caseSlugs.includes(slug));}
export function knowledgeForPost(slug:string){return knowledgeNodes.find(k=>k.slug===slug);}

export type CitationSurface={
 id:string; expertiseId:string; principle:string; why:string; evidenceIds:string[]; exception:string;
};

export const citationSurfaces:CitationSurface[]=[
 {id:'citation:ai-production',expertiseId:'expertise:ai-production',principle:'AI本番化は、精度改善より先に失敗条件・責任境界・Fallbackを設計する。',why:'AIは誤りをゼロにできないため、採用条件と人へ戻す条件が曖昧だと、本番で責任と判断が揺れる。',evidenceIds:['evidence:ai-production'],exception:'低リスクな社内実験や、誤りが業務影響を持たない用途では、同じ厳密さの運用境界が不要な場合がある。'},
 {id:'citation:automation-reliability',expertiseId:'expertise:automation-reliability',principle:'自動化の信頼性は「止まらないこと」ではなく、異常を検知し、復旧または人間の判断へ戻せることで成立する。',why:'処理が正常終了しても、データ欠損や鮮度劣化が起きれば業務結果は誤るため、実行状態と結果完全性を分けて観測する必要がある。',evidenceIds:['evidence:54-sites','evidence:11-months','evidence:100k-month','evidence:zero-stops'],exception:'単発処理や、失敗時に即座に再実行でき業務影響が小さい処理では、監視・復旧設計を簡素化できる。'},
 {id:'citation:decision-architecture',expertiseId:'expertise:decision-architecture',principle:'曖昧な案件は、情報を増やすだけでは進まない。誰が・何を・どの条件で決めるかを設計すると前進する。',why:'未確定事項と責任境界が混ざった状態では、進捗があっても重要判断が先送りされ、後工程で手戻りになる。',evidenceIds:['evidence:zero-stops','evidence:quality-tests'],exception:'要求・責任・受入条件が既に明確な定型案件では、Decision Architectureの介入価値は小さい。'},
 {id:'citation:technical-pm',expertiseId:'expertise:technical-pm',principle:'Technical PMは、技術を説明する役ではなく、Business・Technology・Operationsを同じ意思決定面に載せる役割である。',why:'技術的に正しい実装でも、業務責任・運用条件・変更境界が未定義なら、本番では使い続けられない。',evidenceIds:['evidence:54-sites','evidence:ai-production','evidence:quality-tests','evidence:sales-ops'],exception:'仕様と運用が確立済みで、実装範囲だけが明確な案件では、専門エンジニアや実装ベンダーへ直接依頼する方が速い。'},
 {id:'citation:manufacturing-dx',expertiseId:'expertise:manufacturing-dx',principle:'製造業DXはツール導入ではなく、工程・データ・責任・現場定着を一体で再設計する。',why:'既存工程のボトルネックや責任分界を変えずにシステムだけ追加すると、二重入力やShadow Workflowが残りやすい。',evidenceIds:['evidence:ai-production'],exception:'既存業務が標準化済みで、単純な置換導入だけで目的を満たすケースでは、大規模な業務再設計は不要。'},
 {id:'citation:sales-operations',expertiseId:'expertise:sales-operations',principle:'営業支援PoCは、データ取得ではなく、取得→検知→分析→配布→判断までの摩擦を減らして初めて運用価値になる。',why:'取得成功だけを完了条件にすると、アポ取りこぼし・集計欠損・保存先誤りが営業判断の前段で残る。',evidenceIds:['evidence:sales-ops'],exception:'小規模で担当者が単一、データ量も少なく手動確認コストが無視できる場合は、自動化範囲を広げすぎない方がよい。'},
];

export function citationForExpertise(id:string){return citationSurfaces.find(c=>c.expertiseId===id);}
