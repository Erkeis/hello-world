---
name: "nlm-upload-bug"
description: "Fix for bulk upload bug (sequential processing required)."
---
# [Quick Action]
Run `nlm source add` once per file with `--wait`:
```powershell
nlm source add <id> --file A.md --wait
nlm source add <id> --file B.md --wait
```
*Note: Bulk --file flags (v0.5.24) only process the first file.*
