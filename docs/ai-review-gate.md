# Gemini Review Gate

AI-generated pull requests from `ai/*` branches are reviewed by a separate read-only Gemini reviewer before human merge review.

The gate combines two layers:

1. Deterministic preflight loaded from the base branch to catch protected-control-file changes and known authority/provenance overclaims.
2. A read-only Gemini diff review governed by `GEMINI_REVIEW.md`.

The reviewer can read files, glob paths, and search text. It is not allowed to write repository files or execute repository commands. PR content is treated as untrusted review data.

A `PASS` means no blocking issue was found by this gate. It does not prove external verification, crawler indexing, search ranking, AI recommendation, or objective correctness. Human review remains the final merge authority.

If blocking issues are found, the workflow posts a sticky PR comment, attempts a formal request-changes review when GitHub permits it, and fails the `Gemini Review Gate` check.
