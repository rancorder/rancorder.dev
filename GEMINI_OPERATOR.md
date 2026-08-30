# Gemini Operator

Use a GitHub Issue or PR comment starting with `/ai ` to request a guarded implementation.

Example:

`/ai Authority AuditにAI Query Simulatorを追加して`

The operator runs Gemini CLI, validates the repository, pushes to a dedicated branch, and attempts to open a pull request. Repository settings must allow GitHub Actions to create pull requests for fully automatic PR creation.

Safety invariants are defined in `AGENTS.md` and `GEMINI.md`.
