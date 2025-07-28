import { supabase } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, description, date, start_time, end_time, location, form_fields, created_by } = await request.json();

    // Generate unique QR code string
    const qrCodeData = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
          qr_code: qrCodeData,
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
        qrCode: qrCodeData,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create event' }, { status: 500 });
  }
}
