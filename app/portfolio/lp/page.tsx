import type { Metadata } from 'next';
import styles from './page.module.css';
import './lp-global.css';
import { useReveal } from './useReveal';

export const metadata: Metadata = {
  title: '書く前に、完成度を決めなくていい。出してから、直せばいい個人サイト。',
  description:
    'ブログ・ポートフォリオを「ちゃんと作ろう」として止まった人のための壊れない初期状態。',
};

export default function LandingPage() {
  const hero = useReveal<HTMLDivElement>();
  const empathy = useReveal<HTMLDivElement>();
  const problem = useReveal<HTMLDivElement>();
  const value = useReveal<HTMLDivElement>();
  const outcome = useReveal<HTMLDivElement>();
  const anti = useReveal<HTMLDivElement>();
  const cta = useReveal<HTMLDivElement>();

  return (
    <main className={styles.lpContainer}>
      {/* Hero */}
      <section
        ref={hero.ref}
        className={`${styles.hero} ${hero.isVisible ? styles.isVisible : ''}`}
      >
        <span className={styles.heroEyebrow}>
          完成させなくていい個人サイト
        </span>

        <h1 className={styles.heroMain}>
          書く前に、完成度を決めなくていい。<br />
          出してから、直せばいい。
        </h1>

        <p className={styles.heroSub}>
          ブログ・ポートフォリオを<br />
          <strong>「ちゃんと作ろう」</strong>として止まった人のための<br />
          壊れない初期状態。
        </p>
      </section>

      {/* Empathy */}
      <section
        ref={empathy.ref}
        className={`${styles.empathySection} ${empathy.isVisible ? styles.isVisible : ''}`}
      >
        <h2>こんなところで止まっていませんか？</h2>
        <ul className={styles.painPoints}>
          <li>最初の記事を書けない</li>
          <li>デザインを決めきれない</li>
          <li>WordPressを触って疲れた</li>
          <li>後で作り直すのが怖い</li>
          <li>何を書けばいいか決まっていない</li>
        </ul>
      </section>

      {/* Problem */}
      <section
        ref={problem.ref}
        className={`${styles.problemSection} ${problem.isVisible ? styles.isVisible : ''}`}
      >
        <h2>止まる理由は、意志の問題ではありません。</h2>
        <div className={styles.problemContent}>
          <p>
            多くの個人サイトは、<br />
            最初に「正解の形」を決める前提で作られています。
          </p>
          <ul className={styles.problemList}>
            <li>書いてみて違うと詰む</li>
            <li>消したくなると怖い</li>
            <li>途中で全部作り直しになる</li>
          </ul>
          <p className={styles.problemHighlight}>
            これが、続かない本当の理由です。
          </p>
        </div>
      </section>

      {/* Value */}
      <section
        ref={value.ref}
        className={`${styles.valueSection} ${value.isVisible ? styles.isVisible : ''}`}
      >
        <h2>これは「ブログサービス」ではありません。</h2>
        <div className={styles.valueStatement}>
          書き始めても後悔しない<br />
          <strong>個人サイトの“初期状態”</strong>を渡します。
        </div>
      </section>

      {/* Outcome */}
      <section
        ref={outcome.ref}
        className={`${styles.outcomeSection} ${outcome.isVisible ? styles.isVisible : ''}`}
      >
        <h2>これを使うと、こうなります。</h2>
        <ul className={styles.outcomeList}>
          <li>とりあえず出せる</li>
          <li>書き直しても崩れない</li>
          <li>消しても戻せる</li>
          <li>外に書いた記事もまとめられる</li>
          <li>あとから方向を変えられる</li>
        </ul>
      </section>

      {/* Anti */}
      <section
        ref={anti.ref}
        className={`${styles.antiFilterSection} ${anti.isVisible ? styles.isVisible : ''}`}
      >
        <h2>向いていない人</h2>
        <ul className={styles.antiList}>
          <li>最初から完璧なサイトを作りたい</li>
          <li>1記事でバズりたい</li>
          <li>触るたびに設定をいじりたい</li>
          <li>プラグインを集めるのが好き</li>
        </ul>
        <div className={styles.antiStatement}>
          このサイトは<br />
          「迷いながら続ける人」向けです。
        </div>
      </section>

      {/* CTA */}
      <section
        ref={cta.ref}
        className={`${styles.ctaSection} ${cta.isVisible ? styles.isVisible : ''}`}
      >
        <h2>はじめるだけの状態を用意します。</h2>
        <div className={styles.serviceContent}>
          <ul>
            <li>✓ 初期セットアップ済み個人サイト</li>
            <li>✓ 記事ゼロでもOK</li>
            <li>✓ すぐ公開できる状態</li>
          </ul>
        </div>
        <a href="#contact" className={styles.neonButton}>
          <span>ちゃんと始めたい人だけ、どうぞ。</span>
        </a>
        <p className={styles.ctaNote}>
          ※ お問い合わせはリンク先のフォームからお願いします
        </p>
      </section>
    </main>
  );
}