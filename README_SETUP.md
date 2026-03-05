# BlackyQR — Setup y Deploy Completo

## Instalación Local

```bash
git clone https://github.com/tu-usuario/BlackyQR.git
cd BlackyQR

# Windows
setup.bat

# Linux/macOS
chmod +x setup.sh
./setup.sh

# Manual
npm install
```

Copia `.env.example` a `.env.local` y completa variables.

```bash
npm run dev
```

Abre http://localhost:3000

## Setup Supabase

1. **Crear proyecto:** https://supabase.com
   - Anota URL y API keys (Settings → API Keys)

2. **Ejecutar SQL:** SQL Editor → pega `supabase.sql`
   - Crea: profiles, mascotas, rescate_reports, función cleanup

3. **Crear bucket:** Storage → qrcodes (público)

4. **Generar secretos:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

## Deploy Vercel

```bash
git add .
git commit -m "init"
git push origin main

# Opción 1: CLI
vercel

# Opción 2: Dashboard → Import Project
```

**Environment Variables en Vercel:**
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- ENCRYPTION_SECRET, SMTP_*, ADMIN_EMAIL
- NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_*
- CLEANUP_SECRET

## Programar Limpieza (Vercel Crons)

Project Settings → Crons:
- URL: `https://tu-proyecto.vercel.app/api/cleanup-reports`
- Method: POST
- Cron: `0 * * * *` (cada hora)
- Headers: `x-admin-secret: <CLEANUP_SECRET>`

## Pruebas

```bash
# Crear mascota
curl -X POST http://localhost:3000/api/mascotas/create \
  -H "Content-Type: application/json" \
  -d '{"mascota":{"nombre":"Fluffy"},"owner":{"email":"test@example.com"}}'

# Test limpieza
export CLEANUP_SECRET=tu-secret
npm run test:cleanup
```

## Seguridad Checklist

- ✅ Encriptación AES-256-GCM (datos del dueño)
- ✅ Validación Zod (inputs)
- ✅ Middleware protegido (rutas)
- ✅ HTTPS (Vercel)
- ✅ Consentimiento GPS (explicit)
- ✅ Sin datos sensibles en página pública
- ✅ Reportes con TTL (1 hora)
- ✅ Limpieza automática (cron)
- ✅ Email SMTP protegido (env)
- ✅ API cleanup protegida (CLEANUP_SECRET)

## Estructura

```
app/
├── page.tsx (home)
├── login/, register/ (Supabase Auth)
├── dashboard/, admin/ (protegidas)
├── rescate/[id]/ (pública)
└── api/
    ├── mascotas/create/
    ├── enviar-ubicacion/
    └── cleanup-reports/

lib/
├── supabase.ts (cliente)
├── supabaseClient.ts (admin + crypto)
├── crypto.ts (AES-256)
├── storage.ts (uploads)
└── validation.ts (Zod)
```

## Flujo QR → Rescate → GPS

```
1. Usuario registra mascota
2. Sistema genera QR → /rescate/[id]
3. Quien encuentra escanea QR (página pública, sin datos del dueño)
4. Click "Compartir ubicación" → consentimiento → GPS
5. Email al dueño con ubicación, sin revelar reportante
6. Limpieza automática: borra reportes > 1 hora
```

## Variables Requeridas

Ver `.env.example` para todos. Principales:

```
SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
ENCRYPTION_SECRET (32 bytes base64)
SMTP_HOST=smtp.gmail.com, SMTP_USER, SMTP_PASS
ADMIN_EMAIL=n.ibacache.z@gmail.com
NEXT_PUBLIC_SITE_URL
CLEANUP_SECRET
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

**Recuerda:** Todos los datos sensibles en `.env` y `.env.local`. Nunca expongas keys públicamente.
