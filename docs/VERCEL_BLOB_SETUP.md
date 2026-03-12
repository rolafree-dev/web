# Configuración de Vercel Blob Storage

## ¿Por qué Vercel Blob?

Vercel Blob es el almacenamiento nativo de Vercel. A diferencia del sistema de archivos local (`/public/uploads`), Vercel Blob:
- ✅ Funciona en entornos serverless (sin estado persistente)
- ✅ No se pierde con cada deploy
- ✅ Ofrece CDN global gratuito
- ✅ Integración nativa con Next.js

## Pasos de Configuración

### 1. Enlaza tu proyecto a Vercel Storage

En el dashboard de Vercel:

1. Abre tu proyecto
2. Ve a **Settings** → **Storage**
3. Haz clic en **Create Database**
4. Selecciona **Blob** 
5. Acepta las condiciones y crea el almacenamiento
6. El token se añadirá automáticamente como `BLOB_READ_WRITE_TOKEN`

### 2. Redeploy tu aplicación

Una vez creado Blob, haz un nuevo push a GitHub:

```bash
git add .
git commit -m "Add Vercel Blob Storage integration"
git push origin main
```

Vercel detectará automáticamente el token y lo inyectará en el build.

### 3. Verifica que esté funcionando

Intenta subir una imagen desde el admin:
- Ve a `/admin/login` con contraseña `rolafree2026`
- Ve a `/admin/dashboard` → **Agregar competidor**
- Sube una imagen

Si todo está bien, verás:
- ✅ La imagen se guarda en Vercel Blob
- ✅ Se registra en SQLite con la URL
- ✅ No hay error "upload failed"

### 4. Variables de entorno (Vercel ya las configura)

El token `BLOB_READ_WRITE_TOKEN` es configurado automáticamente por Vercel.  
**No necesitas hacerlo manualmente.**

Puedes verificarlo en:
- **Settings** → **Environment Variables** → busca `BLOB_READ_WRITE_TOKEN`

---

## Endpoints

### POST `/api/upload-vercel`

**Request:**
```
FormData {
  file: File (jpg, png, webp, max 5MB)
}
```

**Response:**
```json
{
  "url": "https://...",
  "id": "uuid",
  "fileName": "image.jpg",
  "uploadDate": "2026-03-12T...",
  "size": 12345
}
```

**Validaciones:**
- Solo acepta: JPG, PNG, WebP
- Máximo 5MB
- Almacena metadata en SQLite


### GET `/api/upload-vercel`

Retorna todas las imágenes subidas:
```json
[
  {
    "id": "uuid",
    "name": "image.jpg",
    "url": "https://...",
    "fileSize": 12345,
    "contentType": "image/jpeg",
    "uploadedBy": "admin",
    "createdAt": "2026-03-12T..."
  }
]
```

---

## Desarrollo local

Para probar localmente **sin Vercel Blob**:

1. No necesitas configurar nada especial
2. El endpoint fallará si intentas subir, pero el rest de la app funciona
3. Una vez hagas deploy a Vercel, automáticamente usará Blob

---

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is missing"

**Solución:** 
- Ve a Vercel Settings → Storage
- Crea un Blob si no existe
- Redeploy el proyecto

### Las imágenes se siguen perdiendo

**Causa:** Estás usando el viejo endpoint `/api/upload` (local)  
**Solución:** Asegúrate de que CompetitorForm usa `/api/upload-vercel`

### Las imágenes están en Blob pero no se muestran

**Causa:** Blob está correctamente configurado, pero Next.js no procesa las imágenes  
**Solución:** Usa el componente `<Image>` de Next.js con `unoptimized` si es necesario

---

## Quotas y precios

**Vercel Blob (plan Pro):**
- Almacenamiento: 100 GB incluidos
- Transferencia: 1 TB/mes incluido
- 5 GB adicionales = $5/mes

Para un proyecto pequeño (20-30 fotos), usarás menos del 1% del plan gratuito.

---

## Referencias

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Blob Integration](https://sdk.vercel.ai/docs/frameworks/next-js#storage)
