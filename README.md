# faulty-app

⚠️ **INTENTIONAL TEST FIXTURE — DO NOT USE IN PRODUCTION** ⚠️

This repository exists solely to exercise the [BugTrap](https://github.com/ChingTagTeam/bugtrap)
scanner pipeline. Every file here contains **deliberately planted** issues:

- **Fake secrets** — all credentials are documented dummy values (e.g. AWS's own
  `AKIAIOSFODNN7EXAMPLE`) or obvious placeholders. None are real or live.
- **SQL injection** — string-concatenated queries for the correctness/security agents to flag.
- **Bugs** — logic errors, unhandled cases, off-by-one mistakes.
- **Lint errors** — unused vars, `==` vs `===`, missing semicolons, etc.

Nothing in this repo is meant to run correctly. It is bait for a code scanner.
