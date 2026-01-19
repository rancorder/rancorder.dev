'use client';

import styles from './ComparisonCard.module.css';

interface ComparisonItem {
  label: string;
  manufacturing: string;
  itAi: string;
}

const comparisons: ComparisonItem[] = [
  {
    label: '判断の性質',
    manufacturing: '不可逆',
    itAi: '可逆（修正可能）',
  },
  {
    label: '期待値定義',
    manufacturing: '必須（先に決める）',
    itAi: '後回しにしがち',
  },
  {
    label: '判断不能の扱い',
    manufacturing: '許されない',
    itAi: '「とりあえず継続」',
  },
  {
    label: '中止の評価',
    manufacturing: '正しい判断',
    itAi: '失敗と見なされる',
  },
];

export default function ComparisonCard() {
  return (
    <div className={styles.comparison}>
      <div className={styles.title}>判断文化の違い</div>
      
      <div className={styles.grid}>
        <div className={styles.header}>
          <div className={styles.cell}></div>
          <div className={`${styles.cell} ${styles.headerCell}`}>製造業</div>
          <div className={`${styles.cell} ${styles.headerCell}`}>IT・AI</div>
        </div>
        
        {comparisons.map((item, index) => (
          <div key={index} className={styles.row}>
            <div className={`${styles.cell} ${styles.labelCell}`}>
              {item.label}
            </div>
            <div className={`${styles.cell} ${styles.manufacturing}`}>
              {item.manufacturing}
            </div>
            <div className={`${styles.cell} ${styles.itAi}`}>
              {item.itAi}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
