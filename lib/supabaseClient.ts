import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function getKeyFromEnv() {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) throw new Error('ENCRYPTION_SECRET missing');
  const key = Buffer.from(secret, 'base64');
  if (key.length !== 32) throw new Error('ENCRYPTION_SECRET must decode to 32 bytes');
  return key;
}

// Example helper: obtener contacto encriptado por pet id
export async function getOwnerContactByPetId(petId: string) {
  const { data, error } = await supabaseAdmin
    .from('mascotas')
    .select('owner_contact_encrypted')
    .eq('id', petId)
    .single();
  if (error || !data) return null;
  return { contactEncrypted: data.owner_contact_encrypted };
}

// decrypt using ENCRYPTION_SECRET
export function decryptOwnerContact(encrypted: string) {
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

// encrypt helper (server-side) for storing owner contact
export function encryptOwnerContact(obj: any) {
  const key = getKeyFromEnv();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(obj)), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, ciphertext, tag]).toString('base64');
}
