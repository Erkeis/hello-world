// tests/test-phase3-full.js
const { injectIntent, setStatusApproved } = require('../orchestrator/lib/intent-manager');
const fs = require('fs');
const path = require('path');

async function runFullCycleTest() {
  console.log('🚀 Starting Phase 3 Integration Test...');

  // 1. Inject high-risk task (Tier 3)
  console.log('\n1️⃣ Broadcasting high-risk task...');
  const role = 'tester';
  const task = 'Refactor the #security module and update #auth logic.';
  await injectIntent(role, task);

  const intentPath = path.join(__dirname, '../shared-context/intent-tester.json');
  let intent = JSON.parse(fs.readFileSync(intentPath, 'utf8'));

  console.log('📊 Risk Level:', intent.riskLevel);
  console.log('📡 Status:', intent.status);
  console.log('🧠 Context Sniped:', intent.context.map(c => c.decision));

  if (intent.riskLevel === 3 && intent.status === 'PENDING_APPROVAL') {
    console.log('✅ Correctly blocked for approval.');
  } else {
    console.error('❌ FAILED: Should be PENDING_APPROVAL for risk level 3.');
    return;
  }

  // 2. Simulate User Approval
  console.log('\n2️⃣ Simulating User Approval...');
  await setStatusApproved(role);
  
  intent = JSON.parse(fs.readFileSync(intentPath, 'utf8'));
  console.log('📡 New Status:', intent.status);

  if (intent.status === 'APPROVED') {
    console.log('✅ Successfully approved.');
  } else {
    console.error('❌ FAILED: Status did not update to APPROVED.');
    return;
  }

  console.log('\n🎉 FULL CYCLE TEST PASSED!');
}

runFullCycleTest();
