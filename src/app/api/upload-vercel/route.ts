import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import { getDb, initDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// Allowed file types (MIME types)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * POST /api/upload-vercel
 * 
 * Uploads an image to Vercel Blob Storage and stores metadata in SQLite
 * 
 * Request body: FormData with 'file' field
 * Response: { url, id, fileName, uploadDate }
 */
export async function POST(request: NextRequest) {
  try {
    initDb();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for Vercel Blob
    const buffer = await file.arrayBuffer();
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}-${file.name}`;

    // Upload to Vercel Blob
    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: file.type,
    });

    // Store metadata in SQLite
    const db = getDb();
    const imageId = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO gallery (id, name, url, fileSize, contentType, uploadedBy, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      imageId,
      file.name,
      blob.url,
      file.size,
      file.type,
      'admin',
      now
    );

    // Return the image URL and metadata
    return NextResponse.json({
      url: blob.url,
      id: imageId,
      fileName: file.name,
      uploadDate: now,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload-vercel
 * 
 * Retrieves all uploaded images from SQLite with their Vercel Blob URLs
 */
export async function GET() {
  try {
    initDb();
    const db = getDb();
    
    const images = db.prepare(`
      SELECT id, name, url, fileSize, contentType, uploadedBy, createdAt
      FROM gallery
      ORDER BY createdAt DESC
    `).all() as any[];

    return NextResponse.json(images);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
