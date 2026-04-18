const chokidar = require('chokidar');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const config = require('../config');

// [Intent] Provide a unified log bus by watching log files and emitting events (2026-04-17)
class LogStreamer extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
    this.watcher = null;
    this.fileOffsets = new Map();
  }

  start() {
    const logPattern = path.join(config.sharedContextPath, '*.log');
    console.log(`[LogStreamer] Starting to watch: ${logPattern}`);

    this.watcher = chokidar.watch(logPattern, {
      persistent: true,
      ignoreInitial: false,
      usePolling: true, // Often more reliable in container/network shares
      interval: 100,
    });

    this.watcher
      .on('add', (filePath) => {
        console.log(`[LogStreamer] File added: ${filePath}`);
        this.handleFileChange(filePath, true);
      })
      .on('change', (filePath) => {
        console.log(`[LogStreamer] File changed: ${filePath}`);
        this.handleFileChange(filePath, false);
      })
      .on('unlink', (filePath) => {
        console.log(`[LogStreamer] File removed: ${filePath}`);
        this.fileOffsets.delete(filePath);
      })
      .on('error', (error) => console.error(`[LogStreamer] Watcher error: ${error}`));
  }

  handleFileChange(filePath, isNew) {
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const agentId = fileName.replace('.log', '');
    
    let start = this.fileOffsets.get(filePath) || 0;
    
    // If file was truncated or is new, start from beginning
    if (stats.size < start) start = 0;

    // [Intent] Update offset IMMEDIATELY to prevent race conditions during async reading. (2026-04-17)
    const currentSize = stats.size;
    this.fileOffsets.set(filePath, currentSize);

    if (currentSize > start) {
      const stream = fs.createReadStream(filePath, { start, end: currentSize - 1 });
      const rl = readline.createInterface({
        input: stream,
        terminal: false
      });

      rl.on('line', (line) => {
        if (line.trim() !== '') {
          this.emit('log', {
            agentId,
            timestamp: new Date().toISOString(),
            message: line
          });
        }
      });
    }
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}

const logStreamer = new LogStreamer();
module.exports = logStreamer;
