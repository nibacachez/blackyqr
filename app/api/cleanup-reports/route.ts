// filepath: app/api/cleanup-reports/route.ts
import { NextResponse } from 'next/server';
import { cleanupExpiredReports, handleApiError } from '../../../lib/api-helpers';

export async function POST(request: Request) {
  try {
    const adminSecret = process.env.CLEANUP_SECRET;
    const secretHeader = request.headers.get('x-admin-secret');
    const authHeader = request.headers.get('authorization');
    
    const isValidSecret = secretHeader && adminSecret && secretHeader === adminSecret;
    const bearer = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const isValidBearer = bearer && process.env.SUPABASE_SERVICE_ROLE_KEY && bearer === process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!isValidSecret && !isValidBearer) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await cleanupExpiredReports();
    return NextResponse.json({ ok: true });
  } catch (err) {
    const { error, status } = handleApiError(err, 'POST /api/cleanup-reports');
    return NextResponse.json({ error }, { status });
  }
}
