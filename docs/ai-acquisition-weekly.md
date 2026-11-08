# AI集客ファクトリー — 週次データ収集・改善運用

## 運用目的
月商30万円を目標に、検索 → 無料CSVフォーマット変更チェッカー → 相談 → 受注のどの段階がボトルネックか、実測値から毎週判断する。AIは差分が小さく根拠のある改修PRを作る。本番公開・マージは人間承認が必要。

## 既存の計測実装
- Web Analytics用コンポーネント: `app/layout.tsx` に `@vercel/analytics/react` を設置済み。
- CSVチェッカー: `app/tools/csv-format-check/CsvFormatCheckerClient.tsx` で以下を送信できる。
  - `csv_compare_started`（mode: upload/sample）
  - `csv_compare_completed`（mode, status: IDENTICAL/COMPATIBLE_EXTENDED/BREAKING_CHANGES）
  - `csv_compare_error`（mode）
  - `consultation_cta_clicked`（source: csv_checker）
- **CSVファイル本体、ファイル名、列名、行データ、顧客名、エラー詳細は送らない。** 匿名の操作数はWeb Analyticsを有効化した場合のみ収集される。
- サンプルデータの操作は mode=sample とし、実ファイルの利用率・購入見込みと混同しない。
- `consultation_cta_clicked` はメール作成画面を開いた回数であり、メール送信・相談受理・受注ではない。

## データ源と初期設定
1. Google Search Console: 検索パフォーマンスの表示回数・クリック・CTR・平均掲載順位。サイトを正しく登録・所有確認し、ChatGPTの集客レビュー用データ接続（Google Search Console対応のWindsor.ai等）をユーザーが承認する。GitHubやチャットに認証トークンを貼らない。
2. Vercel Web Analytics: Vercelの対象プロジェクトでWeb Analyticsを有効化し、本番での pageview が計測されることを検証する。2026-11-08 時点でAPIは `404 Web Analytics not found`。計測できないときはゼロ件と扱わない。
3. Vercelカスタムイベント: Pro / Enterprise等、利用可能なプランでのみ使用できる。Hobbyプランではカスタムイベント利用不可。料金・アクセス権を確認してから利用する。可能でなければGA4等の別手段を検討する。
4. 相談・受注: 相談数と契約金額はメール送受信・案件台帳などの確認済み記録のみ集計する。匿名イベントから受注を推定しない。

## 毎週月曜日 08:00 JSTの分析ルール
- 可能なデータ源から直近確定28日間とその前28日間の実測値を取得。Search Consoleは確定遅延を考慮し、未確定日を除く。
- ページ／クエリごとの表示回数・クリック・CTR・掲載順位を比較。Vercelで取得可能なら、訪問、csv_compare_started/completed/error、CTAクリックを集計。
- 重点は売上獲得。想定した利用完了率・相談率の分母と分子は、計測条件が同じ期間でのみ比較する。データがない、異なる母集団、少数サンプルの場合は「判定保留」。
- 改善仮説を1件だけ優先。根拠URL・観測期間・指標・修正範囲・期待効果の仮説・リスク・ロールバック条件を残す。
- 実装できる場合は作業ブランチで小変更し、新規PRを作成。既存PRとの重複を確認し、必ず検証。mainへの直接書き込み／マージ／本番公開、広告の支払い、外部への投稿は自動実施しない。

## 現在の公開前提での注意
- `rancorder.dev` がコード上のcanonicalだが、Vercelプロジェクトの登録済みドメインとして確認されたのは `rancorder.vercel.app`。ドメインとサーチコンソールプロパティを一致させる設定が別途必要。
- 初回から指標が揃っているとは限らない。導入直後は数週間分の利用実績がない場合がある。
- ChatGPTの定期タスクには「データがあれば分析・改修PRまで」の指示を登録しているが、アクセス許可と計測開始がない状態で実際のGoogle検索流入や売上を取得することはできない。

## 最初の実証手順
- 本番公開後、ブラウザで無料ツールのサンプル実行と実ファイル実行をそれぞれ試す。
- Web AnalyticsまたはGA4上に匿名のイベントが正しいmodeで現れ、CSV内容がイベント送信されないことを検証する。
- メール相談ボタンを押した際にクリックイベントを確認し、実際の問い合わせと混同しない。
- 2〜4週間の実測を蓄積して、最初の改善仮説を選ぶ。
