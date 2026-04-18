// [Intent] Manages behavioral intent injection for agent coordination by persistsing intent metadata to a shared volume. (2025-04-16)
const fs = require('fs').promises;
const path = require('path');
const { snipeContext } = require('./context-sniper');

const SHARED_PATH = path.join(__dirname, '../../shared-context');

/**
 * Injects a coordination intent into the shared context.
 * @param {string} role - The role of the agent (sanitized to alphanumeric and hyphens).
 * @param {string} task - The task description.
 * @param {string[]} additionalTags - Optional explicit tags.
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function injectIntent(role, task, additionalTags = []) {
  // [Intent] Sanitize role to prevent path traversal attacks by restricting characters to alphanumeric and hyphens.
  const sanitizedRole = role.replace(/[^a-zA-Z0-9-]/g, '');
  
  // [Intent] Automatically extract tags from task description (e.g., #security) to ensure context relevance.
  const extractedTags = task.match(/#[a-zA-Z0-9]+/g) || [];
  const tags = [...new Set([...extractedTags, ...additionalTags])];

  // [Intent] Fetch historical context based on tags to empower the agent with "why" and "past decisions".
  const context = await snipeContext(tags);

  const intent = {
    role: sanitizedRole,
    task,
    tags,
    context,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(SHARED_PATH, `intent-${sanitizedRole}.json`);
  const tempPath = `${filePath}.tmp`;

  try {
    // [Intent] Use Atomic Write Pattern (Write to Temp -> Rename) to prevent race conditions where agents might read a partially written file.
    await fs.writeFile(tempPath, JSON.stringify(intent, null, 2));
    await fs.rename(tempPath, filePath);
    
    console.log(`[Orchestrator] Intent injected for ${sanitizedRole} with ${context.length} context entries`);
    return { success: true };
  } catch (error) {
    console.error(`[Orchestrator] Failed to inject intent for ${sanitizedRole}:`, error);
    // Cleanup temp file if it exists
    try { await fs.unlink(tempPath); } catch (_) {}
    return { success: false, error: error.message };
  }
}

module.exports = { injectIntent };
