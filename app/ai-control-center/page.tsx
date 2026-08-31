import type { Metadata } from 'next';
import Link from 'next/link';
import { getAiDevTelemetry } from '@/lib/ai-dev-telemetry';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'AI Development Control Center | rancorder.dev',
  description: 'Public DevOps telemetry for the rancorder.dev AI implementation, review, and self-healing pipeline.',
};

export const revalidate = 300;

const value = (input: number | null, suffix = '') => input === null ? 'N/A' : `${input}${suffix}`;
const dateLabel = (input: string) => new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Tokyo',
}).format(new Date(input));

export default async function AiControlCenterPage() {
  const data = await getAiDevTelemetry();
  const statusTone = data.systemStatus === 'OPERATIONAL' ? styles.good : data.available ? styles.warn : styles.muted;
  const stats = [
    ['TOTAL AI PRs', String(data.totalAiPrs), 'ai/* branches'],
    ['REVIEW PASS', value(data.reviewPassRate, '%'), `${data.reviewedPrs} reviewed missions`],
    ['SELF-HEAL RUNS', String(data.selfHealAttempts), `${data.selfHealSuccesses} successful missions`],
    ['HEAL SUCCESS', value(data.selfHealSuccessRate, '%'), 'successful repair → final PASS'],
    ['AVG REPAIR', value(data.averageRepairAttempts), 'attempts / repaired mission'],
    ['API COST', data.apiCost, 'no reliable public source'],
  ];

  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>RANCORDER<span>.DEV</span></Link>
        <span>DEVOPS TELEMETRY // PUBLIC</span>
      </nav>

      <section className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>AI DEVELOPMENT CONTROL CENTER / LIVE</p>
            <h1>BUILD. REVIEW.<br /><span>SELF-HEAL.</span></h1>
            <p className={styles.lead}>Gemini実装Agent、独立Review Gate、Self-Healing PR Loopの公開運用ログを、GitHub上のPR・コメント・Actions結果だけから集計しています。</p>
          </div>
          <aside className={styles.systemCard}>
            <span>CURRENT SYSTEM STATUS</span>
            <strong className={statusTone}><i />{data.systemStatus}</strong>
            <small>REFRESH / 5 MIN · JST {dateLabel(data.generatedAt)}</small>
          </aside>
        </header>

        {!data.available && <p className={styles.alert}>LIVE DATA LINK OFFLINE — GitHub telemetry could not be loaded. No cached value is presented as current.</p>}

        <section className={styles.stats} aria-label="AI development metrics">
          {stats.map(([label, metric, note], index) => (
            <article key={label}>
              <span>0{index + 1} / {label}</span>
              <strong>{metric}</strong>
              <small>{note}</small>
            </article>
          ))}
        </section>

        <div className={styles.columns}>
          <section className={styles.panel}>
            <header><span>LATEST MISSIONS</span><b>{data.missions.length.toString().padStart(2, '0')} LOGS</b></header>
            <div className={styles.missions}>
              {data.missions.map((mission) => (
                <a href={mission.url} target="_blank" rel="noreferrer" key={mission.number}>
                  <span className={styles.missionId}>MISSION #{mission.number}</span>
                  <div><strong>{mission.title}</strong><small>{dateLabel(mission.updatedAt)} · {mission.branch}</small></div>
                  <div className={styles.outcome}>
                    <b data-state={mission.review}>{mission.review}</b>
                    <small>{mission.repairAttempts ? `SELF-HEAL ${mission.repairAttempts}/2` : mission.state}</small>
                  </div>
                </a>
              ))}
              {!data.missions.length && <p className={styles.empty}>NO PUBLIC MISSION DATA</p>}
            </div>
          </section>

          <section className={styles.panel}>
            <header><span>GATE FAILURE BREAKDOWN</span><b>LAST 100 RUNS</b></header>
            <div className={styles.failures}>
              {data.gateFailures.map((gate) => {
                const max = Math.max(...data.gateFailures.map((item) => item.failures), 1);
                return <div key={gate.name}>
                  <span>{gate.name}</span><strong>{gate.failures}</strong>
                  <i><b style={{ width: `${(gate.failures / max) * 100}%` }} /></i>
                </div>;
              })}
            </div>
            <p className={styles.method}>Failure counts are raw completed GitHub Actions runs on AI branches. Smoke tests, re-runs, and post-repair runs remain visible; they are not rewritten into success.</p>
          </section>
        </div>

        <section className={styles.boundary}>
          <span>TELEMETRY BOUNDARY</span>
          <p>この画面はDevOps運用情報です。Career Graph / Authority Evidenceとは独立しており、秘密情報、Gemini API key、推定コスト、非公開ログは取得・表示しません。</p>
          <a href="https://github.com/rancorder/rancorder.dev/actions" target="_blank" rel="noreferrer">OPEN SOURCE LOGS ↗</a>
        </section>
      </section>
    </main>
  );
}
