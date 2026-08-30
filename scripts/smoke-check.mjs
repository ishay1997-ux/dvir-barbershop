/**
 * CutWeb Production & Staging Smoke Check Script
 * Pragmatic Post-Deployment / Local Verification Runner
 */

const BASE_URL = process.env.BASE_URL || 'https://thecut-reg-in.vercel.app';

const CRITICAL_ROUTES = [
  { path: '/', expectedStatus: 200, name: 'Marketing & Hub Landing Page' },
  { path: '/dvir', expectedStatus: 200, name: 'Barber Flagship Demo' },
  { path: '/beauty', expectedStatus: 200, name: 'Beauty Niche Demo' },
  { path: '/accessibility', expectedStatus: 200, name: 'Accessibility Page (IS 5568 / WCAG 2.1 AA)' },
  { path: '/manifest.webmanifest', expectedStatus: 200, name: 'PWA Web Manifest' },
  { path: '/admin/login', expectedStatus: 200, name: 'Admin Authentication Route' },
];

async function runSmokeCheck() {
  console.log(`\n🔍 Starting CutWeb Smoke Verification on: ${BASE_URL}`);
  console.log(`=======================================================`);

  let failures = 0;
  const startTime = Date.now();

  for (const route of CRITICAL_ROUTES) {
    const targetUrl = `${BASE_URL}${route.path}`;
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'CutWeb-SmokeRunner/1.0',
        },
      });

      const isStatusOk = response.status === route.expectedStatus;
      const statusIcon = isStatusOk ? '✅' : '❌';

      console.log(
        `${statusIcon} [${response.status}] ${route.name.padEnd(35)} -> ${route.path}`
      );

      if (!isStatusOk) {
        failures++;
        console.error(`   ⚠️ Expected status ${route.expectedStatus}, received ${response.status}`);
      }
    } catch (error) {
      failures++;
      console.error(`❌ [CONN_ERROR] ${route.name} -> ${route.path} (${error.message})`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`=======================================================`);
  console.log(`⏱️ Completed in ${duration}s | Failures: ${failures}/${CRITICAL_ROUTES.length}\n`);

  if (failures > 0) {
    console.error(`🚨 Smoke check failed with ${failures} error(s).`);
    process.exit(1);
  } else {
    console.log(`🎉 All critical production routes are healthy and returning 200 OK!`);
  }
}

runSmokeCheck();
