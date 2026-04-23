# Phase 4: Advanced Collaboration & Autonomous Skills Plan

> **For agentic workers:** Execute this plan using `superpowers:subagent-driven-development`.
> **CRITICAL:** Every task implementation MUST conclude with a **METI Check** (`.agent/rules/test-meta-evaluation.md`) before writing any test code.

**Goal:** Evolve the Agent Farm from a "Hub-and-Spoke" model to a "Peer-to-Peer" collaborative network, and codify operational procedures into repeatable automation skills based on the Asset Lifecycle methodology.

---

## Part 1: Phase 4 Core (Advanced Collaboration)

Currently, agents only receive orders from the Hub (Orchestrator). In Phase 4, agents can issue **Sub-Intents** to other specialized agents, creating a collaborative problem-solving chain.

### Task 1: Peer-to-Peer Intent Dispatcher
**Files:**
- Modify: `orchestrator/index.js` (Expose internal API to Docker network)
- Modify: `agent-harness/agent-entrypoint.sh` (Add cURL wrapper for sub-intents)

- [ ] **Step 1: Orchestrator Network Access:** Ensure the Orchestrator's `/broadcast` API is accessible from within the Docker containers (via `host.docker.internal` or a dedicated Docker network).
- [ ] **Step 2: Sub-Intent CLI Wrapper:** Create a simple bash function `dispatch_sub_intent(target_role, task)` inside `agent-entrypoint.sh` that calls the Orchestrator API.
- [ ] **Step 3: METI Check (Meta-Evaluation)**: Analyze the proposed test against the 5 core elements (Phase Specificity, Forward Compatibility, Refactor Resilience, Strategic Alignment, Critical Path Risk). Log the evaluation result.
- [ ] **Step 4: Implementation & Verification:** Write the test (e.g., `sec-forge` dispatching a task to `front-pilot`) and commit.

---

## Part 2: Management Skills (Layer 1 - Global/Root)

These tools automate infrastructure and governance. They belong in the project root and are protected by `.exportignore`.

### Task 2: Git-Harness Sanity Checker (Tool)
**Files:**
- Create: `orchestrator/scripts/sanity-checker.js` (or `.agent/tools/sanity-checker.sh`)

- [ ] **Step 1: Rule Engine:** Implement a script that verifies:
  1. `.gitignore` contains `.agent/` and test artifacts.
  2. No uncommitted modifications exist in critical harness files before a push.
  3. Commit messages follow the `agent/NAME[ROLE]:` format.
- [ ] **Step 2: Pre-push Hook:** Integrate the script into a Git `pre-push` hook.
- [ ] **Step 3: METI Check:** Evaluate test strategy (Mocking Git states vs. real repo testing).
- [ ] **Step 4: Implementation & Verification:** Write tests and commit.

### Task 3: Agent Lifecycle Manager (Skill)
**Files:**
- Create: `.agent/skills/agent-lifecycle/SKILL.md`

- [ ] **Step 1: Skill Definition:** Write a `SKILL.md` that standardizes the process of creating a new worktree, resetting the orchestrator state (flushing `.tmp` and `.blocked` files), and cleanly restarting the 12-container grid.
- [ ] **Step 2: Implementation & Verification:** (Since this is a markdown skill, verification is a manual dry-run of the instructions).

---

## Part 3: Product Skills (Layer 2 - App-Specific)

These tools define the "intelligence" of the application itself and are designed to be exported (`/exprj`).

### Task 4: Agile HR Dispatcher (Skill)
**Files:**
- Create: `dashboard/scripts/agile-dispatcher.js` (or equivalent skill file)

- [ ] **Step 1: High-Level Parser:** Implement logic that takes a single "CEO Concept" (e.g., "Build a secure login page") and breaks it down into individual tasks for `sec-forge`, `front-pilot`, and `auth-shield`.
- [ ] **Step 2: Multi-Broadcast:** Use the Orchestrator's `/broadcast` API to simultaneously dispatch these generated intents to the specific agents.
- [ ] **Step 3: METI Check:** Evaluate test strategy for multi-agent intent generation and API throughput.
- [ ] **Step 4: Implementation & Verification:** Write tests and commit.
