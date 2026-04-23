// [Intent] Manage sequential branch merges to session-branch (main) and handle conflicts. (2026-04-17)
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const logStreamer = require('./log-streamer');

// [Intent] Initialize Git client at project root or path specified by environment.
const git = simpleGit(config.repoPath);
const sessionBranch = 'main';

let mergeQueue = [];
let isProcessing = false;

/**
 * [Intent] Enqueue a branch for merging into the session-branch.
 * @param {string} agentName
 * @param {string} branchName 
 */
function enqueueMerge(agentName, branchName) {
  console.log(`[MergeManager] Queueing merge for agent ${agentName} (branch: ${branchName})`);
  mergeQueue.push({ agentName, branchName });
  if (!isProcessing) {
    processQueue();
  }
}

/**
 * [Intent] Process the merge queue sequentially to avoid Git index locks.
 */
async function processQueue() {
  if (mergeQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const item = mergeQueue.shift();

  try {
    await performMerge(item.agentName, item.branchName);
  } catch (error) {
    console.error(`[MergeManager] Fatal error during queue processing: ${error.message}`);
  }

  // Process next item in queue
  processQueue();
}

/**
 * [Intent] Perform the merge operation and handle conflicts with a fail-fast strategy.
 * @param {string} agentName
 * @param {string} branchName 
 */
async function performMerge(agentName, branchName) {
  try {
    console.log(`[MergeManager] Attempting merge: ${branchName} -> ${sessionBranch} for agent ${agentName}`);

    // [Intent] Switch to target branch before merge.
    await git.checkout(sessionBranch);

    // [Intent] Attempt to merge the agent's isolated branch.
    try {
      await git.merge([branchName]);
      console.log(`[MergeManager] Successfully merged ${branchName}`);
      
      // [Intent] Notify the Hub via the log streamer.
      logStreamer.emit('log', {
        agentId: agentName,
        type: 'MERGE_SUCCESS',
        timestamp: new Date().toISOString(),
        message: `Branch ${branchName} merged into ${sessionBranch}`
      });
    } catch (mergeError) {
      // [Intent] Fail-fast on conflict: abort merge and mark agent status.
      console.error(`[MergeManager] Conflict merging ${branchName}`);

      await git.merge(['--abort']);

      // [Intent] Write status file to block the agent.
      const blockedFile = path.join(config.sharedContextPath, `status-${agentName}.blocked`);
      fs.writeFileSync(blockedFile, '');

      logStreamer.emit('log', {
        agentId: agentName,
        type: 'MERGE_CONFLICT',
        status: 'BLOCKED:CONFLICT',
        timestamp: new Date().toISOString(),
        message: `Merge conflict on ${branchName}. Branch isolation preserved. Agent stopped.`
      });
    }
  } catch (err) {
    console.error(`[MergeManager] Error during merge of ${branchName}: ${err.message}`);
  }
}

module.exports = { enqueueMerge };
