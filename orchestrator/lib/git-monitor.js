// [Intent] Provides Git monitoring capabilities to track agent progress via commit history. (2025-04-16)
const simpleGit = require('simple-git');
const path = require('path');

// [Intent] Initialize Git client pointing to the project root. (2025-04-16)
const git = simpleGit(path.join(__dirname, '../../'));

const { enqueueMerge } = require('./merge-manager');

/**
 * [Intent] Fetches the latest 10 commits that represent agent status updates.
 * Agents report upward by committing with the 'agent/' prefix.
 */
async function getLatestAgentUpdates() {
  try {
    // [Intent] Directly fetch up to 100 agent-specific commits using Git grep for efficiency and robustness. (2025-04-16)
    const log = await git.log({ n: 100, '--grep': '^agent/' });
    return log.all;
  } catch (error) {
    // [Intent] Ensure errors in Git operations don't crash the orchestrator. (2025-04-16)
    throw new Error(`Git monitor failure: ${error.message}`);
  }
}

/**
 * [Intent] Periodically polls the repository for new agent branches to merge. (2026-04-17)
 */
function startBranchWatcher() {
  console.log('[GitMonitor] Starting branch watcher...');
  setInterval(async () => {
    try {
      const branches = await git.branchLocal();
      const agentBranches = branches.all.filter(b => b.startsWith('agent/'));
      
      for (const branch of agentBranches) {
        // [Intent] For simplicity in this session, we queue merges for all agent branches found.
        // In production, we would track which SHAs have already been merged.
        const agentName = branch.replace('agent/', '');
        enqueueMerge(agentName, branch);
      }
    } catch (err) {
      console.error('[GitMonitor] Branch watcher error:', err.message);
    }
  }, 10000); // Check every 10 seconds
}

module.exports = { getLatestAgentUpdates, startBranchWatcher };
