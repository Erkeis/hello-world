// [Intent] Node.js CLI to generate docker-compose.yml from agents roster (2026-04-17)
const fs = require('fs');
const path = require('path');

const AGENTS_FILE = path.join(__dirname, 'agents.json');
const COMPOSE_TEMPLATE_FILE = path.join(__dirname, 'templates', 'docker-compose.tmpl');
const SERVICE_TEMPLATE_FILE = path.join(__dirname, 'templates', 'service.tmpl');
const OUTPUT_FILE = path.join(__dirname, '..', 'docker-compose.yml');

/**
 * Generates a service definition from a template
 * @param {Object} agent Agent data
 * @param {string} template Service template string
 * @returns {string} Populated service definition
 */
function generateService(agent, template) {
  return template
    .replace(/{{NAME}}/g, agent.name)
    .replace(/{{PORT}}/g, agent.port)
    .replace(/{{ROLE}}/g, agent.role);
}

function main() {
  if (!fs.existsSync(AGENTS_FILE)) {
    console.error(`Agents file not found: ${AGENTS_FILE}`);
    process.exit(1);
  }

  if (!fs.existsSync(COMPOSE_TEMPLATE_FILE)) {
    console.error(`Compose template file not found: ${COMPOSE_TEMPLATE_FILE}`);
    process.exit(1);
  }

  if (!fs.existsSync(SERVICE_TEMPLATE_FILE)) {
    console.error(`Service template file not found: ${SERVICE_TEMPLATE_FILE}`);
    process.exit(1);
  }

  try {
    const agents = JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf8'));
    const composeTemplate = fs.readFileSync(COMPOSE_TEMPLATE_FILE, 'utf8');
    const serviceTemplate = fs.readFileSync(SERVICE_TEMPLATE_FILE, 'utf8');

    const services = agents.map(agent => generateService(agent, serviceTemplate)).join('\n');
    const output = composeTemplate.replace('{{SERVICES}}', services);

    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Successfully generated ${OUTPUT_FILE} with ${agents.length} agents.`);
  } catch (error) {
    console.error(`Error generating farm: ${error.message}`);
    process.exit(1);
  }
}

main();
