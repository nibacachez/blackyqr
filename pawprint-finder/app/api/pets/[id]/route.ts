import { NextRequest, NextResponse } from 'next/server';
import { createClient_ServerAction } from '@/lib/supabase/server';

// GET /api/pets/[id] - Get public pet info
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient_ServerAction();

    const { data: pet, error } = await supabase
      .from('mascotas_public')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ pet });
  } catch (error) {
    console.error('Error fetching pet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pet' },
      { status: 500 }
    );
  }
}

// DELETE /api/pets/[id] - Delete pet (owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient_ServerAction();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const { data: pet, error: fetchError } = await supabase
      .from('mascotas')
      .select('owner_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !pet || pet.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Not found or unauthorized' },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('mascotas')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return NextResponse.json(
      { error: 'Failed to delete pet' },
      { status: 500 }
    );
  }
}
