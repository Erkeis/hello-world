---
trigger: manual
---

# Encoding Safety Rule

> Project-level guardrail for Korean and other non-ASCII text handling.

## Core Rule

Do not treat garbled terminal output as proof of file corruption.

## Mandatory Behavior

- Separate `console rendering failure` from `file encoding failure`.
- Before editing a non-ASCII document, verify the source text with a reliable UTF-8 read path.
- If PowerShell output is garbled, re-check using byte inspection, explicit UTF-8 decoding, or escaped output.
- Preserve the original encoding whenever it is already valid and known.
- Do not delete and recreate a document solely because the terminal preview looks broken.
- When reporting the issue, explicitly state whether the problem is display-only or file-level.

## Recommended Checks

- `Format-Hex` for byte-level inspection
- explicit UTF-8 read
- `unicode escape` style output when terminal rendering is unreliable

## Intent

This rule exists because Korean Markdown files can appear broken in terminal output even when the file itself is valid UTF-8. The agent must verify first, then edit.
