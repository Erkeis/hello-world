// [Intent] Manages behavioral intent injection for agent coordination by persistsing intent metadata to a shared volume. (2025-04-16)
const fs = require('fs').promises;
const path = require('path');

const SHARED_PATH = path.join(__dirname, '../../shared-context');

/**
 * Injects a coordination intent into the shared context.
 * @param {string} role - The role of the agent (sanitized to alphanumeric and hyphens).
 * @param {string} task - The task description.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function injectIntent(role, task) {
  // [Intent] Sanitize role to prevent path traversal attacks by restricting characters to alphanumeric and hyphens.
  const sanitizedRole = role.replace(/[^a-zA-Z0-9-]/g, '');
  
  const intent = {
    role: sanitizedRole,
    task,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(SHARED_PATH, `intent-${sanitizedRole}.json`);

  try {
    await fs.writeFile(filePath, JSON.stringify(intent, null, 2));
    console.log(`[Orchestrator] Intent injected for ${sanitizedRole}`);
    return { success: true };
  } catch (error) {
    console.error(`[Orchestrator] Failed to inject intent for ${sanitizedRole}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = { injectIntent };
