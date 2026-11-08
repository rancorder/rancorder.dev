'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import {
  parseCsvSummary,
  compareCsvSchemas,
  CsvDelimiter,
  CsvParseError,
  SchemaComparisonResult,
} from '@/lib/csv-checker';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const SAMPLES = {
  breaking: {
    label: '破壊的変更のサンプル（列削除・列順入替）',
    beforeName: 'orders_2025_v1.csv',
    beforeText: `受注番号,受注日,顧客名,商品コード,数量,単価,配送希望日,決済方法
ORD-1001,2026-03-01,株式会社ヤマダ,ITEM-A,10,1200,2026-03-05,請求書払い
ORD-1002,2026-03-01,田中商事,ITEM-B,5,3400,2026-03-04,クレジットカード
ORD-1003,2026-03-02,佐藤製作所,ITEM-C,20,500,2026-03-06,銀行振込`,
    afterName: 'orders_2026_v2.csv',
    afterText: `受注番号,商品コード,数量,顧客名,単価,決済方法,備考
ORD-2001,ITEM-A,10,株式会社ヤマダ,1200,請求書払い,午前着指定
ORD-2002,ITEM-B,5,田中商事,3400,クレジットカード,至急便
ORD-2003,ITEM-C,20,佐藤製作所,500,銀行振込,通常`,
  },
  compatible: {
    label: '拡張互換のサンプル（末尾列追加）',
    beforeName: 'items_base.csv',
    beforeText: `商品ID,商品名,標準価格,在庫数
P001,高耐久ベアリング,4500,120
P002,シーリングパッキン,850,540`,
    afterName: 'items_extended.csv',
    afterText: `商品ID,商品名,標準価格,在庫数,消費税区分,メーカー型番
P001,高耐久ベアリング,4500,120,標準税率,BRG-45-A
P002,シーリングパッキン,850,540,標準税率,PCK-08-B`,
  },
  identical: {
    label: '完全一致のサンプル（フォーマット変更なし）',
    beforeName: 'daily_export_yesterday.csv',
    beforeText: `code,site_id,status,updated_at
SITE-01,54,OPERATIONAL,2026-03-10T09:00:00Z
SITE-02,54,OPERATIONAL,2026-03-10T09:00:00Z`,
    afterName: 'daily_export_today.csv',
    afterText: `code,site_id,status,updated_at
SITE-01,54,OPERATIONAL,2026-03-11T09:00:00Z
SITE-02,54,OPERATIONAL,2026-03-11T09:00:00Z`,
  },
};

export default function CsvFormatCheckerClient() {
  const [beforeName, setBeforeName] = useState<string>('');
  const [beforeText, setBeforeText] = useState<string>('');
  const [beforeSize, setBeforeSize] = useState<number>(0);

  const [afterName, setAfterName] = useState<string>('');
  const [afterText, setAfterText] = useState<string>('');
  const [afterSize, setAfterSize] = useState<number>(0);

  const [delimiterChoice, setDelimiterChoice] = useState<CsvDelimiter | 'auto'>('auto');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SchemaComparisonResult | null>(null);

  const [dragOverBefore, setDragOverBefore] = useState(false);
  const [dragOverAfter, setDragOverAfter] = useState(false);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);
  // Ignore results from an earlier async read after the user replaces a file.
  const fileReadGeneration = useRef({ before: 0, after: 0 });

  const handleFile = async (
    file: File,
    target: 'before' | 'after'
  ) => {
    const generation = ++fileReadGeneration.current[target];
    // Invalidate the previous comparison immediately, including when validation fails.
    setResult(null);
    setErrorMsg(null);
    if (target === 'before') {
      setBeforeName('');
      setBeforeText('');
      setBeforeSize(0);
    } else {
      setAfterName('');
      setAfterText('');
      setAfterSize(0);
    }

    // File size guard (3MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(
        `ファイル「${file.name}」のサイズ（${(file.size / (1024 * 1024)).toFixed(2)}MB）が制限の3MBを超えています。3MB以下のファイルを選択してください。`
      );
      return;
    }

    // Disclose XLSX check
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
      setErrorMsg(
        'Excel形式（.xlsx / .xls）は現在直接解析できません。Excel上で「CSV (コンマ区切り)」または「テキスト (タブ区切り)」として保存したファイルを選択してください。'
      );
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      if (fileReadGeneration.current[target] !== generation) return;
      // Use fatal: false or inspect for replacement char
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const text = decoder.decode(arrayBuffer);

      if (text.includes('\uFFFD')) {
        setErrorMsg(
          `ファイル「${file.name}」にUTF-8以外の文字（Shift_JIS、Windows-31Jなど）が含まれています。本ツールはUTF-8（BOM付き含む）のみに対応しています。文字コードをUTF-8に変換してから選択してください。`
        );
        return;
      }

      if (target === 'before') {
        setBeforeName(file.name);
        setBeforeText(text);
        setBeforeSize(file.size);
      } else {
        setAfterName(file.name);
        setAfterText(text);
        setAfterSize(file.size);
      }
    } catch {
      if (fileReadGeneration.current[target] === generation) {
        setErrorMsg(`ファイル「${file.name}」の読み込み中にエラーが発生しました。`);
      }
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, target: 'before' | 'after') => {
    e.preventDefault();
    if (target === 'before') setDragOverBefore(false);
    else setDragOverAfter(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleFile(e.dataTransfer.files[0], target);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>, target: 'before' | 'after') => {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = ''; // Allow choosing the same file again after fixing it.
    if (file) void handleFile(file, target);
  };

  const loadSample = (key: keyof typeof SAMPLES) => {
    // No contents, header labels or filenames ever enter analytics.
    track('csv_compare_started', { mode: 'sample' });
    fileReadGeneration.current.before++;
    fileReadGeneration.current.after++;
    if (beforeInputRef.current) beforeInputRef.current.value = '';
    if (afterInputRef.current) afterInputRef.current.value = '';
    setResult(null);
    setErrorMsg(null);
    const sample = SAMPLES[key];
    setBeforeName(sample.beforeName);
    setBeforeText(sample.beforeText);
    setBeforeSize(new Blob([sample.beforeText]).size);

    setAfterName(sample.afterName);
    setAfterText(sample.afterText);
    setAfterSize(new Blob([sample.afterText]).size);

    // Auto run on sample selection for immediate feedback
    try {
      const bSummary = parseCsvSummary(sample.beforeText, { delimiter: delimiterChoice });
      const aSummary = parseCsvSummary(sample.afterText, { delimiter: delimiterChoice });
      const diff = compareCsvSchemas(bSummary, aSummary);
      setResult(diff);
      track('csv_compare_completed', { mode: 'sample', status: diff.status });
    } catch (err: unknown) {
      track('csv_compare_error', { mode: 'sample' });
      if (err instanceof CsvParseError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(err.message);
      }
    }
  };

  const runAnalysis = () => {
    setResult(null);
    setErrorMsg(null);
    if (!beforeText) {
      setErrorMsg('「変更前ファイル (BEFORE)」を選択または入力してください。');
      return;
    }
    if (!afterText) {
      setErrorMsg('「変更後ファイル (AFTER)」を選択または入力してください。');
      return;
    }

    track('csv_compare_started', { mode: 'upload' });
    try {
      const bSummary = parseCsvSummary(beforeText, { delimiter: delimiterChoice });
      const aSummary = parseCsvSummary(afterText, { delimiter: delimiterChoice });
      const diff = compareCsvSchemas(bSummary, aSummary);
      setResult(diff);
      track('csv_compare_completed', { mode: 'upload', status: diff.status });
    } catch (err: unknown) {
      track('csv_compare_error', { mode: 'upload' });
      setResult(null);
      if (err instanceof CsvParseError) {
        setErrorMsg(err.message);
      } else if (err instanceof Error) {
        setErrorMsg(`解析エラー: ${err.message}`);
      } else {
        setErrorMsg('未知のエラーが発生しました。');
      }
    }
  };

  const handleReset = () => {
    fileReadGeneration.current.before++;
    fileReadGeneration.current.after++;
    setBeforeName('');
    setBeforeText('');
    setBeforeSize(0);
    setAfterName('');
    setAfterText('');
    setAfterSize(0);
    setResult(null);
    setErrorMsg(null);
    if (beforeInputRef.current) beforeInputRef.current.value = '';
    if (afterInputRef.current) afterInputRef.current.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const delimiterLabel = (d: CsvDelimiter) => {
    if (d === ',') return 'カンマ (,)';
    if (d === '\t') return 'タブ (\\t)';
    return 'セミコロン (;)';
  };

  // Build mailto body based on analysis result if available
  const mailSubject = encodeURIComponent(
    `[CSV運用相談] フォーマット変更・変換パイプラインの相談 (${
      result ? result.statusLabel : 'CSV変更チェック'
    })`
  );
  const mailBody = encodeURIComponent(
    [
      '【ご相談の背景・状況】',
      result
        ? `判定ステータス: ${result.statusLabel} (変更前: ${result.beforeColumnCount}列 / 変更後: ${result.afterColumnCount}列)`
        : 'CSV・Excelの変更による受発注や基幹システム取込エラーについて相談したいです。',
      '',
      '【発生している課題・ご質問】',
      '・取引先や生成元システムからのCSV変更でバッチが停止する/エラーになる',
      '・CSVのスキーマ差分吸収やデータ変換パイプラインの自動化を設計したい',
      '・PoCから本番運用への責任境界や例外ハンドリングを相談したい',
      '',
      '※本メールには実際の顧客情報・機密行データは含めず、列定義や運用課題のみをご記載ください。',
    ].join('\n')
  );
  const mailtoUrl = `mailto:hello@rancorder.dev?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div className="checker-interface">
      <div className="interface-head">
        <div className="interface-title">
          <i />
          <span>SCHEMA COMPARISON CONSOLE</span>
        </div>

        <div className="delimiter-control">
          <label htmlFor="delim-select">区切り文字指定:</label>
          <select
            id="delim-select"
            className="delimiter-select"
            value={delimiterChoice}
            onChange={(e) => {
              setDelimiterChoice(e.target.value as CsvDelimiter | 'auto');
              setResult(null); // Prior results use the previous delimiter setting.
              setErrorMsg(null);
            }}
          >
            <option value="auto">自動検出 (Auto)</option>
            <option value=",">カンマ (CSV)</option>
            <option value={'\t'}>タブ (TSV)</option>
            <option value=";">セミコロン (;)</option>
          </select>
        </div>
      </div>

      <div className="sample-presets">
        <span>クイック検証用サンプル:</span>
        <button
          type="button"
          className="preset-btn"
          onClick={() => loadSample('breaking')}
        >
          {SAMPLES.breaking.label}
        </button>
        <button
          type="button"
          className="preset-btn"
          onClick={() => loadSample('compatible')}
        >
          {SAMPLES.compatible.label}
        </button>
        <button
          type="button"
          className="preset-btn"
          onClick={() => loadSample('identical')}
        >
          {SAMPLES.identical.label}
        </button>
      </div>

      <div className="checker-dropzones">
        {/* BEFORE Dropzone */}
        <div
          className={`dropzone ${dragOverBefore ? 'dragover' : ''} ${
            beforeText ? 'has-content' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverBefore(true);
          }}
          onDragLeave={() => setDragOverBefore(false)}
          onDrop={(e) => onDrop(e, 'before')}
        >
          <div className="dropzone-head">
            <span className="dropzone-label before">01 / BEFORE (変更前のCSV)</span>
            {beforeSize > 0 && <span className="dropzone-badge">{formatBytes(beforeSize)}</span>}
          </div>

          <input
            ref={beforeInputRef}
            type="file"
            accept=".csv,.tsv,.txt"
            className="file-input-hidden"
            onChange={(e) => onFileChange(e, 'before')}
            title="変更前ファイルを選択"
          />

          <div className="dropzone-body">
            {beforeText ? (
              <div className="file-loaded-info">
                <div className="file-name">{beforeName || '変更前ファイル'}</div>
                <div className="file-meta">
                  <span>読込完了</span>
                  <span>クリックまたはドロップで再選択</span>
                </div>
                <div className="preview-box">
                  {beforeText.slice(0, 300)}
                  {beforeText.length > 300 ? '...' : ''}
                </div>
              </div>
            ) : (
              <>
                <div className="dropzone-icon">📥</div>
                <div className="dropzone-text">
                  クリックして変更前CSVを選択、またはドラッグ＆ドロップ
                </div>
                <div className="dropzone-sub">.csv / .tsv / .txt (最大 3MB / UTF-8)</div>
              </>
            )}
          </div>
        </div>

        {/* AFTER Dropzone */}
        <div
          className={`dropzone ${dragOverAfter ? 'dragover' : ''} ${
            afterText ? 'has-content' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverAfter(true);
          }}
          onDragLeave={() => setDragOverAfter(false)}
          onDrop={(e) => onDrop(e, 'after')}
        >
          <div className="dropzone-head">
            <span className="dropzone-label after">02 / AFTER (変更後のCSV)</span>
            {afterSize > 0 && <span className="dropzone-badge">{formatBytes(afterSize)}</span>}
          </div>

          <input
            ref={afterInputRef}
            type="file"
            accept=".csv,.tsv,.txt"
            className="file-input-hidden"
            onChange={(e) => onFileChange(e, 'after')}
            title="変更後ファイルを選択"
          />

          <div className="dropzone-body">
            {afterText ? (
              <div className="file-loaded-info">
                <div className="file-name">{afterName || '変更後ファイル'}</div>
                <div className="file-meta">
                  <span>読込完了</span>
                  <span>クリックまたはドロップで再選択</span>
                </div>
                <div className="preview-box">
                  {afterText.slice(0, 300)}
                  {afterText.length > 300 ? '...' : ''}
                </div>
              </div>
            ) : (
              <>
                <div className="dropzone-icon">📤</div>
                <div className="dropzone-text">
                  クリックして変更後CSVを選択、またはドラッグ＆ドロップ
                </div>
                <div className="dropzone-sub">.csv / .tsv / .txt (最大 3MB / UTF-8)</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="checker-actions">
        <button
          type="button"
          className="btn-run"
          onClick={runAnalysis}
          disabled={!beforeText || !afterText}
        >
          <span>DIFF & RISK SCAN 実行</span>
          <i>→</i>
        </button>

        <button type="button" className="btn-reset" onClick={handleReset}>
          クリア
        </button>
      </div>

      {errorMsg && (
        <div className="checker-error" role="alert">
          <strong>PARSE ERROR DETECTED</strong>
          <span>{errorMsg}</span>
        </div>
      )}

      {result && (
        <div className="result-container">
          {/* Status Banner */}
          <div className={`status-banner status-${result.status}`}>
            <div className="status-badge-group">
              <span className="status-tag">{result.status}</span>
              <div className="status-desc">
                <h3>{result.statusLabel}</h3>
                <p>
                  変更前: {result.beforeColumnCount}列 / 変更後: {result.afterColumnCount}列 /
                  区切り: {delimiterLabel(result.afterDelimiter)}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics comparison */}
          <div className="metrics-comparison">
            <div className="metric-panel">
              <div className="metric-panel-head before">
                <span>BEFORE METRICS</span>
                <span>{beforeName || 'BEFORE'}</span>
              </div>
              <div className="metric-grid">
                <div className="metric-cell">
                  <small>列数</small>
                  <strong>{result.beforeColumnCount}</strong>
                  <span>COLUMNS</span>
                </div>
                <div className="metric-cell">
                  <small>区切り文字</small>
                  <strong>{result.beforeDelimiter === '\t' ? 'TSV' : result.beforeDelimiter}</strong>
                  <span>DELIMITER</span>
                </div>
                <div className="metric-cell">
                  <small>データ行数</small>
                  <strong>{result.before.totalDataRows}</strong>
                  <span>ROWS</span>
                </div>
                <div className="metric-cell">
                  <small>BOMヘッダー</small>
                  <strong>{result.before.hasBom ? 'YES' : 'NO'}</strong>
                  <span>UTF-8 BOM</span>
                </div>
              </div>
            </div>

            <div className="metric-panel">
              <div className="metric-panel-head after">
                <span>AFTER METRICS</span>
                <span>{afterName || 'AFTER'}</span>
              </div>
              <div className="metric-grid">
                <div className="metric-cell">
                  <small>列数</small>
                  <strong>{result.afterColumnCount}</strong>
                  <span>COLUMNS</span>
                </div>
                <div className="metric-cell">
                  <small>区切り文字</small>
                  <strong>{result.afterDelimiter === '\t' ? 'TSV' : result.afterDelimiter}</strong>
                  <span>DELIMITER</span>
                </div>
                <div className="metric-cell">
                  <small>データ行数</small>
                  <strong>{result.after.totalDataRows}</strong>
                  <span>ROWS</span>
                </div>
                <div className="metric-cell">
                  <small>BOMヘッダー</small>
                  <strong>{result.after.hasBom ? 'YES' : 'NO'}</strong>
                  <span>UTF-8 BOM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Schema Diff List */}
          <div className="schema-diff-box">
            <div className="schema-diff-head">
              <h4>COLUMN SCHEMA DIFFERENCES</h4>
              <div className="schema-diff-stats">
                <span className="stat-tag tag-removed">
                  <i /> 削除: {result.removedColumns.length}
                </span>
                <span className="stat-tag tag-moved">
                  <i /> 移動: {result.movedColumns.length}
                </span>
                <span className="stat-tag tag-added">
                  <i /> 追加: {result.addedColumns.length}
                </span>
                <span className="stat-tag tag-unchanged">
                  <i /> 一致: {result.unchangedColumns.length - result.movedColumns.length}
                </span>
              </div>
            </div>

            <div className="column-diff-list">
              {/* Removed columns */}
              {result.removedColumns.map((col) => (
                <div key={`rem-${col}`} className="diff-row removed">
                  <span className="diff-type-badge">REMOVED</span>
                  <span className="diff-col-name">{col}</span>
                  <span className="diff-col-pos">変更前ファイルのみに存在</span>
                  <span className="diff-col-note">
                    既存取込ロジックで必須キー未定義エラー・NOT NULL例外のリスク
                  </span>
                </div>
              ))}

              {/* Moved columns */}
              {result.movedColumns.map((m) => (
                <div key={`mov-${m.name}`} className="diff-row moved">
                  <span className="diff-type-badge">MOVED</span>
                  <span className="diff-col-name">{m.name}</span>
                  <span className="diff-col-pos">
                    列 {m.fromIndex} → 列 {m.toIndex}
                  </span>
                  <span className="diff-col-note">
                    インデックス指定による取込処理で値の混入・サイレントデータ破壊リスク
                  </span>
                </div>
              ))}

              {/* Added columns */}
              {result.addedColumns.map((col) => (
                <div key={`add-${col}`} className="diff-row added">
                  <span className="diff-type-badge">ADDED</span>
                  <span className="diff-col-name">{col}</span>
                  <span className="diff-col-pos">変更後ファイルに新規追加</span>
                  <span className="diff-col-note">
                    固定列数バリデーションがある場合は取込拒否のリスク
                  </span>
                </div>
              ))}

              {/* Unchanged columns */}
              {result.unchangedColumns
                .filter((c) => !result.movedColumns.some((m) => m.name === c))
                .map((col) => {
                  const bIdx = result.before.headers.indexOf(col) + 1;
                  return (
                    <div key={`unc-${col}`} className="diff-row unchanged">
                      <span className="diff-type-badge">UNCHANGED</span>
                      <span className="diff-col-name">{col}</span>
                      <span className="diff-col-pos">列 {bIdx} (位置維持)</span>
                      <span className="diff-col-note">スキーマ整合</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Anomaly warnings (duplicates, blanks, irregular rows) */}
          {(result.after.headerIssues.duplicateHeaders.length > 0 ||
            result.after.headerIssues.emptyHeaders.length > 0 ||
            result.after.irregularRowCount > 0 ||
            result.before.irregularRowCount > 0) && (
            <div className="anomaly-section">
              <h4>FORMAT & INTEGRITY ANOMALIES DETECTED</h4>
              <ul>
                {result.after.headerIssues.duplicateHeaders.map((d) => (
                  <li key={`dup-${d.name}`}>
                    <strong>重複列名:</strong> 列名「{d.name}」が列 {d.indices.join(' と 列 ')}{' '}
                    で重複しています。ハッシュマップ/辞書取込で値の上書き欠損が発生します。
                  </li>
                ))}
                {result.after.headerIssues.emptyHeaders.length > 0 && (
                  <li>
                    <strong>空のヘッダー名:</strong> 列{' '}
                    {result.after.headerIssues.emptyHeaders.join(', ')}{' '}
                    の列名が空白です。DB自動マッピングでNullキーエラーとなります。
                  </li>
                )}
                {result.after.irregularRowCount > 0 && (
                  <li>
                    <strong>変更後ファイルの列数不一致行:</strong> 合計{' '}
                    {result.after.irregularRowCount} 行でヘッダー列数との不一致があります。
                    {result.after.irregularRowSamples.length > 0 && (
                      <span>
                        （例: 行 {result.after.irregularRowSamples.map((s) => s.rowNumber).join(', ')}）
                      </span>
                    )}
                  </li>
                )}
                {result.before.irregularRowCount > 0 && (
                  <li>
                    <strong>変更前ファイルの列数不一致行:</strong> 合計{' '}
                    {result.before.irregularRowCount} 行で列数の不一致が検出されました。
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Operational Risks */}
          {result.risks.length > 0 && (
            <div className="operational-risks">
              <div className="risks-head">
                <h4>OPERATIONAL CONSEQUENCES & FAILURE MODES</h4>
                <span>受発注・基幹連携への影響判定</span>
              </div>
              <div className="risks-list">
                {result.risks.map((risk, idx) => (
                  <div key={idx} className={`risk-card severity-${risk.severity}`}>
                    <div className="risk-top">
                      <span className="risk-badge">{risk.severity}</span>
                      <h5>{risk.title}</h5>
                    </div>
                    <div className="risk-detail">{risk.detail}</div>
                    <div className="risk-impact">
                      <b>【業務・システムへの影響】:</b> {risk.operationalImpact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consultation Hand-off CTA */}
      <div className="checker-editorial">
        <div className="checker-funnel">
          <div className="funnel-layout">
            <div className="funnel-copy">
              <div className="status-tag" style={{ background: 'var(--mc-purple)', color: '#070311', display: 'inline-block', marginBottom: '14px' }}>
                TECHNICAL PM DATA PIPELINE CONSULTATION
              </div>
              <h2>
                CSVの仕様変更を、<br />
                <span>現場の残業とバッチ停止で終わらせない。</span>
              </h2>
              <p>
                取引先や基幹システムのCSVフォーマット変更によるサイレントデータ破壊、深夜の緊急手作業、改修費用の膨張を防ぎます。
                スキーマ変更に強い自動変換パイプラインの設計、責任境界の策定、例外エスカレーションの構築をTechnical PMとして支援します。
              </p>
              <div className="funnel-guarantees">
                <span><i>✓</i> 100% ブラウザ内完結・データ送信なし</span>
                <span><i>✓</i> 個人情報・会員登録の入力不要</span>
                <span><i>✓</i> 製造業B2B・受発注運用の知見に基づく設計</span>
              </div>
            </div>

            <div className="funnel-action-box">
              <a href={mailtoUrl} className="btn-consult" onClick={() => track('consultation_cta_clicked', { source: 'csv_checker' })}>
                <span>データ変換・運用設計のメール相談を開く</span>
                <i>→</i>
              </a>

              <Link href="/survival-test" className="btn-sub-link">
                <span>PoC SURVIVAL TEST で運用診断を受ける</span>
                <i>↗</i>
              </Link>

              <Link href="/cases/54-site-monitoring" className="btn-sub-link">
                <span>CASE STUDY: 54サイト監視・データ運用の事例を見る</span>
                <i>↗</i>
              </Link>

              <div className="funnel-disclaimer">
                ※ メール相談はTechnical PM（rancorder運営者）が一次確認します。受信・即時返答を機械的に保証するものではありません。機密データ本体は記載せず、スキーマや運用課題の概要をご連絡ください。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
