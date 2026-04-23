// [Intent] Orchestrator API for broadcasting and managing agentic behavioral intents across the farm. (2025-04-16)
const express = require('express');
const config = require('./config');
const logStreamer = require('./lib/log-streamer');
const mergeManager = require('./lib/merge-manager');
const { injectIntent, validateReport } = require('./lib/intent-manager');
const { getLatestAgentUpdates, startBranchWatcher } = require('./lib/git-monitor');

const app = express();
app.use(express.json());

// [Intent] Start the unified log bus. (2026-04-17)
logStreamer.start();

// [Intent] Start the branch watcher to automatically trigger merges. (2026-04-17)
startBranchWatcher();

// [Intent] Unified SSE endpoint for streaming logs from all agents. (2026-04-17)
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // [Intent] Send an initial heartbeat/connection confirmation.
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  const onLog = (log) => {
    res.write(`data: ${JSON.stringify({ type: 'log', ...log })}\n\n`);
  };

  logStreamer.on('log', onLog);

  // [Intent] Ensure explicit cleanup on client disconnect to prevent memory leaks. (2026-04-17)
  req.on('close', () => {
    logStreamer.removeListener('log', onLog);
  });
});

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

// [Intent] API endpoint for Stakeholder (User) to approve a pending agent proposal. (2026-04-18)
const { setStatusApproved } = require('./lib/intent-manager');
const { agileReset } = require('./lib/session-manager');

app.post('/agent/:id/approve', async (req, res) => {
  const { id } = req.params;
  const result = await setStatusApproved(id);
  if (result.success) {
    res.send({ status: 'APPROVED', agentId: id });
  } else {
    res.status(404).send({ error: result.error });
  }
});

// [Intent] API endpoint to trigger a manual session reset and re-provisioning of an agent. (2026-04-18)
app.post('/agent/:id/provision', async (req, res) => {
  const { id } = req.params;
  const result = await agileReset(id);
  if (result.success) {
    res.send({ status: 'PROVISIONING_STARTED', agentId: id });
  } else {
    res.status(500).send({ error: "Failed to reset agent", details: result.error });
  }
});

// [Intent] API endpoint for agents to submit structured findings. (2025-04-18)
app.post('/report', (req, res) => {
  const validation = validateReport(req.body);

  if (!validation.isValid) {
    // [Intent] Reject non-standard reports immediately to maintain ecosystem purity.
    return res.status(400).send({
      error: 'Invalid Report Format',
      details: validation.errors
    });
  }

  // [Intent] Log the standardized report for auditability. In a real production system, this would be appended to a database or decision-log.jsonl.
  console.log('[Orchestrator] Standardized Report Received:', JSON.stringify(req.body, null, 2));
  
  res.send({ status: 'Report Accepted', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(config.port, '0.0.0.0', () => console.log(`Orchestrator API running on port ${config.port}`));
}

module.exports = app;
