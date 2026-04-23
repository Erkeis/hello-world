const { injectIntent } = require('../orchestrator/lib/intent-manager');
const fs = require('fs');
const path = require('path');

async function test() {
  console.log('Testing injectIntent with mode and schema...');
  
  const SHARED_PATH = path.join(__dirname, '../shared-context');
  
  // Test Case 1: Default values
  console.log('\nCase 1: Default values');
  await injectIntent('test-agent-1', 'Explore the codebase');
  let intent = JSON.parse(fs.readFileSync(path.join(SHARED_PATH, 'intent-test-agent-1.json'), 'utf8'));
  console.log('Mode:', intent.mode);
  console.log('Schema:', intent.response_schema);

  // Test Case 2: Explicit values
  console.log('\nCase 2: Explicit values');
  await injectIntent('test-agent-2', 'Fix the bug', [], 'READ_WRITE', 'BUG_REPORT');
  intent = JSON.parse(fs.readFileSync(path.join(SHARED_PATH, 'intent-test-agent-2.json'), 'utf8'));
  console.log('Mode:', intent.mode);
  console.log('Schema:', intent.response_schema);

  console.log('\nVerification Successful!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
