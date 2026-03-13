import { NextResponse, NextRequest } from 'next/server';
import { getCompetitors, addCompetitor } from '@/lib/supabase-helpers';

// GET all competitors
export async function GET() {
  try {
    const competitors = await getCompetitors();
    return NextResponse.json(competitors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new competitor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const competitor = await addCompetitor(body);
    return NextResponse.json(competitor, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
