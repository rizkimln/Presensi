import { supabase } from '../../../../lib/supabase';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const { data: admin, error } = await supabase.from('admins').select('*').eq('username', username).single();

    if (error || !admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      adminId: admin.id,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
