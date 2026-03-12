import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// Inicializar BD
initDb();

export async function GET() {
  try {
    const db = getDb();
    const competitors = db.prepare('SELECT * FROM competitors ORDER BY name ASC').all();
    return NextResponse.json(competitors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const id = randomUUID();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO competitors (
        id, name, country, wins, losses, bio, imageUrl, isActive, 
        instagram, twitter, youtube, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, body.name, body.country, body.wins || 0, body.losses || 0,
      body.bio, body.imageUrl || '', body.isActive ? 1 : 0,
      body.instagram || '', body.twitter || '', body.youtube || '',
      now, now
    );

    const inserted = db.prepare('SELECT * FROM competitors WHERE id = ?').get(id);
    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
