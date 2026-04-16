// [Intent] Verification script for Git monitoring logic. (2025-04-16)
const { getLatestAgentUpdates } = require('./lib/git-monitor');

async function verify() {
  console.log('Testing getLatestAgentUpdates...');
  try {
    const updates = await getLatestAgentUpdates();
    console.log('SUCCESS: Git monitor is functional.');
    console.log('Latest Agent Updates (filtered by agent/):', JSON.stringify(updates, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('FAILURE: Git monitor encountered an error:', error);
    process.exit(1);
  }
}

verify();
