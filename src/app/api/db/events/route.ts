import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

initDb();

export async function GET() {
  try {
    const db = getDb();
    const events = db.prepare('SELECT * FROM events ORDER BY `order` ASC').all();
    return NextResponse.json(events);
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
      INSERT INTO events (
        id, title, date, location, status, type, \`order\`, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, body.title, body.date, body.location, body.status, body.type,
      body.order || 0, now
    );

    const inserted = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
