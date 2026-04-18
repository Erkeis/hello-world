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
  const extractedTags = task.match(/#[\w-]+/g) || [];
  const tags = [...new Set([...extractedTags, ...additionalTags])];

  // [Intent] Fetch historical context based on tags to empower the agent with "why" and "past decisions".
  const context = await snipeContext(tags);

  // [Intent] Assign risk level (1-3) based on task keywords to enable tiered approval. (2026-04-18)
  let riskLevel = 1; // Default: Low (Auto-approve)
  const taskLower = task.toLowerCase();
  if (taskLower.includes('fix') || taskLower.includes('add test') || taskLower.includes('lint')) {
    riskLevel = 2; // Medium: Notify (Implicit)
  }
  if (taskLower.includes('refactor') || taskLower.includes('delete') || taskLower.includes('architecture') || taskLower.includes('logic')) {
    riskLevel = 3; // High: Manual Gate (Explicit Approval)
  }

  const intent = {
    role: sanitizedRole,
    task,
    tags,
    context,
    riskLevel,
    status: riskLevel === 3 ? 'PENDING_APPROVAL' : 'APPROVED',
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(SHARED_PATH, `intent-${sanitizedRole}.json`);
  const tempPath = `${filePath}.tmp`;

  try {
    // [Intent] Ensure the shared context directory exists before writing to prevent ENOENT errors.
    await fs.mkdir(SHARED_PATH, { recursive: true });

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
