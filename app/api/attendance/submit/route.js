import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { event_id, employee_name, employee_email, employee_phone, form_responses } = await request.json();

    const { data: attendance, error } = await supabase
      .from('attendances')
      .insert([
        {
          event_id,
          employee_name,
          employee_email,
          employee_phone,
          form_responses,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: 'Attendance recorded successfully',
        attendance,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: 'Failed to record attendance' }, { status: 500 });
  }
}
