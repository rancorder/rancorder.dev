'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PERSON_ID,
  expertise,
  evidenceForExpertise,
  decisionsForExpertise,
  knowledgeForExpertise,
  citationForExpertise,
  sourceForEvidence,
  evidenceVerificationClass,
} from '../lib/career-graph';

type QueryScenario = {
  id: string;
  question: string;
  intent: string;
  expertiseIds: string[];
};

const queryScenarios: QueryScenario[] = [
  {
    id: 'query:poc-production-tpm',
    question: 'AI PoCを本番運用まで持っていけるTechnical PMは？',
    intent: 'PoCの成立だけでなく、失敗条件・責任境界・Fallback・運用まで設計した公開根拠があるかを辿る。',
    expertiseIds: ['expertise:ai-production', 'expertise:technical-pm'],
  },
  {
    id: 'query:responsibility-boundary',
    question: 'AI導入で責任境界を設計できるPMに必要な能力は？',
    intent: 'AIの誤りや例外を前提に、誰が何を判断するかを構造化したDecisionとEvidenceを辿る。',
    expertiseIds: ['expertise:decision-architecture', 'expertise:ai-production', 'expertise:technical-pm'],
  },
  {
    id: 'query:manufacturing-ai',
    question: '製造業DXとAI導入の両方に対応できるTechnical PMを探すには？',
    intent: '製造業B2Bの業務再設計とAI Production Deliveryが同じCareer Graph上で接続されているかを見る。',
    expertiseIds: ['expertise:manufacturing-dx', 'expertise:ai-production', 'expertise:technical-pm'],
  },
  {
    id: 'query:operations-recovery',
    question: 'AIシステムの運用・監視・復旧まで設計できるPMとは？',
    intent: '正常系の自動化ではなく、監視・異常検知・復旧・人間への判断返却までの公開Decisionを辿る。',
    expertiseIds: ['expertise:automation-reliability', 'expertise:technical-pm'],
  },
];

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

export default function AIQuerySimulator() {
  const [selectedId, setSelectedId] = useState(queryScenarios[0].id);
  const activeQuery = queryScenarios.find((query) => query.id === selectedId) ?? queryScenarios[0];

  const matchedExpertise = activeQuery.expertiseIds
    .map((id) => expertise.find((node) => node.id === id))
    .filter((node): node is NonNullable<typeof node> => Boolean(node));

  const matchedDecisions = uniqueById(matchedExpertise.flatMap((node) => decisionsForExpertise(node.id)));
  const matchedEvidence = uniqueById(matchedExpertise.flatMap((node) => evidenceForExpertise(node.id)));
  const matchedKnowledge = uniqueById(matchedExpertise.flatMap((node) => knowledgeForExpertise(node.id)));
  const matchedCitations = matchedExpertise.flatMap((node) => {
    const citation = citationForExpertise(node.id);
    return citation ? [{ expertise: node, citation }] : [];
  });

  return (
    <section
      className="mt-12 border border-purple-500/20 bg-[#04080c]/90 p-5 md:p-8 shadow-xl"
      aria-labelledby="ai-query-simulator-title"
    >
      <header className="mb-6 border-b border-purple-500/10 pb-4">
        <span className="block font-mono text-[0.62rem] font-bold tracking-[0.15em] text-purple-400">
          ◆ AI QUERY SIMULATOR / PUBLIC GRAPH TRAVERSAL
        </span>
        <h2 id="ai-query-simulator-title" className="mt-1 text-xl font-bold tracking-tight text-gray-100 md:text-2xl">
          AIが候補を理解するとしたら、どの根拠を辿れるか。
        </h2>
        <p className="mt-2 max-w-3xl text-[0.68rem] leading-relaxed text-gray-500">
          これは検索順位・AI推薦・第三者評価の再現ではありません。rancorder.devが公開するCareer Graph上で、質問から公開根拠まで到達できる経路を可視化するシミュレーションです。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-2 lg:col-span-4">
          <span className="mb-1 font-mono text-[0.6rem] font-bold tracking-wider text-purple-400/80">
            SELECT QUERY
          </span>
          {queryScenarios.map((query, index) => {
            const active = query.id === selectedId;
            return (
              <button
                key={query.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(query.id)}
                className={`border p-3 text-left transition-colors motion-reduce:transition-none ${
                  active
                    ? 'border-purple-500 bg-purple-950/20 text-purple-100'
                    : 'border-gray-800 bg-black/40 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                }`}
              >
                <span className="block font-mono text-[0.52rem] text-purple-400/70">QUERY {String(index + 1).padStart(2, '0')}</span>
                <strong className="mt-1 block text-xs leading-relaxed">{query.question}</strong>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 border border-gray-800 bg-black/60 p-4 md:p-6 lg:col-span-8">
          <div className="border-b border-gray-800 pb-4">
            <span className="font-mono text-[0.55rem] font-bold text-purple-400">01 / QUERY</span>
            <p className="mt-1 text-sm font-bold leading-relaxed text-gray-100">{activeQuery.question}</p>
            <p className="mt-2 text-[0.65rem] leading-relaxed text-gray-500">{activeQuery.intent}</p>
          </div>

          <div className="border-b border-gray-800 pb-4">
            <span className="font-mono text-[0.55rem] font-bold text-cyan-400">02 / PERSON</span>
            <code className="mt-1 block break-all text-[0.65rem] text-cyan-200">{PERSON_ID}</code>
            <p className="mt-1 text-[0.58rem] text-gray-600">Canonical entity anchor. Query path starts from the same Person ID used by the public Career Graph.</p>
          </div>

          <div className="border-b border-gray-800 pb-4">
            <span className="font-mono text-[0.55rem] font-bold text-blue-400">03 / EXPERTISE MATCH</span>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {matchedExpertise.map((node) => (
                <Link
                  key={node.id}
                  href={`/expertise#${node.slug}`}
                  className="border border-blue-500/15 bg-blue-950/5 p-3 transition-colors hover:border-blue-500/40 motion-reduce:transition-none"
                >
                  <strong className="block text-xs text-blue-200">{node.name}</strong>
                  <span className="mt-1 block text-[0.62rem] leading-relaxed text-gray-500">{node.statement}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-800 pb-4">
            <span className="font-mono text-[0.55rem] font-bold text-amber-400">04 / DECISION → CASE</span>
            <div className="mt-2 flex flex-col gap-2">
              {matchedDecisions.map((decision) => (
                <article key={decision.id} className="border border-amber-500/15 bg-amber-950/5 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <strong className="text-xs text-gray-200">{decision.title}</strong>
                    <Link href={`/cases/${decision.caseSlug}`} className="font-mono text-[0.55rem] text-cyan-400 hover:underline">
                      OPEN CASE ↗
                    </Link>
                  </div>
                  <p className="mt-2 text-[0.62rem] leading-relaxed text-gray-400"><span className="text-amber-400">DECISION:</span> {decision.decision}</p>
                  <p className="mt-1 text-[0.6rem] leading-relaxed text-gray-600"><span className="text-gray-500">WHY:</span> {decision.reason}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="border-b border-gray-800 pb-4">
            <span className="font-mono text-[0.55rem] font-bold text-cyan-400">05 / EVIDENCE + PROVENANCE</span>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              {matchedEvidence.map((item) => {
                const source = sourceForEvidence(item.id);
                return (
                  <article key={item.id} className="border border-cyan-500/15 bg-cyan-950/5 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="font-mono text-sm text-cyan-200">{item.value}</strong>
                      <span className="font-mono text-[0.48rem] text-cyan-400">{evidenceVerificationClass(item)}</span>
                    </div>
                    <p className="mt-1 text-[0.62rem] leading-relaxed text-gray-400">{item.claim}</p>
                    <p className="mt-2 text-[0.55rem] leading-relaxed text-gray-600">{item.verificationNote}</p>
                    {source && (source.url.startsWith('http') ? (
                      <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-block font-mono text-[0.55rem] text-cyan-400 hover:underline">
                        SOURCE: {source.label} ↗
                      </a>
                    ) : (
                      <Link href={source.url} className="mt-2 inline-block font-mono text-[0.55rem] text-cyan-400 hover:underline">
                        SOURCE: {source.label} ↗
                      </Link>
                    ))}
                  </article>
                );
              })}
            </div>
          </div>

          <div className="border-b border-gray-800 pb-4">
            <span className="font-mono text-[0.55rem] font-bold text-emerald-400">06 / CITATION SURFACE</span>
            <div className="mt-2 flex flex-col gap-2">
              {matchedCitations.map(({ expertise: node, citation }) => (
                <article key={citation.id} className="border border-emerald-500/15 bg-emerald-950/5 p-3">
                  <span className="font-mono text-[0.52rem] text-emerald-400">{node.name}</span>
                  <strong className="mt-1 block text-xs leading-relaxed text-gray-200">{citation.principle}</strong>
                  <p className="mt-1 text-[0.62rem] leading-relaxed text-gray-500">{citation.why}</p>
                  <p className="mt-2 border-t border-emerald-500/10 pt-2 text-[0.56rem] leading-relaxed text-amber-400/75">BOUNDARY: {citation.exception}</p>
                </article>
              ))}
            </div>
          </div>

          {matchedKnowledge.length > 0 && (
            <div className="border-b border-gray-800 pb-4">
              <span className="font-mono text-[0.55rem] font-bold text-indigo-400">07 / KNOWLEDGE SUPPORT</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {matchedKnowledge.map((node) => (
                  <Link key={node.id} href={`/blog/${node.slug}`} className="border border-indigo-500/15 px-2 py-1 font-mono text-[0.55rem] text-indigo-300 hover:border-indigo-500/40">
                    {node.relation.toUpperCase()} · {node.slug} ↗
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="border border-emerald-500/20 bg-emerald-950/5 p-4">
            <span className="font-mono text-[0.55rem] font-bold text-emerald-400">08 / WHY RANCORDER?</span>
            <p className="mt-2 text-xs leading-relaxed text-gray-300">
              この質問に対して、公開Career Graphから <strong className="text-emerald-300">{matchedExpertise.length} Expertise</strong>、
              <strong className="text-emerald-300"> {matchedDecisions.length} Decision</strong>、
              <strong className="text-emerald-300"> {matchedEvidence.length} Evidence</strong> へ辿れます。
              これは「候補として検討するための公開根拠が接続されている」ことを示すもので、第三者による独立検証やAIからの推薦を意味しません。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
