# Agentic Environment Farm Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the core orchestration engine that manages role-based intent injection and Git-driven status reporting for 3 initial containers, plus a basic web dashboard scaffold.

**Architecture:** A Node.js-based Orchestrator on the host PC communicates with Docker containers via a shared volume. Intent is injected via targeted JSON files, and feedback is gathered by monitoring the local Git repository for specific commit prefixes.

**Tech Stack:** Node.js, Express, Docker SDK, Simple-Git, React (for Dashboard).

---

### Task 1: Environment & Docker Refinement

**Files:**
- Modify: `docker-compose.yml`
- Create: `agent-harness/simulate-agent.sh`

- [ ] **Step 1: Update docker-compose for specific naming and naming strategy**
Update the names to follow `sec-forge`, `qa-scout`, `front-pilot` pattern.

```yaml
version: '3.8'
services:
  sec-forge:
    container_name: sec-forge
    image: node:20-slim
    volumes:
      - ./shared-context:/app/shared
      - .:/app/repo
    command: sh -c "apt update && apt install -y git && tail -f /dev/null"
  qa-scout:
    container_name: qa-scout
    image: node:20-slim
    volumes:
      - ./shared-context:/app/shared
      - .:/app/repo
    command: sh -c "apt update && apt install -y git && tail -f /dev/null"
  front-pilot:
    container_name: front-pilot
    image: node:20-slim
    volumes:
      - ./shared-context:/app/shared
      - .:/app/repo
    command: sh -c "apt update && apt install -y git && tail -f /dev/null"
```

- [ ] **Step 2: Create a simulation script for lead agents**
This script will run inside containers to "watch" for intent and "commit" work.

```bash
#!/bin/bash
# agent-harness/simulate-agent.sh
ROLE=$1
NAME=$2
echo "Starting Agent Harness for $NAME as $ROLE..."
while true; do
  if [ -f "/app/shared/intent-$ROLE.json" ]; then
    echo "New Intent Detected!"
    # Simulate work
    sleep 2
    git config --global user.email "agent@farm.local"
    git config --global user.name "Agent Farm"
    echo "Result of $ROLE task" >> "/app/repo/work-$NAME.txt"
    git add "/app/repo/work-$NAME.txt"
    git commit -m "agent/$NAME[$ROLE]: completed task from intent"
    rm "/app/shared/intent-$ROLE.json"
    echo "Task complete and committed."
  fi
  sleep 5
done
```

- [ ] **Step 3: Commit environment changes**

```bash
git add docker-compose.yml agent-harness/
git commit -m "chore: refine docker environment and add agent harness"
```

---

### Task 2: Orchestrator Core - Intent Injection

**Files:**
- Create: `orchestrator/package.json`
- Create: `orchestrator/lib/intent-manager.js`
- Create: `orchestrator/index.js`

- [ ] **Step 1: Initialize Orchestrator Node project**

```bash
mkdir -p orchestrator/lib
cd orchestrator
npm init -y
npm install express body-parser
```

- [ ] **Step 2: Implement Intent Manager**
Logic to write `intent-{role}.json` based on the naming strategy.

```javascript
// orchestrator/lib/intent-manager.js
const fs = require('fs');
const path = require('path');

const SHARED_PATH = path.join(__dirname, '../../shared-context');

function injectIntent(role, task) {
  const intent = {
    role,
    task,
    timestamp: new Date().toISOString()
  };
  const filePath = path.join(SHARED_PATH, `intent-${role}.json`);
  fs.writeFileSync(filePath, JSON.stringify(intent, null, 2));
  console.log(`[Orchestrator] Intent injected for ${role}`);
}

module.exports = { injectIntent };
```

- [ ] **Step 3: Create basic API entry point**

```javascript
// orchestrator/index.js
const express = require('express');
const { injectIntent } = require('./lib/intent-manager');
const app = express();
app.use(express.json());

app.post('/broadcast', (req, res) => {
  const { role, task } = req.body;
  injectIntent(role, task);
  res.send({ status: 'Intent Dispatched', role });
});

app.listen(3000, () => console.log('Orchestrator API running on port 3000'));
```

- [ ] **Step 4: Commit orchestrator core**

```bash
git add orchestrator/
git commit -m "feat: implement basic intent injection API"
```

---

### Task 3: Git-Driven Feedback Listener

**Files:**
- Create: `orchestrator/lib/git-monitor.js`
- Modify: `orchestrator/index.js`

- [ ] **Step 1: Implement Git Monitor**
Use `simple-git` to watch for commits with the `agent/` prefix.

```bash
cd orchestrator
npm install simple-git
```

```javascript
// orchestrator/lib/git-monitor.js
const simpleGit = require('simple-git');
const git = simpleGit(path.join(__dirname, '../../'));

async function getLatestAgentUpdates() {
  const log = await git.log({ n: 10 });
  return log.all.filter(commit => commit.message.startsWith('agent/'));
}

module.exports = { getLatestAgentUpdates };
```

- [ ] **Step 2: Integrate Monitor into Dashboard API**

```javascript
// orchestrator/index.js (Add route)
const { getLatestAgentUpdates } = require('./lib/git-monitor');

app.get('/status', async (req, res) => {
  const updates = await getLatestAgentUpdates();
  res.send(updates);
});
```

- [ ] **Step 3: Commit Git monitoring logic**

```bash
git add orchestrator/
git commit -m "feat: add git-driven status monitoring"
```

---

### Task 4: Dashboard Scaffolding (React)

**Files:**
- Create: `dashboard/` (via create-react-app or vite)

- [ ] **Step 1: Initialize Dashboard**

```bash
npx create-react-app dashboard --template typescript
# or use a lighter alternative
```

- [ ] **Step 2: Scaffolding the 4x3 Grid Component**
Visual placeholder for the War Room.

- [ ] **Step 3: Commit UI scaffold**

```bash
git add dashboard/
git commit -m "feat: initialize dashboard UI scaffold"
```
