import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

initDb();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const rola = db.prepare('SELECT * FROM rolas WHERE id = ?').get(params.id);
    
    if (!rola) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(rola);
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

    const existing = db.prepare('SELECT * FROM rolas WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE rolas SET 
        title = ?, competitor1Id = ?, competitor2Id = ?, 
        competitor1Name = ?, competitor2Name = ?,
        date = ?, link = ?, points = ?, imageUrl = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      body.title, body.competitor1Id, body.competitor2Id,
      body.competitor1Name || '', body.competitor2Name || '',
      body.date, body.link, body.points || 0, body.imageUrl || '',
      now, params.id
    );

    const updated = db.prepare('SELECT * FROM rolas WHERE id = ?').get(params.id);
    return NextResponse.json(updated);
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
    
    const existing = db.prepare('SELECT * FROM rolas WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM rolas WHERE id = ?').run(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
