import { createClient_ServerAction } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient_ServerAction();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirigir al dashboard del usuario
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
