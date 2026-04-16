const express = require('express');
const { injectIntent } = require('./lib/intent-manager');
const app = express();
app.use(express.json());

app.post('/broadcast', (req, res) => {
  const { role, task } = req.body;
  injectIntent(role, task);
  res.send({ status: 'Intent Dispatched', role });
});

app.listen(3000, () => console.log('Orchestrator API running on port 3000'));
