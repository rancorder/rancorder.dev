# Gemini Self-Healing PR Loop

The Self-Healing PR Loop is a bounded repair layer for AI-generated pull requests.

## Trigger

It listens for a failed `Gemini Review Gate` run on same-repository branches created by the guarded implementation agents:

- `ai/operator-*`
- `ai/issue-*`

It does not run for forks, normal human branches, closed PRs, non-main targets, or successful review runs.

## Repair policy

1. Read the sticky `Gemini Review Gate` result.
2. Refuse mutation when the failure is reviewer infrastructure rather than a code finding.
3. Escalate CRITICAL or protected-control-plane findings to a human without automatic mutation.
4. For actionable findings, run Gemini against the existing PR branch with the original PR task and review findings as bounded repair context.
5. Run `npm run validate`.
6. Reject any repair that changes protected workflows, rulesets, agent policies, provenance controls, or repository security configuration.
7. Push the validated repair back to the same PR branch, causing all required checks and the Review Gate to run again.
8. Stop after two automatic repair attempts. The PR remains blocked for human intervention if it still fails.

## Safety model

The repair agent cannot merge or modify `main` directly. Main is protected by `rancorder-main-production-gate`, so a repaired PR must still pass:

- `Site Quality Gate`
- `Career Graph Integrity Gate`
- `Gemini Review Gate`

A passing Review Gate may dismiss only earlier formal change-request reviews created by the same Gemini Review Gate mechanism. Human review remains independent.

## Cost control

Deterministic Review Gate preflight failures expose their exact finding in the sticky review packet. Gemini review is skipped when deterministic preflight already proves the PR must be blocked, and Self-Heal is capped at two attempts per PR.
