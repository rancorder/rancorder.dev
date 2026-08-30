export type CaseStudy = {
  slug: string;
  id: string;
  status: string;
  tone: 'green' | 'purple' | 'yellow';
  title: string;
  subtitle: string;
  metrics: { value: string; label: string }[];
  chaos: string[];
  hiddenRisk: string[];
  decision: string[];
  architecture: { label: string; value: string }[];
  result: string[];
  principle: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: '54-site-monitoring',
    id: 'CASE 01',
    status: 'PRODUCTION READY',
    tone: 'green',
    title: '54サイト監視基盤',
    subtitle: '「見に行く運用」をやめ、異常が向こうから上がってくる構造へ。',
    metrics: [
      { value: '54', label: 'sites' },
      { value: '11', label: 'months continuous' },
      { value: '100K+', label: 'process / month' },
      { value: '0', label: 'system stops' },
    ],
    chaos: [
      '複数サイトの状態確認が、人の巡回と経験に依存していた。',
      '取得失敗・ログイン失敗・処理停滞が同じ「失敗」として扱われ、原因切り分けに時間がかかる。',
      '止まっていることより、「いつから・どこで・何が」止まったか分からないことが問題だった。',
    ],
    hiddenRisk: [
      '監視対象を増やすほど、人が見る画面も増える設計になっていた。',
      '正常終了していても、期待したデータが取れていない可能性を検知できない。',
      '復旧が担当者の記憶に依存すると、担当交代時に運用品質が落ちる。',
    ],
    decision: [
      'サイト単位ではなく、運用上の「失敗モード」単位で監視を設計した。',
      '処理成功・データ取得・更新鮮度を別々のシグナルとして扱った。',
      '復旧方法を自動・手動・要判断の3系統に分け、人が見るべき異常だけを残した。',
    ],
    architecture: [
      { label: 'INPUT', value: '54 external sources' },
      { label: 'CONTROL', value: 'scheduled execution + collision guard' },
      { label: 'OBSERVE', value: 'status / freshness / result integrity' },
      { label: 'RECOVER', value: 'retry / isolate / operator decision' },
    ],
    result: [
      '54サイトを単一の運用面で扱える状態へ集約。',
      '11か月連続稼働。',
      '月10万件超の処理を継続。',
      'システム障害による業務停止0件。',
    ],
    principle: '監視とは「画面を見ること」ではなく、異常時だけ人間へ判断を返す設計である。',
  },
  {
    slug: 'ai-production-delivery',
    id: 'CASE 02',
    status: 'AI / AUTOMATION',
    tone: 'purple',
    title: 'AI機能の本番導入',
    subtitle: '精度の議論だけでは、本番には行けない。責任と失敗を先に設計する。',
    metrics: [
      { value: 'AI', label: 'production' },
      { value: '2', label: 'model families' },
      { value: 'HITL', label: 'fallback' },
      { value: 'TRACE', label: 'change history' },
    ],
    chaos: [
      'PoCでは「動く・精度が出る」が主な評価軸になっていた。',
      '本番では、誤判定・入力欠損・モデル差し替え・外部API不調が同時に運用課題になる。',
      'AIの判断を誰が保証し、どの条件で人へ戻すかが曖昧だった。',
    ],
    hiddenRisk: [
      'AI出力の品質問題を、通常のアプリケーションエラーと同じ監視で扱えない。',
      'モデルやプロンプト変更は、コード変更がなくても結果を変える。',
      '「AIが失敗したら人が見る」だけでは、切替条件が人によって変わる。',
    ],
    decision: [
      '精度より先に、失敗条件・責任境界・フォールバック条件を定義した。',
      'モデルの結果を採用する条件と、人へ戻す条件を分離した。',
      'モデル・プロンプト・主要設定を、再現可能な変更単位として扱った。',
    ],
    architecture: [
      { label: 'INPUT', value: 'business data / audio / text' },
      { label: 'INFERENCE', value: 'Whisper / BERT class models' },
      { label: 'GATE', value: 'confidence + rule validation' },
      { label: 'FALLBACK', value: 'human review / safe path' },
    ],
    result: [
      'Whisper系・BERT系機能をPoC外へ持ち出し、本番導入へ接続。',
      'AIの「結果」だけでなく、失敗時の運用を設計対象に変更。',
      '非コード変更も含めて再現可能性を確保する考え方へ移行。',
    ],
    principle: 'AI本番化の本質は精度改善ではない。「間違えたときに壊れない」境界設計である。',
  },
  {
    slug: '1400-line-quality-rebuild',
    id: 'CASE 03',
    status: 'RISK CONTAINED',
    tone: 'yellow',
    title: '1,400行の品質再建',
    subtitle: '全部直すのではなく、壊れたときに困る場所から保証する。',
    metrics: [
      { value: '1,400', label: 'lines untested' },
      { value: '30', label: 'tests added' },
      { value: 'RISK', label: 'based priority' },
      { value: 'SAFE', label: 'change boundary' },
    ],
    chaos: [
      '約1,400行のロジックに対して、変更を守るテストが不足していた。',
      '全面リファクタリングは魅力的だが、挙動を変えるリスクも同時に大きい。',
      '「どこまで直せば安全か」の基準がなかった。',
    ],
    hiddenRisk: [
      'テスト数を増やすだけでは、重要な失敗を防げるとは限らない。',
      '仕様が暗黙的なコードでは、リファクタリング自体が仕様変更になる可能性がある。',
      '低リスク領域からテストすると、数字は増えても保証範囲は増えない。',
    ],
    decision: [
      'コード量ではなく、障害時の影響度からテスト対象を決めた。',
      '変更頻度・分岐・外部境界を優先し、30テストを追加した。',
      '既存挙動を固定してから、変更可能な境界を段階的に広げた。',
    ],
    architecture: [
      { label: 'MAP', value: 'change + impact surface' },
      { label: 'LOCK', value: 'characterization tests' },
      { label: 'VERIFY', value: 'critical branches' },
      { label: 'EXPAND', value: 'safe refactor boundary' },
    ],
    result: [
      '未テスト1,400行に対して、30テストを追加。',
      'テスト件数ではなく、保証対象を明示できる状態へ移行。',
      '全面改修を避けつつ、変更可能な領域を段階的に拡張。',
    ],
    principle: '品質改善は「テストを書くこと」ではない。壊れてはいけない境界を先に決めることである。',
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}
