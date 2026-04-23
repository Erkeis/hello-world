// tests/test-agile-dispatcher.js
import { dispatchConcept } from '../dashboard/scripts/agile-dispatcher.js';

async function runDispatcherTest() {
  console.log('🧪 Testing Phase 4 Task 4: Agile HR Dispatcher...');

  // [Intent] Mock the global fetch to avoid needing a running orchestrator during unit testing.
  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    console.log(`📡 [Mock Fetch] URL: ${url}, Role: ${body.role}`);
    return {
      status: 200,
      ok: true,
      json: async () => ({ status: 'Intent Dispatched', role: body.role })
    };
  };

  const concept = "Improve API Security";
  const targets = ["sec-forge", "tester"];
  
  console.log(`📤 Dispatching Concept: "${concept}" to ${targets.join(', ')}...`);
  
  const results = await dispatchConcept(concept, targets);

  console.log('📊 Results:', JSON.stringify(results, null, 2));

  // Verification
  const successCount = results.filter(r => r.status === 200).length;
  if (successCount === targets.length) {
    console.log('🎉 TEST PASSED: Concept correctly decomposed and multi-broadcasted!');
  } else {
    console.error('❌ TEST FAILED: Some broadcasts failed.');
    process.exit(1);
  }
}

runDispatcherTest();
