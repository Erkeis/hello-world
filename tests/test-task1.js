// tests/test-task1.js
const { injectIntent } = require('../orchestrator/lib/intent-manager');
const fs = require('fs');
const path = require('path');

async function runTest() {
  console.log('🧪 Testing Task 1: Intelligence Core...');
  
  const role = 'tester';
  const task = 'Perform security audit for #security module.';
  
  const result = await injectIntent(role, task);
  
  if (result.success) {
    console.log('✅ Intent injected successfully.');
    
    const intentPath = path.join(__dirname, '../shared-context/intent-tester.json');
    if (fs.existsSync(intentPath)) {
      const intent = JSON.parse(fs.readFileSync(intentPath, 'utf8'));
      console.log('📦 Injected Tags:', intent.tags);
      console.log('🧠 Sniped Context Count:', intent.context.length);
      
      if (intent.tags.includes('#security') && intent.context.length > 0) {
        console.log('🎉 TEST PASSED: Context sniped based on tags!');
      } else {
        console.error('❌ TEST FAILED: Context or tags missing.');
      }
    } else {
      console.error('❌ TEST FAILED: intent-tester.json not found.');
    }
  } else {
    console.error('❌ TEST FAILED:', result.error);
  }
}

runTest();
