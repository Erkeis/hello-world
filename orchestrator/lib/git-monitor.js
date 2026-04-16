// [Intent] Provides Git monitoring capabilities to track agent progress via commit history. (2025-04-16)
const simpleGit = require('simple-git');
const path = require('path');

// [Intent] Initialize Git client pointing to the project root. (2025-04-16)
const git = simpleGit(path.join(__dirname, '../../'));

/**
 * [Intent] Fetches the latest 10 commits that represent agent status updates.
 * Agents report upward by committing with the 'agent/' prefix.
 */
async function getLatestAgentUpdates() {
  try {
    const log = await git.log({ n: 10 });
    // [Intent] Filter only commits that follow the 'agent/' reporting convention. (2025-04-16)
    return log.all.filter(commit => commit.message.startsWith('agent/'));
  } catch (error) {
    // [Intent] Ensure errors in Git operations don't crash the orchestrator. (2025-04-16)
    throw new Error(`Git monitor failure: ${error.message}`);
  }
}

module.exports = { getLatestAgentUpdates };
