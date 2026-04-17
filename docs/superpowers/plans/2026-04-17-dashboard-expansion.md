# Task 3: Interactive War Room UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the dashboard to support 12 agents with real-time logs, isolated rendering via React Context, and a sliding detail sidebar with conflict alerts.

**Architecture:**
- **Context (4B):** `AgentProvider` manages state for 12 agents. Receives SSE events and updates state surgically.
- **Grid (8B):** `ContainerGrid` renders 12 `AgentCell` components. `AgentCell` displays last 5 logs.
- **Sidebar (Option B):** `AgentDetailSidebar` shows 200 logs. Opens on cell click.
- **Alerts (2A):** Red flash and beep on `BLOCKED:CONFLICT` status.

**Tech Stack:** React 19, TypeScript, CSS (Vanilla for War Room aesthetic).

---

### Task 1: Implement Agent Context (4B)

**Files:**
- Create: `dashboard/src/context/AgentContext.tsx`
- Modify: `dashboard/src/App.tsx`

- [ ] **Step 1: Define Agent Types & Context**
Create `AgentContext.tsx` with `Agent` interface and `AgentContextType`.

```typescript
export interface Agent {
  id: number;
  name: string;
  status: 'IDLE' | 'WORKING' | 'SUCCESS' | 'BLOCKED:CONFLICT';
  logs: string[];
}
```

- [ ] **Step 2: Implement AgentProvider with SSE Simulation**
Implement `AgentProvider`. For now, it should handle state for 12 agents and provide an `updateAgent` function.
(Note: Real SSE integration will happen when orchestrator is ready, but for Task 3, we need the structure).

- [ ] **Step 3: Wrap App with AgentProvider**
Modify `App.tsx` to include `AgentProvider`.

- [ ] **Step 4: Commit Context Foundation**

---

### Task 2: Grid Expansion & AgentCell (8B)

**Files:**
- Modify: `dashboard/src/components/ContainerGrid.tsx`
- Create: `dashboard/src/components/AgentCell.tsx`

- [ ] **Step 1: Create AgentCell Component**
Extract cell logic to `AgentCell.tsx`. Use `useAgent` hook (from context) to subscribe to specific agent data.
Implement 5-line log preview and 200-line buffer logic.

- [ ] **Step 2: Update ContainerGrid**
Render 12 `AgentCell` components in the 4x3 grid.

- [ ] **Step 3: Commit Grid Expansion**

---

### Task 3: Sliding Sidebar & Notifications (2A)

**Files:**
- Create: `dashboard/src/components/AgentDetailSidebar.tsx`
- Modify: `dashboard/src/App.tsx`
- Modify: `dashboard/src/App.css`

- [ ] **Step 1: Implement AgentDetailSidebar**
Create the sliding panel. Show full logs (200 lines).

- [ ] **Step 2: Implement Visual/Audible Alerts**
Add `useEffect` to detect `BLOCKED:CONFLICT` and trigger:
1. CSS animation `flash-red`.
2. Audio beep via `AudioContext`.

- [ ] **Step 3: Integrate Sidebar in App**
Add Sidebar to `App.tsx` and manage `selectedAgentId`.

- [ ] **Step 4: Commit Sidebar & Alerts**

---

### Task 4: Final Polish & Verification

- [ ] **Step 1: War Room Styling**
Update `App.css` for high-contrast "Command Center" look.

- [ ] **Step 2: Verification**
Verify 12 agents, log windowing, and sidebar functionality.
(Since I can't "see" it, I'll verify via code logic and mock state updates).

- [ ] **Step 3: Commit Final Polish**
