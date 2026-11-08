import type { Metadata } from 'next';
import Link from 'next/link';
import './csv-checker.css';
import CsvFormatCheckerClient from './CsvFormatCheckerClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://rancorder.dev'),
  title: '無料CSVフォーマット変更チェッカー | ブラウザ完結・スキーマ差分比較 | rancorder',
  description:
    'CSV/TSVファイルの列名・列順・区切り文字・列数の変更をブラウザ内完結で即時判定。CSV内容のサーバー送信・保存なし。受発注システムや基幹連携のサイレントエラー・取込異常を未然に防ぎます。',
  keywords: [
    'CSV変更チェック',
    'CSV差分比較',
    'TSV比較',
    'CSVスキーマ比較',
    '受発注CSVエラー',
    'EDIデータ連携',
    'Technical PM',
    '運用自動化',
  ],
  openGraph: {
    title: '無料CSVフォーマット変更チェッカー | rancorder',
    description:
      'CSV/TSVファイルの列名・列順・区切り文字・列数整合性をブラウザ内完結で比較。CSV内容のサーバー送信なし。受発注・基幹連携のサイレント障害を防止。',
    url: 'https://rancorder.dev/tools/csv-format-check',
    siteName: 'rancorder',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '無料CSVフォーマット変更チェッカー | rancorder',
    description:
      'CSV/TSVの列名・列順・区切り文字・不正行をブラウザ内完結で即座に比較。サーバー送信なし。',
  },
  alternates: {
    canonical: '/tools/csv-format-check',
  },
};

export default function CsvFormatCheckPage() {
  return (
    <main className="checker-page">
      <div className="checker-grid" aria-hidden="true" />

      {/* Header Navigation */}
      <nav className="checker-nav">
        <Link href="/" className="mc-brand" aria-label="rancorder home">
          RANCORDER<span>.DEV</span>
        </Link>
        <span>CSV SCHEMA AUDIT // FREE UTILITY</span>
      </nav>

      <section className="checker-shell">
        {/* Hero Section */}
        <header className="checker-hero">
          <div className="status-tag" style={{ background: 'rgba(93, 242, 165, 0.1)', color: 'var(--mc-green)', border: '1px solid rgba(93, 242, 165, 0.3)', display: 'inline-block', marginBottom: '16px' }}>
            01 / FREE BROWSER TOOL · LOCAL FILE PROCESSING
          </div>
          <h1>
            CSVフォーマット変更チェッカー。<br />
            <span>サイレント障害を、取込前に検知する。</span>
          </h1>
          <p>
            取引先や外部システムから送られてくるCSV/TSVの仕様変更（列の追加・削除・順序入替・区切り文字変更・行ごとの列数不正）を、
            ブラウザ内完結で即座に判定します。CSVの内容やファイル名をサーバーへ送信・記録することはありません。匿名の操作イベントを計測する場合があります。
          </p>

          {/* Disclosures & Specifications */}
          <div className="checker-disclosures">
            <div className="checker-disc-item">
              <small>PROCESSING</small>
              <b>100% ブラウザ内完結</b>
              <span>CSVの中身は端末内で解析。匿名の利用状況のみ計測する場合があります。</span>
            </div>
            <div className="checker-disc-item">
              <small>FILE LIMIT</small>
              <b>最大 3MB / 1ファイル</b>
              <span>メモリ効率とブラウザ描画を考慮した上限。</span>
            </div>
            <div className="checker-disc-item">
              <small>ENCODING</small>
              <b>UTF-8 (BOM対応)</b>
              <span>Shift_JIS・Excel(.xlsx)非対応。CSV/TSV/TXTのみ。</span>
            </div>
            <div className="checker-disc-item">
              <small>SCOPE</small>
              <b>スキーマ構造のみ比較</b>
              <span>値の型やビジネスロジック、セル内容の一致は非検証。</span>
            </div>
          </div>
        </header>

        {/* Interactive Comparison Console */}
        <CsvFormatCheckerClient />

        {/* SSR Explanatory Knowledge / Domain Context */}
        <section className="checker-editorial">
          <div className="editorial-head">
            <div className="status-tag" style={{ background: 'rgba(167, 139, 250, 0.1)', color: 'var(--mc-purple)', border: '1px solid rgba(167, 139, 250, 0.3)', display: 'inline-block', marginBottom: '14px' }}>
              02 / DOMAIN KNOWLEDGE · TECHNICAL PM PERSPECTIVE
            </div>
            <h2>
              受発注・基幹連携で、<br />
              なぜCSVの変更は致命的な事故になるのか。
            </h2>
            <p>
              製造業B2BやEC受発注、EDI連携において、最も発見が遅れ甚大な損害をもたらすのが「CSVスキーマ変更によるサイレント障害」です。
              システムがエラーで即時停止してくれればまだ対処できますが、停止せず誤ったデータを取り込み続けるケースが最も危険です。
            </p>
          </div>

          <div className="editorial-grid">
            <article className="editorial-card">
              <small>FAILURE MODE 01</small>
              <h3>列順入れ替えによる「サイレントデータ汚染」</h3>
              <p>
                「列名」ではなく「列のインデックス（0番目、1番目…）」で値を取得する旧来の取込バッチでは、列順が1列ズレただけで、数量の列に単価が入り、納品日列に注文日が入ったまま正常終了してしまいます。誤請求や誤出荷が発生するまで誰も気づけません。
              </p>
            </article>

            <article className="editorial-card">
              <small>FAILURE MODE 02</small>
              <h3>列名重複・空白によるハッシュマップ消失</h3>
              <p>
                Pythonの辞書化やNode.js、JavaのオブジェクトマッピングでCSVを読み込む際、同一ヘッダー名が存在すると後勝ちで値が上書きされます。また空白列名があるとキー生成例外となり、夜間バッチ全体が深夜未明に異常停止します。
              </p>
            </article>

            <article className="editorial-card">
              <small>FAILURE MODE 03</small>
              <h3>セル内改行・エスケープ漏れによる行ズレ</h3>
              <p>
                品名や備考欄に不用意な改行やカンマが含まれ、適切なクォート（&quot;&quot;）でエスケープされていない場合、1つの行が2行に分断され、後続する数万件のデータ全体が1列ずつズレて取り込まれる玉突き事故を引き起こします。
              </p>
            </article>
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="mc-footer" style={{ marginTop: '60px' }}>
          <div>
            <span>RANCORDER.DEV</span>
            <p>PROJECT MISSION CONTROL / CSV FORMAT CHECKER</p>
          </div>
          <div className="mc-footer-state">
            <i /> FREE UTILITY · <Link href="/">HOME</Link> · <Link href="/survival-test">SURVIVAL TEST</Link> · <Link href="/cases/54-site-monitoring">54-SITE MONITORING CASE</Link> · <Link href="/blog">KNOWLEDGE</Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
