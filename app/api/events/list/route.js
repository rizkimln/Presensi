import { supabase } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data: events, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch events' }, { status: 500 });
  }
}
