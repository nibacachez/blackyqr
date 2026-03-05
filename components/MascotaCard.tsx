import React from 'react';

export default function MascotaCard({ mascota }: { mascota: any }){
  return (
    <article className="border rounded p-3">
      <img src={mascota.fotoUrl} alt="foto" className="w-full h-48 object-cover rounded" />
      <h3 className="mt-2 font-semibold">{mascota.nombre}</h3>
      <p className="text-sm text-gray-600">{mascota.raza}</p>
    </article>
  )
}
