// [Intent] Orchestrator API for broadcasting and managing agentic behavioral intents across the farm. (2025-04-16)
const express = require('express');
const { injectIntent } = require('./lib/intent-manager');
const { getLatestAgentUpdates } = require('./lib/git-monitor');

const app = express();
app.use(express.json());

// [Intent] Expose agent status updates derived from Git commit history. (2025-04-16)
app.get('/status', async (req, res) => {
  try {
    const updates = await getLatestAgentUpdates();
    res.send(updates);
  } catch (error) {
    // [Intent] Gracefully handle and report Git monitoring failures. (2025-04-16)
    res.status(500).send({ error: 'Failed to fetch status', details: error.message });
  }
});

app.post('/broadcast', async (req, res) => {
  const { role, task } = req.body;

  // [Intent] Validate that 'role' and 'task' are present and are strings to ensure data integrity.
  if (!role || typeof role !== 'string' || !task || typeof task !== 'string') {
    return res.status(400).send({ 
      error: "Bad Request: 'role' and 'task' are required and must be strings." 
    });
  }

  const result = await injectIntent(role, task);

  if (result.success) {
    res.send({ status: 'Intent Dispatched', role });
  } else {
    res.status(500).send({ error: "Internal Server Error: Failed to dispatch intent.", details: result.error });
  }
});

app.listen(3000, () => console.log('Orchestrator API running on port 3000'));
