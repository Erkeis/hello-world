# METI Check: Phase 4 Task 1 - Peer-to-Peer Intent Dispatcher

## [Intent]

Evaluate the test strategy for Phase 4 Task 1 to ensure it defends the project's core mandates and avoids performative testing. (2026-04-23)

## 1. Phase Specificity

- **Evaluation:** The test targets the newly introduced P2P dispatch mechanism where an agent uses a CLI wrapper to trigger an orchestrator broadcast.
- **Score:** High. It directly verifies the "Sub-Intent" issuance logic.

## 2. Forward Compatibility

- **Evaluation:** The test verifies that intent files are created correctly in the shared volume. This is compatible with Phase 5/6 where agents might have more complex handshakes or state-sharing.
- **Score:** High. Using the shared filesystem as the source of truth ensures future agents can consume these intents regardless of their internal implementation.

## 3. Refactor Resilience

- **Evaluation:** The test is decoupled from the Orchestrator's internal `lib/intent-manager` implementation. It observes the side effect: the creation of a valid JSON intent file in `shared-context/`.
- **Score:** High. It uses API calls and file system observation (black-box).

## 4. Strategic Alignment

- **Evaluation:** This test defends the Core Mandate of "Inter-agent coordination" without a central bottleneck (besides the orchestrator proxy). It aligns with the "Agentic Environment Farm" vision.
- **Score:** High.

## 5. Critical Path Risk

- **Evaluation:** Inter-agent communication is a critical new path. Failure here would isolate agents. The test targets the POST /broadcast endpoint and the cURL wrapper, which are the primary entry points.
- **Score:** High.

## Conclusion

The test strategy is sound. It will involve:

1. Starting the orchestrator.
2. Simulating an agent call to `dispatch_sub_intent`.
3. Verifying that the target agent's intent file is populated with the expected task.
