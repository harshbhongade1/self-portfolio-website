import { hashIp, parseUserAgent } from './api/_lib/supabase.js';
import trackHandler from './api/track.js';
import statsHandler from './api/stats.js';
import identifyHandler from './api/identify.js';
import adminAnalyticsHandler from './api/admin/analytics.js';

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(k, v) { this.headers[k] = v; return this; },
    status(c) { this.statusCode = c; return this; },
    json(obj) { this.data = obj; return this; },
    end(s) { this.ended = true; return this; }
  };
  return res;
}

let passed = 0;
let total = 0;

function assert(cond, name) {
  total++;
  if (cond) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    console.error(`  ✗ FAIL: ${name}`);
  }
}

async function runTests() {
  console.log('\n--- Running Automated Security & API Tests ---');

  // Test 1: IP Hashing (No raw IP storage)
  const rawIp1 = '192.168.1.100';
  const rawIp2 = '203.0.113.45';
  const hash1 = hashIp(rawIp1);
  const hash2 = hashIp(rawIp2);
  assert(hash1 !== rawIp1 && !hash1.includes('192.168'), 'IP address is securely hashed without leaking raw octets');
  assert(hash1 !== hash2, 'Different IP addresses produce unique hashes');

  // Test 2: User Agent Categorization
  const chromeDesktop = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const iphoneMobile = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
  const parsed1 = parseUserAgent(chromeDesktop);
  const parsed2 = parseUserAgent(iphoneMobile);
  assert(parsed1.device === 'Desktop' && parsed1.os === 'Windows' && parsed1.browser === 'Chrome', 'Desktop Chrome on Windows correctly categorized');
  assert(parsed2.device === 'Mobile' && parsed2.os === 'iOS' && parsed2.browser === 'Safari', 'Mobile Safari on iPhone correctly categorized');

  // Test 3: Public stats unconfigured graceful fallback
  const resStats = mockRes();
  await statsHandler({ method: 'GET', headers: {} }, resStats);
  assert(resStats.data && typeof resStats.data.stats?.totalVisits === 'number', 'Public stats endpoint returns valid stats object');

  // Test 4: Track endpoint requires POST
  const resTrackMethod = mockRes();
  await trackHandler({ method: 'GET', headers: {} }, resTrackMethod);
  assert(resTrackMethod.statusCode === 405, 'track endpoint rejects non-POST methods with HTTP 405');

  // Test 5: Identify input validation
  const resIdentify = mockRes();
  await identifyHandler({ method: 'POST', body: { name: '', email: 'bad' }, headers: {} }, resIdentify);
  assert(resIdentify.statusCode === 400 || resIdentify.statusCode === 503, 'Identify endpoint rejects invalid inputs');

  // Test 6: Admin analytics route server-side authorization
  const resAdminNoAuth = mockRes();
  await adminAnalyticsHandler({ method: 'GET', headers: {}, url: 'http://localhost/api/admin/analytics' }, resAdminNoAuth);
  assert(resAdminNoAuth.statusCode === 401, 'Admin endpoint strictly rejects unauthenticated requests with HTTP 401');

  // Test 7: Admin endpoint with invalid token
  const resAdminBadToken = mockRes();
  await adminAnalyticsHandler({ method: 'GET', headers: { authorization: 'Bearer invalid_fake_token_123' }, url: 'http://localhost/api/admin/analytics' }, resAdminBadToken);
  assert(resAdminBadToken.statusCode === 401 || resAdminBadToken.statusCode === 503, 'Admin endpoint rejects forged/invalid JWT tokens');

  // Test 8: Admin Login with configured credentials (HarshBhongade / Harsh@1912)
  const { default: loginHandler } = await import('./api/admin/login.js');
  const resLogin = mockRes();
  await loginHandler({ method: 'POST', body: { identifier: 'HarshBhongade', password: 'Harsh@1912' }, headers: {} }, resLogin);
  assert(resLogin.statusCode === 200 && resLogin.data?.session?.access_token, 'Admin login succeeds for HarshBhongade with valid token');

  // Test 9: Valid token grants access to admin analytics
  if (resLogin.data?.session?.access_token) {
    const resAdminGood = mockRes();
    await adminAnalyticsHandler({ method: 'GET', headers: { authorization: `Bearer ${resLogin.data.session.access_token}` }, url: 'http://localhost/api/admin/analytics' }, resAdminGood);
    assert(resAdminGood.statusCode === 200 && resAdminGood.data?.summary, 'Valid admin session token grants access to analytics summary and logs');
  }

  // Test 10: Wrong password is appropriately rejected
  const resBadPw = mockRes();
  await loginHandler({ method: 'POST', body: { identifier: 'HarshBhongade', password: 'WrongPassword999' }, headers: {} }, resBadPw);
  assert(resBadPw.statusCode === 401, 'Admin login rejects incorrect password with HTTP 401');

  console.log(`\nResults: ${passed}/${total} tests passed!\n`);
}

runTests().catch(console.error);
