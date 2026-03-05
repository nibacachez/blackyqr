const fetch = require('node-fetch');

async function run() {
  const url = process.env.CLEANUP_URL || 'http://localhost:3000/api/cleanup-reports';
  const secret = process.env.CLEANUP_SECRET || '';
  if (!secret) return console.error('Set CLEANUP_SECRET in env to run test');
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'x-admin-secret': secret } });
    const json = await res.json();
    console.log('response', res.status, json);
  } catch (e) {
    console.error('error', e);
  }
}

run();
