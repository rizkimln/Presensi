import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { qrCode } = params;

    const { data: event, error } = await supabase.from('events').select('*').eq('qr_code', qrCode).eq('is_active', true).single();

    if (error || !event) {
      return NextResponse.json({ message: 'Invalid or expired QR code' }, { status: 404 });
    }

    // Cek apakah event masih berlangsung
    const now = new Date();
    const eventDate = new Date(event.date);
    const eventStartTime = new Date(`${event.date} ${event.start_time}`);
    const eventEndTime = new Date(`${event.date} ${event.end_time}`);

    if (now < eventStartTime || now > eventEndTime) {
      return NextResponse.json({ message: 'Event is not currently active' }, { status: 400 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch event' }, { status: 500 });
  }
}
