'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  expertise,
  evidence,
  evidenceSources,
  decisions,
  knowledgeNodes,
  citationSurfaces,
  evidenceForExpertise,
  decisionsForExpertise,
  knowledgeForExpertise,
  citationForExpertise,
  sourceForEvidence,
  evidenceVerificationClass,
} from '../lib/career-graph';

// Simulated typical AI queries mapped to expertise domains
const simulatedQueries = [
  {
    id: 'query:ai-production',
    expertiseId: 'expertise:ai-production',
    question: 'AIのPoCを本番移行する際の責任境界や失敗への備え（フォールバック）はどう設計すべきか？',
    aiIntent: 'AIモデル不確実性に対する、本番用のセーフティ境界とエラー時ハンドリングが実証されているかを検証する。',
  },
  {
    id: 'query:automation-reliability',
    expertiseId: 'expertise:automation-reliability',
    question: '複数ソースからデータを収集・処理する大規模な自動化運用において、監視や異常検知、人の判断への切り戻しはどうあるべきか？',
    aiIntent: '単なる正常系スクリプトではなく、結果整合性の検証、エラー時の検知・通知、および手動・自動復旧境界の設計が機能しているかを評価する。',
  },
  {
    id: 'query:decision-architecture',
    expertiseId: 'expertise:decision-architecture',
    question: '要件や責任範囲が極めて曖昧なプロジェクトにおいて、手戻りを防ぎ意思決定を迅速に進めるための判断境界はどう設計するか？',
    aiIntent: '実装前の段階で、意思決定の遅延を回避するための「誰が・何を・いつ決めるか」の明確な判断構造と受け入れ境界が担保されているかを監査する。',
  },
  {
    id: 'query:technical-pm',
    expertiseId: 'expertise:technical-pm',
    question: 'ビジネス・技術・運用の3つの境界を横断し、現場で本当に使えるソリューションへ落とし込むためのPMの役割とは？',
    aiIntent: '技術的な実装詳細にとどまらず、ビジネス課題と日々の運用モデルを同一の意思決定面に乗せて推進できる職能と実績を検証する。',
  },
  {
    id: 'query:manufacturing-dx',
    expertiseId: 'expertise:manufacturing-dx',
    question: '製造業の複雑な現場プロセスや二重入力問題を解決し、現場に定着するようなシステム・AIを導入するためのDX設計手法は？',
    aiIntent: 'ツールの導入自体を目的とせず、既存工程のボトルネック、データ責任、現場運用まで一体化した再設計と定着化のアプローチを実証する。',
  },
  {
    id: 'query:sales-operations',
    expertiseId: 'expertise:sales-operations',
    question: '営業支援PoCなどのデータ収集を、単なる「動くデモ」に終わらせず、持続可能な「営業の意思決定を支える運用」へ育てるには？',
    aiIntent: '架電結果、音声、アポイント、KPIなどのデータ収集から、摩擦のない配布、分析、そして次のアクション判断まで繋がっているかを監査する。',
  },
];

export default function AIQuerySimulator() {
  const [selectedId, setSelectedId] = useState(simulatedQueries[0].id);

  const activeQuery = simulatedQueries.find((q) => q.id === selectedId) || simulatedQueries[0];
  const activeExpertise = expertise.find((e) => e.id === activeQuery.expertiseId);

  if (!activeExpertise) return null;

  // Resolve related nodes using Career Graph Single Source of Truth helper functions
  const activeCitation = citationForExpertise(activeExpertise.id);
  const activeDecisions = decisionsForExpertise(activeExpertise.id);
  const activeEvidence = evidenceForExpertise(activeExpertise.id);
  const activeKnowledge = knowledgeForExpertise(activeExpertise.id);

  return (
    <section className="mt-12 border border-purple-500/20 bg-[#04080c]/90 p-5 md:p-8 rounded-none shadow-xl" aria-label="AI Query Simulator">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 border-b border-purple-500/10 pb-4">
        <div>
          <span className="text-purple-400 font-mono text-[0.62rem] font-bold tracking-[0.15em] block uppercase">
            ◆ AI INTERACTIVE QUERY SIMULATOR
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-gray-100 tracking-tight mt-1">
            AI Query Authority Path
          </h2>
        </div>
        <p className="text-[0.65rem] text-gray-500 font-mono max-md:mt-1">
          [TARGET: EXPLICIT SEMANTIC EVIDENCE AND REASONING TRAVERSAL]
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: AI queries selector */}
        <div className="lg:col-span-5 flex flex-col gap-2">
          <div className="text-[0.62rem] font-bold font-mono text-purple-400/80 mb-1 tracking-wider">
            ▼ SELECT AN AI INTENT QUERY:
          </div>
          <div className="flex flex-col gap-2">
            {simulatedQueries.map((query) => {
              const isActive = query.id === selectedId;
              const matchesExpertise = expertise.find((e) => e.id === query.expertiseId);
              return (
                <button
                  key={query.id}
                  onClick={() => setSelectedId(query.id)}
                  className={`text-left p-3 border transition-colors ${
                    isActive
                      ? 'bg-purple-950/20 border-purple-500 text-purple-200'
                      : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300'
                  }`}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[0.55rem] tracking-wider text-purple-400/70 font-semibold">
                      {matchesExpertise?.name.toUpperCase()}
                    </span>
                    {isActive && (
                      <span className="font-mono text-[0.55rem] text-purple-400 bg-purple-500/10 px-1 border border-purple-500/30">
                        ACTIVE AUDIT
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-relaxed line-clamp-2 md:line-clamp-none">
                    {query.question}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Generated Provenance Path */}
        <div className="lg:col-span-7 border border-gray-800 bg-black/60 p-4 md:p-6 flex flex-col gap-6 relative">
          <div className="absolute top-3 right-3 text-[0.55rem] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 uppercase tracking-widest">
            TRAVERSABLE PATH SECURE
          </div>

          {/* Path Header */}
          <div className="border-b border-gray-800 pb-3">
            <span className="font-mono text-[0.55rem] text-gray-500 block">SIMULATION SECTOR</span>
            <strong className="text-sm font-bold text-gray-200 block mt-0.5">
              WHY RANCORDER: {activeExpertise.name} Verification
            </strong>
          </div>

          {/* STEP 1: The query and analytical intent */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="w-5 h-5 rounded-none bg-purple-950 border border-purple-500 text-purple-300 text-[0.55rem] font-mono font-bold flex items-center justify-center shrink-0">
                01
              </span>
              <div className="w-[1px] h-full bg-purple-500/20 mt-1" />
            </div>
            <div className="flex-1 pb-4">
              <span className="font-mono text-[0.55rem] text-purple-400 font-bold block uppercase tracking-wider">
                AI INPUT QUERY & INTENT
              </span>
              <p className="text-xs font-bold text-gray-300 mt-1 leading-relaxed bg-purple-950/10 border border-purple-500/10 p-2 font-mono">
                &quot;{activeQuery.question}&quot;
              </p>
              <div className="mt-2 text-[0.62rem] text-gray-400 flex items-start gap-1">
                <span className="text-purple-400 shrink-0 font-mono">⚡ Intent:</span>
                <span>{activeQuery.aiIntent}</span>
              </div>
            </div>
          </div>

          {/* STEP 2: Semantic Alignment */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="w-5 h-5 rounded-none bg-blue-950 border border-blue-500 text-blue-300 text-[0.55rem] font-mono font-bold flex items-center justify-center shrink-0">
                02
              </span>
              <div className="w-[1px] h-full bg-blue-500/20 mt-1" />
            </div>
            <div className="flex-1 pb-4">
              <span className="font-mono text-[0.55rem] text-blue-400 font-bold block uppercase tracking-wider">
                SEMANTIC ALIGNMENT (CAREER GRAPH)
              </span>
              <div className="mt-1 border border-blue-500/10 bg-blue-950/5 p-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[0.62rem] text-blue-400 font-semibold">[EXPERTISE NODE]</span>
                  <strong className="text-xs font-bold text-gray-200">{activeExpertise.name}</strong>
                </div>
                <p className="text-[0.68rem] text-gray-300 mt-1.5 leading-relaxed">{activeExpertise.statement}</p>
                <div className="mt-2 pt-2 border-t border-blue-500/10 grid grid-cols-1 md:grid-cols-2 gap-2 text-[0.62rem]">
                  <div>
                    <span className="text-gray-500 block font-mono">CLAIM:</span>
                    <span className="text-gray-300 font-medium">{activeExpertise.claim}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block font-mono">DECISION PATTERN:</span>
                    <span className="text-blue-300 font-mono font-semibold">{activeExpertise.decisionPattern}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3: Citation Surface (Principle) */}
          {activeCitation && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-none bg-emerald-950 border border-emerald-500 text-emerald-300 text-[0.55rem] font-mono font-bold flex items-center justify-center shrink-0">
                  03
                </span>
                <div className="w-[1px] h-full bg-emerald-500/20 mt-1" />
              </div>
              <div className="flex-1 pb-4">
                <span className="font-mono text-[0.55rem] text-emerald-400 font-bold block uppercase tracking-wider">
                  CONCEPTUAL AUTHORITY (CITATION SURFACE)
                </span>
                <div className="mt-1 border border-emerald-500/10 bg-emerald-950/5 p-3">
                  <div>
                    <span className="text-emerald-400 text-[0.58rem] font-mono font-semibold block">[PRINCIPLE]</span>
                    <p className="text-xs font-bold text-gray-200 leading-relaxed mt-0.5">{activeCitation.principle}</p>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-500 text-[0.58rem] font-mono block">REASONING (WHY):</span>
                    <p className="text-[0.65rem] text-gray-400 leading-relaxed mt-0.5">{activeCitation.why}</p>
                  </div>
                  {activeCitation.exception && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/10 bg-black/40 p-1.5">
                      <span className="text-amber-500/80 text-[0.55rem] font-mono block">◇ EXCEPTION / BOUNDARY:</span>
                      <p className="text-[0.62rem] text-gray-500 leading-relaxed mt-0.5 italic">{activeCitation.exception}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Real-world Decisions / Reasoning */}
          {activeDecisions.length > 0 && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-none bg-amber-950 border border-amber-500 text-amber-300 text-[0.55rem] font-mono font-bold flex items-center justify-center shrink-0">
                  04
                </span>
                <div className="w-[1px] h-full bg-amber-500/20 mt-1" />
              </div>
              <div className="flex-1 pb-4">
                <span className="font-mono text-[0.55rem] text-amber-400 font-bold block uppercase tracking-wider">
                  REASONING NODES (DECISIONS & CASE LAUNCH)
                </span>
                <div className="flex flex-col gap-3 mt-1.5">
                  {activeDecisions.map((decision) => (
                    <div key={decision.id} className="border border-gray-800 bg-black/50 p-3 text-[0.65rem] relative">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="text-amber-400 font-mono font-semibold">[DECISION RECORD]</span>
                        <Link
                          href={`/cases/${decision.caseSlug}`}
                          className="text-[0.55rem] text-cyan-400 hover:underline flex items-center gap-0.5 border border-cyan-400/20 px-1 py-0.5 font-mono"
                        >
                          OPEN CASE RECORD ↗
                        </Link>
                      </div>
                      <strong className="text-xs font-bold text-gray-200 block mb-2">{decision.title}</strong>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 text-gray-400 leading-relaxed">
                        <div>
                          <span className="text-gray-500 font-mono block">SITUATION:</span>
                          <span className="text-gray-300">{decision.situation}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 font-mono block">CONSTRAINT:</span>
                          <span className="text-gray-300">{decision.constraint}</span>
                        </div>
                        <div className="md:col-span-2 border-t border-gray-900/50 pt-1.5">
                          <span className="text-red-400/80 font-mono block">HIDDEN RISK:</span>
                          <span className="text-gray-300">{decision.risk}</span>
                        </div>
                        <div className="md:col-span-2 border-t border-gray-900/50 pt-1.5 bg-amber-500/5 p-1">
                          <span className="text-amber-400 font-mono block">DECISION & REASON:</span>
                          <span className="text-gray-200 font-semibold">{decision.decision}</span>
                          <p className="text-gray-400 mt-1 italic">&quot;{decision.reason}&quot;</p>
                        </div>
                        <div className="md:col-span-2 border-t border-gray-900/50 pt-1.5">
                          <span className="text-emerald-400/80 font-mono block">RESULT:</span>
                          <span className="text-gray-300 font-medium">{decision.result}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Verifiable Evidence */}
          {activeEvidence.length > 0 && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-none bg-cyan-950 border border-cyan-500 text-cyan-300 text-[0.55rem] font-mono font-bold flex items-center justify-center shrink-0">
                  05
                </span>
                <div className="w-[1px] h-full bg-cyan-500/20 mt-1" />
              </div>
              <div className="flex-1 pb-4">
                <span className="font-mono text-[0.55rem] text-cyan-400 font-bold block uppercase tracking-wider">
                  VERIFIABLE PROOF (EVIDENCE PROVENANCE)
                </span>
                <div className="flex flex-col gap-2 mt-1.5">
                  {activeEvidence.map((ev) => {
                    const source = sourceForEvidence(ev.id);
                    const verificationClass = evidenceVerificationClass(ev);
                    return (
                      <div key={ev.id} className="border border-cyan-950/40 bg-[#020508] p-2.5 text-[0.62rem] leading-relaxed">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                          <div className="flex items-center gap-1">
                            <span className="text-cyan-400 font-mono font-bold">[EVIDENCE RECORD]</span>
                            <span className="text-gray-600 font-mono text-[0.5rem]">{ev.id}</span>
                          </div>
                          <span className="text-[0.5rem] font-mono text-cyan-400 bg-cyan-500/10 px-1 border border-cyan-500/20">
                            {verificationClass}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-200">
                          {ev.claim} (<strong className="text-cyan-300 font-mono">{ev.value}</strong>)
                        </p>
                        
                        {source && (
                          <div className="mt-1.5 pt-1 border-t border-cyan-950/20 text-gray-500">
                            <span className="font-mono text-[0.55rem]">PROVENANCE SOURCE:</span>{' '}
                            <Link href={source.url} className="text-cyan-400 hover:underline">
                              {source.label}
                            </Link>
                            <p className="text-[0.55rem] mt-0.5 text-gray-600 italic leading-snug">{source.description}</p>
                          </div>
                        )}
                        <p className="text-[0.55rem] text-gray-600 mt-1 bg-black/40 p-1 font-mono">
                          <span className="text-cyan-400/70 font-semibold">Verification Note:</span> {ev.verificationNote}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Published Knowledge Nodes */}
          {activeKnowledge.length > 0 && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="w-5 h-5 rounded-none bg-indigo-950 border border-indigo-500 text-indigo-300 text-[0.55rem] font-mono font-bold flex items-center justify-center shrink-0">
                  06
                </span>
                <div className="w-[1px] h-full bg-indigo-500/20 mt-1" />
              </div>
              <div className="flex-1 pb-4">
                <span className="font-mono text-[0.55rem] text-indigo-400 font-bold block uppercase tracking-wider">
                  SEMANTIC KNOWLEDGE CORRELATIONS (BLOG READINGS)
                </span>
                <div className="flex flex-col gap-2 mt-1.5">
                  {activeKnowledge.map((k) => (
                    <Link
                      key={k.id}
                      href={`/blog/${k.slug}`}
                      className="group flex items-start gap-2 border border-indigo-950/30 bg-[#020306] hover:bg-[#05070f] hover:border-indigo-500/30 transition-colors p-2 text-[0.62rem]"
                    >
                      <span className="text-indigo-400 font-mono font-semibold shrink-0">[{k.relation.toUpperCase()}]</span>
                      <div className="flex-1">
                        <span className="text-gray-300 group-hover:text-indigo-200 leading-snug font-medium block">
                          {k.principle}
                        </span>
                        <span className="text-[0.5rem] font-mono text-gray-500 mt-0.5 block group-hover:text-gray-400">
                          Route: /blog/{k.slug} ↗
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Resolution Synthesis / WHY RANCORDER */}
          <div className="flex gap-3 border-t border-gray-800 pt-5">
            <span className="w-5 h-5 rounded-none bg-emerald-500 text-black text-[0.55rem] font-mono font-bold flex items-center justify-center shrink-0">
              OK
            </span>
            <div className="flex-1">
              <span className="font-mono text-[0.55rem] text-emerald-400 font-bold block uppercase tracking-wider">
                RESOLUTION / WHY RANCORDER
              </span>
              <div className="mt-1.5 p-3 border border-emerald-500/20 bg-emerald-950/5 text-xs text-gray-300 leading-relaxed font-mono">
                <p>
                  AI Agent validation is resolved successfully. Query authority on{' '}
                  <strong className="text-emerald-300">{activeExpertise.name}</strong> is grounded in:
                </p>
                <ul className="list-disc pl-4 mt-1.5 text-gray-400 space-y-1 text-[0.65rem]">
                  <li>
                    <strong className="text-emerald-300 font-normal">{activeDecisions.length} core business decision records</strong> detailing situation, constraints, risks, and reasoning.
                  </li>
                  <li>
                    <strong className="text-emerald-300 font-normal">{activeEvidence.length} direct, public provenance evidence logs</strong> verified as canonical.
                  </li>
                  <li>
                    <strong className="text-emerald-300 font-normal">{activeKnowledge.length} published structured research guides</strong> indexed directly inside machine-readable crawlers.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
