// tests/test-task1-p2p.js
const { injectIntent } = require('../orchestrator/lib/intent-manager');
const fs = require('fs');
const path = require('path');

async function runP2PTest() {
  console.log('🧪 Testing Phase 4 Task 1: P2P Intent Dispatcher (Orchestrator Side)...');

  // [Intent] Simulate an agent (Agent A) requesting a sub-task for another agent (Agent B).
  const sourceAgent = 'sec-forge';
  const targetAgent = 'front-pilot';
  const task = `Fix the vulnerability found by ${sourceAgent} #security`;

  console.log(`📤 Simulating broadcast for ${targetAgent}...`);
  const result = await injectIntent(targetAgent, task, [`#from-${sourceAgent}`]);

  if (result.success) {
    console.log('✅ Intent accepted by Orchestrator.');

    const intentPath = path.join(__dirname, `../shared-context/intent-${targetAgent}.json`);
    if (fs.existsSync(intentPath)) {
      const intent = JSON.parse(fs.readFileSync(intentPath, 'utf8'));
      console.log('📦 Target Agent:', intent.role);
      console.log('📦 Task:', intent.task);
      console.log('📦 Tags:', intent.tags);

      if (intent.role === targetAgent && intent.tags.includes(`#from-${sourceAgent}`)) {
        console.log('🎉 TEST PASSED: Sub-intent correctly formatted and stored!');
      } else {
        console.error('❌ TEST FAILED: Intent content mismatch.');
      }
    } else {
      console.error('❌ TEST FAILED: Intent file not created.');
    }
  } else {
    console.error('❌ TEST FAILED: Broadcast failed.', result.error);
  }
}

runP2PTest();
