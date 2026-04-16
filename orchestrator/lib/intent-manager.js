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
