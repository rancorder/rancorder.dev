#!/usr/bin/env node

/**
 * CSV Checker Unit Test Suite
 * 
 * Verifies CSV parsing and schema diffing against RFC 4180 and business edge cases:
 * - Comma, Tab, Semicolon delimiters
 * - UTF-8 BOM (\uFEFF) handling
 * - Multiline and quoted fields
 * - Escaped quotes ("")
 * - Malformed quotes and syntax failures
 * - Unsupported encoding detection (\uFFFD)
 * - Empty and duplicate column headers
 * - Column count mismatches in data rows
 * - Schema diffing: added, removed, moved columns, unchanged schema
 */

const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const ts = require('typescript');

// Load and transpile lib/csv-checker.ts
const libPath = path.join(__dirname, '../lib/csv-checker.ts');
const sourceCode = fs.readFileSync(libPath, 'utf8');
const transpiled = ts.transpileModule(sourceCode, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const mod = { exports: {} };
const runner = new Function('require', 'module', 'exports', transpiled);
runner(require, mod, mod.exports);

const {
  CsvParseError,
  detectDelimiter,
  parseCsvSummary,
  inspectHeaders,
  compareCsvSchemas,
} = mod.exports;

console.log('🧪 Starting CSV Format Checker Unit Tests...\n');

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err.message}`);
    failCount++;
  }
}

// 1. Delimiter Detection
test('Delimiter detection for comma, tab, semicolon', () => {
  assert.equal(detectDelimiter('id,name,price\n1,apple,100'), ',');
  assert.equal(detectDelimiter('id\tname\tprice\n1\tapple\t100'), '\t');
  assert.equal(detectDelimiter('id;name;price\n1;apple;100'), ';');
  assert.equal(detectDelimiter('"col;1","col;2","col;3"\n1,2,3'), ',');
});

// 2. Comma-separated CSV parsing
test('Standard comma-separated CSV with CRLF', () => {
  const csv = 'order_id,item_name,quantity\r\nORD-001,Widget A,10\r\nORD-002,Widget B,20\r\n';
  const res = parseCsvSummary(csv);
  assert.equal(res.delimiter, ',');
  assert.equal(res.hasBom, false);
  assert.deepEqual(res.headers, ['order_id', 'item_name', 'quantity']);
  assert.equal(res.totalDataRows, 2);
  assert.equal(res.irregularRowCount, 0);
  assert.equal(res.headerIssues.emptyHeaders.length, 0);
  assert.equal(res.headerIssues.duplicateHeaders.length, 0);
});

// 3. Tab-separated TSV parsing
test('Tab-separated TSV', () => {
  const tsv = 'code\tdescription\tstatus\nA01\tSample description\tACTIVE\nA02\tSecond\tPENDING';
  const res = parseCsvSummary(tsv);
  assert.equal(res.delimiter, '\t');
  assert.deepEqual(res.headers, ['code', 'description', 'status']);
  assert.equal(res.totalDataRows, 2);
  assert.equal(res.irregularRowCount, 0);
});

// 4. Semicolon-separated CSV parsing
test('Semicolon-separated values', () => {
  const dsv = 'id;title;cost\n1;Item A;100\n2;Item B;200';
  const res = parseCsvSummary(dsv);
  assert.equal(res.delimiter, ';');
  assert.deepEqual(res.headers, ['id', 'title', 'cost']);
  assert.equal(res.totalDataRows, 2);
  assert.equal(res.irregularRowCount, 0);
});

// 5. UTF-8 BOM Handling
test('UTF-8 BOM (\\uFEFF) stripped and flagged correctly', () => {
  const bomCsv = '\uFEFFid,sku,stock\n1,SKU-01,50';
  const res = parseCsvSummary(bomCsv);
  assert.equal(res.hasBom, true);
  assert.deepEqual(res.headers, ['id', 'sku', 'stock']);
  assert.equal(res.headers[0], 'id');
});

// 6. Quoted fields and escaped quotes
test('Quoted fields with embedded comma and escaped quotes ("")', () => {
  const csv = 'id,title,description\n1,"Tokyo, Japan","He said ""Hello"" to us"\n';
  const res = parseCsvSummary(csv);
  assert.deepEqual(res.headers, ['id', 'title', 'description']);
  assert.equal(res.totalDataRows, 1);
  assert.equal(res.irregularRowCount, 0);
});

// 7. Multiline quoted fields
test('Multiline quoted fields with newlines inside quotes', () => {
  const csv = 'id,notes,amount\n101,"Line 1\nLine 2\r\nLine 3",500\n102,"Normal note",300';
  const res = parseCsvSummary(csv);
  assert.deepEqual(res.headers, ['id', 'notes', 'amount']);
  assert.equal(res.totalDataRows, 2);
  assert.equal(res.irregularRowCount, 0);
});

// 8. Malformed CSV: Unclosed quote at EOF
test('Throws CsvParseError on unclosed quote', () => {
  const badCsv = 'id,name,value\n1,"Unclosed quote,100';
  assert.throws(
    () => parseCsvSummary(badCsv),
    (err) => err instanceof CsvParseError && err.message.includes('クォート文字')
  );
});

// 9. Malformed CSV: Stray quote in unquoted field
test('Throws CsvParseError on stray quote in unquoted field', () => {
  const badCsv = 'id,name,value\n1,abc"def,100';
  assert.throws(
    () => parseCsvSummary(badCsv),
    (err) => err instanceof CsvParseError && err.message.includes('不正なクォート文字')
  );
});

// 10. Malformed CSV: Trailing characters after closing quote
test('Throws CsvParseError on invalid characters after closing quote', () => {
  const badCsv = 'id,name,value\n1,"quoted"extra,100';
  assert.throws(
    () => parseCsvSummary(badCsv),
    (err) => err instanceof CsvParseError && err.message.includes('不正な文字')
  );
});

// 11. Unsupported encoding detection (\uFFFD)
test('Throws CsvParseError when replacement character \\uFFFD is detected', () => {
  const corrupted = 'id,name\n1,\uFFFD\uFFFD\uFFFD';
  assert.throws(
    () => parseCsvSummary(corrupted),
    (err) => err instanceof CsvParseError && err.message.includes('UTF-8以外の文字コード')
  );
});

// 12. Empty headers and duplicate headers
test('Detects empty header and duplicate headers', () => {
  const csv = 'id,,code,name,code\n1,x,C1,Widget,C1';
  const res = parseCsvSummary(csv);
  assert.deepEqual(res.headerIssues.emptyHeaders, [2]);
  assert.equal(res.headerIssues.duplicateHeaders.length, 1);
  assert.equal(res.headerIssues.duplicateHeaders[0].name, 'code');
  assert.deepEqual(res.headerIssues.duplicateHeaders[0].indices, [3, 5]);
});

// 13. Irregular row column counts
test('Tracks rows with unexpected column counts without storing cell values', () => {
  const csv = 'a,b,c\n1,2,3\n4,5\n6,7,8,9\n10,11,12';
  const res = parseCsvSummary(csv);
  assert.equal(res.totalDataRows, 4);
  assert.equal(res.irregularRowCount, 2);
  assert.equal(res.irregularRowSamples.length, 2);
  assert.equal(res.irregularRowSamples[0].rowNumber, 3);
  assert.equal(res.irregularRowSamples[0].actual, 2);
  assert.equal(res.irregularRowSamples[1].rowNumber, 4);
  assert.equal(res.irregularRowSamples[1].actual, 4);
});

// 14. Empty file failure
test('Throws on empty content', () => {
  assert.throws(
    () => parseCsvSummary('   '),
    (err) => err instanceof CsvParseError && err.message.includes('ファイルが空です')
  );
});

// 15. Schema comparison: Identical
test('Schema comparison: Identical schemas return IDENTICAL status', () => {
  const before = parseCsvSummary('order_id,date,customer,total\n1,2026-01-01,Acme,1000\n');
  const after = parseCsvSummary('order_id,date,customer,total\n2,2026-01-02,Beta,2000\n');
  const diff = compareCsvSchemas(before, after);

  assert.equal(diff.isIdentical, true);
  assert.equal(diff.status, 'IDENTICAL');
  assert.equal(diff.delimiterChanged, false);
  assert.equal(diff.addedColumns.length, 0);
  assert.equal(diff.removedColumns.length, 0);
  assert.equal(diff.movedColumns.length, 0);
  assert.equal(diff.reordered, false);
});

// 16. Schema comparison: Safe addition
test('Schema comparison: Safe appended column returns COMPATIBLE_EXTENDED', () => {
  const before = parseCsvSummary('order_id,customer,total\n1,Acme,1000');
  const after = parseCsvSummary('order_id,customer,total,tax_rate\n1,Acme,1000,0.1');
  const diff = compareCsvSchemas(before, after);

  assert.equal(diff.isIdentical, false);
  assert.equal(diff.status, 'COMPATIBLE_EXTENDED');
  assert.deepEqual(diff.addedColumns, ['tax_rate']);
  assert.equal(diff.removedColumns.length, 0);
  assert.equal(diff.movedColumns.length, 0);
});

// 17. Schema comparison: Removed column
test('Schema comparison: Removed column triggers BREAKING_CHANGES', () => {
  const before = parseCsvSummary('order_id,customer,delivery_date,total\n1,Acme,2026-02-01,1000');
  const after = parseCsvSummary('order_id,customer,total\n1,Acme,1000');
  const diff = compareCsvSchemas(before, after);

  assert.equal(diff.status, 'BREAKING_CHANGES');
  assert.deepEqual(diff.removedColumns, ['delivery_date']);
  assert.equal(diff.addedColumns.length, 0);
  assert(diff.risks.some((r) => r.severity === 'CRITICAL' && r.title.includes('列の削除')));
});

// 18. Schema comparison: Moved columns
test('Schema comparison: Reordered columns triggers BREAKING_CHANGES', () => {
  const before = parseCsvSummary('colA,colB,colC\n1,2,3');
  const after = parseCsvSummary('colC,colA,colB\n3,1,2');
  const diff = compareCsvSchemas(before, after);

  assert.equal(diff.status, 'BREAKING_CHANGES');
  assert.equal(diff.reordered, true);
  assert.equal(diff.movedColumns.length, 3);
  const colA = diff.movedColumns.find((m) => m.name === 'colA');
  assert(colA);
  assert.equal(colA.fromIndex, 1);
  assert.equal(colA.toIndex, 2);
  assert(diff.risks.some((r) => r.severity === 'CRITICAL' && r.title.includes('列順序の変更')));
});

// 19. Schema comparison: Changed delimiter
test('Schema comparison: Changed delimiter triggers BREAKING_CHANGES', () => {
  const before = parseCsvSummary('id,name,value\n1,A,100');
  const after = parseCsvSummary('id\tname\tvalue\n1\tA\t100');
  const diff = compareCsvSchemas(before, after);

  assert.equal(diff.status, 'BREAKING_CHANGES');
  assert.equal(diff.delimiterChanged, true);
  assert.equal(diff.beforeDelimiter, ',');
  assert.equal(diff.afterDelimiter, '\t');
  assert(diff.risks.some((r) => r.severity === 'CRITICAL' && r.title.includes('区切り文字の変更')));
});

// 20. Schema comparison: Duplicate or empty headers in AFTER
test('Schema comparison: Duplicate or empty headers in AFTER trigger BREAKING_CHANGES', () => {
  const before = parseCsvSummary('id,name,price\n1,A,100');
  const after = parseCsvSummary('id,name,,name\n1,A,100,A');
  const diff = compareCsvSchemas(before, after);

  assert.equal(diff.status, 'BREAKING_CHANGES');
  assert(diff.risks.some((r) => r.title.includes('重複ヘッダー名')));
  assert(diff.risks.some((r) => r.title.includes('空の列名')));
});

// 21. Schema comparison: Irregular row counts in AFTER
test('Schema comparison: Irregular row count in AFTER triggers BREAKING_CHANGES', () => {
  const before = parseCsvSummary('id,name,price\n1,A,100');
  const after = parseCsvSummary('id,name,price\n1,A,100\n2,B');
  const diff = compareCsvSchemas(before, after);

  assert.equal(diff.status, 'BREAKING_CHANGES');
  assert(diff.risks.some((r) => r.title.includes('列数不一致の行が存在')));
});

console.log('\n============================================================');
console.log(`📊 Result: ${passCount} passed, ${failCount} failed`);
console.log('============================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 All CSV Checker unit tests passed successfully!\n');
}
