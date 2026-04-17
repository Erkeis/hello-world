# Phase 2: Agentic Neural Network & Scaling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the static scaffold into a real-time orchestrated farm of 12 agents, featuring SSE streaming, automated Git branch management, and an autonomous "Agent Factory."

**Architecture:**
- **Communication (1B):** Aggregated SSE stream for live logs/status. Dashboard filters per agent.
- **Concurrency (2A):** Branch isolation + Fail-Fast merge policy. Audible/visual alert on conflict.
- **Config (5B):** Centralized `orchestrator/config.js` using `.env`.
- **UI (4B/8B):** React Context for isolated agent updates + Log windowing (200 lines limit).
- **Provisioning (3A):** SSH-based CLI factory for Phase 2 stability.

---

### Task 1: Foundation & SSE Backend (Neural Layer)

**Files:**
- Create: `orchestrator/.env`
- Create: `orchestrator/config.js`
- Create: `orchestrator/lib/log-streamer.js`
- Modify: `orchestrator/index.js`
- Test: `tests/sse-test.sh`

- [ ] **Step 1: Setup Centralized Config (5B)**
Create `config.js` and `.env` to manage `SHARED_CONTEXT_PATH` and `REPO_PATH`.

- [ ] **Step 2: Implement Unified Log Bus (1B)**
Use `chokidar` to watch the shared directory. Emit events to a central EventEmitter.

- [ ] **Step 3: Implement SSE with Explicit Cleanup (6A)**
Add `GET /events` endpoint. Ensure all watchers are closed on `res.on('close')`.

- [ ] **Step 4: Commit Foundation & SSE**

---

### Task 2: Concurrency & Sync (Branch Isolation)

**Files:**
- Modify: `agent-harness/simulate-agent.sh`
- Create: `orchestrator/lib/merge-manager.js`
- Test: `tests/test-merge-conflict.sh` (MANDATORY)

- [ ] **Step 1: Update Agent Harness**
Ensure agents work on `agent/$NAME` and use the shared Git config correctly.

- [ ] **Step 2: Implement Merge Queue & Fail-Fast (2A)**
Create logic to merge agent branches. If conflict, update status to `BLOCKED:CONFLICT`.

- [ ] **Step 3: Write Parallel Merge Test (7)**
Script that simulates two agents committing to the same file.

- [ ] **Step 4: Commit Sync Logic**

---

### Task 3: Interactive Dashboard (Visual Trust)

**Files:**
- Modify: `dashboard/src/context/AgentContext.tsx` (4B)
- Modify: `dashboard/src/components/ContainerGrid.tsx` (8B)
- Create: `dashboard/src/components/AgentDetailSidebar.tsx` (Option B)

- [ ] **Step 1: Implement Agent Context (4B)**
Create a context provider to handle real-time SSE updates without full grid re-renders.

- [ ] **Step 2: Grid Expansion & Log Windowing (8B)**
Expand to 12 units. Implement a 200-line buffer per agent cell.

- [ ] **Step 3: Sliding Sidebar & Notifications (2A)**
Implement the sliding detail panel and an audible/visual 'Ping' for blocked states.

- [ ] **Step 4: Commit UI Expansion**

---

### Task 4: Scaling & Automation (The Factory)

**Files:**
- Create: `agent-factory/generate-farm.js` (3A)
- Create: `agent-factory/agents.json`
- Create: `agent-factory/templates/docker-compose.tmpl`

- [ ] **Step 1: Build CLI Roster Factory**
CLI tool that reads `agents.json` and generates `docker-compose.yml`.

- [ ] **Step 2: Provisioning Test**
Verify 12 containers spin up with correct identity/role names.

- [ ] **Step 3: Commit Factory**
