# Phase 3: Intelligence & Context-Aware Autonomy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Agent Farm into a context-aware autonomous organization. Implement JSONL-based "Context Sniping," a Tiered Approval system, and dynamic UI-driven provisioning.

**Architecture:**
- **Context (PO Model):** Orchestrator snipes relevant context from `decision-log.jsonl` and injects it into agents.
- **Protocol:** Atomic `intent.json` updates + `inotify` for reactive subagent response.
- **Control Plane:** Dashboard UI with [Approve] and [Provision] buttons for manual oversight.
- **Purity:** Docker-native individual container restarts for session resets.

**Tech Stack:** Node.js, Express, Docker SDK, React, jq, inotify-tools.

---

### Task 1: Intelligence Core - Context Sniper & JSONL

**Files:**
- Create: `orchestrator/lib/context-sniper.js`
- Modify: `orchestrator/lib/intent-manager.js`
- Create: `docs/log/decision-log.jsonl`

- [ ] **Step 1: Implement JSONL Logger & Sniper**
Implement logic to read `decision-log.jsonl` and extract entries based on tags (e.g., `#security`, `#frontend`).
- [ ] **Step 2: Smart Intent Injection**
Update `injectIntent` to automatically bundle "Sniped Context" into the `intent.json` file.
- [ ] **Step 3: Atomic Write Pattern**
Ensure all `intent.json` updates use the "Write to Temp -> Rename" pattern to prevent race conditions.
- [ ] **Step 4: Commit Sniper Logic**

---

### Task 2: Reactive Harness - The specialized specialist

**Files:**
- Modify: `agent-harness/agent-entrypoint.sh` (renamed from simulate-agent.sh)
- Modify: `agent-factory/templates/service.tmpl`

- [ ] **Step 1: Implement inotify-based Watcher**
Replace the `sleep` loop in the harness with `inotifywait -e close_write /app/shared/intent.json`.
- [ ] **Step 2: Build Command Adapter (Polymorphic)**
Implement the `case` logic to execute different CLI tools (Gemini, Claude, Codex) based on the detected environment or intent.
- [ ] **Step 3: Handle PENDING_APPROVAL Status**
Harness must pause and log "Waiting for Approval" if `status` is not `APPROVED`.
- [ ] **Step 4: Commit Reactive Harness**

---

### Task 3: Visual Control Plane - Tiered Approval UI

**Files:**
- Modify: `dashboard/src/context/AgentContext.tsx`
- Modify: `dashboard/src/components/AgentDetailSidebar.tsx`
- Modify: `orchestrator/index.js`

- [ ] **Step 1: Implement Approval & Provision APIs**
Add `POST /agent/:id/approve` and `POST /agent/:id/provision` in the Orchestrator.
- [ ] **Step 2: Build Sidebar Control Panel**
Add [APPROVE] and [RE-PROVISION] buttons to the sliding sidebar.
- [ ] **Step 3: Implement Risk-based Logic (Tiered)**
Orchestrator assigns `risk_level` to intents; Dashboard highlights Tier 3 tasks that require manual approval.
- [ ] **Step 4: Commit Control Plane UI**

---

### Task 4: Autonomous HR Flow & Purity

**Files:**
- Create: `orchestrator/lib/session-manager.js`
- Create: `.agent/rules/tag-governance.md`

- [ ] **Step 1: Implement Granular Container Restart**
Logic to call `docker restart <container_id>` via Node.js for individual session resets.
- [ ] **Step 2: Deploy Tagging Rules**
Write the rules to ensure all future decisions in `decision-log.jsonl` follow the `#tag` convention.
- [ ] **Step 3: Final Integration Verification**
Run a full cycle: Concept -> Sniped Intent -> Pending Approval -> User Approve -> Agent Action -> Git Commit.
- [ ] **Step 4: Commit Purity Logic & Rules**
