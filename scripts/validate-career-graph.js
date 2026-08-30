const fs=require('fs'),path=require('path');
const graph=fs.readFileSync(path.join(process.cwd(),'lib/career-graph.ts'),'utf8');
const cases=fs.readFileSync(path.join(process.cwd(),'lib/case-studies.ts'),'utf8');
const blogDir=path.join(process.cwd(),'content/blog');
const errors=[],warnings=[];
const ids=(prefix)=>new Set([...graph.matchAll(new RegExp("id:'("+prefix+":[^']+)'",'g'))].map(m=>m[1]));
const expertise=ids('expertise'), evidence=ids('evidence'), decisions=ids('decision'), knowledge=ids('knowledge'), experience=ids('experience'), sources=ids('source');
const caseSlugs=new Set([...cases.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]));
const blogSlugs=new Set(fs.existsSync(blogDir)?fs.readdirSync(blogDir).filter(x=>x.endsWith('.html')&&!x.startsWith('_')).map(x=>x.replace(/\.html$/,'')):[]);
function refs(re){return [...graph.matchAll(re)].flatMap(m=>m[1].split(',').map(x=>x.trim().replace(/^['"]|['"]$/g,'')).filter(Boolean))}
function check(label,refs,set){for(const x of refs)if(!set.has(x))errors.push(label+' references missing node: '+x)}
check('expertiseIds',refs(/expertiseIds:\[([^\]]*)\]/g),expertise);
for(const m of graph.matchAll(/expertiseId:'([^']+)'/g))if(!expertise.has(m[1]))errors.push('citation references missing expertise: '+m[1]);
check('evidenceIds',refs(/evidenceIds:\[([^\]]*)\]/g),evidence);
for(const m of graph.matchAll(/sourceId:'([^']+)'/g))if(!sources.has(m[1]))errors.push('Evidence references missing source: '+m[1]);
check('decisionIds',refs(/decisionIds:\[([^\]]*)\]/g),decisions);
check('caseSlugs',refs(/caseSlugs:\[([^\]]*)\]/g),caseSlugs);
for(const m of graph.matchAll(/caseSlug:'([^']+)'/g))if(!caseSlugs.has(m[1]))errors.push('Decision references missing case: '+m[1]);
for(const m of graph.matchAll(/slug:'([^']+)'[^\n]*expertiseIds:/g)){const slug=m[1];if(slug.match(/^\d{4}-/)&&!blogSlugs.has(slug))errors.push('Knowledge references missing article: '+slug)}
for(const e of expertise){if(!graph.includes("'"+e+"'"))warnings.push('Unreferenced expertise: '+e)}
for(const e of evidence){const n=(graph.match(new RegExp(e.replace(/[.*+?^$()|[\]\\]/g,'\\$&'),'g'))||[]).length;if(n<2)warnings.push('Orphan evidence: '+e)}
for(const d of decisions){const n=(graph.match(new RegExp(d.replace(/[.*+?^$()|[\]\\]/g,'\\$&'),'g'))||[]).length;if(n<2)warnings.push('Decision has no inbound semantic link: '+d)}
const duplicate=(set,label)=>{const arr=[...graph.matchAll(new RegExp("id:'("+label+":[^']+)'",'g'))].map(m=>m[1]);for(const x of new Set(arr))if(arr.filter(y=>y===x).length>1)errors.push('Duplicate id: '+x)};
['expertise','evidence','decision','knowledge','experience'].forEach(x=>duplicate(null,x));
if(!graph.includes("PERSON_ID=\`\${SITE_URL}/#person\`"))errors.push('Canonical Person ID changed or missing');
console.log('\nCAREER GRAPH INTEGRITY');
console.log('Expertise '+expertise.size+' | Decisions '+decisions.size+' | Evidence '+evidence.size+' | Knowledge '+knowledge.size+' | Cases '+caseSlugs.size+' | Articles '+blogSlugs.size);
warnings.forEach(x=>console.warn('WARN  '+x));
if(errors.length){errors.forEach(x=>console.error('ERROR '+x));console.error('\nFAILED: '+errors.length+' integrity error(s)');process.exit(1)}
console.log('PASS: graph references are internally consistent.\n');
