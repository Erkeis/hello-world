/**
 * [Intent]
 * Governance Guardian: Sanity Checker for Phase 4.
 * Prevents pushing broken or non-compliant code.
 * (2026-04-23)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../../');
const GITIGNORE_PATH = path.join(ROOT_DIR, '.gitignore');

/**
 * 1. .gitignore must contain .agent/, .worktrees/, and *.log
 */
function checkGitignore() {
  console.log('[Rule 1] Checking .gitignore coverage...');
  if (!fs.existsSync(GITIGNORE_PATH)) {
    console.error('Error: .gitignore not found at ' + GITIGNORE_PATH);
    return false;
  }
  const content = fs.readFileSync(GITIGNORE_PATH, 'utf8');
  const lines = content.split('\n').map(l => l.trim());
  const required = ['.agent/', '.worktrees/', '*.log'];
  
  let missing = [];
  for (const item of required) {
    // Check if any non-commented line matches the item
    const found = lines.some(line => {
      if (line.startsWith('#')) return false;
      return line === item || line.includes(item);
    });
    
    if (!found) {
      missing.push(item);
    }
  }
  
  if (missing.length > 0) {
    console.error(`FAILED: .gitignore is missing or has commented-out entries: ${missing.join(', ')}`);
    return false;
  }
  console.log('PASSED: .gitignore coverage verified.');
  return true;
}

/**
 * 2. No uncommitted modifications exist in agent-harness/ or orchestrator/lib/
 */
function checkUncommitted() {
  console.log('[Rule 2] Checking for uncommitted modifications in sensitive paths...');
  try {
    const status = execSync('git status --porcelain', { cwd: ROOT_DIR }).toString();
    const sensitiveDirs = ['agent-harness/', 'orchestrator/lib/'];
    const lines = status.split('\n').filter(line => line.trim().length > 0);
    
    let violations = [];
    for (const line of lines) {
      // Porcelain format: XY PATH
      const filePath = line.substring(3).replace(/\\/g, '/');
      for (const dir of sensitiveDirs) {
        if (filePath.startsWith(dir)) {
          violations.push(filePath);
        }
      }
    }
    
    if (violations.length > 0) {
      console.error(`FAILED: Uncommitted modifications in sensitive directories:\n  - ${violations.join('\n  - ')}`);
      return false;
    }
    console.log('PASSED: No uncommitted changes in sensitive paths.');
    return true;
  } catch (err) {
    console.error('Error running git status:', err.message);
    return false;
  }
}

/**
 * 3. Most recent 5 commit messages must start with allowed prefixes
 */
function checkCommitMessages() {
  console.log('[Rule 3] Verifying recent commit message conventions...');
  try {
    const messages = execSync('git log -n 5 --pretty=format:%s', { cwd: ROOT_DIR })
      .toString()
      .split('\n')
      .map(m => m.trim());
      
    const allowedPrefixes = ['feat:', 'fix:', 'chore:', 'agent/', 'merge:'];
    
    let violations = [];
    for (const msg of messages) {
      // Strip potential leading/trailing quotes or backslashes from shell output
      const cleanMsg = msg.replace(/^["\\]+/, '').replace(/["\\]+$/, '');
      const isAllowed = allowedPrefixes.some(prefix => cleanMsg.toLowerCase().startsWith(prefix.toLowerCase()));
      if (!isAllowed) {
        violations.push(msg);
      }
    }
    
    if (violations.length > 0) {
      console.error(`FAILED: Commit messages do not follow convention:\n  - ${violations.join('\n  - ')}`);
      console.error(`Allowed prefixes: ${allowedPrefixes.join(', ')}`);
      return false;
    }
    console.log('PASSED: Commit message conventions verified.');
    return true;
  } catch (err) {
    console.error('Error running git log:', err.message);
    return false;
  }
}

function main() {
  console.log('=== Governance Guardian: Sanity Checker ===');
  let success = true;
  
  if (!checkGitignore()) success = false;
  console.log('');
  
  if (!checkUncommitted()) success = false;
  console.log('');
  
  if (!checkCommitMessages()) success = false;
  console.log('');

  if (success) {
    console.log('RESULT: All sanity checks PASSED.');
    process.exit(0);
  } else {
    console.error('RESULT: Sanity checks FAILED. Push aborted.');
    process.exit(1);
  }
}

main();
