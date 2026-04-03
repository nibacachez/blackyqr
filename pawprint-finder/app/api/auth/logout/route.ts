import { NextRequest, NextResponse } from 'next/server';
import { createClient_ServerAction } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient_ServerAction();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
