# Supabase Setup Guía Completa

## Paso 1: Crear tu proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta (o inicia sesión)
3. Haz clic en **"New Project"**
4. Ingresa:
   - **Name**: "rola-free" (o el nombre que prefieras)
   - **Password**: Genera una contraseña fuerte para la BD
   - **Region**: Elige la más cercana (ej. "South America (São Paulo)" si estás en LATAM)
5. Espera 1-2 minutos mientras Supabase crea la BD

## Paso 2: Obtener las credenciales

Una vez creado el proyecto:

1. Ve a **Settings → API**
2. Copia dos valores:
   - **Project URL** → Esta es tu `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Esta es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Agrega estas variables a tu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Paso 3: Crear las tablas en Supabase

Ve a **SQL Editor** en el dashboard de Supabase y copia-pega TODOS estos comandos SQL:

### Crear tabla COMPETITORS

```sql
CREATE TABLE IF NOT EXISTS competitors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  bio TEXT NOT NULL,
  imageUrl TEXT,
  isActive BOOLEAN DEFAULT true,
  instagram TEXT,
  twitter TEXT,
  youtube TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX competitors_name_idx ON competitors(name);
CREATE INDEX competitors_createdAt_idx ON competitors(createdAt DESC);
```

### Crear tabla ROLAS

```sql
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
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (competitor1Id) REFERENCES competitors(id),
  FOREIGN KEY (competitor2Id) REFERENCES competitors(id)
);

CREATE INDEX rolas_createdAt_idx ON rolas(createdAt DESC);
```

### Crear tabla TOURNAMENTS

```sql
CREATE TABLE IF NOT EXISTS tournaments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,
  bracket JSONB,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX tournaments_createdAt_idx ON tournaments(createdAt DESC);
```

### Crear tabla EVENTS

```sql
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX events_order_idx ON events("order" ASC);
```

### Crear tabla SETTINGS

```sql
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  battles INTEGER DEFAULT 0,
  tournaments INTEGER DEFAULT 0,
  champions INTEGER DEFAULT 0,
  competitors INTEGER DEFAULT 0
);
```

### Crear tabla GALLERY

```sql
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  fileSize INTEGER,
  contentType TEXT,
  uploadedBy TEXT DEFAULT 'admin',
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX gallery_createdAt_idx ON gallery(createdAt DESC);
```

## Paso 4: Configurar permisos (Row Level Security)

Por ahora, desactiva RLS para desarrollo (hazlo después más seguro):

1. Ve a **Authentication → Policies**
2. Para cada tabla:
   - Abre la tabla
   - Haz clic en **"Disable RLS"** (o deja sin políticas por ahora)

## Paso 5: Verifica la conexión en tu app

Después de hacer `git commit` y push, Vercel detectará las variables y todo debería funcionar.

Para probar localmente:

```bash
npm run dev
```

Intenta agregar un compet idor desde `/admin/login` y verifica que aparezca en la tabla `competitors` de Supabase dashboard.

## Estructura del Proyecto

```
├── src/
│   ├── lib/
│   │   ├── supabase.ts         ← Configuración de Supabase
│   │   ├── supabase-helpers.ts ← Funciones CRUD
│   │   └── db.ts               ← (Sigue para referencia, no se usa)
│   └── app/api/db/
│       ├── competitors/
│       ├── rolas/
│       ├── tournaments/
│       ├── events/
│       ├── gallery/
│       └── upload-vercel/      ← Imágenes a Vercel Blob
├── .env.local                  ← Variables Supabase (NO subir a GitHub)
└── .env.example                ← Template
```

## Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is not set"

**Solución:** 
- Verifica que `.env.local` tiene las dos variables
- Si estás en Vercel, agregalas en **Settings → Environment Variables**
- Redeploy el proyecto

### Las imágenes suben pero los datos no se guardan

**Causa:** Las tablas no existen en Supabase  
**Solución:** Vuelve al Paso 3 y crea todas las tablas y luego reinicia el servidor

### Los datos aparecen en Supabase pero no en la app

**Causa:** Posiblemente un error en las componentes  
**Solución:** Verifica la consola del navegador y Vercel logs para errores

### ¿Cómo migro datos de SQLite a Supabase?

Si tienes datos en la BD local que quieres preservar:

1. Exporta de SQLite como JSON
2. Inserta manualmente en Supabase via dashboard o API

Para nuevos proyectos, empieza vacío en Supabase.

## Quotas Supabase (Gratis)

- Base de datos PostgreSQL: 500 MB
- Bandwidth: 2 GB/mes
- Conexiones simultáneas: 10
- Más que suficiente para tu proyecto (20-30 competidores)

---

## Próximos pasos

1. ✅ Crear proyecto en Supabase
2. ✅ Copiar credenciales a `.env.local`
3. ✅ Crear tablas (copiar SQL arriba)
4. ✅ Push a GitHub
5. ✅ Vercel auto-detecta variables
6. ✅ Las imágenes van a Blob, datos a Supabase

¡Listo! Tu app 100% en la nube, sin dependencias locales.
