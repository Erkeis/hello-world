# Task 4: Dashboard Scaffolding (React) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a React dashboard using Vite and TypeScript with a 4x3 grid UI scaffold.

**Architecture:** A standalone React application in the `dashboard/` directory.

**Tech Stack:** React, TypeScript, Vite.

---

### Task 1: Initialize Dashboard Project

**Files:**
- Create: `dashboard/` (via Vite)

- [ ] **Step 1: Create project using Vite**
Run: `npm create vite@latest dashboard -- --template react-ts`
Expected: `dashboard/` folder created with standard Vite template.

- [ ] **Step 2: Install dependencies**
Run: `cd dashboard && npm install`
Expected: `node_modules/` created in `dashboard/`.

---

### Task 2: Implement 4x3 Grid Scaffold

**Files:**
- Modify: `dashboard/src/App.tsx`
- Create: `dashboard/src/components/ContainerGrid.tsx`
- Modify: `dashboard/src/App.css` (or `index.css`)

- [ ] **Step 1: Create ContainerGrid component**
Create `dashboard/src/components/ContainerGrid.tsx` with a 4x3 grid of 12 placeholders.

```tsx
// [Intent] Provides a structural scaffold for the 12 containers in a 4x3 grid (2026-04-16)
import React from 'react';

const ContainerGrid: React.FC = () => {
  const containers = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Container ${i + 1}`,
  }));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '1rem',
      padding: '1rem',
      height: '80vh'
    }}>
      {containers.map((container) => (
        <div
          key={container.id}
          style={{
            border: '2px dashed #666',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f9f9',
            color: '#666'
          }}
        >
          {container.name}
        </div>
      ))}
    </div>
  );
};

export default ContainerGrid;
```

- [ ] **Step 2: Update App.tsx to use ContainerGrid**
Modify `dashboard/src/App.tsx` to render the grid.

```tsx
import './App.css'
import ContainerGrid from './components/ContainerGrid'

function App() {
  return (
    <div className="App">
      <h1>Agent Farm War Room</h1>
      <ContainerGrid />
    </div>
  )
}

export default App
```

- [ ] **Step 3: Run build check**
Run: `cd dashboard && npm run build`
Expected: Production build successful.

---

### Task 3: Commit UI scaffold

**Files:**
- Add: `dashboard/` (excluding `node_modules`)

- [ ] **Step 1: Verify .gitignore**
Ensure `dashboard/node_modules` is ignored. (Root .gitignore already covers node_modules/).

- [ ] **Step 2: Add and commit**
Run: `git add dashboard/`
Run: `git commit -m "feat: initialize dashboard UI scaffold with 4x3 grid"`
Expected: Changes committed to git.
