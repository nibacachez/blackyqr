
# BlackyQR — Secure Pet QR Platform

Proyecto base seguro (Next.js App Router + TypeScript + Supabase).

Prioridad: privacidad y seguridad (hashing fuerte, validación, encriptación de datos sensibles, consentimiento GPS).

Resumen de implementación:
- Frontend: Next.js App Router + TypeScript + Tailwind CSS.
- Autenticación: recomendado Supabase Auth (no incluido por defecto en scaffold; conectar en production).
- Base de datos: Supabase PostgreSQL — ver `supabase.sql`.

Requisitos de entorno (.env): copia `.env.example` a `.env.local` y completa variables.

Generar secretos recomendados:

1) `ENCRYPTION_SECRET` — 32 bytes base64 (para AES-256-GCM):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

2) `NEXTAUTH_SECRET` (si usas NextAuth):

```bash
openssl rand -base64 32
```

Tablas en Supabase: importar `supabase.sql` en el SQL editor (contiene `profiles`, `mascotas`, `rescate_reports`).

Pasos para preparar Supabase:
1. Crear proyecto en Supabase.
2. En Settings → Database → enable `pgcrypto` extension (para `gen_random_uuid()`) si no existe.
3. Ejecutar el script `supabase.sql` en SQL Editor.
4. Crear bucket `qrcodes` en Storage y marcarlo público si deseas acceso público a las imágenes QR (opcional).
5. Añadir variables de entorno en Vercel / entorno local: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_SECRET`, `SMTP_*`, `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_SECRET`.

Deploy en Vercel (resumen):
1. Crear repo en GitHub y push del proyecto.
2. En Vercel: "Import Project" → seleccionar el repo.
3. Establecer las variables de entorno en Vercel (igual que `.env.example`).
4. Desplegar.

Comandos locales:

```bash
npm install
npm run dev
```

Pruebas recomendadas:

1) Registro/Login: conectar Supabase Auth o NextAuth con provider credentials/magic link. Asegurar hashing (Supabase usa bcrypt/argon2 internamente).
2) Crear mascota (POST a `/api/mascotas/create`): enviar body con `mascota` y `owner` (owner.email se encripta antes de guardar). La ruta devuelve `id` y `qr`.
3) Escanear QR: abrir `/rescate/[id]` — la página pública muestra solo datos no sensibles y un botón para compartir ubicación.
4) Compartir ubicación: desde el navegador de quien encontró la mascota, el botón debe mostrar un mensaje de consentimiento antes de llamar a `navigator.geolocation.getCurrentPosition`. Luego `fetch('/api/enviar-ubicacion', { method: 'POST', body: JSON.stringify({ id, lat, lon }) })`. El servidor guarda el reporte temporalmente y envía un email al dueño (email desencriptado en servidor) sin revelar datos personales del reportante.

Notas de seguridad y privacidad importantes:
- Nunca exponer datos del dueño en la página pública de rescate.
- Encriptar datos sensibles con `ENCRYPTION_SECRET` en el servidor.
- Validar y sanitizar todos los inputs (Zod usado en endpoints); escapar cualquier contenido renderizado.
- Usar HTTPS en producción (Vercel lo proporciona por defecto).
- No almacenar ubicaciones indefinidamente (tabla `rescate_reports` tiene `expires_at`; configurar un job/cron para limpiar registros expirados si es necesario).

Si quieres, continúo con la integración completa de Supabase Auth + ejemplos de llamadas desde el frontend y tests end-to-end.
 
Limpieza automática de reportes (cron):

1) Endpoint: `POST /api/cleanup-reports` — protegido por `x-admin-secret` o `Authorization: Bearer <SERVICE_ROLE_KEY>`.
2) Para programarlo en Vercel: en Project → Settings → Cron Jobs crea una tarea que haga `POST https://<tu-proyecto>.vercel.app/api/cleanup-reports` y añade header `x-admin-secret` igual a `CLEANUP_SECRET` en las Environment Variables de Vercel.
3) Alternativa: usar Supabase Scheduled Functions o un job externo que llame al endpoint.

Test rápido local:

```bash
# exporta variables
export CLEANUP_SECRET=tu-secret
export CLEANUP_URL=http://localhost:3000/api/cleanup-reports
node scripts/cleanup-test.js
```

El script `scripts/cleanup-test.js` hace un POST al endpoint con `x-admin-secret`.

Seguridad del endpoint:
- El endpoint permite solo ejecución por procesos autorizados (CLEANUP_SECRET o `SUPABASE_SERVICE_ROLE_KEY`).
- No exponer el secreto público; usar variables de entorno en Vercel/Supabase.

