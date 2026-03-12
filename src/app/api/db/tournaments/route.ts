import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

initDb();

export async function GET() {
  try {
    const db = getDb();
    const tournaments = db.prepare('SELECT * FROM tournaments ORDER BY createdAt DESC').all();
    const result = tournaments.map((t: any) => ({
      ...t,
      bracket: JSON.parse(t.bracket)
    }));
    return NextResponse.json(result);
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
      INSERT INTO tournaments (
        id, name, date, status, bracket, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, body.name, body.date, body.status,
      JSON.stringify(body.bracket),
      now, now
    );

    const inserted = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id) as any;
    return NextResponse.json({
      ...inserted,
      bracket: inserted.bracket ? JSON.parse(inserted.bracket) : null
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
