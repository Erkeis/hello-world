// [Intent] Provides O(1) writing and efficient tag-based filtering for decision logs to inject historical context into agent intents. (2025-04-18)
const path = require('path');
const readline = require('readline');
const { createReadStream } = require('fs');

const LOG_PATH = path.join(__dirname, '../../docs/log/decision-log.jsonl');

/**
 * Snipes relevant context from the decision log based on tags.
 * @param {string[]} tags - Array of tags to filter by (e.g., ['#security']).
 * @returns {Promise<Object[]>} - Array of matching decision entries.
 */
async function snipeContext(tags = []) {
  // [Intent] If no tags are provided, we don't return any context to keep the intent file lean.
  if (!tags || tags.length === 0) return [];

  const matches = [];
  
  try {
    const fileStream = createReadStream(LOG_PATH);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (!line.trim()) continue;
      try {
        const entry = JSON.parse(line);
        // [Intent] Match if any of the requested tags exist in the entry's tags.
        const hasMatch = tags.some(tag => entry.tags && entry.tags.includes(tag));
        if (hasMatch) {
          matches.push(entry);
        }
      } catch (parseError) {
        console.error(`[ContextSniper] Failed to parse log line: ${line}`, parseError);
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`[ContextSniper] Decision log not found at ${LOG_PATH}`);
      return [];
    }
    console.error(`[ContextSniper] Error reading decision log:`, error);
  }

  return matches;
}

module.exports = { snipeContext };
