// tests/test-phase5-report-validation.js
const { validateReport } = require('../orchestrator/lib/intent-manager');
const app = require('../orchestrator/index');
const http = require('http');
const assert = require('assert');

async function runTests() {
  console.log('🧪 Testing Phase 5 Task 1: Report Validation Logic & API...');

  // 1. Internal Logic Validation
  const validReport = {
    agentId: 'qa-scout',
    finding: 'Found a memory leak in the log streamer.',
    evidence: 'Heap usage increased by 200MB over 10 minutes.',
    risk: 'high',
    next_step: 'Implement a cleanup listener for SSE connections.'
  };

  const v1 = validateReport(validReport);
  console.log('Test 1 (Internal Valid):', v1.isValid ? '✅ PASS' : '❌ FAIL');
  assert.strictEqual(v1.isValid, true);

  const v2 = validateReport({ finding: 'missing fields' });
  console.log('Test 2 (Internal Missing Fields):', !v2.isValid ? '✅ PASS' : '❌ FAIL');
  assert.strictEqual(v2.isValid, false);
  assert.ok(v2.errors.length > 0);

  // 2. API Endpoint Validation
  const port = 3001; // Use a different port for testing
  const server = app.listen(port, '0.0.0.0', async () => {
    console.log(`🚀 Test server running on port ${port}`);

    try {
      // Test Case A: Valid POST /report
      console.log('📡 Testing valid POST /report...');
      await request(port, '/report', 'POST', validReport, (res, body) => {
        assert.strictEqual(res.statusCode, 200);
        assert.strictEqual(body.status, 'Report Accepted');
        console.log('✅ Valid report accepted by API.');
      });

      // Test Case B: Invalid POST /report (Missing field)
      console.log('📡 Testing invalid POST /report (Missing next_step)...');
      const invalidReport = { ...validReport };
      delete invalidReport.next_step;
      await request(port, '/report', 'POST', invalidReport, (res, body) => {
        assert.strictEqual(res.statusCode, 400);
        assert.strictEqual(body.error, 'Invalid Report Format');
        assert.ok(body.details.some(d => d.includes('next_step')));
        console.log('✅ Invalid report rejected by API as expected.');
      });

      console.log('\n🎉 ALL PHASE 5 TASK 1 TESTS PASSED!');
      process.exit(0);
    } catch (err) {
      console.error('❌ TEST FAILED:', err);
      process.exit(1);
    } finally {
      server.close();
    }
  });
}

/**
 * Helper to make HTTP requests in the test.
 */
function request(port, path, method, data, callback) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          callback(res, parsed);
          resolve();
        } catch (e) {
          reject(new Error(`Failed to parse response: ${responseBody}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

runTests();
