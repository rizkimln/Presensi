import { supabase } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { eventId } = params;

    const { data: attendances, error } = await supabase.from('attendances').select('*').eq('event_id', eventId).order('scan_time', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ attendances });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch attendances' }, { status: 500 });
  }
}
