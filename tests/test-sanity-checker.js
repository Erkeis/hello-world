/**
 * [Intent]
 * Verification test for Phase 4 Task 2 - Git-Harness Sanity Checker.
 * Simulates violations and confirms the checker catches them.
 * (2026-04-23)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORK_DIR = path.resolve(__dirname, '../');
const SCRIPT_PATH = 'orchestrator/scripts/sanity-checker.js';
const GITIGNORE_PATH = path.join(WORK_DIR, '.gitignore');
const LIB_FILE = path.join(WORK_DIR, 'orchestrator/lib/test-violation.tmp');

function runChecker() {
  try {
    execSync(`node ${SCRIPT_PATH}`, { cwd: WORK_DIR, stdio: 'pipe' });
    return { success: true, output: '' };
  } catch (err) {
    return { success: false, output: err.stdout.toString() + err.stderr.toString() };
  }
}

async function test() {
  console.log('Starting Sanity Checker Verification...');

  // 1. Initial run (should fail due to 'docs:' commit message in history)
  console.log('\n--- Test 0: Initial Run ---');
  let result = runChecker();
  if (!result.success && result.output.includes('docs:')) {
    console.log('PASSED: Checker correctly identified non-compliant commit message in history.');
  } else {
    console.error('FAILED: Initial run did not catch the expected commit message violation.');
    console.log(result.output);
    // Note: If history was clean, this would fail the test, but we know it's not.
  }

  // 2. Simulate .gitignore violation
  console.log('\n--- Test 1: .gitignore violation ---');
  const originalGitignore = fs.readFileSync(GITIGNORE_PATH, 'utf8');
  const brokenGitignore = originalGitignore.replace('.agent/', '# .agent/');
  fs.writeFileSync(GITIGNORE_PATH, brokenGitignore);
  
  result = runChecker();
  fs.writeFileSync(GITIGNORE_PATH, originalGitignore); // Restore
  
  if (!result.success && result.output.includes('.agent/')) {
    console.log('PASSED: Checker caught missing .agent/ in .gitignore.');
  } else {
    console.error('FAILED: Checker did not catch .gitignore violation.');
    console.log(result.output);
  }

  // 3. Simulate uncommitted modification in sensitive path
  console.log('\n--- Test 2: Uncommitted modification violation ---');
  fs.writeFileSync(LIB_FILE, 'test violation content');
  
  result = runChecker();
  if (fs.existsSync(LIB_FILE)) fs.unlinkSync(LIB_FILE); // Cleanup
  
  if (!result.success && result.output.includes('Uncommitted modifications in sensitive directories')) {
    console.log('PASSED: Checker caught uncommitted modification in orchestrator/lib/.');
  } else {
    console.error('FAILED: Checker did not catch uncommitted modification.');
    console.log(result.output);
  }

  console.log('\nVerification Complete.');
}

test().catch(err => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
