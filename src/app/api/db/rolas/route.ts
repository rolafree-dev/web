import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

initDb();

export async function GET() {
  try {
    const db = getDb();
    const rolas = db.prepare('SELECT * FROM rolas ORDER BY createdAt DESC').all();
    return NextResponse.json(rolas);
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
      INSERT INTO rolas (
        id, title, competitor1Id, competitor2Id, competitor1Name, competitor2Name,
        date, link, points, imageUrl, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, body.title, body.competitor1Id, body.competitor2Id,
      body.competitor1Name || '', body.competitor2Name || '',
      body.date, body.link, body.points || 0, body.imageUrl || '',
      now, now
    );

    const inserted = db.prepare('SELECT * FROM rolas WHERE id = ?').get(id);
    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
