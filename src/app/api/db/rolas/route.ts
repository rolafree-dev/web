import { NextResponse, NextRequest } from 'next/server';
import { getRolas, addRola } from '@/lib/supabase-helpers';

export async function GET() {
  try {
    const rolas = await getRolas();
    return NextResponse.json(rolas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rola = await addRola(body);
    return NextResponse.json(rola, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
