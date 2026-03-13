# Checklist de Migración SQLite → Supabase

Este documento lista todos los cambios que se han hecho y los que aún faltan.

## ✅ COMPLETADOS

### Dependencies
- ✅ `npm install @supabase/supabase-js`
- ✅ `npm install uuid @types/uuid`

### Core Files
- ✅ `src/lib/supabase.ts` - Configuración cliente
- ✅ `src/lib/supabase-helpers.ts` - Funciones CRUD
- ✅ `src/app/api/db/competitors/route.ts` - GET/POST competitors
- ✅ `src/app/api/db/competitors/[id]/route.ts` - GET/PUT/DELETE competitor
- ✅ `src/app/api/db/rolas/route.ts` - GET/POST rolas
- ✅ `src/app/api/db/rolas/[id]/route.ts` - GET/PUT/DELETE rola
- ✅ `src/components/admin/CompetitorForm.tsx` - Cambió a `/api/upload-vercel`
- ✅ `src/app/api/upload-vercel/route.ts` - Ya existe, usa Vercel Blob

### Documentation
- ✅ `docs/SUPABASE_SETUP.md` - Guía completa de setup
- ✅ `docs/VERCEL_BLOB_SETUP.md` - Guía de Blob (ya existía)

---

## ⏳ PENDIENTES (pero funcionales)

Estos endpoints existen y funcionan con SQLite aún, pero son de menor prioridad:

### API Routes que necesitan migración (misma pauta que competitors/rolas):

1. **tournaments**
   - [ ] `src/app/api/db/tournaments/route.ts`
   - [ ] `src/app/api/db/tournaments/[id]/route.ts`
   - Cambio: `import { getTournaments, addTournament, updateTournament, deleteTournament } from '@/lib/supabase-helpers'`

2. **events**
   - [ ] `src/app/api/db/events/route.ts`
   - [ ] `src/app/api/db/events/[id]/route.ts`
   - Cambio: `import { getEvents, addEvent, updateEvent, deleteEvent } from '@/lib/supabase-helpers'`

3. **gallery**
   - [ ] `src/app/api/db/gallery/route.ts`
   - [ ] `src/app/api/db/gallery/[id]/route.ts`
   - Cambio: `import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '@/lib/supabase-helpers'`

4. **settings**
   - [ ] `src/app/api/db/settings/route.ts` (GET/POST)
   - Cambio: `import { getSetting, updateSetting } from '@/lib/supabase-helpers'`

### Componentes que necesitan actualización (minor):

- [ ] Cualquier componente que haga fetch a `/api/db/tournaments`, `/api/db/events`, `/api/db/gallery`
- El patrón es el mismo: `const {data} = await fetch('/api/db/...').then(r => r.json())`
- Estos ya funcionan sin cambios si dejas los endpoints en SQLite temporalmente

---

## Patrón de migración (copia-pega para los faltantes)

Para cada uno de los endpoints pendientes, reemplaza el contenido con este patrón:

### GET + POST (list y create)

```typescript
import { NextResponse, NextRequest } from 'next/server';
import { get[Entity]s, add[Entity] } from '@/lib/supabase-helpers';

export async function GET() {
  try {
    const items = await get[Entity]s();
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await add[Entity](body);
    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Donde `[Entity]` es: Tournament, Event, GalleryImage, etc.

### GET + PUT + DELETE (detail, update, delete)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { get[Entity], update[Entity], delete[Entity] } from '@/lib/supabase-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await get[Entity](params.id);
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(item);
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
    const item = await update[Entity](params.id, body);
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await delete[Entity](params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

---

## Próximos pasos

### Inmediato (para que funcione):

1. **Crea el proyecto Supabase**
   - Ve a supabase.com
   - Crea BD
   - Copia credenciales a `.env.local`

2. **Crea las tablas**
   - Ve a SQL Editor en Supabase
   - Copia-pega todo el SQL de `docs/SUPABASE_SETUP.md`
   - Ejecuta

3. **Prueba**
   ```bash
   npm run dev
   # Ve a /admin/login → /admin/dashboard
   # Intenta agregar un competidor
   ```

### Después (cuando funcione con Competitors/Tournaments):

- Aplica el patrón arriba a los endpoints pendientes
- O simplemente deja SQLite para los secundarios (tournaments, events, gallery) por ahora

---

## Verificación Final

Después de hacer los cambios:

```bash
npm run build
# Debe compilar sin errores

git add .
git commit -m "Migrate from SQLite to Supabase + Vercel Blob"
git push origin main
```

Vercel detectará automáticamente las nuevas variables de entorno y deployará.

---

## FAQ

**P: ¿Puedo dejar tournaments/events/gallery en SQLite por ahora?**  
R: Sí, temporalmente funcionan fine. Migra después cuando tengas tiempo.

**P: ¿Las funciones supabase-helpers ya están escritas?**  
R: Sí, tienes todas las funciones para competitors, rolas, tournaments, events, gallery y settings. Solo falta conectarlas en los endpoints.

**P: ¿Qué pasa si SQLite ya tiene datos?**  
R: Se pierden. Para migrarlos, exporta como JSON y inserta manualmente en Supabase.

**P: ¿Funciona sin hacer todos estos cambios?**  
R: Sí. Competitors y supabase/blob funcionan. Los otros endpoints siguen usando SQLite hasta que los actualices.
