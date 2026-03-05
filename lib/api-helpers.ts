// filepath: lib/api-helpers.ts
import { supabaseAdmin, decryptOwnerContact, getOwnerContactByPetId } from './supabaseClient';
import { encryptOwnerContact } from './crypto';
import { createTransport } from 'nodemailer';
import QRCode from 'qrcode';
import { uploadQR } from './storage';

// Helper para manejar errores de forma consistente (logging y respuesta JSON)
export function handleApiError(error: any, context: string): { error: string; status: number } {
  console.error(`${context} error:`, error);
  // No exponer detalles sensibles al cliente
  return { error: 'server_error', status: 500 };
}

// CRUD: Crear mascota con QR y notificación
export async function createMascota(mascota: any, owner: any): Promise<{ id: string; qrUrl: string } | null> {
  try {
    const encrypted = encryptOwnerContact(owner);
    const { data, error } = await supabaseAdmin
      .from('mascotas')
      .insert([{ nombre: mascota.nombre, raza: mascota.raza || null, caracteristicas: mascota.caracteristicas || null, owner_contact_encrypted: encrypted }])
      .select('id')
      .single();
    if (error) throw error;

    const id = data.id;
    const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
    const url = `${siteBase}/rescate/${id}`;
    const qrBuffer = await QRCode.toBuffer(url, { type: 'png', margin: 1, width: 300 });
    const filename = `pet-${id}.png`;
    const qrUrl = await uploadQR(qrBuffer, filename, 'image/png');

    await supabaseAdmin.from('mascotas').update({ qr_url: qrUrl }).eq('id', id);

    // Notificar admin (opcional, sin datos sensibles)
    await sendAdminNotification(id, mascota, qrUrl);

    return { id, qrUrl };
  } catch (error) {
    throw handleApiError(error, 'createMascota');
  }
}

// CRUD: Enviar ubicación y notificar dueño
export async function sendLocationReport(id: string, lat: number, lon: number, userAgent?: string): Promise<void> {
  try {
    const owner = await getOwnerContactByPetId(id);
    if (!owner?.contactEncrypted) throw new Error('Owner not found');

    const contact = decryptOwnerContact(owner.contactEncrypted);

    // Insertar reporte con TTL
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await supabaseAdmin.from('rescate_reports').insert([{ mascota_id: id, lat, lon, reporter_meta: { userAgent }, expires_at: expiresAt }]);

    // Enviar email al dueño
    await sendOwnerNotification(contact.email, id, lat, lon);
  } catch (error) {
    throw handleApiError(error, 'sendLocationReport');
  }
}

// CRUD: Limpiar reportes expirados
export async function cleanupExpiredReports(): Promise<void> {
  try {
    const now = new Date().toISOString();
    const { error } = await supabaseAdmin.from('rescate_reports').delete().lt('expires_at', now);
    if (error) throw error;
  } catch (error) {
    throw handleApiError(error, 'cleanupExpiredReports');
  }
}

// Helpers internos para emails
async function sendAdminNotification(id: string, mascota: any, qrUrl: string): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    const transporter = createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const subject = `Nueva mascota registrada (BlackyQR)`;
    const text = `ID: ${id}\nNombre: ${mascota.nombre}\nRaza: ${mascota.raza || ''}\nCaracterísticas: ${mascota.caracteristicas || ''}\nQR: ${qrUrl}`;
    await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to: adminEmail, subject, text });
  } catch (e) {
    console.error('Admin email error:', e); // No bloquear la creación
  }
}

async function sendOwnerNotification(email: string, id: string, lat: number, lon: number): Promise<void> {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_SERVER,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const subject = `Reporte de ubicación para tu mascota`;
    const text = `ID: ${id}\nLat: ${lat}, Lon: ${lon}`;
    await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to: email, subject, text });
  } catch (e) {
    console.error('Owner email error:', e); // No bloquear el reporte
  }
}