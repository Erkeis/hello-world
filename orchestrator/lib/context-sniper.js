// [Intent] Provides memory-efficient tag-based filtering for JSONL decision logs to inject historical context into agent intents. (2026-04-18)
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Snipes relevant context from the decision log based on tags.
 * @param {string} logPath - Path to the decision-log.jsonl file.
 * @param {string[]} targetTags - Array of tags to filter by (e.g., ['#security']).
 * @returns {Promise<Object[]>} - Array of matching decision entries.
 */
async function snipeContext(logPath, targetTags = []) {
  if (!targetTags || targetTags.length === 0) return [];
  
  const matches = [];
  
  if (!fs.existsSync(logPath)) {
    console.warn(`[ContextSniper] Log file not found: ${logPath}`);
    return [];
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      // Check if entry has any of the target tags
      const hasMatch = targetTags.some(tag => entry.tags && entry.tags.includes(tag));
      if (hasMatch) {
        matches.push(entry);
      }
    } catch (err) {
      console.error(`[ContextSniper] Failed to parse log line: ${line}`, err);
    }
  }

  return matches;
}

module.exports = { snipeContext };
