# METI Check: Test Evaluation for Phase 5 Task 3

## [Intent]
Evaluate the test strategy for Inter-Agent Federated Delegation Protocol. (2026-04-23)

## Test Strategy
1.  **Unit Verification (Script Logic)**:
    *   Verify `dispatch_sub_intent` defaults to `READ_ONLY` and `STANDARD_REPORT`.
    *   Verify `mode` auto-selection: "fix/implement" -> `READ_WRITE`.
2.  **Integration Verification (Orchestrator)**:
    *   Verify that `curl` payload sent by `dispatch_sub_intent` is correctly parsed by the Orchestrator.
    *   Verify that the resulting `intent-*.json` file contains the `mode` and `response_schema` fields.
3.  **End-to-End Verification (Harness Behavior)**:
    *   Simulate an agent dispatching a "fix" task.
    *   Verify the target agent's harness receives `mode: READ_WRITE`.
    *   Simulate an agent dispatching an "explore" task.
    *   Verify the target agent's harness receives `mode: READ_ONLY`.

## Verification Metrics
- [ ] `curl` payload includes `mode` and `response_schema`.
- [ ] `intent-*.json` includes `mode` and `response_schema`.
- [ ] Harness correctly identifies and applies `READ_ONLY` sandboxing if specified.
