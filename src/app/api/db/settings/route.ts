import { NextRequest, NextResponse } from 'next/server';
import { getSetting, updateSetting } from '@/lib/supabase-helpers';

export async function GET() {
  try {
    const settings = await getSetting('global_stats');
    return NextResponse.json(settings || { id: 'global_stats', battles: 0, tournaments: 0, champions: 0, competitors: 0 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await updateSetting('global_stats', body);
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
