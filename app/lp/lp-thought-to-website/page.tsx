'use client';

import { useEffect, useState } from 'react';

/* =========================
   型定義（分岐の封印）
========================= */
type Step =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | 'final'
  | 'reject';

/* =========================
   Page
========================= */
export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('0');

  const openModal = () => {
    setStep('0');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const go = (s: Step) => setStep(s);

  /* ESC対応（思想を壊さない範囲） */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* =========================
          ファーストビュー
      ========================= */}
      <section>
        <div className="wrap">
          <h1>
            テーマと思想を書くと、
            <br />
            Webサイトが自動で完成する。
          </h1>

          <p className="lead">
            設計も、実装も、CMS操作も不要。
            <br />
            書いた内容がそのままHTMLになり、公開まで終わります。
            <br />
            <strong>※ 過去にブログを止めたことがある人専用</strong>
          </p>

          <div className="box">
            <strong>ただし条件があります。</strong>
            <br />
            この仕組みは、あなたに<strong>選択肢を与えません</strong>。
          </div>

          <p className="note">
            ※ 管理画面で記事は書けません
            <br />
            ※ 構造は変更できません
            <br />
            ※ 自由は、最初からありません
          </p>
        </div>
      </section>

      {/* =========================
          定義
      ========================= */}
      <section>
        <div className="wrap">
          <h2>これは何か</h2>

          <p>
            これはWeb制作サービスではありません。
            <br />
            CMSでも、ブログツールでもありません。
          </p>

          <p>
            <strong>
              「思想だけを書かせ、実装と判断をすべて奪うWebサイト生成システム」
            </strong>
            です。
          </p>

          <p>あなたがやることは一つだけ。</p>

          <div className="box">
            テーマを書く。
            <br />
            思想を書く。
            <br />
            以上。
          </div>
        </div>
      </section>

      {/* =========================
          問題提起
      ========================= */}
      <section>
        <div className="wrap">
          <h2>なぜ、あなたは止まったのか</h2>

          <p>続かなかった理由は、才能でも根性でもありません。</p>

          <p>
            <strong>自由が多すぎた。</strong>
            <br />
            それだけです。
          </p>

          <ul>
            <li>技術を選べた</li>
            <li>構成を考えられた</li>
            <li>改善点を思いつけた</li>
          </ul>

          <p>
            そのすべてが、
            <br />
            「今日はやめておく」を合理化しました。
          </p>
        </div>
      </section>

      {/* =========================
          解決策
      ========================= */}
      <section>
        <div className="wrap">
          <h2>解決策は単純で、残酷</h2>

          <p>このシステムは、最初にこう決めています。</p>

          <div className="box">
            迷わせない。
            <br />
            選ばせない。
            <br />
            逃がさない。
          </div>

          <p>
            CMSはありません。
            <br />
            管理画面で記事も書けません。
            <br />
            データベースに本文は入りません。
          </p>

          <p>
            <strong>一本道しか、用意していません。</strong>
          </p>
        </div>
      </section>

      {/* =========================
          究極形
      ========================= */}
      <section>
        <div className="wrap">
          <h2>究極形：思想 → 実装</h2>

          <p>
            このシステムには、
            <strong>Claude用の専用プロンプト</strong>
            が付属します。
          </p>

          <div className="box">
            思想を書く
            <br />↓<br />
            AIがコーディング
            <br />↓<br />
            リポジトリ生成
            <br />↓<br />
            git push → 即公開
          </div>

          <p>
            技術選定も、設計判断も、
            <br />
            あなたの仕事ではありません。
          </p>

          <p className="note">
            ※ AIは「最適化」「設計提案」「選択肢提示」を行いません。
          </p>
        </div>
      </section>

      {/* =========================
          管理画面
      ========================= */}
      <section>
        <div className="wrap">
          <h2>管理画面でできること</h2>

          <p>ほとんど何もできません。</p>

          <ul>
            <li>状態を見る</li>
            <li>最終更新日を見る</li>
            <li>ビルド結果を見る</li>
            <li>思想の履歴を見る</li>
          </ul>

          <p>
            ここは操作する場所ではありません。
            <br />
            <strong>現実を見る場所です。</strong>
          </p>

          <p className="danger">
            ここで操作できるようになった瞬間、
            <br />
            このシステムは失敗です。
          </p>
        </div>
      </section>

      {/* =========================
          価格
      ========================= */}
      <section>
        <div className="wrap">
          <h2>価格</h2>

          <div className="price-container">
            <div className="price">10万円</div>
            <button className="cta-button" onClick={openModal}>
              <span>もう迷わないと決める</span>
            </button>
          </div>

          <hr />

          <p className="success">含まれるもの：</p>
          <ul>
            <li>デザインカスタマイズ（見た目のみ）</li>
            <li>思想 → 実装パイプライン</li>
            <li>自分で作らなくていい確定</li>
          </ul>

          <p className="danger">含まれないもの：</p>
          <ul>
            <li>構造変更</li>
            <li>機能追加</li>
            <li>相談・改善提案</li>
            <li>自由</li>
          </ul>
        </div>
      </section>

      {/* =========================
          最終通告
      ========================= */}
      <section>
        <div className="wrap">
          <h2>最後に</h2>

          <p>
            これは優しいサービスではありません。
            <br />
            背中も押しません。
            <br />
            励ましもしません。
          </p>

          <div className="final-message">
            <strong>
              買わない自由を残すと、人は一生準備する。
              <br />
              買うことを束縛すると、人はようやく書き始める。
            </strong>
          </div>

          <div className="price-container" style={{ marginTop: '3rem' }}>
            <button className="cta-button" onClick={openModal}>
              <span>次は止まらない側に行く</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          モーダル
      ========================= */}
      {isOpen && (
        <div
          className="modal-overlay active"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal-content">
            {step === '0' && (
              <Step
                title={`ここから先は\n「申し込む人を増やすためのフォーム」ではありません。`}
                yes="⭕ 進む"
                no="❌ 閉じる"
                onYes={() => go('1')}
                onNo={closeModal}
              />
            )}

            {step === '1' && (
              <Step
                indicator="質問 1/5"
                title="このシステムには、管理画面で記事を書く機能はありません。"
                yes="⭕ Yes（理解した）"
                no="❌ No（理解できない）"
                onYes={() => go('2')}
                onNo={() => go('reject')}
              />
            )}

            {step === '2' && (
              <Step
                indicator="質問 2/5"
                title={`構造・機能・運用フローについて、\nあとから変更や相談はできません。`}
                yes="⭕ Yes（それでいい）"
                no="❌ No（自由が欲しい）"
                onYes={() => go('3')}
                onNo={() => go('reject')}
              />
            )}

            {step === '3' && (
              <Step
                indicator="質問 3/5"
                title={`更新が止まった場合、それは「設計の問題」であり、\nあなた自身を責めないと約束できますか。`}
                yes="⭕ Yes（設計に責任を預ける）"
                no="❌ No（自分でコントロールしたい）"
                onYes={() => go('4')}
                onNo={() => go('reject')}
              />
            )}

            {step === '4' && (
              <Step
                indicator="質問 4/5"
                title={`10万円は「制作費」ではなく、\n自由を手放すための費用です。`}
                yes="⭕ Yes（理解した）"
                no="❌ No（納得できない）"
                onYes={() => go('5')}
                onNo={() => go('reject')}
              />
            )}

            {step === '5' && (
              <Step
                indicator="最終確認 5/5"
                title="それでも申し込みますか。"
                yes="⭕ Yes（戻らない）"
                no="❌ No（今回はやめる）"
                onYes={() => go('final')}
                onNo={closeModal}
              />
            )}

            {step === 'final' && (
              <div className="step-content active">
                <h3 className="question-title">
                  すべての質問に同意されました。
                </h3>
                <div className="final-cta">
                  <a
                    href="mailto:product@newaddr.com?subject=Webサイト生成システム申込"
                    className="final-cta-button"
                  >
                    申込手続きに進む
                  </a>
                </div>
              </div>
            )}

            {step === 'reject' && (
              <div className="rejection-message">
                <h3>この商品は向いていません</h3>
                <p>ご理解いただきありがとうございました。</p>
                <button
                  className="answer-btn no"
                  style={{ maxWidth: 200, margin: '2rem auto 0' }}
                  onClick={closeModal}
                >
                  閉じる
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================
          Global CSS（HTML原文完全移植）
      ========================= */}
      <style jsx global>{`
${`/* ここにあなたが貼った <style> を 1文字も変えず全文貼り付け */`}
      `}</style>
    </>
  );
}

/* =========================
   Step Component
========================= */
function Step(props: {
  title: string;
  yes: string;
  no: string;
  onYes: () => void;
  onNo: () => void;
  indicator?: string;
}) {
  return (
    <div className="step-content active">
      {props.indicator && (
        <div className="step-indicator">{props.indicator}</div>
      )}
      <h3 className="question-title">
        {props.title.split('\n').map((l, i) => (
          <span key={i}>
            {l}
            <br />
          </span>
        ))}
      </h3>
      <div className="answer-buttons">
        <button className="answer-btn yes" onClick={props.onYes}>
          {props.yes}
        </button>
        <button className="answer-btn no" onClick={props.onNo}>
          {props.no}
        </button>
      </div>
    </div>
  );
}
