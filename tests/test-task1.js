const { injectIntent } = require('../orchestrator/lib/intent-manager');
const fs = require('fs').promises;
const path = require('path');

async function runTest() {
  console.log('--- Testing Task 1: Intelligence Core ---');
  
  const role = 'tester';
  const task = 'Verify frontend and backend integration #frontend #backend';
  
  const result = await injectIntent(role, task);
  
  if (result.success) {
    const filePath = path.join(__dirname, '../shared-context', `intent-${role}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    const intent = JSON.parse(content);
    
    console.log('Intent injected successfully.');
    console.log('Extracted Tags:', intent.tags);
    console.log('Context Entries Found:', intent.context.length);
    
    if (intent.tags.includes('#frontend') && intent.tags.includes('#backend')) {
      console.log('SUCCESS: Tags extracted correctly.');
    } else {
      console.error('FAILURE: Tags not extracted correctly.');
    }
    
    if (intent.context.length > 0) {
      console.log('SUCCESS: Context injected.');
      intent.context.forEach(entry => {
        console.log(` - [${entry.tags.join(', ')}] ${entry.decision}`);
      });
    } else {
      console.error('FAILURE: No context injected.');
    }
  } else {
    console.error('FAILURE: Intent injection failed:', result.error);
  }
}

runTest().catch(console.error);
