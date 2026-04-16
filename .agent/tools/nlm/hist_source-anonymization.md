---
name: "nlm-anonymization-hist"
description: "Workflow for PII removal within NotebookLM sources."
---
# PII Removal (2026-04-14)

1. **Retrieved**: `nlm source content <id>`
2. **Replaced**: `kg908` ??`<USER_HOME>`, `email` ??`<USER_EMAIL>`
3. **Execution**: Delete old source (`--confirm`), upload `.anon.md` (`--wait`).
