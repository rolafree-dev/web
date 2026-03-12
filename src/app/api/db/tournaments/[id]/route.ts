import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

initDb();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(params.id) as any;
    
    if (!tournament) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...tournament,
      bracket: tournament.bracket ? JSON.parse(tournament.bracket) : null
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = getDb();
    const now = new Date().toISOString();

    const existing = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE tournaments SET 
        name = ?, date = ?, status = ?, bracket = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      body.name, body.date, body.status,
      JSON.stringify(body.bracket),
      now, params.id
    );

    const updated = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(params.id) as any;
    return NextResponse.json({
      ...updated,
      bracket: updated.bracket ? JSON.parse(updated.bracket) : null
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    
    const existing = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM tournaments WHERE id = ?').run(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
