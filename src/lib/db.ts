import BetterSqlite3 from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.db');

let db: BetterSqlite3.Database | null = null;

export function getDb(): BetterSqlite3.Database {
  if (!db) {
    // Skip database initialization during build
    if (process.env.NODE_ENV === 'production' && process.argv.includes('build')) {
      throw new Error('Database not available during build');
    }
    db = new BetterSqlite3(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initDb() {
  // Skip initialization during build
  if (process.env.NODE_ENV === 'production' && process.argv.includes('build')) {
    return;
  }
  
  const database = getDb();
  
  // Competitors
  database.exec(`
    CREATE TABLE IF NOT EXISTS competitors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      bio TEXT NOT NULL,
      imageUrl TEXT,
      isActive INTEGER DEFAULT 1,
      instagram TEXT,
      twitter TEXT,
      youtube TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Rolas
  database.exec(`
    CREATE TABLE IF NOT EXISTS rolas (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      competitor1Id TEXT NOT NULL,
      competitor2Id TEXT NOT NULL,
      competitor1Name TEXT,
      competitor2Name TEXT,
      date TEXT NOT NULL,
      link TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      imageUrl TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (competitor1Id) REFERENCES competitors(id),
      FOREIGN KEY (competitor2Id) REFERENCES competitors(id)
    )
  `);

  // Tournaments
  database.exec(`
    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      bracket TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  // Events
  database.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT NOT NULL,
      type TEXT NOT NULL,
      \`order\` INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `);

  // Settings
  database.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      battles INTEGER DEFAULT 0,
      tournaments INTEGER DEFAULT 0,
      champions INTEGER DEFAULT 0,
      competitors INTEGER DEFAULT 0
    )
  `);

  // Gallery
  database.exec(`
    CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Crear registro de settings por defecto si no existe
  const existing = database.prepare('SELECT * FROM settings WHERE id = ?').get('global_stats');
  if (!existing) {
    database.prepare(`
      INSERT INTO settings (id, battles, tournaments, champions, competitors)
      VALUES (?, ?, ?, ?, ?)
    `).run('global_stats', 0, 0, 0, 0);
  }
}
