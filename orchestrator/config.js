require('dotenv').config();
const path = require('path');

// [Intent] Centralize configuration management for the orchestrator (2026-04-17)
const config = {
  port: process.env.PORT || 3000,
  sharedContextPath: process.env.SHARED_CONTEXT_PATH || path.resolve(__dirname, '../shared-context'),
  repoPath: process.env.REPO_PATH || path.resolve(__dirname, '..'),
};

module.exports = config;
