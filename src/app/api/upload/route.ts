import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Crear directorio si no existe
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Guardar archivo
    const bytes = await file.arrayBuffer();
    const filename = `${randomUUID()}_${file.name}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, Buffer.from(bytes));

    // Retornar URL pública
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
