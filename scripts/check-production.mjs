import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'http://localhost:3000');
const browserHeaders = { 'user-agent': 'Mozilla/5.0 (ProductionSmokeCheck)' };

async function get(path, headers = browserHeaders) {
  const response = await fetch(new URL(path, base), { headers });
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  return response;
}

const response = await get('/');
assert.match(response.headers.get('content-type') || '', /text\/html/);
assert.ok(response.headers.get('content-security-policy'), 'Security headers missing');
const html = await response.text();
assert.match(html, /<main\b/, 'Homepage content missing from server HTML');
assert.match(html, /<h1\b/, 'Homepage heading missing from server HTML');
assert.match(html, /SAP-C02/, 'Professional certification missing from server HTML');
assert.ok(!html.includes('font-awesome/'), 'Skills icon stylesheet blocks the homepage');
console.log('PASS: server-rendered homepage and security headers');

const resume = await get('/', { 'user-agent': 'curl/8.0' });
assert.match(resume.headers.get('content-type') || '', /application\/json/);
assert.match(resume.headers.get('cache-control') || '', /no-store/);
assert.ok((await resume.json()).certifications.some(cert => cert.includes('SAP-C02')));
console.log('PASS: CLI resume and cache isolation');

for (const [path, ttl] of [['/api/status', 60], ['/api/deployment-info', 300]]) {
  const api = await get(path);
  assert.match(api.headers.get('cache-control') || '', new RegExp(`s-maxage=${ttl}(?:,|$)`));
  assert.match(api.headers.get('content-type') || '', /application\/json/);
  assert.ok((await api.json()).timestamp, `${path} is not valid metadata`);
}
await get('/certs/AWSSAA.png');
console.log('PASS: public metadata APIs, cache policy, and static image');

const scriptPaths = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)]
  .map(match => match[1]).filter(path => path.startsWith('/_next/'));
const scripts = await Promise.all(scriptPaths.map(async path => (await get(path)).text()));
assert.ok(!scripts.some(source => source.includes('WebGLRenderer')), 'Three.js is in the initial homepage scripts');
console.log('PASS: 3D renderer excluded from initial homepage scripts');
