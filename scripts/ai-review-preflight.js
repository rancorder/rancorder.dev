#!/usr/bin/env node

const fs = require('fs');

const diffPath = process.argv[2] || '.review/pr.diff';
if (!fs.existsSync(diffPath)) {
  console.error(`AI review preflight: diff not found: ${diffPath}`);
  process.exit(2);
}

const diff = fs.readFileSync(diffPath, 'utf8');
const files = [...diff.matchAll(/^diff --git a\/(.+?) b\/(.+)$/gm)].map((m) => m[2]);
const added = diff
  .split('\n')
  .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
  .map((line) => line.slice(1));

const findings = [];
const protectedPaths = new Set([
  'AGENTS.md',
  'GEMINI.md',
  'GEMINI_REVIEW.md',
  'scripts/ai-review-preflight.js',
]);

for (const file of files) {
  if (file.startsWith('.github/workflows/') || protectedPaths.has(file)) {
    findings.push(`protected control file changed: ${file}`);
  }
}

const suspiciousClaims = [
  /verified as canonical/i,
  /indexed directly (inside|by)/i,
  /guaranteed (ranking|recommendation|citation|indexing)/i,
  /guarantees? (ranking|recommendation|citation|indexing)/i,
  /AI Agent validation is resolved successfully/i,
];

for (const line of added) {
  for (const pattern of suspiciousClaims) {
    if (pattern.test(line)) findings.push(`suspicious authority claim: ${line.trim()}`);
  }
  if (/https:\/\/[^\s'"`]*vercel\.app/i.test(line) && /(canonical|metadataBase|SITE_URL|url:)/i.test(line)) {
    findings.push(`preview/temporary domain appears in canonical-like code: ${line.trim()}`);
  }
  if (/#profile/.test(line) && !/profile-page/.test(line)) {
    findings.push(`legacy Person fragment may have been reintroduced: ${line.trim()}`);
  }
}

const unique = [...new Set(findings)];
if (unique.length) {
  console.error('AI REVIEW PREFLIGHT: BLOCK');
  unique.forEach((x) => console.error(`- ${x}`));
  process.exit(1);
}

console.log(`AI REVIEW PREFLIGHT: PASS (${files.length} changed files scanned)`);
