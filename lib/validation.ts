import { z } from 'zod';

export const RegisterSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const MascotaSchema = z.object({
  nombre: z.string().min(1).max(100),
  raza: z.string().max(100).optional(),
  caracteristicas: z.string().max(500).optional()
});

export const LocationSchema = z.object({ id: z.string().min(1), lat: z.number(), lon: z.number() });
