import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

initDb();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const competitor = db.prepare('SELECT * FROM competitors WHERE id = ?').get(params.id);
    
    if (!competitor) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    return NextResponse.json(competitor);
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

    const existing = db.prepare('SELECT * FROM competitors WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE competitors SET 
        name = ?, country = ?, wins = ?, losses = ?, bio = ?, imageUrl = ?,
        isActive = ?, instagram = ?, twitter = ?, youtube = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      body.name, body.country, body.wins || 0, body.losses || 0,
      body.bio, body.imageUrl || '', body.isActive ? 1 : 0,
      body.instagram || '', body.twitter || '', body.youtube || '',
      now, params.id
    );

    const updated = db.prepare('SELECT * FROM competitors WHERE id = ?').get(params.id);
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
    
    const existing = db.prepare('SELECT * FROM competitors WHERE id = ?').get(params.id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Eliminar rolas asociadas primero
    db.prepare('DELETE FROM rolas WHERE competitor1Id = ? OR competitor2Id = ?').run(params.id, params.id);
    
    // Luego eliminar el competidor
    db.prepare('DELETE FROM competitors WHERE id = ?').run(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
