import { NextRequest, NextResponse } from 'next/server';
import { createClient_ServerAction } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petId, lat, lon, message } = body;

    // Validation
    if (!petId || typeof lat !== 'number' || typeof lon !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    const supabase = await createClient_ServerAction();

    const { error } = await supabase.from('rescate_reports').insert({
      mascota_id: petId,
      lat,
      lon,
      reporter_meta: message ? { message: message.slice(0, 500) } : {},
    });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { petId: string } }
) {
  try {
    const supabase = await createClient_ServerAction();

    const { count, error } = await supabase
      .from('rescate_reports')
      .select('*', { count: 'exact', head: true })
      .eq('mascota_id', params.petId);

    if (error) throw error;

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error fetching reports count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
