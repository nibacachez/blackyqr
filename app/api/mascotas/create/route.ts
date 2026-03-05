// filepath: app/api/mascotas/create/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createMascota, handleApiError } from '../../../lib/api-helpers';
import { MascotaSchema } from '../../../lib/validation';

const BodySchema = z.object({
  mascota: MascotaSchema,
  owner: z.object({ email: z.string().email(), phone: z.string().optional() })
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.issues }, { status: 400 });
    }

    const { mascota, owner } = parsed.data;
    const result = await createMascota(mascota, owner);
    if (!result) {
      return NextResponse.json({ error: 'Error al crear mascota' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: result.id, qr: result.qrUrl });
  } catch (err) {
    const { error, status } = handleApiError(err, 'POST /api/mascotas/create');
    return NextResponse.json({ error }, { status });
  }
}
