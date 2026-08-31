# Main Branch Production Gate

`main` is the production boundary for rancorder.dev. The repository-side source of truth for the desired GitHub Ruleset is:

- `.github/rulesets/main-protection.json`

## Required checks

Every pull request targeting `main` must expose these GitHub Actions check contexts:

- `Site Quality Gate`
- `Career Graph Integrity Gate`
- `Gemini Review Gate`

All three are intentionally stable job names so they can be selected as required status checks without depending on workflow file names or event type.

## Intended ruleset

Ruleset name: `rancorder-main-production-gate`

Target: default branch only.

Enforcement: active.

Rules:

- Block branch deletion.
- Block non-fast-forward / force pushes.
- Require all changes to reach `main` through a pull request.
- Allow squash merge only.
- Require review conversations to be resolved.
- Require the three status checks above from GitHub Actions.
- Do not require a second human approval count; the final merge remains an explicit human action.
- Do not require the branch to be rebased to the latest `main` solely for status-check policy. This avoids redundant AI/API and deployment runs while still requiring all three gates on the PR head.
- No bypass actors are declared in the manifest.

## One-time GitHub UI application

Repository administrators can create the live ruleset from **Settings → Rules → Rulesets → New branch ruleset**.

Use the values from `.github/rulesets/main-protection.json` exactly. For the three required status checks, select **GitHub Actions** as the expected source.

After creating the ruleset, run **Actions → Repository Policy Audit → Run workflow**. The audit must report `REPOSITORY POLICY AUDIT: PASS`.

## Drift detection

`Repository Policy Audit` runs daily and compares the live GitHub ruleset against the repository manifest. It fails when the ruleset is missing, disabled, loses a required protection, changes an expected check source, or allows merge methods outside the production contract.

This audit detects configuration drift; it does not itself replace GitHub's ruleset enforcement.
