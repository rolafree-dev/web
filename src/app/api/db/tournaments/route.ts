import { NextResponse, NextRequest } from 'next/server';
import { getTournaments, addTournament } from '@/lib/supabase-helpers';

export async function GET() {
  try {
    const tournaments = await getTournaments();
    return NextResponse.json(tournaments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tournament = await addTournament(body);
    return NextResponse.json(tournament, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
