import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

initDb();

export async function GET() {
  try {
    const db = getDb();
    const settings = db.prepare('SELECT * FROM settings WHERE id = ?').get('global_stats');
    return NextResponse.json(settings || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();

    db.prepare(`
      UPDATE settings SET 
        battles = ?, tournaments = ?, champions = ?, competitors = ?
      WHERE id = ?
    `).run(
      body.battles || 0, body.tournaments || 0, body.champions || 0, body.competitors || 0,
      'global_stats'
    );

    const updated = db.prepare('SELECT * FROM settings WHERE id = ?').get('global_stats');
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
