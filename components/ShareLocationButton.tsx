"use client";
import React, { useState } from 'react';

export default function ShareLocationButton({ petId }: { petId: string }){
  const [loading, setLoading] = useState(false);

  async function handleShare(){
    const consent = window.confirm('¿Deseas compartir tu ubicación con el dueño de la mascota? Se compartirá solo la ubicación y no recibirás datos personales del dueño.');
    if (!consent) return;
    if (!navigator.geolocation) return alert('Geolocalización no disponible en este dispositivo.');
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await fetch('/api/enviar-ubicacion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: petId, lat: pos.coords.latitude, lon: pos.coords.longitude }) });
        const json = await res.json();
        if (res.ok) {
          alert('Ubicación enviada al dueño. Gracias por ayudar.');
        } else {
          alert('Error al enviar ubicación: ' + (json.error || 'desconocido'));
        }
      } catch (e) {
        alert('Error de red al enviar ubicación.');
      } finally {
        setLoading(false);
      }
    }, (err) => { setLoading(false); alert('No se obtuvo ubicación: ' + err.message); }, { enableHighAccuracy: true, timeout: 15000 });
  }

  return (
    <button onClick={handleShare} disabled={loading} className="mt-3 bg-primary text-white py-2 px-4 rounded">
      {loading ? 'Enviando...' : 'Compartir ubicación (consentimiento)'}
    </button>
  );
}
