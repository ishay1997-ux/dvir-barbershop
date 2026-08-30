/**
 * CutWeb Smoke Test Core Engine
 * Pragmatic, High-Performance Production & Staging Verification Engine
 */

/**
 * Executes a single smoke test suite against the target base URL
 * @param {Object} suite
 * @param {string} baseUrl
 * @returns {Promise<{ passed: number, failed: number, results: Array }>}
 */
export async function executeSmokeSuite(suite, baseUrl) {
  console.log(`\n=======================================================`);
  console.log(`📦 [Suite: ${suite.id.toUpperCase()}] ${suite.title}`);
  console.log(`ℹ️  ${suite.description}`);
  console.log(`=======================================================`);

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const target of suite.targets) {
    const fullUrl = `${baseUrl}${target.path}`;
    const startTime = Date.now();

    try {
      const response = await fetch(fullUrl, {
        method: target.method || 'GET',
        headers: {
          'User-Agent': 'CutWeb-QualityRunner/2.0',
          Accept: target.expectedContentType || '*/*',
          ...(target.body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: target.body ? JSON.stringify(target.body) : undefined,
      });

      const latency = Date.now() - startTime;
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      const errors = [];

      // 1. Status Code Check
      if (response.status !== target.expectedStatus) {
        errors.push(`Status: Expected ${target.expectedStatus}, got ${response.status}`);
      }

      // 2. Content-Type Check
      if (
        target.expectedContentType &&
        !contentType.toLowerCase().includes(target.expectedContentType.toLowerCase())
      ) {
        errors.push(`Content-Type: Expected '${target.expectedContentType}', got '${contentType}'`);
      }

      // 3. Content Body Assertion
      if (target.contentCheck) {
        if (typeof target.contentCheck === 'string' && !text.includes(target.contentCheck)) {
          errors.push(`Body Assertion: Missing expected keyword "${target.contentCheck}"`);
        } else if (
          target.contentCheck instanceof RegExp &&
          !target.contentCheck.test(text)
        ) {
          errors.push(`Body Assertion: Failed RegExp check ${target.contentCheck}`);
        }
      }

      // 4. Latency SLA Check
      const isSlow = target.maxLatencyMs && latency > target.maxLatencyMs;
      const latencyIndicator = isSlow ? `⚠️ ${latency}ms (SLA: ${target.maxLatencyMs}ms)` : `${latency}ms`;

      if (errors.length === 0) {
        passed++;
        console.log(`  ✅ [${response.status}] ${target.name.padEnd(38)} -> ${target.path} (${latencyIndicator})`);
        results.push({ name: target.name, path: target.path, status: 'PASS', latency });
      } else {
        failed++;
        console.log(`  ❌ [FAIL] ${target.name.padEnd(38)} -> ${target.path} (${latencyIndicator})`);
        errors.forEach((err) => console.log(`     ↳ ${err}`));
        results.push({ name: target.name, path: target.path, status: 'FAIL', errors, latency });
      }
    } catch (err) {
      failed++;
      console.log(`  ❌ [NETWORK_ERROR] ${target.name.padEnd(38)} -> ${target.path}`);
      console.log(`     ↳ ${err.message}`);
      results.push({ name: target.name, path: target.path, status: 'ERROR', error: err.message });
    }
  }

  return { passed, failed, results };
}
