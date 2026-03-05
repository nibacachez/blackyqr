import { supabaseAdmin } from './supabaseClient';

export async function uploadQR(buffer: Buffer, path: string, mime = 'image/png') {
  if (!process.env.SUPABASE_URL) throw new Error('SUPABASE_URL missing');
  const bucket = process.env.SUPABASE_QR_BUCKET || 'qrcodes';
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, buffer, {
    contentType: mime,
    upsert: true
  });
  if (error) throw error;
  const publicUrl = `${process.env.SUPABASE_URL.replace('/rest/v1', '')}/storage/v1/object/public/${bucket}/${encodeURIComponent(path)}`;
  return publicUrl;
}
