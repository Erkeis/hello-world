# Agentic Environment Farm: Global Rules

## [Intent]
Project-specific overrides and extensions for Gemini CLI to ensure alignment with the "Context-Aware Autonomy" architecture.

## §7 CODE STYLE
- Follow the community-standard conventions for the language/framework in use.
- Test files must be clearly distinguishable (use a prefix or suffix).
- **Tagging Discipline**: Always categorize significant decisions using `#tags` as per `.agent/rules/tag-governance.md`. This is critical for context-aware orchestration.
- For significant logic, add an intent comment explaining **why**, not how.

## §8 ARCHITECTURE
- **Context over Persona**: Focus on providing high-purity context from `decision-log.jsonl` rather than just roleplay prompts.
- **Atomic Concurrency**: All shared state updates MUST follow the Atomic Write pattern (Temp -> Rename).
