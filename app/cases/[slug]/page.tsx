import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { caseStudies, getCaseStudy } from '../../../lib/case-studies';

const geoAnswers: Record<string,{
  question:string;
  answer:string;
  faq:{q:string;a:string}[];
}> = {
  '54-site-monitoring': {
    question:'複数サイトの監視運用を、人の巡回に依存させず安定化するにはどう設計するか？',
    answer:'サイト単位ではなく失敗モード単位で監視し、処理成功・データ取得・更新鮮度を分離して観測します。復旧を自動・手動・要判断へ分け、人が見るべき異常だけを残すことで、54サイトを単一の運用面へ集約しました。',
    faq:[
      {q:'54サイト監視基盤で最も重要だった設計判断は？',a:'監視対象をサイト単位ではなく「失敗モード」単位で設計したことです。処理成功、データ取得、更新鮮度を別シグナルとして扱いました。'},
      {q:'監視自動化で人間の役割はなくなるのか？',a:'なくしません。自動復旧できる異常、手動作業が必要な異常、判断が必要な異常へ分け、人間には判断が必要なケースだけを返します。'},
      {q:'この事例で確認できる結果は？',a:'54サイトを単一の運用面へ集約し、11か月連続稼働、月10万件超の処理、システム障害による業務停止0件を記録しています。'},
    ],
  },
  'ai-production-delivery': {
    question:'AIのPoCを本番運用へ移すとき、精度以外に何を設計すべきか？',
    answer:'失敗条件、責任境界、人へのFallback条件、変更再現性を先に設計します。AIは「正しいか」だけではなく、「間違えたときにどこで止め、誰へ戻し、どう再現するか」を運用条件として持つ必要があります。',
    faq:[
      {q:'AI本番化で精度より先に決めるべきことは？',a:'失敗条件、責任境界、Fallback条件です。精度が高くても、誤判定時の扱いが曖昧なら本番運用は安定しません。'},
      {q:'モデルやプロンプト変更はなぜ運用管理が必要？',a:'コード変更がなくても出力結果を変えるためです。モデル、プロンプト、主要設定を再現可能な変更単位として扱います。'},
      {q:'この事例で本番化したAI機能は？',a:'Whisper系・BERT系の機能をPoC外へ持ち出し、本番導入へ接続しました。'},
    ],
  },
  '1400-line-quality-rebuild': {
    question:'未テストの大きな既存コードを、全面改修せず安全に変更可能にするには？',
    answer:'コード量ではなく障害時の影響度から保証対象を決めます。変更頻度、分岐、外部境界を優先して既存挙動をテストで固定し、その後に安全な変更境界を段階的に広げます。',
    faq:[
      {q:'1,400行すべてを最初からテストしなかった理由は？',a:'テスト件数を増やすことより、壊れたときに影響が大きい境界を先に保証する方がリスク低減につながるためです。'},
      {q:'追加した30テストは何を基準に選んだ？',a:'変更頻度、重要な分岐、外部境界、障害時の影響度を基準に優先しました。'},
      {q:'この品質再建で何が変わった？',a:'未テスト1,400行に30テストを追加し、保証対象を明示しながら変更可能な領域を段階的に広げられる状態へ移行しました。'},
    ],
  },
  'sales-support-poc-operations': {
    question:'営業支援PoCを、データ取得だけで終わらせず営業判断へつなげるには？',
    answer:'架電結果・アポ・音声・KPIを別々の成果物として扱わず、取得→検知→分析→配布を一つの運用パイプラインにします。完了条件も「処理成功」ではなく「営業判断に必要な情報が揃ったか」に置きます。',
    faq:[
      {q:'営業支援PoCの運用化で最も危険な落とし穴は？',a:'データ取得処理が成功したことを、営業判断に必要な情報が揃ったことと同一視することです。アポ取りこぼしや集計欠損は別途検知する必要があります。'},
      {q:'複数顧客を同じ基盤で扱うために何を分離した？',a:'顧客ごとの設定を台帳化し、取得ロジックと顧客情報を分離しました。保存先や認証切替も運用上の境界として扱います。'},
      {q:'営業支援PoCの完了条件をどう変えた？',a:'「取得できる」から「営業判断に使い続けられる」へ変更し、巡回・アポ検知・文字起こし・KPI集計・配布までを一つの運用として設計しました。'},
    ],
  },
};

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = getCaseStudy(params.slug);
  if (!item) return {};
  const geo=geoAnswers[item.slug];
  return {
    title: `${item.title} | Decision Record | rancorder`,
    description: geo?.answer || item.subtitle,
    keywords: ['Technical PM','Decision Record',item.title,item.status,'PoC','本番運用'],
    alternates: { canonical: `/cases/${item.slug}` },
    openGraph: {
      title: `${item.title} | Decision Record`,
      description: geo?.answer || item.subtitle,
      url: `https://rancorder.dev/cases/${item.slug}`,
      type: 'article',
    },
  };
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const item = getCaseStudy(params.slug);
  if (!item) notFound();
  const geo=geoAnswers[item.slug];
  const canonical=`https://rancorder.dev/cases/${item.slug}`;

  const structuredData={
    '@context':'https://schema.org',
    '@graph':[
      {
        '@type':'Article',
        '@id':canonical+'#article',
        headline:item.title,
        description:geo?.answer||item.subtitle,
        url:canonical,
        mainEntityOfPage:canonical,
        inLanguage:'ja-JP',
        author:{'@id':'https://rancorder.dev/#person'},
        publisher:{'@id':'https://rancorder.dev/#person'},
        about:['Technical Project Management',item.status,'Production Readiness','Decision Architecture'],
        keywords:['Technical PM','PoC','Production Readiness',item.title].join(', '),
        hasPart:geo?.faq.map((x,i)=>({'@id':canonical+`#faq-${i+1}`}))||[],
      },
      geo&&{
        '@type':'FAQPage',
        '@id':canonical+'#faq',
        mainEntity:geo.faq.map((x,i)=>({
          '@type':'Question',
          '@id':canonical+`#faq-${i+1}`,
          name:x.q,
          acceptedAnswer:{'@type':'Answer',text:x.a},
        })),
      },
      {
        '@type':'BreadcrumbList',
        itemListElement:[
          {'@type':'ListItem',position:1,name:'rancorder.dev',item:'https://rancorder.dev'},
          {'@type':'ListItem',position:2,name:'Decision Records',item:'https://rancorder.dev/#cases'},
          {'@type':'ListItem',position:3,name:item.title,item:canonical},
        ],
      },
    ].filter(Boolean),
  };

  return (
    <main className="case-study-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />
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
            {item.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
          </div>
        </header>

        {geo&&<section className="case-answer-capsule">
          <header><span>DIRECT ANSWER / GEO CAPSULE</span><b>PRIMARY SOURCE</b></header>
          <h2>{geo.question}</h2>
          <p>{geo.answer}</p>
          <footer><span>SHORT ANSWER</span><strong>{item.principle}</strong></footer>
        </section>}

        <section className="decision-sequence">
          <div className="decision-step"><span>01</span><div><small>CHAOS</small><h2>混乱していた状態</h2></div><ul>{item.chaos.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="decision-step danger"><span>02</span><div><small>HIDDEN RISK</small><h2>見逃されていたリスク</h2></div><ul>{item.hiddenRisk.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="decision-step focus"><span>03</span><div><small>DECISION</small><h2>下した判断</h2></div><ul>{item.decision.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </section>

        <section className="case-architecture">
          <div className="mc-section-tag">04 / OPERATING STRUCTURE</div>
          <h2>実装より先に、<br/><span>運用構造を決める。</span></h2>
          <div className="architecture-flow">
            {item.architecture.map((x, index) => <div className="architecture-node" key={x.label}><small>{x.label}</small><b>{x.value}</b>{index < item.architecture.length - 1 && <i>→</i>}</div>)}
          </div>
        </section>

        <section className="case-result">
          <div><div className="mc-section-tag">05 / VERIFIED RESULT</div><h2>結果</h2></div>
          <ul>{item.result.map((x) => <li key={x}>{x}</li>)}</ul>
        </section>

        <blockquote className="case-principle"><span>OPERATING PRINCIPLE</span><p>{item.principle}</p></blockquote>

        {geo&&<section className="case-faq">
          <header><span>06 / QUERY ANSWERS</span><h2>このDecision Recordから答えられること。</h2><p>生成AI・検索・人間のいずれから読んでも、判断と根拠を短く回収できる形式にしています。</p></header>
          <div>{geo.faq.map((x,i)=><article key={x.q} id={`faq-${i+1}`}><span>Q{String(i+1).padStart(2,'0')}</span><div><h3>{x.q}</h3><p>{x.a}</p></div></article>)}</div>
        </section>}

        <footer className="case-study-footer">
          <Link href="/#cases">← ALL DECISION RECORDS</Link>
          <Link href="/about">PROFILE / CAPABILITIES</Link>
          <Link href="/survival-test">RUN PoC SURVIVAL TEST →</Link>
        </footer>
      </article>
    </main>
  );
}
