import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies, getCaseStudy } from '../../../lib/case-studies';

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = getCaseStudy(params.slug);
  if (!item) return {};
  return {
    title: `${item.title} | Decision Record | rancorder`,
    description: item.subtitle,
    alternates: { canonical: `/cases/${item.slug}` },
    openGraph: {
      title: `${item.title} | Decision Record`,
      description: item.subtitle,
      url: `https://rancorder.dev/cases/${item.slug}`,
      type: 'article',
    },
  };
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const item = getCaseStudy(params.slug);
  if (!item) notFound();

  return (
    <main className="case-study-page">
      <div className="mission-grid" aria-hidden="true" />
      <nav className="case-nav">
        <Link href="/" className="mc-brand">RANCORDER<span>.DEV</span></Link>
        <span>DECISION RECORD / {item.id}</span>
      </nav>

      <article className="case-study-shell">
        <header className="case-study-hero">
          <div className="case-study-meta">
            <span>{item.id}</span>
            <b className={`status-pill ${item.tone}`}>{item.status}</b>
          </div>
          <h1>{item.title}</h1>
          <p>{item.subtitle}</p>

          <div className="case-metrics">
            {item.metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </header>

        <section className="decision-sequence">
          <div className="decision-step">
            <span>01</span><div><small>CHAOS</small><h2>混乱していた状態</h2></div>
            <ul>{item.chaos.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="decision-step danger">
            <span>02</span><div><small>HIDDEN RISK</small><h2>見逃されていたリスク</h2></div>
            <ul>{item.hiddenRisk.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="decision-step focus">
            <span>03</span><div><small>DECISION</small><h2>下した判断</h2></div>
            <ul>{item.decision.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </section>

        <section className="case-architecture">
          <div className="mc-section-tag">04 / OPERATING STRUCTURE</div>
          <h2>実装より先に、<br/><span>運用構造を決める。</span></h2>
          <div className="architecture-flow">
            {item.architecture.map((x, index) => (
              <div className="architecture-node" key={x.label}>
                <small>{x.label}</small>
                <b>{x.value}</b>
                {index < item.architecture.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
        </section>

        <section className="case-result">
          <div>
            <div className="mc-section-tag">05 / VERIFIED RESULT</div>
            <h2>結果</h2>
          </div>
          <ul>{item.result.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>

        <blockquote className="case-principle">
          <span>OPERATING PRINCIPLE</span>
          <p>{item.principle}</p>
        </blockquote>

        <footer className="case-study-footer">
          <Link href="/#cases">← ALL DECISION RECORDS</Link>
          <Link href="/survival-test">RUN PoC SURVIVAL TEST →</Link>
        </footer>
      </article>
    </main>
  );
}
