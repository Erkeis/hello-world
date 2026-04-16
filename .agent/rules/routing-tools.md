# Tool Selection & Routing Table

> [!NOTE]
> This document maps context signals to knowledge fragments. 
> All files in `.agent/tools/` must follow this frontmatter format:
> `yaml
> ---
> name: "unique-id"
> description: "Summary"
> ---
> `
> [!NOTE]
> This document is a project-level extension of `gemini.md §6 DOCUMENT ROUTING`.
> It maps context signals to specific knowledge fragments in `.agent/tools/`.

## NLM (NotebookLM) Domain

| Context Signal | Route To | Type | Boundary (Negative Trigger) |
|:---|:---|:---|:---|
| nlm, notebooklm | tools/nlm/INDEX.md | ref | - |
| nlm CLI syntax, commands, help | tools/nlm/ref_cli-commands.md | ref | - |
| nlm upload, add source | tools/nlm/guide_sequential-upload.md | guide | Not for single file or URL |
| nlm delete, remove source | tools/nlm/guide_non-interactive-deletion.md | guide | - |
| nlm install, command not found | tools/nlm/guide_path-execution-strategy.md | guide | - |
| powershell parser error, multiline | tools/nlm/err_ps-multiline-string.md | err | - |
| anonymize, PII, privacy | tools/nlm/hist_source-anonymization.md | hist | - |

## Cognition Domain

| Context Signal | Route To | Type | Boundary (Negative Trigger) |
|:---|:---|:---|:---|
| cognition, mode, thinking | tools/cognition/INDEX.md | ref | - |
| planning, architecture, design, persona, ux, divergence | tools/cognition/guide_mode-switching.md | guide | Not for deterministic execution tasks |

## Document Safety Domain

| Context Signal | Route To | Type | Boundary (Negative Trigger) |
|:---|:---|:---|:---|
| encoding, utf-8, cp949, mojibake, 한글 깨짐, 인코딩 오류 | rules/encoding-safety.md | rule | - |
