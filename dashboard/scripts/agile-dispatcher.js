// [Intent] Concept Decomposition Engine to translate high-level goals into multi-agent tasks via the Orchestrator API. (2026-04-23)
import { fileURLToPath } from 'url';

const TAG_MAP = {
  'UI': '#frontend',
  'CSS': '#frontend',
  'HTML': '#frontend',
  'REACT': '#frontend',
  'API': '#backend',
  'DATABASE': '#backend',
  'AUTH': '#security',
  'SECURITY': '#security',
  'TEST': '#quality',
  'QA': '#quality'
};

/**
 * [Intent] Infers a tag based on keywords found in the concept string.
 */
function getTag(concept) {
  const upperConcept = concept.toUpperCase();
  for (const [key, tag] of Object.entries(TAG_MAP)) {
    if (upperConcept.includes(key)) return tag;
  }
  return concept; // Fallback to original concept if no keyword matches
}

const AGENT_TEMPLATES = {
  'ux-vision': (tag) => `Review the current CSS for ${tag} consistency and propose improvements.`,
  'front-pilot': (tag) => `Implement the ${tag} UI fixes based on the UX vision.`,
  'qa-scout': (tag) => `Conduct a thorough QA sweep of ${tag} to identify any regressions.`,
  'sec-forge': (tag) => `Audit the ${tag} implementation for potential security vulnerabilities.`,
  'tester': (tag) => `Create comprehensive test cases for ${tag} to ensure functional correctness.`
};

/**
 * [Intent] Decomposes a high-level concept into specific tasks for target agents and broadcasts them.
 */
export async function dispatchConcept(concept, targets) {
  const tag = getTag(concept);
  const results = [];
  
  console.log(`[AgileDispatcher] Decomposing concept: "${concept}" -> Tag: ${tag}`);

  for (const target of targets) {
    const template = AGENT_TEMPLATES[target];
    if (!template) {
      console.warn(`[AgileDispatcher] No template found for agent: ${target}`);
      continue;
    }

    const task = template(tag);
    
    try {
      const response = await fetch('http://localhost:3000/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: target,
          task: task
        })
      });

      const data = await response.json();
      results.push({ target, status: response.status, data });
    } catch (error) {
      console.error(`[AgileDispatcher] Failed to broadcast to ${target}:`, error.message);
      results.push({ target, status: 'error', error: error.message });
    }
  }

  return results;
}

// [Intent] CLI entry point for manual triggering or testing.
const isMain = process.argv[1] && (process.argv[1] === fileURLToPath(import.meta.url) || process.argv[1].endsWith('agile-dispatcher.js'));

if (isMain) {
  const concept = process.argv[2] || "Fix UI CSS";
  const targetsInput = process.argv[3];
  const targets = targetsInput ? targetsInput.split(',') : ["ux-vision", "front-pilot"];
  
  dispatchConcept(concept, targets).then(results => {
    console.log('Dispatch Results:', JSON.stringify(results, null, 2));
  });
}
