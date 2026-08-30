'use client';

type Sector = 'manufacturing' | 'sales';

export default function SurvivalCombatHUD({
  sector,
  score,
  riskCount,
  answered,
  total,
  alert,
  pulse,
}: {
  sector: Sector;
  score: number;
  riskCount: number;
  answered: number;
  total: number;
  alert: string;
  pulse: number;
}) {
  const danger = score < 65 || riskCount >= 3;
  const warning = !danger && (score < 85 || riskCount > 0);
  const status = danger ? 'CRITICAL' : warning ? 'UNSTABLE' : 'STABLE';
  const integrity = Math.max(8, score);

  return (
    <>
      <div className={`combat-overlay ${danger ? 'danger' : warning ? 'warning' : 'stable'}`} aria-hidden="true">
        <div className="combat-scanline" />
        <div className="combat-vignette" />
      </div>

      <aside className={`combat-hud ${danger ? 'danger' : warning ? 'warning' : 'stable'}`} aria-live="polite">
        <div className="combat-hud-top">
          <div>
            <small>{sector === 'sales' ? 'SALES OPS MISSION' : 'MFG AI MISSION'}</small>
            <b>MISSION INTEGRITY</b>
          </div>
          <span>{status}</span>
        </div>

        <div className="combat-integrity">
          <strong>{score}<em>%</em></strong>
          <div>
            <i style={{ width: `${integrity}%` }} />
          </div>
        </div>

        <div className="combat-stats">
          <div><small>RISK SIGNALS</small><b>{String(riskCount).padStart(2, '0')}</b></div>
          <div><small>SCAN</small><b>{answered}/{total}</b></div>
          <div><small>SECTOR</small><b>{sector === 'sales' ? 'OPS' : 'AI'}</b></div>
        </div>

        <div key={pulse} className={`combat-alert ${alert ? 'active' : ''}`}>
          <span>{danger ? '⚠' : '◇'}</span>
          <b>{alert || 'AWAITING INPUT'}</b>
        </div>
      </aside>
    </>
  );
}
