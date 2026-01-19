'use client';

import styles from './PoCTimeline.module.css';

interface TimelineStep {
  phase: string;
  description: string;
  status: 'success' | 'warning' | 'error';
}

const steps: TimelineStep[] = [
  {
    phase: '技術検証',
    description: '動いている。デモも通っている。',
    status: 'success',
  },
  {
    phase: '判断フェーズ',
    description: 'なぜ続けるのか？なぜ止めないのか？',
    status: 'warning',
  },
  {
    phase: '現実',
    description: 'とりあえず継続 / 様子見 / 判断不能',
    status: 'error',
  },
];

export default function PoCTimeline() {
  return (
    <div className={styles.timeline}>
      <div className={styles.title}>典型的なPoCの流れ</div>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={`${styles.indicator} ${styles[step.status]}`}>
              {index + 1}
            </div>
            <div className={styles.content}>
              <div className={styles.phase}>{step.phase}</div>
              <div className={styles.description}>{step.description}</div>
            </div>
            {index < steps.length - 1 && <div className={styles.connector} />}
          </div>
        ))}
      </div>
    </div>
  );
}
