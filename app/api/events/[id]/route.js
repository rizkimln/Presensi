import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET single event by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const { data: event, error } = await supabase
      .from('events')
      .select(
        `
        *,
        attendances (
          id,
          employee_name,
          employee_email,
          employee_phone,
          form_responses,
          scan_time
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch event' }, { status: 500 });
  }
}

// UPDATE event by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();

    const { data: event, error } = await supabase.from('events').update(updateData).eq('id', id).select().single();

    if (error) {
      return NextResponse.json({ message: 'Failed to update event' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE event by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ message: 'Failed to delete event' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete event' }, { status: 500 });
  }
}
