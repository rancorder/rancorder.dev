// data/skills.ts
import { SkillGroup } from '@/types';

export const skills: SkillGroup[] = [
  {
    category: 'PM（意思決定・推進）',
    items: [
      '要件定義・仕様策定（曖昧耐性・段階確定）',
      'ステークホルダー調整 / 合意形成（5社以上の並行調整）',
      '優先順位付け・スコープ設計（トレードオフ判断）',
      '品質 / リスク / 変更影響の設計（3段階評価手法）',
      'マルチプロダクト管理（最大21品番同時立上げ）',
    ],
  },
  {
    category: 'プロダクト / 運用視点',
    items: [
      '0→1 / 改修 / 運用フェーズの判断（段階設計）',
      'トレードオフ設計（速度×品質×コスト）',
      '障害時の影響範囲限定と復旧設計',
      '本番前提の設計レビュー（運用負荷・失敗コスト評価）',
      '製造業精度（0.01mm）× Tech速度（24/7）の両立',
    ],
  },
  {
    category: '技術（判断に使える理解）',
    items: [
      'Python / FastAPI / React / TypeScript / Next.js',
      'Docker / Linux / PostgreSQL / Redis / SQLite',
      'pytest / k6 / Prometheus / Grafana',
      'VPS運用 / systemd / cron',
      '生成AI（Whisper / BERT / Prompt設計）',
    ],
  },
];
