export interface Mascota {
  id: string;
  nombre: string;
  raza?: string;
  caracteristicas?: string;
  foto_url?: string;
}

export interface OwnerContact {
  email: string;
  phone?: string; // we store but encrypt
}
