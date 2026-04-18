// [Intent] Provides Docker-native session purification by performing granular container restarts to ensure a clean slate between tasks. (2026-04-18)
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Performs a "Hard-Reset" on a specific agent container.
 * This ensures all internal memory, temporary files, and ghost contexts are cleared.
 * @param {string} agentId - The invariant identity of the agent (container name).
 * @returns {Promise<{success: boolean, output?: string, error?: string}>}
 */
async function agileReset(agentId) {
  console.log(`[SessionManager] Initiating Hard-Reset for agent: ${agentId}`);
  
  try {
    // [Intent] Use 'docker restart' as the most robust way to flush state in a containerized environment.
    const { stdout, stderr } = await execPromise(`docker restart ${agentId}`);
    
    if (stderr && !stderr.includes('Warning')) {
      console.warn(`[SessionManager] Restart warning for ${agentId}:`, stderr);
    }
    
    console.log(`[SessionManager] Agent ${agentId} purified and restarted successfully.`);
    return { success: true, output: stdout.trim() };
  } catch (error) {
    console.error(`[SessionManager] Failed to restart agent ${agentId}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { agileReset };
