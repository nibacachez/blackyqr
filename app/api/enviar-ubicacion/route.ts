// filepath: app/api/enviar-ubicacion/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendLocationReport, handleApiError } from '../../../lib/api-helpers';

const BodySchema = z.object({ id: z.string().min(1), lat: z.number(), lon: z.number() });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.issues }, { status: 400 });
    }

    const { id, lat, lon } = parsed.data;
    const userAgent = request.headers.get('user-agent') || undefined;
    await sendLocationReport(id, lat, lon, userAgent);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const { error, status } = handleApiError(err, 'POST /api/enviar-ubicacion');
    return NextResponse.json({ error }, { status });
  }
}
