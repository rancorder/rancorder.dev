#!/usr/bin/env node

const fs = require('fs');

const manifestPath = process.argv[2] || '.github/rulesets/main-protection.json';
const repository = process.env.GITHUB_REPOSITORY || 'rancorder/rancorder.dev';
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';

if (!fs.existsSync(manifestPath)) {
  console.error(`Repository policy audit: manifest not found: ${manifestPath}`);
  process.exit(2);
}

const expected = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
  'User-Agent': 'rancorder-repository-policy-audit',
};
if (token) headers.Authorization = `Bearer ${token}`;

async function github(path) {
  const response = await fetch(`https://api.github.com/repos/${repository}${path}`, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json();
}

function fail(message) {
  console.error(`REPOSITORY POLICY DRIFT: ${message}`);
  process.exitCode = 1;
}

function requiredCheckMap(rule) {
  const checks = rule?.parameters?.required_status_checks || [];
  return new Map(checks.map((check) => [check.context, check.integration_id ?? null]));
}

(async () => {
  const rulesets = await github('/rulesets');
  const summary = rulesets.find((ruleset) => ruleset.name === expected.name);
  if (!summary) {
    fail(`missing active ruleset: ${expected.name}`);
    return;
  }

  const actual = await github(`/rulesets/${summary.id}`);
  if (actual.enforcement !== 'active') fail(`ruleset enforcement is ${actual.enforcement}, expected active`);
  if (actual.target !== 'branch') fail(`ruleset target is ${actual.target}, expected branch`);

  const include = actual.conditions?.ref_name?.include || [];
  if (!include.includes('~DEFAULT_BRANCH')) fail('ruleset does not target ~DEFAULT_BRANCH');

  const actualTypes = new Set((actual.rules || []).map((rule) => rule.type));
  for (const type of ['deletion', 'non_fast_forward', 'pull_request', 'required_status_checks']) {
    if (!actualTypes.has(type)) fail(`required rule missing: ${type}`);
  }

  const statusRule = (actual.rules || []).find((rule) => rule.type === 'required_status_checks');
  const expectedStatusRule = expected.rules.find((rule) => rule.type === 'required_status_checks');
  const actualChecks = requiredCheckMap(statusRule);
  for (const expectedCheck of expectedStatusRule.parameters.required_status_checks) {
    if (!actualChecks.has(expectedCheck.context)) {
      fail(`required status check missing: ${expectedCheck.context}`);
      continue;
    }
    const actualIntegration = actualChecks.get(expectedCheck.context);
    if (actualIntegration !== expectedCheck.integration_id) {
      fail(`status check source mismatch for ${expectedCheck.context}: ${actualIntegration} != ${expectedCheck.integration_id}`);
    }
  }

  const pullRequestRule = (actual.rules || []).find((rule) => rule.type === 'pull_request');
  const allowed = pullRequestRule?.parameters?.allowed_merge_methods || [];
  if (!(allowed.length === 1 && allowed[0] === 'squash')) fail(`allowed merge methods drifted: ${allowed.join(', ') || 'none'}`);
  if (pullRequestRule?.parameters?.required_review_thread_resolution !== true) {
    fail('required_review_thread_resolution must be true');
  }

  if (!process.exitCode) {
    console.log('REPOSITORY POLICY AUDIT: PASS');
    console.log(`Ruleset: ${actual.name} (#${actual.id})`);
    console.log(`Required checks: ${[...actualChecks.keys()].join(' | ')}`);
  }
})().catch((error) => {
  console.error(`REPOSITORY POLICY AUDIT ERROR: ${error.message}`);
  process.exit(2);
});
