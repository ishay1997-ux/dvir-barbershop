#!/usr/bin/env node

/**
 * CutWeb Master Smoke Suite Runner
 * Pragmatic, Multi-Surface Production Verification CLI
 * 
 * Usage:
 *   node scripts/smoke/runner.mjs                  # Runs all suites
 *   node scripts/smoke/runner.mjs --suite=marketing # Marketing only
 *   node scripts/smoke/runner.mjs --suite=demos     # Niche Demos only
 *   node scripts/smoke/runner.mjs --suite=admin     # Merchant Admin only
 *   node scripts/smoke/runner.mjs --suite=super     # Super Admin only
 */

import { executeSmokeSuite } from './engine.mjs';
import { marketingSuite } from './suites/marketing.mjs';
import { demosSuite } from './suites/demos.mjs';
import { businessAdminSuite } from './suites/business-admin.mjs';
import { superAdminSuite } from './suites/super-admin.mjs';

const ALL_SUITES = [
  marketingSuite,
  demosSuite,
  businessAdminSuite,
  superAdminSuite,
];

const BASE_URL = process.env.BASE_URL || 'https://thecut-reg-in.vercel.app';

// Parse command line arguments
const args = process.argv.slice(2);
const suiteArg = args.find((a) => a.startsWith('--suite='))?.split('=')[1]?.toLowerCase();

const suitesToRun = suiteArg
  ? ALL_SUITES.filter((s) => s.id === suiteArg || s.id.startsWith(suiteArg))
  : ALL_SUITES;

if (suitesToRun.length === 0) {
  console.error(`🚨 Unknown suite: "${suiteArg}". Available suites: marketing, demos, admin, super`);
  process.exit(1);
}

async function main() {
  console.log(`\n=======================================================`);
  console.log(`🚀 CutWeb Pragmatic Multi-Surface Smoke Runner`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log(`📋 Active Suites (${suitesToRun.length}): ${suitesToRun.map((s) => s.id.toUpperCase()).join(', ')}`);
  console.log(`=======================================================`);

  const globalStart = Date.now();
  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of suitesToRun) {
    const { passed, failed } = await executeSmokeSuite(suite, BASE_URL);
    totalPassed += passed;
    totalFailed += failed;
  }

  const totalDuration = ((Date.now() - globalStart) / 1000).toFixed(2);
  const totalChecks = totalPassed + totalFailed;

  console.log(`\n=======================================================`);
  console.log(`📊 FINAL SMOKE VERIFICATION SUMMARY`);
  console.log(`=======================================================`);
  console.log(`⏱️ Total Execution Time: ${totalDuration}s`);
  console.log(`✅ Passed: ${totalPassed}/${totalChecks}`);
  console.log(`❌ Failed: ${totalFailed}/${totalChecks}`);

  if (totalFailed > 0) {
    console.log(`\n🚨 DEPLOYMENT GATE: FAILED (${totalFailed} critical check(s) failed)`);
    process.exit(1);
  } else {
    console.log(`\n🎉 DEPLOYMENT GATE: PASSED (All ${totalChecks} critical paths verified!)`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Fatal Runner Error:', err);
  process.exit(1);
});
