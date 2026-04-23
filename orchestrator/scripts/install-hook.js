/**
 * [Intent]
 * Helper script to install the sanity-checker as a pre-push hook.
 * (2026-04-23)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '../../');

function getGitHooksDir() {
  try {
    // In a worktree, --git-common-dir points to the main .git folder
    const commonDir = execSync('git rev-parse --git-common-dir', { cwd: ROOT_DIR }).toString().trim();
    return path.resolve(ROOT_DIR, commonDir, 'hooks');
  } catch (e) {
    try {
      const gitDir = execSync('git rev-parse --git-dir', { cwd: ROOT_DIR }).toString().trim();
      return path.resolve(ROOT_DIR, gitDir, 'hooks');
    } catch (e2) {
      return null;
    }
  }
}

const hooksDir = getGitHooksDir();

if (!hooksDir) {
  console.error('Error: Could not find .git directory. Are you in a git repository?');
  process.exit(1);
}

const prePushHookPath = path.join(hooksDir, 'pre-push');

const hookContent = `#!/bin/sh
# Governance Guardian: Sanity Checker Hook
# Installed by orchestrator/scripts/install-hook.js

echo "Running Governance Guardian Sanity Checker..."
node orchestrator/scripts/sanity-checker.js
`;

try {
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  fs.writeFileSync(prePushHookPath, hookContent);
  
  // Note: chmodSync 755 might not work on Windows as expected but doesn't hurt
  try {
    fs.chmodSync(prePushHookPath, '755');
  } catch (e) {
    // Ignore chmod errors on Windows
  }

  console.log('SUCCESS: Pre-push hook installed successfully.');
  console.log(`Location: ${prePushHookPath}`);
} catch (err) {
  console.error(`FAILED to install hook: ${err.message}`);
  process.exit(1);
}
