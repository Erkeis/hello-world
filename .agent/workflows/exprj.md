---
description: Archives project files to a timestamped folder and resets workspace.
---

# Project Export (/exprj)

Safely backups codebase/docs to `../YYYYMMDD_HHMM_temp` and clears current directory.

## Retention Policy
- **Keep**: `.agent`, `.gemini`, `.git` (Core Infrastructure)
- **Move**: Everything else (Project artifacts)

## Triggers
- User requests: "Reset", "Clear workspace", "Archive project", or `/exprj`.

## Steps

1. **Execute Export**: Run cleanup script.
   // turbo
   `run_command(CommandLine="# [#] /exprj: Archiving workspace\npowershell -File .agent/scripts/export-project.ps1", Cwd=".")`

2. **Verify**: Check the created backup folder in parent directory.
3. **Reset**: Workspace is now ready for a new session.
