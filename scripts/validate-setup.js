const crypto = require('crypto');

function exitErr(msg) {
  console.error(msg);
  process.exit(2);
}

function getKeyFromEnv() {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) exitErr('ENCRYPTION_SECRET missing');
  let key;
  try {
    key = Buffer.from(secret, 'base64');
  } catch (e) {
    exitErr('ENCRYPTION_SECRET is not valid base64');
  }
  if (key.length !== 32) exitErr(`ENCRYPTION_SECRET must decode to 32 bytes, got ${key.length}`);
  return key;
}

function encrypt(obj) {
  const key = getKeyFromEnv();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(obj)), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, ciphertext, tag]).toString('base64');
}

function decrypt(str) {
  const key = getKeyFromEnv();
  const buf = Buffer.from(str, 'base64');
  if (buf.length < 12 + 16) exitErr('invalid encrypted payload');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(buf.length - 16);
  const ciphertext = buf.slice(12, buf.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  try {
    return JSON.parse(decrypted.toString());
  } catch (e) {
    exitErr('decryption resulted in invalid JSON');
  }
}

function checkEnvVars() {
  const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'ENCRYPTION_SECRET', 'NEXT_PUBLIC_SITE_URL', 'EMAIL_SERVER', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL', 'CLEANUP_SECRET'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    console.warn('Warning: missing some env vars (ok for local dev if you don't use those features):', missing.join(', '));
  } else {
    console.log('All required env vars present.');
  }
}

function run() {
  console.log('Validating environment and crypto...');
  checkEnvVars();
  const payload = { test: 'roundtrip', ts: Date.now() };
  const enc = encrypt(payload);
  const dec = decrypt(enc);
  if (JSON.stringify(dec) !== JSON.stringify(payload)) exitErr('roundtrip failed');
  console.log('Encryption roundtrip OK');
}

run();
