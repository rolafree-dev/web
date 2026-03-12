import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

initDb();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(params.id);
    
    if (!event) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(event);
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

    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE events SET 
        title = ?, date = ?, location = ?, status = ?, type = ?, \`order\` = ?
      WHERE id = ?
    `).run(
      body.title, body.date, body.location, body.status, body.type, body.order || 0,
      params.id
    );

    const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(params.id);
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
    
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM events WHERE id = ?').run(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
