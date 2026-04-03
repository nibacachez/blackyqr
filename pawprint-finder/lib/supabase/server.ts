import { cookies } from 'next/headers';
import { supabase } from './client';

export async function createClient_ServerAction() {
  return supabase;
}

export async function updateSession(request: any) {
  // Refresh session if expired
  await supabase.auth.getUser();

  return new Response();
}
