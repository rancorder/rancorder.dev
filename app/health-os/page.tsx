'use client';

import React from 'react';

type BP = {
  date: string;
  label: string;
  systolic: number;
  diastolic: number;
  alcohol: string;
  note: string;
};

const bpLogs: BP[] = [
  { date: '5/25', label: '朝', systolic: 110, diastolic: 75, alcohol: '🍺500×2 前夜', note: '血圧は安定。肝臓・脂質は回収対象。' },
  { date: '5/26', label: '朝', systolic: 122, diastolic: 84, alcohol: 'ノンアル前夜', note: '鯖塩焼き・調味料で下が少し残る。' },
  { date: '5/27', label: '朝', systolic: 116, diastolic: 77, alcohol: '休肝日前夜', note: '110台/70台で静かなログ。' },
  { date: '5/29', label: '朝', systolic: 121, diastolic: 84, alcohol: '休肝日前夜', note: '南蛮漬け・餃子の塩分が少し残る。' },
  { date: '5/31', label: '朝', systolic: 118, diastolic: 74, alcohol: '🍺500×2 前夜', note: '白米なし・汁なしで安定。' },
  { date: '6/1', label: '朝', systolic: 119, diastolic: 78, alcohol: '管理日', note: '安定ゾーン。' },
  { date: '6/2', label: '朝', systolic: 119, diastolic: 82, alcohol: 'ノンアル前夜', note: 'ハンバーグの味付け・睡眠の影響を少し見る。' },
  { date: '6/15', label: '朝', systolic: 119, diastolic: 77, alcohol: '事故枠後', note: '血圧は勝ち。肝臓は処理中。' },
  { date: '直近', label: '朝', systolic: 117, diastolic: 80, alcohol: '休肝日前夜', note: '休肝日翌朝として良好。' },
  { date: '直近', label: '朝', systolic: 121, diastolic: 76, alcohol: '事故枠後', note: '事故後でも血圧は管理圏内。' },
];

const restDays = [
  '5/18 飲まなかった日',
  '5/25 ノンアル350×2',
  '5/26 ビールなし',
  '5/28 酒なし',
  '6/1 ノンアル1本',
  '6/15 休肝日',
  '直近：休肝日が複数回成立',
];

const rules = [
  { title: '水を先に飲む', body: '喉の渇き・口寂しさ・勢い飲みを先に処理。ビール欲を分解する。' },
  { title: '豆腐で満たす', body: '冷奴・湯豆腐を半丁〜1丁。酒とノンアルの量が自然に減る。' },
  { title: '液体塩分を飲まない', body: 'スンドゥブ、カップ麺、そばつゆ、味噌汁の完飲を封印。' },
  { title: '家では冷やす本数を制限', body: '冷蔵庫に入れるのは最大1〜2本。3本目以降は常温在庫。' },
];

const labs = [
  { name: 'γ-GTP', value: '137', status: '要確認', comment: '次の血液検査の主役。飲酒ログと答え合わせ。' },
  { name: 'AST', value: '22', status: '良好', comment: '大きな肝細胞ダメージ感は薄い。' },
  { name: 'ALT', value: '31', status: '境界', comment: '少しだけ上振れ。' },
  { name: '中性脂肪', value: '193', status: '高め', comment: '酒・糖質・脂質の請求書。' },
  { name: 'LDL', value: '157', status: '高め', comment: '肝機能検査時に一緒に再確認したい。' },
  { name: 'BMI', value: '21.4', status: '適正', comment: '減量より飲酒・塩分・脂質設計が本丸。' },
];

const maxSys = 140;
const minDia = 55;
const maxDia = 95;

function avg(nums: number[]): number {
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

const avgSys = avg(bpLogs.map((x) => x.systolic));
const avgDia = avg(bpLogs.map((x) => x.diastolic));

function yScale(value: number, min: number, max: number): number {
  return 180 - ((value - min) / (max - min)) * 150;
}

function points(type: 'systolic' | 'diastolic'): string {
  return bpLogs
    .map((log, i) => {
      const x = 20 + i * (660 / (bpLogs.length - 1));
      const y = type === 'systolic' ? yScale(log.systolic, 100, maxSys) : yScale(log.diastolic, minDia, maxDia);
      return `${x},${y}`;
    })
    .join(' ');
}

export default function HealthOSPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-emerald-400/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.20),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 md:py-16">
          <div className="mb-7 inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
            Personal Health OS / Blood Pressure・Alcohol・Liver Recovery
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                健康OS
                <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  血圧・酒・豆腐で整えるダッシュボード
                </span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                べーさんの実ログから作った、家庭血圧・飲酒量・休肝日・食事トリガーを管理するためのOS。
                目的は「我慢」ではなく、酒が必要なくなる食事構造と家飲み環境を作ること。
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="text-sm text-slate-300">現在の中核KPI</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Metric label="直近平均血圧" value={`${avgSys}/${avgDia}`} unit="mmHg" good />
                <Metric label="血圧状態" value="管理圏内" unit="" good />
                <Metric label="本丸" value="γ-GTP" unit="137" warn />
                <Metric label="勝ち食材" value="豆腐" unit="毎日OK" good />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <Card title="血圧OSの結論" accent="emerald">
            <p className="text-3xl font-black text-white">血圧は管理フェーズ</p>
            <p className="mt-3 leading-7 text-slate-300">
              110〜120台 / 70〜80台が中心。事故枠でも血圧が崩れにくくなっているが、肝臓・中性脂肪は別管理。
            </p>
          </Card>
          <Card title="飲酒OSの結論" accent="amber">
            <p className="text-3xl font-black text-white">4休肝 → 管理チート</p>
            <p className="mt-3 leading-7 text-slate-300">
              毎日飲むより、休ませてから飲む方が合う。1本通常、2本上限、3本チート、4本事故枠。
            </p>
          </Card>
          <Card title="食事OSの結論" accent="cyan">
            <p className="text-3xl font-black text-white">豆腐が酒欲を消す</p>
            <p className="mt-3 leading-7 text-slate-300">
              食事メイン＋豆腐で満たすと、ノンアルも酒も量が減る。冷奴・湯豆腐は出張時の保険にもなる。
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black">血圧トレンド</h2>
              <p className="mt-2 text-slate-400">各測定日の平均値。白破線は家庭血圧の目安 135/85。</p>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              直近平均：<span className="font-bold">{avgSys}/{avgDia} mmHg</span>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <svg viewBox="0 0 720 260" className="min-w-[820px] rounded-3xl bg-slate-950 p-3">
              <line x1="20" x2="680" y1={yScale(135, 100, maxSys)} y2={yScale(135, 100, maxSys)} stroke="rgba(248,113,113,.7)" strokeDasharray="6 6" />
              <line x1="20" x2="680" y1={yScale(85, minDia, maxDia)} y2={yScale(85, minDia, maxDia)} stroke="rgba(251,191,36,.8)" strokeDasharray="6 6" />
              <polyline fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points('systolic')} />
              <polyline fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points('diastolic')} />
              {bpLogs.map((log, i) => {
                const x = 20 + i * (660 / (bpLogs.length - 1));
                return (
                  <g key={`${log.date}-${i}`}>
                    <circle cx={x} cy={yScale(log.systolic, 100, maxSys)} r="5" fill="#34d399" />
                    <circle cx={x} cy={yScale(log.diastolic, minDia, maxDia)} r="5" fill="#38bdf8" />
                    <text x={x} y="225" textAnchor="middle" fill="rgba(226,232,240,.8)" fontSize="12">{log.date}</text>
                  </g>
                );
              })}
              <text x="520" y={yScale(135, 100, maxSys) - 8} fill="#fca5a5" fontSize="12">135 line</text>
              <text x="520" y={yScale(85, minDia, maxDia) - 8} fill="#fde68a" fontSize="12">85 line</text>
              <text x="20" y="32" fill="#34d399" fontSize="13">上の血圧</text>
              <text x="110" y="32" fill="#38bdf8" fontSize="13">下の血圧</text>
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">休肝日ログ</h2>
          <p className="mt-2 text-slate-400">「ビールなし／ノンアルのみ」を休肝日として扱う。</p>
          <div className="mt-5 space-y-3">
            {restDays.map((day) => (
              <div key={day} className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-emerald-50">
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">肝機能・脂質の答え合わせ</h2>
          <p className="mt-2 text-slate-400">内科で確認したい項目。血圧が良くてもここは別問題。</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {labs.map((lab) => (
              <div key={lab.name} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-slate-200">{lab.name}</div>
                  <div className="rounded-full bg-amber-300/15 px-3 py-1 text-xs text-amber-100">{lab.status}</div>
                </div>
                <div className="mt-2 text-3xl font-black text-white">{lab.value}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{lab.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-8">
          <h2 className="text-3xl font-black">行動OS：勝ちパターン</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {rules.map((rule, i) => (
              <div key={rule.title} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-300 text-lg font-black text-slate-950">{i + 1}</div>
                <h3 className="text-xl font-black text-white">{rule.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{rule.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">飲酒ルール</h2>
            <div className="mt-5 space-y-3 text-slate-200">
              <RuleLine label="0本" text="休肝日。血圧・胃腸・皮膚・睡眠の回収日。" />
              <RuleLine label="1本" text="通常枠。今の身体なら血圧に残りにくい。" />
              <RuleLine label="2本" text="上限枠。翌朝のだるさ・下の血圧を確認。" />
              <RuleLine label="3本" text="チート枠。翌日は必ず回収日。" />
              <RuleLine label="4本" text="事故枠。冷やす本数制限で再発防止。" danger />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">内科で伝えるメモ</h2>
            <div className="mt-5 rounded-2xl bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-200">
              健診でγ-GTP 137、AST 22、ALT 31でした。<br />
              飲酒量を減らし、休肝日も増やしています。<br />
              肝機能の血液検査をしたいです。<br />
              AST・ALT・γ-GTPに加えて、中性脂肪・LDL・HDL・尿酸も確認したいです。
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              ※これは医療診断ではなく、生活ログ整理用のOS。症状がある時や検査値の判断は医師優先。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, unit, good, warn }: { label: string; value: string; unit: string; good?: boolean; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-black ${good ? 'text-emerald-300' : warn ? 'text-amber-300' : 'text-white'}`}>{value}</div>
      {unit && <div className="text-xs text-slate-400">{unit}</div>}
    </div>
  );
}

function Card({ title, accent, children }: { title: string; accent: 'emerald' | 'amber' | 'cyan'; children: React.ReactNode }) {
  const color = accent === 'emerald' ? 'border-emerald-300/20 bg-emerald-300/10' : accent === 'amber' ? 'border-amber-300/20 bg-amber-300/10' : 'border-cyan-300/20 bg-cyan-300/10';
  return (
    <div className={`rounded-[2rem] border p-6 ${color}`}>
      <div className="text-sm font-bold uppercase tracking-widest text-slate-300">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function RuleLine({ label, text, danger }: { label: string; text: string; danger?: boolean }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className={`flex h-9 min-w-16 items-center justify-center rounded-xl text-sm font-black ${danger ? 'bg-rose-300 text-slate-950' : 'bg-cyan-300 text-slate-950'}`}>{label}</div>
      <div className="leading-7 text-slate-300">{text}</div>
    </div>
  );
}
