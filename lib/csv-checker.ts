/**
 * CSV / TSV Schema Comparison Engine
 * 
 * Client-side only. RFC 4180 compliant with support for:
 * - Comma (,), Tab (\t), Semicolon (;) delimiters
 * - UTF-8 with / without BOM (\uFEFF)
 * - CRLF (\r\n), LF (\n), CR (\r) line breaks
 * - Quoted fields, escaped quotes (""), multiline quoted fields
 * - Strict syntax verification (fails clearly on malformed CSV or non-UTF8 encoding)
 * - Zero row-data retention (only headers and row-count metrics are retained)
 */

export type CsvDelimiter = ',' | '\t' | ';';

export interface ParseCsvOptions {
  delimiter?: CsvDelimiter | 'auto';
  maxIrregularRowSamples?: number;
}

export interface HeaderIssue {
  emptyHeaders: number[]; // 1-based column indices with empty names
  duplicateHeaders: Array<{
    name: string;
    indices: number[]; // 1-based column indices
  }>;
}

export interface RowCountMismatch {
  rowNumber: number; // 1-based line/row index
  expected: number;
  actual: number;
}

export interface ParsedCsvSummary {
  delimiter: CsvDelimiter;
  hasBom: boolean;
  totalDataRows: number;
  headers: string[];
  headerIssues: HeaderIssue;
  irregularRowCount: number;
  irregularRowSamples: RowCountMismatch[];
}

export interface ColumnMove {
  name: string;
  fromIndex: number; // 1-based index in BEFORE
  toIndex: number;   // 1-based index in AFTER
}

export type ComparisonStatus = 'IDENTICAL' | 'COMPATIBLE_EXTENDED' | 'BREAKING_CHANGES';

export interface OperationalRisk {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  detail: string;
  operationalImpact: string;
}

export interface SchemaComparisonResult {
  status: ComparisonStatus;
  statusLabel: string;
  isIdentical: boolean;
  delimiterChanged: boolean;
  beforeDelimiter: CsvDelimiter;
  afterDelimiter: CsvDelimiter;
  beforeColumnCount: number;
  afterColumnCount: number;
  addedColumns: string[];
  removedColumns: string[];
  movedColumns: ColumnMove[];
  unchangedColumns: string[];
  reordered: boolean;
  before: ParsedCsvSummary;
  after: ParsedCsvSummary;
  risks: OperationalRisk[];
}

export class CsvParseError extends Error {
  line: number;
  column: number;

  constructor(message: string, line: number, column: number) {
    super(`CSVパースエラー (行 ${line}, 列 ${column}): ${message}`);
    this.name = 'CsvParseError';
    this.line = line;
    this.column = column;
  }
}

/**
 * Detect the delimiter by the structure of the first logical records.
 * Counting all punctuation misidentifies TSV when unquoted data contains commas.
 * Quoted delimiters and quoted newlines are ignored.
 */
export function detectDelimiter(text: string): CsvDelimiter {
  const candidates: CsvDelimiter[] = [',', '\t', ';'];
  const records: number[][] = [];
  let widths = [1, 1, 1];
  let inQuotes = false;
  let recordStarted = false;
  const limit = Math.min(text.length, 65536);

  for (let i = 0; i < limit && records.length < 12; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      recordStarted = true;
      continue;
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      if (recordStarted) records.push(widths);
      widths = [1, 1, 1];
      recordStarted = false;
      if (ch === '\r' && text[i + 1] === '\n') i++;
      continue;
    }

    if (!inQuotes) {
      for (let j = 0; j < candidates.length; j++) {
        if (ch === candidates[j]) widths[j]++;
      }
    }
    recordStarted = true;
  }

  if (recordStarted && records.length < 12) records.push(widths);
  if (!records.length) return ',';

  let chosen: CsvDelimiter = ',';
  let bestScore = -Infinity;
  for (let j = 0; j < candidates.length; j++) {
    const headerColumns = records[0][j];
    if (headerColumns <= 1) continue;

    // A real delimiter should yield the same number of columns across records.
    // Header structure is mandatory; frequent commas only in TSV data cannot win.
    const dataWidths = records.slice(1).map((record) => record[j]);
    const matching = dataWidths.filter((width) => width === headerColumns).length;
    const mismatching = dataWidths.length - matching;
    const score = matching * 8 - mismatching * 4 + headerColumns - 1;

    if (score > bestScore) {
      bestScore = score;
      chosen = candidates[j];
    }
  }
  return chosen;
}

/**
 * Parses CSV/TSV/DSV text and returns summary metrics and headers only.
 * No data row contents are retained.
 */
export function parseCsvSummary(text: string, options: ParseCsvOptions = {}): ParsedCsvSummary {
  if (!text || text.trim().length === 0) {
    throw new CsvParseError('ファイルが空です。', 1, 1);
  }

  // Detect replacement character \uFFFD from corrupted non-UTF8 decoding
  if (text.includes('\uFFFD')) {
    throw new CsvParseError(
      'UTF-8以外の文字コード（Shift_JIS、Windows-31J等）が含まれている可能性があります。UTF-8（BOM付き含む）で保存されたファイルを選択してください。',
      1,
      1
    );
  }

  let content = text;
  let hasBom = false;
  if (content.charCodeAt(0) === 0xfeff) {
    hasBom = true;
    content = content.slice(1);
  }

  const delimiter: CsvDelimiter =
    options.delimiter && options.delimiter !== 'auto'
      ? options.delimiter
      : detectDelimiter(content);

  const maxSamples = options.maxIrregularRowSamples ?? 25;

  let headers: string[] | null = null;
  let totalDataRows = 0;
  let irregularRowCount = 0;
  const irregularRowSamples: RowCountMismatch[] = [];

  // State machine variables
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let atStartOfField = true;

  let currentLine = 1;
  let currentFieldStartCol = 1;
  let currentCharCol = 1;
  let actualRowNumber = 1;

  const len = content.length;

  for (let i = 0; i < len; i++) {
    const ch = content[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < len && content[i + 1] === '"') {
          // Escaped quote
          currentField += '"';
          i++;
          currentCharCol += 2;
        } else {
          // Closing quote
          inQuotes = false;
          currentCharCol++;

          // Verify character immediately after closing quote
          if (i + 1 < len) {
            const nextCh = content[i + 1];
            if (nextCh !== delimiter && nextCh !== '\r' && nextCh !== '\n') {
              // Whitespace might precede delimiter in loose parsers, but non-delimiter is an error
              let lookahead = i + 1;
              while (lookahead < len && (content[lookahead] === ' ' || content[lookahead] === '\t') && delimiter !== '\t') {
                lookahead++;
              }
              if (lookahead < len && content[lookahead] !== delimiter && content[lookahead] !== '\r' && content[lookahead] !== '\n') {
                throw new CsvParseError(
                  `閉じクォートの後ろに不正な文字「${content[i + 1]}」が続いています。クォートされたフィールドは区切り文字または改行で終了する必要があります。`,
                  currentLine,
                  currentCharCol
                );
              }
            }
          }
        }
      } else {
        currentField += ch;
        if (ch === '\n') {
          currentLine++;
          currentCharCol = 1;
        } else {
          currentCharCol++;
        }
      }
    } else {
      // Not in quotes
      if (atStartOfField && ch === '"') {
        inQuotes = true;
        atStartOfField = false;
        currentFieldStartCol = currentCharCol;
        currentCharCol++;
      } else if (ch === delimiter) {
        currentRow.push(currentField);
        currentField = '';
        atStartOfField = true;
        currentCharCol++;
        currentFieldStartCol = currentCharCol;
      } else if (ch === '\r') {
        // Handle CRLF or CR
        if (i + 1 < len && content[i + 1] === '\n') {
          i++;
        }
        currentRow.push(currentField);
        processParsedRow(currentRow, actualRowNumber);
        actualRowNumber++;
        currentRow = [];
        currentField = '';
        atStartOfField = true;
        currentLine++;
        currentCharCol = 1;
        currentFieldStartCol = 1;
      } else if (ch === '\n') {
        currentRow.push(currentField);
        processParsedRow(currentRow, actualRowNumber);
        actualRowNumber++;
        currentRow = [];
        currentField = '';
        atStartOfField = true;
        currentLine++;
        currentCharCol = 1;
        currentFieldStartCol = 1;
      } else {
        if (ch === '"') {
          throw new CsvParseError(
            'クォートで囲まれていないフィールドの途中に不正なクォート文字（"）があります。',
            currentLine,
            currentCharCol
          );
        }
        currentField += ch;
        atStartOfField = false;
        currentCharCol++;
      }
    }
  }

  // End of file handling
  if (inQuotes) {
    throw new CsvParseError(
      'クォート文字（"）が閉じられないままファイルの終端に達しました。',
      currentLine,
      currentCharCol
    );
  }

  // Final row if remaining
  if (currentRow.length > 0 || currentField.length > 0 || !atStartOfField) {
    currentRow.push(currentField);
    // An explicitly quoted empty field is a real record, not an empty trailing line.
    processParsedRow(currentRow, actualRowNumber);
  }

  function processParsedRow(row: string[], rowNum: number) {
    if (headers === null) {
      headers = row; // Preserve exact column keys; leading/trailing whitespace is significant.
      return;
    }

    totalDataRows++;
    const expected = headers.length;
    const actual = row.length;

    if (actual !== expected) {
      irregularRowCount++;
      if (irregularRowSamples.length < maxSamples) {
        irregularRowSamples.push({
          rowNumber: rowNum,
          expected,
          actual,
        });
      }
    }
  }

  if (headers === null) {
    throw new CsvParseError('ヘッダー行が見つかりませんでした。', 1, 1);
  }

  const headerIssues = inspectHeaders(headers);

  return {
    delimiter,
    hasBom,
    totalDataRows,
    headers,
    headerIssues,
    irregularRowCount,
    irregularRowSamples,
  };
}

/**
 * Inspect header row for empty or duplicate names
 */
export function inspectHeaders(headers: string[]): HeaderIssue {
  const emptyHeaders: number[] = [];
  const nameToIndices = new Map<string, number[]>();

  for (let i = 0; i < headers.length; i++) {
    const colNumber = i + 1;
    const name = headers[i];

    if (!name || name.trim().length === 0) {
      emptyHeaders.push(colNumber);
    }

    const key = name; // Distinct exact names must not be conflated with trimmed names.
    if (key.length > 0) {
      const existing = nameToIndices.get(key) || [];
      existing.push(colNumber);
      nameToIndices.set(key, existing);
    }
  }

  const duplicateHeaders: Array<{ name: string; indices: number[] }> = [];
  nameToIndices.forEach((indices, name) => {
    if (indices.length > 1) {
      duplicateHeaders.push({ name, indices });
    }
  });

  return {
    emptyHeaders,
    duplicateHeaders,
  };
}

/**
 * Compares BEFORE and AFTER CSV summaries and performs schema diffing & risk assessment
 */
export function compareCsvSchemas(
  before: ParsedCsvSummary,
  after: ParsedCsvSummary
): SchemaComparisonResult {
  const beforeDelimiter = before.delimiter;
  const afterDelimiter = after.delimiter;
  const delimiterChanged = beforeDelimiter !== afterDelimiter;

  const beforeHeaders = before.headers;
  const afterHeaders = after.headers;

  const beforeMap = new Map<string, number>();
  beforeHeaders.forEach((h, idx) => {
    if (h && !beforeMap.has(h)) beforeMap.set(h, idx + 1);
  });

  const afterMap = new Map<string, number>();
  afterHeaders.forEach((h, idx) => {
    if (h && !afterMap.has(h)) afterMap.set(h, idx + 1);
  });

  const removedColumns: string[] = [];
  const movedColumns: ColumnMove[] = [];
  const unchangedColumns: string[] = [];

  beforeHeaders.forEach((h, bIdx) => {
    if (!h) return;
    const beforePos = bIdx + 1;
    const afterPos = afterMap.get(h);

    if (afterPos === undefined) {
      removedColumns.push(h);
    } else if (afterPos !== beforePos) {
      movedColumns.push({
        name: h,
        fromIndex: beforePos,
        toIndex: afterPos,
      });
      unchangedColumns.push(h);
    } else {
      unchangedColumns.push(h);
    }
  });

  const addedColumns: string[] = [];
  afterHeaders.forEach((h) => {
    if (!h) return;
    if (!beforeMap.has(h)) {
      addedColumns.push(h);
    }
  });

  // Check if common columns are in the exact same relative order
  const commonBefore = beforeHeaders.filter((h) => afterMap.has(h));
  const commonAfter = afterHeaders.filter((h) => beforeMap.has(h));
  const reordered = commonBefore.join('\u0000') !== commonAfter.join('\u0000');

  // Check if identical
  const isIdentical =
    !delimiterChanged &&
    beforeHeaders.length === afterHeaders.length &&
    beforeHeaders.every((h, i) => h === afterHeaders[i]) &&
    before.irregularRowCount === 0 &&
    after.irregularRowCount === 0;

  // Determine overall status
  let status: ComparisonStatus = 'IDENTICAL';
  let statusLabel = '完全一致 (変更なし)';

  if (!isIdentical) {
    if (
      removedColumns.length > 0 ||
      movedColumns.length > 0 ||
      delimiterChanged ||
      after.headerIssues.emptyHeaders.length > 0 ||
      after.headerIssues.duplicateHeaders.length > 0 ||
      after.irregularRowCount > 0
    ) {
      status = 'BREAKING_CHANGES';
      statusLabel = '破壊的変更あり (要修正・運用確認)';
    } else {
      // Only added columns at end or safe additions
      status = 'COMPATIBLE_EXTENDED';
      statusLabel = '拡張互換 (列追加のみ)';
    }
  }

  // Build risk assessment with operational impacts
  const risks: OperationalRisk[] = [];

  if (delimiterChanged) {
    const delimLabel = (d: CsvDelimiter) =>
      d === ',' ? 'カンマ (,)' : d === '\t' ? 'タブ (TSV)' : 'セミコロン (;)';
    risks.push({
      severity: 'CRITICAL',
      title: '区切り文字の変更',
      detail: `変更前: ${delimLabel(beforeDelimiter)} → 変更後: ${delimLabel(afterDelimiter)}`,
      operationalImpact:
        '基幹システム・取込バッチが指定以外の区切り文字を認識できず、1行全体を単一列として誤認識するか、バッチ全体が即座に異常停止します。',
    });
  }

  if (removedColumns.length > 0) {
    risks.push({
      severity: 'CRITICAL',
      title: `列の削除 (${removedColumns.length}件)`,
      detail: `削除された列: ${removedColumns.slice(0, 5).join(', ')}${removedColumns.length > 5 ? ' ほか' : ''}`,
      operationalImpact:
        '受注ID、金額、配送先などの必須項目が欠落した場合、受発注取込エラー・DB更新例外（NOT NULL制約違反）が発生し、注文処理が滞留します。',
    });
  }

  if (movedColumns.length > 0) {
    risks.push({
      severity: 'CRITICAL',
      title: `列順序の変更 (${movedColumns.length}件)`,
      detail: movedColumns
        .slice(0, 3)
        .map((m) => `「${m.name}」: 列${m.fromIndex} → 列${m.toIndex}`)
        .join('、') + (movedColumns.length > 3 ? ' ほか' : ''),
      operationalImpact:
        '列インデックス（位置指定）で取込を行うシステムの場合、サイレントデータ破壊（例: 注文番号の列に顧客名が入る、単価と数量が入れ替わるなど）を引き起こし、発見が遅れ甚大な業務被害になります。',
    });
  }

  if (addedColumns.length > 0) {
    const severity = movedColumns.length > 0 ? 'WARNING' : 'INFO';
    risks.push({
      severity,
      title: `列の追加 (${addedColumns.length}件)`,
      detail: `追加された列: ${addedColumns.slice(0, 5).join(', ')}${addedColumns.length > 5 ? ' ほか' : ''}`,
      operationalImpact:
        'ヘッダー名によるバインディングを行うシステムであれば無害な場合もありますが、固定列数を期待する古いシステムでは「列数超過エラー」で取込が拒否されます。',
    });
  }

  if (after.headerIssues.duplicateHeaders.length > 0) {
    risks.push({
      severity: 'CRITICAL',
      title: `変更後ファイルに重複ヘッダー名が存在 (${after.headerIssues.duplicateHeaders.length}件)`,
      detail: after.headerIssues.duplicateHeaders
        .map((d) => `「${d.name}」（列 ${d.indices.join(', ')}）`)
        .join('、'),
      operationalImpact:
        '辞書型マッピングを行う処理系（Python pandas, Node.js csv-parser等）で、後勝ちによる値の上書きが発生し、片方の列データが永久に消失します。',
    });
  }

  if (after.headerIssues.emptyHeaders.length > 0) {
    risks.push({
      severity: 'CRITICAL',
      title: `変更後ファイルに空の列名が存在 (${after.headerIssues.emptyHeaders.length}件)`,
      detail: `列 ${after.headerIssues.emptyHeaders.join(', ')} のヘッダー名が未定義（空白）です。`,
      operationalImpact:
        'DBカラム名自動マッピングでNullPointerまたはキー生成例外となり、インポート処理全体が中断します。',
    });
  }

  if (after.irregularRowCount > 0) {
    risks.push({
      severity: 'CRITICAL',
      title: `変更後ファイルに列数不一致の行が存在 (${after.irregularRowCount}行)`,
      detail: `ヘッダー列数(${afterHeaders.length})と合致しない行が ${after.irregularRowCount}行 検出されました。`,
      operationalImpact:
        '改行抜けやセル内の不正なカンマ混入が原因である可能性が高く、後続の行データ全体がズレて取り込まれる致命的なデータ汚染の原因になります。',
    });
  }

  if (before.irregularRowCount > 0) {
    risks.push({
      severity: 'WARNING',
      title: `変更前ファイルにも列数不一致行が存在 (${before.irregularRowCount}行)`,
      detail: `変更前ファイルの ${before.irregularRowCount}行 で列数の食い違いが検出されました。`,
      operationalImpact:
        '既存のCSV生成元システムに既にフォーマット不正がある可能性があります。',
    });
  }

  return {
    status,
    statusLabel,
    isIdentical,
    delimiterChanged,
    beforeDelimiter,
    afterDelimiter,
    beforeColumnCount: beforeHeaders.length,
    afterColumnCount: afterHeaders.length,
    addedColumns,
    removedColumns,
    movedColumns,
    unchangedColumns,
    reordered,
    before,
    after,
    risks,
  };
}
