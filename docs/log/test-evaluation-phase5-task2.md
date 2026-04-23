# METI Check: Phase 5 Task 2 - Harness-Side Physical Sandboxing (Read-Only Mode)

## [Intent]
Evaluate the test strategy for Phase 5 Task 2 to ensure it effectively enforces read-only constraints while allowing the harness to maintain operational logs. (2026-04-18)

## 1. Phase Specificity

- **Evaluation:** The test targets the physical enforcement of "READ_ONLY" mode in the agent harness. It verifies that the `agent-entrypoint.sh` correctly parses the intent mode and applies filesystem-level restrictions.
- **Score:** High. It directly implements the sandboxing mandate.

## 2. Forward Compatibility

- **Evaluation:** Enforcing read-only modes at the harness level provides a safety layer that is independent of the agent's internal logic. This is critical for future tasks where agents might perform speculative research on sensitive parts of the codebase.
- **Score:** High.

## 3. Refactor Resilience

- **Evaluation:** The test focuses on the behavioral outcome (can the agent write to a file in /app/repo?). It doesn't depend on which specific agent tool is used, but rather on the harness's ability to lock down the environment.
- **Score:** High.

## 4. Strategic Alignment

- **Evaluation:** This aligns with the "Security & System Integrity" mandate of the project, specifically "Source Control: Do not stage or commit changes unless specifically requested". Physical sandboxing provides an automated enforcement mechanism.
- **Score:** High.

## 5. Critical Path Risk

- **Evaluation:** If the lockdown is too broad (e.g., blocking the harness's own logs or .git), it breaks the reporting loop. If too narrow, it fails to protect the code. The test must verify that the harness can still report success while the agent is blocked from writing.
- **Score:** High.

## Conclusion

The test strategy will involve:

1. Modifying `agent-entrypoint.sh` to support `mode` detection and `chmod` enforcement.
2. Creating a simulation intent with `mode: "READ_ONLY"`.
3. Verifying that the task execution fails (or is blocked) if it attempts to write to the repository, while ensuring the harness can still write to its log file.
4. Verifying that `READ_WRITE` mode (default) still allows full access.
