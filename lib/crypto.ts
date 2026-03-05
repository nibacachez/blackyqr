import * as crypto from 'crypto';

function getKeyFromEnv() {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) throw new Error('ENCRYPTION_SECRET missing');
  const key = Buffer.from(secret, 'base64');
  if (key.length !== 32) throw new Error('ENCRYPTION_SECRET must decode to 32 bytes');
  return key;
}

export function encryptJSON(obj: any): string {
  const key = getKeyFromEnv();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(obj)), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, ciphertext, tag]).toString('base64');
}

export function decryptJSON(encrypted: string) {
  const key = getKeyFromEnv();
  const buf = Buffer.from(encrypted, 'base64');
  if (buf.length < 12 + 16) throw new Error('invalid encrypted payload');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(buf.length - 16);
  const ciphertext = buf.slice(12, buf.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  try {
    return JSON.parse(decrypted.toString());
  } catch (e) {
    throw new Error('decryption resulted in invalid JSON');
  }
}
