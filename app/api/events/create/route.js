import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, description, date, start_time, end_time, location, form_fields, created_by } = await request.json();

    // Buat slug unik untuk event
    const slug = `event-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Buat URL untuk QR code berdasarkan base URL dan slug
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/presensi/${slug}`;

    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          name,
          description,
          date,
          start_time,
          end_time,
          location,
          qr_code: qrCodeUrl, // URL yang nanti ditampilkan dalam QR
          form_fields,
          created_by,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        event,
        qrCode: qrCodeUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}
