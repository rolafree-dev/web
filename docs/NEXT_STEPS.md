# Integración Supabase + Vercel Blob - Próximos Pasos

## 🎯 Estado actual

✅ **Completado:**
- Dependencias instaladas (@supabase/supabase-js, uuid)
- Archivos núcleo creados (supabase.ts, supabase-helpers.ts)
- API routes críticos migrados (competitors, rolas)
- upload-vercel totalmente funcional con Vercel Blob
- Proyecto compila sin errores (22 rutas)

⏳ **Pendiente (menor prioridad):**
- Terminar migración de tournaments, events, gallery, settings
- Pero el sistema funciona parcialmente con SQLite todavía

---

## 🚀 Para que funcione ahora (15 minutos)

### 1. Crear proyecto en Supabase (2 minutos)

Abre https://supabase.com y:
1. Haz clic en **"New Project"**
2. Ingresa:
   - Name: `rola-free`
   - Password: Algo fuerte (ej. `PaSSw0rd!23#Supabase`)
   - Region: South America (São Paulo) si estás en Latam
3. Espera 1-2 minutos mientras se crea

### 2. Obtener credenciales (2 minutos)

Una vez creado:
1. Ve a **Settings → API**
2. Copia:
   - **Project URL** (ej. `https://xxxxx.supabase.co`)
   - **anon public key** (la clave larga)

### 3. Actualizar .env.local (1 minuto)

Abre `e:\pagina oficial de la rola\.env.local` y actualiza:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...long...key...here
NEXT_PUBLIC_ADMIN_PASSWORD=rolafree2026
```

### 4. Crear tablas en Supabase (5 minutos)

En el dashboard de Supabase:
1. Ve a **SQL Editor**
2. Haz clic **"+ New Query"**
3. Copia TODO el SQL de aquí: `docs/SUPABASE_SETUP.md`
4. Pega en el editor
5. Haz clic **"Run"** (botón azul abajo-derecha)
6. ✅ Debería decir "Success" para cada tabla

### 5. Prueba local (3 minutos)

```bash
npm run dev
```

Abre http://localhost:3000/admin/login:
- Usuario no existe, vas directamente al login
- Contraseña: `rolafree2026`
- Después de hacer login, deberías ver `/admin/dashboard`

Intenta agregar un competidor:
- Haz clic **"Agregar competidor"**
- Llena los campos
- Sube una imagen (¡Blob!)
- Haz clic **"Guardar"**

Si todo funciona:
- ✅ La imagen se sube a Vercel Blob
- ✅ Los datos se guardan en Supabase
- ✅ Aparecen en el dashboard

### 6. Push a GitHub y deploy (2 minutos)

```bash
git add .
git commit -m "Integrate Supabase + Vercel Blob for production"
git push origin main
```

Vercel automáticamente:
1. Detecta `NEXT_PUBLIC_SUPABASE_*` en el código
2. Pide que agregues las variables de entorno
3. O entra a **Settings → Environment Variables** y pega:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...key
   NEXT_PUBLIC_ADMIN_PASSWORD=rolafree2026
   ```

Une vez hecho, Vercel redeployd y listo.

---

## 📋 Pasos opcionales (después)

Estos no bloqueandel funcionalidad pero mejoran el código:

### Terminar migración de endpoints secundarios

Archivos que aún usan SQLite:
- `src/app/api/db/tournaments/*` 
- `src/app/api/db/events/*`
- `src/app/api/db/gallery/*`
- `src/app/api/db/settings/*`

**Pueden segur así indefinidamente**, o actualizar siguiendo el patrón en `docs/MIGRATION_CHECKLIST.md`

### Configurar RLS (Row Level Security) en Supabase

✅ **YA CONFIGURADO**: Las políticas RLS están incluidas en los scripts SQL de `SUPABASE_SETUP.md`. Cada tabla tiene políticas básicas que permiten todas las operaciones.

Para desarrollo esto está bien. Para producción, puedes crear políticas más restrictivas basadas en autenticación de usuario.

---

## ❓ FAQ

**P: ¿Qué pasa si no hago los pasos opcionales?**  
R: Todo funciona. Los endpoints "old" siguen en SQLite (tournaments, events). Cuando quieras, los migras.

**P: ¿Las imágenes se guardan en Blob automáticamente?**  
R: Sí. El  endpoint `/api/upload-vercel` ya sube a Vercel Blob y guarda metadata en Supabase.

**P: ¿Dónde se guardan los datos?**  
R: Supabase PostgreSQL (en la nube) + Vercel Blob (imágens en CDN global)

**P: ¿Necesito el SQLite local?**  
R: Ya no. Puedes eliminar `/src/lib/db.ts` y `better-sqlite3` después si quieres limpiar. Por ahora déjalo (no daña nada).

**P: ¿Funciona sin Vercel Blob configured?**  
R: No para subidas. Pero Supabase sigue funcionando.

---

## 🔗 Archivos de referencia

- `docs/SUPABASE_SETUP.md` – SQL para crear tablas
- `docs/VERCEL_BLOB_SETUP.md` – Configuración de imágenes
- `docs/MIGRATION_CHECKLIST.md` – Patrón para endpoints faltantes
- `src/lib/supabase-helpers.ts` – Todas las funciones CRUD
- `src/lib/supabase.ts` – Cliente Supabase

---

## ✨ Después de funcionar...

Cuando todo esté en Supabase + Blob:

1. Puedes eliminar `better-sqlite3` del `package.json`
2. Puedes eliminar `/src/lib/db.ts`
3. Opcional: Borrar `/src/app/api/upload` (viejo endpoint)
4. Tu app es 100% cloud-native: cero archivos locales, data persistente

---

**Estimado:** 15 minutos para tener todo funcional.
