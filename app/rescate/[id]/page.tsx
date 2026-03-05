import React from 'react';
import { notFound } from 'next/navigation';
import ShareLocationButton from '../../../components/ShareLocationButton';
import { supabase } from '../../../lib/supabase';

type Props = { params: { id: string } };

export default async function RescatePage({ params }: Props) {
  const { id } = params;
  if (!id) notFound();

  // Obtener datos públicos de la mascota
  const { data: mascota, error } = await supabase
    .from('mascotas')
    .select('id, nombre, raza, caracteristicas, qr_url')
    .eq('id', id)
    .single();

  if (error || !mascota) notFound();

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold">{mascota.nombre}</h1>
      <img src={mascota.qr_url || '/placeholder-pet.png'} alt="QR mascota" className="w-48 h-48 object-cover rounded mt-4" />
      <p className="mt-2">Raza: {mascota.raza || 'Desconocida'}</p>
      <p className="mt-2">Características: {mascota.caracteristicas || 'Ninguna'}</p>

      <div className="mt-6">
        <p className="font-semibold">Compartir ubicación con el dueño</p>
        <p className="text-sm text-gray-600 mt-1">Antes de solicitar ubicación se pedirá tu consentimiento explícito; no se mostrarán datos personales del dueño.</p>
        <ShareLocationButton petId={id} />
      </div>
    </section>
  );
}
