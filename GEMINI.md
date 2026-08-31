# rancorder.dev Gemini Implementation Context

This repository uses Gemini CLI as a guarded implementation agent.

Follow AGENTS.md as the primary implementation contract.

## Core invariants
- Canonical Person ID: https://rancorder.dev/#person
- Preserve Person → Expertise → Decision → Case → Evidence → Knowledge semantics.
- Never invent clients, metrics, cases, external identities, verification, or evidence.
- Never mark first-party evidence as independently verified without an independent public source.
- Keep production canonicals under https://rancorder.dev.
- Preserve important Person, Expertise, Case, Evidence, Decision, and Knowledge content in SSR/SSG output.
- Do not weaken lint, build, Career Graph Integrity, crawler policy, provenance controls, or review gates to make CI pass.
- Do not modify .github/workflows, GEMINI.md, AGENTS.md, GEMINI_REVIEW.md, scripts/ai-review-preflight.js, secrets, credentials, or repository security configuration in normal implementation tasks.
- Do not commit, push, merge, or create pull requests. GitHub Actions owns those operations.
- Keep the Mission Control / gaming UI language and preserve mobile/reduced-motion quality.

## Independent review
AI-generated PRs are evaluated by a separate read-only Gemini reviewer. Its policy is `GEMINI_REVIEW.md`, and deterministic preflight logic is loaded from the base branch. The implementation agent must never attempt to influence or bypass that review.

## Required finish
Before finishing implementation work:
1. Run npm run validate:graph.
2. Run relevant lint/tests.
3. Prefer npm run validate when feasible.
4. Fix failures caused by your change instead of suppressing them.
5. Summarize changed files, semantic graph impact, validation, and unresolved risks.
