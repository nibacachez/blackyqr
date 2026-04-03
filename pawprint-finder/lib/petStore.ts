import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  description: string;
  photoUrl: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
}

export interface MascotaRow {
  id: string;
  nombre: string;
  raza: string | null;
  caracteristicas: string | null;
  foto_url: string | null;
  qr_url: string;
  owner_id: string | null;
  owner_contact_encrypted: string;
  created_at: string;
  updated_at: string;
}

function rowToPet(row: MascotaRow): Pet {
  let ownerName = '';
  let ownerPhone = '';
  let species = 'Perro';
  let color = '';
  let description = '';
  let breed = row.raza || '';

  // Parse caracteristicas JSON if present
  if (row.caracteristicas) {
    try {
      const c = JSON.parse(row.caracteristicas);
      species = c.species || 'Perro';
      color = c.color || '';
      description = c.description || '';
    } catch {
      description = row.caracteristicas;
    }
  }

  // owner_contact_encrypted is only available when querying the base table as owner
  if (row.owner_contact_encrypted) {
    try {
      const contact = JSON.parse(row.owner_contact_encrypted);
      ownerName = contact.name || '';
      ownerPhone = contact.phone || '';
    } catch {
      ownerName = row.owner_contact_encrypted;
    }
  }

  return {
    id: row.id,
    name: row.nombre,
    species,
    breed,
    color,
    description,
    photoUrl: row.foto_url || '',
    ownerName,
    ownerPhone,
    createdAt: row.created_at,
  };
}

export async function getPets(ownerId?: string): Promise<Pet[]> {
  if (ownerId) {
    // Authenticated owner reads from base table (has full access via RLS)
    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(rowToPet);
  }

  // Public reads use the view that excludes owner PII
  const { data, error } = await supabase
    .from('mascotas_public' as any)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((row: any) => rowToPet(row));
}

export async function getPetById(id: string): Promise<Pet | null> {
  // Use the public view that excludes owner PII
  const { data, error } = await supabase
    .from('mascotas_public' as any)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPet(data as any) : null;
}

export async function savePet(
  pet: Omit<Pet, 'id' | 'createdAt'>,
  ownerId: string,
  photoFile?: File
): Promise<Pet> {
  let foto_url: string | null = null;

  if (photoFile) {
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_MIME_TYPES.includes(photoFile.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WebP, GIF).');
    }
    if (photoFile.size > MAX_FILE_SIZE) {
      throw new Error('La imagen es demasiado grande. El tamaño máximo es 5MB.');
    }

    // Use a safe extension derived from MIME type
    const MIME_TO_EXT: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const ext = MIME_TO_EXT[photoFile.type] || 'jpg';
    const path = `${ownerId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('mascotas')
      .upload(path, photoFile, { contentType: photoFile.type });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('mascotas').getPublicUrl(path);
    foto_url = urlData.publicUrl;
  }

  const ownerContact = JSON.stringify({ name: pet.ownerName, phone: pet.ownerPhone });
  const caracteristicas = JSON.stringify({
    species: pet.species,
    color: pet.color,
    description: pet.description,
  });

  const petId = crypto.randomUUID();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const qr_url = `${appUrl}/rescue/${petId}`;

  const { data, error } = await supabase
    .from('mascotas')
    .insert({
      id: petId,
      nombre: pet.name,
      raza: pet.breed || null,
      caracteristicas,
      foto_url,
      owner_contact_encrypted: ownerContact,
      owner_id: ownerId,
      qr_url,
    })
    .select()
    .single();

  if (error) throw error;
  return rowToPet(data as any);
}

export async function deletePet(id: string) {
  const { error } = await supabase.from('mascotas').delete().eq('id', id);
  if (error) throw error;
}

export async function getReportsCount(petId: string): Promise<number> {
  const { count, error } = await supabase
    .from('rescate_reports')
    .select('*', { count: 'exact', head: true })
    .eq('mascota_id', petId);

  if (error) throw error;
  return count || 0;
}

export async function saveReport(
  petId: string,
  lat: number,
  lon: number,
  message?: string
) {

  // Client-side validation
  if (lat < -90 || lat > 90) throw new Error('Latitud fuera de rango.');
  if (lon < -180 || lon > 180) throw new Error('Longitud fuera de rango.');
  const trimmedMessage = message?.slice(0, 500);

  const { error } = await supabase.from('rescate_reports').insert({
    mascota_id: petId,
    lat,
    lon,
    reporter_meta: trimmedMessage ? { message: trimmedMessage } : {},
  });

  if (error) throw error;
}

export async function getAllPetsForAdmin(): Promise<Pet[]> {
  try {
    const { data, error } = await supabase
      .from('mascotas')
      .select(
        'id, nombre, raza, caracteristicas, foto_url, qr_url, owner_id, owner_contact_encrypted, created_at, updated_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching all pets:', error);
      throw new Error(`Error fetching pets: ${error.message}`);
    }

    if (!data) {
      console.warn('No data returned from mascotas table');
      return [];
    }

    return (data as any[]).map(rowToPet);
  } catch (error) {
    console.error('Error in getAllPetsForAdmin:', error);
    throw error;
  }
}

export async function downloadQRCodeAsImage(petId: string, petName: string): Promise<void> {
  try {
    // Dynamic import of qrcode
    const QRCode = (await import('qrcode')).default;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const rescueUrl = `${appUrl}/rescue/${petId}`;

    // Generate QR code as canvas
    const canvas = await QRCode.toCanvas(rescueUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 512,
      margin: 2,
      color: {
        dark: '#000',
        light: '#fff',
      },
    });

    // Convert canvas to blob and trigger download
    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QR-${petName}-${petId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw new Error('Error descargando código QR');
  }
}
