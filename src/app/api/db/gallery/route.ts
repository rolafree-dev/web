import { getDb, initDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

initDb();

export async function GET() {
  try {
    const db = getDb();
    const gallery = db.prepare('SELECT * FROM gallery ORDER BY createdAt DESC').all();
    return NextResponse.json(gallery);
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
      INSERT INTO gallery (id, name, url, createdAt)
      VALUES (?, ?, ?, ?)
    `).run(id, body.name, body.url, now);

    const inserted = db.prepare('SELECT * FROM gallery WHERE id = ?').get(id);
    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
