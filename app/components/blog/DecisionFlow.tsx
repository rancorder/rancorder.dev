'use client';

import styles from './DecisionFlow.module.css';

export default function DecisionFlow() {
  return (
    <div className={styles.flow}>
      <div className={styles.title}>PoCの判断フロー</div>
      
      <div className={styles.diagram}>
        <div className={styles.node}>
          <div className={`${styles.box} ${styles.start}`}>
            PoC開始
          </div>
        </div>
        
        <div className={styles.arrow}>↓</div>
        
        <div className={styles.question}>
          <div className={`${styles.box} ${styles.check}`}>
            期待値は定義されているか？
          </div>
        </div>
        
        <div className={styles.branches}>
          <div className={styles.branch}>
            <div className={styles.label}>YES</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.box} ${styles.success}`}>
              合理的な判断が可能<br/>
              Go / Stop どちらでも説明できる
            </div>
          </div>
          
          <div className={styles.branch}>
            <div className={styles.label}>NO</div>
            <div className={styles.arrow}>↓</div>
            <div className={`${styles.box} ${styles.danger}`}>
              判断不能<br/>
              「とりあえず継続」に陥る
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
